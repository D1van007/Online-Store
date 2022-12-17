import { eventedPushState } from "../router/events_history"

import { IProduct } from "../../types"
export class ItemCard{
  $parentSelector:HTMLElement
  id:number
  product:IProduct
  $id:HTMLElement
  $main:HTMLElement
  constructor(id:number, product:IProduct, $selector:HTMLElement){
    this.$parentSelector = $selector
    this.$main = document.getElementById('main')!
    this.id = id
    this.product = product
    this.render()
    this.$id = document.getElementById(this.id.toString())!
    this.test()
  }
  render(){
    this.$parentSelector.insertAdjacentHTML('beforeend',renderHTML(this.id,this.product))
  }
  selfPageRender(){
    this.$main.innerHTML = selfPageHTML(this.product)
  }
  test(){
    this.$id.addEventListener('click',()=>{
      eventedPushState({},'',`/product${this.id}`)
    })
  }
}

function renderHTML(id:number,data:IProduct):string{
  return `
  <li class="product__item" id = "${id}" style = "background-image: url(${data.images[0]});">
    <h3 class="product__item__title">${data.title}</h3>
    <div class="product__item__price">${data.price}</div>
  </li>
  `
}

function selfPageHTML(data:IProduct){
  return `<h1>NAME:${data.title} ID:${data.id}</h1>`
}