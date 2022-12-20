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

let $testRange:HTMLElement  = document.querySelector('.test_range')!
const drange = new DubleRange($testRange,{
  max: 100,
  min: 0,
  eventName: 'testevent'
})
setTimeout(()=>{
  drange.setRangeValue(40,80)
},3000)
window.addEventListener('testevent',(e:any)=>{
  console.log(e.detail.result)
})
