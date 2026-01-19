document.addEventListener('DOMContentLoaded', () => {
    
    // --- ESTADO INICIAL ---
    let luzLigada = false;
    const corpo = document.body;
    
    // Lista de Gêneros (Simulando uma API grande)
    // Para chegar em 300, seria uma lista imensa, aqui coloquei as categorias principais
    // que se desdobram na lógica da IA.
    const categoriasGeneros = [
        "Fantasia Épica", "Realismo Mágico", "Cyberpunk Noir", "Romance de Época",
        "Thriller Psicológico", "Terror Gótico", "Space Opera", "Distopia Young Adult",
        "Mistério Policial", "Steampunk", "Comédia Romântica", "Ficção Histórica",
        "Drama Familiar", "Horror Cósmico", "Faroeste Futurista", "Sátira Política"
    ];

    // --- 1. CONFIGURAÇÃO DA UI ---
    
    // Renderizar Gêneros
    const listaGenerosEl = document.getElementById('lista-generos');
    categoriasGeneros.forEach(genero => {
        const div = document.createElement('label');
        div.className = 'opcao-genero';
        div.innerHTML = `
            <input type="checkbox" value="${genero}" class="chk-genero">
            <span>${genero}</span>
        `;
        listaGenerosEl.appendChild(div);
    });

    // --- 2. CONTROLE DE LUZ (O Interruptor) ---
    window.alternarEnergia = function() {
        luzLigada = !luzLigada;
        const label = document.querySelector('.label-luz');
        
        if(luzLigada) {
            corpo.classList.remove('theme-dark');
            corpo.classList.add('theme-light');
            label.innerText = "Apagar";
        } else {
            corpo.classList.remove('theme-light');
            corpo.classList.add('theme-dark');
            label.innerText = "Iluminar";
        }
    };

    // --- 3. CONTADOR DE PALAVRAS ---
    window.contarPalavras = function() {
        const texto = document.getElementById('editor-texto').value;
        const numPalavras = texto.trim() === '' ? 0 : texto.trim().split(/\s+/).length;
        document.getElementById('contador-palavras').innerText = `${numPalavras} palavras`;
    };

    // --- 4. SISTEMA DE "MUSA IA" (Assistente) ---
    window.invocarMusa = function() {
        const selecionados = Array.from(document.querySelectorAll('.chk-genero:checked')).map(x => x.value);
        const caixaResp = document.getElementById('ia-resposta');
        
        if(selecionados.length === 0) {
            caixaResp.style.color = "#d9534f";
            caixaResp.innerText = "Por favor, selecione ao menos um gênero na lista acima.";
            return;
        }

        caixaResp.style.color = "#666";
        caixaResp.innerHTML = `<span class="material-icons" style="font-size:14px; animation:spin 1s infinite">sync</span> Analisando ${selecionados.length} estilos...`;

        // Simulando processamento da IA
        setTimeout(() => {
            const dicas = [
                "Que tal introduzir um objeto que simbolize o conflito interno do protagonista?",
                "Tente descrever o cenário usando apenas o olfato e a audição agora.",
                "Crie uma reviravolta onde o aliado mais fiel guarda um segredo sombrio.",
                "O clima está calmo demais. Faça o ambiente refletir a tempestade que virá.",
                "Use frases curtas no próximo parágrafo para aumentar a tensão."
            ];
            const dicaAleatoria = dicas[Math.floor(Math.random() * dicas.length)];
            
            caixaResp.innerHTML = `<strong>Sugestão:</strong> "${dicaAleatoria}"`;
        }, 1000);
    };

    // --- 5. SISTEMA DE BIBLIOTECA (Pesquisa) ---
    window.pesquisarLivros = function() {
        const termo = document.getElementById('input-pesquisa').value;
        const areaResultados = document.getElementById('resultados-busca');
        
        if(!termo) return;

        areaResultados.innerHTML = `<div style="text-align:center; padding:20px; opacity:0.6">Buscando referências sobre "${termo}"...</div>`;

        setTimeout(() => {
            areaResultados.innerHTML = `
                <div class="livro-card">
                    <strong style="font-family:'Cormorant Garamond', serif; font-size:1.2rem">A Arte de Escrever sobre ${termo}</strong>
                    <div style="font-size:0.8rem; color:#888; margin:5px 0">Autor Desconhecido • 1924</div>
                    <p style="font-size:0.9rem; color:#555">Um guia clássico que explora as nuances de ${termo} na literatura moderna.</p>
                </div>
                <div class="livro-card">
                    <strong style="font-family:'Cormorant Garamond', serif; font-size:1.2rem">Enciclopédia Visual: ${termo}</strong>
                    <div style="font-size:0.8rem; color:#888; margin:5px 0">Editora Globo • 2018</div>
                    <p style="font-size:0.9rem; color:#555">Referências visuais e descritivas para enriquecer sua narrativa.</p>
                </div>
            `;
        }, 800);
    };

});