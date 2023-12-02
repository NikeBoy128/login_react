import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function CrearUsuario() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
    is_active: false,
    groups: [],
  });
  const [error, setError] = useState('');
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/grupos/');
        setGrupos(response.data);
      } catch (err) {
        setError('Failed to fetch groups');
      }
    };

    fetchGrupos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/', userData);
      console.log(userData);
      // Lógica adicional después de crear el usuario (redireccionamiento, actualización de datos, etc.)
      window.location.reload(); // Recarga la página
    } catch (err) {
      setError('Failed to create item');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    setUserData({ ...userData, [name]: type === 'checkbox' ? e.target.checked : (name === 'groups' ? [val] : val) });

  };


  return (
    <div style={{ height: '100vh' }}>
      <Container fluid>
        <Row style={{ height: '100%' }}>
          <Col sm={3}>
            <Sidebar />
          </Col>
          <Col sm={9}>
            <div className="dashboard-content">
              <div className="container mt-4 shadow-lg p-3 mb-5 bg-body rounded">
                <h2>Crear Nuevo Usuario</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      name="first_name"
                      value={userData.first_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter last name"
                      name="last_name"
                      value={userData.last_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formIsStaff">
                    <Form.Check
                      type="checkbox"
                      label="Is Staff"
                      name="is_staff"
                      checked={userData.is_staff}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formIsActive">
                    <Form.Check
                      type="checkbox"
                      label="Is Active"
                      name="is_active"
                      checked={userData.is_active}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroups">
                    <Form.Label>Groups</Form.Label>
                    <Form.Control
                      as="select"
                      name="groups"
                      value={userData.groups}
                      onChange={handleChange}
                    >
                      <option value="">Select Group</option>
                      {grupos.map((grupo) => (
                        <option key={grupo.id} value={grupo.name}>
                          {grupo.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" onClick={handleSubmit}>Crear</Button>
                </Form>
                {error && <Card.Text>{error}</Card.Text>}
                <Link to="/Usuarios">
                  <Button>Volver a Usuarios</Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
