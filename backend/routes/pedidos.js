const express = require('express');
const router = express.Router();
const connection = require('../db/conexao');

// Rota de teste
router.get('/test', (req, res) => {
    res.json({ message: 'Rota de pedidos funcionando!' });
});

// Rota para cadastrar um novo pedido
router.post('/', async (req, res) => {
    try {
        const { cliente_id, descricao, endereco_entrega, estado } = req.body;
        
        // Validação básica
        if (!cliente_id || !descricao || !endereco_entrega) {
            return res.status(400).json({ error: 'Cliente, descrição e endereço são obrigatórios' });
        }

        let query, values;
        
        if (estado) {
            // Se tem estado, tenta inserir com estado
            query = `
                INSERT INTO pedidos (cliente_id, descricao, endereco_entrega, estado)
                VALUES (?, ?, ?, ?)
            `;
            values = [cliente_id, descricao, endereco_entrega, estado];
        } else {
            // Se não tem estado, insere sem estado
            query = `
                INSERT INTO pedidos (cliente_id, descricao, endereco_entrega)
                VALUES (?, ?, ?)
            `;
            values = [cliente_id, descricao, endereco_entrega];
        }

        const [result] = await connection.execute(query, values);

        res.status(201).json({
            id: result.insertId,
            cliente_id,
            descricao,
            endereco_entrega,
            estado: estado || null,
            status: 'em_andamento',
            data_criacao: new Date()
        });
    } catch (error) {
        console.error('Erro ao cadastrar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para listar todos os pedidos
router.get('/', async (req, res) => {
    try {
        // Primeiro, tentar com a coluna estado
        let query = `
            SELECT p.*, c.nome as cliente_nome 
            FROM pedidos p 
            JOIN clientes c ON p.cliente_id = c.id 
            ORDER BY p.data_criacao DESC
        `;

        const [pedidos] = await connection.execute(query);
        console.log('Pedidos encontrados:', pedidos.length);
        res.json(pedidos);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error.message);
        
        // Se der erro, pode ser que a coluna estado não existe ainda
        // Vamos tentar sem ela
        try {
            let querySimples = `
                SELECT p.id, p.cliente_id, p.descricao, p.status, p.data_criacao, p.endereco_entrega, c.nome as cliente_nome
                FROM pedidos p 
                JOIN clientes c ON p.cliente_id = c.id 
                ORDER BY p.data_criacao DESC
            `;
            const [pedidos] = await connection.execute(querySimples);
            res.json(pedidos);
        } catch (error2) {
            console.error('Erro na consulta simples:', error2.message);
            res.status(500).json({ 
                error: 'Erro interno do servidor',
                details: error2.message 
            });
        }
    }
});

// Rota para atualizar status do pedido
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validação dos status permitidos
        const statusPermitidos = ['em_andamento', 'entregue', 'cancelado'];
        if (!status || !statusPermitidos.includes(status)) {
            return res.status(400).json({ 
                error: 'Status inválido. Use: em_andamento, entregue ou cancelado' 
            });
        }

        const query = `
            UPDATE pedidos 
            SET status = ? 
            WHERE id = ?
        `;

        const [result] = await connection.execute(query, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        res.json({ 
            message: 'Status do pedido atualizado com sucesso',
            id: parseInt(id),
            status: status
        });
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;