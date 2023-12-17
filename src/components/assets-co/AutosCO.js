import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { PencilSquare, Trash, Clock  } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { differenceInDays } from 'date-fns';

export default function AutosCO() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newData, setNewData] = useState({});
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showDifferenceModal, setShowDifferenceModal] = useState(false);
  const [differenceMessage, setDifferenceMessage] = useState('');

  const columns = [

    { name: 'Marca', selector: 'marca' },
    { name: 'Cantidad Pasajeros', selector: 'cantidad_pasajeros' },
    { name: 'Placa', selector: 'placa' },
    { name: 'VENC-SOAT', selector: 'soat' },
    { name: 'VENC-TECNO', selector: 'tecnomecanica' },
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <Button variant="info" onClick={() => handleCalculateTime(row.id)}>
          <Clock  />
    </Button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const handleCalculateTime = async (id) => {
    try {
      const autoData = data.find((auto) => auto.id === id);
  
      if (autoData) {
        const currentDate = new Date();
        const soatDate = new Date(autoData.soat);
        const tecnomecanicaDate = new Date(autoData.tecnomecanica);
  
        const daysDifferenceSOAT = differenceInDays(soatDate, currentDate);
        const daysDifferenceTecnomecanica = differenceInDays(tecnomecanicaDate, currentDate);
  
        const soatMessage = `Faltan ${daysDifferenceSOAT} días para la renovación del SOAT para el Auto con la Placa ${autoData.placa}.`;
        const tecnomecanicaMessage = `Faltan ${daysDifferenceTecnomecanica} días para la renovación de la Tecnomecánica para la placa ${autoData.placa}.`;

        setDifferenceMessage(`${soatMessage}\n${tecnomecanicaMessage}`);
        setShowDifferenceModal(true);
      } else {
        alert(`No se encontraron datos para el Auto ID  ${autoData.placa}.`);
      }
    } catch (error) {
      console.error('Error al calcular la diferencia de tiempo:', error);
      alert('Ocurrió un error al calcular la diferencia de tiempo.');
    }
  };

  const handleCloseDifferenceModal = () => {
    setShowDifferenceModal(false);
    setDifferenceMessage('');
  };

  const handleFilter = () => {
    const searchText = searchInput.toLowerCase();
    setFilterText(searchText);

    const filtered = data.filter(
      (item) =>
        item.marca.toLowerCase().includes(searchText) ||
        item.cantidad_pasajeros.toLowerCase().includes(searchText) ||
        item.placa.toLowerCase().includes(searchText)
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
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/');
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
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${id}`);
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
        await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${editedData.id}`, editedData);
        const updatedData = data.map((item) => (item.id === editedData.id ? editedData : item));
        setData(updatedData);
        setFilteredItems(updatedData);
      } else {
        const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/', newData);
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
          <Col sm={3} >
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
                paginationPerPage={5} // Mostrar solo 5 registros por página
                paginationRowsPerPageOptions={[5]} // Opciones de registros por página solo con 5
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
            <Form.Group controlId="soat">
              <Form.Label>Venc-Soat</Form.Label>
              <Form.Control
                type="date"
                value={editedData.soat || newData.soat || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, soat: e.target.value });
                  } else {
                    setNewData({ ...newData, soat: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="tecnomecanica">
              <Form.Label>Venc-Tecnomecatica</Form.Label>
              <Form.Control
                type="date"
                value={editedData.tecnomecanica || newData.tecnomecanica || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, tecnomecanica: e.target.value });
                  } else {
                    setNewData({ ...newData, tecnomecanica: e.target.value });
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
      <Modal show={showDifferenceModal} onHide={handleCloseDifferenceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Renovación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{differenceMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDifferenceModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}