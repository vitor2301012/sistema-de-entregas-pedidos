const express = require('express');
const router = express.Router();
const connection = require('../db/conexao');

// Rota para listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM clientes');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para cadastrar um novo cliente
router.post('/', async (req, res) => {
    try {
        const { nome, email, telefone, rua, numero, complemento, bairro, cidade, estado, cep } = req.body;
        
        // Validação básica dos campos obrigatórios
        if (!nome) {
            return res.status(400).json({ error: 'O nome é obrigatório' });
        }

        // Construir endereço completo se os campos individuais estão presentes
        let endereco = '';
        if (rua || numero || complemento || bairro || cidade || estado || cep) {
            endereco = `${rua || ''}, ${numero || ''} ${complemento ? '- ' + complemento : ''}, ${bairro || ''}, ${cidade || ''} - ${estado || ''}, CEP: ${cep || ''}`.trim();
        }

        const query = `
            INSERT INTO clientes (nome, email, telefone, endereco, rua, numero, complemento, bairro, cidade, estado, cep)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [nome, email, telefone, endereco, rua, numero, complemento, bairro, cidade, estado, cep];
        
        try {
            const [result] = await connection.execute(query, values);
            res.status(201).json({
                id: result.insertId,
                nome,
                email,
                telefone,
                endereco,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep
            });
        } catch (dbError) {
            // Se der erro, pode ser que as colunas não existam ainda
            // Vamos tentar apenas com os campos originais
            console.warn('Tentando inserir com campos originais apenas:', dbError.message);
            
            const queryOriginal = `
                INSERT INTO clientes (nome, email, telefone, endereco)
                VALUES (?, ?, ?, ?)
            `;
            const valuesOriginal = [nome, email, telefone, endereco];
            const [result] = await connection.execute(queryOriginal, valuesOriginal);
            
            res.status(201).json({
                id: result.insertId,
                nome,
                email,
                telefone,
                endereco
            });
        }
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;