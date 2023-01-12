import { Router } from '../router/router';
import { Header } from '../header/header';

export class App {
  router: Router;
  header: Header;
  constructor() {
    this.header = new Header('body');
    this.router = new Router();
  }
}
