import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HolidaysService } from './services/holidays.service';

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
      deps: [HolidaysService],
      useFactory: (holidaysService: HolidaysService) => {
        return () => {
          return holidaysService.readHolidaysFromFile();
        };
      }
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
