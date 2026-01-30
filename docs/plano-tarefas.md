# PLANO DE TAREFAS - RedPro Bio

**Criado por:** Hades
**Data:** 2026-01-30
**Para:** Atlas

---

## 🔵 FASE 01: FUNDAÇÃO

### Tarefa 1.1: Criar Estrutura de Pastas

**Objetivo:** Organizar o projeto de forma profissional

**Estrutura:**
```
link_bio_tree/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos Netflix + neon
├── js/
│   └── app.js          # Lógica de interatividade
├── images/             # Thumbnails dos cards
├── docs/               # Documentação (já existe)
└── README.md           # Descrição do projeto
```

**Critérios de aceitação:**
- ✅ Todas as pastas criadas
- ✅ Arquivos base criados (mesmo que vazios inicialmente)

---

### Tarefa 1.2: Criar index.html

**Objetivo:** Estrutura HTML semântica da página

**Requisitos:**
- Header com logo/nome "RedPro"
- Seção de cards (grid)
- Modal de detalhes (hidden por padrão)
- Footer com copyright
- Meta tags para SEO
- Open Graph tags para compartilhamento

**Estrutura do Card:**
```html
<div class="card" data-card-id="1">
  <img src="images/card-1.jpg" alt="Redflix">
  <div class="card-info">
    <h3>Redflix</h3>
  </div>
</div>
```

**Estrutura do Modal:**
```html
<div class="modal" id="detail-modal">
  <div class="modal-content">
    <button class="close-btn">&times;</button>
    <img class="modal-image" src="" alt="">
    <h2 class="modal-title"></h2>
    <p class="modal-description"></p>
    <a class="modal-cta" href="" target="_blank">Acessar</a>
  </div>
</div>
```

---

### Tarefa 1.3: Criar styles.css (Visual Netflix + Neon)

**Objetivo:** Estilização premium estilo Netflix com toques neon

**Paleta de Cores:**
```css
:root {
  --bg-primary: #0D0D0D;
  --bg-secondary: #141414;
  --netflix-red: #E50914;
  --neon-blue: #00D4FF;
  --neon-purple: #8B5CF6;
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --gradient-neon: linear-gradient(135deg, #E50914 0%, #8B5CF6 50%, #00D4FF 100%);
}
```

**Requisitos de Estilo:**

1. **Fundo:** Preto profundo com gradiente sutil
2. **Cards:**
   - Bordas arredondadas (8-12px)
   - Sombra suave
   - Transição suave (0.3s ease)
3. **Hover do Card:**
   - Scale 1.08 a 1.15
   - Box-shadow com glow neon
   - Borda com gradiente neon
4. **Modal:**
   - Overlay escuro (rgba(0,0,0,0.85))
   - Conteúdo centralizado
   - Animação de entrada (fade + scale)
   - Botão CTA com gradiente neon

**Responsividade:**
- Desktop: 4 cards por linha
- Tablet: 2 cards por linha  
- Mobile: 1 card por linha

---

### Tarefa 1.4: Criar app.js (Interatividade)

**Objetivo:** Lógica JavaScript para modal e interações

**Funcionalidades:**
1. Abrir modal ao clicar no card
2. Fechar modal ao clicar no X ou fora
3. Preencher modal com dados do card clicado
4. Animações de entrada/saída

**Dados dos Cards (hardcoded inicialmente):**
```javascript
const cards = [
  {
    id: 1,
    title: "Redflix",
    description: "Projetos prontos criados por mim e meus alunos. Escolha o seu e comece a faturar.",
    url: "https://redflix.redpro.com.br",
    image: "images/card-redflix.jpg"
  },
  {
    id: 2,
    title: "Contrate um Shark",
    description: "Precisa de um desenvolvedor? Contrate um aluno certificado do Método Shark.",
    url: "https://contrateumshark.redpro.com.br",
    image: "images/card-contrate.jpg"
  },
  {
    id: 3,
    title: "Método Shark",
    description: "Aprenda a criar aplicações do zero usando IA. O curso que está revolucionando o mercado.",
    url: "https://metodoshark.redpro.com.br",
    image: "images/card-metodo.jpg"
  },
  {
    id: 4,
    title: "News",
    description: "Fique por dentro das novidades, dicas exclusivas e conteúdos gratuitos.",
    url: "https://news.redpro.com.br",
    image: "images/card-news.jpg"
  }
];
```

---

### Tarefa 1.5: Gerar Imagens dos Cards

**Objetivo:** Criar thumbnails visuais impactantes para cada card

**Usar generate_image para criar:**
1. `card-redflix.jpg` - Visual de catálogo de filmes/streaming
2. `card-contrate.jpg` - Visual de contratação/profissional
3. `card-metodo.jpg` - Visual de curso/educação tech
4. `card-news.jpg` - Visual de newsletter/novidades

**Estilo das imagens:**
- Cores predominantes: vermelho, preto, toques de azul neon
- Estética futurista/tech
- Alta qualidade, aspecto cinematográfico

---

### Tarefa 1.6: Testar Localmente

**Objetivo:** Garantir que tudo funciona antes de avançar

**Checklist:**
- [ ] Página carrega sem erros no console
- [ ] Cards aparecem corretamente
- [ ] Hover funciona com animação
- [ ] Modal abre ao clicar
- [ ] Modal fecha ao clicar X ou overlay
- [ ] Botão "Acessar" tem o link correto
- [ ] Responsivo funciona (testar em diferentes tamanhos)

---

## Próximas Fases (resumo)

### FASE 02: Integração Supabase
- Criar tabelas para analytics
- Rastrear cliques e visitantes

### FASE 03: Captura de Leads
- Formulário de email/WhatsApp
- Integração com pixels

### FASE 04: Deploy
- Vercel + domínio
- SEO final

---

**Última atualização:** 2026-01-30 por Hades
