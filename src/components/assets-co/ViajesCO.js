import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import Sidebar from '../sidebar/sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import DataTable from 'react-data-table-component';

export default function ViajesCO() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [Usuarios, setUsuarios] = useState([]);
  const [autos, setAutos] = useState([]);

  const columns = [

    { name: 'Conductor', selector: 'conductor' },
    { name: 'Origen', selector: 'origen' },
    { name: 'Destino', selector: 'destino' },
    { name: 'Fecha', selector: 'fecha' },
    { name: 'Hora', selector: 'hora' },
    { name: 'Auto', selector: 'auto' },
    { name: 'Total', selector: 'total' },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/viajes/');
        setData(response.data);
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
              <div className="container mt-4 shadow-lg p-3 mb-5">
                <DataTable
                  title="Autos"
                  columns={columns}
                  data={data}
                  pagination
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
