import { eventedPushState } from '../router/events_history';
import { LocalCart } from '../cart/cart_module/localCart';
import { IProduct } from '../../types';
import { OrderForm } from '../order_form/order_form';
import { CartPage } from '../cart/cart_page';

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
  orederForm: OrderForm | null = null;
  cartPage: CartPage | null = null;
  constructor(id: number, product: IProduct, selector: HTMLElement, isRender = false) {
    this.localCart = new LocalCart();
    this.selector = selector;
    this.parentContainerDOM = document.getElementById('main') as HTMLElement;
    this.id = id;
    this.isRender = isRender;
    this.product = product;
    if (isRender) {
      this.cartProducts = this.localCart.getLocalCartProducts();
      this.renderProduct();
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
    this.renderBtnCartItem();
    this.productEventTracker();
    this.buyNowButtonEvent();
    this.selfImgHandler();
  }

  selfImgHandler() {
    const productImgDOM = document.querySelector('#self__item--img-content') as HTMLElement;
    const productMainImgDOM = document.getElementById('self__item--main-img') as HTMLElement;
    productImgDOM.addEventListener('click', event => {
      console.log(productImgDOM);
      console.log(<HTMLElement>event.target);
      productMainImgDOM.style.backgroundImage = (<HTMLElement>event.target).style.backgroundImage;
    });
  }

  productEventTracker() {
    this.productDOM = document.getElementById(this.id.toString()) as HTMLElement;
    this.addToCartBtn = this.productDOM.querySelector('.product__item--btn-cart') as HTMLButtonElement;
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
    this.cartProducts = this.localCart.getLocalCartProducts();
    if (this.cartProducts?.some((e: { id: number }) => e.id === this.id)) {
      console.log(this.id);
      currentBtn?.classList.remove('add-to-cart');
      currentBtn?.classList.add('remove-from-cart');
      (currentBtn as HTMLElement).textContent = 'Remove cart';
    } else {
      currentBtn?.classList.remove('remove-from-cart');
      currentBtn?.classList.add('add-to-cart');
      (currentBtn as HTMLElement).textContent = 'Add cart';
    }
  }

  buyNowButtonEvent() {
    const buyNowButtonDOM = document.querySelector('.buy-now') as HTMLButtonElement;
    buyNowButtonDOM.addEventListener('click', e => {
      e.preventDefault();
      this.setLocalProductsInCart();
      if (!JSON.parse(localStorage.getItem(`id${this.productDOM.id}`) as string)) {
        localStorage.setItem(`id${this.productDOM.id}`, JSON.stringify(1));
      }
      this.localCart.setTotalProducts();
      this.cartPage = new CartPage();
      this.orederForm = new OrderForm();
    });
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
    <div class="product__item--btn-main">
      <button id = "product__item--btn-cart${id}" class="product__item--btn-cart add-to-cart">add to cart</button>
      <button id = "product__item--btn-detals${id}" class="product__item--btn-detals">detals</button>
    </div>
  </li>
  `;
  }
}

function selfPageHTML(data: IProduct) {
  const arrImg = data.images.map(e => {
    return `<li class="self__item--img" style = "background-image: url(${e})"></li>`;
  });

  return `
  <div class="self-page navigation">
    <ul class="navigation__list">
      <li class="navigation__item-root"><a href="/">STORE</a></li>
      <li class="navigation__item-arrow">>></li>
      <li class="navigation__item-category">${data.category.toLocaleUpperCase()}</li>
      <li class="navigation__item-arrow">>></li>
      <li class="navigation__item-brand">${data.brand.toLocaleUpperCase()}</li>
      <li class="navigation__item-arrow">>></li>
      <li class="navigation__item-brand">${data.title.toLocaleUpperCase()}</li>
    </ul>
  </div>
  <div class="self-page self__item--container" id = "${data.id}">
    <div class="self__item--title">
      <h1 class="self__item--text">${data.title}</h1>
    </div>
    <div class="self__item--content">
      <ul id="self__item--img-content" class="self__item--img-content">
          ${arrImg.join('')}
      </ul>
      <div id="self__item--main-img" class="self__item--main-img" style = "background-image: url(${
        data.thumbnail
      })"></div>

    <div class="self__item--info">
      <ul class="self-info__list">
        <li class="self-info__item--description self-info-item">
          <p class="self-info__item--description-title">Description: </p>
          <p class="self-info__item--description-text">${data.description}</p>        
        </li>
        <li class="self-info__item--discount self-info-item">
          <p class="self-info__item--discount-title">Discount: </p>
          <p class="self-info__item--discount-text">${data.discountPercentage}%</p>
        </li>
        <li class="self-info__item--rating self-info-item">
          <p class="self-info__item--rating-title">Rating: </p>
          <p class="self-info__item--rating-text">${data.rating}</p>
        </li>        
        <li class="self-info__item--stock self-info-item">
          <p class="self-info__item--stock-title">Stock: </p>
          <p class="self-info__item--stock-text">${data.stock}</p>
        </li>   
        <li class="self-info__item--brand self-info-item">
          <p class="self-info__item--brand-title">Brand: </p>
          <p class="self-info__item--brand-text">${data.brand}</p>
        </li>
        <li class="self-info__item--category self-info-item">
          <p class="self-info__item--category-title">Category: </p>
          <p class="self-info__item--category-text">${data.category}</p>
        </li>
      </ul>
    
    </div>
      <div id="product__item--btn-content" class="product__item--btn-content">
        <div class="product__item--btn info-item">Price: €${data.price}</div>
        <button id = "product__item--btn-cart${
          data.id
        }" class="product__item--btn-cart add-to-cart__self-page">add to cart</button>
        <button class="buy-now">Buy Now</button>
      </div>
    </div>
  </div>`;
}
