import { IProduct } from "../../../types";
import { ProductInCart } from "./productCart";
import { TotalBuy } from "./totalBuyCart";
import { LocalCart } from "./localCart";

export class Cart {
    parentConteiner: HTMLElement
    cartConteiner: HTMLElement | null
    productInCart: IProduct[]
    localCart: LocalCart
    constructor(selector: string) {
        this.parentConteiner = document.querySelector(selector)!
        this.cartConteiner = null
        this.localCart = new LocalCart()
        this.productInCart = this.localCart.getLocalCartProducts()
        this.renderCartContent()
    }

    renderCartContent() {
        if (JSON.parse(localStorage.getItem('products_inCart')!) && JSON.parse(localStorage.getItem('products_inCart')!).length > 0) {
            this.cartConteiner = document.createElement('div');
            this.cartConteiner.classList.add('cart_conteiner')
            this.parentConteiner.prepend(this.cartConteiner)
            this.cartConteiner.innerHTML = createHTMLConteiner()
            this.renderCartProductList()
            this.renderCartTotalBuy()
        }
    }
    renderCartProductList() {
        let productListDOM: HTMLUListElement = document.querySelector('.products-cart_list')!
        this.productInCart.forEach((e, index) => {
            if (!JSON.parse(localStorage.getItem(`productAmount-id${e.id}`)!)) { localStorage.setItem(`productAmount-id${e.id}`, JSON.stringify(1)) }
            let itemCart = new ProductInCart(e, productListDOM, index)
        })
    }
    renderCartTotalBuy() {
        let productsTotalBuy: HTMLElement = document.querySelector('.total-cart_content')!
        let totalBuy = new TotalBuy(productsTotalBuy)
    }
}
function createHTMLConteiner() {
    return ` 
    <div class="products-cart_content">
        <ul class="products-cart_list">
        </ul>
    </div>
    <div class="total-cart_content"></div>`
}

