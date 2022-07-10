import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ProductModel } from '../model/productModel';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any> | undefined;

  file: any;
  products: ProductModel[] = [];

  productProperty: {key: string, value: string}[] = [
    {key: 'storeId', value: 'Store ID'},
    {key: 'sku', value: 'SKU'},
    {key: 'productName', value: 'Product Name'},
    {key: 'price', value: 'Price'},
    {key: 'date', value: 'Date'}
  ];
  
  searchForm: FormGroup;
  displayedColumns: string[];
  isFilterOn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialog: MatDialog
  ) { 
      this.searchForm = this.fb.group({
        propertyName: ['', [Validators.required]],
        searchValue: ['', [Validators.required]]
      });
      this.displayedColumns = this.productProperty.map((prop) => {return prop.key});
      this.displayedColumns.push('actionButton');
    }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts = () => {

    //if comming from edit and delete with filter on
    if(this.isFilterOn){
      this.findProduct();
    } 
    else {
      this.products = this.productService.getProductList();
    }

    //reset file
    this.file = null;

    //refresh table with updated data
    this.table?.renderRows();
  }

  //on file input change
  onFileSelect(event: any) {
    this.file = event.target.files[0];
  }

  //upload file
  upload() {
    this.productService.uploadFile(this.file, this.getProducts);
  }

  //search
  findProduct() {
    this.products = this.productService.searchProduct(this.searchForm.value);
    this.isFilterOn = true;
  }

  //reset search and view all
  viewAllProduct() {
    this.isFilterOn = false;
    this.getProducts();
    this.searchForm.reset();
    this.searchForm.markAsPristine();
  }
   
  //open edit dialog
  editProduct(product: ProductModel) {

    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: {
        SelectedProduct: product,
        callBackFn: this.getProducts //callback function to refresh table after save 
      }

    })
  }

  //delete
  deleteProduct(product: ProductModel) {
    this.productService.deleteSelectedProduct(product, this.getProducts)
  }

}
