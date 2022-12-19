import { IProduct } from "../../../types";
import { ItemCart } from "./item_cart";
import { SumCart } from "./sum_cart";

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
        // this.renderSumInCart ()
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
    renderSumInCart () {
            let productSum : HTMLElement = document.querySelector('.summary-cart')!
            let sumCart = new SumCart(productSum)

        }

    sumAmountItems () {
        if (JSON.parse(localStorage.getItem(`cart_item`)!).length>0) {
        const amountItemsListArr = Array.from(document.querySelectorAll('.amount_value'))
        const amountItemsListArrValue: number[] = []
        amountItemsListArr.forEach((e:Element) => amountItemsListArrValue.push(Number(e.textContent)))
        const amountSum = amountItemsListArrValue.reduce((sum, e) => {
            return sum + e
        })
        const amountSumItems= document.getElementById('amountSum__items')!
        amountSumItems.textContent = `Products: ${amountSum}`}
    }

    sumAmountPrice () {
        if (JSON.parse(localStorage.getItem(`cart_item`)!).length>0) {
        const amountPriceListArr = Array.from(document.querySelectorAll('.product__item__sum'))
        const amountPriceListArrValue: number[] = []
        amountPriceListArr.forEach((e:Element) => amountPriceListArrValue.push(Number(e.textContent)))
        const amountSum = amountPriceListArrValue.reduce((sum, e) => {
            return sum + e
        })
        const amountSumPrice= document.getElementById('amountSum__price')!
        amountSumPrice.textContent = `Total: € ${amountSum}`
    }}

    renderItemNumb () {
        this.numbList = document.querySelectorAll('.number__item')
        this.numbList.forEach((e, index) => {
            e.textContent = (index + 1).toString()
        })
    }

    clearCart () {
        document.querySelector('.cart_content')!.remove()
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

