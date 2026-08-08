/* Hope By Bit — two screens, as data and pure functions.
   Values in, values out; effects only at the edges, per
   CONTRIBUTING.md. Nothing here names a typeface.

   Two screens, each carrying one of the two accents:
     goodBit    — the daily unit.        forest
     yourPeople — the check-in.          apricot
*/

(function (global) {
  'use strict';

  /* ── content ─────────────────────────────────────────── */

  var goodBit = {
    date: 'Thursday',
    headline: 'Malaria vaccine reaches 20 million children',
    figure: '13%',
    figureCap: 'fewer deaths from any cause among vaccinated under-fives',
    body:
      'Twenty-three African countries have folded the vaccine into routine ' +
      'immunisation. Malaria has killed half a million children a year for ' +
      'as long as anyone has been counting. That number is moving.',
    source: 'Gavi · WHO',
    /* The action is something the body does, offered two or three at a
       time so there is always one within reach of the room you're in.
       Small enough to finish now, and to feel having finished. */
    ask: 'Now one small thing, while you’re here. Whichever is nearest — they all count the same.',
    actions: [
      'A glass of water',
      'Stand up and stretch',
      'Ninety seconds outside'
    ]
  };

  /* The closing line, by how many were done. Proportional praise, per
     product/features.md's tone: warm without getting louder — one done is the
     day cleared, and three is a good day, not a better person. */
  function bottomFor(doneCount) {
    if (doneCount === 0) return "That's today's. See you tomorrow.";
    if (doneCount === 3) return 'All three. That was a good day.';
    return "That's today's, and it counted.";
  }

  var yourPeople = {
    date: 'Thursday, 11:48pm',
    headline: 'Tell your people it’s a bad one.',
    message:
      'Afsheen is having a hard moment and asked me to let you know. ' +
      'A call or a text would mean a lot right now.',
    people: [
      { initials: 'SM', name: 'Sam' },
      { initials: 'PK', name: 'Priya' },
      { initials: 'DA', name: 'Dad' }
    ],
    body: 'You wrote this in June, when it was calm. Nothing to type now.',
    action: 'Send it',
    bottom: 'It goes from your own number, so their reply lands where it should.',
    crisis:
      'This app is for hard moments. If you’re in danger, call or text 988 — ' +
      'that’s who to reach right now.'
  };

  /* ── markup ──────────────────────────────────────────── */

  var statusBar =
    '<div class="status">' +
    '<span>9:41</span>' +
    '<span class="bars"><i></i><i></i><i></i><i></i></span>' +
    '</div>';

  function frame(inner) {
    return '<div class="phone">' + statusBar + '<div class="screen">' + inner + '</div></div>';
  }

  /* choicesHTML : ([String], [Int]) -> String
     No action is the recommended one, so they carry equal weight. A
     single accent button among two quiet ones would be the product
     choosing for you. Done stays tappable, so it can be undone. */
  function choicesHTML(actions, done) {
    return (
      '<div class="choices">' +
      actions.map(function (a, i) {
        var isDone = done.indexOf(i) !== -1;
        return (
          '<button class="choice" data-choice="' + i + '" ' +
          'aria-pressed="' + isDone + '">' +
          (isDone ? '<span class="tick" aria-hidden="true">✓</span>' : '') +
          a + '</button>'
        );
      }).join('') +
      '</div>'
    );
  }

  /* goodBitHTML : (Bit, [Int]) -> String */
  function goodBitHTML(b, done) {
    return frame(
      '<div class="date">' + b.date + '</div>' +
      '<h1 class="headline">' + b.headline + '</h1>' +
      '<div class="figure">' +
        '<div class="figure-num">' + b.figure + '</div>' +
        '<div class="figure-cap">' + b.figureCap + '</div>' +
      '</div>' +
      '<p class="body">' + b.body + '</p>' +
      '<div class="source">' + b.source + '</div>' +
      '<div class="spacer"></div>' +
      '<p class="ask">' + b.ask + '</p>' +
      choicesHTML(b.actions, done) +
      '<div class="bottom">' + bottomFor(done.length) + '</div>'
    );
  }

  /* personHTML : Person -> String */
  function personHTML(p) {
    return (
      '<span class="person">' +
      '<span class="avatar">' + p.initials + '</span>' + p.name +
      '</span>'
    );
  }

  /* yourPeopleHTML : CheckIn -> String */
  function yourPeopleHTML(c) {
    return frame(
      '<div class="date">' + c.date + '</div>' +
      '<h1 class="headline">' + c.headline + '</h1>' +
      '<div class="msg">' + c.message + '</div>' +
      '<div class="people">' + c.people.map(personHTML).join('') + '</div>' +
      '<p class="body">' + c.body + '</p>' +
      '<div class="spacer"></div>' +
      '<button class="btn btn-people">' + c.action + '</button>' +
      '<div class="bottom">' + c.bottom + '</div>' +
      '<div class="crisis">' + c.crisis + '</div>'
    );
  }

  /* screenHTML : (Mode, [Int]?) -> String
     `done` is which of the day's actions have been taken. It is passed
     in rather than read, so this stays a pure function of its inputs. */
  function screenHTML(mode, done) {
    return mode === 'people'
      ? yourPeopleHTML(yourPeople)
      : goodBitHTML(goodBit, done || []);
  }

  /* ── switches ────────────────────────────────────────── */

  function segmented(attr, options, current) {
    return (
      '<div class="seg">' +
      options
        .map(function (o) {
          return (
            '<button ' + attr + '="' + o.value + '" aria-pressed="' +
            (o.value === current) + '">' + o.label + '</button>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  /* The only switch left. Type and palette are settled, and both
     screens are on the page at once, so there is nothing else to
     toggle — but the theme is a real setting rather than an
     experiment, and every screen is checked in both grounds. */
  function themerHTML(current) {
    return segmented('data-theme-set', [
      { value: 'auto', label: 'Auto' },
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' }
    ], current);
  }

  /* ── effects, at the edge ────────────────────────────── */

  function readStored(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function store(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* private mode — the page works, the choice just won't persist */
    }
  }

  function press(attr, value) {
    Array.prototype.forEach.call(document.querySelectorAll('[' + attr + ']'), function (el) {
      el.setAttribute('aria-pressed', String(el.getAttribute(attr) === value));
    });
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    store('hbb-theme', theme);
    press('data-theme-set', theme);
  }

  function mountSwitches(el) {
    var theme = readStored('hbb-theme', 'auto');

    el.innerHTML = '<div class="switches">' + themerHTML(theme) + '</div>';

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-theme-set]');
      if (t) return applyTheme(t.getAttribute('data-theme-set'));
    });

    applyTheme(theme);
  }

  /* Which of today's actions have been taken.

     THIS IS DELIBERATELY NOT PERSISTED. No store(), no localStorage,
     no key of its own — it dies with the page, on purpose. The wall's
     cumulative total is the only number this product keeps ([P2]), and
     a per-day record of how many you managed is the shape a streak
     takes. The encouragement is copy in the moment; making it durable
     is the change that must not be made. */
  var done = [];

  function mountBit(el) {
    function render() { el.innerHTML = screenHTML('bit', done); }

    el.addEventListener('click', function (e) {
      var c = e.target.closest('[data-choice]');
      if (!c) return;
      var i = Number(c.getAttribute('data-choice'));
      done = done.indexOf(i) === -1
        ? done.concat([i])
        : done.filter(function (j) { return j !== i; });
      render();
      /* Re-render replaces the button, so put focus back on it. */
      var again = el.querySelector('[data-choice="' + i + '"]');
      if (again) again.focus();
    });

    render();
  }

  global.HopeByBit = {
    goodBit: goodBit,
    yourPeople: yourPeople,
    screenHTML: screenHTML,
    mountBit: mountBit,
    mountSwitches: mountSwitches
  };
})(window);
