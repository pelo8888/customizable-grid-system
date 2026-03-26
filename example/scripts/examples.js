const breakpointCard = document.querySelector('[data-breakpoint]');
const widthTarget = document.querySelector('[data-viewport-width]');
const stateTarget = document.querySelector('[data-breakpoint-state]');
const copyButtons = document.querySelectorAll('[data-copy-button]');
const copyAnnouncer = document.querySelector('[data-copy-announcer]');

function updateViewportState() {
  if (!breakpointCard || !widthTarget || !stateTarget) {
    return;
  }

  const breakpoint = Number(breakpointCard.getAttribute('data-breakpoint'));
  const width = window.innerWidth;
  const isBelowBreakpoint = width <= breakpoint;

  widthTarget.textContent = `${width}px`;
  stateTarget.textContent = isBelowBreakpoint
    ? `At or below ${breakpoint}px: helper classes are active.`
    : `Above ${breakpoint}px: desktop fractions are active.`;
}

async function copySnippet(button) {
  const snippet = button.parentElement?.querySelector('code');

  if (!snippet) {
    return;
  }

  try {
    await navigator.clipboard.writeText(snippet.textContent ?? '');
    button.textContent = 'Copied';
    button.setAttribute('data-copy-state', 'copied');
    if (copyAnnouncer) {
      copyAnnouncer.textContent = 'Snippet copied to clipboard.';
    }
  } catch {
    button.textContent = 'Copy failed';
    button.setAttribute('data-copy-state', 'error');
    if (copyAnnouncer) {
      copyAnnouncer.textContent = 'Copy failed. Clipboard access was not available.';
    }
  }

  window.setTimeout(() => {
    button.textContent = 'Copy';
    button.removeAttribute('data-copy-state');
  }, 1400);
}

window.addEventListener('resize', updateViewportState);
updateViewportState();

copyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    copySnippet(button);
  });
});
