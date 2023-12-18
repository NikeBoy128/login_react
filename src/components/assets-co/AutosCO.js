import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import { Clock } from 'react-bootstrap-icons';
import DataTable from 'react-data-table-component';
import { differenceInDays } from 'date-fns';

export default function AutosCO() {
  const [data, setData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showDifferenceModal, setShowDifferenceModal] = useState(false);
  const [differenceMessage, setDifferenceMessage] = useState('');

  const columns = [
    { name: 'Marca', selector: 'marca' },
    { name: 'Capacidad de pasajeros', selector: 'cantidad_pasajeros' },
    { name: 'Placa', selector: 'placa' },
    { name: 'VENC-Soat', selector: 'soat' },
    { name: 'VENC-Tecno', selector: 'tecnomecanica' },
    {
      name: 'Acciones',
      cell: (row) => (
        <Button variant="info" onClick={() => handleCalculateTime(row.id)}>
          <Clock />
        </Button>
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
  
      if (!autoData) {
        throw new Error(`No se encontraron datos para el Auto ID ${id}.`);
      }
  
      const currentDate = new Date();
      const soatDate = new Date(autoData.soat);
      const tecnomecanicaDate = new Date(autoData.tecnomecanica);
  
      if (isNaN(soatDate.getTime()) || isNaN(tecnomecanicaDate.getTime())) {
        throw new Error('Las fechas son inválidas.');
      }
  
      const diffSOAT = differenceInDays(soatDate, currentDate);
      const diffTecnomecanica = differenceInDays(tecnomecanicaDate, currentDate);
  
      const monthsSOAT = Math.floor(diffSOAT / 30);
      const daysSOAT = diffSOAT % 30;
      const minutesSOAT = Math.floor((diffSOAT % 1) * 24 * 60);
  
      const monthsTecnomecanica = Math.floor(diffTecnomecanica / 30);
      const daysTecnomecanica = diffTecnomecanica % 30;
      const minutesTecnomecanica = Math.floor((diffTecnomecanica % 1) * 24 * 60);
  
      let soatMessage = '';
      let tecnomecanicaMessage = '';
  
      if (diffSOAT < 0) {
        soatMessage = `El SOAT del Auto con Placa ${autoData.placa} ha caducado. Debe renovarlo de inmediato.`;
      } else {
        soatMessage = `Faltan ${monthsSOAT} meses, ${daysSOAT} días y ${minutesSOAT} minutos para la renovación del SOAT para el Auto con la Placa ${autoData.placa}.`;
      }
  
      if (diffTecnomecanica < 0) {
        tecnomecanicaMessage = `La Tecnomecánica para la placa ${autoData.placa} ha caducado. Debe renovarla de inmediato.`;
      } else {
        tecnomecanicaMessage = `Faltan ${monthsTecnomecanica} meses, ${daysTecnomecanica} días y ${minutesTecnomecanica} minutos para la renovación de la Tecnomecánica para la placa ${autoData.placa}.`;
      }
  
      setDifferenceMessage(soatMessage + '\n\n' + tecnomecanicaMessage);
      setShowDifferenceModal(true);
    } catch (error) {
      console.error('Error al calcular la diferencia de tiempo:', error.message);
      alert('Ocurrió un error al calcular la diferencia de tiempo.');
    }
  };
  
  const handleCloseDifferenceModal = () => {
    setShowDifferenceModal(false);
    setDifferenceMessage('');
  };
  

  const handleFilter = () => {
    const searchText = searchInput.toLowerCase();
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
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setData(sortedData);
        setFilteredItems(sortedData);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

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
                  paginationPerPage={7}
                  paginationRowsPerPageOptions={[7]}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Filas por página:',
                    rangeSeparatorText: 'de',
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
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
