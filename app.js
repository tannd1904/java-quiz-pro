/**
 * =========================================================================================
 *                   APP.JS - LOGIC XỬ LÝ ỨNG DỤNG TRẮC NGHIỆM JAVA ONLINE
 *                           (CHỌN CHỦ ĐỀ LINH HOẠT TRONG CẢ 2 CHẾ ĐỘ)
 * =========================================================================================
 */

// Application Global State
const state = {
  currentView: 'HOME', // 'HOME' | 'PRACTICE' | 'EXAM' | 'RESULT'
  practiceModeEnabled: CONFIG.ENABLE_PRACTICE_MODE,

  // Practice Mode State: set of topic IDs currently selected
  practiceSelectedTopics: TOPICS_CONFIG.map(t => t.id), // default to all topics
  practiceSearchQuery: '',
  practiceAnswers: {}, // { [qId]: { selectedText, isCorrect } }

  // Exam Mode State
  examQuestions: [],
  examAnswers: {}, // { [qId]: selectedText }
  examTimerInterval: null,
  examSecondsRemaining: 0,
  examTotalTimeSeconds: 0,
  examStartTime: null,
  examTopicsUsed: [],

  // Review / Result State
  lastExamResult: null
};

// Preset topic groups
const TOPIC_PRESETS = {
  ALL: TOPICS_CONFIG.map(t => t.id),
  CORE_OOP_6: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'interface', 'constructor'],
  OOP_4: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction'],
  ADVANCED_JVM: ['static_final', 'exception', 'memory_jvm', 'collections', 'design_patterns'],
  CORE_SYNTAX: ['string', 'arrays', 'io_scanner', 'control_flow', 'core_java']
};

function getPresetCount(presetKey) {
  if (presetKey === 'ALL') return QUIZ_DATA.length;
  if (!TOPIC_PRESETS[presetKey]) return 0;
  const topics = TOPIC_PRESETS[presetKey];
  return QUIZ_DATA.filter(q => topics.includes(q.topicId)).length;
}

// =========================================================================
// 1. INITIALIZATION & ROUTING
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  updateAdminBadgeUI();
  setupEventListeners();
  renderHome();
}

function updateAdminBadgeUI() {
  const badge = document.getElementById('adminToggleBadge');
  if (!badge) return;

  if (state.practiceModeEnabled) {
    badge.className = 'admin-badge unlocked';
    badge.innerHTML = '🟢 Ôn tập: ĐÃ MỞ (Click để Khóa)';
    badge.title = 'Click để khóa chế độ ôn tập (bắt buộc làm bài kiểm tra trước)';
  } else {
    badge.className = 'admin-badge locked';
    badge.innerHTML = '🔒 Ôn tập: ĐANG KHÓA (Click để Mở)';
    badge.title = 'Click để mở chế độ ôn tập';
  }

  const practiceCard = document.getElementById('practiceModeCard');
  if (practiceCard) {
    if (state.practiceModeEnabled) {
      practiceCard.classList.remove('locked');
      const ribbon = practiceCard.querySelector('.lock-ribbon');
      if (ribbon) ribbon.remove();
      const notice = practiceCard.querySelector('.locked-notice');
      if (notice) notice.remove();
      const btn = practiceCard.querySelector('.btn');
      if (btn) {
        btn.className = 'btn btn-success';
        btn.innerHTML = 'Bắt đầu ôn tập 🚀';
      }
    } else {
      practiceCard.classList.add('locked');
    }
  }
}

function setupEventListeners() {
  const brand = document.getElementById('brandHomeBtn');
  if (brand) brand.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.currentView === 'EXAM') {
      if (confirm('Bạn đang trong bài thi kiểm tra. Bạn có chắc chắn muốn thoát về trang chủ?')) {
        clearInterval(state.examTimerInterval);
        navigateTo('HOME');
      }
    } else {
      navigateTo('HOME');
    }
  });

  const adminBadge = document.getElementById('adminToggleBadge');
  if (adminBadge) {
    adminBadge.addEventListener('click', () => {
      state.practiceModeEnabled = !state.practiceModeEnabled;
      updateAdminBadgeUI();
      if (state.currentView === 'HOME') renderHome();
    });
  }
}

