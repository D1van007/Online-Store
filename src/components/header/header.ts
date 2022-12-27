import './style.css';
import { LocalCart } from '../cart/cart_module/localCart';
export class Header {
  bodyDOM: HTMLElement;
  headerConteiner: HTMLElement | null;
  localCart: LocalCart;
  constructor(selector: string) {
    this.bodyDOM = document.querySelector(selector) as HTMLElement;
    this.headerConteiner = null;
    this.creatHeaderConteiner();
    this.localCart = new LocalCart;
    this.renderHeader();
  }

  creatHeaderConteiner() {
    this.headerConteiner = document.createElement('header');
    this.headerConteiner.classList.add('header');
    this.bodyDOM.prepend(this.headerConteiner);
  }
  renderHeader() {
    if (this.headerConteiner) {
        this.headerConteiner.innerHTML = createHTMLHeaderConteiner();
    }
    if (this.localCart.getLocalCartProducts() && this.localCart.getLocalCartProducts().length > 0) {
        this.localCart.setTotalPrice();
        this.localCart.setTotalProducts();
    }
  }
}

function createHTMLHeaderConteiner():string {
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
