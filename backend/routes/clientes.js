const express = require('express');
const router = express.Router();
const connection = require('../db/conexao');

// Rota para cadastrar um novo cliente
router.post('/', async (req, res) => {
    try {
        const { nome, email, telefone, endereco } = req.body;
        
        // Validação básica do nome (único campo obrigatório)
        if (!nome) {
            return res.status(400).json({ error: 'O nome é obrigatório' });
        }

        const query = `
            INSERT INTO clientes (nome, email, telefone, endereco)
            VALUES (?, ?, ?, ?)
        `;

        const values = [nome, email, telefone, endereco];
        const [result] = await connection.execute(query, values);

        res.status(201).json({
            id: result.insertId,
            nome,
            email,
            telefone,
            endereco
        });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;