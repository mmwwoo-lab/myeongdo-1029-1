/**
 * 명도 이명우의 바이브 코딩연구소 - 메인 애플리케이션 스크립트
 */

import { siteConfig, newsList, communityLinks, tipsData, skillsData, makesData, pressList } from './data.js';

// Application State
const state = {
  activeTab: 'tips',
  activeCategory: 'all',
  searchQuery: '',
  currentNewsIndex: 0,
  newsTimer: null
};

// DOM References
const elements = {
  themeToggle: document.getElementById('themeToggle'),
  themeIconSun: document.getElementById('themeIconSun'),
  heroWires: document.getElementById('heroWires'),
  wireCharToHub: document.getElementById('wireCharToHub'),
  wirePromptToHub: document.getElementById('wirePromptToHub'),
  portCharOut: document.getElementById('portCharOut'),
  portPromptOut: document.getElementById('portPromptOut'),
  portHubIn: document.getElementById('portHubIn'),
  swatchesContainer: document.getElementById('swatchesContainer'),
  newsSlider: document.getElementById('newsSlider'),
  newsPrevBtn: document.getElementById('newsPrevBtn'),
  newsNextBtn: document.getElementById('newsNextBtn'),
  communityTilesGrid: document.getElementById('communityTilesGrid'),
  tabButtons: document.querySelectorAll('.tab-btn'),
  tabPanels: document.querySelectorAll('.tab-panel'),
  searchInput: document.getElementById('searchInput'),
  filterPills: document.querySelectorAll('.filter-pill'),
  tipsContainer: document.getElementById('tipsContainer'),
  skillsContainer: document.getElementById('skillsContainer'),
  makesContainer: document.getElementById('makesContainer'),
  pressContainer: document.getElementById('pressContainer'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalWindow: document.getElementById('modalWindow'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalBadge: document.getElementById('modalBadge'),
  modalTitle: document.getElementById('modalTitle'),
  modalDesc: document.getElementById('modalDesc'),
  modalContent: document.getElementById('modalContent'),
  modalActions: document.getElementById('modalActions'),
  toast: document.getElementById('toast'),
  toastMsg: document.getElementById('toastMsg')
};

/* ==========================================================================
   Initialization
   ========================================================================== */

function init() {
  initTheme();
  renderSwatches();
  renderNews();
  renderCommunity();
  renderTips();
  renderSkills();
  renderMakes();
  renderPress();
  setupEventListeners();
  updateWires();
  handleDeepLink();
}

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */

function initTheme() {
  const savedTheme = localStorage.getItem('MYEONGDO_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('MYEONGDO_theme', theme);
  
  if (theme === 'dark') {
    elements.themeIconSun.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  } else {
    elements.themeIconSun.innerHTML = `<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>`;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}

/* ==========================================================================
   Dynamic SVG Bezier Wires (Figma Node Graph)
   ========================================================================== */

function updateWires() {
  if (!elements.portCharOut || !elements.portPromptOut || !elements.portHubIn || !elements.heroWires) return;

  const heroRect = document.getElementById('workflowHero').getBoundingClientRect();
  const getPortCoord = (port) => {
    const rect = port.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - heroRect.left,
      y: rect.top + rect.height / 2 - heroRect.top
    };
  };

  const pChar = getPortCoord(elements.portCharOut);
  const pPrompt = getPortCoord(elements.portPromptOut);
  const pHub = getPortCoord(elements.portHubIn);

  // Bezier curve calculations
  const makeBezier = (p1, p2) => {
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
  };

  elements.wireCharToHub.setAttribute('d', makeBezier(pChar, pHub));
  elements.wirePromptToHub.setAttribute('d', makeBezier(pPrompt, pHub));
}

/* ==========================================================================
   Rendering Functions
   ========================================================================== */

function renderSwatches() {
  const categories = [
    { name: "바이브코딩", color: "leaf" },
    { name: "AI 도구", color: "sky" },
    { name: "영상/VFX", color: "tang" },
    { name: "이미지/디자인", color: "grape" },
    { name: "AI 스킬", color: "sun" },
    { name: "커뮤니티", color: "rose" }
  ];

  elements.swatchesContainer.innerHTML = categories.map(cat => `
    <div class="swatch-item k-${cat.color}" data-cat="${cat.name}">
      <span class="swatch-dot"></span>
      <span>${cat.name}</span>
    </div>
  `).join('');

  elements.swatchesContainer.querySelectorAll('.swatch-item').forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.cat;
      setFilterCategory(cat);
    });
  });
}

