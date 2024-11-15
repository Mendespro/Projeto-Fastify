import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Home from './components/Home';
import BloquearDesbloquear from './components/BloquearDesbloquear';
import Recarga from './components/Recarga';
import Relatorio from './components/Relatorio';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/bloquear-desbloquear" element={<BloquearDesbloquear />} />
        <Route path="/recarga" element={<Recarga />} />
        <Route path="/relatorio" element={<Relatorio />} />
      </Routes>
    </Router>
  );
}

export default App;
