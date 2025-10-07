CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'em_andamento',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endereco_entrega VARCHAR(150) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);