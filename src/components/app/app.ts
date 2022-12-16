import { Loader } from "../loader/loader";

import { IDataProducts } from "../../types";
import { GalleryFilter } from "../gallery/gallery_filter";
import { Router } from "../router/router";

export class App{
  loader: Loader
  router: Router
  constructor(){
    this.loader = new Loader()
    this.router = new Router()
  }
  
}