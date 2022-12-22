import { DubleRange } from "../duble_range/duble_range";
import { IProduct, DataKeys } from "../../types";
import { CheckboxSection } from "./checkbox_section";

type Callback = (data:IProduct[])=>void

type DataArrays = {
  price?:IProduct[],
  stock?:IProduct[],
  category?:IProduct[],
  brand?:IProduct[]
}

export class SideFilter{
  $parentID: HTMLElement
  priceInput: DubleRange
  stockInput: DubleRange
  $iputPriceContainer: HTMLElement
  $iputStockContainer: HTMLElement
  $categoryContainer: HTMLElement
  productArr: IProduct[]
  arrayOfDataAllFilters: DataArrays = {}
  callback:Callback
  main:any //test
  categoryCheck:CheckboxSection
  constructor(selector:string,data:IProduct[],callback:Callback,main:any){
    this.main = main //test
    this.$parentID = document.getElementById(selector)!
    this.render()
    this.$iputPriceContainer = this.$parentID.querySelector('.side-filter__price')!
    this.$iputStockContainer = this.$parentID.querySelector('.side-filter__stock')!
    this.$categoryContainer = this.$parentID.querySelector('.side-filter__category')!
    this.productArr = data
    this.callback = callback
    this.priceInput = new DubleRange(this.$iputPriceContainer,{
      min: this.getMinMax(DataKeys.price)[0],
      max: this.getMinMax(DataKeys.price)[1],
      eventName: 'price'
    })
    this.stockInput = new DubleRange(this.$iputStockContainer,{
      min: this.getMinMax(DataKeys.stock)[0],
      max: this.getMinMax(DataKeys.stock)[1],
      eventName: 'stock'
    })
    this.addDubleRangeTracker()
    this.categoryCheck = new CheckboxSection(this.$categoryContainer,this.productArr,this,DataKeys.category)
  }
  render(){
    this.$parentID.insertAdjacentHTML('afterbegin',getHTML())
  }
  getMinMax(key:DataKeys):number[]{
    let max = this.productArr.reduce((acc,e)=>{
      return acc<e[key]?e[key]:acc
    },this.productArr[0][key])
    let min = this.productArr.reduce((acc,e)=>{
      return acc<e[key]?acc:e[key]
    },this.productArr[0][key])
    console.log([min,max])
    return [min as number,max as number]
  }
  addDubleRangeTracker(){
    window.addEventListener('price',this.priceEventHandler)
    window.addEventListener('stock',this.stockEventHandler)
  }
  priceEventHandler = (e:any)=>{
    let data = this.getKeyFilterData(DataKeys.price,e.detail.result[0],e.detail.result[1])
    this.arrayOfDataAllFilters.price = data
    this.updateCheckBoxSections()
    this.callback(this.getFilteredData())
  }
  stockEventHandler = (e:any)=>{
    let data = this.getKeyFilterData(DataKeys.stock,e.detail.result[0],e.detail.result[1])
    this.arrayOfDataAllFilters.stock = data
    this.updateCheckBoxSections()
    this.callback(this.getFilteredData())
  }
  updateCheckBoxSections(){
    this.categoryCheck.pushFilteredData()
    this.categoryCheck.updateList()
  }
  testRemove(){
    window.removeEventListener('price',this.priceEventHandler)
    window.removeEventListener('stock',this.stockEventHandler)
    console.log('remove window event')
  }
  getKeyFilterData(key:DataKeys,min:number,max:number):IProduct[]{
    return this.productArr.filter(e=>e[key]>min&&e[key]<max)
  }
  getFilteredData():IProduct[]{ // моя гордость))
    let map =  Object.values(this.arrayOfDataAllFilters).flat(1).reduce((acc,e)=>{
      if(acc.has(e)){
        let current = acc.get(e) as number
        acc.set(e, current+1)
      }else{
        acc.set(e,1)
      }
      return acc
    },new Map<IProduct,number>)
    map.forEach((value,key)=>{
      if(value<Object.values(this.arrayOfDataAllFilters).length){
        map.delete(key)
      }
    })
    let arr = Array.from(map.keys())
    return arr
  }
}

function getHTML(){
  return `
  <div class="side-filter">
    <div class="side-filter__category"></div>
    <div class="side-filter__price"></div>
    <div class="side-filter__stock"></div>
  </div>
  `
}