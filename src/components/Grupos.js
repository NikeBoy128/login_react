import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link desde react-router-dom
import 'bootstrap/dist/css/bootstrap.css';

export default function Grupos() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/grupos/');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/grupos/${id}`);
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
      await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/grupos/${editedData.id}`, editedData);
      const updatedData = data.map(item => (item.id === editedData.id ? editedData : item));
      setData(updatedData);
      setEditedData({});
    } catch (err) {
      setError('Failed to update item');
    }
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
                      <th>name</th>
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
                              value={editedData.name}
                              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                            />
                          ) : (
                            item.name
                          )}
                        </td>
                        <td>
                          {editedData.id === item.id ? (
                            <Button variant="success" onClick={handleUpdate}>Guardar</Button>
                          ) : (
                            <Button variant="warning" onClick={() => handleEdit(item)}>Editar</Button>
                          )}
                          <Button variant="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {error && <Card.Text>{error}</Card.Text>}
                <Link to="/CrearAuto">
                  <Button>Crear Auto</Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
