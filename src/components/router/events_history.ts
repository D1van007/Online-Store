export function eventedPushState(state:any, title:string, url:string) {
  var pushChangeEvent = new CustomEvent("onpushstate", {
      detail: {
          state,
          title,
          url
      }
  });
  document.dispatchEvent(pushChangeEvent);
  return history.pushState(state, title, url);
}

document.querySelector('.cart-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/cart')
})

document.addEventListener('onpushstate', function (event) {
	console.log('state')
  let url = new URL(window.location.href)
  console.log(url)
});

window.addEventListener('popstate', function (event) {
	console.log('state_pop')
  let url = new URL(window.location.href)
  console.log(url)
});