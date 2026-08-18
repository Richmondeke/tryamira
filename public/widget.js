/**
 * Amira AI Webchat Widget — Embeddable Script
 * Usage:
 *   <script>
 *     window.AmiraConfig = {
 *       workspaceId: "ws_xxx",
 *       agentId: "asst_xxx",
 *       theme: "light",          // "light" | "dark"
 *       position: "bottom-right", // "bottom-right" | "bottom-left"
 *       welcomeMessage: "Hi! How can I help?"
 *     };
 *   </script>
 *   <script src="https://heyamira.com/widget.js" async></script>
 *
 * OR data-attribute style:
 *   <script
 *     src="https://heyamira.com/widget.js"
 *     data-agent-id="asst_xxx"
 *     data-primary-color="#1b5a92"
 *     data-position="bottom-right"
 *     async>
 *   </script>
 */
(function () {
  'use strict';

  // Prevent double-init
  if (window.__amiraWidgetLoaded) return;
  window.__amiraWidgetLoaded = true;

  // ─── Config Resolution ──────────────────────────────────────
  var scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  var cfg = window.AmiraConfig || {};

  // Data-attribute overrides
  if (scriptTag) {
    cfg.agentId = cfg.agentId || scriptTag.getAttribute('data-agent-id') || '';
    cfg.agentName = cfg.agentName || scriptTag.getAttribute('data-agent-name') || 'Amira';
    cfg.primaryColor = cfg.primaryColor || scriptTag.getAttribute('data-primary-color') || '#1b5a92';
    cfg.position = cfg.position || scriptTag.getAttribute('data-position') || 'bottom-right';
    cfg.welcomeMessage = cfg.welcomeMessage || scriptTag.getAttribute('data-welcome-message') || "Hi there! 👋 I'm Amira, your AI Operator for Work. How can I help you today?";
    cfg.theme = cfg.theme || scriptTag.getAttribute('data-theme') || 'light';
    cfg.workspaceId = cfg.workspaceId || scriptTag.getAttribute('data-workspace-id') || '';
  }

  var AGENT_NAME = cfg.agentName || 'Amira';
  var PRIMARY = cfg.primaryColor || '#1b5a92';
  var POSITION = cfg.position || 'bottom-right';
  var WELCOME = cfg.welcomeMessage || "Hi there! 👋 I'm Amira, your AI Operator for Work. How can I help you today?";
  var THEME = cfg.theme || 'light';
  var BASE_URL = (scriptTag && scriptTag.src && scriptTag.src.startsWith('http')) 
    ? (new URL(scriptTag.src)).origin 
    : (typeof window !== 'undefined' ? window.location.origin : 'https://tryamira.com');

  // ─── Styles ─────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#amira-widget-bubble{',
    '  position:fixed;bottom:24px;',
    POSITION === 'bottom-left' ? 'left:24px;' : 'right:24px;',
    '  width:60px;height:60px;border-radius:50%;',
    '  background:' + PRIMARY + ';',
    '  box-shadow:0 4px 24px rgba(0,0,0,0.18);',
    '  cursor:pointer;z-index:2147483646;',
    '  display:flex;align-items:center;justify-content:center;',
    '  transition:transform 0.2s ease,box-shadow 0.2s ease;',
    '  border:none;outline:none;',
    '}',
    '#amira-widget-bubble:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(0,0,0,0.22);}',
    '#amira-widget-bubble svg{width:28px;height:28px;fill:#fff;}',
    '#amira-widget-frame-container{',
    '  position:fixed;bottom:96px;',
    POSITION === 'bottom-left' ? 'left:24px;' : 'right:24px;',
    '  width:400px;height:600px;max-width:calc(100vw - 48px);max-height:calc(100vh - 120px);',
    '  border-radius:16px;overflow:hidden;',
    '  box-shadow:0 12px 48px rgba(0,0,0,0.15);',
    '  z-index:2147483647;',
    '  transition:opacity 0.25s ease,transform 0.25s ease;',
    '  opacity:0;transform:translateY(16px) scale(0.96);pointer-events:none;',
    '  background:#fff;',
    '}',
    '#amira-widget-frame-container.amira-open{',
    '  opacity:1;transform:translateY(0) scale(1);pointer-events:auto;',
    '}',
    '#amira-widget-frame{width:100%;height:100%;border:none;}',
    '@media(max-width:480px){',
    '  #amira-widget-frame-container{',
    '    width:100vw;height:calc(100vh - 80px);',
    '    bottom:0;right:0;left:0;border-radius:16px 16px 0 0;',
    '    max-width:100vw;max-height:100vh;',
    '  }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // ─── Chat Bubble ────────────────────────────────────────────
  var bubble = document.createElement('button');
  bubble.id = 'amira-widget-bubble';
  bubble.setAttribute('aria-label', 'Open Amira chat');
  bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';
  document.body.appendChild(bubble);

  // ─── Chat Container ─────────────────────────────────────────
  var container = document.createElement('div');
  container.id = 'amira-widget-frame-container';

  // Build a self-contained chat UI inside the container
  var header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:' + PRIMARY + ';color:#fff;';
  header.innerHTML = '<div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">' + (AGENT_NAME.charAt(0) || 'A') + '</div><div><div style="font-weight:700;font-size:15px;">' + AGENT_NAME + '</div><div style="font-size:11px;opacity:0.8;">AI Operator • Online</div></div></div><button id="amira-close-btn" style="background:none;border:none;color:#fff;cursor:pointer;font-size:20px;padding:4px 8px;opacity:0.8;" aria-label="Close chat">✕</button>';

  var chatBody = document.createElement('div');
  chatBody.id = 'amira-chat-body';
  chatBody.style.cssText = 'flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;background:' + (THEME === 'dark' ? '#1e293b' : '#f8fafc') + ';';

  // Welcome message
  var welcomeBubble = document.createElement('div');
  welcomeBubble.style.cssText = 'max-width:80%;padding:12px 16px;border-radius:16px 16px 16px 4px;background:' + (THEME === 'dark' ? '#334155' : '#fff') + ';color:' + (THEME === 'dark' ? '#e2e8f0' : '#334155') + ';font-size:14px;line-height:1.5;box-shadow:0 1px 4px rgba(0,0,0,0.06);align-self:flex-start;';
  welcomeBubble.textContent = WELCOME;
  chatBody.appendChild(welcomeBubble);

  var inputBar = document.createElement('div');
  inputBar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid ' + (THEME === 'dark' ? '#334155' : '#e2e8f0') + ';background:' + (THEME === 'dark' ? '#0f172a' : '#fff') + ';';
  inputBar.innerHTML = '<input id="amira-chat-input" type="text" placeholder="Type a message..." style="flex:1;border:1px solid ' + (THEME === 'dark' ? '#475569' : '#e2e8f0') + ';border-radius:24px;padding:10px 16px;font-size:14px;outline:none;background:' + (THEME === 'dark' ? '#1e293b' : '#f8fafc') + ';color:' + (THEME === 'dark' ? '#e2e8f0' : '#0f172a') + ';" /><button id="amira-send-btn" style="width:38px;height:38px;border-radius:50%;background:' + PRIMARY + ';border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg></button>';

  var chatWrap = document.createElement('div');
  chatWrap.style.cssText = 'display:flex;flex-direction:column;height:100%;';
  chatWrap.appendChild(header);
  chatWrap.appendChild(chatBody);
  chatWrap.appendChild(inputBar);
  container.appendChild(chatWrap);
  document.body.appendChild(container);

  // ─── Toggle Logic ───────────────────────────────────────────
  var isOpen = false;
  function toggle() {
    isOpen = !isOpen;
    container.classList.toggle('amira-open', isOpen);
    if (isOpen) {
      var input = document.getElementById('amira-chat-input');
      if (input) setTimeout(function () { input.focus(); }, 300);
    }
  }

  bubble.addEventListener('click', toggle);
  document.getElementById('amira-close-btn').addEventListener('click', function (e) {
    e.stopPropagation();
    toggle();
  });

  // ─── Chat Logic (calls Amira API) ──────────────────────────
  var messages = [{ role: 'assistant', text: WELCOME }];

  function appendMessage(role, text) {
    var msg = document.createElement('div');
    var isUser = role === 'user';
    msg.style.cssText = 'max-width:80%;padding:12px 16px;border-radius:' + (isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px') + ';background:' + (isUser ? PRIMARY : (THEME === 'dark' ? '#334155' : '#fff')) + ';color:' + (isUser ? '#fff' : (THEME === 'dark' ? '#e2e8f0' : '#334155')) + ';font-size:14px;line-height:1.5;box-shadow:0 1px 4px rgba(0,0,0,0.06);align-self:' + (isUser ? 'flex-end' : 'flex-start') + ';';
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function sendMessage() {
    var input = document.getElementById('amira-chat-input');
    var text = (input.value || '').trim();
    if (!text) return;

    input.value = '';
    messages.push({ role: 'user', text: text });
    appendMessage('user', text);

    // Typing indicator
    var typing = appendMessage('assistant', '...');
    typing.style.opacity = '0.6';

    // Call Amira chat API
    fetch(BASE_URL + '/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: cfg.workspaceId,
        agentId: cfg.agentId,
        agentName: AGENT_NAME,
        message: text,
        history: messages.slice(-10)
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        var reply = (data && data.reply) || "I'm here to help! Please try again in a moment.";
        messages.push({ role: 'assistant', text: reply });
        appendMessage('assistant', reply);
      })
      .catch(function () {
        typing.remove();
        appendMessage('assistant', "I'm having trouble connecting. Please try again shortly.");
      });
  }

  document.getElementById('amira-send-btn').addEventListener('click', sendMessage);
  document.getElementById('amira-chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

})();
