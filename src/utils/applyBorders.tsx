export const applyBorders = (element: HTMLElement, depth: number) => {
  const elements: HTMLElement[] = [];

  const traverse = (el: HTMLElement, currentDepth: number) => {
    if (currentDepth > depth) return;
    elements.push(el);
    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child, currentDepth + 1);
      }
    });
  };

  traverse(element, 0);

  elements.forEach((el) => {
    el.style.outline = '2px solid red'; // Customize this as needed
  });
};