function navigateTo(viewName) {
  state.currentView = viewName;
  const container = document.getElementById('appContainer');
  if (!container) return;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (viewName) {
    case 'HOME':
      renderHome();
      break;
    case 'PRACTICE':
      renderPractice();
      break;
    case 'EXAM':
      renderExam();
      break;
    case 'RESULT':
      renderResult();
      break;
  }
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// =========================================================================
// 2. HOME VIEW (CHỌN CHẾ ĐỘ)
// =========================================================================
function renderHome() {
  const container = document.getElementById('appContainer');
  const isPracticeLocked = !state.practiceModeEnabled;
  const totalQuestions = QUIZ_DATA.length;

  container.innerHTML = `
    <div class="hero-section">
      <div class="hero-pill">⚡ Nền tảng ôn thi trắc nghiệm Java chuyên sâu</div>
      <h1 class="hero-title">${CONFIG.APP_TITLE}</h1>
      <p class="hero-desc">${CONFIG.SUBTITLE}. Tự do chọn các chủ đề bạn muốn luyện tập hoặc thi cử (Encapsulation, Inheritance, Polymorphism, Abstraction, Interface, Constructor, Memory, Exceptions, Collections...).</p>
    </div>

    <div class="mode-cards-grid">
      <!-- CARD 1: KIỂM TRA ĐÁNH GIÁ NĂNG LỰC -->
      <div class="mode-card featured exam-mode">
        <div class="mode-icon-circle">🎯</div>
        <h2>Chế độ Kiểm tra</h2>
        <p>Thực hiện bài thi ngẫu nhiên theo <strong>các chủ đề tự chọn</strong> hoặc toàn bộ ngân hàng ${totalQuestions} câu. Hệ thống tính giờ tự động và chấm điểm kèm lời giải chi tiết sau khi nộp.</p>
        <ul class="mode-features-list">
          <li><span class="check">✓</span> <strong>Chọn chủ đề linh hoạt</strong> (Encapsulation, Inheritance, Đa hình, v.v.)</li>
          <li><span class="check">✓</span> <strong>${CONFIG.EXAM_QUESTION_COUNT} câu hỏi ngẫu nhiên</strong> (tùy chỉnh số lượng)</li>
          <li><span class="check">✓</span> Thời gian làm bài: <strong>${CONFIG.EXAM_TIME_MINUTES} phút</strong> (tùy chỉnh)</li>
          <li><span class="check">✓</span> Đáp án A, B, C, D <strong>tự động xáo trộn</strong> tránh học vẹt</li>
        </ul>
        <button class="btn btn-primary" onclick="openExamSetupModal()">Chọn chủ đề &amp; Bắt đầu thi 📝</button>
      </div>

      <!-- CARD 2: ÔN TẬP VÀ GIẢI ĐÁP ÁN -->
      <div id="practiceModeCard" class="mode-card practice-mode ${isPracticeLocked ? 'locked' : ''}">
        ${isPracticeLocked ? '<div class="lock-ribbon">TẠM KHÓA</div>' : ''}
        <div class="mode-icon-circle">💡</div>
        <h2>Chế độ Ôn tập</h2>
        <p>Luyện tập và củng cố kiến thức theo <strong>các chủ đề mong muốn</strong>. Chọn đáp án để biết ngay kết quả Đúng/Sai cùng lời giải thích chuyên sâu và mã nguồn minh họa.</p>
        
        ${isPracticeLocked ? `
          <div class="locked-notice">
            🔒 Tính năng ôn tập đang được Quản trị viên tạm khóa để ưu tiên kiểm tra đánh giá năng lực ban đầu!
          </div>
        ` : ''}

        <ul class="mode-features-list">
          <li><span class="check">✓</span> <strong>Lọc câu hỏi theo 1 hoặc nhiều chủ đề</strong> tùy chọn</li>
          <li><span class="check">✓</span> <strong>Biết kết quả ngay lập tức</strong> sau khi chọn</li>
          <li><span class="check">✓</span> <strong>Giải thích lý do &amp; code minh họa</strong> chi tiết</li>
          <li><span class="check">✓</span> Tìm kiếm từ khóa nhanh trong câu hỏi &amp; code</li>
        </ul>

        <button class="btn ${isPracticeLocked ? 'btn-secondary' : 'btn-success'}" onclick="handlePracticeClick()">
          ${isPracticeLocked ? '🔒 Ôn tập đang bị khóa' : 'Bắt đầu ôn tập 🚀'}
        </button>
      </div>
    </div>
  `;
}

function handlePracticeClick() {
  if (!state.practiceModeEnabled) {
    showModal(
      '🔒 Tính năng Ôn tập đang tạm khóa',
      'Người quản trị đã thiết lập khóa chế độ ôn tập nhằm yêu cầu học viên hoàn thành bài <strong>Kiểm tra đánh giá năng lực</strong> trước.<br><br>Vui lòng chọn <strong>Chế độ Kiểm tra</strong> để làm bài thi trước hoặc mở khóa trên nút trạng thái góc trên!',
      'Đã hiểu'
    );
    return;
  }
  navigateTo('PRACTICE');
}

// =========================================================================
// 3. CHẾ ĐỘ ÔN TẬP (PRACTICE MODE)
// =========================================================================
function renderPractice() {
  const container = document.getElementById('appContainer');

  container.innerHTML = `
    <!-- TOPIC SELECTOR CARD -->
    <div class="topic-selector-card">
      <div class="topic-selector-header">
        <div class="topic-selector-title">
          <span>📚 Chọn chủ đề ôn luyện (Có thể chọn nhiều chủ đề cùng lúc):</span>
        </div>
        <div class="topic-quick-presets">
          <button type="button" class="topic-preset-btn" onclick="applyPracticePreset('ALL')">✨ Tất cả (${getPresetCount('ALL')} câu)</button>
          <button type="button" class="topic-preset-btn" onclick="applyPracticePreset('CORE_OOP_6')">🎯 Bộ 6 Chủ Đề OOP (${getPresetCount('CORE_OOP_6')} câu)</button>
          <button type="button" class="topic-preset-btn" onclick="applyPracticePreset('OOP_4')">💎 4 Tính Chất OOP (${getPresetCount('OOP_4')} câu)</button>
          <button type="button" class="topic-preset-btn" onclick="applyPracticePreset('ADVANCED_JVM')">⚡ Nâng Cao &amp; JVM (${getPresetCount('ADVANCED_JVM')} câu)</button>
          <button type="button" class="topic-preset-btn" onclick="applyPracticePreset('NONE')">🧹 Bỏ chọn hết</button>
        </div>
      </div>

      <div class="topic-chips-grid" id="practiceTopicChipsGrid">
        ${renderTopicChipsHTML(state.practiceSelectedTopics, 'togglePracticeTopic')}
      </div>
    </div>

    <!-- CONTROLS & STATS BAR -->
    <div class="practice-header" style="margin-bottom: 14px;">
      <div class="practice-stats" id="practiceStatsBar">
        <span>📊 Đang hiển thị: <strong id="practiceCountText">0</strong> câu (<span id="practiceSelectedTopicCount">${state.practiceSelectedTopics.length}</span> chủ đề)</span>
        <span>|</span>
        <span>✅ Đã trả lời đúng: <strong id="practiceCorrectCount">0</strong></span>
        <span>|</span>
        <span>❌ Trả lời sai: <strong id="practiceWrongCount">0</strong></span>
      </div>

      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
        <input type="text" class="practice-search" id="practiceSearchInput" placeholder="🔍 Tìm kiếm câu hỏi, từ khóa, code..." value="${state.practiceSearchQuery}" oninput="handlePracticeSearch(this.value)">
        <button class="btn btn-outline" style="font-size:0.85rem; padding:6px 12px;" onclick="resetPracticeProgress()">🔄 Xóa kết quả làm</button>
        <button class="btn btn-secondary" onclick="navigateTo('HOME')">🏠 Về Trang Chủ</button>
      </div>
    </div>

    <!-- QUESTIONS FEED -->
    <div class="question-feed" id="practiceQuestionFeed">
      <!-- Dynamic Questions rendered here -->
    </div>
  `;

  renderPracticeQuestions();
}

function renderTopicChipsHTML(selectedList, clickHandlerName) {
  return TOPICS_CONFIG.map(t => {
    const isSelected = selectedList.includes(t.id);
    const count = QUIZ_DATA.filter(q => q.topicId === t.id).length;
    return `
      <div class="topic-chip ${isSelected ? 'selected' : ''}" onclick="${clickHandlerName}('${t.id}')">
        <span class="chip-check">${isSelected ? '✓' : '+'}</span>
        <span>${t.icon}</span>
        <span>${escapeHtml(t.shortName)}</span>
        <span class="chip-count">${count}</span>
      </div>
    `;
  }).join('');
}

function togglePracticeTopic(topicId) {
  if (state.practiceSelectedTopics.includes(topicId)) {
    state.practiceSelectedTopics = state.practiceSelectedTopics.filter(id => id !== topicId);
  } else {
    state.practiceSelectedTopics.push(topicId);
  }
  updatePracticeTopicChipsUI();
  renderPracticeQuestions();
}

function applyPracticePreset(presetKey) {
  if (presetKey === 'NONE') {
    state.practiceSelectedTopics = [];
  } else if (TOPIC_PRESETS[presetKey]) {
    state.practiceSelectedTopics = [...TOPIC_PRESETS[presetKey]];
  }
  updatePracticeTopicChipsUI();
  renderPracticeQuestions();
}

function updatePracticeTopicChipsUI() {
  const grid = document.getElementById('practiceTopicChipsGrid');
  if (grid) {
    grid.innerHTML = renderTopicChipsHTML(state.practiceSelectedTopics, 'togglePracticeTopic');
  }
  const countSpan = document.getElementById('practiceSelectedTopicCount');
  if (countSpan) {
    countSpan.textContent = state.practiceSelectedTopics.length;
  }
}

function handlePracticeSearch(query) {
  state.practiceSearchQuery = query.toLowerCase().trim();
  renderPracticeQuestions();
}

function resetPracticeProgress() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ kết quả đã làm trong chế độ ôn tập?')) {
    state.practiceAnswers = {};
    renderPracticeQuestions();
    updatePracticeProgressCounts();
  }
}

