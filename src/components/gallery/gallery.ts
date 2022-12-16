import { IDataProducts,IProduct } from "../../types";
import { ItemCard } from "./item_card";
import './gallery.css'

export class Gallery{
  data: IProduct[]
  $id: HTMLElement
  $productList
  productsArr:ItemCard[]=[]
  //isBigCard:boolean
  constructor(selector:string, data:IProduct[]){
    this.$id = document.getElementById(selector)!
    //this.isBigCard = isBigCard
    this.data = data
    this.$productList =  this.render()
    this.renderProducts()
  }
  render():HTMLUListElement{
    let productList = document.createElement('ul')
    productList.classList.add('product__list')
    this.$id.insertAdjacentElement('beforeend',productList)
    return productList
  }
  renderProducts(){
    if(this.data.length>0){
      this.data.forEach(e=>{
        console.log('test')
        let card = new ItemCard(e.id,e,this.$productList)
        this.productsArr.push(card)
      })
    }
  }
  destroy(){
    this.$id.removeChild(this.$productList)
  }
}
