import { ItemCart } from "./item_cart";

export class SumCart {
    selectorParentsSum: HTMLElement
    constructor(selectorParentsSum: HTMLElement) {
        this.selectorParentsSum = selectorParentsSum
        this.render()

    }
    render () {
        this.selectorParentsSum.insertAdjacentHTML("beforeend", createHTMLCartSum ())
    }
    

}

function createHTMLCartSum () {
    return `
    <p id="amountSum__items" class="amountSum__items">Products: 0</p>
    <p id="amountSum__price" class="amountSum__price">Total: €</p>
    <form>
        <div>
            <input id="example" type="text" name="text" placeholder="Enter promo code"/>
        </div>
        <div>
            <label for="example">Promo for test: 'RS', 'EPM'</label>
        </div>
        <div>
            <input type="submit" value="Buy Now" />
        </div>
    </form>
`
}