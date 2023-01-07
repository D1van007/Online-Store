import { OrderForm } from "../../order_form/order_form";
import { Cart } from "./cart";

export class TotalBuy {
  selectorParentsSum: HTMLElement;
  buyNowButtonDOM!:HTMLButtonElement;
  orederForm:OrderForm|null = null
  cart:Cart
  constructor(selectorParentsSum: HTMLElement,cart:Cart) {
    this.cart = cart
    this.selectorParentsSum = selectorParentsSum;
    this.renderTotalBuy();
    this.buyNowButtonEvent()
  }

  renderTotalBuy() {
    this.selectorParentsSum.insertAdjacentHTML('beforeend', createHTMLTotalBuy());
    this.buyNowButtonDOM = this.selectorParentsSum.querySelector('.buy-now')!
  }
  buyNowButtonEvent(){
    this.buyNowButtonDOM.addEventListener('click',(e)=>{
      e.preventDefault()
      this.orederForm = new OrderForm(this.cart)
    })
  }
}

function createHTMLTotalBuy(): string {
  return `
    <p id="cart-total--amount" class="cart-total--amount">Products: 0</p>
    <p id="cart-total--price" class="cart-total--price">Total: €</p>
    <form class="cart-total__promo>
        <div>
            <input id="promo" type="text" name="text" placeholder="Enter promo code"/>
        </div>
        <div>
            <label for="promo">Promo for test: 'RS', 'EPM'</label>
        </div>
        <div>
            <button class="buy-now">Buy Now</button>
        </div>
    </form>
`;
}
