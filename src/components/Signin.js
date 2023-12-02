import React, { useRef, useState, useContext } from 'react';
import {Card, Form, Button, Alert} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Container } from 'react-bootstrap';


export default function Signin() {
  
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const {signin} = useAuth();
  const navigate = useNavigate();
  const verbose = true;

  
  async function submitHandler(e) {
    e.preventDefault();
    setWaiting(true);
  
    try {
      const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/api/token/', {
        username: emailRef.current.value,
        password: passwordRef.current.value,
      });
  
      if (response.data.access) {
        // Guarda el token en el local storage o en el contexto
        localStorage.setItem('token', response.data.access);
        navigate('/dashboard');
      } else {
        setError('Failed to sign in');
      }
    } catch (err) {
      setError(verbose ? err.message : 'Failed to sign in');
    }
  
    setWaiting(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <Card>
          <Card.Body>
            <h3 className='text-center mb-2'>Sign In</h3>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={submitHandler}>
              <Form.Group id='email'>
                <Form.Label>Usuario</Form.Label>
                <Form.Control type='text' ref={emailRef} required></Form.Control>
              </Form.Group>
              <Form.Group id='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' ref={passwordRef} required></Form.Control>
              </Form.Group>
              <Button type='submit' className='w-100 mt-2' disabled={waiting}>Sign In</Button>
            </Form>
          </Card.Body>
        </Card>
        <div className='w-100 text-center mt-2'>
          Don't have an account yet ? <Link to='/signup'>Sign Up</Link> instead.
        </div>
      </div>
    </Container>
  );
}