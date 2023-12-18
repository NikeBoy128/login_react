import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { Newspaper, PencilSquare, Trash } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';

export default function Gastos() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [newData, setNewData] = useState({});
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = React.useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [viajes, setViajes] = useState([]);
  const customNoDataComponent = () => <span>No hay registros para mostrar</span>;


  const columns = [

    { name: 'Descripcion', selector: 'descripcion' },
    { name: 'Valor', selector: 'monto' },
    { name: 'Viaje', selector: 'viaje' },
    {
      name: 'Soporte de Gasto',
      selector: 'imagen',
      cell: (row) => (
        <div>
          <img src={row.imagen} alt="imagen" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      ),
    },
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
    const fetchViajes = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/');
        setViajes(response.data);
      } catch (err) {
        setError('Failed to fetch viajes');
      }
    };

    fetchViajes();
  }, []);

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
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/gastos/');
        setData(response.data);
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setData(sortedData);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.descripcion.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [data, filterText]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/gastos/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleModal = (action, item = {}) => {
    if (action === 'edit') {
      setEditedData(item);
      setShowModal(true);
    } else if (action === 'create') {
      setNewData({});
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const handleModalClose = () => {
    setEditedData({});
    setNewData({});
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      if (editedData.id) {
        let updatedData = editedData;
        if (editedData.imagen && editedData.imagen instanceof File) {
          const formData = new FormData();
          formData.append('imagen', editedData.imagen); // Asegúrate de que newData.imagen sea un archivo
          formData.append('monto', editedData.monto);
          formData.append('viaje', editedData.viaje);
          formData.append('descripcion', editedData.descripcion);

          const response = await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/gastos/${editedData.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          updatedData = { ...editedData, imagen: response.data.imagen };
        }

        await axios.put(`https://backen-diplomado-51d51f42ca0d.herokuapp.com/gastos/${editedData.id}`, updatedData);
        const updatedGastos = data.map((item) => (item.id === editedData.id ? updatedData : item));
        setData(updatedGastos);
      } else {
        const formData = new FormData();
        formData.append('imagen', newData.imagen);
        formData.append('monto', newData.monto);
        formData.append('viaje', newData.viaje);
        formData.append('descripcion', newData.descripcion);

        const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/gastos/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setData([...data, response.data]);
      }
      handleModalClose();
    } catch (err) {
      setError('Failed to save item');
    }
  };

  const calculateTotalByViaje = (viajeId) => {
    const gastosByViaje = data.filter((gasto) => gasto.viaje === viajeId);
    const totalMonto = gastosByViaje.reduce((total, gasto) => {
      return total + parseFloat(gasto.monto);
    }, 0);
    return totalMonto.toFixed(2);
  };

  return (
    <div style={{ height: '100vh' }}>
      <Container fluid>
        <Row style={{ height: '100%' }}>
          <Col sm={4}>
            <Sidebar />
          </Col>
          <Col sm={7}>
            <div className="dashboard-content">
              <div className="container mt-4 shadow-lg p-3 mb-5 bg-body rounded">

                <DataTable
                  title="Gastos"
                  columns={columns}
                  data={filteredItems}
                  pagination
                  paginationPerPage={3}
                  paginationRowsPerPageOptions={[3]}
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
                <Button onClick={() => handleModal('create')}>Crear Gasto</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editedData.id ? 'Editar Gasto' : 'Crear Nuevo Gasto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="descripcion">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresar descripcion del gasto"
                value={editedData.descripcion || newData.descripcion || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, descripcion: e.target.value });
                  } else {
                    setNewData({ ...newData, descripcion: e.target.value });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="monto">
              <Form.Label>Ingresar Valor</Form.Label>
              <Form.Control
                type="text"
                value={editedData.monto || newData.monto || ''}
                onChange={(e) => {
                  const inputMonto = parseFloat(e.target.value);
                  const formattedMonto = inputMonto.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP' // Cambia 'COP' por el código de la moneda que desees
                  });

                  if (editedData.id) {
                    setEditedData({ ...editedData, monto: inputMonto });
                  } else {
                    setNewData({ ...newData, monto: inputMonto });
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="viaje">
              <Form.Label>Viaje</Form.Label>
              <Form.Control
                as="select"
                value={editedData.viaje || newData.viaje || ''}
                onChange={(e) => {
                  if (editedData.id) {
                    setEditedData({ ...editedData, viaje: e.target.value });
                  } else {
                    setNewData({ ...newData, viaje: e.target.value });
                  }
                }}
              >
                <option value="">Selecciona un viaje</option>
                {viajes.map((viaje) => (
                  <option key={viaje.id} value={viaje.id}>
                    {`${viaje.fecha} - ${viaje.origen} - ${viaje.destino} - ${viaje.conductor} - ${viaje.auto}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="imagen">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    if (editedData.id) {
                      setEditedData({ ...editedData, imagen: file });
                    } else {
                      setNewData({ ...newData, imagen: file });
                    }
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