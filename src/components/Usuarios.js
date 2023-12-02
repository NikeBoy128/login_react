import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { PencilSquare, Trash, Save, X } from 'react-bootstrap-icons'; // Importa los iconos necesarios
import Sidebar from './sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';


export default function Usuarios() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [grupos, setGrupos] = useState([]); // Agrega estado para los grupos
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

  const columns = [
    { name: 'Username', selector: 'username' },
    { name: 'Email', selector: 'email' },
    { name: 'First Name', selector: 'first_name' },
    { name: 'Last Name', selector: 'last_name' },
    { name: 'Group', selector: 'groups' },
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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    setUserData({ ...userData, [name]: type === 'checkbox' ? e.target.checked : (name === 'groups' ? [...userData.groups, val] : val) });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/');
        setData(response.data);
        const gruposResponse = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/grupos/');
        setGrupos(gruposResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.username.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [data, filterText]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleModal = (action, item = {}) => {
    if (action === 'edit') {
      setEditedData(item);
      setUserData({ ...item, groups: item.groups.length > 0 ? item.groups[0].name : '' });
    } else {
      setUserData({ groups: '' });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditedData({});
    setUserData({});
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      if (editedData.id) {
        await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/${editedData.id}`, editedData);
        const updatedData = data.map((item) => (item.id === editedData.id ? editedData : item));
        setData(updatedData);
      } else {
        const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/', userData);
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
                  title="Usuarios"
                  columns={columns}
                  data={filteredItems}
                  pagination
                  subHeader
                  subHeaderComponent={<SubHeaderComponent />}
                />
                {error && <p>{error}</p>}
                <Link to="/CrearUsuario">
                  <Button>
                    <PencilSquare />
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editedData.id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editedData.username || userData.username || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, username: e.target.value });
                  } else {
                    setUserData({ ...userData, username: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editedData.email || userData.email || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, email: e.target.value });
                  } else {
                    setUserData({ ...userData, email: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editedData.first_name || userData.first_name || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, first_name: e.target.value });
                  } else {
                    setUserData({ ...userData, first_name: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="last_name"
                value={editedData.last_name || userData.last_name || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, last_name: e.target.value });
                  } else {
                    setUserData({ ...userData, last_name: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="groups">
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            <Save /> {editedData.id ? 'Guardar' : 'Crear'}
          </Button>
          <Button variant="secondary" onClick={handleModalClose}>
            <X /> Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
