export const addHoverHighlight = () => {
  document.body.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    target.style.outline = '2px solid blue'; // Highlight element on hover
  });

  document.body.addEventListener('mouseout', (event) => {
    const target = event.target as HTMLElement;
    target.style.outline = ''; // Remove highlight on hover out
  });
};