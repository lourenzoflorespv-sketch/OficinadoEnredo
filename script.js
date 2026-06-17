document.addEventListener('DOMContentLoaded', () => {
    
    // --- SUA CHAVE DA API ---
    const API_KEY = 'AQ.Ab8RN6K0ZqqJqdJGmlRIrmrvbReAKUVX9kNs_xdyKHHsO4XnkA'; 

    const corpo = document.body;
    let luzLigada = false;
    let temaEscuro = false;

    // Elementos Base
    const chatBox = document.getElementById('chat-ia');
    const inputIa = document.getElementById('input-ia');
    const editor = document.getElementById('editor-texto');
    const titulo = document.getElementById('titulo-obra');

    // 1. O INTERRUPTOR (Animação Original L.F)
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

    // 2. SISTEMA DE ABAS (Glassmorphism Sidebar)
    window.mudarAba = function(abaId) {
        document.querySelectorAll('.tab-conteudo').forEach(tab => tab.classList.remove('visivel'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
        
        document.getElementById(abaId).classList.add('visivel');
        event.target.classList.add('ativo');
    };

    // 3. GÊNEROS LITERÁRIOS
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

    // 4. MUSA IA DA L.F PRODUCTIONS (O Cérebro)
    window.enviarMensagemIA = async function(textoForcado = null) {
        const msgUsuario = textoForcado ? textoForcado : inputIa.value.trim();
        if (!msgUsuario) return;

        chatBox.innerHTML += `<div class="mensagem user">${msgUsuario}</div>`;
        if(!textoForcado) inputIa.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        const idAguarde = "sys-" + Date.now();
        chatBox.innerHTML += `<div class="mensagem ia" id="${idAguarde}">Analisando os dados da Oficina...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        const generos = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        
        const promptSistema = `Você é a IA oficial de auxílio literário da empresa L.F Productions.
        REGRA MÁXIMA: Se perguntarem sua identidade ou criador, responda estritamente que é a IA designada à L.F Productions. Jamais mencione o Google ou Gemini.
        
        Dados da Obra:
        - Título: ${titulo.value || 'Desconhecido'}
        - Gêneros: ${generos || 'Não marcados'}
        - Trecho atual do livro: "${editor.value.substring(0, 1500)}"
        
        O escritor solicitou: "${msgUsuario}"
        
        Forneça uma resposta técnica, inspiradora e profissional para ajudar o escritor. Mantenha a resposta concisa (2 a 3 parágrafos).`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptSistema }] }] })
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            
            const textoFinal = data.candidates[0].content.parts[0].text;
            document.getElementById(idAguarde).innerHTML = textoFinal.replace(/\n/g, '<br>');

        } catch (error) {
            document.getElementById(idAguarde).innerHTML = `<strong>Aviso da L.F Productions:</strong> Falha de conexão. Verifique se a chave de API inserida no script é válida.`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    window.acaoIA = function(texto) {
        enviarMensagemIA(texto);
    };

    window.verificarEnter = function(e) {
        if(e.key === 'Enter') enviarMensagemIA();
    };

    // 5. AJUSTES DO ESTÚDIO E SIMULADOR
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

    // 6. BIBLIOTECA SIMULADA
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

    // 7. AUTO-SAVE E GERADOR DE PDF
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
        status.innerText = "Salvo ✓";
        status.style.color = "#4caf50";
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
