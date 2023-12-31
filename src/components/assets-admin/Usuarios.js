import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

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

    { name: 'Usuario', selector: 'username' },
    { name: 'Correo electronico', selector: 'email' },
    { name: 'Primer nombre', selector: 'first_name' },
    { name: 'Primer apellido', selector: 'last_name' },
    { name: 'Rol', selector: 'groups' },
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
                title="Usuarios"
                columns={columns}
                data={filteredItems}
                pagination
                paginationPerPage={7} 
                paginationRowsPerPageOptions={[7]} 
                paginationComponentOptions={{
                  rowsPerPageText: 'Filas por página:',
                  rangeSeparatorText: 'de',
                }}
                customStyles={{
                  header: {
                    style: {
                      backgroundColor: 'white',
                      color: 'black',
                      textAlign: 'center',
                    },
                  },
                  rows: {
                    style: {
  
                      marginBottom: '1px',
                      boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.5)',
                      textAlign: 'center',
                    },
                  },
                  cells: {
                    style: {
                      paddingLeft: '15px',
                      paddingRight: '0px',
                    },
                  },
                  pagination: {
                    style: {
                      backgroundColor: 'white', // Fondo rojo para el paginador
                    },
                  },
                  paginationPerPageOption: {
                    style: {
                      color: 'red', // Color del texto de la opción de registros por página
                    },
                  },
                  paginationButton: {
                    style: {
                      color: 'red', // Color de los botones de paginación
                    },
                  },
                }}
              />

                {error && <p>{error}</p>}
                <Link to="/CrearUsuario">
                  <Button>Crear Usuario</Button>
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
              <Form.Label>Editar Usuario</Form.Label>
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
              <Form.Label>Editar correo electronico</Form.Label>
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
              <Form.Label>Editar Primer Nombre</Form.Label>
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
              <Form.Label>Editar Primer Apellido</Form.Label>
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