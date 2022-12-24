import { Cart } from '../cart_module/cart';
import { LocalCart } from '../cart_module/localCart';
import './style.css'

export class CartPage {
    cart: Cart
    localCart: LocalCart
    constructor() {
        this.cart = new Cart('main')
        this.localCart = new LocalCart()
        this.localCart.setTotalPrice()
        this.localCart.setTotalProducts()
    }
}
