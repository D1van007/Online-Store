import { IProduct } from "../../../types";
import { ItemCart } from "./item_cart";
import { SumCart } from "./sum_cart";
import { CartLocalStor } from "../../header/cart_local";

export class Cart {
    main : HTMLElement
    cartContent : HTMLElement | null
    dataProducts : IProduct[]
    productList : HTMLUListElement
    numbList : NodeList
    cartLocalStor: CartLocalStor
    constructor (selector: string) {
        this.main = document.querySelector(selector)!
        this.cartContent = null
        // this.creatCartContent ()
        this.cartLocalStor = new CartLocalStor
        this.dataProducts = this.cartLocalStor.getLocalDataProducts()
        // this.render()
        this.productList = this.main.querySelector('.shopping-cart_list')!
        this.numbList = document.querySelectorAll('.number__item')
        this.cartLocalStor = new CartLocalStor
        // this.renderSumInCart ()
        // this.renderItemInCart ()
    }
    creatCartContent () {
        this.cartContent = document.createElement('div');
        this.cartContent.classList.add('cart_content')
        this.main.prepend(this.cartContent)
    }
    render () {
        if(this.cartContent)
        this.cartContent.innerHTML = createHTMLParents ()
    }
    renderItemInCart () {
        if (JSON.parse(localStorage.getItem('cart_item')!)){
        this.dataProducts.forEach((e, index) => {
            if (!JSON.parse(localStorage.getItem(`productAmount-id${e.id}`)!))
            {localStorage.setItem(`productAmount-id${e.id}`, JSON.stringify(1))}
            let itemCart = new ItemCart(e, this.productList, index )
        })}
    }
    renderSumInCart () {
            let productSum : HTMLElement = document.querySelector('.summary-cart')!
            let sumCart = new SumCart(productSum)
        }

    totalProducts () {
        if (JSON.parse(localStorage.getItem('cart_item')!)){
        if (JSON.parse(localStorage.getItem(`cart_item`)!).length>0) {
        const amountItemsListArr = Array.from(document.querySelectorAll('.amount_value'))
        const amountItemsListArrValue: number[] = []
        amountItemsListArr.forEach((e:Element) => amountItemsListArrValue.push(Number(e.textContent)))
        const amountSum = amountItemsListArrValue.reduce((sum, e) => {
            return sum + e
        })
        localStorage.setItem('totalProducts', JSON.stringify(amountSum))
        const amountSumItems= document.getElementById('amountSum__items')!
        amountSumItems.textContent = `Products: ${amountSum}`}
    }
    }



    renderItemNumb () {
        this.numbList = document.querySelectorAll('.number__item')
        this.numbList.forEach((e, index) => {
            e.textContent = (index + 1).toString()
        })
    }

    clearCart () {
        document.querySelector('.cart_content')!.remove()
        localStorage.setItem('totalProducts',JSON.stringify(0))
    }

}
function createHTMLParents() {
 return ` 
    <div class="shopping-cart">
        <ul class="shopping-cart_list">
        </ul>
    </div>
    <div class="summary-cart"></div>`
}

