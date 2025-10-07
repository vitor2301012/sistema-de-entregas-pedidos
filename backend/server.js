const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/clientes', clientesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});