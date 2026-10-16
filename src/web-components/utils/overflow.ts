/**
 * Report whether a scroll container currently overflows (#334).
 *
 * A container that scrolls has to be reachable by keyboard, or keyboard users
 * cannot scroll it (WCAG 2.1.1). Making every such container a tab stop is the
 * blunt fix, and it adds a stop that does nothing to every table and code block
 * that happens to fit. This lets a component add the tab stop only while there
 * is something to scroll.
 *
 * `onChange` runs once on the first measurement and then whenever the answer
 * changes. The element's children are observed as well as the element, because
 * content growing inside a container of fixed size changes the overflow without
 * resizing the container. Returns a function that stops observing.
 */
export function observeOverflow(el: Element, onChange: (overflows: boolean) => void): () => void {
  let last: boolean | undefined;
  const check = () => {
    const overflows = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
    if (overflows !== last) {
      last = overflows;
      onChange(overflows);
    }
  };
  const resize = new ResizeObserver(check);
  const observeAll = () => {
    resize.disconnect();
    resize.observe(el);
    for (const child of Array.from(el.children)) resize.observe(child);
  };
  observeAll();
  const children = new MutationObserver(() => { observeAll(); check(); });
  children.observe(el, { childList: true });
  return () => { resize.disconnect(); children.disconnect(); };
}
