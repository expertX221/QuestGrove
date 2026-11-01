export const asset = (path) => window.GROVE_ASSETS?.[path] || path;
export const offlineHref = () =>
  window.GROVE_ASSETS ? location.href.split("#")[0] : "./Quest-Grove.html";
