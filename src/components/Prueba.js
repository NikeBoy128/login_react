import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import Sidebar from "./sidebar";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import DataTable from "react-data-table-component";
import { Modal } from "react-bootstrap";
export default function Prueba() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const filterTimeout = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newData, setNewData] = useState({});

  const columns = [
    { name: "Id", selector: "id" },
    { name: "Marca", selector: "marca" },
    { name: "Cantidad Pasajeros", selector: "cantidad_pasajeros" },
    { name: "Placa", selector: "placa" },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <Button variant="warning" onClick={() => handleEdit(row)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];
  const SubHeaderComponent = () => {
    return (
      <div>
        Buscar:{" "}
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/"
        );
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch data");
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
      await axios.delete(
        `https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${id}`
      );
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    setEditedData(item);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/${editedData.id}`,
        editedData
      );
      const updatedData = data.map((item) =>
        item.id === editedData.id ? editedData : item
      );
      setData(updatedData);
      setEditedData({});
    } catch (err) {
      setError("Failed to update item");
    }
  };
  const handleCreate = () => {
    setNewData({});
    setShowCreateModal(true);
  };
  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `https://backen-diplomado-51d51f42ca0d.herokuapp.com/autos/`,
        newData
      );
      setData([...data, response.data]);
      setNewData({});
      setShowCreateModal(false);
    } catch (err) {
      setError("Failed to create item");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Container fluid>
        <Row style={{ height: "100%" }}>
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
                <Button onClick={() => setShowCreateModal(true)}>
                  Crear Auto
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Auto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group controlId="marca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                value={editedData.marca}
                onChange={(e) =>
                  setEditedData({ ...editedData, marca: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="cantidad_pasajeros">
              <Form.Label>Cantidad Pasajeros</Form.Label>
              <Form.Control
                type="text"
                value={editedData.cantidad_pasajeros}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    cantidad_pasajeros: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="placa">
              <Form.Label>Placa</Form.Label>
              <Form.Control
                type="text"
                value={editedData.placa}
                onChange={(e) =>
                  setEditedData({ ...editedData, placa: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setNewData({}); 
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear Auto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group controlId="marca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                value={newData.marca || ""}
                onChange={(e) =>
                  setNewData({ ...newData, marca: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="cantidad_pasajeros">
              <Form.Label>Cantidad Pasajeros</Form.Label>
              <Form.Control
                type="text"
                value={newData.cantidad_pasajeros || ""}
                onChange={(e) =>
                  setNewData({ ...newData, cantidad_pasajeros: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="placa">
              <Form.Label>Placa</Form.Label>
              <Form.Control
                type="text"
                value={newData.placa || ""}
                onChange={(e) =>
                  setNewData({ ...newData, placa: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Crear
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
