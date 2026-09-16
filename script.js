const tabuleiro = document.getElementById('tabuleiro');
const jogador = document.getElementById('vez');
const btnReiniciar = document.getElementById('btnReiniciar');
const modoJogo = document.getElementById("modoJogo");
const tamanho = document.getElementById('tamanhoTabuleiro');

let primeiroPonto = null;
let segundoPonto = null;
let linhasExistentes = new Set();

let jogadorAtual = 1;
let pontosJogador1 = 0;
let pontosJogador2 = 0;

let tamanhoAtual = 4;
let modoAtual = "jogador";
let jogoFinalizado = false;

function criarTabuleiro(tamanho) {
    tamanhoAtual = tamanho;

    tabuleiro.classList.remove("tam-4", "tam-8", "tam-16", "tam-32");
    tabuleiro.classList.add(`tam-${tamanho}`);

    tabuleiro.innerHTML = '';
    // linhasExistentes.clear();
    // jogadorAtual = 1;

    tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;

    for(let linha = 0; linha < tamanho; linha++) {
        for(let coluna = 0; coluna < tamanho; coluna++) {
            criarPontos(linha, coluna);
        }
    }
    
}

function criarPontos(linha, coluna) {
    const ponto = document.createElement('div');
    
    ponto.classList.add("ponto");
    tabuleiro.appendChild(ponto);
    
    ponto.dataset.linha = linha;
    ponto.dataset.coluna = coluna;
    
    ponto.addEventListener('click', () => {
        selecionarPonto(ponto);
    })
}

function selecionarPonto(ponto) {

    if(jogoFinalizado) return;
    if (primeiroPonto === null) {
        primeiroPonto = ponto;
        primeiroPonto.classList.add("selecionado");
        // console.log(`Primeiro ponto selecionado ${primeiroPonto.dataset.linha}`);
    }else{
        segundoPonto = ponto;
        // console.log(`Segundo ponto selecionado ${segundoPonto.dataset.linha}`);
        
        if (saoVizinhos(primeiroPonto, segundoPonto)) {
            if (criarLinha(primeiroPonto, segundoPonto)){
                let quadradosFechados = verificarQuadradosDaJogada(primeiroPonto, segundoPonto);
                if (quadradosFechados > 0) {
                    atualizarPlacar(quadradosFechados);
                    verificarFimDeJogo();
                    limparSelecao()
                }else{
                    trocarJogador();
                    limparSelecao()
                    if(modoAtual === "computador" && jogadorAtual === 2){
                        setTimeout(() => {
                            jogadaComputador();
                        }, 1000);
                    }
                }
            }else{
                limparSelecao()
            }
        }else{
            limparSelecao()
        }
    }
}

function saoVizinhos(ponto1, ponto2) {
    if (ponto1.dataset.linha === ponto2.dataset.linha &&  Math.abs(ponto1.dataset.coluna - ponto2.dataset.coluna) === 1 ) {
        console.log("São vizinhos.")
        return true;
    } else if (ponto1.dataset.coluna === ponto2.dataset.coluna &&Math.abs(ponto1.dataset.linha - ponto2.dataset.linha) === 1) {
        console.log("São vizinhos 2.")
        return true;
    } else {
        console.log("Não são vizinhos.")
        return false;
    }
}

function criarLinha(ponto1, ponto2) {
    const tabuleiroPosicao = tabuleiro.getBoundingClientRect();
    const posicao1 = ponto1.getBoundingClientRect();
    const posicao2 = ponto2.getBoundingClientRect();

    const centroX1 = posicao1.left - tabuleiroPosicao.left + posicao1.width / 2;
    const centroX2 = posicao2.left - tabuleiroPosicao.left + posicao2.width / 2;

    const centroY1 = posicao1.top - tabuleiroPosicao.top + posicao1.height / 2;
    const centroY2 = posicao2.top - tabuleiroPosicao.top + posicao2.height / 2;
    const id = gerarIdLinha(ponto1, ponto2);

    if (linhasExistentes.has(id)) {
        alert("Jogada inválida");
        return false;
    }else{
        if (ponto1.dataset.linha === ponto2.dataset.linha) {
            // console.log("Linha horizontal");
            // console.log(Math.floor(posicao1.left), Math.floor(posicao1.top), Math.floor(posicao2.left), Math.floor(posicao2.top));
    
            const linha = document.createElement("div");
            linha.classList.add("linha");
            if(jogadorAtual === 1) {
                linha.classList.add("jogador1-linha");
            }else{
                linha.classList.add("jogador2-linha");
            }
    
            linha.style.left = `${Math.min(centroX1, centroX2)}px`;
            linha.style.top = `${centroY1}px`;
            linha.style.transform = "translateY(-50%)"
            linha.style.width = `${Math.abs(centroX1 - centroX2)}px`;
            linha.style.height = "2px";

            tabuleiro.appendChild(linha);
            linhasExistentes.add(id);
            // console.log(id);
            // verificarQuadradosDaJogada(ponto1, ponto2);
            return true;
        }else{
            // console.log("Linha vertical");
            // console.log(Math.floor(posicao1.left), Math.floor(posicao1.top), Math.floor(posicao2.left), Math.floor(posicao2.top));
    
            const linha = document.createElement("div");
            linha.classList.add("linha");
    
            if(jogadorAtual === 1) {
                linha.classList.add("jogador1-linha");
            }else{
                linha.classList.add("jogador2-linha");
            }

            linha.style.left = `${centroX1}px`;
            linha.style.top = `${Math.min(centroY1, centroY2)}px`;
            linha.style.transform = "translateX(-50%)";
            linha.style.width = "2px";
            linha.style.height = `${Math.abs(centroY2 - centroY1)}px`;

            tabuleiro.appendChild(linha);
            linhasExistentes.add(id);
            // console.log(id);
            // verificarQuadradosDaJogada(ponto1, ponto2);
            return true;
        }
    }
}

