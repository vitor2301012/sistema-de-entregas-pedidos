const express = require('express');
const router = express.Router();
const connection = require('../db/conexao');

// Rota para cadastrar um novo pedido
router.post('/', async (req, res) => {
    try {
        const { cliente_id, descricao, endereco_entrega, estado } = req.body;
        
        // Validação básica
        if (!cliente_id || !descricao || !endereco_entrega || !estado) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const query = `
            INSERT INTO pedidos (cliente_id, descricao, endereco_entrega, estado)
            VALUES (?, ?, ?, ?)
        `;

        const values = [cliente_id, descricao, endereco_entrega, estado];
        const [result] = await connection.execute(query, values);

        res.status(201).json({
            id: result.insertId,
            cliente_id,
            descricao,
            endereco_entrega,
            estado,
            status: 'em_andamento',
            data_criacao: new Date()
        });
    } catch (error) {
        console.error('Erro ao cadastrar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;