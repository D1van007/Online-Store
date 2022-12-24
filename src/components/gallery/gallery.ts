import { IDataProducts,IProduct } from "../../types";
import { ItemCard } from "./item_card";
import './gallery.css'

export class Gallery{
  data: IProduct[]
  $parentId: HTMLElement
  $id: HTMLElement|null
  $productList
  productsArr:ItemCard[]=[]
  //isBigCard:boolean
  constructor(selector:string, data:IProduct[]){
    this.$parentId = document.getElementById(selector)!
    this.$id = null
    this.data = data
    this.$productList =  this.render()
    this.renderProducts()
  }
  render():HTMLUListElement{
    this.$id = document.createElement('div')
    this.$id.classList.add('gallery')
    this.$parentId.insertAdjacentElement('beforeend',this.$id)
    let productList = document.createElement('ul')
    productList.classList.add('product_list')
    this.$id.insertAdjacentElement('beforeend',productList)
    return productList
  }
  renderProducts(){
    if(this.data.length>0){
      this.data.forEach(e=>{
        let card = new ItemCard(e.id,e,this.$productList)
        this.productsArr.push(card)
      })
    }
  }
  destroy(){
    if(this.$id)
    this.$parentId.removeChild(this.$id)
  }
}
