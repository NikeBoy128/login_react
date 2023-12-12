import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import Autos from './components/Autos';
import Usuarios from './components/Usuarios';
import Viajes from './components/Viajes';
import Gastos from './components/Gastos'
import Grupos from './components/Grupos'
import CrearUsuario from './components/CrearUsuario';
import PrivateRoute from './PrivateRoute';
import PrivateRouteDashboard from './components/PrivateRouteDashboard'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Autos" element={<PrivateRoute><Autos /></PrivateRoute>}/>
          <Route path="/Usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>}/>
          <Route path="/Viajes" element={<PrivateRoute><Viajes /></PrivateRoute>}/>
          <Route path="/Gastos" element={<PrivateRoute><Gastos /></PrivateRoute>}/>
          <Route path="/Grupos" element={<PrivateRoute><Grupos /></PrivateRoute>}/>
          <Route path="/CrearUsuario" element={<PrivateRoute><CrearUsuario /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          
          <Route path="/" element={<PrivateRouteDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;