function renderPracticeQuestions() {
  const feed = document.getElementById('practiceQuestionFeed');
  if (!feed) return;

  // Filter questions: topicId in selected topics
  const filtered = QUIZ_DATA.filter(q => {
    const matchTopic = state.practiceSelectedTopics.includes(q.topicId);
    if (!matchTopic) return false;

    if (state.practiceSearchQuery) {
      const qText = (q.question || '').toLowerCase();
      const cSnippet = (q.codeSnippet || '').toLowerCase();
      const exp = (q.explanation || '').toLowerCase();
      const cat = (q.category || '').toLowerCase();
      const tName = (q.topicName || '').toLowerCase();
      const optsMatch = (q.options || []).some(opt => opt.toLowerCase().includes(state.practiceSearchQuery));

      return qText.includes(state.practiceSearchQuery) ||
        cSnippet.includes(state.practiceSearchQuery) ||
        exp.includes(state.practiceSearchQuery) ||
        cat.includes(state.practiceSearchQuery) ||
        tName.includes(state.practiceSearchQuery) ||
        optsMatch;
    }

    return true;
  });

  const countText = document.getElementById('practiceCountText');
  if (countText) countText.textContent = filtered.length;

  updatePracticeProgressCounts();

  if (state.practiceSelectedTopics.length === 0) {
    feed.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; background:white; border-radius:12px; border:1px solid #e2e8f0;">
        <div style="font-size:3rem; margin-bottom:12px;">👆</div>
        <h3>Bạn chưa chọn chủ đề nào</h3>
        <p style="color:#64748b; margin-top:8px;">Vui lòng nhấp chọn ít nhất 1 chủ đề ở khung phía trên (hoặc bấm <strong>Tất cả</strong>) để bắt đầu ôn luyện!</p>
      </div>
    `;
    return;
  }

  if (filtered.length === 0) {
    feed.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; background:white; border-radius:12px; border:1px solid #e2e8f0;">
        <h3>Không tìm thấy câu hỏi phù hợp</h3>
        <p style="color:#64748b; margin-top:8px;">Không có câu hỏi nào khớp với từ khóa tìm kiếm trong các chủ đề bạn đã chọn.</p>
      </div>
    `;
    return;
  }

  feed.innerHTML = filtered.map((q) => {
    const userAns = state.practiceAnswers[q.id];
    const isAnswered = !!userAns;

    const codeHtml = q.codeSnippet ? `
      <pre class="q-code-snippet"><code>${escapeHtml(q.codeSnippet)}</code></pre>
    ` : '';

    const imgHtml = q.image ? `
      <div class="q-img-wrap">
        <img src="${q.image}" alt="Hình ảnh câu hỏi #${q.id}" loading="lazy">
      </div>
    ` : '';

    const letters = ['A', 'B', 'C', 'D', 'E'];
    const optsHtml = q.options.map((opt, oIdx) => {
      const letter = letters[oIdx] || '•';
      let optClass = 'opt-btn';

      if (isAnswered) {
        if (opt === q.correct_text) {
          optClass += ' correct';
        } else if (opt === userAns.selectedText) {
          optClass += ' incorrect';
        }
      }

      return `
        <button class="${optClass}" ${isAnswered ? 'disabled' : ''} onclick="handlePracticeSelect(${q.id}, '${escapeQuote(opt)}')">
          <span class="opt-label">${letter}</span>
          <span class="opt-text">${escapeHtml(opt)}</span>
        </button>
      `;
    }).join('');

    const expDrawerHtml = `
      <div class="explanation-drawer ${isAnswered ? 'visible' : ''}" id="exp_${q.id}">
        <div class="exp-badge">💡 GIẢI THÍCH CHI TIẾT ĐÁP ÁN:</div>
        <div class="exp-content">${formatExplanationText(q.explanation, q.correct_text)}</div>
      </div>
    `;

    return `
      <div class="q-box" id="qbox_${q.id}">
        <div class="q-box-meta">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="category-tag">${q.topicIcon || '☕'} ${escapeHtml(q.topicShortName || q.category)}</span>
            <span class="bank-id-tag">${escapeHtml(q.bank_id || 'ID-' + q.id)}</span>
          </div>
          <span class="q-num-text">Câu hỏi #${q.id}</span>
        </div>
        <div class="q-text-body">${escapeHtml(q.question)}</div>
        ${codeHtml}
        ${imgHtml}
        <div class="options-stack">
          ${optsHtml}
        </div>
        ${expDrawerHtml}
      </div>
    `;
  }).join('');
}

