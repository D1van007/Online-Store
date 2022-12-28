import { DoubleRange } from "../double_range/double_range";
import { IProduct, DataKeys } from "../../types";
import { CheckboxSection } from "./checkbox_section";
import { searchHandler } from "../search_handler/search_handler";

type Callback = (data:IProduct[])=>void

type DataArrays = {
  price?:IProduct[],
  stock?:IProduct[],
  category?:IProduct[],
  brand?:IProduct[],
  search?:IProduct[]
}

export class SideFilter{
  parentDOM: HTMLElement
  priceInput: DoubleRange
  stockInput: DoubleRange
  inputPriceDOM: HTMLElement
  inputStockDOM: HTMLElement
  categoryCheckBoxDOM: HTMLElement
  brandCheckBoxDOM: HTMLElement
  productData: IProduct[]
  arrayOfDataAllFilters: DataArrays = {}
  callback:Callback
  categoryCheck:CheckboxSection
  brandCheck:CheckboxSection
  constructor(selector:string,data:IProduct[],callback:Callback){
    this.parentDOM = document.getElementById(selector)!
    this.render()
    this.inputPriceDOM = this.parentDOM.querySelector('.side-filter__price')!
    this.inputStockDOM = this.parentDOM.querySelector('.side-filter__stock')!
    this.categoryCheckBoxDOM = this.parentDOM.querySelector('.side-filter__category')!
    this.brandCheckBoxDOM = this.parentDOM.querySelector('.side-filter__brand')!
    this.productData = data
    this.callback = callback
    this.priceInput = new DoubleRange(this.inputPriceDOM,{
      min: this.getMinMax(this.productData,DataKeys.price)[0],
      max: this.getMinMax(this.productData,DataKeys.price)[1],
      eventName: 'price'
    })
    this.stockInput = new DoubleRange(this.inputStockDOM,{
      min: this.getMinMax(this.productData,DataKeys.stock)[0],
      max: this.getMinMax(this.productData,DataKeys.stock)[1],
      eventName: 'stock'
    })
    this.addDoubleRangeTracker()
    this.categoryCheck = new CheckboxSection(this.categoryCheckBoxDOM,this.productData,this,DataKeys.category)
    this.brandCheck = new CheckboxSection(this.brandCheckBoxDOM,this.productData,this,DataKeys.brand)
  }
  render(){
    this.parentDOM.insertAdjacentHTML('afterbegin',getHTML())
  }
  getMinMax(data:IProduct[],key:DataKeys):number[]{
     if(data.length == 0){
      return [0,0]
     }
    let max = data.reduce((acc,e)=>{
      return acc<e[key]?e[key]:acc
    },data[0][key])
    let min = data.reduce((acc,e)=>{
      return acc<e[key]?acc:e[key]
    },data[0][key])
    return [min as number,max as number]
  }
  addDoubleRangeTracker(){
    window.addEventListener('price',this.priceEventHandler)
    window.addEventListener('stock',this.stockEventHandler)
  }
  priceEventHandler = (e:any)=>{
    if(!e.detail.isFake){
      searchHandler.addParams(DataKeys.price, e.detail.result) //тестим
      if(e.detail.result[0]==this.priceInput.default[0]&&e.detail.result[1]==this.priceInput.default[1]){
        searchHandler.deleteParams(DataKeys.price)
      }
    }
    let data = this.getKeyFilterData(DataKeys.price,e.detail.result[0],e.detail.result[1])
    this.arrayOfDataAllFilters.price = data
    this.updateCheckBoxSections()
    this.callback(this.getFilteredData())
  }
  stockEventHandler = (e:any)=>{
    if(!e.detail.isFake){
      searchHandler.addParams(DataKeys.stock, e.detail.result)
      if(e.detail.result[0]==this.stockInput.default[0]&&e.detail.result[1]==this.stockInput.default[1]){
        searchHandler.deleteParams(DataKeys.stock)
      }
    }
    let data = this.getKeyFilterData(DataKeys.stock,e.detail.result[0],e.detail.result[1])
    this.arrayOfDataAllFilters.stock = data
    this.updateCheckBoxSections()
    this.callback(this.getFilteredData())
  }
  updateCheckBoxSections(){
    this.categoryCheck.updateList()
    this.brandCheck.updateList()
  }
  updatePriceAndStockRange(){
    let priceMinMax = this.getMinMax(this.getFilteredData(),DataKeys.price)
    let stockMinMax = this.getMinMax(this.getFilteredData(),DataKeys.stock)
    this.priceInput.setRangeValue(priceMinMax[0],priceMinMax[1])
    this.stockInput.setRangeValue(stockMinMax[0],stockMinMax[1])
  }
  testRemove(){
    window.removeEventListener('price',this.priceEventHandler)
    window.removeEventListener('stock',this.stockEventHandler)
  }
  getKeyFilterData(key:DataKeys,min:number,max:number):IProduct[]{
    return this.productData.filter(e=>e[key]>=min&&e[key]<=max)
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
    <div class="side-filter__brand"></div>
    <div class="side-filter__price"></div>
    <div class="side-filter__stock"></div>
  </div>
  `
}