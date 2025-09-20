// Utilitário para gerar JWT para testes
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

function gerarTokenTeste(payload = { id: 1, username: 'test' }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

module.exports = gerarTokenTeste;
