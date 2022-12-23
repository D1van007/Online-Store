import { App } from "./components/app/app";
import "../node_modules/@icon/foundation-icons/foundation-icons.css";
import { eventedPushState } from "./components/router/events_history";
import { DubleRange } from "./components/duble_range/duble_range";

const app = new App()

document.querySelector('.main-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/')
})
document.querySelector('.cart-link')?.addEventListener('click',(e:Event)=>{
  e.preventDefault()
  eventedPushState({},'','/cart')
})


