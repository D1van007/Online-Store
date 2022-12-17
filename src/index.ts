import { App } from "./components/app/app";
import "../node_modules/@icon/foundation-icons/foundation-icons.css";
import { eventedPushState } from "./components/router/events_history";

const app = new App()

/*
const params = new URLSearchParams(window.location.href)
params.set('i','test')
console.log(params.toString())
console.log(window.location.href)
let url = new URL(window.location.href)
console.log(url)
url.searchParams.append('h','test')
window.history.pushState({},'',url.search)
//window.location.search = params.toString()*/
//window.location.hash = '/cart'
document.querySelector('.main-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/')
})
document.querySelector('.cart-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/cart')
})

let url = new URL(window.location.href)
console.log(url)

