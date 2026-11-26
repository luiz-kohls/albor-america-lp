/* =========================================================
   Albor América · script
   ========================================================= */

// TROCAR: coloque aqui o WhatsApp do treino, só números, com 55 + DDD.
const WHATSAPP_NUMERO = '5512999999999';
const WHATSAPP_MENSAGEM = 'Olá! Quero saber mais sobre o Albor América.';

const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Links do WhatsApp ---------- */

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;
});

/* ---------- 1. Topo fixo ---------- */

const topo = document.getElementById('topo');
const menu = document.getElementById('menu');
const menuBotao = document.querySelector('.menu-botao');

function atualizarTopo() {
  topo.classList.toggle('is-solida', window.scrollY > 40 || menu.classList.contains('is-aberto'));
}

function abrirMenu(abrir) {
  menu.classList.toggle('is-aberto', abrir);
  menuBotao.setAttribute('aria-expanded', String(abrir));
  menuBotao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  atualizarTopo();
}

menuBotao.addEventListener('click', () => abrirMenu(!menu.classList.contains('is-aberto')));
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => abrirMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-aberto')) {
    abrirMenu(false);
    menuBotao.focus();
  }
});
window.addEventListener('scroll', atualizarTopo, { passive: true });
atualizarTopo();

/* ---------- 3. Carrossel em movimento ---------- */

(function carrossel() {
  const raiz = document.querySelector('[data-carrossel]');
  if (!raiz) return;

  const trilho = raiz.querySelector('[data-trilho]');
  const originais = Array.from(trilho.children);
  const botaoPausar = document.querySelector('[data-pausar]');
  const botaoAnterior = document.querySelector('[data-anterior]');
  const botaoProximo = document.querySelector('[data-proximo]');
  const VELOCIDADE = 32; // pixels por segundo

  // Duas cópias da lista para o giro não ter fim. As cópias ficam fora do leitor de tela e do Tab.
  for (let copia = 0; copia < 2; copia++) {
    originais.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('button').tabIndex = -1;
      trilho.appendChild(clone);
    });
  }
  const cartoes = Array.from(trilho.children);

  let larguraVolta = 0;
  let posicao = 0;
  let pausadoPeloUsuario = movimentoReduzido;
  let interagindo = false;
  let visivel = false;
  let animandoSeta = false;
  let cartaoEmFoco = null; // passou o mouse, tocou ou chegou pelo teclado
  let ultimoTempo = 0;
  let retomar;

  function medir() {
    larguraVolta = cartoes[originais.length].offsetLeft - cartoes[0].offsetLeft;
    if (!posicao) posicao = larguraVolta; // começa na cópia do meio
    trilho.scrollLeft = posicao;
  }

  function normalizar(x) {
    if (x < larguraVolta * 0.5) return x + larguraVolta;
    if (x > larguraVolta * 1.5) return x - larguraVolta;
    return x;
  }

  function rodando() {
    return !pausadoPeloUsuario && !interagindo && visivel && !document.hidden;
  }

  // Acende o cartão escolhido ou, sem escolha, o que está no centro.
  function acender() {
    let alvo = cartaoEmFoco;
    if (!alvo) {
      const centro = trilho.scrollLeft + trilho.clientWidth / 2;
      let menor = Infinity;
      cartoes.forEach((c) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro);
        if (d < menor) { menor = d; alvo = c; }
      });
    }
    cartoes.forEach((c) => c.classList.toggle('is-acesa', c === alvo));
  }

  function quadro(tempo) {
    const dt = ultimoTempo ? Math.min((tempo - ultimoTempo) / 1000, 0.05) : 0;
    ultimoTempo = tempo;
    if (rodando() && larguraVolta) {
      posicao = normalizar(posicao + VELOCIDADE * dt);
      trilho.scrollLeft = posicao;
    }
    requestAnimationFrame(quadro);
  }

  trilho.addEventListener('scroll', () => {
    if (!rodando()) {
      if (!animandoSeta) {
        const x = normalizar(trilho.scrollLeft);
        if (x !== trilho.scrollLeft) trilho.scrollLeft = x;
      }
      posicao = trilho.scrollLeft;
    }
    acender();
  }, { passive: true });

  function segurar(ms) {
    interagindo = true;
    clearTimeout(retomar);
    if (ms) retomar = setTimeout(() => { interagindo = false; posicao = trilho.scrollLeft; }, ms);
  }

  // Mouse: pausa enquanto está em cima.
  trilho.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') segurar(); });
  trilho.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') { segurar(500); cartaoEmFoco = null; acender(); }
  });
  // Toque: pausa enquanto arrasta e um pouco depois.
  trilho.addEventListener('touchstart', () => segurar(), { passive: true });
  trilho.addEventListener('touchend', () => segurar(3500), { passive: true });
  // Teclado.
  trilho.addEventListener('focusin', (e) => {
    segurar();
    cartaoEmFoco = e.target.closest('.cartao');
    acender();
  });
  trilho.addEventListener('focusout', () => { segurar(1500); cartaoEmFoco = null; acender(); });

  cartoes.forEach((cartao) => {
    cartao.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') { cartaoEmFoco = cartao; acender(); }
    });
    cartao.querySelector('button').addEventListener('click', () => {
      cartaoEmFoco = cartao;
      acender();
      segurar(5000);
      const deslocamento = cartao.offsetLeft + cartao.offsetWidth / 2 - (trilho.scrollLeft + trilho.clientWidth / 2);
      rolar(deslocamento);
      setTimeout(() => { if (!trilho.matches(':hover')) cartaoEmFoco = null; }, 5000);
    });
  });

  function rolar(deslocamento) {
    animandoSeta = true;
    trilho.scrollTo({ left: trilho.scrollLeft + deslocamento, behavior: movimentoReduzido ? 'auto' : 'smooth' });
    setTimeout(() => {
      animandoSeta = false;
      trilho.scrollLeft = normalizar(trilho.scrollLeft);
      posicao = trilho.scrollLeft;
    }, 650);
  }

  function passo(direcao) {
    segurar(4000);
    cartaoEmFoco = null;
    const largura = cartoes[1].offsetLeft - cartoes[0].offsetLeft;
    let x = trilho.scrollLeft;
    if (x + direcao * largura > larguraVolta * 1.5 || x + direcao * largura < larguraVolta * 0.5) {
      x = normalizar(x + direcao * largura) - direcao * largura;
      trilho.scrollLeft = x;
    }
    rolar(direcao * largura);
  }

  botaoAnterior.addEventListener('click', () => passo(-1));
  botaoProximo.addEventListener('click', () => passo(1));

  function marcarPausa() {
    botaoPausar.setAttribute('aria-pressed', String(pausadoPeloUsuario));
    botaoPausar.setAttribute('aria-label', pausadoPeloUsuario ? 'Retomar movimento' : 'Pausar movimento');
  }
  botaoPausar.addEventListener('click', () => {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    posicao = trilho.scrollLeft;
    marcarPausa();
  });
  marcarPausa();

  new IntersectionObserver(([entrada]) => {
    visivel = entrada.isIntersecting;
    posicao = trilho.scrollLeft;
  }).observe(raiz);

  window.addEventListener('resize', () => { posicao = 0; medir(); acender(); });
  window.addEventListener('load', () => { posicao = 0; medir(); acender(); });
  medir();
  acender();
  requestAnimationFrame(quadro);
})();

