import { eventedPushState } from "../router/events_history"

export class CopyClearURL{
  parentDOM!:HTMLElement
  copyBtnDOM!:HTMLElement
  clearBtnDOM!:HTMLElement
  constructor(selector:HTMLElement){
    this.parentDOM = selector
    this.render()
    this.createEventHandlers()

  }
  render(){
    this.parentDOM.insertAdjacentHTML('afterbegin',getHTML())
    this.copyBtnDOM = this.parentDOM.querySelector('.copy-btn')!
    this.clearBtnDOM = this.parentDOM.querySelector('.clear-btn')!
  }
  createEventHandlers(){
    this.clearBtnDOM.addEventListener('click',()=>{
      eventedPushState({}, '', '/');
    })
    this.copyBtnDOM.addEventListener('click',()=>{
      navigator.clipboard.writeText(`${window.location.href}`)
    })
  }
}

function getHTML():string{
  return `
    <div class="copy-clear">
      <button class="copy-btn">CopyURL</button>
      <button class="clear-btn">ClearURL</button>
    </div>
  `
}
