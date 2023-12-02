import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

export default function Usuarios() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setEditedData(item);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/${editedData.id}`, editedData);
      const updatedData = data.map(item => (item.id === editedData.id ? editedData : item));
      setData(updatedData);
      setEditedData({});
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleCancelEdit = () => {
    setEditedData({});
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
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>username</th>
                      <th>email</th>
                      <th>first_name</th>
                      <th>last_name</th>
                      <th>Group</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          {editedData.id === item.id ? (
                            <Form.Control
                              type="text"
                              value={editedData.username}
                              onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                            />
                          ) : (
                            item.username
                          )}
                        </td>
                        <td>
                          {editedData.id === item.id ? (
                            <Form.Control
                              type="text"
                              value={editedData.email}
                              onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            />
                          ) : (
                            item.email
                          )}
                        </td>
                        <td>
                          {editedData.id === item.id ? (
                            <Form.Control
                              type="text"
                              value={editedData.first_name}
                              onChange={(e) => setEditedData({ ...editedData, first_name: e.target.value })}
                            />
                          ) : (
                            item.first_name
                          )}
                        </td>
                        <td>
                          {editedData.id === item.id ? (
                            <Form.Control
                              type="text"
                              value={editedData.last_name}
                              onChange={(e) => setEditedData({ ...editedData, last_name: e.target.value })}
                            />
                          ) : (
                            item.last_name
                          )}
                        </td>
                        <td>
                          {editedData.id === item.id ? (
                            <Form.Control
                              type="text"
                              value={editedData.groups}
                              onChange={(e) => setEditedData({ ...editedData, groups: e.target.value })}
                            />
                          ) : (
                            item.groups
                          )}
                        </td>
                        <td>
                          {editedData.id === item.id ? (
                            <div>
                              <Button variant="success" onClick={handleUpdate}>Guardar</Button>
                              <Button variant="secondary" onClick={handleCancelEdit} style={{ marginLeft: '5px' }}>
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Button variant="warning" onClick={() => handleEdit(item)}>Editar</Button>
                              <Button variant="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {error && <Card.Text>{error}</Card.Text>}
                <Link to="/CrearUsuario">
                  <Button>Crear Usuario</Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
