import { IProduct,DataKeys } from "../../types";
import { SideFilter } from "./side_filter";


export class CheckboxSection{
  data:IProduct[]
  $container:HTMLElement
  $ulList:HTMLUListElement
  parent:SideFilter
  keyName:DataKeys
  $listArr:NodeListOf<HTMLElement>
  constructor(selector:HTMLElement,data:IProduct[],parent:SideFilter,keyName:DataKeys){
    this.$container = selector
    this.data = data
    this.parent = parent
    this.keyName = keyName
    this.$ulList = this.createAndReturnUl()
    this.renderItems()
    this.$listArr = this.$ulList.querySelectorAll('.checkbox-list__item')
    this.checkboxEventTracker()
  }
  createAndReturnUl():HTMLUListElement{
    let ul = document.createElement('ul')
    ul.classList.add('checkbox-list')
    this.$container.insertAdjacentElement('beforeend',ul)
    return ul
  }
  renderItems(){
    this.getMapByKey(this.data).forEach((value,key)=>{
      this.$ulList.insertAdjacentHTML('beforeend',itemHTML(key,this.getRandomId(),value.length))
    })
  }
  getRandomId(){
    return Math.round(Math.random()*Date.now())
  }
  checkboxEventTracker(){
    this.$ulList.addEventListener('click',(e)=>{
      if(e.target instanceof HTMLInputElement){
        this.pushFilteredData()
        this.parent.updateCheckBoxSections()
        this.parent.updatePriceAndStockRange()
      }
    })
  }
  pushFilteredData(){
    let data = Array.from(this.data)
    let resultData:IProduct[] = []
    let isAnyCheck:boolean = false
    this.$listArr.forEach(e=>{
      let input = e.firstElementChild as HTMLInputElement
      if(input.checked){
        let current = data.filter(e=>e[this.keyName]==input.name)
        resultData.push(...current)
        isAnyCheck = true
      }
    })
    if(isAnyCheck){
      this.parent.arrayOfDataAllFilters[this.keyName] = resultData
    }else{
      this.parent.arrayOfDataAllFilters[this.keyName] = data
    }
    this.parent.callback(this.parent.getFilteredData())
  }
  updateList(){
    let currentData = this.getMapByKey(this.parent.getFilteredData())
    this.$listArr.forEach(e=>{
      let input = e.firstElementChild as HTMLInputElement
      if(currentData.has(input.value)){
        e.children[2].textContent = (currentData.get(input.value) as IProduct[]).length.toString()+' /'
        e.style.cssText = `opacity: 1; pointer-events: auto;`
      }else{
        e.children[2].textContent = '0 /'
        e.style.cssText = `opacity: .5; pointer-events: none;`
        //input.checked = false
      }
    })
  }
  getMapByKey(data:IProduct[]):Map<string|number, IProduct[]>{
    let map = data.reduce((acc,e)=>{
      let current:IProduct[]|undefined = []
      if(acc.has(e[this.keyName])){
        current = acc.get(e[this.keyName])
        current?.push(e)
      }else{
        current.push(e)
      }
      return acc.set(e[this.keyName],current as IProduct[])
    },new Map<string|number,IProduct[]>)
    return map
  }
}

function itemHTML(key:string|number,id:number,total:number):string{
  return `
  <li class="checkbox-list__item">
    <input type="checkbox" id="${id}" name="${key}" value="${key}">
    <label for="${id}"> ${key} </label>
    <span class="current">${total} /</span>
    <span class="total">${total}</span>
  </li>
  `
}