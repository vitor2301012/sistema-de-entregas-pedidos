// Carregar estatísticas ao iniciar a página
async function carregarEstatisticas() {
    const loadingSection = document.getElementById('loadingSection');
    const errorSection = document.getElementById('errorSection');
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Mostrar loading
    loadingSection.style.display = 'block';
    errorSection.style.display = 'none';
    dashboardContent.style.display = 'none';
    
    try {
        const response = await fetch('http://localhost:3000/api/pedidos/estatisticas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        exibirEstatisticas(data);
        
        // Esconder loading e mostrar conteúdo
        loadingSection.style.display = 'none';
        dashboardContent.style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        
        // Mostrar erro
        loadingSection.style.display = 'none';
        errorSection.style.display = 'block';
        document.getElementById('errorMessage').textContent = 
            `Erro ao conectar com o servidor: ${error.message}`;
    }
}

// Exibir estatísticas na página
function exibirEstatisticas(data) {
    const { resumo } = data;
    
    // Atualizar cards de resumo
    document.getElementById('totalPedidos').textContent = resumo.totalPedidos || 0;
    
    // Calcular pedidos por status
    let entregues = 0, andamento = 0, cancelados = 0;
    
    resumo.porStatus.forEach(status => {
        switch(status.status) {
            case 'entregue':
                entregues = status.quantidade;
                break;
            case 'em_andamento':
                andamento = status.quantidade;
                break;
            case 'cancelado':
                cancelados = status.quantidade;
                break;
        }
    });
    
    document.getElementById('pedidosEntregues').textContent = entregues;
    document.getElementById('pedidosAndamento').textContent = andamento;
    document.getElementById('pedidosCancelados').textContent = cancelados;
    
    // Exibir lista de status
    exibirStatusList(resumo.porStatus, resumo.totalPedidos);
    
    // Exibir top estados
    exibirEstadosList(resumo.porEstado);
    
    // Exibir top clientes
    exibirClientesList(resumo.topClientes);
}

// Exibir lista de status com barras de progresso
function exibirStatusList(statusData, total) {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';
    
    const statusNames = {
        'em_andamento': 'Em Andamento',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    };
    
    statusData.forEach(status => {
        const percentage = total > 0 ? (status.quantidade / total * 100).toFixed(1) : 0;
        
        const li = document.createElement('li');
        li.className = 'status-item';
        li.innerHTML = `
            <div>
                <span class="status-badge status-${status.status}">
                    ${statusNames[status.status] || status.status}
                </span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
            <strong>${status.quantidade} (${percentage}%)</strong>
        `;
        statusList.appendChild(li);
    });
    
    if (statusData.length === 0) {
        statusList.innerHTML = '<li class="status-item"><em>Nenhum dado disponível</em></li>';
    }
}

// Exibir lista de estados
function exibirEstadosList(estadosData) {
    const estadosList = document.getElementById('estadosList');
    estadosList.innerHTML = '';
    
    // Nomes dos estados por sigla
    const estadosNomes = {
        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
        'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
        'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
        'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
        'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
        'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
        'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    
    estadosData.forEach(estado => {
        const div = document.createElement('div');
        div.className = 'estado-item';
        div.innerHTML = `
            <span class="estado-name">
                ${estadosNomes[estado.estado] || estado.estado}
            </span>
            <span class="estado-count">${estado.quantidade}</span>
        `;
        estadosList.appendChild(div);
    });
    
    if (estadosData.length === 0) {
        estadosList.innerHTML = '<div class="estado-item"><em>Nenhum dado disponível</em></div>';
    }
}

// Exibir lista de top clientes
function exibirClientesList(clientesData) {
    const clientesList = document.getElementById('clientesList');
    clientesList.innerHTML = '';
    
    clientesData.forEach((cliente, index) => {
        const div = document.createElement('div');
        div.className = 'estado-item'; // Reutilizando o estilo
        div.innerHTML = `
            <span class="estado-name">
                🏆 ${index + 1}. ${cliente.nome}
            </span>
            <span class="estado-count">${cliente.total_pedidos} pedidos</span>
        `;
        clientesList.appendChild(div);
    });
    
    if (clientesData.length === 0) {
        clientesList.innerHTML = '<div class="estado-item"><em>Nenhum cliente com pedidos</em></div>';
    }
}

// Função para formatar números
function formatarNumero(numero) {
    return numero.toLocaleString('pt-BR');
}

// Função para formatar porcentagem
function formatarPorcentagem(valor, total) {
    if (total === 0) return '0%';
    return ((valor / total) * 100).toFixed(1) + '%';
}

// Auto-refresh a cada 30 segundos (opcional)
function iniciarAutoRefresh() {
    setInterval(carregarEstatisticas, 30000); // 30 segundos
}

// Carregar estatísticas quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarEstatisticas();
    // Descomente a linha abaixo se quiser auto-refresh
    // iniciarAutoRefresh();
});