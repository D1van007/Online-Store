import { eventedPushState } from "../router/events_history"

import { IProduct } from "../../types"
export class ItemCard{
  $parentSelector:HTMLElement
  id:number
  product:IProduct
  $id:HTMLElement
  $main:HTMLElement
  $addToCartButton:HTMLButtonElement
  constructor(id:number, product:IProduct, $selector:HTMLElement){
    this.$parentSelector = $selector
    this.$main = document.getElementById('main')!
    this.id = id
    this.product = product
    this.render()
    this.$id = document.getElementById(this.id.toString())!
    this.$addToCartButton = this.$id.querySelector('.add-to-cart')!
    this.itemEventTracker()
  }
  render(){
    this.$parentSelector.insertAdjacentHTML('beforeend',renderHTML(this.id,this.product))
  }
  selfPageRender(){
    this.$main.innerHTML = selfPageHTML(this.product)
  }
  itemEventTracker(){
    this.$id.addEventListener('click',(e)=>{
      if(e.target==this.$addToCartButton){
        this.addToLocal()
      }else{
        eventedPushState({},'',`/product${this.id}`)
      }
    })
  }
  addToLocal(){
    let dataInLocal:IProduct[] = []
    if(window.localStorage.getItem('cart_item')){
      dataInLocal = JSON.parse(window.localStorage.getItem('cart_item') as string)
      if(!dataInLocal.some(e=>e.id==this.id)){
        dataInLocal.push(this.product)
        window.localStorage.setItem('cart_item',JSON.stringify(dataInLocal))
      }
    }else{
      dataInLocal.push(this.product)
      window.localStorage.setItem('cart_item',JSON.stringify(dataInLocal))
    }
  }
}

function renderHTML(id:number,data:IProduct):string{
  return `
  <li class="product__item" id = "${id}" style = "background-image: url(${data.images[0]});">
    <h3 class="product__item__title">${data.title}</h3>
    <div class="product__item__price">$${data.price}</div>
    <div class="product__item__price">/q${data.stock}</div>
    <button class="add-to-cart">Add cart</button>
  </li>
  `
}

function selfPageHTML(data:IProduct){
  return `<h1>NAME:${data.title} ID:${data.id}</h1>`
}