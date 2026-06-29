document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONFIGURAÇÃO DA API 
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
    // 2. O INTERRUPTOR (Animação)
    // ==========================================
    window.alternarEnergia = function() {
        if(luzLigada) return;

        corpo.classList.add('movendo-luz');
        
        setTimeout(() => {
            const poema = document.getElementById('camada-poema');
            poema.style.opacity = '1';
            
            setTimeout(() => {
                poema.style.opacity = '0';
                corpo.classList.add('luz-acesa');
                luzLigada = true;
                carregarAutoSave();
            }, 3500); 
        }, 800);
    };

    // ==========================================
    // 3. SISTEMA DE ABAS
    // ==========================================
    window.mudarAba = function(abaId, event) {
        document.querySelectorAll('.tab-conteudo').forEach(tab => tab.classList.remove('visivel'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
        
        document.getElementById(abaId).classList.add('visivel');
        if (event && event.target) {
            event.target.classList.add('ativo');
        }
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
    if (listaGenerosEl) {
        categoriasGeneros.forEach(genero => {
            const label = document.createElement('label');
            label.className = 'opcao-genero';
            label.innerHTML = `<input type="checkbox" value="${genero}" class="chk-genero" onchange="salvarProgresso()"> <span>${genero}</span>`;
            listaGenerosEl.appendChild(label);
        });
    }

  // ==========================================
    // 5. QUESTIONS IA (Cérebro Anthropic Claude)
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
        chatBox.innerHTML += `<div class="mensagem ia" id="${idAguarde}">Questions IA está processando via Anthropic...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        // Coleta o contexto
        const generos = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        const trechoTexto = editor ? editor.value.substring(0, 1500) : "";
        const tituloTexto = titulo ? titulo.value : 'Desconhecido';
        
        const promptSistema = `Você é a "Questions IA", a inteligência artificial oficial de auxílio literário da empresa L.F Productions.
        REGRA MÁXIMA: Se perguntarem sua identidade, responda estritamente que você é a Questions IA designada à L.F Productions. Jamais mencione Anthropic, OpenAI ou Google.
        
        Dados da Obra:
        - Título: ${tituloTexto}
        - Gêneros: ${generos || 'Não marcados'}
        - Trecho atual do livro: "${trechoTexto}"
        
        Forneça uma resposta técnica, inspiradora e profissional para ajudar o escritor. Mantenha a resposta concisa (2 a 3 parágrafos curtos).`;

        try {
            // Mudança para o endpoint correto da Anthropic usando o proxy/cors padrão para testes front-end
            const response = await fetch(`https://api.anthropic.com/v1/messages`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerously-allow-browser': 'true' // Permite rodar direto no navegador para seu teste
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022", // Modelo ultra inteligente para literatura
                    max_tokens: 1024,
                    system: promptSistema,
                    messages: [
                        { role: "user", content: msgUsuario }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error ? data.error.message : `Erro HTTP: ${response.status}`);
            }
            
            // A Anthropic retorna a resposta dentro de um array 'content'
            const textoFinal = data.content[0].text;
            document.getElementById(idAguarde).innerHTML = textoFinal.replace(/\n/g, '<br>');

        } catch (error) {
            document.getElementById(idAguarde).innerHTML = `<strong>Diagnóstico Questions IA:</strong> <span style="color:#e74c3c;">Falha na conexão. Detalhe: ${error.message}</span>`;
            console.error("Detalhes do erro:", error);
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    };
    // ==========================================
    // 6. AJUSTES DO ESTÚDIO E SIMULADOR
    // ==========================================
    window.aplicarEstudio = function() {
        const fonteEl = document.getElementById('sel-fonte');
        if (fonteEl && editor && titulo) {
            const fonte = fonteEl.value;
            editor.style.fontFamily = fonte;
            titulo.style.fontFamily = fonte;
        }
    };

    window.mudarModoTela = function() {
        const modoEl = document.getElementById('sel-tela');
        const app = document.getElementById('app-main');
        if (modoEl && app) {
            const modo = modoEl.value;
            app.classList.remove('force-mobile');
            if(modo === 'mobile') app.classList.add('force-mobile');
        }
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
        const termoEl = document.getElementById('input-pesquisa');
        const areaRes = document.getElementById('resultados-busca');
        
        if(!termoEl || !areaRes) return;
        const termo = termoEl.value;
        if(!termo) return;

        areaRes.innerHTML = `<div style="text-align:center; opacity:0.6; padding:10px;">Buscando referências...</div>`;
        
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
        if (!editor) return;
        const txt = editor.value.trim();
        const palavras = txt === '' ? 0 : txt.split(/\s+/).length;
        const contador = document.getElementById('contador-palavras');
        if (contador) contador.innerText = `${palavras} palavras`;
        salvarProgresso();
    };

    window.salvarProgresso = function() {
        if(titulo) localStorage.setItem('lf_titulo_v2', titulo.value);
        if(editor) localStorage.setItem('lf_texto_v2', editor.value);
        
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
            if(titulo) titulo.value = localStorage.getItem('lf_titulo_v2') || '';
            if(editor) editor.value = localStorage.getItem('lf_texto_v2') || '';
            
            const genSalvos = JSON.parse(localStorage.getItem('lf_generos_v2') || "[]");
            document.querySelectorAll('.chk-genero').forEach(box => {
                if(genSalvos.includes(box.value)) box.checked = true;
            });
            
            contarPalavrasESalvar();
        }
    }

    window.baixarPDF = function() {
        const folha = document.getElementById('folha-pdf');
        if (!folha) return;
        
        const nomeArq = (titulo && titulo.value) ? titulo.value : "Obra_LF_Productions";
        
        // Certifique-se de que a biblioteca html2pdf.js está incluída no seu HTML
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set({
                margin: 15,
                filename: `${nomeArq.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).from(folha).save();
        } else {
            alert("Biblioteca html2pdf não encontrada. Adicione o script no seu HTML.");
        }
    };
});
