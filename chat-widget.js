(function () {
  'use strict';

  const CONTACT_URL = 'https://cocoroai-contact.map-cocoro.workers.dev';
  const API_URL = '/api/chat';
  const INITIAL_MESSAGE = 'こんにちは！ココロAI合同会社のアシスタント、ココロボちゃんです🤖\n\nホームページ・LINE・アプリなど、Web周りのことで気になることがあれば、どうぞお気軽にお声がけください。\n\nどのようなお仕事をされていますか？';

  // ── スタイル注入 ──────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #cocoro-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(6,182,212,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      z-index: 9998;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #cocoro-widget-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(6,182,212,0.55);
    }
    #cocoro-widget-btn .cocoro-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
      display: none;
    }
    #cocoro-chat-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 340px;
      max-width: calc(100vw - 48px);
      height: 480px;
      max-height: calc(100vh - 120px);
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.16);
      display: flex;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      transform-origin: bottom right;
      transition: opacity 0.2s ease, transform 0.2s ease;
      font-family: 'Noto Sans JP', 'Hiragino Sans', sans-serif;
    }
    #cocoro-chat-panel.cocoro-hidden {
      opacity: 0;
      transform: scale(0.85);
      pointer-events: none;
    }
    #cocoro-chat-header {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    #cocoro-chat-header .cocoro-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    #cocoro-chat-header .cocoro-info {
      flex: 1;
    }
    #cocoro-chat-header .cocoro-name {
      color: white;
      font-weight: 700;
      font-size: 14px;
      line-height: 1.2;
    }
    #cocoro-chat-header .cocoro-status {
      color: rgba(255,255,255,0.8);
      font-size: 11px;
      margin-top: 1px;
    }
    #cocoro-chat-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.8);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 4px;
      border-radius: 6px;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    #cocoro-chat-close:hover {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    #cocoro-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
    }
    #cocoro-messages::-webkit-scrollbar {
      width: 4px;
    }
    #cocoro-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #cocoro-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }
    .cocoro-msg {
      display: flex;
      flex-direction: column;
      max-width: 82%;
    }
    .cocoro-msg.cocoro-bot {
      align-self: flex-start;
      align-items: flex-start;
    }
    .cocoro-msg.cocoro-user {
      align-self: flex-end;
      align-items: flex-end;
    }
    .cocoro-bubble {
      padding: 10px 13px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.6;
      word-break: break-word;
      }
    .cocoro-bot .cocoro-bubble {
      background: white;
      color: #1e293b;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .cocoro-user .cocoro-bubble {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .cocoro-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: white;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .cocoro-typing span {
      width: 7px;
      height: 7px;
      background: #94a3b8;
      border-radius: 50%;
      animation: cocoro-bounce 1.2s infinite;
    }
    .cocoro-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cocoro-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cocoro-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    .cocoro-cta-btn {
      display: inline-block;
      margin-top: 8px;
      padding: 9px 18px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-size: 13px;
      font-weight: 700;
      border-radius: 20px;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(16,185,129,0.35);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .cocoro-cta-btn:hover {
      transform: scale(1.04);
      box-shadow: 0 4px 14px rgba(16,185,129,0.45);
    }
    #cocoro-input-area {
      padding: 10px 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      background: white;
      flex-shrink: 0;
    }
    #cocoro-input {
      flex: 1;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 9px 12px;
      font-size: 13px;
      font-family: inherit;
      resize: none;
      outline: none;
      line-height: 1.5;
      max-height: 80px;
      color: #1e293b;
      background: #f8fafc;
      transition: border-color 0.15s;
    }
    #cocoro-input:focus {
      border-color: #06b6d4;
      background: white;
    }
    #cocoro-input::placeholder {
      color: #94a3b8;
    }
    #cocoro-send {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.15s, opacity 0.15s;
    }
    #cocoro-send:hover:not(:disabled) {
      transform: scale(1.08);
    }
    #cocoro-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    #cocoro-send svg {
      width: 16px;
      height: 16px;
      fill: white;
    }
    @media (max-width: 400px) {
      #cocoro-chat-panel {
        right: 12px;
        bottom: 88px;
        width: calc(100vw - 24px);
      }
      #cocoro-widget-btn {
        right: 16px;
        bottom: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // ── DOM構築 ───────────────────────────────────────────────────────
  // 起動ボタン
  const btn = document.createElement('button');
  btn.id = 'cocoro-widget-btn';
  btn.setAttribute('aria-label', 'ココロボちゃんに相談する');
  btn.innerHTML = '🤖<span class="cocoro-badge"></span>';

  // チャットパネル
  const panel = document.createElement('div');
  panel.id = 'cocoro-chat-panel';
  panel.classList.add('cocoro-hidden');
  panel.innerHTML = `
    <div id="cocoro-chat-header">
      <div class="cocoro-avatar">🤖</div>
      <div class="cocoro-info">
        <div class="cocoro-name">ココロボちゃん</div>
        <div class="cocoro-status">ココロAI合同会社のAIアシスタント</div>
      </div>
      <button id="cocoro-chat-close" aria-label="閉じる">✕</button>
    </div>
    <div id="cocoro-messages"></div>
    <div id="cocoro-input-area">
      <textarea id="cocoro-input" placeholder="メッセージを入力..." rows="1"></textarea>
      <button id="cocoro-send" aria-label="送信" disabled>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ── 状態管理 ──────────────────────────────────────────────────────
  const messagesEl = panel.querySelector('#cocoro-messages');
  const inputEl = panel.querySelector('#cocoro-input');
  const sendBtn = panel.querySelector('#cocoro-send');
  const closeBtn = panel.querySelector('#cocoro-chat-close');

  let isOpen = false;
  let isLoading = false;
  let history = []; // { role: 'user'|'assistant', content: string }
  let initialized = false;

  // ── ヘルパー ──────────────────────────────────────────────────────
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, text, showCta) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cocoro-msg ' + (role === 'user' ? 'cocoro-user' : 'cocoro-bot');

    const bubble = document.createElement('div');
    bubble.className = 'cocoro-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');
    wrapper.appendChild(bubble);

    if (showCta) {
      const cta = document.createElement('a');
      cta.href = CONTACT_URL;
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      cta.className = 'cocoro-cta-btn';
      cta.textContent = '📩 無料相談してみる';
      wrapper.appendChild(cta);
    }

    messagesEl.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function addTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'cocoro-msg cocoro-bot';
    wrapper.innerHTML = `<div class="cocoro-typing"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(wrapper);
    scrollToBottom();
    return wrapper;
  }

  function setLoading(val) {
    isLoading = val;
    sendBtn.disabled = val || inputEl.value.trim() === '';
    inputEl.disabled = val;
  }

  // CTA表示判定（「お問い合わせ」「相談」「連絡」キーワードまたは2往復以降）
  function shouldShowCta(text, turnCount) {
    const keywords = ['お問い合わせ', '無料相談', '相談', '連絡', 'ご相談'];
    const hasKeyword = keywords.some(k => text.includes(k));
    return hasKeyword || turnCount >= 2;
  }

  // ── API呼び出し ───────────────────────────────────────────────────
  async function sendToApi(userMessage) {
    history.push({ role: 'user', content: userMessage });

    const typingEl = addTyping();
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const reply = data.content || 'ごめんね、ちょっとうまく答えられなかったよ😢 もう一度試してみてね！';

      history.push({ role: 'assistant', content: reply });

      const turnCount = Math.floor(history.length / 2);
      const showCta = shouldShowCta(reply, turnCount);

      typingEl.remove();
      addMessage('assistant', reply, showCta);
    } catch (e) {
      typingEl.remove();
      addMessage('assistant', 'ごめんね、今ちょっと調子が悪いみたい😢\nもう少ししてからまた試してみてね！', false);
    } finally {
      setLoading(false);
    }
  }

  // ── 初期メッセージ ─────────────────────────────────────────────────
  function init() {
    if (initialized) return;
    initialized = true;

    const typingEl = addTyping();
    setTimeout(() => {
      typingEl.remove();
      history.push({ role: 'assistant', content: INITIAL_MESSAGE });
      addMessage('assistant', INITIAL_MESSAGE, false);
    }, 800);
  }

  // ── イベント ──────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.remove('cocoro-hidden');
    btn.querySelector('.cocoro-badge').style.display = 'none';
    init();
    setTimeout(() => inputEl.focus(), 250);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add('cocoro-hidden');
  }

  btn.addEventListener('click', () => {
    if (isOpen) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener('click', closePanel);

  // 送信処理
  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    sendBtn.disabled = true;
    addMessage('user', text, false);
    await sendToApi(text);
  }

  sendBtn.addEventListener('click', handleSend);

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  inputEl.addEventListener('input', () => {
    sendBtn.disabled = inputEl.value.trim() === '' || isLoading;
    // 自動高さ調整
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + 'px';
  });

  // パネル外クリックで閉じる（オプション：UX好みで外してもOK）
  // document.addEventListener('click', (e) => {
  //   if (isOpen && !panel.contains(e.target) && e.target !== btn) closePanel();
  // });

})();
