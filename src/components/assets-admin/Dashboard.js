import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';

export default function Dashboard() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();
  const verbose = true;

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
    };

    fetchUserData();
  }, []);

  function handleLogout() {
    setWaiting(true);
    try {
      logout();
      navigate('/signin');
    } catch (err) {
      setError(verbose ? err.message : 'Failed created the account');
    }
    setWaiting(false);
  }

  return (
<div style={{ height: '100%' }}>
      <Container fluid>
        <Row style={{ height: '100%' }}>
        <Col sm={3}>
            <Sidebar />
          </Col>
          <Col sm={9}>
          <div className="dashboard-content"> {/* Ajusta el margen superior */}
              <Card>
                <Card.Body>
                  <h2 className='text-center mb-4 display-4'>Usuario Logeado</h2>
                  {error && <Alert variant='danger'>{error}</Alert>}
                  <h3 className='text-center mb-3'>Welcome back: {user ? user.username : 'Loading...'}</h3>
                  <h3 className='text-center mb-3'>Email: {user ? user.email : 'Loading...'}</h3>
                  <h3 className='text-center mb-3'>Roles: {user ? user.roles : 'Loading...'}</h3>
                  <div className='text-center mt-4'>
                  
                  </div>
                </Card.Body>
              </Card>
            </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
}
