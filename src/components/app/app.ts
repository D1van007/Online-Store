import { Router } from '../router/router';
import { Header } from '../header/header';

export class App {
  router: Router;
  header: Header;
  constructor() {
    this.router = new Router();
    this.header = new Header('body');
  }
}
