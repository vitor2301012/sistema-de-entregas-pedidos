-- Script para atualizar a tabela clientes com campos detalhados de endereço

-- Adicionar as novas colunas de endereço na tabela clientes
ALTER TABLE clientes 
ADD COLUMN rua VARCHAR(100),
ADD COLUMN numero VARCHAR(10),
ADD COLUMN complemento VARCHAR(50),
ADD COLUMN bairro VARCHAR(50),
ADD COLUMN cidade VARCHAR(50),
ADD COLUMN estado VARCHAR(2),
ADD COLUMN cep VARCHAR(10);

-- Verificar a estrutura atualizada
DESCRIBE clientes;