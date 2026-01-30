/* ============================================
   REDPRO BIO - JAVASCRIPT
   ============================================ */

// === DADOS DOS CARDS ===
const cardsData = [
  {
    id: 1,
    title: "Redflix",
    subtitle: "Projetos Prontos",
    description: "Projetos prontos criados por mim e meus alunos. Escolha o seu e comece a faturar. São templates, automações e sistemas completos testados e aprovados pelo mercado.",
    url: "https://redflix.redpro.com.br",
    image: "images/card-redflix.webp",
    badge: "🔥 Popular"
  },
  {
    id: 2,
    title: "Contrate um Shark",
    subtitle: "Desenvolvedores Certificados",
    description: "Precisa de um desenvolvedor? Contrate um aluno certificado do Método Shark. Profissionais treinados e prontos para transformar suas ideias em realidade.",
    url: "https://contrateumshark.redpro.com.br",
    image: "images/card-contrate.webp",
    badge: "⭐ Destaque"
  },
  {
    id: 3,
    title: "Método Shark",
    subtitle: "Curso Vibe Coding",
    description: "Aprenda a criar aplicações do zero usando IA. O curso que está revolucionando o mercado. Do iniciante ao avançado, você vai dominar o desenvolvimento com as ferramentas mais modernas.",
    url: "https://metodoshark.redpro.com.br",
    image: "images/card-metodo.webp",
    badge: "🚀 Curso"
  },
  {
    id: 4,
    title: "News",
    subtitle: "Novidades e Conteúdos",
    description: "Fique por dentro das novidades, dicas exclusivas e conteúdos gratuitos. Newsletter semanal com as melhores estratégias de desenvolvimento e negócios digitais.",
    url: "https://news.redpro.com.br",
    image: "images/card-news.webp",
    badge: "📰 Grátis"
  }
];

// === ELEMENTOS DO DOM ===
const cardsContainer = document.getElementById('cards-container');
const modal = document.getElementById('detail-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalCta = document.getElementById('modal-cta');
const modalClose = document.getElementById('modal-close');

// === RENDERIZAR CARDS ===
function renderCards() {
  cardsContainer.innerHTML = cardsData.map(card => `
    <article class="card" data-card-id="${card.id}" role="button" tabindex="0" aria-label="Ver detalhes de ${card.title}">
      <img 
        src="${card.image}" 
        alt="${card.title}" 
        class="card-image"
        loading="lazy"
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 225%22%3E%3Crect fill=%22%231a1a1a%22 width=%22400%22 height=%22225%22/%3E%3Ctext fill=%22%23E50914%22 font-family=%22Arial%22 font-size=%2240%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${card.title.charAt(0)}%3C/text%3E%3C/svg%3E'"
      >
      <div class="card-badge">${card.badge}</div>
      <div class="card-overlay">
        <h3 class="card-title">${card.title}</h3>
        <p class="card-subtitle">${card.subtitle}</p>
      </div>
    </article>
  `).join('');
  
  // Adicionar event listeners aos cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openModal(parseInt(card.dataset.cardId)));
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(parseInt(card.dataset.cardId));
      }
    });
  });
}

// === ABRIR MODAL ===
function openModal(cardId) {
  const card = cardsData.find(c => c.id === cardId);
  if (!card) return;
  
  modalImage.src = card.image;
  modalImage.alt = card.title;
  modalTitle.textContent = card.title;
  modalDescription.textContent = card.description;
  modalCta.href = card.url;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus no botão de fechar para acessibilidade
  setTimeout(() => modalClose.focus(), 100);
}

// === FECHAR MODAL ===
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// === EVENT LISTENERS ===

// Fechar modal ao clicar no X
modalClose.addEventListener('click', closeModal);

// Fechar modal ao clicar fora
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Rastrear clique no CTA (preparado para analytics futura)
modalCta.addEventListener('click', (e) => {
  const cardTitle = modalTitle.textContent;
  console.log(`[Analytics] Clique no CTA: ${cardTitle}`);
  
  // TODO: Integrar com Supabase na Fase 02
  // trackClick(cardTitle, modalCta.href);
});

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  console.log('RedPro Bio carregado com sucesso! 🦈');
});

// === FUNÇÕES FUTURAS (Fase 02) ===

// Função placeholder para rastreamento de cliques
function trackClick(title, url) {
  // Será implementado na Fase 02 com Supabase
  console.log(`[Track] ${title} -> ${url}`);
}

// Função placeholder para rastreamento de visitantes
function trackVisitor() {
  // Será implementado na Fase 02 com Supabase
  console.log('[Track] Novo visitante');
}
