import './style.css';
import { LocalCart } from '../cart/cart_module/localCart';
import { eventedPushState } from '../router/events_history';

export class Header {
  static createHTMLHeaderContainer() {
    throw new Error('Method not implemented.');
  }
  bodyDOM: HTMLElement;
  headerContainer: HTMLElement | null;
  localCart: LocalCart;
  logoDOM!: HTMLElement;
  cartDOM!: HTMLElement;
  constructor(selector: string) {
    this.bodyDOM = document.querySelector(selector) as HTMLElement;
    this.headerContainer = null;
    this.creatHeaderContainer();
    this.localCart = new LocalCart();
    this.renderHeader();
    this.createEventsHandlers();
  }

  creatHeaderContainer() {
    this.headerContainer = document.createElement('header');
    this.headerContainer.classList.add('header');
    this.bodyDOM.prepend(this.headerContainer);
  }
  renderHeader() {
    if (this.headerContainer) {
      this.headerContainer.innerHTML = createHTMLHeaderContainer();
      this.logoDOM = this.headerContainer.querySelector('.header__logo') as HTMLElement;
      this.cartDOM = this.headerContainer.querySelector('.header__cart__link') as HTMLElement;
    }
    if (this.localCart.getLocalCartProducts()?.length > 0) {
      this.localCart.drawTotalPriceOnPage();
      this.localCart.drawTotalProductsOnPage();
    }
  }
  createEventsHandlers() {
    this.logoDOM.addEventListener('click', e => {
      e.preventDefault();
      eventedPushState({}, '', '/');
    });
    this.cartDOM.addEventListener('click', e => {
      e.preventDefault();
      eventedPushState({}, '', '/cart');
    });
  }
}

function createHTMLHeaderContainer(): string {
  return ` 
        <a class="header__logo" href="/">
        <span class="header__logo__on">On</span><i class="fa-solid fa-bag-shopping"></i><span>store</span>
        </a>
        <p id="total-price">Total: € 0</p>
        <div class="header__cart">
          <a href="/cart" class="header__cart__link">
            <i class="fa-solid fa-cart-shopping"></i>
          </a>
          <span id="total-products">0</span>
        </div>
`;
}
