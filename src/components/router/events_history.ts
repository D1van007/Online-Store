export function eventedPushState(state:any, title:string, url:string) {
  const pushChangeEvent = new CustomEvent("onpushstate", {
      detail: {
          state,
          title,
          url
      }
  });
  window.dispatchEvent(pushChangeEvent);
  return history.pushState(state, title, url);
}