/* ---------- 4. Galeria em tela cheia ---------- */

(function telaCheia() {
  const dialogo = document.querySelector('[data-tela-cheia]');
  const botoes = Array.from(document.querySelectorAll('[data-mosaico] button'));
  if (!dialogo || !botoes.length) return;

  const imagem = dialogo.querySelector('[data-tela-imagem]');
  const legenda = dialogo.querySelector('[data-tela-legenda]');
  const contagem = dialogo.querySelector('[data-tela-contagem]');
  let atual = 0;
  let inicioToque = null;

  function mostrar(i) {
    atual = (i + botoes.length) % botoes.length;
    const origem = botoes[atual].querySelector('img');
    imagem.src = origem.currentSrc || origem.src;
    imagem.alt = origem.alt;
    legenda.textContent = origem.alt;
    contagem.textContent = `${atual + 1} de ${botoes.length}`;
  }

  function abrir(i) {
    mostrar(i);
    document.documentElement.style.overflow = 'hidden';
    dialogo.showModal();
  }

  function fechar() { dialogo.close(); }

  botoes.forEach((botao, i) => botao.addEventListener('click', () => abrir(i)));
  dialogo.querySelector('[data-tela-fechar]').addEventListener('click', fechar);
  dialogo.querySelector('[data-tela-anterior]').addEventListener('click', () => mostrar(atual - 1));
  dialogo.querySelector('[data-tela-proximo]').addEventListener('click', () => mostrar(atual + 1));

  dialogo.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    botoes[atual].focus();
  });

  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });

  // Tocar fora da imagem fecha.
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo || e.target.tagName === 'FIGURE') fechar();
  });

  // Arrastar para o lado troca de imagem.
  imagem.addEventListener('pointerdown', (e) => { inicioToque = e.clientX; });
  imagem.addEventListener('pointerup', (e) => {
    if (inicioToque === null) return;
    const dx = e.clientX - inicioToque;
    inicioToque = null;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
  });
})();

