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

function createHTMLTotalBuy() {
  return `
    <p id="total-cart_product" class="total-cart_product">Products: 0</p>
    <p id="total-cart_price" class="total-cart_price">Total: €</p>
    <form>
        <div>
            <input id="promo-code" type="text" name="text" placeholder="Enter promo code"/>
        </div>
        <div>
            <label for="promo-code">Promo for test: 'RS', 'EPM'</label>
        </div>
        <div>
            <input type="submit" value="Buy Now" />
        </div>
    </form>
`;
}
