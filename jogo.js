const tela = document.getElementById("tela");
tela.width = 900;
tela.height = 500;
const ctx = tela.getContext("2d");

//  Imagens
const imgFundo = new Image();
imgFundo.src = "./png/fundo5.jpg";

const imgJogador = new Image();
imgJogador.src = "./png/perso.png";

const imgObstaculo = new Image();
imgObstaculo.src = "./png/COVID19.png";

const imgMoeda = new Image();
imgMoeda.src = "./png/MOEDA1.png";

const imgInimigo = new Image();
imgInimigo.src = "./png/inimigo2.png";

//  Jogador
const jogador = {
  x: 50,
  y: 360,
  largura: 80,
  altura: 80,
  cor: "black",
  velocidadeY: 0,
  pulando: false,
  saltosRestantes: 2,
};

let gravidade = 1.0;
let puxarPraBaixo = false;
let obstaculos = [];
let moedas = [];
let inimigos = [];
let pontos = 0;
let jogoAtivo = false; // começa parado

//  Movimento lateral
let movendoEsquerda = false;
let movendoDireita = false;
const velocidadeX = 5;

//  Obstáculo comum (COVID)
function criarObstaculo() {
  const altura = 40;
  const largura = 40;
  const y = 350;
  const x = tela.width;
  obstaculos.push({ x, y, largura, altura });
}

//  Moeda (coletável)
function criarMoeda() {
  const largura = 30;
  const altura = 30;
  const x = tela.width;
  const y = 300 + Math.random() * 100;
  moedas.push({ x, y, largura, altura });
}

//  Inimigo (novo obstáculo)
function criarInimigo() {
  const largura = 50;
  const altura = 50;
  const x = tela.width;
  const y = 220;
  inimigos.push({ x, y, largura, altura });
}

//  Colisão
function colisao(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.largura &&
    rect1.x + rect1.largura > rect2.x &&
    rect1.y < rect2.y + rect2.altura &&
    rect1.y + rect1.altura > rect2.y
  );
}

//  Atualização do jogo
function atualizar() {
  if (!jogoAtivo) return;

  ctx.drawImage(imgFundo, 0, 0, tela.width, tela.height);

  // Gravidade
  if (puxarPraBaixo) {
    jogador.velocidadeY += gravidade * 3;
  } else {
    jogador.velocidadeY += gravidade;
  }
  jogador.y += jogador.velocidadeY;

  // Movimento lateral
  if (movendoEsquerda) {
    jogador.x -= velocidadeX;
    if (jogador.x < 0) jogador.x = 0;
  }
  if (movendoDireita) {
    jogador.x += velocidadeX;
    if (jogador.x + jogador.largura > tela.width) {
      jogador.x = tela.width - jogador.largura;
    }
  }

  // Limite inferior
  if (jogador.y > 360) {
    jogador.y = 360;
    jogador.velocidadeY = 0;
    jogador.pulando = false;
    puxarPraBaixo = false;
    jogador.saltosRestantes = 2; // reseta os pulos
  }

  ctx.drawImage(imgJogador, jogador.x, jogador.y, jogador.largura, jogador.altura);

  // Obstáculos
  for (let i = 0; i < obstaculos.length; i++) {
    let obs = obstaculos[i];
    obs.x -= 5;
    ctx.drawImage(imgObstaculo, obs.x, obs.y, obs.largura, obs.altura);

    if (colisao(jogador, obs)) {
      jogoAtivo = false;
      alert("Game Over! Pontos: " + pontos);
      document.location.reload();
      return;
    }
  }

  obstaculos = obstaculos.filter((obs) => {
    if (obs.x + obs.largura > 0) return true;
    else {
      pontos += 1;
      return false;
    }
  });

  // Moedas
  for (let i = 0; i < moedas.length; i++) {
    let moeda = moedas[i];
    moeda.x -= 4;
    ctx.drawImage(imgMoeda, moeda.x, moeda.y, moeda.largura, moeda.altura);

    if (colisao(jogador, moeda)) {
      pontos += 2;
      moedas.splice(i, 1);
      i--;
    }
  }

  moedas = moedas.filter((m) => m.x + m.largura > 0);

  // Inimigos
  for (let i = 0; i < inimigos.length; i++) {
    let inimigo = inimigos[i];
    inimigo.x -= 6;
    ctx.drawImage(imgInimigo, inimigo.x, inimigo.y, inimigo.largura, inimigo.altura);

    if (colisao(jogador, inimigo)) {
      jogoAtivo = false;
      alert("Game Over! Pontos: " + pontos);
      document.location.reload();
      return;
    }
  }

  inimigos = inimigos.filter((i) => i.x + i.largura > 0);

  // Pontuação
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Pontos: " + pontos, 10, 30);

  requestAnimationFrame(atualizar);
}

//  Controles
document.addEventListener("keydown", (e) => {
  if (!jogoAtivo) return;

  if (e.code === "ArrowUp" && jogador.saltosRestantes > 0) {
    jogador.velocidadeY = -20;
    jogador.pulando = true;
    jogador.saltosRestantes--;
  }

  if (e.code === "ArrowDown") {
    puxarPraBaixo = true;
  }

  if (e.code === "ArrowLeft") {
    movendoEsquerda = true;
  }

  if (e.code === "ArrowRight") {
    movendoDireita = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") {
    puxarPraBaixo = false;
  }

  if (e.code === "ArrowLeft") {
    movendoEsquerda = false;
  }

  if (e.code === "ArrowRight") {
    movendoDireita = false;
  }
});

//  Geração de objetos
setInterval(() => {
  if (jogoAtivo) criarObstaculo();
}, 2000);

setInterval(() => {
  if (jogoAtivo) criarMoeda();
}, 6000);

setInterval(() => {
  if (jogoAtivo) criarInimigo();
}, 3500);

//  Botão iniciar controla o começo do jogo
document.getElementById("btnIniciar").addEventListener("click", () => {
  if (!jogoAtivo) {
    jogoAtivo = true;
    document.getElementById("btnIniciar").style.display = "none"; // esconde botão
    atualizar(); // inicia loop do jogo
  }
});
