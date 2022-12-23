import { IProduct } from "../../types";
import { ItemCard } from "./item_card";

export class Catalog{
  data: IProduct[]
  parentDOM: HTMLElement
  catalogContainerDOM: HTMLElement|null
  productListDOM
  productsArr:ItemCard[]=[]
  //isBigCard:boolean
  constructor(selector:string, data:IProduct[]){
    this.parentDOM = document.getElementById(selector)!
    this.catalogContainerDOM = null
    this.data = data
    this.productListDOM =  this.createContainers()
    this.renderProducts()
  }
  createContainers():HTMLUListElement{
    this.catalogContainerDOM = document.createElement('div')
    this.catalogContainerDOM.classList.add('catalog')
    console.log(this.parentDOM)
    this.parentDOM.insertAdjacentElement('beforeend',this.catalogContainerDOM)
    let productList = document.createElement('ul')
    productList.classList.add('product__list')
    this.catalogContainerDOM.insertAdjacentElement('beforeend',productList)
    return productList
  }
  renderProducts(){
    if(this.data.length>0){
      this.data.forEach(e=>{
        let card = new ItemCard(e.id,e,this.productListDOM)
        this.productsArr.push(card)
      })
    }
  }
  destroy(){
    if(this.catalogContainerDOM)
    this.parentDOM.removeChild(this.catalogContainerDOM)
  }
}
