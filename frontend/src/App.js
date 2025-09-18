import React, { useState } from 'react';
import PasswordGate from './components/PasswordGate';
import { Container, Typography, Button } from '@mui/material';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {!authenticated ? (
        <PasswordGate onSuccess={(pwd) => {
          setAuthenticated(true);
          setPassword(pwd);
        }} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Benvenuto Alex 🎉
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Hai effettuato l'accesso con successo. Ora puoi accedere alle funzionalità protette.
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Esci
          </Button>
        </>
      )}
    </Container>
  );
}

export default App;