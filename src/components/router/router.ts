import { eventedPushState } from "./events_history";
import { Loader } from "../loader/loader";
import { IDataProducts } from "../../types";
import { GalleryFilter } from "../gallery/gallery_filter";


export class Router{
  loader:Loader
  galleryFilter:GalleryFilter|null
  isNewPage:boolean = true
  url:URL
  constructor(){
    this.loader = new Loader()
    this.galleryFilter = null
    this.url = new URL(window.location.href)
    this.historyEventTarcker()
    this.newPageRoute()
    this.isNewPage = false
  }
  historyEventTarcker(){
    document.addEventListener('onpushstate', ()=>{
      console.log('state_push')
      setTimeout(async()=>{
        this.isNewPage = this.isNewPageHandler()
        console.log(this.isNewPage)
        this.urlUpdate()
        this.clearMain()
        await this.newPageRoute()
      },200)
    })
    
    window.addEventListener('popstate', ()=>{
      setTimeout(async()=>{
        this.isNewPage = this.isNewPageHandler()
        console.log(this.isNewPage)
        this.urlUpdate()
        this.clearMain()
        await this.newPageRoute()
      },200)
    })
  }
  async newPageRoute(){
    if(this.isNewPage){
      if(this.url.pathname == '/'){
        console.log('router')
        this.loadAndCreateGallery()
      }
    }
  }

  async loadAndCreateGallery(){
    let data:IDataProducts = await this.loader.load()
    let productArr = data.products
    this.galleryFilter = new GalleryFilter('gallery',productArr)
  }

  urlUpdate(){
    this.url = new URL(window.location.href)
  }

  isNewPageHandler():boolean{
    let newUrl = new URL(window.location.href)
    console.log(this.url.pathname, newUrl.pathname)
    return !(this.url.pathname == newUrl.pathname)
  }

  clearMain(){
    if(this.isNewPage){
      let $gallery = document.getElementById('gallery')!
      $gallery.innerHTML = ''
    }
  }

}
