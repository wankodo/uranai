/* 隠しモグラ叩きゲーム（全サイト共通）
   フッターのクレジット「熊八 🐾」の 🐾 をタップするとモーダルで開く。
   - トリガーは2形式に対応：pic-dual スパン（移動系）／素のテキスト 🐾（お金・占い・保険系）
   - クリックは document へのイベント委譲で受けるため、テーマ切替後も生きる
   - ベストスコアは localStorage の mogura_best_v1（同一オリジン全サイト共有） */
(function () {
  'use strict';
  if (window.__moguraGameLoaded) return;
  window.__moguraGameLoaded = true;

  var BEST_KEY = 'mogura_best_v1';

  var MOLE = '<svg viewBox="0 0 100 100" width="80" height="80"><ellipse cx="50" cy="58" rx="34" ry="36" fill="#9c6b46"/><ellipse cx="50" cy="70" rx="20" ry="18" fill="#d9b48c"/><circle cx="38" cy="48" r="4.5" fill="#2b1c10"/><circle cx="62" cy="48" r="4.5" fill="#2b1c10"/><circle cx="39.5" cy="46.5" r="1.6" fill="#fff"/><circle cx="63.5" cy="46.5" r="1.6" fill="#fff"/><ellipse cx="50" cy="60" rx="8" ry="6" fill="#e88ca0"/><path d="M50 66 v4" stroke="#7a4a26" stroke-width="2.5" stroke-linecap="round"/><rect x="44" y="70" width="12" height="9" rx="2" fill="#fff"/><path d="M26 34 q-6 -10 2 -14 M74 34 q6 -10 -2 -14" stroke="#9c6b46" stroke-width="6" fill="none" stroke-linecap="round"/></svg>';
  var GOLD = '<svg viewBox="0 0 100 100" width="80" height="80"><ellipse cx="50" cy="58" rx="34" ry="36" fill="#e8a91c"/><ellipse cx="50" cy="70" rx="20" ry="18" fill="#f7d774"/><circle cx="38" cy="48" r="4.5" fill="#4a3200"/><circle cx="62" cy="48" r="4.5" fill="#4a3200"/><circle cx="39.5" cy="46.5" r="1.6" fill="#fff"/><circle cx="63.5" cy="46.5" r="1.6" fill="#fff"/><ellipse cx="50" cy="60" rx="8" ry="6" fill="#e88ca0"/><path d="M50 66 v4" stroke="#a87400" stroke-width="2.5" stroke-linecap="round"/><rect x="44" y="70" width="12" height="9" rx="2" fill="#fff"/><path d="M50 6 l3.5 7 7.5 1 -5.5 5.2 1.4 7.5 -6.9 -3.7 -6.9 3.7 1.4 -7.5 -5.5 -5.2 7.5 -1 z" fill="#ffd94d" stroke="#d99a00" stroke-width="1.5"/></svg>';
  var BEAR = '<svg viewBox="0 0 100 100" width="80" height="80"><circle cx="26" cy="24" r="13" fill="#8a5a33"/><circle cx="74" cy="24" r="13" fill="#8a5a33"/><circle cx="26" cy="24" r="6.5" fill="#c99a68"/><circle cx="74" cy="24" r="6.5" fill="#c99a68"/><ellipse cx="50" cy="56" rx="36" ry="38" fill="#8a5a33"/><path d="M16 30 q34 -14 68 0 l0 9 q-34 -13 -68 0 z" fill="#fff"/><path d="M76 22 q8 4 6 12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="66" rx="17" ry="13" fill="#d9b48c"/><circle cx="37" cy="50" r="4.5" fill="#241408"/><circle cx="63" cy="50" r="4.5" fill="#241408"/><ellipse cx="50" cy="61" rx="6.5" ry="4.8" fill="#33200f"/><path d="M50 66 q0 5 -6 5 M50 66 q0 5 6 5" stroke="#33200f" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M28 42 q6 -5 12 -1 M60 41 q6 -4 12 1" stroke="#5d3a1c" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';

  var CSS = [
    '.mg-paw-trigger{cursor:pointer;padding:.18em .32em;margin:-.18em -.32em;border-radius:.45em;-webkit-tap-highlight-color:transparent}',
    '.mg-overlay{position:fixed;inset:0;z-index:100000;background:rgba(4,12,20,.62);display:flex;align-items:center;justify-content:center;padding:12px}',
    '.mg-overlay[hidden]{display:none}',
    '.mg-modal{position:relative;background:#fdfbf6;color:#22303c;border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.45);width:100%;max-width:430px;max-height:94vh;overflow-y:auto;padding:16px 14px 14px;font-family:inherit}',
    'html[data-theme="andy"] .mg-modal{background:rgba(8,22,34,.97);color:#d8f1f6;border:1px solid rgba(110,205,230,.45);box-shadow:0 0 0 1px rgba(110,205,230,.12),0 24px 60px rgba(0,0,0,.8)}',
    '.mg-close{position:absolute;top:8px;right:8px;width:36px;height:36px;border-radius:50%;border:1px solid rgba(120,130,140,.4);background:transparent;color:inherit;font-size:20px;line-height:1;cursor:pointer}',
    '.mg-title{text-align:center;font-weight:800;font-size:18px;margin:2px 0 10px}',
    '.mg-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;font-size:14px}',
    '.mg-stat{border:1px solid rgba(120,130,140,.4);border-radius:999px;padding:4px 12px;white-space:nowrap}',
    '.mg-stat b{font-size:16px}',
    '.mg-timebar{height:10px;border-radius:999px;background:rgba(120,130,140,.25);overflow:hidden;margin-bottom:10px}',
    '.mg-timefill{height:100%;width:100%;background:#7bc96f;transition:width .2s linear}',
    '.mg-field{background:linear-gradient(#aee3a1,#8fd07f);border-radius:18px;padding:14px 10px 18px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px 6px;touch-action:manipulation;user-select:none;-webkit-user-select:none}',
    'html[data-theme="andy"] .mg-field{background:linear-gradient(#3f7048,#2f5c3a)}',
    '.mg-hole{position:relative;height:100px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.mg-window{position:absolute;left:0;right:0;top:0;height:80px;overflow:hidden;pointer-events:none}',
    '.mg-chara{position:absolute;left:50%;bottom:0;width:80px;height:80px;transform:translate(-50%,108%);transition:transform .15s ease-out}',
    '.mg-chara.mg-up{transform:translate(-50%,4%)}',
    '.mg-chara.mg-hit{transform:translate(-50%,4%) scale(1.12,.68);transition:transform .05s}',
    '.mg-mound{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:96px;height:32px;background:radial-gradient(ellipse at 50% 30%,#a5713f,#7c4f27);border-radius:50%;pointer-events:none}',
    '.mg-mound::after{content:"";position:absolute;left:50%;top:3px;transform:translateX(-50%);width:62px;height:16px;background:#4a2f16;border-radius:50%}',
    '.mg-pop{position:absolute;left:50%;top:0;transform:translateX(-50%);font-weight:bold;font-size:17px;color:#ff8a00;text-shadow:0 1px 0 #fff,0 0 6px #fff;opacity:0;pointer-events:none;white-space:nowrap;z-index:5}',
    '.mg-pop.mg-show{animation:mgfloat .6s ease-out}',
    '.mg-pop.mg-minus{color:#e33}',
    '@keyframes mgfloat{0%{opacity:0;transform:translate(-50%,6px)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-18px)}}',
    '.mg-bubble{position:absolute;left:50%;top:-10px;transform:translateX(-50%);background:#fff;color:#333;font-size:12px;font-weight:bold;border-radius:10px;padding:2px 8px;opacity:0;pointer-events:none;white-space:nowrap;z-index:6;box-shadow:0 1px 4px rgba(0,0,0,.25)}',
    '.mg-bubble.mg-show{opacity:1;transition:opacity .1s}',
    '.mg-controls{text-align:center;margin-top:12px}',
    '.mg-btn{background:#f5a400;color:#231600;border:none;border-radius:999px;padding:10px 28px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.2);touch-action:manipulation;font:inherit}',
    'html[data-theme="andy"] .mg-btn{background:linear-gradient(180deg,#8ff2ff,#46d9ec);color:#03222e}',
    '.mg-btn:disabled{opacity:.45;cursor:default}',
    '.mg-msg{margin-top:8px;font-size:14px;opacity:.75;min-height:20px}'
  ].join('\n');

  /* ---------- トリガー（クレジットの 🐾）を探す ----------
     移動系はテーマ連動のアイコン差し替えスクリプトが DOM を作り替える：
       DEF … クレジットの 🐾 は素のテキストノードになる
       HUD … <span class="ido-pic" data-emoji="🐾">SVG</span> になる
       静的HTMLのままなら <span class="pic-dual" data-emoji="🐾">
     テーマ切替のたびにノードが作り直されるため、3形式すべてに対応し、
     data-theme の変化を監視して付け直す。クリック自体は委譲で受ける。 */
  function setupTrigger() {
    if (document.querySelector('.mg-paw-trigger')) return true;
    // 形式1：静的HTMLの pic-dual スパン（移動系・差し替え前）
    var dual = document.querySelector('.pic-dual[data-emoji="🐾"]');
    if (dual) {
      dual.classList.add('mg-paw-trigger');
      return true;
    }
    // 形式2：HUD 時の ido-pic スパン（移動系・差し替え後）
    var pics = document.querySelectorAll('.ido-pic[data-emoji="🐾"]');
    for (var p = 0; p < pics.length; p++) {
      var anc = pics[p].closest('p,div,footer,li');
      if (anc && (anc.textContent || '').indexOf('Muse Spark') !== -1) {
        pics[p].classList.add('mg-paw-trigger');
        return true;
      }
    }
    if (pics.length) {
      pics[0].classList.add('mg-paw-trigger');
      return true;
    }
    // 形式3：素のテキスト（お金・占い・保険系／移動系DEF時）。
    // 「熊八」と「Muse Spark」を含む最小の要素を探し、その中の 🐾 を span で包む
    var best = null;
    var els = document.querySelectorAll('p,div,footer,span,li');
    for (var i = 0; i < els.length; i++) {
      var t = els[i].textContent || '';
      if (t.indexOf('熊八') !== -1 && t.indexOf('Muse Spark') !== -1 && t.indexOf('🐾') !== -1) {
        if (!best || t.length < best.textContent.length) best = els[i];
      }
    }
    if (!best) return false;
    var walker = document.createTreeWalker(best, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var idx = node.nodeValue.indexOf('🐾');
      if (idx !== -1) {
        var span = document.createElement('span');
        span.className = 'mg-paw-trigger';
        span.textContent = '🐾';
        var after = node.splitText(idx);
        after.nodeValue = after.nodeValue.slice('🐾'.length);
        node.parentNode.insertBefore(span, after);
        return true;
      }
    }
    return false;
  }

  /* ---------- モーダルとゲーム ---------- */
  var overlay = null, holes = [], els = {};
  var playing = false, playedOnce = false, score = 0, remain = 30;
  var spawnTimer = null, clockTimer = null, savedOverflow = '';

  function readBest() {
    try {
      var v = parseInt(localStorage.getItem(BEST_KEY), 10);
      return isNaN(v) ? 0 : v;
    } catch (e) { return 0; }
  }
  function writeBest(v) {
    try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {}
  }

  function buildModal() {
    if (overlay) return;
    var style = document.createElement('style');
    style.id = 'mgStyle';
    style.textContent = CSS;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'mg-overlay';
    overlay.id = 'mgOverlay';
    overlay.hidden = true;
    var holesHtml = '';
    for (var i = 0; i < 9; i++) {
      holesHtml += '<div class="mg-hole"><div class="mg-window"><div class="mg-chara"></div></div><div class="mg-mound"></div><div class="mg-pop"></div><div class="mg-bubble">いてぇ！</div></div>';
    }
    overlay.innerHTML =
      '<div class="mg-modal" role="dialog" aria-modal="true" aria-label="モグラ叩き">' +
      '<button type="button" class="mg-close" id="mgClose" aria-label="閉じる">×</button>' +
      '<div class="mg-title">モグラ叩き</div>' +
      '<div class="mg-bar">' +
      '<span class="mg-stat">スコア <b id="mgScore">0</b></span>' +
      '<span class="mg-stat">ベスト <b id="mgBest">0</b></span>' +
      '<span class="mg-stat">残り <b id="mgTime">30</b>秒</span>' +
      '</div>' +
      '<div class="mg-timebar"><div class="mg-timefill" id="mgTimeFill"></div></div>' +
      '<div class="mg-field" id="mgField">' + holesHtml + '</div>' +
      '<div class="mg-controls">' +
      '<button type="button" class="mg-btn" id="mgStart">スタート</button>' +
      '<div class="mg-msg" id="mgMsg">モグラをタップして叩こう。金モグラは高得点、熊八は叩いちゃダメだで</div>' +
      '</div></div>';
    document.body.appendChild(overlay);

    els = {
      score: overlay.querySelector('#mgScore'),
      best: overlay.querySelector('#mgBest'),
      time: overlay.querySelector('#mgTime'),
      fill: overlay.querySelector('#mgTimeFill'),
      msg: overlay.querySelector('#mgMsg'),
      start: overlay.querySelector('#mgStart')
    };
    els.best.textContent = readBest();

    holes = [];
    var holeEls = overlay.querySelectorAll('.mg-hole');
    for (var j = 0; j < holeEls.length; j++) {
      (function (hEl) {
        var h = {
          el: hEl,
          chara: hEl.querySelector('.mg-chara'),
          pop: hEl.querySelector('.mg-pop'),
          bubble: hEl.querySelector('.mg-bubble'),
          type: null, up: false, timer: null
        };
        holes.push(h);
        hEl.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          if (!playing || !h.up) return;
          var t = h.type;
          if (h.timer) { clearTimeout(h.timer); h.timer = null; }
          h.up = false; h.type = null;
          h.chara.classList.add('mg-hit');
          if (t === 'bear') {
            score = Math.max(0, score - 20);
            showPop(h, '-20', true);
            h.bubble.classList.add('mg-show');
            setTimeout(function () { h.bubble.classList.remove('mg-show'); }, 650);
          } else {
            var pts = t === 'gold' ? 30 : 10;
            score += pts;
            showPop(h, '+' + pts, false);
          }
          els.score.textContent = score;
          setTimeout(function () { downHole(h); }, 70);
        });
      })(holeEls[j]);
    }

    overlay.querySelector('#mgClose').addEventListener('click', closeGame);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeGame(); });
    els.start.addEventListener('click', startGame);
  }

  function showPop(h, text, minus) {
    h.pop.textContent = text;
    h.pop.className = 'mg-pop' + (minus ? ' mg-minus' : '');
    void h.pop.offsetWidth;
    h.pop.classList.add('mg-show');
  }

  function downHole(h) {
    h.up = false; h.type = null;
    h.chara.classList.remove('mg-up');
    h.chara.classList.remove('mg-hit');
    if (h.timer) { clearTimeout(h.timer); h.timer = null; }
  }

  function spawn() {
    if (!playing) return;
    var free = holes.filter(function (h) { return !h.up; });
    if (free.length) {
      var h = free[Math.floor(Math.random() * free.length)];
      var r = Math.random();
      h.type = r < 0.13 ? 'bear' : (r < 0.25 ? 'gold' : 'mole');
      h.chara.innerHTML = h.type === 'bear' ? BEAR : (h.type === 'gold' ? GOLD : MOLE);
      h.up = true;
      h.chara.classList.remove('mg-hit');
      h.chara.classList.add('mg-up');
      var stay = 620 + Math.random() * 380 - Math.min(250, (30 - remain) * 8);
      h.timer = setTimeout(function () { downHole(h); }, Math.max(420, stay));
    }
    var gap = 340 + Math.random() * 320 - Math.min(140, (30 - remain) * 5);
    spawnTimer = setTimeout(spawn, Math.max(220, gap));
  }

  function stopTimers() {
    if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
  }

  function startGame() {
    if (playing) return;
    playing = true; playedOnce = true; score = 0; remain = 30;
    els.score.textContent = '0';
    els.time.textContent = '30';
    els.fill.style.width = '100%';
    els.msg.textContent = '金モグラ +30、熊八は -20 だで';
    els.start.disabled = true;
    spawn();
    var started = Date.now();
    clockTimer = setInterval(function () {
      var elapsed = (Date.now() - started) / 1000;
      remain = Math.max(0, 30 - elapsed);
      els.time.textContent = Math.ceil(remain);
      els.fill.style.width = (remain / 30 * 100) + '%';
      if (remain <= 0) endGame();
    }, 100);
  }

  function endGame() {
    playing = false;
    stopTimers();
    holes.forEach(downHole);
    els.start.disabled = false;
    els.start.textContent = 'もう一回';
    var best = readBest();
    if (score > best) {
      writeBest(score);
      els.best.textContent = score;
      els.msg.textContent = 'おしまい！ スコア ' + score + '、ベスト更新だで！';
    } else {
      els.msg.textContent = 'おしまい！ スコア ' + score + ' だったで';
    }
  }

  function openGame() {
    buildModal();
    els.best.textContent = readBest();
    if (!playing) {
      els.start.disabled = false;
      els.start.textContent = playedOnce ? 'もう一回' : 'スタート';
    }
    overlay.hidden = false;
    savedOverflow = document.documentElement.style.overflow || '';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeGame() {
    if (!overlay || overlay.hidden) return;
    if (playing) {
      playing = false;
      stopTimers();
      holes.forEach(downHole);
      els.start.disabled = false;
      els.start.textContent = 'もう一回';
      els.msg.textContent = 'モグラをタップして叩こう。金モグラは高得点、熊八は叩いちゃダメだで';
    }
    overlay.hidden = true;
    document.documentElement.style.overflow = savedOverflow;
  }

  // テーマ切替後も生きるよう、クリックは委譲で受ける
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('.mg-paw-trigger')) {
      e.preventDefault();
      openGame();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeGame();
  });

  function initTrigger() {
    setupTrigger();
    // アイコン差し替えが遅れて走るページに備え、load 後にも数回だけ付け直しを試す
    setTimeout(setupTrigger, 500);
    setTimeout(setupTrigger, 1500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrigger);
  } else {
    initTrigger();
  }
  window.addEventListener('load', setupTrigger);
  // テーマ切替で 🐾 のノードが作り直されたら付け直す
  if (window.MutationObserver) {
    var themeTimer = null;
    new MutationObserver(function () {
      if (themeTimer) clearTimeout(themeTimer);
      themeTimer = setTimeout(setupTrigger, 60);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
})();
