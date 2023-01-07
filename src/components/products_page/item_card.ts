import { eventedPushState } from '../router/events_history';
import { LocalCart } from '../cart/cart_module/localCart';
import { IProduct } from '../../types';

export class ItemCard {
  selector: HTMLElement;
  id: number;
  isRender: boolean;
  product: IProduct;
  productDOM!: HTMLElement;
  parentContainerDOM: HTMLElement;
  addToCartBtn!: HTMLButtonElement;
  localCart!: LocalCart;
  cartProducts: IProduct[] = [];
  constructor(id: number, product: IProduct, selector: HTMLElement, isRender = false) {
    this.selector = selector;
    this.parentContainerDOM = document.getElementById('main') as HTMLElement;
    this.id = id;
    this.isRender = isRender;
    this.product = product;
    if (isRender) {
      this.localCart = new LocalCart();
      this.cartProducts = this.localCart.getLocalCartProducts();
      this.renderProduct();
      this.productDOM = document.getElementById(this.id.toString()) as HTMLElement;
      this.addToCartBtn = this.productDOM.querySelector('.product__item--btn-cart') as HTMLButtonElement;
      this.productEventTracker();
    }
  }

  renderProduct() {
    this.selector.insertAdjacentHTML('beforeend', renderHTMLBase(this.id, this.product));
    this.renderBtnCartItem();
  }

  deleteProduct() {
    this.selector.insertAdjacentHTML('beforeend', '');
  }

  selfPageRender() {
    this.parentContainerDOM.innerHTML = selfPageHTML(this.product);
  }

  productEventTracker() {
    this.productDOM.addEventListener('click', e => {
      if (e.target === this.addToCartBtn) {
        if (this.addToCartBtn.classList.contains('add-to-cart')) {
          this.addToCartBtn.classList.add('remove-from-cart');
          this.addToCartBtn.classList.remove('add-to-cart');
          this.addToCartBtn.textContent = 'Remove cart';
          this.setLocalProductsInCart();
          if (!JSON.parse(localStorage.getItem(`id${this.productDOM.id}`) as string)) {
            localStorage.setItem(`id${this.productDOM.id}`, JSON.stringify(1));
          }
        } else if (this.addToCartBtn.classList.contains('remove-from-cart')) {
          this.addToCartBtn.classList.remove('remove-from-cart');
          this.addToCartBtn.classList.add('add-to-cart');
          this.addToCartBtn.textContent = 'Add cart';
          this.localCart.removeProducrFromCart(this.productDOM);
          localStorage.removeItem(`id${this.productDOM.id}`);
        }
        this.localCart.setTotalPrice();
        this.localCart.setTotalProducts();
      } else {
        eventedPushState({}, '', `/product${this.id}`);
      }
    });
  }

  setLocalProductsInCart() {
    if (localStorage.getItem('productsInCart')) {
      this.cartProducts = this.localCart.getLocalCartProducts();
      if (!this.cartProducts.some(e => e.id == this.id)) {
        this.cartProducts.push(this.product);
        localStorage.setItem('productsInCart', JSON.stringify(this.cartProducts));
      }
    } else {
      this.cartProducts = [];
      this.cartProducts.push(this.product);
      localStorage.setItem('productsInCart', JSON.stringify(this.cartProducts));
    }
  }

  renderBtnCartItem() {
    const currentBtn = document.getElementById(`product__item--btn-cart${this.id}`);
    if (this.cartProducts?.some((e: { id: number }) => e.id === this.id)) {
      currentBtn?.classList.remove('add-to-cart');
      currentBtn?.classList.add('remove-from-cart');
      (currentBtn as HTMLElement).textContent = 'Remove cart';
    } else {
      currentBtn?.classList.remove('remove-from-cart');
      currentBtn?.classList.add('add-to-cart');
      (currentBtn as HTMLElement).textContent = 'Add cart';
    }
  }
}

function renderHTMLBase(id: number, data: IProduct): string {
  const currentUrl = new URL(window.location.href);
  if (currentUrl?.searchParams.get('big') === `false`) {
    document.querySelector('.product-list')?.classList.add('line-list');
    return `
      <li class="product__item line-item" id = "${id}">
    <div class="product__item--img line-item--img" style = "background-image: url(${data.thumbnail})"></div>
    <div class="products__item--fullname">
        <h3 class="product__item--title">${data.title}</h3>
        <p class="products__item--description">${data.description}</p>
            <div class="products__item--description-second">
                <p class="products__item--price">Price: €${data.price}</p>
                <p class="products__item--rating">Rating: ${data.rating}</p>
                <p class="products__item--discount">Discount: ${data.discountPercentage}</p>
            </div> 
    </div>
    <div class="product__item--btn__content line-item--btn">
    <button id = "product__item--btn-cart${id}" class="product__item--btn-cart add-to-cart">add to cart</button>
    <button id = "product__item--btn-detals${id}" class="product__item--btn-detals">detals</button>
    </div>
  </li>
 `;
  } else {
    return `  
  <li class="product__item" id = "${id}">
    <div class="product__item--img" style = "background-image: url(${data.thumbnail})"></div>
    <h3 class="product__item--title">${data.title}</h3>
    <div class="product__item--info">
      <ul class="info__list">
      <li class="info__item-category info-item">Category: ${data.category}</li>
      <li class="info__item-brand info-item">Brand: ${data.brand}</li>
      <li class="info__item-price info-item">Price: €${data.price}</li>
      <li class="info__item-discount info-item">Discount: ${data.discountPercentage}%</li>
      <li class="info__item-rating info-item">Rating: ${data.rating}</li>
      <li class="info__item-stock info-item">Stock: ${data.stock}</li>
      </ul>
    </div>
    <div class="product__item--btn__content">
    <button id = "product__item--btn-cart${id}" class="product__item--btn-cart add-to-cart">add to cart</button>
    <button id = "product__item--btn-detals${id}" class="product__item--btn-detals">detals</button>
    </div>
  </li>
  `;
  }
}

function selfPageHTML(data: IProduct) {
  return `
    <div class="product__item--img" style = "background-image: url(${data.thumbnail})"></div>
    <h3 class="product__item--title">${data.title}</h3>
    <div class="product__item--info">
      <ul class="info__list">
      <li class="info__item-category info-item">Category: ${data.category}</li>
      <li class="info__item-brand info-item">Brand: ${data.brand}</li>
      <li class="info__item-price info-item">Price: €${data.price}</li>
      <li class="info__item-discount info-item">Discount: ${data.discountPercentage}%</li>
      <li class="info__item-rating info-item">Rating: ${data.rating}</li>
      <li class="info__item-stock info-item">Stock: ${data.stock}</li>
      </ul>
          <div class="product__item--btn__content">
    <button id = "product__item--btn-cart${data.id}" class="product__item--btn-cart add-to-cart">add to cart</button>
    <button id = "product__item--btn-detals${data.id}" class="product__item--btn-detals">detals</button>
    </div>
    </div>`;
}
