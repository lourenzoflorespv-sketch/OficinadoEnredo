/* --- VARIÁVEIS DE TEMA (Paleta de Cores) --- */
:root {
    --bg-dark: #0a0e14; 
    --text-dark: #a0a0a0;
    --bg-light: #f4f1ea; 
    --text-light: #2d2a26; 
    --papel: #ffffff;
    --accent: #c4a068; 
    --accent-hover: #d4af37;
    --glass-bg: rgba(255, 255, 255, 0.75);
    --glass-border: 1px solid rgba(255, 255, 255, 0.9);
    --shadow-nice: 0 12px 30px rgba(0,0,0,0.06);
    --font-texto: 'Cormorant Garamond', serif;
}

* { box-sizing: border-box; outline: none; margin: 0; padding: 0; }

body {
    height: 100vh;
    font-family: 'Montserrat', sans-serif;
    overflow: hidden;
    transition: background-color 1.2s ease, color 1s ease;
}

/* --- ESTADOS --- */
body.theme-dark { background: var(--bg-dark); color: var(--text-dark); }
body.theme-light { background-color: var(--bg-light); color: var(--text-light); }

body.theme-dark .interface-app {
    opacity: 0; transform: scale(0.96); pointer-events: none; filter: blur(8px);
}
body.theme-light #overlay-escuro {
    opacity: 0; pointer-events: none;
}
body.theme-light .interface-app {
    opacity: 1; transform: scale(1); filter: blur(0); pointer-events: all;
}

/* --- OVERLAY ESCURO --- */
#overlay-escuro {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; justify-content: center; align-items: center; z-index: 100;
    transition: opacity 1.5s ease;
}
.boas-vindas { text-align: center; }
.titulo-intro {
    font-family: 'Cormorant Garamond', serif; font-size: 4rem; font-weight: 300;
    letter-spacing: 4px; color: var(--accent); margin-bottom: 10px;
    text-shadow: 0 0 20px rgba(196, 160, 104, 0.2);
}
.subtitulo-intro { font-weight: 300; opacity: 0.6; font-size: 1.1rem; font-style: italic; }

/* --- INTERRUPTOR --- */
.interruptor-container { margin-top: 50px; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
.botao-luz {
    width: 70px; height: 70px; border-radius: 50%;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
#icone-luz { font-size: 32px; color: #666; transition: 0.4s; }
.label-luz { margin-top: 15px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.5; }

/* --- LAYOUT APP --- */
.interface-app { display: flex; height: 100vh; padding: 20px; gap: 20px; transition: all 1.2s ease; }

.painel-vidro {
    flex: 0 0 350px; background: var(--glass-bg); backdrop-filter: blur(20px);
    border: var(--glass-border); border-radius: 16px; padding: 25px;
    box-shadow: var(--shadow-nice); display: flex; flex-direction: column;
}

.cabecalho-painel { display: flex; align-items: center; gap: 10px; padding-bottom: 15px; color: var(--accent); }
.cabecalho-painel h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: var(--text-light); }

/* Abas */
.tabs-nav { display: flex; gap: 10px; border-bottom: 1px solid rgba(0,0,0,0.1); margin-bottom: 15px; }
.tab-btn {
    flex: 1; background: none; border: none; padding: 10px 0; font-family: 'Montserrat';
    font-size: 0.85rem; font-weight: 600; color: #888; cursor: pointer; transition: 0.3s;
}
.tab-btn.ativo { color: var(--accent); border-bottom: 2px solid var(--accent); }
.tab-conteudo { display: none; flex: 1; flex-direction: column; overflow: hidden; }
.tab-conteudo.visivel { display: flex; }

/* Scroll */
.scroll-customizado { overflow-y: auto; padding-right: 5px; }
.scroll-customizado::-webkit-scrollbar { width: 5px; }
.scroll-customizado::-webkit-scrollbar-thumb { background: #ccc; border-radius: 5px; }

/* Gêneros */
.opcao-genero { display: flex; align-items: center; padding: 10px; margin-bottom: 5px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; }
.opcao-genero:hover { background: rgba(196, 160, 104, 0.1); }
.opcao-genero input { margin-right: 12px; accent-color: var(--accent); transform: scale(1.2); }

/* --- CHAT DA IA REAL --- */
.assistente-ia {
    margin-top: auto; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 15px;
    display: flex; flex-direction: column; height: 300px;
}
#chat-ia { flex: 1; display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
.mensagem { padding: 10px 15px; border-radius: 12px; font-size: 0.85rem; line-height: 1.4; max-width: 90%; }
.mensagem.ia { background: rgba(196, 160, 104, 0.15); align-self: flex-start; color: #333; border-bottom-left-radius: 2px; }
.mensagem.user { background: var(--text-light); color: white; align-self: flex-end; border-bottom-right-radius: 2px; }

.input-chat-container { display: flex; gap: 5px; }
#input-ia { flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 20px; font-family: 'Montserrat'; font-size: 0.85rem; }
.btn-enviar-ia { background: var(--accent); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
.btn-enviar-ia:hover { background: var(--accent-hover); transform: scale(1.05); }

/* Área de Escrita */
.area-escrita {
    flex: 1; background: var(--papel); border-radius: 12px; box-shadow: var(--shadow-nice);
    padding: 50px 70px; display: flex; flex-direction: column; overflow-y: auto;
}
.toolbar-editor { display: flex; justify-content: space-between; align-items: center; color: #999; font-size: 0.8rem; margin-bottom: 30px; text-transform: uppercase; font-weight: 600; }
.btn-top { background: transparent; border: 1px solid #ddd; border-radius: 6px; padding: 5px 10px; color: #666; cursor: pointer; display: flex; align-items: center; gap: 5px; font-family: 'Montserrat'; transition: 0.3s; }
.btn-top:hover { border-color: var(--accent); color: var(--accent); }

#titulo-obra { font-family: var(--font-texto); font-size: 3rem; border: none; width: 100%; margin-bottom: 20px; color: var(--text-light); text-align: center; background: transparent; }
#editor-texto { flex: 1; border: none; resize: none; font-family: var(--font-texto); font-size: 1.4rem; line-height: 1.8; color: #444; background: transparent; }

/* Pesquisa */
.container-busca { display: flex; gap: 5px; margin-bottom: 15px; }
#input-pesquisa { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
.btn-icon { background: var(--accent); color: white; border: none; border-radius: 6px; width: 40px; cursor: pointer; }
.livro-card { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 3px solid var(--accent); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

/* --- RESPONSIVIDADE (CELULAR E PC) --- */
@media (max-width: 900px) {
    .interface-app { flex-direction: column; padding: 10px; gap: 10px; overflow-y: auto; }
    .painel-vidro { flex: none; height: auto; max-height: 50vh; }
    .area-escrita { padding: 30px 20px; flex: none; min-height: 80vh; }
    .titulo-intro { font-size: 2.5rem; }
    #titulo-obra { font-size: 2rem; }
    #editor-texto { font-size: 1.2rem; }
    body { overflow-y: auto; }
}