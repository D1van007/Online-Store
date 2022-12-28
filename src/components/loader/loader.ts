import { IDataProducts } from '../../types';

export class Loader{
  async load(){
    const response:Response = await fetch('https://dummyjson.com/products?limit=100')
    const data:IDataProducts = await response.json()
    const productArr = data.products
    return productArr
  }
}
