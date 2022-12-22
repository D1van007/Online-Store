import { eventedPushState } from "../router/events_history"
import { CartLocalStor } from "../header/cart_local"
import { IProduct } from "../../types"

export class ItemCard{
  $parentSelector:HTMLElement
  id:number
  product:IProduct
  $id:HTMLElement
  $main:HTMLElement
  $addToCartButton:HTMLButtonElement
  $allCartButton: HTMLCollection
  cartLocalStor : CartLocalStor
  cartProductsInLocal:IProduct[] = []

  constructor(id:number, product:IProduct, $selector:HTMLElement){
    this.$parentSelector = $selector
    this.$main = document.getElementById('main')!
    this.id = id
    this.product = product
    this.render()
    this.$id = document.getElementById(this.id.toString())!
    this.$addToCartButton = this.$id.querySelector('.btn_from-to-cart')!
    this.itemEventTracker()
    this.cartProductsInLocal = JSON.parse(window.localStorage.getItem('cart_item') as string)
    this.cartLocalStor = new CartLocalStor()
    this.$allCartButton = document.getElementsByClassName('btn_from-to-cart')!
  }
  render(){
    this.$parentSelector.insertAdjacentHTML('beforeend',renderHTML(this.id,this.product))
  }

  selfPageRender(){
    this.$main.innerHTML = selfPageHTML(this.product)
  }

  itemEventTracker(){
    this.$id.addEventListener('click',(e)=>{
      if (e.target ===this.$addToCartButton && this.$addToCartButton.classList.contains('add-to-cart')){
        this.$addToCartButton.classList.add('remove-from-cart')
        this.$addToCartButton.classList.remove('add-to-cart')
        this.$addToCartButton.textContent = 'Remove cart'
        this.addToLocal()
        this.cartLocalStor.setAddTotalProducts ()
        if (!JSON.parse(localStorage.getItem(`productAmount-id${this.$id.id}`)!)) {
          localStorage.setItem(`productAmount-id${this.$id.id}`, JSON.stringify(1))
        }
      } else if (e.target===this.$addToCartButton && this.$addToCartButton.classList.contains('remove-from-cart')){
        this.$addToCartButton.classList.remove('remove-from-cart')
        this.$addToCartButton.classList.add('add-to-cart')
        this.$addToCartButton.textContent = 'Add cart'
        this.cartLocalStor.removeItemInCart (this.$id)
        localStorage.setItem('totalProducts',JSON.stringify(this.cartLocalStor.getLocalTotalProducts () - JSON.parse(localStorage.getItem(`productAmount-id${this.$id.id}`)!)))
        localStorage.removeItem(`productAmount-id${this.$id.id}`)
        this.cartLocalStor.drawValueCart ()
      }  
      else {
        eventedPushState({},'',`/product${this.id}`)
      }
      this.cartLocalStor.setTotalPrice()
    })
  }

  addToLocal(){
    if(localStorage.getItem('cart_item')){
      this.cartProductsInLocal = this.cartLocalStor.getLocalDataProducts ()
      if(!this.cartProductsInLocal.some(e=>e.id==this.id )){    
        this.cartProductsInLocal.push(this.product)
        localStorage.setItem('cart_item',JSON.stringify(this.cartProductsInLocal))
      }
    }else{
      this.cartProductsInLocal = []
      this.cartProductsInLocal.push(this.product)
      localStorage.setItem('cart_item',JSON.stringify(this.cartProductsInLocal))
    }
  }
}

function renderHTML(id:number,data:IProduct):string{
  let arrLocal = JSON.parse(localStorage.getItem('cart_item')!)
  if (arrLocal && arrLocal.some((e: { id: number })=>e.id==id)){
  return `
  <li class="product__item" id = "${id}" style = "background-image: url(${data.images[0]});">
    <h3 class="product__item__title">${data.title}</h3>
    <div class="product__item__price">${data.price}</div>
    <button id = "btn_cart-${id}" class="remove-from-cart btn_from-to-cart">Remove cart</button>
  </li>
  `
} else {
  return `
  <li class="product__item" id = "${id}" style = "background-image: url(${data.images[0]});">
  <h3 class="product__item__title">${data.title}</h3>
  <div class="product__item__price">${data.price}</div>
  <button id = "btn_cart-${id}" class="add-to-cart btn_from-to-cart">Add cart</button>
</li>
`}
}

function selfPageHTML(data:IProduct){
  return `<h1>NAME:${data.title} ID:${data.id}</h1>`
}