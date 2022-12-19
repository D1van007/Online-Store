import { IProduct } from "../../pages/cart/types";
import { Cart } from "./cart";

export class ItemCart {
    dataItem : IProduct
    selectorList: HTMLUListElement
    productItemID : HTMLElement
    amountContent : HTMLElement
    amountValue : HTMLElement
    productItemSum : HTMLElement
    value : number
    index: number
    cart : Cart
    constructor(dataItem : IProduct, selectorList: HTMLUListElement, index: number) {
        this.dataItem = dataItem
        this.index = index
        this.selectorList = selectorList
        this.value = JSON.parse(localStorage.getItem(`id${dataItem.id}-amount`)!)
        this.render () 
        this.productItemID = document.getElementById(this.dataItem.id.toString())!
        this.amountContent = document.getElementById(`amount_content${dataItem.id}`)!
        this.amountValue = document.getElementById(`amount_value${dataItem.id}`)!
        this.productItemSum = document.getElementById(`product__item__sum${dataItem.id}`)!
        this.test()
        this.changeAmount()
        this.cart = new Cart('main')
    }
    render () {
        this.selectorList.insertAdjacentHTML("beforeend", createHTMLItem(this.dataItem,this.index, this.value))
    }

    test () {
        this.productItemID.addEventListener('click', () => console.log(this.productItemID))
    }

    changeAmount () {
        this.amountContent.addEventListener('click', (event) => {
            console.log(event.target)
            if((<HTMLElement> event.target).matches('.line1')){
                this.value += 1
                this.amountValue.textContent = this.value.toString()
                localStorage.setItem(`id${this.dataItem.id}-amount`, JSON.stringify(this.value));
                console.log(this.value)
            }
            else if((<HTMLElement> event.target).matches('.line3')){
                this.value -= 1
                if (this.value < 1) {
                    const arrLocal = JSON.parse(localStorage.getItem('cart_item')!);
                    const index = arrLocal.findIndex((e: IProduct) => e.id === this.dataItem.id);
                        if (index !== -1) {
                            arrLocal.splice(index, 1);
                        }
                    localStorage.setItem('cart_item', JSON.stringify(arrLocal))   

                    this.productItemID.remove()

                    this.cart.renderItemNumb()

                    localStorage.removeItem(`id${this.dataItem.id}-amount`)
                }
                else {this.amountValue.textContent = this.value.toString()
                localStorage.setItem(`id${this.dataItem.id}-amount`, JSON.stringify(this.value));
                console.log(this.value)}
            }
            this.productItemSum.textContent = `Total: €${this.value * this.dataItem.price}`
        })
    }

}

function createHTMLItem (dataItem : IProduct, index: number, amountValue: number) {
    return `<li class="product__item" id = "${dataItem.id}">
    <span id="number__item${dataItem.id}" class="number__item">${index+1}</span>
    <div class="product__item__img" style = "background-image: url(${dataItem.images[0]})"></div>
    <div>
        <h3 class="product__item__title">${dataItem.title}</h3>
        <p class="product__item__description">${dataItem.description}</p>
            <div class="product__item__description-second">
                <p class="product__item__rating">Rating: ${dataItem.rating}</p>
                <p class="product__item__discount">Discount: ${dataItem.discountPercentage}</p>
            </div> 
    </div>    
    <div>
        <p class="product__item__price">Price: €${dataItem.price}</p>
        <div id="amount_content${dataItem.id}" class="amount_content">
            <div class="add-value_circle value_circle">
                <div class="add-value_circle__line line1">-</div>
                <div class="add-value_circle__line line2">_</div>
            </div>
            <p id="amount_value${dataItem.id}" class="amount_value">${amountValue}</p>
            <div class="remove-value_circle value_circle">
                <div class="add-value_circle__line line3">-</div>
            </div>
        </div>
        <p id="product__item__sum${dataItem.id}" class="product__item__sum">Total: €${amountValue * dataItem.price}</p>        
    </div>    
</li>`
}