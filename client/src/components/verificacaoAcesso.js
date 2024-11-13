import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, UserX, Camera } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

const VerificacaoAcesso = () => {
  const [status, setStatus] = useState('waiting'); // waiting, success, failed
  const [userData, setUserData] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  // Função para simular a leitura do cartão
  const handleCardRead = async (cardData) => {
    // Simular recebimento dos dados do usuário após leitura do cartão
    setUserData({
      nome: "João Silva",
      matricula: "123456",
      saldo: 50.00,
      fotoUrl: "/api/placeholder/150/150"
    });
    setStatus('verifying');
  };

  const handleAccess = (allowed) => {
    setStatus(allowed ? 'success' : 'failed');
    setTimeout(() => {
      setStatus('waiting');
      setUserData(null);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Verificação de Acesso</h1>
        <p className="text-gray-600">Aproxime o cartão para validação</p>
      </div>

      <div className="mb-6">
        {status === 'waiting' && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="text-blue-500" />
            <AlertTitle>Aguardando leitura do cartão...</AlertTitle>
          </Alert>
        )}
        {status === 'verifying' && userData && (
          <div className="text-center">
            <img src={userData.fotoUrl} alt="Foto do usuário" className="rounded-full w-24 h-24 mx-auto mb-4" />
            <h2 className="text-lg font-semibold">{userData.nome}</h2>
            <p>Matrícula: {userData.matricula}</p>
            <p>Saldo: R$ {userData.saldo.toFixed(2)}</p>
            <button className="bg-green-500 text-white p-2 rounded" onClick={() => handleAccess(true)}>
              Acesso Permitido
            </button>
            <button className="bg-red-500 text-white p-2 rounded ml-2" onClick={() => handleAccess(false)}>
              Acesso Negado
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificacaoAcesso;