function renderNews() {
  elements.newsSlider.innerHTML = newsList.map((item, idx) => `
    <div class="news-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
      <div class="news-title">
        <span class="news-badge k-${item.badgeType}">${item.badge}</span>
        <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
      </div>
      <div class="news-desc">${item.desc}</div>
    </div>
  `).join('');

  startNewsTimer();
}

function startNewsTimer() {
  if (state.newsTimer) clearInterval(state.newsTimer);
  state.newsTimer = setInterval(() => {
    showNextNews();
  }, 5000);
}

function showNextNews() {
  state.currentNewsIndex = (state.currentNewsIndex + 1) % newsList.length;
  updateNewsSlide();
}

function showPrevNews() {
  state.currentNewsIndex = (state.currentNewsIndex - 1 + newsList.length) % newsList.length;
  updateNewsSlide();
}

function updateNewsSlide() {
  const items = elements.newsSlider.querySelectorAll('.news-item');
  items.forEach((item, idx) => {
    item.classList.toggle('active', idx === state.currentNewsIndex);
  });
}

function renderCommunity() {
  elements.communityTilesGrid.innerHTML = communityLinks.map(c => `
    <a href="${c.link}" target="_blank" rel="noopener" class="tile ${c.wide ? 'tile-wide' : ''} k-${c.color}" id="${c.id}">
      <div class="handles">
        <span class="handle-corner handle-tl"></span>
        <span class="handle-corner handle-tr"></span>
        <span class="handle-corner handle-bl"></span>
        <span class="handle-corner handle-br"></span>
        <span class="handle-pill">Component</span>
      </div>
      <div class="tile-top">
        <span class="tile-badge">${c.badge}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </div>
      <div>
        <div class="tile-title">${c.title}</div>
        <div class="tile-desc">${c.desc}</div>
      </div>
    </a>
  `).join('');
}

