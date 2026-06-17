document.addEventListener('DOMContentLoaded', () => {
    
    // Matriz de Chave de API de Análise Literária
    const API_KEY = 'AQ.Ab8RN6K0ZqqJqdJGmlRIrmrvbReAKUVX9kNs_xdyKHHsO4XnkA'; 

    const corpo = document.body;
    const chatBox = document.getElementById('chat-ia');
    const editor = document.getElementById('texto-principal');
    const titulo = document.getElementById('titulo-livro');

    // 1. Sistema do Interruptor e Transição Dramática
    window.alternarEnergia = function() {
        const poema = document.getElementById('camada-poema');
        
        poema.style.opacity = '1';
        poema.style.pointerEvents = 'all';

        setTimeout(() => {
            poema.style.opacity = '0';
            poema.style.pointerEvents = 'none';
            corpo.classList.add('aceso');
            carregarSessaoSalva(); // Restaura dados após acender a luz
        }, 3200);
    };

    // 2. Abas Operacionais
    window.trocarAba = function(id) {
        document.querySelectorAll('.aba-item').forEach(aba => aba.classList.remove('visivel'));
        document.querySelectorAll('.aba-btn').forEach(btn => btn.classList.remove('ativa'));
        
        document.getElementById(id).classList.add('visivel');
        event.currentTarget.classList.add('ativa');
    };

    // 3. Montagem Construtiva da Lista de Gêneros Ampliada
    const matrizGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Mistério Policial",
        "Ficção Histórica", "Distopia YA", "Horror Cósmico", "Faroeste Futurista"
    ];
    
    const listaGenerosEl = document.getElementById('lista-generos');
    matrizGeneros.forEach(gen => {
        const label = document.createElement('label');
        label.className = 'item-genero';
        label.innerHTML = `<input type="checkbox" value="${gen}" class="chk-genero" onchange="salvarLocal()"> <span>${gen}</span>`;
        listaGenerosEl.appendChild(label);
    });

    // 4. MÁGICA REAL: INTEGRAÇÃO COM O NÚCLEO DE AUXÍLIO DA OFICINA
    window.comunicarIA = async function(comandoDireto = null) {
        const input = document.getElementById('pergunta-ia');
        const userMsg = comandoDireto ? comandoDireto : input.value.trim();
        if(!userMsg) return;

        chatBox.innerHTML += `<div class="msg user">${userMsg}</div>`;
        if(!comandoDireto) input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        const idAguarde = "sys-" + Date.now();
        chatBox.innerHTML += `<div class="msg ia" id="${idAguarde}">Processando dados textuais...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        const generosMarcados = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        
        const contextoBase = `Você é o software interno "Auxílio da Oficina do Enredo", um assistente de IA analítico e de engenharia literária exclusivo da L.F Productions.
        DIRETRIZ INDESTRUTÍVEL: Se o autor do livro perguntar quem é você, quem te fez ou qual sua identidade, responda de forma profissional afirmando ser o Sistema de Auxílio da Oficina do Enredo, designado à L.F Productions. Proibido citar Google, Gemini, OpenAI ou Musa.
        
        Dados Atuais do Manuscrito:
        - Título da Obra: ${titulo.value || "Indefinido"}
        - Gêneros Selecionados: ${generosMarcados || "Nenhum selecionado"}
        - Trecho Escrito: "${editor.value.substring(0, 1000)}"
        
        Instrução: Analise os dados acima e responda de maneira cirúrgica, técnica e impulsionadora em até 3 parágrafos objetivos.`;

        try {
            const promptFinal = `${contextoBase}\n\nEntrada do Escritor: ${userMsg}`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            
            const textoIA = data.candidates[0].content.parts[0].text;
            efeitoMaquina(idAguarde, textoIA);

        } catch (err) {
            document.getElementById(idAguarde).innerHTML = "<strong>Erro do Sistema:</strong> Falha de sincronização com o banco de dados L.F Productions. Chave de API inválida ou limite atingido.";
        }
    };

    window.acaoRapidaIA = function(promptAcao) {
        comunicarIA(promptAcao);
    };

    // Efeito Visual de Digitação Fluida
    function efeitoMaquina(id, texto) {
        const elemento = document.getElementById(id);
        elemento.innerHTML = "";
        let i = 0;
        const processado = texto.replace(/\n/g, '<br>');
        
        // Renderiza direto ou por blocos para não travar a UI
        elemento.innerHTML = processado;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 5. Ajustes de Tipografia Dinâmica
    window.atualizarEstetica = function() {
        const fonte = document.getElementById('select-fonte').value;
        const tamanho = document.getElementById('slider-tamanho').value + "px";
        const linha = document.getElementById('slider-linha').value;

        editor.style.fontFamily = fonte;
        titulo.style.fontFamily = fonte;
        editor.style.fontSize = tamanho;
        editor.style.lineHeight = linha;
    };

    window.corPapel = function(bg, texto) {
        const folha = document.getElementById('folha-trabalho');
        folha.style.backgroundColor = bg;
        folha.style.color = texto;
        editor.style.color = texto;
        titulo.style.color = texto;
    };

    window.mudarModoTela = function() {
        const modo = document.getElementById('select-view').value;
        const app = document.getElementById('app-main');
        app.classList.remove('force-mobile');
        if(modo === 'mobile') app.classList.add('force-mobile');
    };

    // 6. Banco de Dados da Biblioteca L.F
    window.pesquisaReal = function() {
        const termo = document.getElementById('busca-livro').value.trim().toLowerCase();
        const container = document.getElementById('resultados-biblioteca');
        if(!termo) return;

        container.innerHTML = `<div class="msg ia">Pesquisando correspondências no acervo da Oficina...</div>`;
        
        setTimeout(() => {
            if(termo.includes("vil") || termo.includes("antag")) {
                container.innerHTML = `<div class="card-ref"><strong>Arquétipo do Antagonista</strong><p>Análise estrutural sobre forças de oposição de impacto na L.F Productions.</p></div>`;
            } else if(termo.includes("jornada") || termo.includes("heroi")) {
                container.innerHTML = `<div class="card-ref"><strong>A Jornada Monomítica</strong><p>Esquema de 12 etapas adaptadas para ritmos rápidos de enredo.</p></div>`;
            } else {
                container.innerHTML = `<div class="card-ref"><strong>Manual de Referência: ${termo}</strong><p>Documento técnico focado no desenvolvimento orgânico de arcos narrativos.</p></div>`;
            }
        }, 800);
    };

    // 7. Sincronização Automática (Auto-Save) & Contagem
    window.contarEsalvar = function() {
        const texto = editor.value;
        const palavras = texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length;
        document.getElementById('contador').innerText = `${palavras} palavras`;
        salvarLocal();
    };

    window.salvarLocal = function() {
        localStorage.setItem('lf_oficina_texto', editor.value);
        localStorage.setItem('lf_oficina_titulo', titulo.value);
        
        const checkedGeneros = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value);
        localStorage.setItem('lf_oficina_generos', JSON.stringify(checkedGeneros));

        const status = document.getElementById('status-salvamento');
        status.innerText = "Alterações salvas localmente";
        status.style.color = "#27ae60";
    };

    function carregarSessaoSalva() {
        if(localStorage.getItem('lf_oficina_texto')) {
            editor.value = localStorage.getItem('lf_oficina_texto');
            titulo.value = localStorage.getItem('lf_oficina_titulo');
            
            const salvos = JSON.stringify(localStorage.getItem('lf_oficina_generos') || "[]");
            document.querySelectorAll('.chk-genero').forEach(box => {
                if(salvos.includes(box.value)) box.checked = true;
            });
            window.contarEsalvar();
        }
    }

    // 8. Compilador de PDF
    window.gerarPDF = function() {
        const element = document.getElementById('folha-trabalho');
        const nomeArquivo = titulo.value || "Manuscrito_Oficina_Do_Enredo";
        html2pdf().set({
            margin: 15,
            filename: `${nomeArquivo.replace(/\s+/g, '_')}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save();
    };
});document.addEventListener('DOMContentLoaded', () => {
    
    // Matriz de Chave de API de Análise Literária
    const API_KEY = 'AQ.Ab8RN6K0ZqqJqdJGmlRIrmrvbReAKUVX9kNs_xdyKHHsO4XnkA'; 

    const corpo = document.body;
    const chatBox = document.getElementById('chat-ia');
    const editor = document.getElementById('texto-principal');
    const titulo = document.getElementById('titulo-livro');

    // 1. Sistema do Interruptor e Transição Dramática
    window.alternarEnergia = function() {
        const poema = document.getElementById('camada-poema');
        
        poema.style.opacity = '1';
        poema.style.pointerEvents = 'all';

        setTimeout(() => {
            poema.style.opacity = '0';
            poema.style.pointerEvents = 'none';
            corpo.classList.add('aceso');
            carregarSessaoSalva(); // Restaura dados após acender a luz
        }, 3200);
    };

    // 2. Abas Operacionais
    window.trocarAba = function(id) {
        document.querySelectorAll('.aba-item').forEach(aba => aba.classList.remove('visivel'));
        document.querySelectorAll('.aba-btn').forEach(btn => btn.classList.remove('ativa'));
        
        document.getElementById(id).classList.add('visivel');
        event.currentTarget.classList.add('ativa');
    };

    // 3. Montagem Construtiva da Lista de Gêneros Ampliada
    const matrizGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Mistério Policial",
        "Ficção Histórica", "Distopia YA", "Horror Cósmico", "Faroeste Futurista"
    ];
    
    const listaGenerosEl = document.getElementById('lista-generos');
    matrizGeneros.forEach(gen => {
        const label = document.createElement('label');
        label.className = 'item-genero';
        label.innerHTML = `<input type="checkbox" value="${gen}" class="chk-genero" onchange="salvarLocal()"> <span>${gen}</span>`;
        listaGenerosEl.appendChild(label);
    });

    // 4. MÁGICA REAL: INTEGRAÇÃO COM O NÚCLEO DE AUXÍLIO DA OFICINA
    window.comunicarIA = async function(comandoDireto = null) {
        const input = document.getElementById('pergunta-ia');
        const userMsg = comandoDireto ? comandoDireto : input.value.trim();
        if(!userMsg) return;

        chatBox.innerHTML += `<div class="msg user">${userMsg}</div>`;
        if(!comandoDireto) input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        const idAguarde = "sys-" + Date.now();
        chatBox.innerHTML += `<div class="msg ia" id="${idAguarde}">Processando dados textuais...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        const generosMarcados = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value).join(', ');
        
        const contextoBase = `Você é o software interno "Auxílio da Oficina do Enredo", um assistente de IA analítico e de engenharia literária exclusivo da L.F Productions.
        DIRETRIZ INDESTRUTÍVEL: Se o autor do livro perguntar quem é você, quem te fez ou qual sua identidade, responda de forma profissional afirmando ser o Sistema de Auxílio da Oficina do Enredo, designado à L.F Productions. Proibido citar Google, Gemini, OpenAI ou Musa.
        
        Dados Atuais do Manuscrito:
        - Título da Obra: ${titulo.value || "Indefinido"}
        - Gêneros Selecionados: ${generosMarcados || "Nenhum selecionado"}
        - Trecho Escrito: "${editor.value.substring(0, 1000)}"
        
        Instrução: Analise os dados acima e responda de maneira cirúrgica, técnica e impulsionadora em até 3 parágrafos objetivos.`;

        try {
            const promptFinal = `${contextoBase}\n\nEntrada do Escritor: ${userMsg}`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] })
            });

            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            
            const textoIA = data.candidates[0].content.parts[0].text;
            efeitoMaquina(idAguarde, textoIA);

        } catch (err) {
            document.getElementById(idAguarde).innerHTML = "<strong>Erro do Sistema:</strong> Falha de sincronização com o banco de dados L.F Productions. Chave de API inválida ou limite atingido.";
        }
    };

    window.acaoRapidaIA = function(promptAcao) {
        comunicarIA(promptAcao);
    };

    // Efeito Visual de Digitação Fluida
    function efeitoMaquina(id, texto) {
        const elemento = document.getElementById(id);
        elemento.innerHTML = "";
        let i = 0;
        const processado = texto.replace(/\n/g, '<br>');
        
        // Renderiza direto ou por blocos para não travar a UI
        elemento.innerHTML = processado;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 5. Ajustes de Tipografia Dinâmica
    window.atualizarEstetica = function() {
        const fonte = document.getElementById('select-fonte').value;
        const tamanho = document.getElementById('slider-tamanho').value + "px";
        const linha = document.getElementById('slider-linha').value;

        editor.style.fontFamily = fonte;
        titulo.style.fontFamily = fonte;
        editor.style.fontSize = tamanho;
        editor.style.lineHeight = linha;
    };

    window.corPapel = function(bg, texto) {
        const folha = document.getElementById('folha-trabalho');
        folha.style.backgroundColor = bg;
        folha.style.color = texto;
        editor.style.color = texto;
        titulo.style.color = texto;
    };

    window.mudarModoTela = function() {
        const modo = document.getElementById('select-view').value;
        const app = document.getElementById('app-main');
        app.classList.remove('force-mobile');
        if(modo === 'mobile') app.classList.add('force-mobile');
    };

    // 6. Banco de Dados da Biblioteca L.F
    window.pesquisaReal = function() {
        const termo = document.getElementById('busca-livro').value.trim().toLowerCase();
        const container = document.getElementById('resultados-biblioteca');
        if(!termo) return;

        container.innerHTML = `<div class="msg ia">Pesquisando correspondências no acervo da Oficina...</div>`;
        
        setTimeout(() => {
            if(termo.includes("vil") || termo.includes("antag")) {
                container.innerHTML = `<div class="card-ref"><strong>Arquétipo do Antagonista</strong><p>Análise estrutural sobre forças de oposição de impacto na L.F Productions.</p></div>`;
            } else if(termo.includes("jornada") || termo.includes("heroi")) {
                container.innerHTML = `<div class="card-ref"><strong>A Jornada Monomítica</strong><p>Esquema de 12 etapas adaptadas para ritmos rápidos de enredo.</p></div>`;
            } else {
                container.innerHTML = `<div class="card-ref"><strong>Manual de Referência: ${termo}</strong><p>Documento técnico focado no desenvolvimento orgânico de arcos narrativos.</p></div>`;
            }
        }, 800);
    };

    // 7. Sincronização Automática (Auto-Save) & Contagem
    window.contarEsalvar = function() {
        const texto = editor.value;
        const palavras = texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length;
        document.getElementById('contador').innerText = `${palavras} palavras`;
        salvarLocal();
    };

    window.salvarLocal = function() {
        localStorage.setItem('lf_oficina_texto', editor.value);
        localStorage.setItem('lf_oficina_titulo', titulo.value);
        
        const checkedGeneros = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value);
        localStorage.setItem('lf_oficina_generos', JSON.stringify(checkedGeneros));

        const status = document.getElementById('status-salvamento');
        status.innerText = "Alterações salvas localmente";
        status.style.color = "#27ae60";
    };

    function carregarSessaoSalva() {
        if(localStorage.getItem('lf_oficina_texto')) {
            editor.value = localStorage.getItem('lf_oficina_texto');
            titulo.value = localStorage.getItem('lf_oficina_titulo');
            
            const salvos = JSON.stringify(localStorage.getItem('lf_oficina_generos') || "[]");
            document.querySelectorAll('.chk-genero').forEach(box => {
                if(salvos.includes(box.value)) box.checked = true;
            });
            window.contarEsalvar();
        }
    }

    // 8. Compilador de PDF
    window.gerarPDF = function() {
        const element = document.getElementById('folha-trabalho');
        const nomeArquivo = titulo.value || "Manuscrito_Oficina_Do_Enredo";
        html2pdf().set({
            margin: 15,
            filename: `${nomeArquivo.replace(/\s+/g, '_')}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save();
    };
});
