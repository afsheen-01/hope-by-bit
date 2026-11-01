// Tap to tick a movement, tap again to undo. Not saved: a daily record
// would become a streak (P2, product/principles.md).
export function initMovements(list: HTMLElement) {
  list.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("button");
    if (b) b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
  });
}
