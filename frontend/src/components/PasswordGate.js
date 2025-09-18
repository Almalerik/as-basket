import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

function PasswordGate({ onSuccess }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001';

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth`, { password: input });
      if (res.data.success) {
        onSuccess(input);
      }
    } catch {
      setError('Password errata');
    }
  };

  return (
    <>
      <TextField
        label="Password"
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Accedi</Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </>
  );
}

export default PasswordGate;