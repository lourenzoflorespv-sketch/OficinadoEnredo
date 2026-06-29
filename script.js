document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CONFIGURAÇÃO DA API 
    // ==========================================
    // Cole sua NOVA chave ativa aqui entre as aspas:
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
            if(poema) poema.style.opacity = '1';
            
            setTimeout(() => {
                if(poema) poema.style.opacity = '0';
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
        
        const abaAlvo = document.getElementById(abaId);
        if(abaAlvo) abaAlvo.classList.add('visivel');
        
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
        listaGenerosEl.innerHTML = ''; // Evita duplicar elementos
        categoriasGeneros.forEach(genero => {
            const label = document.createElement('label');
            label.className = 'opcao-genero';
            label.innerHTML = `<input type="checkbox" value="${genero}" class="chk-genero" onchange="salvarProgresso()"> <span>${genero}</span>`;
            listaGenerosEl.appendChild(label);
        });
    }

   // ==========================================
    // 5. QUESTIONS IA (Cérebro Anthropic Claude com Proxy)
    // ==========================================
    window.enviarMensagemIA = async function(textoForcado = null) {
        const msgUsuario = textoForcado ? textoForcado : inputIa.value.trim();
        if (!msgUsuario) return;

        // Imprime a mensagem do usuário no chat
        if(chatBox) {
            chatBox.innerHTML += `<div class="mensagem user">${msgUsuario}</div>`;
            if(!textoForcado) inputIa.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Cria o balão de carregamento provisório
        const idAguarde = "sys-" + Date.now();
        if(chatBox) {
            chatBox.innerHTML += `<div class="mensagem ia" id="${idAguarde}">Questions IA está processando via Anthropic...</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Coleta o contexto dinâmico do editor
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
            const urlProxy = 'https://cors-anywhere.herokuapp.com/';
            const urlAnthropic = 'https://api.anthropic.com/v1/messages';

            const response = await fetch(urlProxy + urlAnthropic, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022", 
                    max_tokens: 1024,
                    system: promptSistema,
                    messages: [
                        { role: "user", content: msgUsuario }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const elementoDestino = document.getElementById(idAguarde);
            
            if (!response.ok) {
                if(response.status === 403) {
                    throw new Error("A requisição foi bloqueada pelo Proxy CORS. Você precisa ativar o acesso temporário em: https://cors-anywhere.herokuapp.com/corsdemo");
                }
                if(response.status === 401) {
                    throw new Error("A chave de API fornecida é inválida, expirou ou foi revogada pelo provedor de segurança.");
                }
                throw new Error(data.error ? data.error.message : `Erro HTTP ${response.status}`);
            }
            
            if(elementoDestino && data.content && data.content[0]) {
                const textoFinal = data.content[0].text;
                elementoDestino.innerHTML = textoFinal.replace(/\n/g, '<br>');
            }

        } catch (error) {
            const elementoDestino = document.getElementById(idAguarde);
            if(elementoDestino) {
                // Mensagem personalizada detalhando o motivo específico da falha
                elementoDestino.innerHTML = `
                    <div style="padding: 5px 0;">
                        <strong>⚠️ Diagnóstico Temporário (Questions IA):</strong><br>
                        <span style="color:#e74c3c; font-size: 0.85rem;">
                            Não foi possível carregar a resposta devido a um problema técnico específico.<br>
                            <strong>Causa provável:</strong> ${error.message}
                        </span>
                    </div>`;
            }
            console.error("Detalhes técnicos do erro:", error);
        }
        
        if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
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
