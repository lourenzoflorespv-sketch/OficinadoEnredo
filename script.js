document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONFIGURAÇÃO DA API (GROQ)
    // ==========================================
    // Cole sua NOVA chave aqui entre as aspas:
    const API_KEY = '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'; 

    const corpo = document.body;
    let luzLigada = false;
    let temaEscuro = false;

    // Elementos Base
    const chatBox = document.getElementById('chat-ia');
    const inputIa = document.getElementById('input-ia');
    const editor = document.getElementById('editor-texto');
    const titulo = document.getElementById('titulo-obra');

    // ==========================================
    // 2. O INTERRUPTOR (Animação Original L.F)
    // ==========================================
    window.alternarEnergia = function() {
        if(luzLigada) return; // Se já ligou, ignora.

        corpo.classList.add('movendo-luz');
        
        // Fase 1: Mostra o Poema
        setTimeout(() => {
            const poema = document.getElementById('camada-poema');
            poema.style.opacity = '1';
            
            // Fase 2: Acende a luz e revela o App
            setTimeout(() => {
                poema.style.opacity = '0';
                corpo.classList.add('luz-acesa');
                luzLigada = true;
                carregarAutoSave(); // Puxa dados salvos após ligar
            }, 3500); 
        }, 800);
    };

    // ==========================================
    // 3. SISTEMA DE ABAS (Glassmorphism Sidebar)
    // ==========================================
    window.mudarAba = function(abaId) {
        document.querySelectorAll('.tab-conteudo').forEach(tab => tab.classList.remove('visivel'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
        
        document.getElementById(abaId).classList.add('visivel');
        event.target.classList.add('ativo');
    };

    // ==========================================
    // 4. GÊNEROS LITERÁRIOS
    // ==========================================
    const categoriasGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Mistério Policial",
        "Ficção Histórica", "Distopia", "Drama", "Aventura"
    ];
    
    const listaGenerosEl = document.getElementById('lista-generos');
    categoriasGeneros.forEach(genero => {
        const label = document.createElement('label');
        label.className = 'opcao-genero';
        label.innerHTML = `<input type="checkbox" value="${genero}" class="chk-genero" onchange="salvarProgresso()"> <span>${genero}</span>`;
        listaGenerosEl.appendChild(label);
    });

    // ==========================================
    // 5. MUSA IA DA L.F PRODUCTIONS (Cérebro Groq)
    // ==========================================
    window.enviarMensagemIA = async function(textoForcado = null) {
        const msgUsuario = textoForcado ? textoForcado : inputIa.value.trim();
        if (!msgUsuario) return;

        // Imprime a mensagem do usuário
        chatBox.innerHTML += `<div class="mensagem user">${msgUsuario}</div>`;
        if(!textoForcado) inputIa.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Cria o balão de carregamento
        const idAguarde = "sys-" + Date.now();
        chatBox.innerHTML += `<div class="mensagem ia" id="${idAguarde}">O Núcleo L.F está processando via Groq...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        // Coleta o contexto
        const generos = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        
        const promptSistema = `Você é a IA oficial de auxílio literário da empresa L.F Productions.
        REGRA MÁXIMA: Se perguntarem sua identidade ou criador, responda estritamente que é a IA designada à L.F Productions. Jamais mencione a Groq, OpenAI ou Google.
        
        Dados da Obra:
        - Título: ${titulo.value || 'Desconhecido'}
        - Gêneros: ${generos || 'Não marcados'}
        - Trecho atual do livro: "${editor.value.substring(0, 1500)}"
        
        Forneça uma resposta técnica, inspiradora e profissional para ajudar o escritor. Mantenha a resposta concisa (2 a 3 parágrafos curtos).`;

        try {
            const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192", // Modelo ultra-rápido da Groq
                    messages: [
                        { role: "system", content: promptSistema },
                        { role: "user", content: msgUsuario }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            // Diagnóstico de erro
            if (!response.ok) {
                throw new Error(data.error ? data.error.message : `Erro HTTP: ${response.status}`);
            }
            
            const textoFinal = data.choices[0].message.content;
            document.getElementById(idAguarde).innerHTML = textoFinal.replace(/\n/g, '<br>');

        } catch (error) {
            document.getElementById(idAguarde).innerHTML = `<strong>Diagnóstico L.F Productions:</strong> <span style="color:#e74c3c;">${error.message}</span>`;
            console.error("Detalhes do erro:", error);
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    window.acaoIA = function(texto) {
        enviarMensagemIA(texto);
    };

    window.verificarEnter = function(e) {
        if(e.key === 'Enter') enviarMensagemIA();
    };

    // ==========================================
    // 6. AJUSTES DO ESTÚDIO E SIMULADOR
    // ==========================================
    window.aplicarEstudio = function() {
        const fonte = document.getElementById('sel-fonte').value;
        editor.style.fontFamily = fonte;
        titulo.style.fontFamily = fonte;
    };

    window.mudarModoTela = function() {
        const modo = document.getElementById('sel-tela').value;
        const app = document.getElementById('app-main');
        app.classList.remove('force-mobile');
        if(modo === 'mobile') app.classList.add('force-mobile');
    };

    window.alternarCorPapel = function() {
        temaEscuro = !temaEscuro;
        if(temaEscuro) {
            corpo.classList.add('modo-escuro-ativo');
        } else {
            corpo.classList.remove('modo-escuro-ativo');
        }
    };

    // ==========================================
    // 7. BIBLIOTECA SIMULADA
    // ==========================================
    window.pesquisarLivros = function() {
        const termo = document.getElementById('input-pesquisa').value;
        const areaRes = document.getElementById('resultados-busca');
        if(!termo) return;

        areaRes.innerHTML = `<div style="text-align:center; opacity:0.6; padding:10px;">Buscando referências na L.F Lib...</div>`;
        
        setTimeout(() => {
            areaRes.innerHTML = `
                <div style="background: white; padding: 12px; border-radius: 6px; border-left: 3px solid var(--accent); margin-bottom: 10px;">
                    <strong style="font-size: 0.9rem;">Guia L.F: ${termo}</strong>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 5px;">Utilize o contraste para dar ênfase a este elemento na sua narrativa.</p>
                </div>
            `;
        }, 800);
    };

    // ==========================================
    // 8. AUTO-SAVE E GERADOR DE PDF
    // ==========================================
    window.contarPalavrasESalvar = function() {
        const txt = editor.value.trim();
        const palavras = txt === '' ? 0 : txt.split(/\s+/).length;
        document.getElementById('contador-palavras').innerText = `${palavras} palavras`;
        salvarProgresso();
    };

    window.salvarProgresso = function() {
        localStorage.setItem('lf_titulo_v2', titulo.value);
        localStorage.setItem('lf_texto_v2', editor.value);
        
        const generos = Array.from(document.querySelectorAll('.chk-genero:checked')).map(el => el.value);
        localStorage.setItem('lf_generos_v2', JSON.stringify(generos));

        const status = document.getElementById('status-save');
        if(status) {
            status.innerText = "Salvo ✓";
            status.style.color = "#4caf50";
        }
    };

    function carregarAutoSave() {
        if(localStorage.getItem('lf_texto_v2') !== null) {
            titulo.value = localStorage.getItem('lf_titulo_v2') || '';
            editor.value = localStorage.getItem('lf_texto_v2') || '';
            
            const genSalvos = JSON.parse(localStorage.getItem('lf_generos_v2') || "[]");
            document.querySelectorAll('.chk-genero').forEach(box => {
                if(genSalvos.includes(box.value)) box.checked = true;
            });
            
            contarPalavrasESalvar();
        }
    }

    window.baixarPDF = function() {
        const folha = document.getElementById('folha-pdf');
        const nomeArq = titulo.value || "Obra_LF_Productions";
        html2pdf().set({
            margin: 15,
            filename: `${nomeArq.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(folha).save();
    };
});
