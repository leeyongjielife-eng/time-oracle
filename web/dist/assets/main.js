/* 时间预言签 · 网页版（纯本地运行） */
(function () {
  'use strict';

  /* ===== 原帖签文（00–59，一字不差） ===== */
  var SIGNS = [
    '只想不努力是没用的！！加油…。',
    '非常冒险...机会不大。',
    '接受别人的意见会有助力。',
    '为何自己不肯妥协，先问一下自己的能力。',
    '毫无疑问。',
    '仍然难以估计。',
    '绝对不可。',
    '耐心等待。',
    '为何你还相信自己的幻想。',
    '不要表态。',
    '可能会造成震惊事件。',
    '答案不是你所想但又会成功。',
    '你需要尝试接受。',
    '太疑神疑鬼了、加强自信吧。',
    '是你心思误放在其它地方，影响运程。',
    '别心急。',
    '很大机会出现另一局面。',
    '静观其变。',
    '现在不是最佳时机。',
    '保持警惕、并非如你所想。',
    '听一下别人劝告吧。',
    '现在没法要求太多。',
    '用轻松的态度面对。',
    '事与愿违，须多留意自己情绪。',
    '要节制了，记得见好就收。',
    '不在你控制范围以内。',
    '小心！！',
    '继续走你的路，问题当没有事情发生过吧。',
    '用感觉去行动吧。',
    '别被自己情绪影响。',
    '好好把握啦！',
    '可按自己的目标进行计划。',
    '转移目标吧。',
    '多留意身边事物、另有出路。',
    '凡事都有两面，一时不爽未必是坏事。',
    '不妨改变一下想法。',
    '重新想一下是否真正对你最重要吧。',
    '记得不要太急进。',
    '别再浪费时间。',
    '辛苦的付出与收获不成正比，但切忌意气用事。',
    '结果如何你都不会忘记这件事。',
    '问题将会解决。',
    '将会受到一些挫折，要积极面对。',
    '有意外困扰，停滞不前，情绪会受到动摇。',
    '不要心存侥幸，不付出又那会有收获呢？',
    '出现了最佳时机，记着要踏实去干。',
    '危机四伏，较为冲击动荡，需要过关斩将。',
    '尝试去想一下其它更多的可能性。',
    '迟一点才去解决。',
    '不要自钻牛角尖，包容较挑剔来得开心。',
    '小心外来的引诱，不要意气用事啊！',
    '接受改变，面对现实啦。',
    '困扰你的问题可望得到解决。',
    '机会不会短期内再出现。',
    '再想清楚你要的是什么。',
    '等待一个更好机会。',
    '你需要付出代价。',
    '无论如何你都会继续去做！',
    '你需要放弃其它东西才成事。',
    '可能会好难，但值得的。'
  ];

  var STORE_KEY = 'timeOracleRecordsV1';
  function $(id) { return document.getElementById(id); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function normalizeQuestion(q) { return String(q || '').toLowerCase().replace(/[，。！？：；]/g, function(c) { return { '，':',','。':'.','！':'!','？':'?','：':':','；':';' }[c]; }).replace(/\s+/g,''); }
  function storageStatus(ok) {
    $('storageStatus').textContent = ok ? '记录自动保存在当前浏览器' : '浏览器存储不可用：本次记录仅临时保留，关闭或刷新会丢失。';
    $('storageStatus').classList.toggle('storage-error', !ok);
  }
  function loadRecords() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) throw new Error('invalid');
      records = arr.filter(function(r) { return r && typeof r.id === 'string' && /^[a-zA-Z0-9_-]+$/.test(r.id) && typeof r.q === 'string' && r.q.trim().length > 0 && r.q.length <= 200 && Number.isInteger(r.sign) && r.sign >= 0 && r.sign < 60 && typeof r.timeStr === 'string'; }).map(function(r) {
        return {id:r.id, q:r.q, norm:normalizeQuestion(r.q), sign:r.sign, timeStr:r.timeStr, saved:r.saved === true, manifested:r.manifested === true, note: typeof r.note === 'string' ? r.note : ''};
      });
      saveRecords();
    } catch(e) { storageStatus(false); }
  }
  var lastWriteOK = true;
  function saveRecords() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(records)); storageStatus(true); lastWriteOK = true; return true; }
    catch(e) { storageStatus(false); lastWriteOK = false; return false; }
  }
  var busy = false;
  function lock(value) { busy = value; $('submitBtn').disabled = value; }
  function formatTime(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + ' ' +
      pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  }

  var records = [];

  /* ===== Flex gap 布局行为检测（Chrome 61 基线用 margin，支持时启用 gap） ===== */
  function detectFlexGap() {
    try {
      var flex = document.createElement('div');
      flex.style.position = 'absolute';
      flex.style.visibility = 'hidden';
      flex.style.display = 'flex';
      flex.style.flexDirection = 'column';
      flex.style.rowGap = '1px';
      flex.appendChild(document.createElement('div'));
      flex.appendChild(document.createElement('div'));
      document.body.appendChild(flex);
      var supported = flex.scrollHeight === 1;
      flex.parentNode.removeChild(flex);
      if (supported) document.documentElement.classList.add('supports-flex-gap');
    } catch (e) { /* 检测失败时保持 margin 基线 */ }
  }

  /* ===== 背景装饰 ===== */
  function buildDecor() {
    var decor = $('bgDecor');
    var html = '<div class="halo h1"></div><div class="halo h2"></div>' +
      '<div class="ring r1"></div><div class="ring r2"></div>';
    var ornaments = ['✦', '✧', '☾', '✦', '✧', '✦', '☾', '✧'];
    for (var i = 0; i < ornaments.length; i++) {
      html += '<span class="orn" style="left:' + (6 + Math.random() * 88) + '%;font-size:' +
        (12 + Math.random() * 14).toFixed(0) + 'px;animation-duration:' +
        (14 + Math.random() * 16).toFixed(1) + 's;animation-delay:-' +
        (Math.random() * 20).toFixed(1) + 's">' + ornaments[i] + '</span>';
    }
    decor.innerHTML = html;
  }

  /* ===== Toast ===== */
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.add('hidden'); }, 1800);
  }

  /* ===== 弹窗 ===== */
  function showModal(opts) {
    var root = $('modalRoot');
    $('modalTitle').textContent = opts.title || '';
    $('modalBody').innerHTML = opts.body || '';
    var actions = $('modalActions');
    actions.innerHTML = '';
    (opts.buttons || []).forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn ' + (b.className || 'btn-ghost');
      btn.textContent = b.label;
      btn.addEventListener('click', function () {
        hideModal();
        if (b.onClick) b.onClick();
      });
      actions.appendChild(btn);
    });
    modalFocus = document.activeElement;
    root.classList.remove('hidden');
    actions.querySelector('button').focus();
  }
  var modalFocus = null;
  function hideModal() { $('modalRoot').classList.add('hidden'); if (modalFocus) modalFocus.focus(); }
  document.addEventListener('keydown', function(e) {
    if ($('modalRoot').classList.contains('hidden')) return;
    if(e.key === 'Escape') hideModal();
    if(e.key === 'Tab') { var buttons = $('modalActions').querySelectorAll('button'); var first=buttons[0], last=buttons[buttons.length-1]; if(e.shiftKey && document.activeElement===first) {e.preventDefault();last.focus();} else if(!e.shiftKey && document.activeElement===last) {e.preventDefault();first.focus();} }
  });

  /* ===== 视图切换 ===== */
  function switchView(name) {
    if (busy) return;
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.remove('active');
    $(name).classList.add('active');
    var btns = document.querySelectorAll('.nav-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.toggle('active', btns[j].getAttribute('data-view') === name);
    }
    if (name === 'viewRecords') renderRecords();
    if (name === 'viewManifested') renderManifested();
  }

  /* ===== 占卜 ===== */
  function findSameQuestion(norm) {
    var last = null;
    for (var i = 0; i < records.length; i++) {
      if (records[i].norm === norm) { last = records[i]; break; }
    }
    return last;
  }

  function drawSign(norm, lastRecord) {
    var now = new Date();
    var seconds = now.getSeconds();
    var sign = seconds;
    var note = '';
    if (lastRecord) note = '重复提问 · 参考签。仍按本次提交秒数取签，可能与之前相同。';
    var rec = {
      id: Date.now() + '_' + Math.floor(Math.random() * 100000),
      q: String(lastAskText).trim(),
      norm: norm,
      timeStr: formatTime(now),
      sign: sign,
      saved: false,
      manifested: false,
      note: note
    };
    records.unshift(rec);
    saveRecords();
    renderResult(rec);
  }

  var lastAskText = '';

  function onSubmit() {
    var input = $('questionInput');
    var text = input.value.trim();
    if (busy) return;
    if (text.length > 200) { toast('问题最多 200 字'); return; }
    if (!text) { toast('先写下你的问题吧～'); return; }
    lastAskText = text;
    var norm = normalizeQuestion(text);
    var last = findSameQuestion(norm);
    if (last) {
      showModal({
        title: '这个问题已经问过了',
        body: '你在 <strong>' + escapeHtml(last.timeStr) + '</strong> 问过这个问题啦。<br>再次提问会生成一条独立的参考签。',
        buttons: [
          { label: '知道了', className: 'btn-ghost' },
          {
            label: '我还是要问', className: 'btn-warn',
            onClick: function () {
              showModal({
                title: '确认再次取签',
                body: '签文仅供娱乐，将按本次提交时的秒数取签，可能得到相同结果。<br>仍要继续吗？',
                buttons: [
                  { label: '那算了', className: 'btn-ghost' },
                  { label: '仍要继续', className: 'btn-warn', onClick: function () { drawSign(norm, last); } }
                ]
              });
            }
          }
        ]
      });
      return;
    }
    drawSign(norm, null);
  }

  function renderResult(rec) {
    var area = $('resultArea');
    area.innerHTML =
      '<div class="result-card" id="resultCard" data-id="' + rec.id + '">' +
        '<p class="result-q">「' + escapeHtml(rec.q) + '」</p>' +
        '<div class="result-meta">' +
          '<span class="meta-chip">提交时间 ' + escapeHtml(rec.timeStr) + '</span>' +
          '<span class="meta-chip">取秒数 ' + pad2(rec.sign) + '</span>' +
        '</div>' +
        '<div class="sign-box">' +
          '<p class="sign-no">—— 签文 【' + pad2(rec.sign) + '】 ——</p>' +
          '<p class="sign-text">' + escapeHtml(SIGNS[rec.sign]) + '</p>' +
          (rec.note ? '<p class="sign-note">' + escapeHtml(rec.note) + '</p>' : '') +
        '</div>' +
        '<div class="result-actions">' +
          '<button type="button" class="btn btn-danger" id="destroyResultBtn">销毁答案</button>' +
        '</div>' +
      '</div>';
    $('destroyResultBtn').addEventListener('click', function () {
      confirmDestroy(rec, $('resultCard'));
    });
  }
  function confirmDestroy(rec, card) {
    if (busy) return;
    showModal({title:'销毁这条签文？', body:'这条问题和答案将从当前浏览器删除，无法恢复。', buttons:[
      {label:'保留'}, {label:'确认销毁', className:'btn-danger', onClick:function() {
        lock(true);
        burnCard(card,function() {
          removeRecord(rec.id);
          var result = $('resultCard');
          if (result && result.getAttribute('data-id') === rec.id) $('resultArea').innerHTML = '';
          lock(false);
          toast(lastWriteOK ? '签文已销毁' : '存储失败：刷新后旧记录可能恢复');
        });
      }}
    ]});
  }

  /* ===== 火烧动画 ===== */
  function burnCard(card, done) {
    if (!card) { done(); return; }
    var mask = document.createElement('div');
    mask.className = 'char-mask';
    card.appendChild(mask);
    var flame = document.createElement('div');
    flame.className = 'flame';
    card.appendChild(flame);
    for (var i = 0; i < 10; i++) {
      var s = document.createElement('span');
      s.className = 'spark';
      s.style.setProperty('--x', (8 + Math.random() * 84).toFixed(0) + '%');
      s.style.setProperty('--dx', ((Math.random() - 0.5) * 60).toFixed(0) + 'px');
      s.style.setProperty('--d', (1 + Math.random() * 1.2).toFixed(2) + 's');
      card.appendChild(s);
    }
    card.classList.add('burning');
    setTimeout(done, 2300);
  }

  function removeRecord(id) {
    records = records.filter(function (r) { return r.id !== id; });
    saveRecords();
    renderRecords();
    renderManifested();
  }

  /* ===== 我的记录 ===== */
  function recordHtml(r) {
    return '<div class="record-card' + (r.manifested ? ' manifested' : '') + '" data-id="' + r.id + '">' +
      '<p class="record-q">「' + escapeHtml(r.q) + '」' + (r.manifested ? '<span class="badge-manifested">已实现</span>' : '') + '</p>' +
      '<p class="record-meta">' + escapeHtml(r.timeStr) + ' · 秒数 ' + pad2(r.sign) + '</p>' +
      '<p class="record-sign">【' + pad2(r.sign) + '】' + escapeHtml(SIGNS[r.sign]) + '</p>' +
      (r.note ? '<p class="sign-note">' + escapeHtml(r.note) + '</p>' : '') +
      '<div class="record-actions">' +
        '<button type="button" class="btn btn-warn act-manifest">' + (r.manifested ? '取消已实现' : '标记已实现') + '</button>' +
        '<button type="button" class="btn btn-danger act-destroy">销毁答案</button>' +
      '</div>' +
    '</div>';
  }

  function bindRecordActions(container) {
    var cards = container.querySelectorAll('.record-card');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        var id = card.getAttribute('data-id');
        var rec = null;
        for (var j = 0; j < records.length; j++) if (records[j].id === id) rec = records[j];
        if (!rec) return;
        card.querySelector('.act-manifest').addEventListener('click', function () {
          if (busy) return;
          rec.manifested = !rec.manifested;

          saveRecords();
          renderRecords();
          renderManifested();
          toast(lastWriteOK ? (rec.manifested ? '已标记为实现' : '已取消实现') : '标记仅临时保留');
        });
        card.querySelector('.act-destroy').addEventListener('click', function () {
          confirmDestroy(rec, card);
        });
      })(cards[i]);
    }
  }

  function renderRecords() {
    var list = $('recordsList');
    var saved = records;
    if (!saved.length) {
      list.innerHTML = '<div class="empty"><span class="empty-orn">☾</span>还没有记录<br>写下问题，取一签留作记录</div>';
      return;
    }
    list.innerHTML = saved.map(recordHtml).join('');
    bindRecordActions(list);
  }

  function renderManifested() {
    var list = $('manifestedList');
    var shown = records.filter(function (r) { return r.manifested; });
    $('manifestedCount').textContent = shown.length;
    if (!shown.length) {
      list.innerHTML = '<div class="empty"><span class="empty-orn">✦</span>还没有已实现的记录<br>当愿望成为现实，可以回来标记</div>';
      return;
    }
    list.innerHTML = shown.map(recordHtml).join('');
    bindRecordActions(list);
  }

  /* ===== 环境音（默认关闭，由用户主动播放） ===== */
  var Music = {
    playing: false,
    fadeTimer: null,
    targetVolume: 0.22,
    setButton: function (playing) {
      var btn = $('musicBtn');
      btn.classList.toggle('playing', playing);
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btn.setAttribute('aria-label', playing ? '关闭环境音' : '开启环境音');
      btn.setAttribute('title', playing ? '关闭环境音' : '开启环境音');
      $('musicState').textContent = playing ? '播放中' : '关闭';
    },
    fadeTo: function (value, done) {
      var audio = $('ambientAudio');
      if (this.fadeTimer) clearInterval(this.fadeTimer);
      var self = this;
      this.fadeTimer = setInterval(function () {
        var next = audio.volume + (value - audio.volume) * 0.28;
        if (Math.abs(next - value) < 0.01) {
          audio.volume = value;
          clearInterval(self.fadeTimer);
          self.fadeTimer = null;
          if (done) done();
          return;
        }
        audio.volume = Math.max(0, Math.min(1, next));
      }, 50);
    },
    start: function () {
      var audio = $('ambientAudio');
      var self = this;
      audio.volume = 0;
      var playResult = audio.play();
      if (!playResult || typeof playResult.then !== 'function') {
        this.playing = true;
        this.setButton(true);
        this.fadeTo(this.targetVolume);
        return;
      }
      playResult.then(function () {
        self.playing = true;
        self.setButton(true);
        self.fadeTo(self.targetVolume);
      }).catch(function () {
        self.playing = false;
        self.setButton(false);
        toast('环境音暂时无法播放，请检查浏览器声音设置');
      });
    },
    stop: function () {
      var audio = $('ambientAudio');
      this.playing = false;
      this.setButton(false);
      this.fadeTo(0, function () { audio.pause(); });
    },
    toggle: function () { this.playing ? this.stop() : this.start(); }
  };

  /* ===== 初始化 ===== */
  function init() {
    detectFlexGap();
    buildDecor();
    $('submitBtn').addEventListener('click', onSubmit);
    $('musicBtn').addEventListener('click', function () { Music.toggle(); });
    var navBtns = document.querySelectorAll('.nav-btn');
    for (var i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener('click', function () { switchView(this.getAttribute('data-view')); });
    }
    renderRecords();
    renderManifested();
    loadRecords();
    renderRecords();
    renderManifested();
  }

  init();
})();
