import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from './sidebar';
import { useHistory } from 'react-router-dom'; // Importa useHistory para la redirección
import 'bootstrap/dist/css/bootstrap.css';
import { createBrowserHistory } from 'history'; // Importa createBrowserHistory para redirigir

const history = createBrowserHistory();

export default function CrearAuto() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newItem, setNewItem] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${id}`);
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
      await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${editedData.id}`, editedData);
      const updatedData = data.map(item => (item.id === editedData.id ? editedData : item));
      setData(updatedData);
      setEditedData({});
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/`, newItem);
      fetchData(); // Actualizar la lista después de agregar el nuevo elemento
      setNewItem({}); // Limpiar el formulario después de agregar
      history.push('/Prueba'); // Redirige a la ruta '/Prueba'
      window.location.reload(); // Recarga la página
    } catch (err) {
      setError('Failed to create item');
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
                <Form>
                  <Form.Group controlId="marca">
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la marca"
                      value={newItem.marca || ''}
                      onChange={(e) => setNewItem({ ...newItem, marca: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="cantidad_pasajeros">
                    <Form.Label>Cantidad Pasajeros</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la cantidad de pasajeros"
                      value={newItem.cantidad_pasajeros || ''}
                      onChange={(e) => setNewItem({ ...newItem, cantidad_pasajeros: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="placa">
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la placa"
                      value={newItem.placa || ''}
                      onChange={(e) => setNewItem({ ...newItem, placa: e.target.value })}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleCreate}>Crear</Button>
                </Form>
                <hr />
                <table className="table table-bordered table-striped">
                  {/* Resto del código para mostrar la tabla */}
                </table>
                {error && <Card.Text>{error}</Card.Text>}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
