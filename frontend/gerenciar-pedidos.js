// Carregar pedidos ao iniciar a página
async function carregarPedidos() {
    try {
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const pedidos = await response.json();
        exibirPedidos(pedidos);
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        mostrarMensagem('Erro ao carregar pedidos', 'error');
        document.getElementById('pedidosContainer').innerHTML = '<div class="error">Erro ao carregar pedidos</div>';
    }
}

// Exibir pedidos na tela
function exibirPedidos(pedidos) {
    const container = document.getElementById('pedidosContainer');
    
    if (pedidos.length === 0) {
        container.innerHTML = '<div class="no-pedidos">Nenhum pedido encontrado</div>';
        return;
    }
    
    const pedidosHTML = pedidos.map(pedido => `
        <div class="pedido-card">
            <div class="pedido-header">
                <div class="pedido-id">Pedido #${pedido.id}</div>
                <div class="status-badge status-${pedido.status}">${formatarStatus(pedido.status)}</div>
            </div>
            
            <div class="pedido-info">
                <div class="info-item">
                    <div class="info-label">Cliente:</div>
                    <div class="info-value">${pedido.cliente_nome}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Data do Pedido:</div>
                    <div class="info-value">${formatarData(pedido.data_criacao)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Descrição:</div>
                    <div class="info-value">${pedido.descricao}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Endereço de Entrega:</div>
                    <div class="info-value">${pedido.endereco_entrega}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Estado:</div>
                    <div class="info-value">${pedido.estado}</div>
                </div>
            </div>
            
            <div class="status-controls">
                <label for="status-${pedido.id}">Alterar Status:</label>
                <select id="status-${pedido.id}" class="status-select">
                    <option value="em_andamento" ${pedido.status === 'em_andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="entregue" ${pedido.status === 'entregue' ? 'selected' : ''}>Entregue</option>
                    <option value="cancelado" ${pedido.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
                <button class="btn-atualizar" onclick="atualizarStatus(${pedido.id})">
                    Atualizar
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = pedidosHTML;
}

// Atualizar status do pedido
async function atualizarStatus(pedidoId) {
    const selectElement = document.getElementById(`status-${pedidoId}`);
    const novoStatus = selectElement.value;
    const botao = selectElement.nextElementSibling;
    
    // Desabilitar botão durante a requisição
    botao.disabled = true;
    botao.textContent = 'Atualizando...';
    
    try {
        const response = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        mostrarMensagem(`Status do pedido #${pedidoId} atualizado para: ${formatarStatus(novoStatus)}`, 'success');
        
        // Recarregar pedidos para mostrar a atualização
        await carregarPedidos();
        
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        mostrarMensagem(`Erro ao atualizar status: ${error.message}`, 'error');
    } finally {
        // Reabilitar botão
        botao.disabled = false;
        botao.textContent = 'Atualizar';
    }
}

// Formatar status para exibição
function formatarStatus(status) {
    const statusMap = {
        'em_andamento': 'Em Andamento',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Formatar data para exibição
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mostrar mensagens de sucesso ou erro
function mostrarMensagem(mensagem, tipo) {
    const successElement = document.getElementById('successMessage');
    const errorElement = document.getElementById('errorMessage');
    
    // Esconder ambas as mensagens primeiro
    successElement.style.display = 'none';
    errorElement.style.display = 'none';
    
    if (tipo === 'success') {
        successElement.textContent = mensagem;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    } else if (tipo === 'error') {
        errorElement.textContent = mensagem;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Carregar pedidos quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarPedidos);