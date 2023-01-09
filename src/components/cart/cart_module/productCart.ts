import { IProduct } from '../../../types';
import { eventedPushState } from '../../router/events_history';
import { calcPageNum } from './cart';
import { LocalCart } from './localCart';
import { ProductsCartList } from './productsCartList';

export class ProductInCart {
  dataProduct: IProduct;
  selectorList: HTMLUListElement;
  productItemID!: HTMLElement;
  amountContentDOM!: HTMLElement;
  amountProductDOM!: HTMLElement;
  totalPriceProductDOM!: HTMLElement;
  productAmount!: number;
  index: number;
  localCart: LocalCart;
  productsCartList: ProductsCartList;
  totalProductHeaderDOM!: HTMLElement;
  totalPriceHeaderDOM!: HTMLElement;
  constructor(dataProduct: IProduct, selectorList: HTMLUListElement, index: number) {
    this.dataProduct = dataProduct;
    this.index = index;
    this.selectorList = selectorList;
    this.productAmount = JSON.parse(localStorage.getItem(`id${this.dataProduct.id}`) as string);
    this.renderProduct();
    this.initDOMElement();
    this.localCart = new LocalCart();
    this.changeAmount();
    this.productsCartList = new ProductsCartList();
  }

  initDOMElement() {
    this.productItemID = document.getElementById(this.dataProduct.id.toString()) as HTMLElement;
    this.amountContentDOM = document.getElementById(`amount-change__content${this.dataProduct.id}`) as HTMLElement;
    this.amountProductDOM = document.getElementById(`amount-product${this.dataProduct.id}`) as HTMLElement;
    this.totalProductHeaderDOM = document.getElementById('total-products') as HTMLElement;
    this.totalPriceHeaderDOM = document.getElementById('total-price') as HTMLElement;
    this.totalPriceProductDOM = document.getElementById(
      `product__item--total-price${this.dataProduct.id}`,
    ) as HTMLElement;
  }

  renderProduct() {
    this.productAmount = JSON.parse(localStorage.getItem(`id${this.dataProduct.id}`) as string);
    this.selectorList.insertAdjacentHTML(
      'beforeend',
      createHTMLCartItem(this.dataProduct, this.index, this.productAmount),
    );
  }

  changeAmount() {
    this.productItemID.addEventListener('click', event => {
      if ((<HTMLElement>event.target).matches('.fa-plus')) {
        if (this.productAmount >= this.dataProduct.stock) {
          return;
        } else {
          this.productAmount += 1;
          this.amountProductDOM.textContent = this.productAmount.toString();
          localStorage.setItem(`id${this.dataProduct.id}`, JSON.stringify(this.productAmount));
        }
      } else if ((<HTMLElement>event.target).matches('.fa-minus')) {
        this.productAmount -= 1;
        if (this.productAmount < 1) {
          this.localCart.removeProducrFromCart(this.productItemID);
          this.productItemID.remove();
          calcPageNum();
          this.productsCartList.renderCartProductList();
          localStorage.removeItem(`id${this.dataProduct.id}`);
        } else {
          this.amountProductDOM.textContent = this.productAmount.toString();
          localStorage.setItem(`id${this.dataProduct.id}`, JSON.stringify(this.productAmount));
        }
      } else if ((<HTMLElement>event.target).closest('.cart-products__item--content')) {
        eventedPushState({}, '', `/product${this.dataProduct.id}`);
      }
      this.totalPriceProductDOM.textContent = `Total: €${this.productAmount * this.dataProduct.price}`;

      if (this.localCart?.getLocalCartProducts().length === 0) {
        this.localCart.clearCart();
      }
      this.localCart.setTotalProducts();
      this.localCart.setTotalPrice();
    });
  }
}

function createHTMLCartItem(dataProduct: IProduct, index: number, amountValue: number): string {
  return `<li class="cart-products__item--container" id = "${dataProduct.id}">
    <span id="item-num${dataProduct.id}" class="cart-products__item--num">${index + 1}</span>
    <div class="cart-products__item--content">
      <div class="cart-products__item--img" style = "background-image: url(${dataProduct.images[0]})"></div>
      <div class="cart-products__item--full-description">
        <h3 class="cart-products__item--title">${dataProduct.title}</h3>
        <p class="cart-products__item--description">${dataProduct.description}</p>
        <div class="cart-products__item--description-second">
            <p class="cart-products__item--price">Price: €${dataProduct.price}</p>
            <p class="cart-products__item--rating">Rating: ${dataProduct.rating}</p>
            <p class="cart-products__item--discount">Discount: ${dataProduct.discountPercentage}</p>
        </div> 
      </div>
    </div>      
    <div class="cart-products__item--amount">
      <span class="product__item--price">Stock: ${dataProduct.stock}</span>
      <div id="amount-change__content${dataProduct.id}" class="amount-change__content">
        <div class="add-value__circle value_circle">
          <i class="fa-solid fa-plus"></i>
        </div>
        <p id="amount-product${dataProduct.id}" class="amount-product">${amountValue}</p>
        <div class="remove-value__circle value_circle">
          <i class="fa-solid fa-minus"></i>
        </div>
      </div>
      <span id="product__item--total-price${dataProduct.id}" class="product__item--total-price">€${
    amountValue * dataProduct.price
  }</span>       
    </div>    
</li>`;
}
