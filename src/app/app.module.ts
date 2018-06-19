import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ComponentsModule } from './components/components.module';
import { ServicesModule } from './services/services.module';


if ( environment.production ) {
  enableProdMode();
}

@NgModule( {
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    ServicesModule,
    MaterialModule,
    SharedModule.forRoot()
  ],
  entryComponents: [ DialogComponent ],
  bootstrap: [ AppComponent ],
} )
export class AppModule {
}