function gerarIdLinha(ponto1, ponto2) {
    // console.log(`Linha 1 ${ponto1.dataset.linha} e Coluna 1 ${ponto1.dataset.coluna} || Linha 2 ${ponto2.dataset.linha} e Coluna 2 ${ponto2.dataset.coluna}`);

    let linha1 = parseInt(ponto1.dataset.linha);
    let coluna1 = parseInt(ponto1.dataset.coluna);
    let linha2 = parseInt(ponto2.dataset.linha);
    let coluna2 = parseInt(ponto2.dataset.coluna);

    if (linha1 > linha2 || (linha1 === linha2 && coluna1 > coluna2)) {
        [linha1, coluna1, linha2, coluna2] = [linha2, coluna2, linha1, coluna1];
    }
    return `${linha1},${coluna1} - ${linha2},${coluna2}`;
}

function verificarQuadradosDaJogada(ponto1, ponto2) {
    let quadradosFechados = 0;

    const linha1 = Number(ponto1.dataset.linha);
    const coluna1 = Number(ponto1.dataset.coluna);

    const linha2 = Number(ponto2.dataset.linha);
    const coluna2 = Number(ponto2.dataset.coluna);
    
    const linhaAtual = linha1;
    const linhaInicial = Math.min(linha1, linha2);
    const colunaInicial = Math.min(coluna1, coluna2);
    const colunaAtual = coluna1;

    if(linha1 === linha2) {
        if(linhaAtual > 0) {
            if(quadradoCompleto(linhaAtual - 1, colunaInicial)) {
                quadradosFechados++;
                marcarQuadrado(linhaAtual - 1, colunaInicial);
            }
        }
        if(linhaAtual < tamanhoAtual - 1){
            if(quadradoCompleto(linhaAtual, colunaInicial)) {
                    quadradosFechados++;
                    marcarQuadrado(linhaAtual, colunaInicial);
                }
        }
    }else{
        if(colunaAtual > 0) {
            if(quadradoCompleto(linhaInicial, colunaAtual - 1)) {
                quadradosFechados++;
                marcarQuadrado(linhaInicial, colunaAtual - 1);
            }
        }
        if(colunaAtual < tamanhoAtual - 1) {
            if(quadradoCompleto(linhaInicial, colunaAtual)) {
                    quadradosFechados++;
                    marcarQuadrado(linhaInicial, colunaAtual);
                }
        }
    }
    return quadradosFechados;
}

function quadradoCompleto(linha, coluna) {
    
    const topo = `${linha},${coluna} - ${linha},${coluna + 1}`;
    const baixo = `${linha + 1},${coluna} - ${linha + 1},${coluna + 1}`;
    const esquerda = `${linha},${coluna} - ${linha + 1},${coluna}`;
    const direita = `${linha},${coluna + 1} - ${linha + 1},${coluna + 1}`;
    
    // console.log(`Esta é a linha do topo: ${topo}`);
    // console.log(`Esta é a linha de baixo: ${baixo}`);
    // console.log(`Esta é a linha da esquerda: ${esquerda}`);
    // console.log(`Esta é a linha da direita: ${direita}`);

    if(linhasExistentes.has(topo)
        && linhasExistentes.has(baixo)
        && linhasExistentes.has(esquerda)
        && linhasExistentes.has(direita)) {
            console.log(`Quadrado ${linha},${coluna} completo`);
            return true;
    }else{
        console.log("Quadrado não foi feito.")
        return false;
    }
}

