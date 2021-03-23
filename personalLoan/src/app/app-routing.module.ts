import { verifyHostBindings } from '@angular/compiler';
import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import {AppComponent} from "./app.component"
import {VerifyComponent} from "./verify/verify.component"

const routes: Routes = [ 
  {
    path:"verify",
    component :VerifyComponent,
    
    
  },
  {
    path:"",
    redirectTo:"verify",
    pathMatch:"full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