/* ---------- 5. Formulário ---------- */

(function formulario() {
  const form = document.querySelector('[data-formulario]');
  if (!form) return;

  const area = document.querySelector('[data-formulario-area]');
  const confirmacao = document.querySelector('[data-confirmacao]');
  const telefone = form.querySelector('#telefone');

  // Máscara: (12) 99999-9999
  telefone.addEventListener('input', () => {
    const n = telefone.value.replace(/\D/g, '').slice(0, 11);
    let v = n;
    if (n.length > 2) v = `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length > 7) v = `(${n.slice(0, 2)}) ${n.slice(2, n.length - 4)}-${n.slice(-4)}`;
    telefone.value = v;
  });

  const regras = {
    nome: (c) => c.value.trim().length >= 2,
    telefone: (c) => c.value.replace(/\D/g, '').length >= 10,
    email: (c) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim()),
    aceite: (c) => c.checked,
  };

  function conferir(campo) {
    const ok = regras[campo.name](campo);
    const erro = document.getElementById(`${campo.id}-erro`);
    erro.hidden = ok;
    campo.setAttribute('aria-invalid', String(!ok));
    if (ok) campo.removeAttribute('aria-describedby');
    else campo.setAttribute('aria-describedby', erro.id);
    return ok;
  }

  Object.keys(regras).forEach((nome) => {
    const campo = form.elements[nome];
    campo.addEventListener(campo.type === 'checkbox' ? 'change' : 'blur', () => {
      if (campo.getAttribute('aria-invalid')) conferir(campo);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const campos = Object.keys(regras).map((nome) => form.elements[nome]);
    const invalidos = campos.filter((campo) => !conferir(campo));
    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }
    // No treino, o formulário não envia de verdade: só mostra a confirmação.
    area.hidden = true;
    confirmacao.hidden = false;
    confirmacao.focus();
  });
})();

/* ---------- Apartamentos: imagens que se revezam ---------- */

(function apartamentos() {
  const secao = document.querySelector('[data-apartamentos]');
  if (!secao) return;

  const imagens = Array.from(secao.querySelectorAll('.apartamentos__vitrine img'));
  const botoes = Array.from(secao.querySelectorAll('.ambientes button'));
  const fundo = secao.querySelector('[data-ap-fundo]');
  const TEMPO = 5000; // milissegundos em cada imagem
  secao.style.setProperty('--ap-tempo', `${TEMPO}ms`);

  let atual = 0;
  let relogio;
  let visivel = false;
  let pausado = movimentoReduzido;

  function mostrar(i) {
    atual = (i + imagens.length) % imagens.length;
    imagens.forEach((img, n) => img.classList.toggle('is-ativa', n === atual));
    botoes.forEach((b, n) => b.setAttribute('aria-pressed', String(n === atual)));

    // O fundo acompanha a imagem da vez
    const nova = imagens[atual].currentSrc || imagens[atual].src;
    if (!fundo.src.endsWith(nova.split('/').pop())) {
      fundo.classList.add('is-trocando');
      setTimeout(() => { fundo.src = nova; fundo.classList.remove('is-trocando'); }, 300);
    }
  }

  function agendar() {
    clearInterval(relogio);
    secao.classList.toggle('is-pausado', pausado || !visivel);
    if (pausado || !visivel) return;
    // Reinicia a barra de tempo do item ativo
    const ativo = botoes[atual];
    ativo.setAttribute('aria-pressed', 'false');
    void ativo.offsetWidth;
    ativo.setAttribute('aria-pressed', 'true');
    relogio = setInterval(() => mostrar(atual + 1), TEMPO);
  }

  botoes.forEach((botao, i) => {
    botao.addEventListener('click', () => { mostrar(i); pausado = true; agendar(); });
    botao.addEventListener('mouseenter', () => { mostrar(i); pausado = true; agendar(); });
  });
  secao.querySelector('.ambientes').addEventListener('mouseleave', () => {
    if (movimentoReduzido) return;
    pausado = false;
    agendar();
  });

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; agendar(); }, { threshold: 0.3 }).observe(secao);
})();

/* ---------- Efeitos: a luz responde a quem visita ---------- */

(function efeitos() {
  const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Linha do sol no topo: acompanha quanto da página já foi lido
  const topoEl = document.getElementById('topo');
  function progresso() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    topoEl.style.setProperty('--progresso', total > 0 ? (window.scrollY / total).toFixed(4) : 0);
  }
  window.addEventListener('scroll', progresso, { passive: true });
  progresso();

  if (movimentoReduzido) return;

  // Títulos que amanhecem palavra por palavra
  function dividir(el) {
    const texto = el.textContent.trim();
    el.setAttribute('aria-label', texto);
    el.innerHTML = texto.split(/\s+/).map((p, i) =>
      `<span class="palavra" aria-hidden="true"><span class="palavra__in" style="--i:${i}">${p}</span></span>`
    ).join(' ');
    el.classList.add('is-dividido', 'revelar');
  }

  const tituloAbertura = document.getElementById('abertura-titulo');
  if (tituloAbertura) {
    dividir(tituloAbertura);
    tituloAbertura.style.setProperty('--atraso', '850ms');
    requestAnimationFrame(() => tituloAbertura.classList.add('is-visivel'));
  }

  const observarTitulo = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visivel'); observarTitulo.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  ['diferenciais-titulo', 'apartamentos-titulo', 'galeria-titulo', 'contato-titulo'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) { dividir(el); observarTitulo.observe(el); }
  });

  // Abertura: a foto desliza mais devagar que a página e o texto sobe e some
  const abertura = document.querySelector('.abertura');
  const fotoAbertura = abertura.querySelector('.abertura__imagem');
  const textoAbertura = abertura.querySelector('.abertura__texto');
  let pedido = false;
  function paralaxe() {
    pedido = false;
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    fotoAbertura.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
    textoAbertura.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
    textoAbertura.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.75)).toFixed(3);
  }
  window.addEventListener('scroll', () => {
    if (!pedido) { pedido = true; requestAnimationFrame(paralaxe); }
  }, { passive: true });

  if (!ponteiroFino) return; // os efeitos abaixo são de mouse

  // Um sol quente segue o cursor na abertura
  abertura.addEventListener('pointermove', (e) => {
    const r = abertura.getBoundingClientRect();
    abertura.style.setProperty('--lx', `${e.clientX - r.left}px`);
    abertura.style.setProperty('--ly', `${e.clientY - r.top}px`);
  });

  // Lanterna quente na seção escura dos diferenciais
  const diferenciais = document.querySelector('.diferenciais');
  diferenciais.addEventListener('pointermove', (e) => {
    const r = diferenciais.getBoundingClientRect();
    diferenciais.style.setProperty('--sx', `${e.clientX - r.left}px`);
    diferenciais.style.setProperty('--sy', `${e.clientY - r.top}px`);
  });

  // Cartões inclinam na direção do cursor, com um brilho por cima
  document.querySelectorAll('.cartao__alvo').forEach((alvo) => {
    alvo.addEventListener('pointermove', (e) => {
      const r = alvo.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      alvo.classList.add('is-inclinando');
      alvo.style.setProperty('--ry', `${(px - 0.5) * 12}deg`);
      alvo.style.setProperty('--rx', `${(0.5 - py) * 9}deg`);
      alvo.style.setProperty('--gx', `${px * 100}%`);
      alvo.style.setProperty('--gy', `${py * 100}%`);
    });
    alvo.addEventListener('pointerleave', () => {
      alvo.classList.remove('is-inclinando');
      alvo.style.setProperty('--rx', '0deg');
      alvo.style.setProperty('--ry', '0deg');
    });
  });

  // Botões com ímã: puxam um pouco na direção do cursor
  document.querySelectorAll('.botao:not(.botao--cheio)').forEach((botao) => {
    if (botao.closest('.barra-contato')) return;
    botao.addEventListener('pointermove', (e) => {
      const r = botao.getBoundingClientRect();
      botao.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5) * 12}px`);
      botao.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5) * 10}px`);
    });
    botao.addEventListener('pointerleave', () => {
      botao.style.setProperty('--mx', '0px');
      botao.style.setProperty('--my', '0px');
    });
  });

  // Cursor "Ampliar" na galeria, com um leve atraso elástico
  const cursor = document.querySelector('.cursor-ver');
  const mosaico = document.querySelector('[data-mosaico]');
  if (cursor && mosaico) {
    document.documentElement.classList.add('tem-cursor');
    let alvoX = 0, alvoY = 0, x = 0, y = 0, rodando = false;
    function seguir() {
      x += (alvoX - x) * 0.2;
      y += (alvoY - y) * 0.2;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(alvoX - x) > 0.3 || Math.abs(alvoY - y) > 0.3 || cursor.classList.contains('is-ativo')) {
        requestAnimationFrame(seguir);
      } else {
        rodando = false;
      }
    }
    mosaico.addEventListener('pointermove', (e) => {
      alvoX = e.clientX; alvoY = e.clientY;
      if (!cursor.classList.contains('is-ativo')) { x = alvoX; y = alvoY; }
      cursor.classList.toggle('is-ativo', !!e.target.closest('button'));
      if (!rodando) { rodando = true; requestAnimationFrame(seguir); }
    });
    mosaico.addEventListener('pointerleave', () => cursor.classList.remove('is-ativo'));
    mosaico.addEventListener('click', () => cursor.classList.remove('is-ativo'));
  }
})();

/* ---------- Barra de contato no celular ---------- */

(function barraContato() {
  const barra = document.querySelector('[data-barra]');
  const abertura = document.querySelector('.abertura');
  const contato = document.getElementById('contato');
  if (!barra) return;

  let aberturaVisivel = true;
  let contatoVisivel = false;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.target === abertura) aberturaVisivel = e.isIntersecting;
      if (e.target === contato) contatoVisivel = e.isIntersecting;
    });
    barra.classList.toggle('is-visivel', !aberturaVisivel && !contatoVisivel);
  }, { threshold: 0.15 });

  observador.observe(abertura);
  observador.observe(contato);
})();

/* ===== MAPA DA VIZINHANÇA · Albor América ===== */
(function () {
  'use strict';

  // Ponto do empreendimento: Rua Andorra, Jardim América (plantão: Rua Andorra, 452).
  // Para ajustar o pin, troque as coordenadas abaixo (Google Maps > botão direito > copiar coordenadas).
  var ALBOR = { nome: 'Albor América', lat: -23.23300, lng: -45.89720 };

  var CATEGORIAS = {
    compras:     { nome: 'Shoppings',          cor: '#B07A4A' },
    mercados:    { nome: 'Mercados',           cor: '#2E8B57' },
    padarias:    { nome: 'Padarias e cafés',   cor: '#C9952B' },
    gastronomia: { nome: 'Restaurantes',       cor: '#C0563F' },
    saude:       { nome: 'Saúde',              cor: '#D0455B' },
    educacao:    { nome: 'Escolas',            cor: '#3F6FB0' },
    bemestar:    { nome: 'Parques e academias', cor: '#5E9E4A' },
    servicos:    { nome: 'Bancos e serviços',  cor: '#6B6F80' }
  };

  // Fonte: OpenStreetMap (consulta de nov/2026, raio de 2 km). "min" fixa o tempo quando há número oficial.
  var LUGARES = [
    // Shoppings
    { n: 'Shopping Jardim Oriente', c: 'compras', lat: -23.236706, lng: -45.896676, d: 'Lojas, cinema e praça de alimentação', min: 4 },
    { n: 'Center Guadalupe', c: 'compras', lat: -23.231990, lng: -45.899454, d: 'Centro comercial' },
    { n: 'Alpamare Boulevard', c: 'compras', lat: -23.227819, lng: -45.910014, d: 'Centro comercial' },
    { n: 'Vale Sul Shopping', c: 'compras', lat: -23.217261, lng: -45.891936, d: 'Shopping center' },
    { n: 'Telhanorte', c: 'compras', lat: -23.229393, lng: -45.911673, d: 'Casa e construção' },
    { n: 'Cobasi', c: 'compras', lat: -23.238726, lng: -45.896121, d: 'Pet shop' },

    // Mercados
    { n: 'Mercado Avenida', c: 'mercados', lat: -23.231153, lng: -45.901572, d: 'Mercado de bairro' },
    { n: 'Supermercado Shibata', c: 'mercados', lat: -23.237727, lng: -45.897947, d: 'Supermercado' },
    { n: 'Supermercados Thomazzini', c: 'mercados', lat: -23.228774, lng: -45.891422, d: 'Supermercado' },
    { n: 'Assaí Atacadista', c: 'mercados', lat: -23.228281, lng: -45.907603, d: 'Atacado' },
    { n: 'Atacadão', c: 'mercados', lat: -23.224587, lng: -45.907697, d: 'Atacado' },
    { n: 'Carrefour', c: 'mercados', lat: -23.223021, lng: -45.906839, d: 'Hipermercado' },
    { n: 'Pão de Açúcar', c: 'mercados', lat: -23.220011, lng: -45.905400, d: 'Supermercado' },
    { n: 'Oba Hortifruti', c: 'mercados', lat: -23.216772, lng: -45.902205, d: 'Hortifrúti e empório' },
    { n: 'Hortifruti e Açougue Oriente', c: 'mercados', lat: -23.244584, lng: -45.895195, d: 'Hortifrúti e açougue' },

    // Padarias e cafés
    { n: 'Bendito Seja', c: 'padarias', lat: -23.227714, lng: -45.901573, d: 'Padaria' },
    { n: 'Padaria Flor do Ypê', c: 'padarias', lat: -23.236795, lng: -45.903557, d: 'Padaria' },
    { n: 'Padaria Fortaleza', c: 'padarias', lat: -23.229791, lng: -45.904903, d: 'Padaria' },
    { n: 'Pão da Praça', c: 'padarias', lat: -23.241746, lng: -45.895643, d: 'Padaria' },
    { n: 'Padaria e Confeitaria Capri', c: 'padarias', lat: -23.219745, lng: -45.892196, d: 'Padaria e confeitaria' },
    { n: 'Volt Coffee', c: 'padarias', lat: -23.220248, lng: -45.905930, d: 'Café' },
    { n: 'Cafetto', c: 'padarias', lat: -23.223977, lng: -45.910521, d: 'Café' },
    { n: 'Sapore Gelato Caffè', c: 'padarias', lat: -23.215720, lng: -45.902075, d: 'Gelato e café' },

    // Restaurantes
    { n: 'Buona Pizzaria', c: 'gastronomia', lat: -23.231638, lng: -45.897423, d: 'Pizzaria' },
    { n: 'Restaurante Barril', c: 'gastronomia', lat: -23.229164, lng: -45.902361, d: 'Restaurante' },
    { n: 'Feijoada da Vó Alda', c: 'gastronomia', lat: -23.228126, lng: -45.901980, d: 'Cozinha brasileira' },
    { n: 'Churrascaria Aquarius do Vale', c: 'gastronomia', lat: -23.221966, lng: -45.904010, d: 'Churrascaria' },
    { n: 'Gilmour Brewpub', c: 'gastronomia', lat: -23.222125, lng: -45.889640, d: 'Cervejaria' },
    { n: 'Trattoria Mezzanino', c: 'gastronomia', lat: -23.217151, lng: -45.902987, d: 'Cozinha italiana' },
    { n: 'Nova Brescia', c: 'gastronomia', lat: -23.215674, lng: -45.894643, d: 'Churrascaria' },
    { n: 'Wasabi Sushi', c: 'gastronomia', lat: -23.229609, lng: -45.916077, d: 'Cozinha japonesa' },

    // Saúde
    { n: 'Farma-Saúde', c: 'saude', lat: -23.231977, lng: -45.897423, d: 'Farmácia' },
    { n: 'Hospital Regional de São José dos Campos', c: 'saude', lat: -23.238658, lng: -45.908007, d: 'Hospital' },
    { n: 'Hospital das Clínicas Sul', c: 'saude', lat: -23.238046, lng: -45.909327, d: 'Hospital' },
    { n: 'Santa Casa de Misericórdia', c: 'saude', lat: -23.229207, lng: -45.884036, d: 'Hospital' },
    { n: 'Hospital ProVisão', c: 'saude', lat: -23.239456, lng: -45.883876, d: 'Hospital de olhos' },
    { n: 'Droga Raia', c: 'saude', lat: -23.225466, lng: -45.885974, d: 'Farmácia' },
    { n: 'Drogasil', c: 'saude', lat: -23.218913, lng: -45.907961, d: 'Farmácia' },

    // Escolas
    { n: 'E.E. Prof. Edewaldo Freitas Gaia Sant\'Ana', c: 'educacao', lat: -23.234273, lng: -45.900371, d: 'Escola estadual' },
    { n: 'E.E. Deputado Benedito Matarazzo', c: 'educacao', lat: -23.235004, lng: -45.902364, d: 'Escola estadual' },
    { n: 'Poiese', c: 'educacao', lat: -23.236512, lng: -45.888194, d: 'Escola' },
    { n: 'Escola Pindorama', c: 'educacao', lat: -23.222055, lng: -45.890030, d: 'Escola' },
    { n: 'Colégio Planck', c: 'educacao', lat: -23.226471, lng: -45.911173, d: 'Colégio' },
    { n: 'CEPHAS', c: 'educacao', lat: -23.222148, lng: -45.886680, d: 'Escola' },
    { n: 'Colégio Univap', c: 'educacao', lat: -23.217736, lng: -45.905199, d: 'Colégio' },

    // Parques e academias
    { n: 'Área Verde Torre', c: 'bemestar', lat: -23.229382, lng: -45.898668, d: 'Área verde' },
    { n: 'Praça Kadoma', c: 'bemestar', lat: -23.236608, lng: -45.899913, d: 'Praça' },
    { n: 'Winner', c: 'bemestar', lat: -23.234298, lng: -45.900813, d: 'Centro esportivo' },
    { n: 'FocusGym', c: 'bemestar', lat: -23.233756, lng: -45.902137, d: 'Academia' },
    { n: 'Pista Municipal de BMX', c: 'bemestar', lat: -23.234070, lng: -45.910209, d: 'Esporte ao ar livre' },
    { n: 'Smart Fit', c: 'bemestar', lat: -23.222715, lng: -45.884788, d: 'Academia' },
    { n: 'ACM', c: 'bemestar', lat: -23.218501, lng: -45.890045, d: 'Clube esportivo' },
    { n: 'Acqua Natação', c: 'bemestar', lat: -23.231475, lng: -45.916318, d: 'Natação' },

    // Bancos e serviços
    { n: 'Bradesco', c: 'servicos', lat: -23.231570, lng: -45.900763, d: 'Banco' },
    { n: 'Itaú', c: 'servicos', lat: -23.229425, lng: -45.901264, d: 'Banco' },
    { n: 'Caixa Econômica Federal', c: 'servicos', lat: -23.233855, lng: -45.902988, d: 'Banco' },
    { n: 'Banco do Brasil', c: 'servicos', lat: -23.228005, lng: -45.884094, d: 'Banco' },
    { n: 'Rede Triunfo', c: 'servicos', lat: -23.231714, lng: -45.897298, d: 'Posto de combustível' }
  ];

  // Números de destaque (contagem do OpenStreetMap em até 2 km)
  var NUMEROS = [
    { valor: '4 min', texto: 'a pé do Shopping Jardim Oriente' },
    { valor: '15+', texto: 'mercados e atacados em até 2 km' },
    { valor: '15+', texto: 'farmácias e 4 hospitais por perto' },
    { valor: '60+', texto: 'praças e áreas verdes ao redor' }
  ];

  var secao = document.getElementById('localizacao');
  if (!secao) return;

  var elTela = document.getElementById('mapa-tela');
  var elLista = document.getElementById('mapa-lista');
  var elFiltros = document.getElementById('mapa-filtros');
  var elNumeros = document.getElementById('mapa-numeros');

  var filtroAtivo = 'todos';
  var mapa = null;
  var camada = null;

  // ---------- Distância e tempo ----------
  function metros(a, b) {
    var R = 6371000, r = Math.PI / 180;
    var dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function tempo(l) {
    if (l.min) return l.min + ' min a pé';
    var m = l.dist;
    if (m <= 1200) return Math.max(1, Math.round(m / 84)) + ' min a pé';   // 5 km/h
    return Math.max(2, Math.round(m * 1.3 / 400)) + ' min de carro';       // ~24 km/h na cidade
  }
  function km(m) { return m < 1000 ? Math.round(m / 10) * 10 + ' m' : (m / 1000).toFixed(1).replace('.', ',') + ' km'; }

  LUGARES.forEach(function (l) { l.dist = metros(ALBOR, l); });
  function ordem(l) { return l.min ? l.min * 84 : l.dist; }
  LUGARES.sort(function (a, b) { return ordem(a) - ordem(b); });

  // ---------- Números ----------
  elNumeros.innerHTML = NUMEROS.map(function (n) {
    return '<li><strong>' + n.valor + '</strong><span>' + n.texto + '</span></li>';
  }).join('');

  // ---------- Filtros ----------
  var chaves = ['todos'].concat(Object.keys(CATEGORIAS));
  elFiltros.innerHTML = chaves.map(function (k) {
    var nome = k === 'todos' ? 'Tudo' : CATEGORIAS[k].nome;
    var cor = k === 'todos' ? '#1B6861' : CATEGORIAS[k].cor;
    return '<button type="button" class="mapa__filtro" data-cat="' + k + '" aria-pressed="' + (k === filtroAtivo) +
      '" style="--cor:' + cor + '"><i aria-hidden="true"></i>' + nome + '</button>';
  }).join('');
  elFiltros.addEventListener('click', function (e) {
    var b = e.target.closest('.mapa__filtro');
    if (!b) return;
    filtroAtivo = b.dataset.cat;
    elFiltros.querySelectorAll('.mapa__filtro').forEach(function (x) {
      x.setAttribute('aria-pressed', String(x === b));
    });
    desenhar(true);
  });

  function visiveis() {
    return LUGARES.filter(function (l) { return filtroAtivo === 'todos' || l.c === filtroAtivo; });
  }

  // ---------- Lista ----------
  function desenharLista() {
    elLista.innerHTML = visiveis().map(function (l) {
      var i = LUGARES.indexOf(l);
      return '<li class="mapa__item"><button type="button" data-i="' + i + '" style="--cor:' + CATEGORIAS[l.c].cor + '">' +
        '<i aria-hidden="true"></i><span><b>' + l.n + '</b><small>' + l.d + ' · ' + km(l.dist) + '</small></span>' +
        '<em>' + tempo(l) + '</em></button></li>';
    }).join('');
  }
  elLista.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b || !mapa) return;
    var l = LUGARES[+b.dataset.i];
    mapa.flyTo([l.lat, l.lng], 17, { duration: 0.8 });
    if (l.marcador) l.marcador.openPopup();
    if (window.innerWidth < 1024) elTela.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // ---------- Mapa ----------
  function desenharMarcadores(ajustar) {
    if (!mapa) return;
    camada.clearLayers();
    var pontos = [[ALBOR.lat, ALBOR.lng]];
    visiveis().forEach(function (l) {
      var cor = CATEGORIAS[l.c].cor;
      l.marcador = L.marker([l.lat, l.lng], {
        icon: L.divIcon({ className: '', html: '<div class="mapa-pin" style="--cor:' + cor + '"></div>', iconSize: [14, 14], iconAnchor: [7, 7] }),
        title: l.n, alt: l.n, keyboard: true
      }).bindPopup('<strong>' + l.n + '</strong><span>' + l.d + ' · ' + km(l.dist) + ' · ' + tempo(l) + '</span>');
      camada.addLayer(l.marcador);
      pontos.push([l.lat, l.lng]);
    });
    if (ajustar) {
      if (filtroAtivo === 'todos') mapa.flyTo([ALBOR.lat, ALBOR.lng], 14, { duration: 0.6 });
      else mapa.flyToBounds(pontos, { padding: [40, 40], maxZoom: 16, duration: 0.6 });
    }
  }

  function desenhar(ajustar) { desenharLista(); desenharMarcadores(ajustar); }

  function iniciarMapa() {
    elTela.innerHTML = '';
    mapa = L.map(elTela, { scrollWheelZoom: false, zoomControl: true }).setView([ALBOR.lat, ALBOR.lng], 14);

    // Fundo do mapa: Esri World Street Map. O servidor do OpenStreetMap bloqueia páginas abertas
    // direto do computador (sem site de origem) e a CARTO passou a exigir chave.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Mapa &copy; <a href="https://www.esri.com">Esri</a>, HERE, Garmin, &copy; colaboradores do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    // Anéis de distância a pé
    [[400, '5 min a pé'], [800, '10 min a pé'], [1600, '20 min a pé']].forEach(function (a) {
      L.circle([ALBOR.lat, ALBOR.lng], { radius: a[0], color: '#1B6861', weight: 1, opacity: .5, dashArray: '4 6', fill: a[0] === 400, fillColor: '#1B6861', fillOpacity: .06, interactive: false }).addTo(mapa);
      L.tooltip({ permanent: true, direction: 'center', className: 'mapa-anel' })
        .setLatLng([ALBOR.lat + a[0] / 111320, ALBOR.lng]).setContent(a[1]).addTo(mapa);
    });

    camada = L.layerGroup().addTo(mapa);

    L.marker([ALBOR.lat, ALBOR.lng], {
      icon: L.divIcon({ className: '', html: '<div class="mapa-pin--casa">A</div>', iconSize: [44, 44], iconAnchor: [22, 22] }),
      zIndexOffset: 1000, title: ALBOR.nome, alt: ALBOR.nome
    }).addTo(mapa).bindPopup('<strong>Albor América</strong><span>Jardim América · Zona Sul de São José dos Campos</span>');

    // No celular, o mapa só arrasta depois de um toque nele, para não travar a rolagem da página
    // e volta a soltar a rolagem quando a pessoa toca fora do mapa
    if (L.Browser.mobile) {
      mapa.dragging.disable();
      mapa.on('focus click', function () { mapa.dragging.enable(); });
      document.addEventListener('touchstart', function (e) {
        if (!elTela.contains(e.target)) mapa.dragging.disable();
      }, { passive: true });
    }

    desenharMarcadores(false);
  }

  // ---------- Carrega o Leaflet só quando o mapa chega perto da tela ----------
  function carregarLeaflet(pronto) {
    if (window.L) return pronto();
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    css.crossOrigin = '';
    document.head.appendChild(css);
    var js = document.createElement('script');
    js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    js.crossOrigin = '';
    js.onload = pronto;
    js.onerror = function () { elTela.innerHTML = '<p class="mapa__carregando">Não foi possível carregar o mapa.</p>'; };
    document.head.appendChild(js);
  }

  desenharLista();

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (ents) {
      if (ents[0].isIntersecting) { obs.disconnect(); carregarLeaflet(iniciarMapa); }
    }, { rootMargin: '400px' });
    obs.observe(elTela);
  } else {
    carregarLeaflet(iniciarMapa);
  }
})();
/* ===== /MAPA DA VIZINHANÇA ===== */
