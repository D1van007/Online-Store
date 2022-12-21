// import { IProduct } from "../../../types";
// import { ItemCart } from "./item_cart";
// import { SumCart } from "./sum_cart";

export class Header {
    body : HTMLElement
    headerConteiner : HTMLElement | null

    constructor (selector: string) {
        this.body = document.querySelector(selector)!
        this.headerConteiner = null
        this.creatHeaderConteiner ()
        this.render()
    }
    creatHeaderConteiner () {
        this.headerConteiner = document.createElement('header');
        this.headerConteiner.classList.add('header')
        this.body.prepend(this.headerConteiner)

    }
    render () {
        if(this.headerConteiner)
        this.headerConteiner.innerHTML = createHTMLHeaderConteiner()
    }

}
function createHTMLHeaderConteiner() {
    let cartTotal = JSON.parse(localStorage.getItem('totalProducts')!) | 0
 return ` 
        <a class="header_logo">
        <h1>Online-Store</h1>
        </a>
        <p id="total-products">${cartTotal}</p>
`
}

