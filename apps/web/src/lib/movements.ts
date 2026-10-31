// Done, and still tappable: a mistap undoes as easily as it happened.
// Deliberately not persisted — the wall's cumulative total is the only
// number this product keeps (P2); a per-day record is a streak.
export function initMovements(list: HTMLElement) {
  list.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("button");
    if (!b) return;
    const done = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(done));
    b.querySelector(".tick")?.remove();
    if (done) b.insertAdjacentHTML("afterbegin", '<span class="tick" aria-hidden="true">✓</span>');
  });
}
