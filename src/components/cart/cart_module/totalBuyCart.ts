import { OrderForm } from '../../order_form/order_form';
import { Cart } from './cart';

export class TotalBuy {
  selectorParentsSum: HTMLElement;
  buyNowButtonDOM!: HTMLButtonElement;
  orederForm: OrderForm | null = null;
  cart: Cart;
  promoInputDOM!: HTMLButtonElement;
  promoRSInputDOM!: HTMLElement;
  promoEPMInputDOM!: HTMLElement;
  promoRSBtnAddDOM!: HTMLButtonElement;
  promoFormDOM!: HTMLElement;
  promoRSAppliedDOM!: HTMLElement;
  promoEPMAppliedDOM!: HTMLElement;
  constructor(selectorParentsSum: HTMLElement, cart: Cart) {
    this.cart = cart;
    this.selectorParentsSum = selectorParentsSum;
    this.renderTotalBuy();
    this.initDOM();
    this.buyNowButtonEvent();
    this.promoInputEvent();
  }

  renderTotalBuy() {
    this.selectorParentsSum.insertAdjacentHTML('beforeend', createHTMLTotalBuy());
    this.buyNowButtonDOM = this.selectorParentsSum.querySelector('.buy-now') as HTMLButtonElement;
  }
  buyNowButtonEvent() {
    this.buyNowButtonDOM.addEventListener('click', e => {
      e.preventDefault();
      this.orederForm = new OrderForm(/* this.cart */);
    });
  }
  initDOM() {
    this.promoInputDOM = this.selectorParentsSum.querySelector('#promo__input') as HTMLButtonElement;
    this.promoRSInputDOM = this.selectorParentsSum.querySelector('.promo__input--rs') as HTMLElement;
    this.promoEPMInputDOM = this.selectorParentsSum.querySelector('.promo__input--epm') as HTMLElement;
    this.promoRSBtnAddDOM = this.selectorParentsSum.querySelector('.promo__input--rs-add') as HTMLButtonElement;
    this.promoFormDOM = this.selectorParentsSum.querySelector('.cart-total--promo') as HTMLElement;
    this.promoEPMAppliedDOM = this.selectorParentsSum.querySelector('.promo__input--epm-applied') as HTMLElement;
  }
  renderPromo(code: string) {
    // if(code)
  }
  promoInputEvent() {
    this.promoInputDOM.addEventListener('input', () => {
      console.log(Object.keys(promo));
      if (this.promoInputDOM.value.toLocaleUpperCase() === 'RS') {
        this.promoRSInputDOM.classList.add('active');
      } else if (this.promoInputDOM.value.toLocaleUpperCase() === 'EPM') {
        this.promoEPMInputDOM.classList.add('active');
      } else {
        this.promoRSInputDOM.classList.remove('active');
        this.promoEPMInputDOM.classList.remove('active');
      }
    });
    this.selectorParentsSum.addEventListener('click', event => {
      console.log(<HTMLElement>event.target);
      event.preventDefault();
      if ((<HTMLElement>event.target).matches('.promo__input--rs-add')) {
        this.renderPromoAppl('rs');
        this.promoRSBtnAddDOM.classList.remove('active');
      }
      if ((<HTMLElement>event.target).matches('.promo__input--rs-drop')) {
        console.log('enter0');
        this.removePromoAppl('rs');
        this.promoRSBtnAddDOM.classList.add('active');
      }
    });
  }

  renderPromoAppl(code: string) {
    this.promoFormDOM.insertAdjacentHTML('beforebegin', createHTMLPromoApply(code));
  }

  removePromoAppl(code: string) {
    this.promoRSAppliedDOM = this.selectorParentsSum.querySelector('.promo__input--rs-applied') as HTMLElement;
    if (code === 'rs') {
      this.promoRSAppliedDOM.remove();
    }
    if (code === 'epm') {
      this.promoEPMAppliedDOM.remove();
    }
  }
}

function createHTMLTotalBuy(): string {
  return `
    <p id="cart-total--amount" class="cart-total--amount">Products: 0</p>
    <p id="cart-total--price" class="cart-total--price">Total: €</p>
    <form class="cart-total--promo">
        <div>
            <input id="promo__input" type="text" name="text" placeholder="Enter promo code('RS', 'EPM')"/>
        </div>
        <div class="promo__input--rs">
            <span class="promo__input--rs-lable">Rolling Scopes School - 10%</span>
            <button class="promo__input--rs-add active">ADD</button>
        </div>
        <div class="promo__input--epm">
            <span class="promo__input--epm-lable">EPAM Systems - 10%</span>
            <button class="promo__input--epm-add active">ADD</button>
        </div>
        <button class="buy-now">Buy Now</button>
    </form>
`;
}

function createHTMLPromoApply(code: string) {
  const textSale = () => {
    if (code === 'rs') {
      return promo.rs;
    }
    if (code === 'epm') {
      return promo.epm;
    }
  };
  return `
        <div class="promo__input--${code}-applied">
            <span class="promo__input--${code}-lable">Applied codes</span>            
            <span class="promo__input--${code}-text">
            ${textSale()}</span>
            <button class="promo__input--${code}-drop">DROP</button>
        </div>
`;
}

const promo = {
  rs: 'Rolling Scopes School - 10%',
  epm: 'EPAM Systems - 10%',
};
