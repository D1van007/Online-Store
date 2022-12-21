import { Cart } from '../cart_module/cart';
import { SumCart } from '../cart_module/sum_cart';
import './style.css'
// const content = new Content();
 
export class CartPage {
    cart: Cart
    constructor () {
        this.cart = new Cart('main')
        this.cart.creatCartContent ()
        this.cart.render()
        this.cart.productList = this.cart.main.querySelector('.shopping-cart_list')!
        this.cart.renderItemInCart ()
        this.cart.renderSumInCart ()
        this.cart.totalProducts ()
        this.cart.totalPrice ()
    }
}
