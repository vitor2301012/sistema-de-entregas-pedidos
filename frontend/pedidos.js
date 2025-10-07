// Carregar lista de clientes ao iniciar a página
async function carregarClientes() {
    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const clientes = await response.json();
        
        const select = document.getElementById('cliente');
        // Limpar opções existentes
        select.innerHTML = '<option value="">Selecione um cliente</option>';
        
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = cliente.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.textContent = 'Erro ao carregar lista de clientes';
        mensagemDiv.className = 'erro';
    }
}

// Carregar clientes quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarClientes);

// Manipular envio do formulário
document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Formatando o endereço completo a partir dos campos separados
    const estado = document.getElementById('estado').value;
    const estadoNome = document.getElementById('estado').options[document.getElementById('estado').selectedIndex].text;
    const endereco_entrega = `${document.getElementById('rua').value}, ${document.getElementById('numero').value}${document.getElementById('complemento').value ? ' - ' + document.getElementById('complemento').value : ''} - ${estadoNome} - CEP: ${document.getElementById('cep').value}`;

    const formData = {
        cliente_id: document.getElementById('cliente').value,
        descricao: document.getElementById('descricao').value,
        endereco_entrega: endereco_entrega,
        estado: estado
    };

    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        const mensagemDiv = document.getElementById('mensagem');
        
        if (response.ok) {
            mensagemDiv.textContent = 'Pedido cadastrado com sucesso!';
            mensagemDiv.className = 'sucesso';
            document.getElementById('pedidoForm').reset();
        } else {
            mensagemDiv.textContent = data.error || 'Erro ao cadastrar pedido';
            mensagemDiv.className = 'erro';
        }
    } catch (error) {
        console.error('Erro:', error);
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.textContent = 'Erro ao conectar com o servidor';
        mensagemDiv.className = 'erro';
    }
});