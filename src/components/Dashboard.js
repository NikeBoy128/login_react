import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import {Card, Button, Alert} from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  
  const {logout} = useAuth()
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate()
  const verbose = true;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://backen-diplomado-51d51f42ca0d.herokuapp.com/usuario_autenticado/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    }

    fetchUserData();
  }, []);

  function handleLogout(){
    setWaiting(true)
    try {
      logout()
      navigate('/signin')
    } catch (err){
      setError(verbose ? err.message : 'Failed created the account')
    }
    setWaiting(false)
  }

  return (
    <>
      <h2 className='text-center mb-2'>Dashboard</h2>
      {error && <Alert variant='danger'>{error}</Alert>}

      <Card>
        <Card.Body>
          <h3 className='text-center mb-2'>Welcome back : {user ? user.username : 'Loading...'}</h3>
          <h3 className='text-center mb-2'>Email : {user ? user.email : 'Loading...'}</h3>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Button variant='link' disabled={waiting} onClick={handleLogout}>Log out</Button>
      </div>
    </>
  )
}