import { IDataProducts } from "../../types";

export class Loader{
  async load(){
    let data:IDataProducts = await fetch('https://dummyjson.com/products?limit=100').then(res => res.json())
    let productArr = data.products
    return productArr
  }
}