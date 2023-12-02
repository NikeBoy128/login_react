import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import DataTable from 'react-data-table-component';

export default function Autos() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newData, setNewData] = useState({});
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { name: 'Id', selector: 'id' },
    { name: 'Marca', selector: 'marca' },
    { name: 'Cantidad Pasajeros', selector: 'cantidad_pasajeros' },
    { name: 'Placa', selector: 'placa' },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <Button variant="warning" onClick={() => handleModal('edit', row)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const SubHeaderComponent = () => (
    <div>
      Buscar:{' '}
      <input
        type="text"
        value={filterText}
        onChange={(e) => {
          clearTimeout(filterTimeout.current);
          filterTimeout.current = setTimeout(() => setFilterText(e.target.value), 300);
        }}
      />
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.marca.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [data, filterText]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleModal = (action, item = {}) => {
    if (action === 'edit') {
      setEditedData(item);
    } else {
      setNewData({});
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditedData({});
    setNewData({});
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      if (editedData.id) {
        await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${editedData.id}`, editedData);
        const updatedData = data.map((item) => (item.id === editedData.id ? editedData : item));
        setData(updatedData);
      } else {
        const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/', newData);
        setData([...data, response.data]);
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to save item');
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
                <DataTable
                  title="Autos"
                  columns={columns}
                  data={filteredItems}
                  pagination
                  subHeader
                  subHeaderComponent={<SubHeaderComponent />}
                />
                {error && <p>{error}</p>}
                <Button onClick={() => handleModal('create')}>Crear Auto</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editedData.id ? 'Editar Auto' : 'Crear Nuevo Auto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="marca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                value={editedData.marca || newData.marca || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, marca: e.target.value });
                  } else {
                    setNewData({ ...newData, marca: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="cantidad_pasajeros">
              <Form.Label>Cantidad Pasajeros</Form.Label>
              <Form.Control
                type="text"
                value={editedData.cantidad_pasajeros || newData.cantidad_pasajeros || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, cantidad_pasajeros: e.target.value });
                  } else {
                    setNewData({ ...newData, cantidad_pasajeros: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="placa">
              <Form.Label>Placa</Form.Label>
              <Form.Control
                type="text"
                value={editedData.placa || newData.placa || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, placa: e.target.value });
                  } else {
                    setNewData({ ...newData, placa: e.target.value });
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            {editedData.id ? 'Guardar' : 'Crear'}
          </Button>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
