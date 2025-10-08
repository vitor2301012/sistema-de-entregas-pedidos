const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Rota raiz - redirecionar para a página inicial
app.get('/', (req, res) => {
    res.redirect('/home.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});