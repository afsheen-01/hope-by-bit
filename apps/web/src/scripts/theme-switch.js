// Builds the Auto/Light/Dark control. Doesn't exist without JavaScript,
// which is correct — the system preference already carries both grounds.
import circleHalf from "@phosphor-icons/core/assets/regular/circle-half.svg?raw";
import sun from "@phosphor-icons/core/assets/regular/sun.svg?raw";
import moon from "@phosphor-icons/core/assets/regular/moon.svg?raw";

const ICONS = { auto: circleHalf, light: sun, dark: moon };

// ponytail: fixed 6am–6pm daylight window, not real sunrise/sunset for the
// visitor's location — upgrade to a geolocation-based sunrise calc if a
// fixed split ever reads wrong somewhere. Matches Base.astro's inline
// pre-paint check, which can't import this module (must run synchronously
// before first paint).
function autoTheme() {
  var h = new Date().getHours();
  return (h >= 6 && h < 18) ? "light" : "dark";
}

(function () {
  var el = document.getElementById("theme");
  var root = document.documentElement;
  el.style.display = "flex";

  var pollId = null;
  function stopPolling() {
    if (pollId) { clearInterval(pollId); pollId = null; }
  }
  function startPolling() {
    stopPolling();
    // The 6/18 boundary can fall while the tab stays open; recheck
    // occasionally rather than only on load.
    pollId = setInterval(function () { root.dataset.theme = autoTheme(); }, 15 * 60 * 1000);
  }

  ["auto", "light", "dark"].forEach(function (name) {
    var b = document.createElement("button");
    b.type = "button";
    b.innerHTML = ICONS[name];
    b.setAttribute("aria-label", name[0].toUpperCase() + name.slice(1) + " theme");
    b.onclick = function () {
      if (name === "auto") {
        localStorage.removeItem("theme");
        root.dataset.theme = autoTheme();
        startPolling();
      } else {
        localStorage.setItem("theme", name);
        root.dataset.theme = name;
        stopPolling();
      }
      mark();
    };
    el.appendChild(b);
  });
  function mark() {
    var now = localStorage.getItem("theme") || "auto";
    Array.prototype.forEach.call(el.children, function (b, i) {
      b.setAttribute("aria-pressed", String(["auto", "light", "dark"][i] === now));
    });
  }
  mark();
  if (!localStorage.getItem("theme")) startPolling();
})();
