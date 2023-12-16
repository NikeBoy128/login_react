import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import '../css/sidebar.css';

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')) || null);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuario_autenticado/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const storedSidebarState = localStorage.getItem('sidebarExpanded');
    if (storedSidebarState) {
      setIsExpanded(storedSidebarState === 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/signin');
  };

  const getIconForRoute = (route) => {
    switch (route) {
      case 'Usuarios':
        return 'user';
      case 'Autos':
        return 'car';
      case 'Gastos', 'GastosCO':
        return 'money-bill-wave';
      case 'Gastos':
        return 'money-bill-wave';
      case 'Viajes', 'ViajesCO':
        return 'plane';
      case 'Viajes':
        return 'plane';
      case 'Grupos':
        return 'user-circle';
      default:
        return ''; // Puedes retornar un ícono predeterminado si no hay coincidencia
    }
  };

  const roleBasedRoutes = {
    Admin: ['Usuarios', 'Autos', 'Gastos', 'Viajes', 'Grupos'],
    Conductor: ['GastosCO', 'ViajesCO'],
    Prueba: ['Viajes'],
  };


  const accessibleRoutes = Object.entries(roleBasedRoutes)
    .filter(([role]) => user && user.roles.includes(role))
    .flatMap(([_, routes]) => routes);

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', isExpanded);
  }, [isExpanded]);

  return (
    
    <div style={{ position: 'absolute', height: '99%' }}>
      <CDBSidebar expanded={isExpanded}
        onExpanded={(val) => setIsExpanded(val)}>
        <CDBSidebarHeader
          prefix={<i className="fa fa-bars fa-large" onClick={() => setIsExpanded(!isExpanded)}></i>}
        >
          <div to="/" className="horizontal">
            {user ? `Welcome, ${user.username}` : 'Loading...'}
          </div>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content" style={{ flexGrow: '1' }}>
          <CDBSidebarMenu style={{ flexDirection: 'row' }}>
            {accessibleRoutes.map((route) => (
              <NavLink key={route} to={`/${route}`} className="link" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon={getIconForRoute(route)}>{route}</CDBSidebarMenuItem>
              </NavLink>
            ))}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter>
          <CDBSidebarMenuItem icon="user-circle" onClick={handleLogout}>
            Logout
          </CDBSidebarMenuItem>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;