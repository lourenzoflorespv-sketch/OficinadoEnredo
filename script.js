:root {
    --ouro: #c5a059;
    --ouro-claro: #d4af37;
    --preto: #050505;
    --cinza: #1a1a1a;
    --vidro: rgba(255, 255, 255, 0.95);
    --transicao: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
    margin: 0; height: 100vh; width: 100vw;
    font-family: 'Montserrat', sans-serif;
    background: var(--preto);
    color: white; overflow: hidden;
}

/* --- AMBIENTAÇÃO DE FUNDO E LUZ --- */
.fundo-bokeh {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 0; opacity: 0; transition: opacity 2s ease;
    background: radial-gradient(circle at center, #232731, #000);
}
.bolha {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15;
    animation: flutuar 25s infinite alternate;
}
.b1 { width: 50vw; height: 50vw; background: var(--ouro); top: -10%; left: -10%; }
.b2 { width: 40vw; height: 40vw; background: #4a5568; bottom: -10%; right: -10%; }
@keyframes flutuar { from { transform: translate(0,0); } to { transform: translate(60px, 60px); } }

/* --- INTERRUPTOR MASTER --- */
#container-interruptor {
    position: fixed; z-index: 1000; top: 50%; left: 50%;
    transform: translate(-50%, -50%); text-align: center; cursor: pointer;
    transition: var(--transicao);
}
.aro-luz {
    width: 140px; height: 140px; border-radius: 50%;
    border: 2px solid #333; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 40px rgba(0,0,0,1); transition: 0.5s;
}
.botao-luz {
    width: 90px; height: 90px; border-radius: 50%; background: #111;
    display: flex; align-items: center; justify-content: center; color: #555;
}
.botao-luz .material-icons { font-size: 36px; }
#label-interruptor { margin-top: 20px; text-transform: uppercase; letter-spacing: 4px; font-size: 0.75rem; color: #777; }

body.aceso { background: #e9e5df; }
body.aceso .fundo-bokeh { opacity: 1; }
body.aceso #container-interruptor { top: 92%; left: 92%; transform: scale(0.4); opacity: 0.5; }
body.aceso .aro-luz { border-color: var(--ouro); box-shadow: 0 0 30px var(--ouro); }
body.aceso .botao-luz { background: var(--ouro); color: white; }

/* --- TELA POÉTICA --- */
#camada-poema {
    position: fixed; width: 100%; height: 100%; background: #000;
    z-index: 900; display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: 1.5s;
}
.bloco-poema { text-align: center; padding: 40px; }
.texto-poema { font-family: 'Cormorant Garamond'; font-size: 2.4rem; font-style: italic; margin-bottom: 25px; color: #eee; line-height: 1.4; }
.autor-poema { color: var(--ouro); letter-spacing: 3px; font-size: 0.85rem; text-transform: uppercase; }

/* --- PAINÉIS DE INTERFACE --- */
.app-container {
    position: relative; z-index: 100; height: 100vh; display: flex;
    opacity: 0; pointer-events: none; transition: 1.5s ease;
}
body.aceso .app-container { opacity: 1; pointer-events: all; }

.sidebar-vidro {
    width: 420px; background: var(--vidro); backdrop-filter: blur(25px);
    border-right: 1px solid rgba(0,0,0,0.08); display: flex; flex-direction: column;
    padding: 25px; color: #222; box-shadow: 8px 0 35px rgba(0,0,0,0.04);
}
.logo-area h1 { font-family: 'Playfair Display'; font-size: 1.8rem; margin: 0; color: var(--ouro); letter-spacing: 1px; }
.logo-area p { font-size: 0.6rem; letter-spacing: 4px; margin-top: 6px; font-weight: bold; color: #666; }

/* Abas */
.abas-nav { display: flex; gap: 5px; margin: 25px 0; border-bottom: 2px solid #eee; }
.aba-btn {
    flex: 1; background: none; border: none; padding: 12px 0; cursor: pointer;
    color: #999; transition: 0.3s; border-bottom: 2px solid transparent; margin-bottom: -2px;
}
.aba-btn .material-icons { font-size: 22px; }
.aba-btn:hover, .aba-btn.ativa { color: var(--ouro); }
.aba-btn.ativa { border-bottom: 2px solid var(--ouro); }

.conteudo-abas { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.aba-item { display: none; height: 100%; flex-direction: column; }
.aba-item.visivel { display: flex; animation: subidaSuave 0.4s ease forwards; }
@keyframes subidaSuave { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

/* CHAT DO AUXÍLIO DA OFICINA */
.ia-acoes-rapidas { display: flex; gap: 6px; margin-bottom: 12px; overflow-x: auto; padding-bottom: 6px; }
.ia-acoes-rapidas button {
    background: white; border: 1px solid #ddd; padding: 6px 14px; border-radius: 20px;
    font-size: 0.7rem; color: #555; cursor: pointer; white-space: nowrap; font-family: inherit; transition: 0.2s;
}
.ia-acoes-rapidas button:hover { border-color: var(--ouro); color: var(--ouro); background: rgba(197,160,89,0.05); }

.chat-container { flex: 1; background: rgba(0,0,0,0.02); border-radius: 10px; padding: 15px; margin-bottom: 12px; border: 1px solid rgba(0,0,0,0.05); }
.msg { padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; font-size: 0.85rem; line-height: 1.6; max-width: 90%; }
.msg.ia { background: white; border-left: 4px solid var(--ouro); box-shadow: 0 4px 12px rgba(0,0,0,0.03); color: #333; align-self: flex-start; }
.msg.user { background: var(--cinza); color: white; align-self: flex-end; border-right: 4px solid var(--ouro-claro); text-align: right; }

.input-area-ia { display: flex; gap: 8px; }
.input-area-ia input { flex: 1; border: 1px solid #ddd; border-radius: 6px; padding: 12px; font-family: inherit; font-size: 0.85rem; background: white; }
.input-area-ia button { background: var(--ouro); border: none; color: white; border-radius: 6px; width: 48px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.input-area-ia button:hover { background: var(--ouro-claro); }

/* SELETOR DE GÊNEROS INTEGRAÇÃO */
.grid-generos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding-top: 10px; }
.item-genero {
    display: flex; align-items: center; gap: 10px; padding: 12px; background: white;
    border: 1px solid #eee; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: 0.2s;
}
.item-genero:hover { border-color: var(--ouro); background: rgba(197,160,89,0.03); }
.item-genero input { accent-color: var(--ouro); transform: scale(1.1); }
.instrucao-aba { font-size: 0.8rem; color: #666; margin-bottom: 10px; font-weight: 500; }

/* BIBLIOTECA */
.busca-caixa { position: relative; margin-bottom: 15px; display: flex; }
.busca-caixa input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit; }
.busca-caixa button { background: var(--ouro); color: white; border: none; padding: 0 15px; border-radius: 0 6px 6px 0; margin-left: -5px; cursor: pointer; }
.card-ref { background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid var(--ouro); box-shadow: 0 2px 6px rgba(0,0,0,0.02); }

/* CONTROLES ESTÚDIO */
.grupo-ajuste { margin-bottom: 25px; }
.grupo-ajuste label { font-size: 0.75rem; font-weight: bold; color: #555; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
.grupo-ajuste select { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid #ddd; font-family: inherit; background: white; }
.slider-container input { width: 100%; accent-color: var(--ouro); }
.cores-papel { display: flex; gap: 12px; }
.cores-papel button { width: 35px; height: 35px; border-radius: 50%; border: 2px solid #ddd; cursor: pointer; }
.c-branco { background: #ffffff; }
.c-creme { background: #fdf6e3; }
.c-dark { background: #1a1a1a; }

.sidebar-footer { border-top: 1px solid #eee; padding-top: 15px; margin-top: auto; display: flex; flex-direction: column; gap: 10px; }
.status-save { font-size: 0.7rem; color: #999; text-align: center; font-weight: 500; }
.btn-acao.download { background: var(--ouro); color: white; border: none; padding: 14px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; }

/* --- PALCO DO MANUSCRITO --- */
.palco-escrita { flex: 1; display: flex; justify-content: center; padding: 40px; overflow-y: auto; background: rgba(0,0,0,0.01); }
.papel {
    width: 100%; max-width: 850px; background: white; min-height: 1100px;
    box-shadow: 0 15px 60px rgba(0,0,0,0.06); padding: 70px 80px; display: flex; flex-direction: column; transition: background 0.3s, color 0.3s;
}
.papel-header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 35px; }
.marca-dagua { font-size: 0.65rem; letter-spacing: 2px; color: #bbb; font-weight: 700; }
#contador { font-size: 0.7rem; color: #999; font-weight: bold; }

#titulo-livro { font-family: 'Playfair Display'; font-size: 2.6rem; border: none; width: 100%; text-align: center; margin-bottom: 25px; outline: none; color: #333; background: transparent; font-weight: 700; }
#texto-principal { flex: 1; border: none; resize: none; outline: none; font-size: 1.25rem; line-height: 1.8; color: #444; background: transparent; font-family: 'Cormorant Garamond', serif; }

/* --- RESPONSIVIDADE E MODOS FORÇADOS --- */
.app-container.force-mobile { flex-direction: column; }
.app-container.force-mobile .sidebar-vidro { width: 100%; height: auto; max-height: 480px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }
.app-container.force-mobile .palco-escrita { padding: 12px; }
.app-container.force-mobile .papel { padding: 40px 24px; min-height: 700px; }

@media (max-width: 900px) {
    .app-container { flex-direction: column; }
    .sidebar-vidro { width: 100%; height: auto; padding: 20px; }
    .grid-generos { grid-template-columns: repeat(2, 1fr); }
    .palco-escrita { padding: 12px; }
    .papel { padding: 40px 24px; min-height: 700px; }
    #titulo-livro { font-size: 2rem; }
    #texto-principal { font-size: 1.15rem; }
}
