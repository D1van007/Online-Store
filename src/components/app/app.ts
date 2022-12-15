import { Loader } from "../loader/loader";
import { IDataProducts } from "../../types";
import { Gallery } from "../gallery/gallery";
import { GalleryFilter } from "../gallery/gallery_filter";

export class App{
  loader: Loader
  constructor(){
    this.loader = new Loader()
    this.test()
  }
  async test(){
    let data:IDataProducts = await this.loader.load()
    let productArr = data.products
    let galleryFilter = new GalleryFilter('gallery',productArr)
  }
}