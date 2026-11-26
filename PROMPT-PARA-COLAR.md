Implemente no projeto da landing page do Albor América uma nova seção: um mapa interativo da vizinhança. O código abaixo já está pronto e testado. Não reescreva nem "melhore" o código; só encaixe.

O que fazer:

1. Em index.html, cole o bloco HTML abaixo entre a seção da Galeria e a seção de Contato. Não mexa no menu do topo.
2. No fim de estilo.css, cole o bloco CSS abaixo.
3. No fim de script.js, cole o bloco JavaScript abaixo. Ele é independente (fica dentro de uma função própria) e carrega sozinho a biblioteca de mapa Leaflet pela internet, só quando o visitante rola até o mapa. Não precisa instalar nada nem adicionar nada no <head>.
4. Se o projeto já usa as variáveis de cor ou de fonte com outros nomes, pode trocar os valores das variáveis --mapa-* no topo do CSS para usar as do projeto. Não renomeie as classes.
5. Abra a página no navegador, em 375 px e no computador, e confira: o mapa aparece, os filtros trocam os pontos, tocar num lugar da lista leva o mapa até ele e a página continua rolando normal no celular.

Todas as classes começam com "mapa" e o id da seção é "localizacao", para não conflitar com o resto da página.

Como o mapa deve se comportar (já está no código, não mude):

- É só mais uma seção da página. A pessoa rola até ele, pode mexer ou não, e continua descendo ou subindo normalmente.
- No computador, a rodinha do mouse rola a página, não dá zoom no mapa. Para mexer: arrastar ou usar os botões + e −.
- No celular, passar o dedo por cima do mapa rola a página. O mapa só arrasta depois de um toque nele e volta a soltar a rolagem quando a pessoa toca fora dele. O zoom com dois dedos funciona sempre.
- O mapa só carrega quando a pessoa chega perto da seção, para não deixar a abertura da página lenta.

### HTML (index.html, entre a Galeria e o Contato)

```html
<!-- ===== MAPA DA VIZINHANÇA · Albor América ===== -->
<section class="mapa" id="localizacao" aria-labelledby="mapa-titulo">
  <div class="mapa__topo">
    <p class="mapa__selo">Localização</p>
    <h2 class="mapa__titulo" id="mapa-titulo">No coração da Zona Sul.</h2>
    <p class="mapa__frase">Jardim América, São José dos Campos. Shopping, mercados, escolas e parques a poucos passos de casa.</p>
  </div>

  <ul class="mapa__numeros" id="mapa-numeros" aria-label="A região em números"></ul>

  <div class="mapa__filtros" id="mapa-filtros" role="group" aria-label="Filtrar lugares por categoria"></div>

  <div class="mapa__corpo">
    <div class="mapa__tela" id="mapa-tela" role="region" aria-label="Mapa interativo da região do Albor América">
      <p class="mapa__carregando">Carregando o mapa…</p>
    </div>
    <ol class="mapa__lista" id="mapa-lista" aria-label="Lugares próximos, do mais perto ao mais longe"></ol>
  </div>

  <p class="mapa__nota">Tempos aproximados, calculados pela distância. Dados de lugares: © colaboradores do OpenStreetMap.</p>
</section>
<!-- ===== /MAPA DA VIZINHANÇA ===== -->
```

### CSS (fim de estilo.css)

