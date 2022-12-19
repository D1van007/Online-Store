import { App } from "./components/app/app";
import "../node_modules/@icon/foundation-icons/foundation-icons.css";
import { eventedPushState } from "./components/router/events_history";

const app = new App()

document.querySelector('.main-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/')
})
document.querySelector('.cart-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/cart')
})

let url = new URL(window.location.href)

