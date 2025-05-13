import { NgModule }            from '@angular/core';
import { BrowserModule }       from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule }    from './app-routing.module';
import { AppComponent }        from './app.component';
import { AssignHoursComponent } from './features/assign-hours/assign-hours-single/assign-hours.component';

@NgModule({
  declarations: [ AppComponent, ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule ,
    AssignHoursComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}