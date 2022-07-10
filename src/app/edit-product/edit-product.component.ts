import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductModel } from '../model/productModel';
import { ProductService } from '../services/product.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  product: ProductModel;
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      SelectedProduct: ProductModel,
      callBackFn: Function
    }  
  ) { 
    this.product = data.SelectedProduct;
    this.editForm = this.fb.group({
      id: [this.product.id],
      storeId: [this.product.storeId],
      sku: [this.product.sku],
      productName: [this.product.productName],
      price: [this.product.price],
      date: [this.product.date ? moment(this.product.date).format('MM-DD-YYYY'): null]
    })
  }

  ngOnInit(): void {
    
  }

  save(){
    this.productService.updateProduct(this.editForm.value);
    this.dialogRef.close();

    //update table after save
    this.data.callBackFn();
  }
  

}
