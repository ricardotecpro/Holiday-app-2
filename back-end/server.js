require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const initDatabase = require('./src/initDatabase');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');


const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 20, // máximo 20 requisições por IP neste intervalo
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas tentativas de autenticação, tente novamente mais tarde.',
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requisições por IP neste intervalo
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições, tente novamente mais tarde.',
});


app.use('/auth', authLimiter);
app.use('/holidays', generalLimiter);

app.use('/auth', require('./src/routes/auth'));
app.use('/holidays', require('./src/routes/holiday'));

const PORT = process.env.PORT || 3001;


const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
};

initDatabase().then(() => {
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Servidor HTTPS rodando em https://localhost:${PORT}`);
  });
});
