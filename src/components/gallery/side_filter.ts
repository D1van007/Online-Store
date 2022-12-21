import { DubleRange } from "../duble_range/duble_range";
import { IProduct } from "../../types";

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
  productArr: IProduct[]
  arrayOfDataAllFilters: DataArrays = {}
  callback:Callback
  main:any //test
  constructor(selector:string,data:IProduct[],callback:Callback,main:any){
    this.main = main //test
    this.$parentID = document.getElementById(selector)!
    this.render()
    this.$iputPriceContainer = this.$parentID.querySelector('.side-filter__price')!
    this.$iputStockContainer = this.$parentID.querySelector('.side-filter__stock')!
    this.productArr = data
    this.callback = callback
    this.priceInput = new DubleRange(this.$iputPriceContainer,{
      min: this.getMinMaxPrice()[0],
      max: this.getMinMaxPrice()[1],
      eventName: 'price'
    })
    this.stockInput = new DubleRange(this.$iputStockContainer,{
      min: this.getMinMaxStock()[0],
      max: this.getMinMaxStock()[1],
      eventName: 'stock'
    })
    this.addDubleRangeTracker()
  }
  render(){
    this.$parentID.insertAdjacentHTML('afterbegin',getHTML())
  }
  getMinMaxPrice():number[]{
    let max = this.productArr.reduce((acc,e)=>{
      return acc<e.price?e.price:acc
    },this.productArr[0].price)
    let min = this.productArr.reduce((acc,e)=>{
      return acc<e.price?acc:e.price
    },this.productArr[0].price)
    console.log([min,max])
    return [min,max]
  }
  getMinMaxStock():number[]{
    let max = this.productArr.reduce((acc,e)=>{
      return acc<e.stock?e.stock:acc
    },this.productArr[0].stock)
    let min = this.productArr.reduce((acc,e)=>{
      return acc<e.stock?acc:e.stock
    },this.productArr[0].stock)
    console.log([min,max])
    return [min,max]
  }
  addDubleRangeTracker(){
    window.addEventListener('price',this.priceEventHandler)
    window.addEventListener('stock',this.stockEventHandler)
  }
  priceEventHandler = (e:any)=>{
    let data = this.getPriceFilerData(e.detail.result[0],e.detail.result[1])
    this.arrayOfDataAllFilters.price = data
    //console.log(this.getFilteredData())
    this.callback(this.getFilteredData())
  }
  stockEventHandler = (e:any)=>{
    let data = this.getStockFilerData(e.detail.result[0],e.detail.result[1])
    this.arrayOfDataAllFilters.stock = data
    this.callback(this.getFilteredData())
  }
  testRemove(){
    window.removeEventListener('price',this.priceEventHandler)
    window.removeEventListener('stock',this.stockEventHandler)
    console.log('remove window event')
  }
  getPriceFilerData(min:number,max:number):IProduct[]{
    //console.log(this.main)
    return this.productArr.filter(e=>e.price>min&&e.price<max)
  }
  getStockFilerData(min:number,max:number):IProduct[]{
    //console.log(this.main)
    return this.productArr.filter(e=>e.stock>min&&e.stock<max)
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
    <div class="side-filter__price"></div>
    <div class="side-filter__stock"></div>
  </div>
  `
}