import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { CreateItemComponent } from './components/create-item/create-item.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './components/account/account.component';
import { ToastrModule } from 'ngx-toastr';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemListComponent,
    CreateItemComponent,
    RegisterComponent,
    LandingComponent,
    HeaderComponent,
    LoginComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
      newestOnTop: true,
      tapToDismiss: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
