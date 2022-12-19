import { IProduct } from "../../pages/cart/types";
import { ItemCart } from "./item_cart";

export class Cart {
    main : HTMLElement
    cartContent : HTMLElement | null
    data : IProduct[]
    productList : HTMLUListElement
    numbList : NodeList
    constructor (selector: string) {
        this.main = document.querySelector(selector)!
        this.cartContent = null
        // this.creatCartContent ()
        this.data = this.getLocalArr ()
        // this.render()
        this.productList = this.main.querySelector('.shopping-cart_list')!
        this.numbList = document.querySelectorAll('.number__item')
        // this.renderItemInCart ()
    }
    creatCartContent () {
        this.cartContent = document.createElement('div');
        this.cartContent.classList.add('cart_content')
        this.main.prepend(this.cartContent)
    }
    getLocalArr () {
        return JSON.parse(localStorage.getItem('cart_item')!);
    }
    render () {
        if(this.cartContent)
        this.cartContent.innerHTML = createHTMLParents ()
    }
    renderItemInCart () {
        this.data.forEach((e, index) => {
            if (!JSON.parse(localStorage.getItem(`id${e.id}-amount`)!))
            {localStorage.setItem(`id${e.id}-amount`, JSON.stringify(1))}
            let itemCart = new ItemCart(e, this.productList, index )

        })
    }
    renderItemNumb () {
        this.numbList = document.querySelectorAll('.number__item')
        this.numbList.forEach((e, index) => {
            console.log(this.numbList)
            e.textContent = (index + 1).toString()
        })
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

