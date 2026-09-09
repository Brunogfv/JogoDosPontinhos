# Jogo dos Pontinhos

Jogo dos Pontinhos desenvolvido como trabalho da disciplina de **Programação Web 2** do Instituto Federal de Pernambuco (IFPE), campus Garanhuns.

## Informações acadêmicas

- **Curso:** Análise e Desenvolvimento de Sistemas
- **Período:** 5º período
- **Disciplina:** Programação Web 2
- **Professor:** Jair Galvão de Araújo
- **Aluno:** Bruno Gomes Falcão Vilela

## Sobre o projeto

O projeto implementa o tradicional Jogo dos Pontinhos em uma interface web. Os jogadores conectam pontos vizinhos para formar quadrados; ao completar um quadrado, o jogador marca o ponto e continua jogando. Ao final, vence quem tiver mais quadrados.

## Funcionalidades

- Modo **Jogador x Jogador**.
- Modo **Jogador x Computador**.
- Tabuleiros com tamanhos de `4x4`, `8x8`, `16x16` e `32x32` pontos.
- Destaque visual das linhas e quadrados conquistados por cada jogador.
- Placar atualizado durante a partida.
- Identificação da vez de cada jogador.
- Reinício da partida e troca de configuração do jogo.
- Mensagem indicando o vencedor ou empate.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (JavaScript puro, sem frameworks)

## Como executar

1. Clone este repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em um navegador moderno.

Não é necessário instalar dependências ou configurar um servidor para executar a versão atual.

## Como jogar

1. Escolha o modo de jogo e o tamanho do tabuleiro.
2. Clique em dois pontos vizinhos horizontal ou verticalmente para criar uma linha.
3. Quando uma jogada fechar um quadrado, o jogador recebe o ponto e joga novamente.
4. Use o botão **Reiniciar** para começar uma nova partida.

## Estrutura do projeto

```text
.
├── index.html   # Estrutura da página
├── style.css    # Estilos e layout do jogo
├── script.js    # Regras, tabuleiro, placar e jogadas
└── README.md    # Documentação do projeto
```

## Observação

Este projeto foi desenvolvido para fins acadêmicos e pode ser evoluído com recursos como efeitos sonoros, histórico de partidas, níveis de dificuldade e melhorias de acessibilidade.
