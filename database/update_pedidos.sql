-- Script para atualizar a tabela pedidos com campos detalhados de endereço

-- Adicionar as novas colunas de endereço na tabela pedidos
ALTER TABLE pedidos 
ADD COLUMN rua VARCHAR(100),
ADD COLUMN numero VARCHAR(10),
ADD COLUMN complemento VARCHAR(50),
ADD COLUMN bairro VARCHAR(50),
ADD COLUMN cidade VARCHAR(50),
ADD COLUMN estado VARCHAR(2),
ADD COLUMN cep VARCHAR(10);

-- Verificar a estrutura atualizada
DESCRIBE pedidos;