function marcarQuadrado(linha, coluna) {

    const pontoSupEsq = tabuleiro.querySelector(`.ponto[data-linha="${linha}"][data-coluna="${coluna}"]`);
    const pontoSupDir = tabuleiro.querySelector(`.ponto[data-linha="${linha}"][data-coluna="${coluna + 1}"]`);
    const pontoInfEsq = tabuleiro.querySelector(`.ponto[data-linha="${linha + 1}"][data-coluna="${coluna}"]`);

    const posicaoSupEsq = pontoSupEsq.getBoundingClientRect();
    const posicaoSupDir = pontoSupDir.getBoundingClientRect();
    const posicaoInfEsq = pontoInfEsq.getBoundingClientRect();
    const posicaoTabuleiro = tabuleiro.getBoundingClientRect();

    const centroXEsq = posicaoSupEsq.left - posicaoTabuleiro.left + posicaoSupEsq.width / 2;
    const centroYSup = posicaoSupEsq.top - posicaoTabuleiro.top + posicaoSupEsq.height / 2;

    const centroXDir = posicaoSupDir.left - posicaoTabuleiro.left + posicaoSupDir.width / 2;

    const centroYInf = posicaoInfEsq.top - posicaoTabuleiro.top + posicaoInfEsq.height / 2;

    const largura = centroXDir - centroXEsq;
    const altura = centroYInf - centroYSup;

    const quadrado = document.createElement('div');
    quadrado.classList.add("quadrado");

    if(jogadorAtual === 1) {
        quadrado.classList.add("quadrado-jogador1");
    }else{
        quadrado.classList.add("quadrado-jogador2");
    }

    quadrado.style.left = `${centroXEsq}px`;
    quadrado.style.top = `${centroYSup}px`;
    quadrado.style.width = `${largura}px`;
    quadrado.style.height = `${altura}px`;

    tabuleiro.appendChild(quadrado);
}

function atualizarPlacar(quantidade) {
    const placar1 = document.getElementById("jogador1");
    const placar2 = document.getElementById("jogador2");

    if (jogadorAtual === 1) {
        pontosJogador1 += quantidade;
        placar1.innerHTML = `Jogador 1: ${pontosJogador1}`;
    }else{
        pontosJogador2 += quantidade;
        
        if(modoAtual === "computador"){
            placar2.innerHTML = `Computador: ${pontosJogador2}`;
        }else{
            
            placar2.innerHTML = `Jogador 2: ${pontosJogador2}`;
        }
    }
    
}

function verificarFimDeJogo() {
    const totalQuadrados = (tamanhoAtual - 1) * (tamanhoAtual - 1);
    const mensagemFinal = document.getElementById("mensagemFinal");

    if (totalQuadrados === (pontosJogador1 + pontosJogador2)){
        jogoFinalizado = true;

        if (pontosJogador1 > pontosJogador2) {
            mensagemFinal.textContent = "Jogador 1 Venceu!";
        }else if (pontosJogador1 < pontosJogador2){
            if(modoAtual === "computador") {
                mensagemFinal.textContent = "Computador venceu!";
            }else{
                mensagemFinal.textContent = "Jogador 2 Venceu!";
            }
        }else{
            mensagemFinal.textContent = "Empate!";
        }
    }
}

function limparSelecao() {
    if(primeiroPonto) {
        primeiroPonto.classList.remove("selecionado");
    }
    primeiroPonto = null;
    segundoPonto = null;
}

function trocarJogador(){
    jogador.classList.remove("vez-jogador1", "vez-jogador2")

    if(jogadorAtual === 1) {
        jogadorAtual = 2;

        if(modoAtual === "computador") {
            jogador.textContent = "Vez do Computador";
        }else{
            jogador.textContent = "Vez do Jogador 2."
        }

        jogador.classList.add("vez-jogador2");

    }else{
        jogadorAtual = 1;
        jogador.textContent = "Vez do Jogador 1."
        jogador.classList.add("vez-jogador1");
    }
}

function contarQuadradosPossiveis(ponto1, ponto2) {
    const id = gerarIdLinha(ponto1, ponto2);
    let quantidade = 0;

    linhasExistentes.add(id);

    const linha1 = Number(ponto1.dataset.linha);
    const coluna1 = Number(ponto1.dataset.coluna);

    const linha2 = Number(ponto2.dataset.linha);
    const coluna2 = Number(ponto2.dataset.coluna);

    if(linha1 === linha2) {
        const colunaInicial = Math.min(coluna1, coluna2);
        if(linha1 > 0) {
            if(quadradoCompleto(linha1 - 1, colunaInicial)) {
                quantidade++;
            }
        }
        if(linha1 < tamanhoAtual - 1) {
            if(quadradoCompleto(linha1, colunaInicial)) {
                quantidade++;
            }
        }
    }

    if(coluna1 === coluna2) {
        const linhaInicial = Math.min(linha1, linha2);

        if(coluna1 > 0) {
            if(quadradoCompleto(linhaInicial, coluna1 - 1)) {
                quantidade++;
            }
        }
        if(coluna1 < tamanhoAtual - 1) {
            if(quadradoCompleto(linhaInicial, coluna1)) {
                quantidade++;
            }
        }
    }

    linhasExistentes.delete(id);

    return quantidade;
}

