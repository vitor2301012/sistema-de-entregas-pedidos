const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Rotas
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});