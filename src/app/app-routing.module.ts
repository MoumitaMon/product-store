import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "edit", component: EditProductComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
