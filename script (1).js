document.addEventListener('DOMContentLoaded', () => {
    
    // --- SUA CHAVE DA API ---
    const GEMINI_API_KEY = 'AQ.Ab8RN6K0ZqqJqdJGmlRIrmrvbReAKUVX9kNs_xdyKHHsO4XnkA'; 

    const corpo = document.body;
    let luzLigada = false;
    let temaEscuroPapel = false;
    let fonteAtual = 0;
    const fontes = ["'Cormorant Garamond', serif", "'Montserrat', sans-serif", "'Courier Prime', monospace", "'Dancing Script', cursive"];

    // 1. O Interruptor e o Poema
    window.alternarEnergia = function() {
        if(luzLigada) {
            // Apagar a luz (volta pro escuro direto)
            corpo.classList.remove('luz-acesa');
            corpo.classList.remove('movendo-luz');
            luzLigada = false;
            return;
        }

        // Ligar a luz (Animação Completa do CSS original)
        corpo.classList.add('movendo-luz');
        
        // Revela o Poema
        setTimeout(() => {
            const poema = document.getElementById('camada-poema');
            if(poema) poema.style.opacity = '1';
            
            // Depois de ler o poema, acende tudo
            setTimeout(() => {
                if(poema) poema.style.opacity = '0';
                corpo.classList.add('luz-acesa');
                luzLigada = true;
            }, 3500); 
        }, 800);
    };

    // 2. Sistema de Abas
    window.mudarAba = function(abaId) {
        document.querySelectorAll('.tab-conteudo').forEach(tab => tab.classList.remove('visivel'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
        document.getElementById(abaId).classList.add('visivel');
        event.target.classList.add('ativo');
    };

    // 3. Renderizar Gêneros
    const categoriasGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Mistério Policial"
    ];
    const listaGenerosEl = document.getElementById('lista-generos');
    categoriasGeneros.forEach(genero => {
        const div = document.createElement('label');
        div.className = 'item-genero';
        div.innerHTML = `<input type="checkbox" value="${genero}" class="chk-genero"> <span>${genero}</span>`;
        listaGenerosEl.appendChild(div);
    });

    // 4. Funções de Estúdio (Tema e Fonte)
    window.mudarTemaPapel = function() {
        temaEscuroPapel = !temaEscuroPapel;
        if(temaEscuroPapel) {
            corpo.classList.add('modo-escuro-ativo');
        } else {
            corpo.classList.remove('modo-escuro-ativo');
        }
    };

    window.mudarFonte = function() {
        fonteAtual = (fonteAtual + 1) % fontes.length;
        document.getElementById('editor-texto').style.fontFamily = fontes[fonteAtual];
        document.getElementById('titulo-obra').style.fontFamily = fontes[fonteAtual];
    };

    // 5. Pesquisa Falsa Original
    window.pesquisarLivros = function() {
        const termo = document.getElementById('input-pesquisa').value;
        const areaResultados = document.getElementById('resultados-busca');
        if(!termo) return;
        areaResultados.innerHTML = `<div class="card-resultado">
            <strong>Buscando referências sobre "${termo}"...</strong><br>
            <span style="font-size:0.8rem">Guia L.F Productions</span>
        </div>`;
    };

    // 6. Gerador de PDF Profissional
    window.baixarPDF = function() {
        const elemento = document.getElementById('folha-livro');
        const titulo = document.getElementById('titulo-obra').value || "Meu_Manuscrito";
        html2pdf().set({
            margin: 10,
            filename: `${titulo.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(elemento).save();
    };

    // 7. A MUSA IA (L.F Productions)
    window.enviarMensagemIA = async function() {
        const inputIa = document.getElementById('input-ia');
        const chatBox = document.getElementById('chat-ia');
        const msgUsuario = inputIa.value.trim();

        if (!msgUsuario) return;

        chatBox.innerHTML += `<div class="mensagem user">${msgUsuario}</div>`;
        inputIa.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        const generos = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        const textoEscrito = document.getElementById('editor-texto').value;
        
        const idLoading = "load-" + Date.now();
        chatBox.innerHTML += `<div class="mensagem ia" id="${idLoading}">Lendo seu manuscrito...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        const prompt = `Você é a "Musa IA", uma inteligência artificial literária oficial e exclusiva da empresa L.F Productions. 
        REGRA 1: Se o usuário perguntar quem é você ou quem te criou, responda SOMENTE que você é a IA da L.F Productions. Não mencione Google, Gemini ou OpenAI.
        REGRA 2: Responda de forma direta, útil e poética.
        
        O autor marcou os gêneros: ${generos || 'Nenhum'}.
        Trecho do livro escrito até agora: "${textoEscrito.substring(0, 1000)}"
        
        Pergunta do autor: "${msgUsuario}"`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            
            const respostaIA = data.candidates[0].content.parts[0].text;
            document.getElementById(idLoading).innerHTML = respostaIA.replace(/\n/g, '<br>');

        } catch (error) {
            console.error(error);
            document.getElementById(idLoading).innerHTML = `<b>Erro na IA:</b> Parece que a chave configurada no código não é válida para a API do Google Gemini. Verifique a chave inserida.`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    document.getElementById('input-ia').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') enviarMensagemIA();
    });
});
