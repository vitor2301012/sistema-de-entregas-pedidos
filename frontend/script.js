document.getElementById('clienteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        const mensagemDiv = document.getElementById('mensagem');
        
        if (response.ok) {
            mensagemDiv.textContent = 'Cliente cadastrado com sucesso!';
            mensagemDiv.className = 'sucesso';
            document.getElementById('clienteForm').reset();
        } else {
            mensagemDiv.textContent = data.error || 'Erro ao cadastrar cliente';
            mensagemDiv.className = 'erro';
        }
    } catch (error) {
        console.error('Erro:', error);
        const mensagemDiv = document.getElementById('mensagem');
        mensagemDiv.textContent = 'Erro ao conectar com o servidor';
        mensagemDiv.className = 'erro';
    }
});