function renderTips() {
  const filtered = filterData(tipsData);
  if (filtered.length === 0) {
    elements.tipsContainer.innerHTML = getEmptyStateHTML();
    return;
  }

  elements.tipsContainer.innerHTML = filtered.map(t => `
    <div class="card k-${t.color}" id="${t.id}">
      <div class="handles">
        <span class="handle-corner handle-tl"></span>
        <span class="handle-corner handle-tr"></span>
        <span class="handle-corner handle-bl"></span>
        <span class="handle-corner handle-br"></span>
        <span class="handle-pill">공유된 팁</span>
      </div>
      <div>
        <div class="card-top">
          <span class="layer-tag mono">${t.layer}</span>
          <div class="card-badges">
            ${t.isNew ? '<span class="badge-new">NEW</span>' : ''}
            <span class="badge-cat">${t.category}</span>
          </div>
        </div>
        <h3 class="card-title">${t.title}</h3>
        <p class="card-desc">${t.desc}</p>
        <div class="card-tags">
          <span class="mini-tag mono">⏱ ${t.readTime}</span>
          ${t.tags.map(tag => `<span class="mini-tag">#${tag}</span>`).join('')}
        </div>
      </div>
      <div class="card-actions">
        <a href="${t.link}" target="_blank" rel="noopener" class="btn-primary">
          <span>팁 열기</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>
        <button class="btn-copy" data-action="share" data-id="${t.id}" title="공유 링크 복사">
          <span>🔗 공유</span>
        </button>
      </div>
    </div>
  `).join('');

  attachActionListeners(elements.tipsContainer);
}

function renderSkills() {
  const filtered = filterData(skillsData);
  if (filtered.length === 0) {
    elements.skillsContainer.innerHTML = getEmptyStateHTML();
    return;
  }

  elements.skillsContainer.innerHTML = filtered.map(s => `
    <div class="card k-${s.color}" id="${s.id}">
      <div class="handles">
        <span class="handle-corner handle-tl"></span>
        <span class="handle-corner handle-tr"></span>
        <span class="handle-corner handle-bl"></span>
        <span class="handle-corner handle-br"></span>
        <span class="handle-pill">공유된 스킬</span>
      </div>
      <div>
        <div class="card-top">
          <span class="layer-tag mono">${s.layer}</span>
          <div class="card-badges">
            ${s.isNew ? '<span class="badge-new">NEW</span>' : ''}
            <span class="badge-cat">${s.category}</span>
          </div>
        </div>
        <h3 class="card-title">${s.title}</h3>
        <p class="card-desc">${s.desc}</p>
        <div class="node-card" style="margin-bottom: 12px; padding: 10px; background: var(--surface-alt); border-radius: 8px;">
          <div class="mono" style="font-size: 11px; color: var(--sun); font-weight: 700; margin-bottom: 4px;">💬 프롬프트 예시</div>
          <div class="mono" style="font-size: 11.5px; color: var(--fg-secondary); line-height: 1.4;">“${s.promptPreview}”</div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-primary" data-action="copy-skill" data-url="${s.repoUrl}">
          <span>스킬 링크 복사</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
        <a href="${s.repoUrl}" target="_blank" rel="noopener" class="btn-copy" title="GitHub 리포지토리">
          <span>GitHub</span>
        </a>
        <button class="btn-copy" data-action="share" data-id="${s.id}" title="공유 링크 복사">
          <span>🔗</span>
        </button>
      </div>
    </div>
  `).join('');

  attachActionListeners(elements.skillsContainer);
}

function renderMakes() {
  const filtered = filterData(makesData);
  if (filtered.length === 0) {
    elements.makesContainer.innerHTML = getEmptyStateHTML();
    return;
  }

  elements.makesContainer.innerHTML = filtered.map(m => `
    <div class="card lab-card k-${m.color}" id="${m.id}">
      <div class="handles">
        <span class="handle-corner handle-tl"></span>
        <span class="handle-corner handle-tr"></span>
        <span class="handle-corner handle-bl"></span>
        <span class="handle-corner handle-br"></span>
        <span class="handle-pill">Lab Project</span>
      </div>
      <div>
        <div class="card-top">
          <span class="layer-tag mono">${m.layer}</span>
          ${m.isNew ? '<span class="badge-new">NEW</span>' : ''}
        </div>
        <div class="lab-icon-box">${m.icon}</div>
        <h3 class="card-title" style="font-size: 14.5px;">${m.title}</h3>
        <p class="card-desc" style="font-size: 12.5px;">${m.desc}</p>
        <div class="tech-pills">
          ${m.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>
      </div>
      <div class="card-actions" style="margin-top: 10px;">
        <a href="${m.link}" target="_blank" rel="noopener" class="btn-primary" style="padding: 7px 10px;">
          <span>열어보기</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>
        <button class="btn-copy" data-action="share" data-id="${m.id}" title="공유 링크 복사" style="padding: 7px 10px;">
          <span>🔗</span>
        </button>
      </div>
    </div>
  `).join('');

  attachActionListeners(elements.makesContainer);
}

function renderPress() {
  elements.pressContainer.innerHTML = pressList.map(p => `
    <a href="${p.link}" target="_blank" rel="noopener" class="press-item k-${p.badgeColor}" id="${p.id}">
      <div class="press-top">
        <span class="press-badge" style="background: var(--cb); color: var(--c);">${p.badge}</span>
      </div>
      <div class="press-title">${p.title}</div>
      <div class="press-desc">${p.desc}</div>
    </a>
  `).join('');
}

function getEmptyStateHTML() {
  return `
    <div style="grid-column: 1 / -1; padding: 40px 20px; text-align: center; color: var(--muted); background: var(--surface); border: 1px dashed var(--line); border-radius: var(--radius-lg);">
      <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
      <div style="font-size: 15px; font-weight: 700; color: var(--fg); margin-bottom: 4px;">일치하는 항목이 없습니다</div>
      <div style="font-size: 13px;">다른 검색어를 입력하시거나 카테고리 필터를 변경해 보세요.</div>
    </div>
  `;
}

/* ==========================================================================
   Filter & Search Logic
   ========================================================================== */

function filterData(dataArray) {
  return dataArray.filter(item => {
    // Category match
    const matchCategory = state.activeCategory === 'all' || 
      (item.category && item.category.includes(state.activeCategory));

    // Search query match
    const q = state.searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
      (item.tech && item.tech.some(t => t.toLowerCase().includes(q)));

    return matchCategory && matchSearch;
  });
}

function setFilterCategory(category) {
  state.activeCategory = category;
  elements.filterPills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.cat === category);
  });
  refreshActiveTab();
}

function refreshActiveTab() {
  if (state.activeTab === 'tips') renderTips();
  if (state.activeTab === 'skills') renderSkills();
  if (state.activeTab === 'makes') renderMakes();
}

/* ==========================================================================
   Interactive Event Listeners
   ========================================================================== */

function setupEventListeners() {
  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Tab switching
  elements.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      switchTab(tabName);
    });
  });

  // Search input
  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    refreshActiveTab();
  });

  // Category filter pills
  elements.filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      setFilterCategory(pill.dataset.cat);
    });
  });

  // News carousel nav
  elements.newsPrevBtn.addEventListener('click', () => {
    showPrevNews();
    startNewsTimer();
  });
  elements.newsNextBtn.addEventListener('click', () => {
    showNextNews();
    startNewsTimer();
  });

  // Modal close
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.modalBackdrop.addEventListener('click', (e) => {
    if (e.target === elements.modalBackdrop) closeModal();
  });

  // Window resize -> recalculate SVG wires
  window.addEventListener('resize', () => {
    updateWires();
  });

  // Hash change
  window.addEventListener('hashchange', handleDeepLink);
}

function switchTab(tabName) {
  state.activeTab = tabName;

  elements.tabButtons.forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  elements.tabPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabName}`);
  });

  refreshActiveTab();
  updateWires();
}

