import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { RepoListComponent } from './repo-list/repo-list.component';
import { HttpClientModule } from '@angular/common/http';
import {ApiService} from './services/ApiService.service';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { HowToComponent } from './how-to/how-to.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component'

@NgModule({
  declarations: [
    AppComponent,
    RepoListComponent,
    LoadingScreenComponent,
    HowToComponent,
    NavbarComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
      ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
