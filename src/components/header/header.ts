import './style.css';
import { LocalCart } from '../cart/cart_module/localCart';
export class Header {
  bodyDOM: HTMLElement;
  headerContainer: HTMLElement | null;
  localCart: LocalCart;
  constructor(selector: string) {
    this.bodyDOM = document.querySelector(selector) as HTMLElement;
    this.headerContainer = null;
    this.creatHeaderContainer();
    this.localCart = new LocalCart();
    this.renderHeader();
  }

  creatHeaderContainer() {
    this.headerContainer = document.createElement('header');
    this.headerContainer.classList.add('header');
    this.bodyDOM.prepend(this.headerContainer);
  }
  renderHeader() {
    if (this.headerContainer) {
      this.headerContainer.innerHTML = createHTMLHeaderContainer();
    }
    if (this.localCart?.getLocalCartProducts().length > 0) {
      this.localCart.drawTotalPriceOnPage();
      this.localCart.drawTotalProductsOnPage();
    }
  }
}

function createHTMLHeaderContainer(): string {
  const cartTotal = JSON.parse(localStorage.getItem('totalProductsLocal') as string) | 0;
  const cartPrice = JSON.parse(localStorage.getItem('totalPriceLocal') as string) | 0;
  return ` 
        <a class="header_logo">
        <h1>Online-Store</h1>
        </a>
        <p id="total-price">Total: € ${cartPrice}</p>
        <p id="total-products">${cartTotal}</p>
`;
}