function attachActionListeners(container) {
  // Copy skill link
  container.querySelectorAll('[data-action="copy-skill"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = btn.dataset.url;
      copyToClipboard(url, '스킬 링크가 복사되었습니다! Claude나 GPT에 붙여넣으세요.');
      btn.innerHTML = `<span>복사 완료! ✓</span>`;
      setTimeout(() => {
        btn.innerHTML = `<span>스킬 링크 복사</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      }, 2000);
    });
  });

  // Share deep-link
  container.querySelectorAll('[data-action="share"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const shareUrl = `${window.location.origin}${window.location.pathname}#${id}`;
      copyToClipboard(shareUrl, '카드 공유 링크가 복사되었습니다!');
      btn.innerHTML = `<span>✓</span>`;
      setTimeout(() => {
        btn.innerHTML = `<span>🔗</span>`;
      }, 2000);
    });
  });
}

/* ==========================================================================
   Deep-Linking Support (#tip8, #skill3, etc.)
   ========================================================================== */

function handleDeepLink() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  let targetTab = null;
  if (hash.startsWith('tip')) targetTab = 'tips';
  else if (hash.startsWith('skill')) targetTab = 'skills';
  else if (hash.startsWith('make')) targetTab = 'makes';

  if (targetTab && targetTab !== state.activeTab) {
    switchTab(targetTab);
  }

  setTimeout(() => {
    const el = document.getElementById(hash);
    if (el) {
      document.querySelectorAll('.hit').forEach(node => node.classList.remove('hit'));
      el.classList.add('hit');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 200);
}

/* ==========================================================================
   Modal & Toast Helpers
   ========================================================================== */

function closeModal() {
  elements.modalBackdrop.classList.remove('open');
}

function showToast(message) {
  elements.toastMsg.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2800);
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('복사에 실패했습니다.');
  }
  document.body.removeChild(textArea);
}

// Kick off
document.addEventListener('DOMContentLoaded', init);

