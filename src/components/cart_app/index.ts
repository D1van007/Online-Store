import setLocalStorage from '../../components/local_temp/index'
import createDom from '../../components/cart_items/index';
import { Cart } from '../cart_test/cart';
import { SumCart } from '../cart_test/sum_cart';
// const content = new Content();
 
export class App {
    cart: Cart
    constructor () {
        this.run()
        this.cart = new Cart('main')
        this.cart.creatCartContent ()
        this.cart.render()
        this.cart.productList = this.cart.main.querySelector('.shopping-cart_list')!
        this.cart.renderItemInCart ()
        this.cart.renderSumInCart ()
        this.cart.sumAmountItems ()
        this.cart.sumAmountPrice ()
    }

run () {
    console.log('App1')
    setLocalStorage() 
}
}
