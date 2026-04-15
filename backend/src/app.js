require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check (LIN-DEV-007: liveness endpoint obligatorio)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Rutas API v1
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/terms', require('./routes/termRoutes'));
app.use('/api/v1/scores', require('./routes/scoreRoutes'));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
