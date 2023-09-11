import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { CreateItemComponent } from './components/create-item/create-item.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'items', component: ItemListComponent },
  { path: 'item/:id', component: ItemDetailComponent },
  { path: 'create-item', component: CreateItemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
