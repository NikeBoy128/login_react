import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import Prueba from './components/Prueba';
import CrearAuto from './components/CrearAuto';
import PrivateRoute from './PrivateRoute';
import PrivateRouteDashboard from './components/PrivateRouteDashboard'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Prueba" element={<PrivateRoute><Prueba /></PrivateRoute>}/>
          <Route path="/CrearAuto" element={<PrivateRoute><CrearAuto /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          <Route path="/" element={<PrivateRouteDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;