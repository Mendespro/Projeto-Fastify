import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerificacaoAcesso from './components/verificacaoAcesso';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verificacao" element={<VerificacaoAcesso />} />
      </Routes>
    </Router>
  );
}

export default App;
