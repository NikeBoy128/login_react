
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink,useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
const Sidebar = () => {
  const [user, setUser] = useState(null);
const [error, setError] = useState('');
const [waiting, setWaiting] = useState(false);
const navigate = useNavigate();
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuario_autenticado/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data');
    }
  }

  fetchUserData();
}, []);
const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/signin');
};
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Bienvenido : {user ? user.username : 'Loading...'}
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/Usuarios" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Usuarios</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Autos" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="car">Autos</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Gastos" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="plane">Gastos</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Viajes" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="plane">Viajes</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Grupos" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="plane">Grupos</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            JJplus services 
            <br/>
          <CDBSidebarMenuItem icon="sign-out" onClick={handleLogout}>Logout</CDBSidebarMenuItem>
          </div>
          
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;