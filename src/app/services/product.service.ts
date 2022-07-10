import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductModel } from '../model/productModel';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productList: ProductModel[] = [];
  private selectedProduct: ProductModel = {};

  constructor(private http: HttpClient) { }

  getProductList(): ProductModel[] {
    return this.productList;
  }

 uploadFile(file: any, onUploadSuccess: Function) {
    //read csv file
    let fileReader:FileReader = new FileReader();
    fileReader.readAsText(file);
     fileReader.onload = () => {
      const csv = fileReader.result;
      this.csvToJson(csv);
      //call success callback
      onUploadSuccess();
    //post json data
    // this.http.post('http://127.0.0.1:3000/upload', jsonData)
    // .subscribe((res) => {
    //   console.log(res)
    // })
    }
    
    
  }

  searchProduct(params: {propertyName: keyof ProductModel, searchValue: string}): ProductModel[] {
    return this.productList.filter((product) => {
      if(params.propertyName == 'date') {
        return moment(product.date).format('MM-DD-YYYY') == moment(params.searchValue).format('MM-DD-YYYY');
      }
      return product[params.propertyName] == params.searchValue
    })
  }

  //save edited value in product array
  updateProduct(updatedValues: ProductModel) {
    this.productList = this.productList.map((product) => {
      if (product.id == updatedValues.id) {
        return updatedValues;
      } else return product;
    })
  }

  deleteSelectedProduct(selectedProduct: ProductModel, callBackFn: Function) {

    //find index in product array for delete
    const index = this.productList.findIndex((product) => {
      return product.id == selectedProduct.id;
    });

    //remove found item from array
    if(index !== -1){
      this.productList.splice(index, 1);
    }

    callBackFn(); //callback after delete
  }

  //convert SVG to json
  csvToJson(csvData: any){
    //split csv rows
    let csvDataArr = csvData.split(/\r?\n/);

    //get first row as header
    let csvHeaderString = csvDataArr.splice(0,1)[0];
    let csvHeader: (keyof ProductModel)[] = csvHeaderString.split(',');
    
    //iterate through array to create json object
    for(const item of csvDataArr){
      let jsonObj: ProductModel = {};
      let tempArr = item.split(',');
      for(let i=0; i<csvHeader.length;i++){
        
        jsonObj['id'] = Math.floor(Math.random()*99999)+10000;//generate unique id for each product
        if(csvHeader[i])
          jsonObj[csvHeader[i]] = csvHeader[i]== 'date' ? new Date(tempArr[i]) : tempArr[i] ;
      }
      //push to existing product array
      this.productList.push(jsonObj);
    }
  }
}
 