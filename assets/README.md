# Origem e preparação das fotografias

As fotografias são recortes das quatro referências fornecidas para este projeto.
Os PNGs originais foram preservados, sem alteração, em `assets/originals/`.
Cada original mede **1487 × 1058 px**. As imagens são referências visuais:
as pessoas retratadas não são apresentadas como clientes reais ou depoimentos.

As fotografias de produção ficam em `public/images/`, em WebP, com qualidade
88, sem ampliação artificial. Hero, fachada, barbeiro e lounge também possuem
variantes de até 640 px de largura, com qualidade 86. Os nove arquivos principais
somam aproximadamente 383 KiB; os PNGs originais não fazem parte do build público.

## Recortes

As coordenadas seguem `(esquerda, topo, direita, base)`, em pixels do original;
direita e base são exclusivas. O arquivo `assets/manifest.json` registra também
os tamanhos exatos dos arquivos gerados.

| Asset | Original | Retângulo | Dimensões |
| --- | --- | --- | --- |
| `hero.webp` | `Cadeira de barbeiro em barbearia premium.png` | `(575, 78, 1487, 1000)` | 912 × 922 |
| `service-cut.webp` | `Serviços premium em ambiente de barbearia.png` | `(77, 170, 509, 382)` | 432 × 212 |
| `service-beard.webp` | `Serviços premium em ambiente de barbearia.png` | `(533, 170, 958, 382)` | 425 × 212 |
| `service-complete.webp` | `Serviços premium em ambiente de barbearia.png` | `(982, 170, 1415, 382)` | 433 × 212 |
| `barber.webp` | `Serviços premium em ambiente de barbearia.png` | `(77, 640, 808, 946)` | 731 × 306 |
| `lounge.webp` | `Galeria do lounge da barbearia.png` | `(41, 185, 932, 758)` | 891 × 573 |
| `mirror.webp` | `Galeria do lounge da barbearia.png` | `(958, 185, 1448, 450)` | 490 × 265 |
| `coffee.webp` | `Galeria do lounge da barbearia.png` | `(958, 474, 1448, 758)` | 490 × 284 |
| `facade.webp` | `Fachada e contato da barbearia premium.png` | `(580, 0, 1487, 568)` | 907 × 568 |

O hero exclui o cabeçalho e os botões desenhados na referência; a cadeira inteira
foi preservada. A fachada exclui o botão à esquerda e todos os campos desenhados
na metade inferior. Os três serviços contêm somente a fotografia superior.
Os recortes da galeria removem os espaços vazios, bordas e botão da composição.

## Uso e enquadramento

- Hero: preservar a proporção quase quadrada; usar `object-position: 60% 50%`
  se houver ajuste moderado de proporção. Em celular, evitar uma faixa panorâmica
  que corte a cadeira.
- Fachada: `object-position: 55% 50%`.
- Barbeiro: `object-position: 50% 50%`; o enquadramento original enfatiza mãos,
  ferramentas e bancada.
- Lounge e espelho: manter os rostos no quadro e evitar recortes muito estreitos.
- Serviços e café: a proporção nativa mantém visíveis os objetos principais.

As transições escuras, bordas de cards e controles da página devem ser
implementados em CSS e HTML, separados destes arquivos.

## Reproduzir

Com Python e Pillow instalados:

```sh
python scripts/prepare_assets.py
```

Para importar os quatro PNGs de uma pasta antes da primeira geração:

```sh
python scripts/prepare_assets.py --import-from "/caminho/dos/originais"
```

O script não modifica nem sobrescreve originais já preservados. Os nove recortes
foram abertos e inspecionados visualmente após a conversão.
