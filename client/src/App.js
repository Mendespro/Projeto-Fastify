import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Home from './components/Home';
import BloquearDesbloquear from './components/BloquearDesbloquear';
import Recarga from './components/Recarga';
import Relatorio from './components/Relatorio';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/bloquear-desbloquear" element={<BloquearDesbloquear />} />
          <Route path="/recarga" element={<Recarga />} />
          <Route path="/relatorio" element={<Relatorio />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} /> {/* Redireciona para home se não autenticado */}
      </Routes>
    </Router>
  );
}

export default App;
