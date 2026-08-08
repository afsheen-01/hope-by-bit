/* Hope By Bit — onboarding, as data and pure functions.
   Values in, values out; effects only at the edges, per CONTRIBUTING.md.
   Nothing here names a typeface.

   Five questions, four of them skippable, and then today's story.
   The shape is techSpec/app/ui.md — where the two disagree, the
   spec is right and this is a bug.

   The answers object is the prototype's stand-in for the variant: one
   accumulating value, and render(state) is a pure function of it.
*/

(function (global) {
  'use strict';

  /* ── content ─────────────────────────────────────────── */

  /* Eight, and the ceiling is five — a sixth channel dilutes the day
     rather than widening it. */
  var CHANNELS = [
    'medicine', 'climate', 'wild places', 'kindness',
    'science', 'your city', 'rights', 'food'
  ];

  /* Grief leads, as the deepest path. */
  var PATHS = ['grief', 'illness', 'burnout', 'loneliness', 'worry'];

  var NAME = 'Afsheen';

  var INTRO_MESSAGE =
    'Hope By Bit: ' + NAME + ' chose you as someone to reach out to when ' +
    'things are heavy. Reply YES to be reachable, STOP to decline.';

  var HARD_MESSAGE =
    NAME + ' is having a hard moment and asked me to let you know. ' +
    'A call or a text would mean a lot right now.';

  /* The count is adjustable, so the wording has to follow it — a panel
     promising one number and a message saying another is the kind of
     thing someone only discovers at the worst moment. */
  var COUNT_WORD = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' };

  function autoMessage(n) {
    return NAME + ' has opened the loop breaker ' + (COUNT_WORD[n] || n + ' times') +
      ' today. This was sent automatically — they did not press anything.';
  }

  var STEPS = 5;
  var MAX_CHANNELS = 5;
  var MIN_CHANNELS = 3;
  var MAX_PATHS = 2;
  var MAX_CIRCLE = 4;

  /* ── pure helpers ────────────────────────────────────── */

  /* Names and messages are typed by a person and rendered as markup,
     so they are escaped on the way in. */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function has(list, value) { return list.indexOf(value) !== -1; }

  /* toggle : ([a], a, Int) -> { list: [a], refused: Bool }
     Reaching past the ceiling keeps what's there and reports the
     refusal, so the caller can explain it rather than fail silently. */
  function toggle(list, value, max) {
    if (has(list, value)) {
      return {
        list: list.filter(function (v) { return v !== value; }),
        refused: false
      };
    }
    if (list.length >= max) return { list: list, refused: true };
    return { list: list.concat([value]), refused: false };
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); })
      .join('') || '?';
  }

  function confirmed(circle) {
    return circle.filter(function (p) { return p.consent === 'confirmed'; });
  }

  function names(people) {
    return people.map(function (p) { return p.name; }).join(', ');
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  /* ── markup ──────────────────────────────────────────── */

  var statusBar =
    '<div class="status">' +
    '<span>9:41</span>' +
    '<span class="bars"><i></i><i></i><i></i><i></i></span>' +
    '</div>';

  function frame(inner) {
    return (
      '<div class="phone">' + statusBar +
      '<div class="screen">' + inner + '</div></div>'
    );
  }

  /* The end is visible from the start. */
  function topbar(step) {
    return (
      '<div class="topbar">' +
      (step > 1
        ? '<button class="back" data-act="back">← Back</button>'
        : '<span></span>') +
      '<span class="progress">' + step + ' of ' + STEPS + '</span>' +
      '</div>'
    );
  }

  function heading(text) { return '<h1 class="headline">' + text + '</h1>'; }

  function notice(state) {
    return state.notice ? '<div class="notice">' + state.notice + '</div>' : '';
  }

  /* chips : (String, [String], [String]) -> String */
  function chips(attr, options, chosen) {
    return (
      '<div class="chips">' +
      options.map(function (o) {
        return (
          '<button class="chip" ' + attr + '="' + esc(o) + '" ' +
          'data-key="' + attr + '-' + esc(o) + '" ' +
          'aria-pressed="' + has(chosen, o) + '">' + esc(o) + '</button>'
        );
      }).join('') +
      '</div>'
    );
  }

  /* segmented : (String, [{value,label}], String) -> String
     screen.js has its own copy of this, private to that file. Rather
     than reach into it or edit it, this page carries its own. */
  function segmented(attr, options, current) {
    return (
      '<div class="seg">' +
      options.map(function (o) {
        return (
          '<button ' + attr + '="' + o.value + '" ' +
          'aria-pressed="' + (o.value === current) + '">' + o.label + '</button>'
        );
      }).join('') +
      '</div>'
    );
  }

  function field(opts) {
    var id = 'f-' + opts.name;
    var attrs = 'id="' + id + '" data-field="' + opts.name + '"' +
      (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '');
    var control = opts.multiline
      ? '<textarea ' + attrs + ' rows="3">' + esc(opts.value) + '</textarea>'
      : '<input ' + attrs + ' type="' + (opts.type || 'text') +
        '" value="' + esc(opts.value) + '">';
    return (
      '<div class="field">' +
      '<label for="' + id + '">' + opts.label + '</label>' +
      control +
      '</div>'
    );
  }

  function primary(label, opts) {
    var o = opts || {};
    return (
      '<button class="btn" data-act="next"' +
      (o.disabled ? ' disabled' : '') + '>' + label + '</button>'
    );
  }

  function skip(label) {
    return '<button class="skip" data-act="skip">' + label + '</button>';
  }

  /* ── 1 · interests ───────────────────────────────────── */
  /* Required. Picking three chips is the moment the product explains
     itself, so it comes before anything is asked for. */
  function stepInterests(s) {
    var n = s.channels.length;
    return frame(
      topbar(1) +
      heading('What do you want proof about?') +
      chips('data-channel', CHANNELS, s.channels) +
      '<p class="count">' + (n ? n + ' chosen' : 'Nothing chosen yet') + '</p>' +
      (n < MIN_CHANNELS ? '<p class="hint">pick three or more, and we’ll take it ' +
        'from there</p>' : '') +
      notice(s) +
      '<div class="spacer"></div>' +
      primary('Continue', { disabled: n < MIN_CHANNELS })
    );
  }

  /* ── 2 · path ────────────────────────────────────────── */
  /* Skippable, and moving straight past is an equally ordinary answer. */
  function stepPath(s) {
    return frame(
      topbar(2) +
      heading('Anything you’re carrying right now?') +
      '<p class="body">Up to two, and only if you want to. Grief here isn’t ' +
      'only about someone dying — a person, a relationship, your health, a ' +
      'home, a future you’d counted on all belong. This stays in settings ' +
      'for whenever it becomes relevant.</p>' +
      chips('data-path', PATHS, s.paths) +
      notice(s) +
      '<div class="spacer"></div>' +
      primary('Continue') +
      skip('Not right now')
    );
  }

  /* ── 3 · the circle ──────────────────────────────────── */
  /* Each person is asked first. Only a YES makes someone reachable. */
  function personHTML(p, i) {
    var state = p.consent === 'confirmed' ? 'confirmed'
      : p.consent === 'declined' ? 'declined' : 'pending';
    return (
      '<button class="person" data-consent="' + state + '" data-person="' + i + '" ' +
      'data-key="person-' + i + '" ' +
      'aria-label="' + esc(p.name) + ' — ' + state + '. Change for this prototype.">' +
      '<span class="avatar">' + esc(initials(p.name)) + '</span>' +
      '<span class="name">' + esc(p.name) + '</span>' +
      '<span class="status-dot"></span>' +
      '<span class="person-state">' + state + '</span>' +
      '</button>'
    );
  }

  function autoCheckin(s) {
    var yes = confirmed(s.circle);
    var available = yes.length > 0;

    var control =
      '<button class="toggle" role="switch" data-key="auto" ' +
      'aria-checked="' + (available && s.autoCheckin) + '"' +
      (available ? ' data-act="auto"' : ' disabled') + '>' +
      '<span class="switch"></span>' +
      '<span class="toggle-text">If I open the loop breaker ' + s.autoCount +
      ' times in a day, tell my people.' +
      (available ? '' :
        '<br><span class="person-state">Unavailable until someone replies YES. ' +
        'Until then, check in hands off to your phone’s share sheet.</span>') +
      '</span></button>';

    if (!available || !s.autoCheckin) return control;

    /* On, the whole consequence arrives at once. */
    return control +
      '<div class="consequence">' +
      '<p>How many times in a day:</p>' +
      segmented('data-count-set', [
        { value: '2', label: '2' }, { value: '3', label: '3' },
        { value: '4', label: '4' }, { value: '5', label: '5' }
      ], String(s.autoCount)) +
      '<p>Told: <b>' + esc(names(yes)) + '</b></p>' +
      '<p>“' + esc(autoMessage(s.autoCount)) + '”</p>' +
      '<p>You get twenty seconds and a <b>just me this time</b> button before ' +
      'it goes.</p>' +
      '<p class="limit">A count is a count. A hard day that doesn’t reach ' +
      s.autoCount + ' passes unremarked — which is why check in and the ' +
      'crisis line stay where they are.</p>' +
      '</div>';
  }

  function stepCircle(s) {
    var n = s.circle.length;
    return frame(
      topbar(3) +
      heading('Who should we tell, if you ask?') +
      '<p class="body">Two to four people. Each one is asked first — only a ' +
      'YES makes someone reachable.</p>' +

      (n ? '<div class="people">' + s.circle.map(personHTML).join('') + '</div>' : '') +
      (n ? '<p class="stub">Prototype: tap a person to move them through ' +
           'pending → confirmed → declined, standing in for replies arriving.</p>' : '') +

      notice(s) +

      (n < MAX_CIRCLE
        ? '<div class="row">' +
            field({ name: 'draftName', label: 'Name', value: s.draftName, placeholder: 'Sam' }) +
            field({ name: 'draftPhone', label: 'Number', value: s.draftPhone, placeholder: 'Optional', type: 'tel' }) +
          '</div>' +
          '<button class="btn btn-quiet" data-act="add">Add</button>' +
          '<button class="btn btn-quiet" data-act="pick">Choose from contacts</button>' +
          '<p class="stub">The picker belongs to the phone — the app receives ' +
          'the contacts you select and nothing else.</p>'
        : '') +

      field({
        name: 'intro',
        label: 'What each of them receives now:',
        value: s.intro,
        multiline: true
      }) +

      field({
        name: 'hardMessage',
        label: 'And what they’d receive in a hard moment. Writing it here, ' +
               'calm, is the point — the hard moment itself asks nothing of you.',
        value: s.hardMessage,
        multiline: true
      }) +

      autoCheckin(s) +

      '<div class="spacer"></div>' +
      primary('Send the asks', { disabled: n === 0 }) +
      skip('Skip for now') +
      '<div class="crisis">Numbers are held encrypted, used for this and ' +
      'nothing else, and released when someone is removed or the account is ' +
      'deleted.</div>'
    );
  }

  /* ── 4 · notification time ───────────────────────────── */
  function stepTime(s) {
    return frame(
      topbar(4) +
      heading('When should it arrive?') +
      '<p class="body">One arrival a day.</p>' +
      field({ name: 'time', label: 'Every day at', value: s.time, type: 'time' }) +
      '<p class="hint">The reminder is scheduled on your phone, which is also ' +
      'why it still arrives with the network away.</p>' +
      '<div class="spacer"></div>' +
      primary('Continue') +
      '<div class="bottom">Declining the notification leaves the app opening ' +
      'to the day’s story whenever you open it.</div>'
    );
  }

  /* ── 5 · account ─────────────────────────────────────── */
  /* Last, once there's a record worth keeping. */
  function stepAccount(s) {
    return frame(
      topbar(5) +
      heading('Keep this if you change phones.') +
      '<p class="body">Everything from the last four steps uploads on first ' +
      'sign-in, so signing in after a month of use brings that month with it.</p>' +

      '<button class="btn" data-act="google">Sign in with Google</button>' +
      field({
        name: 'email',
        label: 'Or an emailed sign-in link',
        value: s.email,
        placeholder: 'you@example.com',
        type: 'email'
      }) +
      '<button class="btn btn-quiet" data-act="emailLink"' +
      (s.email.indexOf('@') === -1 ? ' disabled' : '') + '>Email me a link</button>' +

      /* Theme is not asked here. Onboarding runs in Auto, and the picker
         appears once the questions are done — a setting to fiddle with
         mid-flow is one more thing between someone and the first story. */

      '<div class="spacer"></div>' +
      primary('Continue') +
      skip('Not now — keep it on this phone') +
      '<div class="bottom">Skipping keeps the app whole on this device, with ' +
      'the circle held locally and check in handed to your phone’s share ' +
      'sheet.</div>'
    );
  }

  /* ── and then today's story ──────────────────────────── */
  function stepDone(s) {
    function row(term, value) {
      return '<div><dt>' + term + '</dt><dd>' + value + '</dd></div>';
    }
    var yes = confirmed(s.circle);
    return frame(
      '<div class="topbar">' +
      '<button class="back" data-act="back">← Back</button>' +
      '<span class="progress">done</span></div>' +
      heading('That’s everything.') +
      '<p class="body">One good thing, one small thing, every day — starting ' +
      'tomorrow at ' + esc(s.time) + '. We’re glad you’re here.</p>' +
      '<dl class="summary">' +
      row('proof about', esc(s.channels.join(', '))) +
      row('carrying', s.paths.length
        ? esc(s.paths.join(', '))
        : '<span class="person-state">nothing set</span>') +
      row('your people', s.circle.length
        ? esc(names(s.circle)) + ' <span class="person-state">(' + yes.length +
          ' ' + plural(yes.length, 'reply', 'replies') + ' in)</span>'
        : '<span class="person-state">none yet</span>') +
      row('arriving', esc(s.time)) +
      row('account', s.account
        ? esc(s.account === 'google' ? 'Google' : s.email)
        : '<span class="person-state">this phone only</span>') +
      '</dl>' +
      '<div class="spacer"></div>' +
      '<button class="btn" data-act="home">See today’s story</button>' +
      '<div class="bottom">Every step can be revisited from settings, and each ' +
      'one stands as answered once given.</div>'
    );
  }

  /* screenHTML : State -> String */
  function screenHTML(s) {
    if (s.step === 1) return stepInterests(s);
    if (s.step === 2) return stepPath(s);
    if (s.step === 3) return stepCircle(s);
    if (s.step === 4) return stepTime(s);
    if (s.step === 5) return stepAccount(s);
    return stepDone(s);
  }

  /* ══ effects, at the edge ═════════════════════════════ */

  var screenEl = null;
  var onDone = null;
  var focusKey = null;

  var state = {
    step: 1,
    notice: '',
    channels: [],
    paths: [],
    circle: [],
    draftName: '',
    draftPhone: '',
    intro: INTRO_MESSAGE,
    hardMessage: HARD_MESSAGE,
    autoCheckin: false,
    autoCount: 3,
    time: '08:00',
    email: '',
    account: null
  };

  function render() {
    screenEl.innerHTML = screenHTML(state);
    if (focusKey) {
      var el = screenEl.querySelector('[data-key="' + focusKey + '"]');
      if (el) el.focus();
      focusKey = null;
    }
  }

  function go(step) {
    state.step = step;
    state.notice = '';
    render();
    /* A new question starts at the top of the phone, not wherever the
       last one was scrolled to. */
    var screen = screenEl.querySelector('.screen');
    if (screen) screen.scrollTop = 0;
  }

  function addPerson() {
    var name = state.draftName.trim();
    if (!name) { state.notice = 'A name, at least — the number can wait.'; return render(); }
    if (state.circle.length >= MAX_CIRCLE) {
      state.notice = 'Four is the ceiling.';
      return render();
    }
    state.circle = state.circle.concat([
      { name: name, phone: state.draftPhone.trim(), consent: 'pending' }
    ]);
    state.draftName = '';
    state.draftPhone = '';
    state.notice = '';
    render();
  }

  /* Standing in for replies arriving, which in the app come back from
     the backend rather than from a tap. */
  var CONSENT_CYCLE = { pending: 'confirmed', confirmed: 'declined', declined: 'pending' };

  function cycleConsent(i) {
    state.circle = state.circle.map(function (p, j) {
      return j === i ? { name: p.name, phone: p.phone, consent: CONSENT_CYCLE[p.consent] } : p;
    });
    /* Losing the last YES takes the automatic setting with it. */
    if (!confirmed(state.circle).length) state.autoCheckin = false;
    render();
  }

  function onClick(e) {
    var t = e.target;

    var keyed = t.closest('[data-key]');
    focusKey = keyed ? keyed.getAttribute('data-key') : null;

    var countBtn = t.closest('[data-count-set]');
    if (countBtn) {
      state.autoCount = Number(countBtn.getAttribute('data-count-set'));
      return render();
    }

    var channel = t.closest('[data-channel]');
    if (channel) {
      var c = toggle(state.channels, channel.getAttribute('data-channel'), MAX_CHANNELS);
      state.channels = c.list;
      state.notice = c.refused
        ? 'Five is the ceiling — a sixth channel dilutes the day rather than ' +
          'widening it. Drop one to swap it.'
        : '';
      return render();
    }

    var path = t.closest('[data-path]');
    if (path) {
      var p = toggle(state.paths, path.getAttribute('data-path'), MAX_PATHS);
      state.paths = p.list;
      state.notice = p.refused ? 'Two at a time.' : '';
      return render();
    }

    var person = t.closest('[data-person]');
    if (person) return cycleConsent(Number(person.getAttribute('data-person')));

    var act = t.closest('[data-act]');
    if (!act) return;

    switch (act.getAttribute('data-act')) {
      case 'next': return go(state.step + 1);
      case 'back': return go(state.step - 1);
      case 'skip': return go(state.step + 1);
      case 'add': return addPerson();
      case 'pick':
        state.notice = 'The contact picker belongs to the phone — stubbed here. ' +
          'Type a name and number instead.';
        return render();
      case 'auto':
        state.autoCheckin = !state.autoCheckin;
        return render();
      case 'google':
        state.account = 'google';
        return go(state.step + 1);
      case 'emailLink':
        state.account = 'email';
        return go(state.step + 1);
      case 'home': return onDone();
    }
  }

  /* Text fields write straight to state and do NOT re-render — a
     re-render mid-word would take the caret with it. Everything that
     reads them re-renders on its own account. */
  function onInput(e) {
    var f = e.target.closest('[data-field]');
    if (!f) return;
    state[f.getAttribute('data-field')] = f.value;

    /* The one control that has to answer a field as it's typed. Its
       disabled state is set directly rather than through render, for
       the same reason: the caret is in that field. */
    var link = screenEl.querySelector('[data-act="emailLink"]');
    if (link) link.disabled = state.email.indexOf('@') === -1;
  }

  /* mount(screenTarget, done)
     `done` is called once, when the last screen hands off. Onboarding
     owns the element until then; what replaces it is not its business. */
  function mount(screenTarget, done) {
    screenEl = screenTarget;
    onDone = done;

    screenEl.addEventListener('click', onClick);
    screenEl.addEventListener('input', onInput);

    render();
  }

  global.HopeByBitOnboarding = {
    toggle: toggle,
    initials: initials,
    screenHTML: screenHTML,
    mount: mount
  };
})(window);
