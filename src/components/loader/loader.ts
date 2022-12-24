import { IDataProducts } from "../../types";

export class Loader{
  async load(){
    const data:IDataProducts = await fetch('https://dummyjson.com/products?limit=100').then(res => res.json())
    const productArr = data.products
    return productArr
  }
}