function jogadaComputador() {
    const jogadasDisponiveis = [];
    const jogadasQueFechamQuadrados = [];
    
    for(let linha = 0; linha < tamanhoAtual; linha++) {
        for(let coluna = 0; coluna < tamanhoAtual; coluna++){
            if(coluna < tamanhoAtual -1) {
                const pontoAtual = tabuleiro.querySelector(`.ponto[data-linha="${linha}"][data-coluna="${coluna}"]`);
                const pontoDireita = tabuleiro.querySelector(`.ponto[data-linha="${linha}"][data-coluna="${coluna + 1}"]`);
                const idDireita = gerarIdLinha(pontoAtual, pontoDireita);
                if(!linhasExistentes.has(idDireita)) {
                    jogadasDisponiveis.push({
                        ponto1: pontoAtual,
                        ponto2: pontoDireita
                    });
                    if(contarQuadradosPossiveis(pontoAtual, pontoDireita) > 0) {
                        jogadasQueFechamQuadrados.push({
                            ponto1: pontoAtual,
                            ponto2: pontoDireita
                        });
                    }
                }
            }
            
            if(linha < tamanhoAtual - 1) {
                const pontoAtual = tabuleiro.querySelector(`.ponto[data-linha="${linha}"][data-coluna="${coluna}"]`);
                const pontoAbaixo = tabuleiro.querySelector(`.ponto[data-linha="${linha + 1}"][data-coluna="${coluna}"]`);
                const idAbaixo = gerarIdLinha(pontoAtual, pontoAbaixo);
                if(!linhasExistentes.has(idAbaixo)) {
                    jogadasDisponiveis.push({
                        ponto1: pontoAtual,
                        ponto2: pontoAbaixo
                    });
                    if(contarQuadradosPossiveis(pontoAtual, pontoAbaixo) > 0) {
                        jogadasQueFechamQuadrados.push({
                            ponto1: pontoAtual,
                            ponto2: pontoAbaixo
                        });
                    }
                }
            }
        }
    }
    
    if(jogadasDisponiveis.length === 0) {
        return;
    }

    let listaEscolhida;

    if(jogadasQueFechamQuadrados.length > 0) {
        listaEscolhida = jogadasQueFechamQuadrados;
    }else{
        listaEscolhida = jogadasDisponiveis;
    }
    
    const indiceAleatorio = Math.floor(Math.random() * listaEscolhida.length);
    const jogadaEscolhida = listaEscolhida[indiceAleatorio];
    
    const ponto1 = jogadaEscolhida.ponto1;
    const ponto2 = jogadaEscolhida.ponto2;

    if(criarLinha(ponto1, ponto2)) {
        const quadradosFechados = verificarQuadradosDaJogada(ponto1, ponto2);

        if(quadradosFechados > 0) {
            atualizarPlacar(quadradosFechados);
            verificarFimDeJogo();
            if(!jogoFinalizado) {
                setTimeout(() => {
                    jogadaComputador();
                }, 1000);
            }
        }else{
            trocarJogador();
        }
    }
}

function reiniciar() {
    const placar1 = document.getElementById("jogador1");
    const placar2 = document.getElementById("jogador2");

    const mensagemFinal = document.getElementById("mensagemFinal");

    pontosJogador1 = 0;
    pontosJogador2 = 0;
    jogadorAtual = 1;
    primeiroPonto = null;
    segundoPonto = null;
    linhasExistentes.clear();
    jogoFinalizado = false;

    placar1.innerHTML = `Jogador 1: 0`;
    if(modoAtual === "computador") {
        placar2.innerHTML = `Computador: 0`;
    }else{
        placar2.innerHTML = `Jogador 2: 0`;
    }

    jogador.innerHTML = "Vez do Jogador 1";
    jogador.classList.remove("vez-jogador1", "vez-jogador2");
    jogador.classList.add("vez-jogador1");

    mensagemFinal.textContent = "";

    criarTabuleiro(tamanhoAtual);
}

btnReiniciar.addEventListener("click", reiniciar);

tamanho.addEventListener('change', () => {
    const tamanhoSelecionado = parseInt(tamanho.value);
    tamanhoAtual = tamanhoSelecionado;
    reiniciar();
});

modoJogo.addEventListener("change", () => {
    modoAtual = modoJogo.value;
    reiniciar();
});

criarTabuleiro(tamanhoAtual);