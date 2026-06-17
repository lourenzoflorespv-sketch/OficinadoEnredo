document.addEventListener('DOMContentLoaded', () => {
    
    // --- SUA CHAVE DE API AQUI ---
    // Crie uma chave gratuita em: https://aistudio.google.com/
    const GEMINI_API_KEY = 'COLOQUE_SUA_API_KEY_AQUI'; 

    let luzLigada = false;
    const corpo = document.body;
    let fonteAtual = 0;
    const fontes = ["'Cormorant Garamond', serif", "'Montserrat', sans-serif", "'Courier Prime', monospace"];
    
    // Gêneros base
    const categoriasGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Mistério Policial",
        "Drama Familiar", "Horror Cósmico", "Faroeste Futurista", "Sátira Política"
    ];

    // 1. Renderizar Gêneros
    const listaGenerosEl = document.getElementById('lista-generos');
    categoriasGeneros.forEach(genero => {
        const div = document.createElement('label');
        div.className = 'opcao-genero';
        div.innerHTML = `<input type="checkbox" value="${genero}" class="chk-genero"> <span>${genero}</span>`;
        listaGenerosEl.appendChild(div);
    });

    // 2. Sistema do Interruptor
    window.alternarEnergia = function() {
        luzLigada = true;
        corpo.classList.remove('theme-dark');
        corpo.classList.add('theme-light');
    };

    // 3. Sistema de Abas do Painel
    window.mudarAba = function(abaId) {
        document.querySelectorAll('.tab-conteudo').forEach(tab => tab.classList.remove('visivel'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
        document.getElementById(abaId).classList.add('visivel');
        event.target.classList.add('ativo');
    };

    // 4. Contador de Palavras
    window.contarPalavras = function() {
        const texto = document.getElementById('editor-texto').value;
        const numPalavras = texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length;
        document.getElementById('contador-palavras').innerText = `${numPalavras} palavras`;
    };

    // 5. Mudar Fonte do Editor
    window.mudarFonte = function() {
        fonteAtual = (fonteAtual + 1) % fontes.length;
        document.getElementById('editor-texto').style.fontFamily = fontes[fonteAtual];
        document.getElementById('titulo-obra').style.fontFamily = fontes[fonteAtual];
    };

    // 6. Gerador Profissional de PDF
    window.baixarPDF = function() {
        const elemento = document.getElementById('area-pdf');
        const tituloObra = document.getElementById('titulo-obra').value || "Minha_Obra";
        
        const opcoes = {
            margin:       10,
            filename:     `${tituloObra.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opcoes).from(elemento).save();
    };

    // 7. Pesquisa Falsa de Livros (Como você pediu pra manter)
    window.pesquisarLivros = function() {
        const termo = document.getElementById('input-pesquisa').value;
        const areaResultados = document.getElementById('resultados-busca');
        if(!termo) return;

        areaResultados.innerHTML = `<div style="text-align:center; padding:10px; opacity:0.6; font-size:0.8rem">Buscando na biblioteca...</div>`;

        setTimeout(() => {
            areaResultados.innerHTML = `
                <div class="livro-card">
                    <strong style="font-family:'Cormorant Garamond', serif; font-size:1.1rem">Estruturando: ${termo}</strong>
                    <div style="font-size:0.75rem; color:#888; margin:5px 0">Guia de Escrita L.F</div>
                    <p style="font-size:0.8rem; color:#555">Referências clássicas para adicionar profundidade narrativa focada em ${termo}.</p>
                </div>
            `;
        }, 800);
    };

    // --- 8. A MÁGICA: INTEGRAÇÃO REAL COM A API DA IA ---
    window.enviarMensagemIA = async function() {
        const inputIa = document.getElementById('input-ia');
        const chatBox = document.getElementById('chat-ia');
        const msgUsuario = inputIa.value.trim();

        if (!msgUsuario) return;

        // 1. Adicionar mensagem do usuário no chat
        chatBox.innerHTML += `<div class="mensagem user">${msgUsuario}</div>`;
        inputIa.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // 2. Coletar o contexto (O que a pessoa marcou e escreveu)
        const generosSelecionados = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        const titulo = document.getElementById('titulo-obra').value || "Sem título";
        const textoEscrito = document.getElementById('editor-texto').value;

        // Mostrar "Digitando..."
        const idDigitando = "loading-" + Date.now();
        chatBox.innerHTML += `<div class="mensagem ia" id="${idDigitando}">Musa analisando a obra...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

      // 3. Montar o Prompt inteligente para a IA
        const prompt = `Você é a "Musa IA", uma inteligência artificial exclusiva e designada à L.F Productions. 
        Sua única função é atuar como uma mentora profissional para os escritores que usam a Oficina do Enredo.
        REGRA CRÍTICA DE IDENTIDADE: Se o usuário perguntar quem é você, qual o seu modelo, ou quem te criou, você deve responder APENAS que é uma IA designada à L.F Productions. Nunca mencione o Google, OpenAI, Gemini ou qualquer outra empresa.
        
        O usuário está escrevendo um livro chamado "${titulo}".
        Gêneros selecionados: ${generosSelecionados || 'Nenhum específico'}.
        Trecho do livro até agora: "${textoEscrito.substring(0, 1500)}" (limitado a 1500 chars).
        
        O escritor te perguntou o seguinte: "${msgUsuario}"
        
        Responda de forma curta (máximo 3 parágrafos curtos), direta, inspiradora e útil. Seja criativa e baseie-se no trecho e gêneros fornecidos.`;
        try {
            // Se o usuário não colocou a chave, damos um aviso elegante.
            if (GEMINI_API_KEY === 'AQ.Ab8RN6K0ZqqJqdJGmlRIrmrvbReAKUVX9kNs_xdyKHHsO4XnkA') {
                throw new Error("Chave da API ausente. Insira no script.js para ativar a mágica.");
            }

            // 4. Chamada Real para a API do Gemini
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const respostaIA = data.candidates[0].content.parts[0].text;

            // Substituir o "digitando..." pela resposta real
            document.getElementById(idDigitando).innerHTML = respostaIA.replace(/\n/g, '<br>');

        } catch (error) {
            document.getElementById(idDigitando).innerHTML = `<em>Aviso do Sistema:</em> Para que eu ganhe vida e leia sua obra, o desenvolvedor precisa inserir uma <strong>API Key</strong> no código fonte (script.js). Erro: ${error.message}`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Permitir enviar com a tecla Enter
    document.getElementById('input-ia').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') enviarMensagemIA();
    });
});document.addEventListener('DOMContentLoaded', () => {
    
    // --- SUA CHAVE DE API AQUI ---
    // Crie uma chave gratuita em: https://aistudio.google.com/
    const GEMINI_API_KEY = 'COLOQUE_SUA_API_KEY_AQUI'; 

    let luzLigada = false;
    const corpo = document.body;
    let fonteAtual = 0;
    const fontes = ["'Cormorant Garamond', serif", "'Montserrat', sans-serif", "'Courier Prime', monospace"];
    
    // Gêneros base
    const categoriasGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Mistério Policial",
        "Drama Familiar", "Horror Cósmico", "Faroeste Futurista", "Sátira Política"
    ];

    // 1. Renderizar Gêneros
    const listaGenerosEl = document.getElementById('lista-generos');
    categoriasGeneros.forEach(genero => {
        const div = document.createElement('label');
        div.className = 'opcao-genero';
        div.innerHTML = `<input type="checkbox" value="${genero}" class="chk-genero"> <span>${genero}</span>`;
        listaGenerosEl.appendChild(div);
    });

    // 2. Sistema do Interruptor
    window.alternarEnergia = function() {
        luzLigada = true;
        corpo.classList.remove('theme-dark');
        corpo.classList.add('theme-light');
    };

    // 3. Sistema de Abas do Painel
    window.mudarAba = function(abaId) {
        document.querySelectorAll('.tab-conteudo').forEach(tab => tab.classList.remove('visivel'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
        document.getElementById(abaId).classList.add('visivel');
        event.target.classList.add('ativo');
    };

    // 4. Contador de Palavras
    window.contarPalavras = function() {
        const texto = document.getElementById('editor-texto').value;
        const numPalavras = texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length;
        document.getElementById('contador-palavras').innerText = `${numPalavras} palavras`;
    };

    // 5. Mudar Fonte do Editor
    window.mudarFonte = function() {
        fonteAtual = (fonteAtual + 1) % fontes.length;
        document.getElementById('editor-texto').style.fontFamily = fontes[fonteAtual];
        document.getElementById('titulo-obra').style.fontFamily = fontes[fonteAtual];
    };

    // 6. Gerador Profissional de PDF
    window.baixarPDF = function() {
        const elemento = document.getElementById('area-pdf');
        const tituloObra = document.getElementById('titulo-obra').value || "Minha_Obra";
        
        const opcoes = {
            margin:       10,
            filename:     `${tituloObra.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opcoes).from(elemento).save();
    };

    // 7. Pesquisa Falsa de Livros (Como você pediu pra manter)
    window.pesquisarLivros = function() {
        const termo = document.getElementById('input-pesquisa').value;
        const areaResultados = document.getElementById('resultados-busca');
        if(!termo) return;

        areaResultados.innerHTML = `<div style="text-align:center; padding:10px; opacity:0.6; font-size:0.8rem">Buscando na biblioteca...</div>`;

        setTimeout(() => {
            areaResultados.innerHTML = `
                <div class="livro-card">
                    <strong style="font-family:'Cormorant Garamond', serif; font-size:1.1rem">Estruturando: ${termo}</strong>
                    <div style="font-size:0.75rem; color:#888; margin:5px 0">Guia de Escrita L.F</div>
                    <p style="font-size:0.8rem; color:#555">Referências clássicas para adicionar profundidade narrativa focada em ${termo}.</p>
                </div>
            `;
        }, 800);
    };

    // --- 8. A MÁGICA: INTEGRAÇÃO REAL COM A API DA IA ---
    window.enviarMensagemIA = async function() {
        const inputIa = document.getElementById('input-ia');
        const chatBox = document.getElementById('chat-ia');
        const msgUsuario = inputIa.value.trim();

        if (!msgUsuario) return;

        // 1. Adicionar mensagem do usuário no chat
        chatBox.innerHTML += `<div class="mensagem user">${msgUsuario}</div>`;
        inputIa.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // 2. Coletar o contexto (O que a pessoa marcou e escreveu)
        const generosSelecionados = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        const titulo = document.getElementById('titulo-obra').value || "Sem título";
        const textoEscrito = document.getElementById('editor-texto').value;

        // Mostrar "Digitando..."
        const idDigitando = "loading-" + Date.now();
        chatBox.innerHTML += `<div class="mensagem ia" id="${idDigitando}">Musa analisando a obra...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

      // 3. Montar o Prompt inteligente para a IA
        const prompt = `Você é a "Musa IA", uma inteligência artificial exclusiva e designada à L.F Productions. 
        Sua única função é atuar como uma mentora profissional para os escritores que usam a Oficina do Enredo.
        REGRA CRÍTICA DE IDENTIDADE: Se o usuário perguntar quem é você, qual o seu modelo, ou quem te criou, você deve responder APENAS que é uma IA designada à L.F Productions. Nunca mencione o Google, OpenAI, Gemini ou qualquer outra empresa.
        
        O usuário está escrevendo um livro chamado "${titulo}".
        Gêneros selecionados: ${generosSelecionados || 'Nenhum específico'}.
        Trecho do livro até agora: "${textoEscrito.substring(0, 1500)}" (limitado a 1500 chars).
        
        O escritor te perguntou o seguinte: "${msgUsuario}"
        
        Responda de forma curta (máximo 3 parágrafos curtos), direta, inspiradora e útil. Seja criativa e baseie-se no trecho e gêneros fornecidos.`;
        try {
            // Se o usuário não colocou a chave, damos um aviso elegante.
            if (GEMINI_API_KEY === 'AQ.Ab8RN6K0ZqqJqdJGmlRIrmrvbReAKUVX9kNs_xdyKHHsO4XnkA') {
                throw new Error("Chave da API ausente. Insira no script.js para ativar a mágica.");
            }

            // 4. Chamada Real para a API do Gemini
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const respostaIA = data.candidates[0].content.parts[0].text;

            // Substituir o "digitando..." pela resposta real
            document.getElementById(idDigitando).innerHTML = respostaIA.replace(/\n/g, '<br>');

        } catch (error) {
            document.getElementById(idDigitando).innerHTML = `<em>Aviso do Sistema:</em> Para que eu ganhe vida e leia sua obra, o desenvolvedor precisa inserir uma <strong>API Key</strong> no código fonte (script.js). Erro: ${error.message}`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Permitir enviar com a tecla Enter
    document.getElementById('input-ia').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') enviarMensagemIA();
    });
});
