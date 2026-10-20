export const MOTION_KEY = "bluehouse:motion";

/** Inline script for <head>: sets <html data-motion> before React hydrates. */
export const motionBootScript = `(function(){try{var p=localStorage.getItem('${MOTION_KEY}');var os=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var r=p==='simple'||(p!=='full'&&os);document.documentElement.dataset.motion=r?'reduced':'full';}catch(e){}})();`;
