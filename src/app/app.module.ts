import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CalendarService } from './services/calendar.service';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [CalendarService],
      useFactory: (calendarService: CalendarService) => {
        return () => {
          return calendarService.readHolidaysFromFile();
        };
      }
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
