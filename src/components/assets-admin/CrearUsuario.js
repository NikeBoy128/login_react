import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserHistory } from 'history'; // Importa createBrowserHistory para redirigir

const history = createBrowserHistory();

export default function CrearUsuario() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    groups: [],
  });
  const [error, setError] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [newItem, setNewItem] = useState({});
  const [data, setData] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/', userData);
      console.log(userData);
      fetchData(); // Actualizar la lista después de agregar el nuevo elemento
      setUserData({ // Limpiar los campos del formulario
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        groups: [],
      });
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
          <Col sm={4}>
            <Sidebar />
          </Col>
          <Col md={5}>
            <div className="shadow-lg p-3 mb-5 bg-body rounded">
              <h2 className="text-center mb-4">Crear Nuevo Usuario</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-1" controlId="formUsername">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresar Usuario"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formEmail">
                  <Form.Label>Correro Electronico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresar Correo electronico"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formFirstName">
                  <Form.Label>Primer Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ingresar Primer Nombre"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formLastName">
                  <Form.Label>Primer Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresar Primer Apellido"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresar Contraseña"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formGroups">
                  <Form.Label>Asignar Rol</Form.Label>
                  <Form.Control
                    as="select"
                    name="groups"
                    value={userData.groups}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                      setUserData({ ...userData, groups: selectedOptions });
                    }}
                  >
                    <option value="">Seleccionar Rol</option>
                    {grupos.map((grupo) => (
                      <option key={grupo.id} value={grupo.name}>
                        {grupo.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Link to="/Usuarios">
                  <Button variant="primary" onClick={handleSubmit}>Crear</Button>
                </Link>{" "}
                <Link to="/Usuarios">
                  <Button>Volver a Usuarios</Button>
                </Link>
              </Form>
              {error && <Card.Text>{error}</Card.Text>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
