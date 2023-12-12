import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';

export default function Usuarios() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newData, setNewData] = useState({});
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [Autos, setAutos] = useState([]);

  const columns = [
    { name: 'Id', selector: 'id' },
    { name: 'username', selector: 'username' },
    { name: 'email', selector: 'email' },
    { name: 'first_name', selector: 'first_name' },
    { name: 'last_name', selector: 'last_name' },
    { name: 'groups', selector: 'groups' },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <Button variant="warning" onClick={() => handleModal('edit', row)}>
            <PencilSquare />
          </Button>&nbsp;
          <Button variant="danger" onClick={() => handleDelete(row.id)}>
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchAutos = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/grupos/');
        setAutos(response.data);
      } catch (err) {
        setError('Failed to fetch Usuarios');
      }
    };

    fetchAutos();
  }, []);

  const handleFilterChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const handleFilter = () => {
    const searchText = searchInput.toLowerCase();
    setFilterText(searchText);

    const filtered = data.filter(
      (item) =>
        item.origen.toLowerCase().includes(searchText)
    );

    setFilteredItems(filtered);
  };

  const SubHeaderComponent = () => (
    <div>
      Buscar:{' '}
      <input
        type="text"
        value={searchInput}
        onChange={handleFilterChange}
        onBlur={handleFilter}
        onKeyPress={handleKeyPress}
      />
    </div>
  );

  useEffect(() => {
    if (searchInput.length > 0) {
      handleFilter();
    } else {
      setFilteredItems(data);
    }
  }, [searchInput, data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/');
        setData(response.data);
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setData(sortedData);
        setFilteredItems(sortedData);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/${id}`);
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      setFilteredItems(updatedData);
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
        await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/${editedData.id}`, editedData);
        const updatedData = data.map((item) => (item.id === editedData.id ? editedData : item));
        setData(updatedData);
        setFilteredItems(updatedData);
      } else {
        const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/', newData);
        setData([...data, response.data]);
        setFilteredItems([...filteredItems, response.data]);
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
                <Button onClick={() => handleModal('create')}>Crear Viaje</Button>
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
            <Form.Group controlId="username">
              <Form.Label>username</Form.Label>
              <Form.Control
                type="text"
                value={editedData.username || newData.username || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, username: e.target.value });
                  } else {
                    setNewData({ ...newData, username: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>email</Form.Label>
              <Form.Control
                type="text"
                value={editedData.email || newData.email || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, email: e.target.value });
                  } else {
                    setNewData({ ...newData, email: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="first_name">
              <Form.Label>first_name</Form.Label>
              <Form.Control
                type="text"
                value={editedData.first_name || newData.first_name || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, first_name: e.target.value });
                  } else {
                    setNewData({ ...newData, first_name: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>last_name</Form.Label>
              <Form.Control
                type="text"
                value={editedData.last_name || newData.last_name || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, last_name: e.target.value });
                  } else {
                    setNewData({ ...newData, last_name: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="groups">
              <Form.Label>groups</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={editedData.groups || newData.groups || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                  if (editedData.groups) {
                    setEditedData({ ...editedData, groups: selectedOptions });
                  } else {
                    setNewData({ ...newData, groups: selectedOptions });
                  }
                }}
              >
                {Autos.map((auto) => (
                  <option key={auto.id} value={auto.id}>
                    {auto.name}
                  </option>
                ))}
              </Form.Control>
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