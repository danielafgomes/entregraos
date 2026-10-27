# Comparação tipográfica do Entre Grãos

Página isolada de revisão em `/preview-inicial/tipografia/`. Não altera a fonte da landing, a página pública nem o outro preview. HTML estático, sem JavaScript, chamadas externas ou tracking. Meta robots e googlebot impedem indexação; sem canonical, hreflang de produção ou dados estruturados.

## Fontes

- Georgia: fonte do sistema, sem redistribuição. A aparência depende da disponibilidade no dispositivo; fallback Times New Roman/serif.
- Fraunces: Copyright 2018 The Fraunces Project Authors (https://github.com/undercasetype/Fraunces).
- Newsreader: Copyright 2020 The Newsreader Project Authors (http://github.com/productiontype/Newsreader).
- Cormorant Garamond: Copyright 2015 the Cormorant Project Authors (github.com/CatharsisFonts/Cormorant).

As três famílias adicionais usam os ficheiros oficiais estáticos normal/itálico, peso400, disponibilizados pela API Google Fonts em2026-10-27. URLs exatos e SHA256 constam de `fonts/manifest.json`. Cada licença SIL Open Font License1.1 está incluída integralmente em `fonts/*-OFL.txt`, obtida de `https://raw.githubusercontent.com/google/fonts/main/ofl/{fraunces,newsreader,cormorantgaramond}/OFL.txt`. Não há nomes reservados declarados nos cabeçalhos dessas licenças.

Conversão local com fontTools/Brotli para WOFF2; subconjunto Unicode U+0020–00FF, U+2000–206F e U+20AC, mantendo os caracteres disponíveis, kerning, ligaturas, nomes e copyright. Inclui todos os acentos portugueses precompostos. Não é uma distribuição completa para outros idiomas. Sem alteração de contornos ou substituição do desenho. Normal e itálico reais; `font-synthesis:none` impede itálico artificial.

Comparação com tamanho nominal igual:55px no desktop amplo,34–48px no móvel; line-height1.12 e letter-spacing0. Títulos verdes29px/28px, amostra de acentos26px/24px. Texto corrido Arial16px/15px inalterado. Diferenças de altura visual e largura fazem parte da comparação, sem tentar igualar métricas artificiais.

## Publicação

Publicar exclusivamente esta pasta, preservando os outros ficheiros do repositório. O logo é reutilizado de `/preview/logo-entregraos.png`; o link de regresso aponta para `/preview-inicial/`. Não adicionar a comparação ao sitemap. Os ficheiros de QA locais não pertencem à publicação.
