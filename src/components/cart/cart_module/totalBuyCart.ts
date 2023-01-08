import { OrderForm } from '../../order_form/order_form';
import { Cart } from './cart';
import { LocalCart } from './localCart';

export class TotalBuy {
  selectorParentsSum: HTMLElement;
  buyNowButtonDOM!: HTMLButtonElement;
  orederForm: OrderForm | null = null;
  cart: Cart;
  promoInputDOM!: HTMLButtonElement;
  promoFormDOM!: HTMLElement;
  promoContentValidDOM!: HTMLElement;
  promoAppliedDOM!: HTMLElement;
  promoTotalPriceDOM!: HTMLElement;
  localCart: LocalCart;
  constructor(selectorParentsSum: HTMLElement, cart: Cart) {
    this.localCart = new LocalCart();
    this.cart = cart;
    this.selectorParentsSum = selectorParentsSum;
    this.renderTotalBuy();
    this.initDOM();
    this.buyNowButtonEvent();
    this.promoInputEvent();
    this.promoBtnEvent();
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
    this.promoContentValidDOM = this.selectorParentsSum.querySelector('.promo__content--valid') as HTMLElement;
    this.promoInputDOM = this.selectorParentsSum.querySelector('#promo__input') as HTMLButtonElement;
    this.promoTotalPriceDOM = this.selectorParentsSum.querySelector('#cart-total--price') as HTMLElement;
    this.promoFormDOM = this.selectorParentsSum.querySelector('.cart-total--promo') as HTMLElement;
    this.promoAppliedDOM = this.selectorParentsSum.querySelector('.promo__input--applied') as HTMLElement;
  }

  renderPromo(objWithPromo: { [x: string]: string }, code: string) {
    this.promoContentValidDOM.insertAdjacentHTML('beforeend', createHTMLPromo(objWithPromo, code));
  }

  promoInputEvent() {
    this.promoInputDOM.addEventListener('input', () => {
      const inputValue = this.promoInputDOM.value.toLocaleLowerCase();
      if (this.selectorParentsSum.querySelector(`.promo__content--${inputValue}-add`) as HTMLElement) {
        return;
      }
      if (Object.keys(promo).some(e => e === inputValue)) {
        this.renderPromo(promo, this.promoInputDOM.value.toLocaleLowerCase());
        if (this.selectorParentsSum.querySelector(`.promo__input--${inputValue}-drop`)) {
          document.querySelector(`.promo__content--${inputValue}-btn`)?.remove();
        }
      } else this.promoContentValidDOM.innerHTML = '';
    });
  }

  promoBtnEvent() {
    this.selectorParentsSum.addEventListener('click', event => {
      event.preventDefault();
      const inputValue = (<HTMLElement>event.target)?.dataset.promo as string;
      if ((<HTMLElement>event.target).matches(`.promo__content--${inputValue}-btn`)) {
        if (!document.querySelector('.promo__input--applied')) {
          this.promoFormDOM.insertAdjacentHTML('beforebegin', createHTMLPromoApplyContainer());
        }
        this.renderPromoAppl(promo, inputValue);
        this.addSale();
        (this.selectorParentsSum.querySelector(`.promo__content--${inputValue}-btn`) as HTMLElement).style.display =
          'none';
      }
      if ((<HTMLElement>event.target).matches(`.btn-drop`)) {
        this.removePromoAppl((<HTMLElement>event.target).dataset.promo as string);
        this.addSale();
        if (this.selectorParentsSum.querySelector(`.promo__content--${inputValue}-btn`)) {
          (this.selectorParentsSum.querySelector(`.promo__content--${inputValue}-btn`) as HTMLElement).style.display =
            'block';
        }
        if (this.selectorParentsSum.querySelector('.promo__input--applied')?.children.length === 1) {
          this.selectorParentsSum.querySelector('.promo__input--applied')?.remove();
        }
      }
    });
  }

  addSale() {
    const everyDiscont = this.selectorParentsSum.querySelectorAll('.discount-text');
    const totalPrice = this.localCart.getLocalTotalPrice();
    const arrDiscont: (string | undefined)[] = [];
    const newPriceContainerDOM = this.selectorParentsSum.querySelector(
      '.cart-total--new-price__container',
    ) as HTMLElement;
    everyDiscont.forEach(e => arrDiscont.push(e.textContent?.split(' - ')[1].slice(0, -1)));
    if (arrDiscont.length < 1) {
      this.promoTotalPriceDOM.style.textDecoration = 'none';
      newPriceContainerDOM.innerHTML = '';
      return;
    } else {
      this.promoTotalPriceDOM.style.textDecoration = 'line-through';
      const newTotalPrice =
        totalPrice -
        (totalPrice *
          (arrDiscont as unknown as number[]).reduce((acc: number, e: number) => {
            return +e + +acc;
          })) /
          100;
      newPriceContainerDOM.innerHTML = `<p class="cart-total--new-price">Total: €${newTotalPrice}</p>`;
    }
  }

  renderPromoAppl(objWithPromo: { [x: string]: string }, code: string) {
    this.promoAppliedDOM = this.selectorParentsSum.querySelector('.promo__input--applied') as HTMLElement;
    this.promoAppliedDOM.insertAdjacentHTML('beforeend', createHTMLPromoApply(objWithPromo, code));
  }

  removePromoAppl(code: string) {
    const promoAppliedContentDOM = this.selectorParentsSum.querySelector(
      `.promo__input--${code}-content`,
    ) as HTMLElement;
    const promoAppliedBtnDOM = this.selectorParentsSum.querySelector(`.promo__input--${code}-drop`) as HTMLElement;
    if (code === promoAppliedBtnDOM.dataset.promo) {
      promoAppliedContentDOM.remove();
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
        <div class="promo__content--valid"></div>
        <button class="buy-now">Buy Now</button>
    </form>
`;
}

function createHTMLPromoApply(objWithPromo: { [x: string]: string }, code: string) {
  return `<div class="promo__input--${code}-content">
        <p class="promo__input--${code}-text discount-text">${objWithPromo[code]}</p>
        <button class="promo__input--${code}-drop btn-drop" data-promo="${code}">DROP</button>
        </div>
`;
}
function createHTMLPromoApplyContainer(): string {
  return `<div class="cart-total--new-price__container">
          </div>
        <div class="promo__input--applied">
            <h4 class="promo__input--applied-title">Applied codes</h4>            
        </div>
`;
}

function createHTMLPromo(objWithPromo: { [x: string]: string }, code: string) {
  return `
  <div class="promo__content--${code}-add">
    <span class="promo__content--${code}-lable">${objWithPromo[code]}</span>
    <button class="promo__content--${code}-btn btn-add" data-promo="${code}">ADD</button>
  </div>
  `;
}

const promo = {
  rs: 'Rolling Scopes School - 10%',
  epm: 'EPAM Systems - 10%',
};