```css
/* ===== MAPA DA VIZINHANÇA · Albor América ===== */
.mapa {
  --mapa-petroleo: #1B6861;
  --mapa-menta: #D5E3DC;
  --mapa-nevoa: #F2F5F3;
  --mapa-tinta: #1D3A38;
  --mapa-freijo: #B07A4A;
  --mapa-titulo-fonte: 'Tenor Sans', Georgia, serif;
  --mapa-texto-fonte: 'Albert Sans', system-ui, sans-serif;

  background: var(--mapa-nevoa);
  color: var(--mapa-tinta);
  font-family: var(--mapa-texto-fonte);
  padding: 64px 20px;
}

.mapa__topo { max-width: 640px; margin: 0 auto 28px; text-align: center; }
.mapa__selo {
  font-size: 12px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--mapa-freijo); margin: 0 0 12px; font-weight: 600;
}
.mapa__titulo {
  font-family: var(--mapa-titulo-fonte); font-weight: 400;
  font-size: clamp(28px, 7vw, 44px); line-height: 1.1; margin: 0 0 12px;
}
.mapa__frase { font-size: 16px; line-height: 1.55; margin: 0; opacity: .85; }

/* Números de destaque */
.mapa__numeros {
  list-style: none; padding: 0; margin: 0 auto 28px; max-width: 1120px;
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
  background: var(--mapa-menta); border: 1px solid var(--mapa-menta); border-radius: 14px; overflow: hidden;
}
.mapa__numeros li { background: #fff; padding: 16px 14px; }
.mapa__numeros strong {
  display: block; font-family: var(--mapa-titulo-fonte); font-weight: 400;
  font-size: 28px; color: var(--mapa-petroleo); line-height: 1;
}
.mapa__numeros span { display: block; font-size: 13px; margin-top: 6px; line-height: 1.35; }

/* Filtros */
.mapa__filtros {
  display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 10px;
  margin: 0 auto 14px; max-width: 1120px; scrollbar-width: none;
}
.mapa__filtros::-webkit-scrollbar { display: none; }
.mapa__filtro {
  flex: 0 0 auto; display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid #cfdcd5; background: #fff; color: var(--mapa-tinta);
  font: 500 14px/1 var(--mapa-texto-fonte); padding: 10px 14px; border-radius: 999px;
  cursor: pointer; min-height: 40px; transition: background .2s, color .2s, border-color .2s;
}
.mapa__filtro i { width: 10px; height: 10px; border-radius: 50%; background: var(--cor); }
.mapa__filtro[aria-pressed="true"] { background: var(--mapa-petroleo); border-color: var(--mapa-petroleo); color: #fff; }
.mapa__filtro[aria-pressed="true"] i { box-shadow: 0 0 0 2px #fff; }
.mapa__filtro:focus-visible { outline: 2px solid var(--mapa-freijo); outline-offset: 2px; }

/* Mapa + lista */
.mapa__corpo { max-width: 1120px; margin: 0 auto; display: grid; gap: 14px; }
.mapa__tela {
  position: relative; height: 420px; border-radius: 16px; overflow: hidden;
  background: var(--mapa-menta); box-shadow: 0 12px 32px rgba(29, 58, 56, .12); z-index: 0;
}
.mapa .leaflet-tile-pane { filter: grayscale(.85) sepia(.12) hue-rotate(115deg) saturate(1.1) brightness(1.04) contrast(.92); }
.mapa__carregando { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; font-size: 14px; opacity: .7; }

.mapa__lista {
  list-style: none; margin: 0; padding: 6px; background: #fff; border-radius: 16px;
  max-height: 340px; overflow-y: auto; box-shadow: 0 12px 32px rgba(29, 58, 56, .08);
}
.mapa__item button {
  width: 100%; display: grid; grid-template-columns: 12px 1fr auto; align-items: center; gap: 12px;
  background: none; border: 0; text-align: left; padding: 12px 10px; border-radius: 10px;
  font: inherit; color: inherit; cursor: pointer;
}
.mapa__item button:hover, .mapa__item button:focus-visible { background: var(--mapa-nevoa); outline: none; }
.mapa__item i { width: 12px; height: 12px; border-radius: 50%; background: var(--cor); }
.mapa__item b { display: block; font-weight: 600; font-size: 15px; }
.mapa__item small { display: block; font-size: 12px; opacity: .7; margin-top: 2px; }
.mapa__item em { font-style: normal; font-size: 13px; white-space: nowrap; color: var(--mapa-petroleo); font-weight: 600; }

.mapa__nota { max-width: 1120px; margin: 14px auto 0; font-size: 12px; opacity: .6; text-align: center; }

/* Marcadores */
.mapa-pin {
  width: 14px; height: 14px; border-radius: 50%; background: var(--cor);
  border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0, 0, 0, .35);
}
.mapa-pin--casa {
  width: 44px; height: 44px; border-radius: 50%; background: var(--mapa-petroleo, #1B6861);
  border: 3px solid #fff; box-shadow: 0 0 0 8px rgba(27, 104, 97, .25), 0 6px 16px rgba(0, 0, 0, .3);
  display: grid; place-items: center; color: #fff;
  font: 400 15px/1 'Tenor Sans', Georgia, serif; letter-spacing: .04em;
  animation: mapa-pulso 2.4s ease-out infinite;
}
@keyframes mapa-pulso {
  0% { box-shadow: 0 0 0 0 rgba(27, 104, 97, .45), 0 6px 16px rgba(0, 0, 0, .3); }
  70% { box-shadow: 0 0 0 18px rgba(27, 104, 97, 0), 0 6px 16px rgba(0, 0, 0, .3); }
  100% { box-shadow: 0 0 0 0 rgba(27, 104, 97, 0), 0 6px 16px rgba(0, 0, 0, .3); }
}
.mapa-anel {
  background: rgba(255, 255, 255, .9); color: #1D3A38; border: 0; box-shadow: none;
  font: 600 11px/1 'Albert Sans', system-ui, sans-serif; padding: 4px 8px; border-radius: 999px;
}
.mapa-anel::before { display: none; }
.mapa .leaflet-popup-content-wrapper { border-radius: 12px; }
.mapa .leaflet-popup-content { margin: 12px 16px; font-family: var(--mapa-texto-fonte); color: var(--mapa-tinta); }
.mapa .leaflet-popup-content strong { display: block; font-size: 15px; margin-bottom: 4px; }
.mapa .leaflet-popup-content span { font-size: 13px; opacity: .8; }

@media (prefers-reduced-motion: reduce) { .mapa-pin--casa { animation: none; } }

/* Tablet e computador */
@media (min-width: 768px) {
  .mapa { padding: 96px 32px; }
  .mapa__numeros { grid-template-columns: repeat(4, 1fr); }
  .mapa__numeros li { padding: 20px; }
  .mapa__filtros { flex-wrap: wrap; justify-content: center; overflow: visible; }
}
@media (min-width: 1024px) {
  .mapa__corpo { grid-template-columns: 1fr 340px; }
  .mapa__tela { height: 560px; }
  .mapa__lista { max-height: 560px; }
}
/* ===== /MAPA DA VIZINHANÇA ===== */
```

### JavaScript (fim de script.js)

```js
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

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
```
