# Albor América · landing page

Landing page de lançamento do **Albor América**, residencial da Vece Urbanismo no Jardim América, em São José dos Campos (SP). Case do treinamento de Claude Code da Arquiteteia.

Objetivo da página: quem visita quer saber mais e deixa o contato.

## Como abrir

Dê dois cliques em `index.html`. Não precisa instalar nada: é HTML, CSS e JavaScript puros.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | A página: textos, seções e imagens |
| `estilo.css` | O visual: cores, fontes, layout e efeitos |
| `script.js` | O comportamento: carrossel, galeria, formulário, mapa e efeitos |
| `img/` | Cópias leves das imagens, em WebP |
| `PROMPT-PARA-COLAR.md` | Instruções e código originais da seção do mapa |

A pasta `material/`, com os arquivos originais do cliente, não vai para o GitHub (veja `.gitignore`).

## Seções, em ordem

1. Topo fixo, com a logo, o menu e "Quero saber mais"
2. Abertura: a fachada em tela cheia
3. O que tem no Albor América: um carrossel em movimento com 6 espaços
4. Apartamentos: imagens que se revezam, ligadas a cada ambiente
5. Localização: um mapa interativo da vizinhança
6. Galeria: 12 imagens com tela cheia
7. Contato: formulário e WhatsApp
8. Rodapé, com a assinatura

## Visual

- Cores: noite `#0D2624`, petróleo `#1B6861`, menta `#D7E6DF`, névoa `#F3F6F4`, brasa `#E8A657` e chumbo `#1D2122` (galeria)
- Fontes: Marcellus nos títulos e Hanken Grotesk no texto, do Google Fonts
- Conceito: *albor* é a primeira luz do dia. A luz do fim de tarde dos renders aparece nos botões e nos efeitos, que reagem ao mouse.
- Tom do texto: sofisticado e direto, frases curtas, nunca preço.

## Histórico de versões

- **V1:** as 5 partes do briefing, o carrossel no estilo Framer, a faixa dos apartamentos e a barra de contato no celular.
- **V2:** a logo recriada a partir da placa da fachada; a faixa dos apartamentos refeita, com fundo estendido e imagens que se revezam; a galeria em cinza-chumbo; o mapa da vizinhança; a assinatura no rodapé.
- **V3:** os efeitos: títulos que "amanhecem", o sol que segue o mouse, botões com reflexo e ímã, cartões que inclinam em 3D e o cursor "Ampliar" na galeria. O mapa passou a usar o servidor de imagens da Esri.

## Pendências

- Número de WhatsApp do treino: trocar `WHATSAPP_NUMERO` no começo de `script.js`.
- Revisar a versão para celular, depois de aprovar a versão para computador.
- Publicar na Vercel e trocar a imagem de prévia (`og:image`) pelo endereço completo.
- Criar o `CLAUDE.md` com o visual, o tom e os dados da ficha (encontro 3).

---

Kohls & Estag, the mans of the LP
