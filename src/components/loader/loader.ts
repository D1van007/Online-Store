export class Loader{
  async load(){
    let data = await fetch('https://dummyjson.com/products?limit=100').then(res => res.json())
    //let data2 = await fetch('https://jhske-qvzeu.run-eu-central1.goorm.io:3000').then(res => res.json())
    //console.log(data2)
    return data
  }
}