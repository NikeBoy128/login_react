import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import DataTable from 'react-data-table-component';

export default function ViajesCO() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedConductor, setSelectedConductor] = useState('');
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/');
        setData(response.data);
        // Obtenemos todos los conductores
        const allConductores = response.data.map((viaje) => viaje.conductor);
        // Eliminamos los duplicados y ordenamos alfabéticamente
        const uniqueConductores = Array.from(new Set(allConductores)).sort();
        setConductores(uniqueConductores);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const columns = [
    { name: 'Id', selector: 'id' },
    { name: 'Conductor', selector: 'conductor' },
    { name: 'Origen', selector: 'origen' },
    { name: 'Destino', selector: 'destino' },
    { name: 'Fecha', selector: 'fecha' },
    { name: 'Hora', selector: 'hora' },
    { name: 'Auto', selector: 'auto' },
    { name: 'Total', selector: 'total' },
  ];

  const filteredItems = selectedConductor
    ? data.filter((item) => item.conductor === selectedConductor)
    : data;

  const handleSelectConductor = (e) => {
    setSelectedConductor(e.target.value);
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
              <div className="container mt-3 shadow-lg p-3 mb-5">
                
                <DataTable
                  title="Viajes"
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
                        backgroundColor: 'white',
                      },
                    },
                    paginationPerPageOption: {
                      style: {
                        color: 'red',
                      },
                    },
                    paginationButton: {
                      style: {
                        color: 'red',
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
    </div>
  );
}
