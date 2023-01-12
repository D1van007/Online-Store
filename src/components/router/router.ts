import { Loader } from '../loader/loader';
import { ProductsPage } from '../products_page/products_page';
import { CartPage } from '../cart/cart_page';
import { searchHandler } from '../search_handler/search_handler';
import { Page404 } from '../404/page404';

export class Router {
  loader: Loader;
  productPage: ProductsPage | null = null;
  isNewPage = true;
  url: URL;
  cartPage: CartPage | null = null;
  page404!: Page404;
  constructor() {
    this.loader = new Loader();
    this.url = new URL(window.location.href);
    this.historyEventTarcker();
    this.newPageRoute();
    this.isNewPage = false;
  }
  historyEventTarcker() {
    window.addEventListener('onpushstate', () => {
      this.historyEventHandler();
    });

    window.addEventListener('popstate', () => {
      this.historyEventHandler();
    });
  }
  historyEventHandler() {
    setTimeout(async () => {
      this.isNewPage = this.isNewPageHandler();
      this.urlUpdate();
      this.clearMain();
      searchHandler.parseUrl(); //тестим серч парамс
      if (this.url.pathname == '/cart') {
        this.cartPage = new CartPage();
      }
      this.productPage?.updateSearchParamsFromURL(); //тестим серч парамс
      await this.newPageRoute();
    }, 0);
  }

  async newPageRoute() {
    if (this.isNewPage) {
      if (this.url.pathname == '/') {
        await this.loadAndCreateProductPage();
      } else if (this.url.pathname == '/cart') {
        this.cartPage = new CartPage();
      } else if ((await this.getProductRouteList()).includes(this.url.pathname)) {
        await this.createItemPage();
      } else {
        this.page404 = new Page404('main');
        // alert('it"s a 404 live with it');
      }
    }
  }

  async getProductRouteList() {
    const data = await this.loader.load();
    return data.reduce((acc: string[], e) => {
      acc.push(`/product${e.id}`);
      return acc;
    }, []);
  }

  async loadAndCreateProductPage() {
    const data = await this.loader.load();
    this.productPage = new ProductsPage('main', data);
  }

  async createItemPage() {
    await this.loadAndCreateProductPage();
    const mainDOM = document.getElementById('main') as HTMLElement;
    mainDOM.innerHTML = '';
    let productItemsArr = this.productPage?.catalog.productsArr;
    const id = parseInt(this.url.pathname.replace(/[^\d]/g, ''));
    productItemsArr = productItemsArr?.filter(e => e.id == id);
    if (productItemsArr) productItemsArr[0].selfPageRender();
  }

  urlUpdate() {
    this.url = new URL(window.location.href);
  }

  isNewPageHandler(): boolean {
    const newUrl = new URL(window.location.href);
    return !(this.url.pathname == newUrl.pathname);
  }

  clearMain() {
    if (this.isNewPage) {
      if (this.productPage) {
        this.productPage.sideFilter?.testRemove(); //без этого сборщий мусора не хочет удалять экземпляр
        this.productPage.sideFilter = null;
      }
      const mainDOM = document.getElementById('main') as HTMLElement;
      mainDOM.innerHTML = '';
    }
  }
}
