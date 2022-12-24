import './style.css'
export class Header {
    bodyDOM: HTMLElement
    headerConteiner: HTMLElement | null
    constructor(selector: string) {
        this.bodyDOM = document.querySelector(selector)!
        this.headerConteiner = null
        this.creatHeaderConteiner()
        this.renderHeader()
    }

    creatHeaderConteiner() {
        this.headerConteiner = document.createElement('header');
        this.headerConteiner.classList.add('header')
        this.bodyDOM.prepend(this.headerConteiner)
    }
    renderHeader() {
        if (this.headerConteiner)
            this.headerConteiner.innerHTML = createHTMLHeaderConteiner()
    }
}

function createHTMLHeaderConteiner() {
    let cartTotal = JSON.parse(localStorage.getItem('totalProductsLocal')!) | 0
    let cartPrice = JSON.parse(localStorage.getItem('totalPriceLocal')!) | 0
    return ` 
        <a class="header_logo">
        <h1>Online-Store</h1>
        </a>
        <p id="total-price">Total: € ${cartPrice}</p>
        <p id="total-products">${cartTotal}</p>
`
}

