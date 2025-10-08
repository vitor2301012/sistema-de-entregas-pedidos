-- Execute estes comandos no seu cliente MySQL para atualizar as tabelas com os novos campos de endereço

-- 1. Para a tabela clientes:
USE sistema_entregas;

ALTER TABLE clientes 
ADD COLUMN rua VARCHAR(100),
ADD COLUMN numero VARCHAR(10),
ADD COLUMN complemento VARCHAR(50),
ADD COLUMN bairro VARCHAR(50),
ADD COLUMN cidade VARCHAR(50),
ADD COLUMN estado VARCHAR(2),
ADD COLUMN cep VARCHAR(10);

-- 2. Para a tabela pedidos:
ALTER TABLE pedidos 
ADD COLUMN rua VARCHAR(100),
ADD COLUMN numero VARCHAR(10),
ADD COLUMN complemento VARCHAR(50),
ADD COLUMN bairro VARCHAR(50),
ADD COLUMN cidade VARCHAR(50),
ADD COLUMN estado VARCHAR(2),
ADD COLUMN cep VARCHAR(10);

-- 3. Verificar as estruturas atualizadas:
DESCRIBE clientes;
DESCRIBE pedidos;