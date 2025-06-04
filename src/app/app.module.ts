import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssignHoursComponent } from './features/assign-hours/assign-hours-single/assign-hours.component';

// ✅ IMPORT LOCALE DATA
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt); // ✅ ATTIVA LOCALIZZAZIONE ITALIANA

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AssignHoursComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' } // ✅ IMPOSTA ITALIANO COME LINGUA DEFAULT
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
