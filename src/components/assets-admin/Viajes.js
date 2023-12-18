import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';

export default function Viajes() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newData, setNewData] = useState({});
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [Usuarios, setUsuarios] = useState([]);
  const [autos, setAutos] = useState([]);

  const columns = [
    { name: 'Id', selector: 'id'}, 
    { name: 'Conductor', selector: 'conductor', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Conductor'
    { name: 'Origen', selector: 'origen', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Origen'
    { name: 'Destino', selector: 'destino', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Destino'
    { name: 'Fecha de salida', selector: 'fecha', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Fecha'
    { name: 'Hora', selector: 'hora', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Hora'
    { name: 'Auto', selector: 'auto', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Auto'
    { name: 'Gastos totales', selector: 'total', minWidth: '20px' }, // Establece un ancho mínimo para la columna 'Gastos Totales'
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
      minWidth: '20px', // Establece un ancho mínimo para la columna 'Acciones'
    },
  ];
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuarios/');
        setUsuarios(response.data);
      } catch (err) {
        setError('Failed to fetch Usuarios');
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchAutos = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/');
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
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/');
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
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/${id}`);
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
        await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/${editedData.id}`, editedData);
        const updatedData = data.map((item) => (item.id === editedData.id ? editedData : item));
        setData(updatedData);
        setFilteredItems(updatedData);
      } else {
        const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/', newData);
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
                  title="Viajes"
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
                <Button onClick={() => handleModal('create')}>Crear Viaje</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editedData.id ? 'Editar Viaje' : 'Crear Nuevo Viaje'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="Conductor">
              <Form.Label>Conductor</Form.Label>
              <Form.Control
                as="select"
                value={editedData.conductor || newData.conductor || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, conductor: e.target.value });
                  } else {
                    setNewData({ ...newData, conductor: e.target.value });
                  }
                }}
              >
                <option value="">Seleccionar un Conductor</option>
                {Usuarios.filter((usuario) => usuario.groups.includes('Conductor')).map((viaje) => (
                  <option key={viaje.id} value={viaje.id}>
                    {viaje.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="origen">
              <Form.Label>Origen</Form.Label>
              <Form.Control
                type="text"
                value={editedData.origen || newData.origen || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, origen: e.target.value });
                  } else {
                    setNewData({ ...newData, origen: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="destino">
              <Form.Label>Destino</Form.Label>
              <Form.Control
                type="text"
                value={editedData.destino || newData.destino || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, destino: e.target.value });
                  } else {
                    setNewData({ ...newData, destino: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="fecha">
              <Form.Label>Fecha de salida</Form.Label>
              <Form.Control
                type="date"
                value={editedData.fecha || newData.fecha || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, fecha: e.target.value });
                  } else {
                    setNewData({ ...newData, fecha: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="hora">
              <Form.Label>hora</Form.Label>
              <Form.Control
                type="time"
                value={editedData.hora || newData.hora || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, hora: e.target.value });
                  } else {
                    setNewData({ ...newData, hora: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="Auto">
              <Form.Label>Auto</Form.Label>
              <Form.Control
                as="select"
                value={editedData.auto || newData.auto || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, auto: e.target.value });
                  } else {
                    setNewData({ ...newData, auto: e.target.value });
                  }
                }}
              >
                <option value="">Selecciona un Auto</option>
                {autos.map((auto) => (
                  <option key={auto.id} value={auto.id}>
                    {auto.placa}
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