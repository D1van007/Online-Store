import { IProduct } from "../../types"
export class ItemCard{
  $parentSelector:HTMLElement
  id:number
  product:IProduct
  $id:HTMLElement
  constructor(id:number, product:IProduct, $selector:HTMLElement){
    this.$parentSelector = $selector
    this.id = id
    this.product = product
    this.render()
    this.$id = document.getElementById(this.id.toString())!
    this.test()
  }
  render(){
    this.$parentSelector.insertAdjacentHTML('beforeend',renderHTML(this.id,this.product))
  }
  test(){
    this.$id.addEventListener('click',()=>{
      console.log(`click ${this.id}`)
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