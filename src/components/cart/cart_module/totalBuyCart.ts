export class TotalBuy {
  selectorParentsSum: HTMLElement;
  constructor(selectorParentsSum: HTMLElement) {
    this.selectorParentsSum = selectorParentsSum;
    this.renderTotalBuy();
  }

  renderTotalBuy() {
    this.selectorParentsSum.insertAdjacentHTML('beforeend', createHTMLTotalBuy());
  }
}

function createHTMLTotalBuy():string {
  return `
    <p id="cart-total__amount" class="cart-total__amount">Products: 0</p>
    <p id="cart-total__price" class="cart-total__price">Total: €</p>
    <form class="cart-total__promo>
        <div>
            <input id="promo" type="text" name="text" placeholder="Enter promo code"/>
        </div>
        <div>
            <label for="promo">Promo for test: 'RS', 'EPM'</label>
        </div>
        <div>
            <input type="submit" value="Buy Now" />
        </div>
    </form>
`;
}
