import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatToolbarModule, MatInputModule, MatListModule} from '@angular/material';
import { HttpClientModule} from '@angular/common/http'
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Web3Service } from './web3.service'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, MatButtonModule, MatCardModule, MatToolbarModule, MatInputModule, MatListModule, HttpClientModule, HttpModule
  ],
  providers: [Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