function handlePracticeSelect(questionId, selectedText) {
  const q = QUIZ_DATA.find(item => item.id === questionId);
  if (!q) return;

  const isCorrect = (selectedText === q.correct_text);
  state.practiceAnswers[questionId] = {
    selectedText,
    isCorrect
  };

  const qBox = document.getElementById(`qbox_${questionId}`);
  if (qBox) {
    const optButtons = qBox.querySelectorAll('.opt-btn');
    optButtons.forEach((btn, idx) => {
      btn.disabled = true;
      const optText = q.options[idx];
      if (optText === q.correct_text) {
        btn.classList.add('correct');
      } else if (optText === selectedText) {
        btn.classList.add('incorrect');
      }
    });

    const expDrawer = document.getElementById(`exp_${questionId}`);
    if (expDrawer) {
      expDrawer.classList.add('visible');
    }
  }

  updatePracticeProgressCounts();
}

function updatePracticeProgressCounts() {
  const correctCount = Object.values(state.practiceAnswers).filter(a => a.isCorrect).length;
  const wrongCount = Object.values(state.practiceAnswers).filter(a => !a.isCorrect).length;

  const cEl = document.getElementById('practiceCorrectCount');
  const wEl = document.getElementById('practiceWrongCount');
  if (cEl) cEl.textContent = correctCount;
  if (wEl) wEl.textContent = wrongCount;
}

// =========================================================================
// 4. CHẾ ĐỘ KIỂM TRA (EXAM MODE)
// =========================================================================

// Temporary setup state for the modal
let currentSetup = {
  selectedTopics: TOPICS_CONFIG.map(t => t.id), // default all topics
  questionCount: CONFIG.EXAM_QUESTION_COUNT || 40,
  timeMinutes: CONFIG.EXAM_TIME_MINUTES || 45,
  shuffleOptions: CONFIG.SHUFFLE_OPTIONS,
  shuffleQuestions: CONFIG.SHUFFLE_QUESTIONS
};

function getPoolSizeForSelectedTopics(topics) {
  return QUIZ_DATA.filter(q => topics.includes(q.topicId)).length;
}

