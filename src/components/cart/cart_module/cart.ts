import { IProduct } from '../../../types';
import { TotalBuy } from './totalBuyCart';
import { LocalCart } from './localCart';
import { ProductsCartList } from './productsCartList';

export class Cart {
  parentContainer: HTMLElement;
  cartContainer!: HTMLElement;
  productInCart: IProduct[];
  localCart: LocalCart;
  productsCartList: ProductsCartList;
  cartProductsControlDOM: HTMLElement;
  constructor(selector: string) {
    this.parentContainer = document.querySelector(selector) as HTMLElement;
    this.localCart = new LocalCart();
    this.productInCart = this.localCart.getLocalCartProducts();
    this.productsCartList = new ProductsCartList();
    this.renderCartContent();
    this.localCart.setLocalProductByID();
    this.cartProductsControlDOM = document.getElementById('cart-products__head--controll') as HTMLElement;
    this.changeControlsSetting();
  }

  renderCartContent() {
    if (this.productInCart?.length > 0) {
      this.cartContainer = document.createElement('div');
      this.cartContainer.classList.add('cart__container');
      this.parentContainer.prepend(this.cartContainer);
      this.cartContainer.innerHTML = createHTMLContainer();
      this.productsCartList.renderCartProductList();
      this.renderCartTotalBuy();
    }
  }

  renderCartTotalBuy() {
    const productsTotalBuy = document.querySelector('.cart-total__content') as HTMLElement;
    new TotalBuy(productsTotalBuy);
  }

  changeControlsSetting() {
    console.log(this.cartProductsControlDOM);
    if (this.cartProductsControlDOM) {
      const productPageDOM = document.getElementById('controll__page-numbers') as HTMLElement;
      const productLimiteDOM = document.getElementById('controll__limit--value') as HTMLInputElement;

      productLimiteDOM.addEventListener('input', () => {
        this.productInCart = this.localCart.getLocalCartProducts();
        const productPageNumber = Number(
          (document.getElementById('controll__page-numbers--value') as HTMLInputElement).textContent,
        );
        if (productLimiteDOM.valueAsNumber <= this.productInCart.length) {
          if (
            productLimiteDOM.valueAsNumber * productPageNumber - this.productInCart.length >=
            productLimiteDOM.valueAsNumber
          ) {
            (document.getElementById('controll__page-numbers--value') as HTMLInputElement).textContent = Math.ceil(
              this.productInCart.length / productLimiteDOM.valueAsNumber,
            ).toString();
          }
          this.productsCartList.renderCartProductList();
        }
      });
      productPageDOM.addEventListener('click', event => {
        this.productInCart = this.localCart.getLocalCartProducts();
        let productPageNumber = Number(
          (document.getElementById('controll__page-numbers--value') as HTMLInputElement).textContent,
        );
        if ((<HTMLElement>event.target).matches('.btn-left') && productPageNumber > 1) {
          productPageNumber = productPageNumber - 1;
        } else if (
          (<HTMLElement>event.target).matches('.btn-right') &&
          productPageNumber < Math.ceil(this.productInCart.length / productLimiteDOM.valueAsNumber)
        ) {
          productPageNumber = productPageNumber + 1;
        } else return;
        (document.getElementById('controll__page-numbers--value') as HTMLInputElement).textContent =
          productPageNumber.toString();
        this.productsCartList.renderCartProductList();
      });
    }
  }
}

function createHTMLContainer(): string {
  return ` 
    <div id="cart-products__content" class="cart-products__content">
        <div class="cart-products__head">
          <h2 class="cart-products__head--title">Products In Cart</h2>
          <div id="cart-products__head--controll" class="cart-products__head--controll">
            <div class="controll__limit">
              <p class="controll__limit--text">Limit: </p>
              <input id="controll__limit--value" class="controll__limit--value" type="number" min="1" max="${
                JSON.parse(localStorage.getItem('productsInCart') as string).length
              }" value="3">
            </div>
            <div id="controll__page-numbers" class="controll__page-numbers">
              <p class="controll__page-numbers--text">Page: </p>
              <button class="controll__page-numbers--btn btn-left"><</button>
              <span id="controll__page-numbers--value" class="controll__page-numbers--value">1</span>
              <button class="controll__page-numbers--btn btn-right">></button>
            </div>
          </div>
        </div>
        <ul class="cart-products__list">
        </ul>
    </div>
    <div class="cart-total__content"></div>`;
}
