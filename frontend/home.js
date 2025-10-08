// Animações e interações da página inicial
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animações
    initAnimations();
    
    // Carregar estatísticas resumidas
    carregarEstatisticasResumo();
    
    // Configurar smooth scrolling
    configurarSmoothScrolling();
});

// Inicializar animações de entrada
function initAnimations() {
    // Animar cards de funcionalidades quando entrarem na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 200); // Delay escalonado
            }
        });
    }, observerOptions);

    // Observar todos os cards de funcionalidades
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Observar items de estatísticas
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        observer.observe(item);
    });
}

// Carregar estatísticas resumidas para exibir na home
async function carregarEstatisticasResumo() {
    try {
        // Carregar estatísticas de pedidos
        const pedidosResponse = await fetch('http://localhost:3000/api/pedidos/estatisticas');
        if (pedidosResponse.ok) {
            const dados = await pedidosResponse.json();
            
            // Atualizar total de pedidos
            const totalPedidos = dados.resumo.totalPedidos || 0;
            animarContador('totalPedidos', totalPedidos);
            
            // Calcular pedidos entregues
            const entregues = dados.resumo.porStatus.find(s => s.status === 'entregue')?.quantidade || 0;
            animarContador('pedidosEntregues', entregues);
        }

        // Carregar estatísticas de clientes
        const clientesResponse = await fetch('http://localhost:3000/api/clientes');
        if (clientesResponse.ok) {
            const clientes = await clientesResponse.json();
            animarContador('totalClientes', clientes.length);
        }
        
    } catch (error) {
        console.log('Estatísticas não disponíveis:', error.message);
        // Se não conseguir carregar, manter os valores padrão
    }
}

// Animar contador de números
function animarContador(elementId, valorFinal) {
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    
    let valorAtual = 0;
    const incremento = valorFinal / 30; // 30 frames de animação
    const duracaoFrame = 50; // 50ms por frame
    
    const interval = setInterval(() => {
        valorAtual += incremento;
        if (valorAtual >= valorFinal) {
            valorAtual = valorFinal;
            clearInterval(interval);
        }
        elemento.textContent = Math.floor(valorAtual);
    }, duracaoFrame);
}

// Configurar smooth scrolling para links internos
function configurarSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Efeitos de hover nos cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Adicionar efeito de parallax sutil no hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const speed = scrolled * 0.5;
        hero.style.transform = `translateY(${speed}px)`;
    }
});

// Adicionar efeito de typing no título (opcional)
function efeitoTyping() {
    const titulo = document.querySelector('.hero h1');
    if (!titulo) return;
    
    const textoOriginal = titulo.textContent;
    titulo.textContent = '';
    
    let i = 0;
    const interval = setInterval(() => {
        titulo.textContent += textoOriginal.charAt(i);
        i++;
        if (i >= textoOriginal.length) {
            clearInterval(interval);
        }
    }, 100);
}

// Adicionar indicador de carregamento suave
function mostrarCarregamento() {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loader);
    
    // Remover após 1 segundo
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 1000);
}

// Mostrar loading apenas na primeira visita
if (!sessionStorage.getItem('visitado')) {
    mostrarCarregamento();
    sessionStorage.setItem('visitado', 'true');
}