function openExamSetupModal() {
  let modalOverlay = document.getElementById('globalModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'globalModalOverlay';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  renderExamSetupModalContent(modalOverlay);
  modalOverlay.classList.add('open');
}

function renderExamSetupModalContent(modalOverlay) {
  const poolSize = getPoolSizeForSelectedTopics(currentSetup.selectedTopics);

  if (currentSetup.questionCount > poolSize && poolSize > 0) {
    currentSetup.questionCount = poolSize;
  }
  if (poolSize === 0) {
    currentSetup.questionCount = 0;
  }

  modalOverlay.innerHTML = `
    <div class="modal-card setup-modal" style="max-width: 680px;">
      <div class="setup-header">
        <div class="setup-header-icon">🎯</div>
        <div class="setup-header-text">
          <h3>Thiết Lập Đề Thi Kiểm Tra Theo Chủ Đề</h3>
          <p>Tùy chọn một hoặc nhiều chủ đề trọng tâm, số lượng câu hỏi và thời gian làm bài</p>
        </div>
      </div>

      <!-- 1. CHỌN CHỦ ĐỀ BÀI THI -->
      <div class="setup-section">
        <div class="setup-label">
          <span>1. Chọn chủ đề thi (${currentSetup.selectedTopics.length}/${TOPICS_CONFIG.length} chủ đề)</span>
          <span class="setup-hint" id="modalPoolCountBadge" style="font-weight:700; color:#4f46e5;">(Khả dụng: ${poolSize} câu hỏi)</span>
        </div>
        
        <div class="topic-quick-presets" style="margin-bottom: 10px;">
          <button type="button" class="topic-preset-btn" onclick="applyExamPreset('ALL')">✨ Tất cả (${getPresetCount('ALL')})</button>
          <button type="button" class="topic-preset-btn" onclick="applyExamPreset('CORE_OOP_6')">🎯 Bộ 6 OOP Cốt Lõi (${getPresetCount('CORE_OOP_6')})</button>
          <button type="button" class="topic-preset-btn" onclick="applyExamPreset('OOP_4')">💎 4 Tính Chất OOP (${getPresetCount('OOP_4')})</button>
          <button type="button" class="topic-preset-btn" onclick="applyExamPreset('ADVANCED_JVM')">⚡ Nâng Cao &amp; JVM (${getPresetCount('ADVANCED_JVM')})</button>
        </div>

        <div class="modal-topic-chips-grid" id="modalTopicChipsGrid">
          ${renderTopicChipsHTML(currentSetup.selectedTopics, 'toggleExamSetupTopic')}
        </div>
      </div>

      <!-- 2. SỐ LƯỢNG CÂU HỎI -->
      <div class="setup-section">
        <div class="setup-label">
          <span>2. Số lượng câu hỏi thi</span>
          <span class="setup-hint">(Tối đa ${poolSize} câu từ các chủ đề đã chọn)</span>
        </div>
        <div class="preset-pills-row">
          ${poolSize >= 10 ? `<button type="button" class="setup-pill ${currentSetup.questionCount === 10 ? 'active' : ''}" onclick="setSetupQCount(10)">10 câu</button>` : ''}
          ${poolSize >= 20 ? `<button type="button" class="setup-pill ${currentSetup.questionCount === 20 ? 'active' : ''}" onclick="setSetupQCount(20)">20 câu</button>` : ''}
          ${poolSize >= 30 ? `<button type="button" class="setup-pill ${currentSetup.questionCount === 30 ? 'active' : ''}" onclick="setSetupQCount(30)">30 câu</button>` : ''}
          ${poolSize >= 40 ? `<button type="button" class="setup-pill ${currentSetup.questionCount === 40 ? 'active' : ''}" onclick="setSetupQCount(40)">40 câu (Chuẩn)</button>` : ''}
          ${poolSize >= 50 ? `<button type="button" class="setup-pill ${currentSetup.questionCount === 50 ? 'active' : ''}" onclick="setSetupQCount(50)">50 câu</button>` : ''}
          <button type="button" class="setup-pill ${currentSetup.questionCount === poolSize && poolSize > 0 ? 'active' : ''}" onclick="setSetupQCount(${poolSize})">Tất cả (${poolSize} câu)</button>
        </div>
        <div class="setup-input-wrap">
          <input type="number" id="setupQCountInput" class="setup-number-input" min="1" max="${poolSize}" value="${currentSetup.questionCount}" oninput="onSetupQInput(this.value)">
          <span class="setup-unit-label">câu hỏi</span>
        </div>
      </div>

      <!-- 3. CHỌN THỜI GIAN LÀM BÀI -->
      <div class="setup-section">
        <div class="setup-label">
          <span>3. Thời gian làm bài</span>
          <span class="setup-hint">(Tính theo phút)</span>
        </div>
        <div class="preset-pills-row">
          <button type="button" class="setup-pill ${currentSetup.timeMinutes === 15 ? 'active' : ''}" onclick="setSetupMinutes(15)">15 phút</button>
          <button type="button" class="setup-pill ${currentSetup.timeMinutes === 30 ? 'active' : ''}" onclick="setSetupMinutes(30)">30 phút</button>
          <button type="button" class="setup-pill ${currentSetup.timeMinutes === 45 ? 'active' : ''}" onclick="setSetupMinutes(45)">45 phút (Chuẩn)</button>
          <button type="button" class="setup-pill ${currentSetup.timeMinutes === 60 ? 'active' : ''}" onclick="setSetupMinutes(60)">60 phút</button>
          <button type="button" class="setup-pill ${currentSetup.timeMinutes === 90 ? 'active' : ''}" onclick="setSetupMinutes(90)">90 phút</button>
        </div>
        <div class="setup-input-wrap">
          <input type="number" id="setupMinutesInput" class="setup-number-input" min="1" max="180" value="${currentSetup.timeMinutes}" oninput="onSetupMinInput(this.value)">
          <span class="setup-unit-label">phút (~${currentSetup.questionCount > 0 ? (currentSetup.timeMinutes * 60 / currentSetup.questionCount).toFixed(0) : 0} giây / câu)</span>
        </div>
      </div>

      <!-- 4. TÙY CHỌN XÁO TRỘN -->
      <div class="setup-section" style="margin-bottom: 24px;">
        <label class="setup-toggle-row">
          <input type="checkbox" id="setupShuffleOpts" ${currentSetup.shuffleOptions ? 'checked' : ''} onchange="currentSetup.shuffleOptions = this.checked">
          <span>🔀 Tự động xáo trộn vị trí đáp án A, B, C, D (Chống học vẹt vị trí)</span>
        </label>
        <label class="setup-toggle-row">
          <input type="checkbox" id="setupShuffleQs" ${currentSetup.shuffleQuestions ? 'checked' : ''} onchange="currentSetup.shuffleQuestions = this.checked">
          <span>🎲 Tự động xáo trộn ngẫu nhiên thứ tự các câu hỏi</span>
        </label>
      </div>

      <!-- ACTIONS -->
      <div class="modal-actions" style="justify-content: flex-end;">
        <button type="button" class="btn btn-secondary" onclick="closeModal()">Quay lại</button>
        <button type="button" class="btn btn-primary" style="padding:10px 24px;" onclick="confirmStartExamWithSetup()" ${poolSize === 0 ? 'disabled' : ''}>
          Bắt đầu làm bài ngay 🚀
        </button>
      </div>
    </div>
  `;
}

function toggleExamSetupTopic(topicId) {
  if (currentSetup.selectedTopics.includes(topicId)) {
    if (currentSetup.selectedTopics.length === 1) {
      alert('Bạn phải giữ lại ít nhất 1 chủ đề cho đề thi!');
      return;
    }
    currentSetup.selectedTopics = currentSetup.selectedTopics.filter(id => id !== topicId);
  } else {
    currentSetup.selectedTopics.push(topicId);
  }
  const modalOverlay = document.getElementById('globalModalOverlay');
  if (modalOverlay) renderExamSetupModalContent(modalOverlay);
}

function applyExamPreset(presetKey) {
  if (TOPIC_PRESETS[presetKey]) {
    currentSetup.selectedTopics = [...TOPIC_PRESETS[presetKey]];
  }
  const modalOverlay = document.getElementById('globalModalOverlay');
  if (modalOverlay) renderExamSetupModalContent(modalOverlay);
}

function closeModal() {
  const modalOverlay = document.getElementById('globalModalOverlay');
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
}

function setSetupQCount(val) {
  currentSetup.questionCount = parseInt(val) || 20;
  const modalOverlay = document.getElementById('globalModalOverlay');
  if (modalOverlay) renderExamSetupModalContent(modalOverlay);
}

function onSetupQInput(val) {
  let num = parseInt(val) || 1;
  const poolSize = getPoolSizeForSelectedTopics(currentSetup.selectedTopics);
  if (num > poolSize) num = poolSize;
  if (num < 1) num = 1;
  currentSetup.questionCount = num;
}

function setSetupMinutes(val) {
  currentSetup.timeMinutes = parseInt(val) || 45;
  const modalOverlay = document.getElementById('globalModalOverlay');
  if (modalOverlay) renderExamSetupModalContent(modalOverlay);
}

function onSetupMinInput(val) {
  let num = parseInt(val) || 1;
  if (num > 300) num = 300;
  if (num < 1) num = 1;
  currentSetup.timeMinutes = num;
}

function confirmStartExamWithSetup() {
  const poolSize = getPoolSizeForSelectedTopics(currentSetup.selectedTopics);
  if (poolSize === 0) {
    alert('Vui lòng chọn ít nhất 1 chủ đề có câu hỏi!');
    return;
  }

  const qInput = document.getElementById('setupQCountInput');
  const mInput = document.getElementById('setupMinutesInput');
  if (qInput) currentSetup.questionCount = parseInt(qInput.value) || currentSetup.questionCount;
  if (mInput) currentSetup.timeMinutes = parseInt(mInput.value) || currentSetup.timeMinutes;

  closeModal();
  startExamSession(currentSetup);
}

function startExamSession(customSettings = {}) {
  const selectedTopics = customSettings.selectedTopics || TOPICS_CONFIG.map(t => t.id);
  const qCount = customSettings.questionCount || CONFIG.EXAM_QUESTION_COUNT || 40;
  const timeMins = customSettings.timeMinutes || CONFIG.EXAM_TIME_MINUTES || 45;
  const shuffleOpts = (customSettings.shuffleOptions !== undefined) ? customSettings.shuffleOptions : CONFIG.SHUFFLE_OPTIONS;
  const shuffleQs = (customSettings.shuffleQuestions !== undefined) ? customSettings.shuffleQuestions : CONFIG.SHUFFLE_QUESTIONS;

  // 1. Filter pool to only include selected topics
  let pool = QUIZ_DATA.filter(q => selectedTopics.includes(q.topicId));

  // 2. Shuffle questions
  if (shuffleQs) {
    pool = shuffleArray(pool);
  }

  // 3. Slice to selected count
  const count = Math.min(qCount, pool.length);
  const selectedQuestions = pool.slice(0, count).map(q => {
    let opts = [...q.options];
    if (shuffleOpts) {
      opts = shuffleArray(opts);
    }
    return {
      ...q,
      options: opts
    };
  });

  state.examQuestions = selectedQuestions;
  state.examAnswers = {};
  state.examTotalTimeSeconds = timeMins * 60;
  state.examSecondsRemaining = state.examTotalTimeSeconds;
  state.examStartTime = new Date();
  state.examTopicsUsed = selectedTopics;

  // Start Timer
  clearInterval(state.examTimerInterval);
  state.examTimerInterval = setInterval(updateExamTimer, 1000);

  navigateTo('EXAM');
}

function renderExam() {
  const container = document.getElementById('appContainer');
  const questionsCount = state.examQuestions.length;

  const topicNames = state.examTopicsUsed
    .map(tid => {
      const t = TOPICS_CONFIG.find(x => x.id === tid);
      return t ? t.shortName : tid;
    })
    .slice(0, 3)
    .join(', ');
  const moreTopicsCount = state.examTopicsUsed.length - 3;
  const topicSummaryStr = (state.examTopicsUsed.length === TOPICS_CONFIG.length)
    ? 'Tất cả các chủ đề'
    : (topicNames + (moreTopicsCount > 0 ? ` +${moreTopicsCount} chủ đề khác` : ''));

  container.innerHTML = `
    <div class="exam-layout">
      <!-- MAIN QUESTION PANEL -->
      <div class="exam-main-panel">
        <div class="exam-timer-bar">
          <div>
            <div style="font-size:0.85rem; color:#94a3b8; font-weight:600;">BÀI THI TRẮC NGHIỆM JAVA ONLINE</div>
            <div style="font-size:1.1rem; font-weight:700;">Đề thi: ${questionsCount} câu hỏi • Chủ đề: ${escapeHtml(topicSummaryStr)}</div>
          </div>
          <div class="timer-clock" id="examClockDisplay">
            ⏳ <span id="timerText">--:--</span>
          </div>
        </div>

        <div id="examQuestionsContainer">
          <!-- Render all exam questions -->
        </div>
      </div>

      <!-- SIDEBAR PALETTE -->
      <div class="exam-sidebar">
        <div class="sidebar-title">
          <span>Danh sách câu hỏi</span>
          <span style="font-size:0.8rem; font-weight:600; color:#4f46e5;"><span id="answeredCount">0</span>/${questionsCount}</span>
        </div>

        <div class="q-grid-palette" id="examPaletteGrid">
          ${state.examQuestions.map((q, idx) => `
            <button class="palette-btn" id="pal_btn_${idx + 1}" onclick="scrollToQuestion(${idx + 1})">
              ${idx + 1}
            </button>
          `).join('')}
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn btn-primary" style="width:100%; font-size:1rem; padding:12px;" onclick="confirmSubmitExam()">
            Nộp bài thi 📥
          </button>
          <button class="btn btn-outline" style="width:100%; color:#475569; border-color:#cbd5e1;" onclick="cancelExam()">
            Hủy bài thi ✕
          </button>
        </div>
      </div>
    </div>
  `;

  renderExamQuestionsList();
  updateExamTimer();
}

function renderExamQuestionsList() {
  const container = document.getElementById('examQuestionsContainer');
  if (!container) return;

  const letters = ['A', 'B', 'C', 'D', 'E'];

  container.innerHTML = state.examQuestions.map((q, idx) => {
    const qNum = idx + 1;
    const selectedAns = state.examAnswers[q.id];

    const codeHtml = q.codeSnippet ? `
      <pre class="q-code-snippet"><code>${escapeHtml(q.codeSnippet)}</code></pre>
    ` : '';

    const imgHtml = q.image ? `
      <div class="q-img-wrap">
        <img src="${q.image}" alt="Hình ảnh câu hỏi ${qNum}">
      </div>
    ` : '';

    const optsHtml = q.options.map((opt, oIdx) => {
      const letter = letters[oIdx] || '•';
      const isSelected = (selectedAns === opt);
      return `
        <button class="opt-btn ${isSelected ? 'selected' : ''}" 
                style="${isSelected ? 'background:#e0e7ff; border-color:#4f46e5; color:#1e1b4b;' : ''}"
                onclick="handleExamSelect(${q.id}, '${escapeQuote(opt)}', ${qNum})">
          <span class="opt-label" style="${isSelected ? 'background:#4f46e5; color:white;' : ''}">${letter}</span>
          <span class="opt-text">${escapeHtml(opt)}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="q-box" id="exam_q_${qNum}" style="margin-bottom:20px;">
        <div class="q-box-meta">
          <span class="q-badge-exam">Câu số ${qNum} / ${state.examQuestions.length}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="category-tag">${q.topicIcon || '☕'} ${escapeHtml(q.topicShortName || q.category)}</span>
            <span class="bank-id-tag">${escapeHtml(q.bank_id || 'ID-' + q.id)}</span>
          </div>
        </div>
        <div class="q-text-body">${escapeHtml(q.question)}</div>
        ${codeHtml}
        ${imgHtml}
        <div class="options-stack">
          ${optsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function handleExamSelect(questionId, selectedText, qNum) {
  state.examAnswers[questionId] = selectedText;

  const palBtn = document.getElementById(`pal_btn_${qNum}`);
  if (palBtn) {
    palBtn.classList.add('answered');
  }

  const qBox = document.getElementById(`exam_q_${qNum}`);
  if (qBox) {
    const q = state.examQuestions[qNum - 1];
    const buttons = qBox.querySelectorAll('.opt-btn');
    buttons.forEach((btn, idx) => {
      const opt = q.options[idx];
      const label = btn.querySelector('.opt-label');
      if (opt === selectedText) {
        btn.style.background = '#e0e7ff';
        btn.style.borderColor = '#4f46e5';
        btn.style.color = '#1e1b4b';
        if (label) {
          label.style.background = '#4f46e5';
          label.style.color = 'white';
        }
      } else {
        btn.style.background = '#f8fafc';
        btn.style.borderColor = '#e2e8f0';
        btn.style.color = '#334155';
        if (label) {
          label.style.background = '#e2e8f0';
          label.style.color = '#334155';
        }
      }
    });
  }

  const countSpan = document.getElementById('answeredCount');
  if (countSpan) {
    countSpan.textContent = Object.keys(state.examAnswers).length;
  }
}

function scrollToQuestion(qNum) {
  const el = document.getElementById(`exam_q_${qNum}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function updateExamTimer() {
  if (state.examSecondsRemaining <= 0) {
    clearInterval(state.examTimerInterval);
    autoSubmitExamDueToTimeout();
    return;
  }

  state.examSecondsRemaining--;
  const mins = Math.floor(state.examSecondsRemaining / 60);
  const secs = state.examSecondsRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const textEl = document.getElementById('timerText');
  if (textEl) {
    textEl.textContent = timeStr;
  }

  const clockEl = document.getElementById('examClockDisplay');
  if (clockEl) {
    if (state.examSecondsRemaining < 300) {
      clockEl.classList.add('warning');
    }
  }
}

function confirmSubmitExam() {
  const total = state.examQuestions.length;
  const answered = Object.keys(state.examAnswers).length;
  const unanswered = total - answered;

  let message = `Bạn đã hoàn thành <strong>${answered}/${total}</strong> câu hỏi.`;
  if (unanswered > 0) {
    message += `<br><br><span style="color:#ef4444; font-weight:600;">⚠️ Cảnh báo: Bạn vẫn còn ${unanswered} câu chưa chọn đáp án!</span>`;
  }
  message += `<br><br>Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?`;

  showModal('Xác nhận nộp bài thi', message, 'Nộp bài ngay', () => {
    submitExam();
  }, true, 'Tiếp tục làm');
}

function autoSubmitExamDueToTimeout() {
  showModal('Hết giờ làm bài!', 'Thời gian làm bài thi đã kết thúc. Hệ thống đang tiến hành chấm điểm bài làm của bạn...', 'Xem kết quả', () => {
    submitExam();
  });
}

function cancelExam() {
  if (confirm('Bạn có chắc chắn muốn hủy bài thi này không? Mọi câu trả lời sẽ không được lưu.')) {
    clearInterval(state.examTimerInterval);
    navigateTo('HOME');
  }
}

function submitExam() {
  clearInterval(state.examTimerInterval);

  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const reviewList = state.examQuestions.map((q, idx) => {
    const userSelected = state.examAnswers[q.id];
    let isCorrect = false;

    if (!userSelected) {
      skippedCount++;
    } else if (userSelected === q.correct_text) {
      correctCount++;
      isCorrect = true;
    } else {
      wrongCount++;
    }

    return {
      num: idx + 1,
      question: q,
      userSelected: userSelected || null,
      correctText: q.correct_text,
      isCorrect: isCorrect,
      explanation: q.explanation
    };
  });

  const total = state.examQuestions.length;
  const score10 = ((correctCount / total) * 10).toFixed(1);
  const percentage = Math.round((correctCount / total) * 100);
  const isPassed = percentage >= CONFIG.PASSING_SCORE_PERCENT;

  const timeSpentSeconds = state.examTotalTimeSeconds - state.examSecondsRemaining;
  const spentMins = Math.floor(timeSpentSeconds / 60);
  const spentSecs = timeSpentSeconds % 60;

  state.lastExamResult = {
    total,
    correctCount,
    wrongCount,
    skippedCount,
    score10,
    percentage,
    isPassed,
    timeSpentStr: `${spentMins} phút ${spentSecs} giây`,
    reviewList
  };

  navigateTo('RESULT');
}

// =========================================================================
// 5. KẾT QUẢ BÀI THI & XEM LẠI ĐÁP ÁN (RESULT VIEW)
// =========================================================================
function renderResult() {
  const container = document.getElementById('appContainer');
  const res = state.lastExamResult;
  if (!res) {
    navigateTo('HOME');
    return;
  }

  const letters = ['A', 'B', 'C', 'D', 'E'];

  container.innerHTML = `
    <div class="result-card">
      <div class="score-badge-circle ${res.isPassed ? 'passed' : 'failed'}">
        <div class="score-points">${res.score10}</div>
        <div class="score-total">/ 10 điểm</div>
      </div>

      <h1 class="result-status-title ${res.isPassed ? 'passed' : 'failed'}">
        ${res.isPassed ? '🎉 CHÚC MỪNG: BẠN ĐÃ ĐẠT!' : '⚡ KẾT QUẢ: CHƯA ĐẠT!'}
      </h1>
      <p style="color:#64748b; font-size:1.05rem;">
        ${res.isPassed
      ? `Bạn đã xuất sắc vượt qua bài thi với tỉ lệ chính xác ${res.percentage}% (Yêu cầu: ${CONFIG.PASSING_SCORE_PERCENT}%).`
      : `Bạn đạt ${res.percentage}%. Hãy xem lại lời giải chi tiết bên dưới để củng cố các lỗ hổng kiến thức!`}
      </p>

      <div class="result-summary-grid">
        <div class="summary-metric">
          <div class="metric-val" style="color:#10b981;">${res.correctCount}</div>
          <div class="metric-lbl">Câu Đúng</div>
        </div>
        <div class="summary-metric">
          <div class="metric-val" style="color:#ef4444;">${res.wrongCount}</div>
          <div class="metric-lbl">Câu Sai</div>
        </div>
        <div class="summary-metric">
          <div class="metric-val" style="color:#f59e0b;">${res.skippedCount}</div>
          <div class="metric-lbl">Chưa làm</div>
        </div>
        <div class="summary-metric">
          <div class="metric-val" style="color:#3b82f6;">${res.timeSpentStr}</div>
          <div class="metric-lbl">Thời gian</div>
        </div>
      </div>

      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="openExamSetupModal()">Thi lại với tùy chọn mới 🔄</button>
        <button class="btn btn-secondary" onclick="navigateTo('HOME')">Về Trang Chủ 🏠</button>
      </div>
    </div>

    <!-- REVIEW SECTION -->
    <div style="margin-bottom:24px;">
      <h2 style="font-size:1.4rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
        📖 Bảng xem lại bài làm &amp; Lời giải chi tiết
      </h2>
      <p style="color:#64748b; font-size:0.95rem;">
        Đối chiếu từng câu hỏi: màu xanh lá là phương án đúng, màu đỏ là phương án bạn đã chọn sai, kèm theo giải thích nguyên lý Java bên dưới.
      </p>
    </div>

    <div class="question-feed">
      ${res.reviewList.map(item => {
        const q = item.question;

        const codeHtml = q.codeSnippet ? `
          <pre class="q-code-snippet"><code>${escapeHtml(q.codeSnippet)}</code></pre>
        ` : '';

        const imgHtml = q.image ? `
          <div class="q-img-wrap">
            <img src="${q.image}" alt="Hình ảnh câu hỏi">
          </div>
        ` : '';

        const optsHtml = q.options.map((opt, oIdx) => {
          const letter = letters[oIdx] || '•';
          let optClass = 'opt-btn';

          if (opt === item.correctText) {
            optClass += ' correct';
          } else if (opt === item.userSelected && !item.isCorrect) {
            optClass += ' incorrect';
          }

          return `
            <div class="${optClass}" style="cursor:default;">
              <span class="opt-label">${letter}</span>
              <span class="opt-text">${escapeHtml(opt)}</span>
            </div>
          `;
        }).join('');

        let statusBadge = '';
        if (item.isCorrect) {
          statusBadge = '<span style="color:#059669; font-weight:700; font-size:0.9rem;">✅ Trả lời đúng</span>';
        } else if (!item.userSelected) {
          statusBadge = '<span style="color:#d97706; font-weight:700; font-size:0.9rem;">⚠️ Bỏ qua (Chưa làm)</span>';
        } else {
          statusBadge = '<span style="color:#dc2626; font-weight:700; font-size:0.9rem;">❌ Trả lời sai</span>';
        }

        return `
          <div class="q-box" style="border-left: 5px solid ${item.isCorrect ? '#10b981' : (item.userSelected ? '#ef4444' : '#f59e0b')};">
            <div class="q-box-meta">
              <span class="q-badge-exam">Câu ${item.num} / ${res.total}</span>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="category-tag">${q.topicIcon || '☕'} ${escapeHtml(q.topicShortName || q.category)}</span>
                <span class="bank-id-tag">${escapeHtml(q.bank_id || 'ID-' + q.id)}</span>
              </div>
              ${statusBadge}
            </div>
            <div class="q-text-body">${escapeHtml(q.question)}</div>
            ${codeHtml}
            ${imgHtml}
            <div class="options-stack">
              ${optsHtml}
            </div>
            <div class="explanation-drawer visible">
              <div class="exp-badge">💡 GIẢI THÍCH CHI TIẾT:</div>
              <div class="exp-content">${formatExplanationText(item.explanation, item.correctText)}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// =========================================================================
// 6. MODAL DIALOG HELPER
// =========================================================================
function showModal(title, contentHtml, confirmText = 'OK', onConfirm = null, showCancel = false, cancelText = 'Hủy') {
  let modalOverlay = document.getElementById('globalModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'globalModalOverlay';
    modalOverlay.className = 'modal-overlay';
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon">📢</div>
      <div class="modal-title">${title}</div>
      <div class="modal-body">${contentHtml}</div>
      <div class="modal-actions">
        ${showCancel ? `<button class="btn btn-secondary" id="modalCancelBtn">${cancelText}</button>` : ''}
        <button class="btn btn-primary" id="modalConfirmBtn">${confirmText}</button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('open');

  const confirmBtn = document.getElementById('modalConfirmBtn');
  confirmBtn.onclick = () => {
    modalOverlay.classList.remove('open');
    if (onConfirm) onConfirm();
  };

  if (showCancel) {
    const cancelBtn = document.getElementById('modalCancelBtn');
    cancelBtn.onclick = () => {
      modalOverlay.classList.remove('open');
    };
  }
}

// Helper formatters
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeQuote(str) {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function formatExplanationText(exp, correctText) {
  if (!exp) return `Đáp án đúng là: <strong>${escapeHtml(correctText)}</strong>.`;
  let formatted = exp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return formatted;
}
