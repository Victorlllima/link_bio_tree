---
name: otimiza-pagina-parte2
description: Continuação da /otimiza-pagina — mais 20 itens de SEO técnico, UX, conformidade e conversão que toda página web precisa ter antes de ir pra produção. Resolve cada um automaticamente no projeto atual. Use quando o usuário disser "/otimiza-pagina-parte2" ou "roda a parte 2 do checklist de lançamento do site".
---

# Checklist de Pré-Lançamento — Parte 2

Este skill audita e resolve, um por um, os 20 itens abaixo no site do diretório atual. Não pula nenhum item, mesmo que pareça já resolvido — sempre verifica antes de assumir.

Para cada item: (1) verifica se já existe, (2) se não existe, cria/implementa, (3) reporta em uma linha o que foi feito.

## Os 20 itens

1. **sitemap.xml** — gerar o mapa de todas as rotas do site na raiz pública, formato XML padrão. Se o framework tiver geração automática (Next.js `sitemap.ts`, etc.), usar o nativo.

2. **Tooltips ricos** — identificar campos/termos que precisam de explicação contextual (termos técnicos, campos de formulário ambíguos) e adicionar tooltip acessível (atributo `title` no mínimo, componente dedicado se o design system tiver).

3. **Tags canônicas** — adicionar `<link rel="canonical">` em cada página apontando pra URL oficial dela, evitando duplicação de conteúdo indexado.

4. **Favicon** — verificar se existe favicon em múltiplos tamanhos (16x16, 32x32, apple-touch-icon). Se não existir, gerar um básico a partir do logo do projeto, se houver.

5. **Tap-to-call** — todo número de telefone visível no site precisa estar envolto em `<a href="tel:+55...">`, funcional em mobile.

6. **Mensagem de erro em formulário** — todo campo de formulário precisa de mensagem de erro específica e visível (não só borda vermelha). Implementar validação com texto claro por campo.

7. **Horário de funcionamento** — verificar se está visível no site (header, footer ou página de contato). Se não estiver, perguntar ao usuário o horário e adicionar em local visível.

8. **Google Search Console** — verificar se existe arquivo de verificação (meta tag ou arquivo HTML) do Search Console. Se não existir, informar ao usuário que precisa cadastrar o site manualmente em search.google.com/search-console (não é automatizável) e deixar o placeholder de meta tag pronto pro código de verificação.

9. **5 posts de blog** — verificar se existe seção de blog/conteúdo com pelo menos 5 posts publicados. Se não existir estrutura de blog, perguntar ao usuário se quer criar (não gerar conteúdo fake sozinho — perguntar os temas).

10. **Página "sobre" com história** — verificar se existe página `/sobre` ou `/about` com texto de história/propósito do negócio, não só uma lista de serviços. Se faltar conteúdo, perguntar ao usuário pelos dados reais (não inventar biografia).

11. **Galeria de antes e depois** — se o negócio vende transformação/resultado visual, verificar se existe seção de galeria comparativa. Perguntar ao usuário pelas imagens reais antes de criar a seção.

12. **Página por serviço** — verificar se cada serviço oferecido tem página própria (não só uma seção genérica na home). Se o negócio tiver múltiplos serviços numa página só, propor a separação.

13. **E-mail de contato visível** — verificar se o e-mail aparece em texto visível (footer, página de contato), não só escondido atrás de formulário.

14. **Redes sociais funcionando** — testar cada link de rede social do site (clicar/verificar href) e confirmar que abre o perfil correto, não link quebrado ou placeholder `#`.

15. **Imagens comprimidas** — rodar auditoria de tamanho de imagem no projeto. Qualquer imagem acima de 200KB sem otimização, comprimir (usar formato WebP quando possível) ou aplicar lazy loading.

16. **Aviso de cookies (LGPD)** — verificar se existe banner de consentimento de cookies. Se não existir e o site usar analytics/cookies de terceiros, implementar banner básico com aceitar/recusar.

17. **llms.txt** — criar arquivo `/llms.txt` na raiz pública, seguindo o padrão emergente (markdown simples descrevendo o site, propósito e páginas principais) pra orientar IAs que buscam entender/citar o conteúdo.

18. **Página de termos de uso** — verificar se existe `/termos` ou `/termos-de-uso`. Se não existir, gerar um texto base genérico e avisar o usuário que precisa de revisão jurídica antes de publicar (não é substituto de advogado).

19. **Forma de pagamento clara** — verificar se o site informa claramente como o cliente paga (PIX, cartão, boleto, link de checkout). Se a informação não estiver visível, apontar onde adicionar.

20. **Declaração de garantia** — verificar se existe texto de garantia/política de reembolso visível perto do CTA de compra. Se não existir, perguntar ao usuário os termos reais da garantia antes de escrever (não inventar prazo/condição).

## Regras

- **Nunca inventar dado de negócio** (horário, e-mail, garantia, história) — sempre perguntar ao usuário quando a informação não existir no projeto.
- **Nunca fingir que um item manual foi automatizado** (ex: cadastro no Search Console) — avisar claramente o que precisa de ação humana fora do código.
- Ao final, entregar um resumo em formato checklist: ✅ resolvido / ⚠️ precisa de input do usuário / 🔧 precisa de ação manual fora do código.
