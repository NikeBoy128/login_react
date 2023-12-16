import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext';
import Signup from './components/login/Signup';
import Signin from './components/login/Signin';
import Dashboard from './components/assets-admin/Dashboard';
import Autos from './components/assets-admin/Autos';
import Usuarios from './components/assets-admin/Usuarios';
import Viajes from './components/assets-admin/Viajes';
import ViajesCO from './components/assets-co/ViajesCO';
import Gastos from './components/assets-admin/Gastos';
import GastosCO from './components/assets-co/GastosCO';
import Grupos from './components/assets-admin/Grupos';
import CrearUsuario from './components/assets-admin/CrearUsuario';
import PrivateRoute from './PrivateRoute';
import PrivateRouteDashboard from './components/assets-admin/PrivateRouteDashboard'

function App() {
  return (
    <Router basename="/app">
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Autos" element={<PrivateRoute><Autos /></PrivateRoute>}/>
          <Route path="/Usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>}/>
          <Route path="/Viajes" element={<PrivateRoute><Viajes /></PrivateRoute>}/>
          <Route path="/ViajesCO" element={<PrivateRoute><ViajesCO /></PrivateRoute>}/>
          <Route path="/Gastos" element={<PrivateRoute><Gastos /></PrivateRoute>}/>
          <Route path="/GastosCO" element={<PrivateRoute><GastosCO /></PrivateRoute>}/>
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