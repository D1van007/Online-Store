import './duble_range.css'

type DubleRangeOptions = {
  min:number,
  max:number,
  eventName:string
}

export class DubleRange{
  $parent:HTMLElement
  options: DubleRangeOptions
  $container:HTMLElement
  $firstInput:HTMLInputElement
  $secondInput:HTMLInputElement
  constructor(selector:HTMLElement,options:DubleRangeOptions){
    this.$parent = selector
    this.options = options
    this.render()
    this.$container = this.$parent.querySelector('.duble-range')!
    this.$firstInput = this.$container.querySelector('.duble-range__i1')!
    this.$secondInput = this.$container.querySelector('.duble-range__i2')!
    this.drEventsTracker()
  }
  render(){
    this.$parent.innerHTML = getdubleRangeHTML(this.options)
  }
  drEventsTracker(){
    this.$firstInput.addEventListener('input',()=>{
      this.customEvent()
    })
    this.$secondInput.addEventListener('input',()=>{
      this.customEvent()
    })
  }
  customEvent(){
    let dubleevent = new CustomEvent(this.options.eventName,{
      detail: {
          result: [+this.$firstInput.value,+this.$secondInput.value].sort((a,b)=>a-b)
      }
    })
    window.dispatchEvent(dubleevent)
    this.setBackgroundGradient()
  }
  setBackgroundGradient(){
    let minMaxArr = [this.getPercent(this.$firstInput),this.getPercent(this.$secondInput)].sort((a,b)=>a-b)
    this.$firstInput.style.background = `linear-gradient(90deg, rgb(119, 157, 179) ${minMaxArr[0]}%, rgb(174, 175, 85) ${minMaxArr[0]}%, 
    rgb(174, 175, 85) ${minMaxArr[1]}%, rgb(119, 157, 179) ${minMaxArr[1]}%)`
  }
  getPercent(elem:HTMLInputElement):number{
    return Number(elem.value)/Number(elem.max)*100
  }
  setRangeValue(min:number,max:number){
    this.$firstInput.value = min.toString()
    this.$secondInput.value = max.toString()
    this.customEvent()
  }
}

function getdubleRangeHTML(options:DubleRangeOptions):string{
  return `
  <div class="duble-range">
    <input class="duble-range__input duble-range__i1" type="range" min="${options.min}" max="${options.max}" step="${options.max/20}" value="${options.min}">
    <input class="duble-range__input duble-range__i2" type="range" min="${options.min}" max="${options.max}" step="${options.max/20}" value="${options.max}">
    <div class="duble-range__info">
      <span class="info__left">L</span>
      <span class="info__right">R</span>
    </div>
  </div>
  `
}