import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: 'mobilenet', component: MainComponent },
  {path: 'resnet', component: MainComponent},
  {path: '', redirectTo: 'mobilenet', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
