import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Holiday } from '../models/holiday';
import { pathToFileWithHolidays } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {

  holidays: Holiday[];

  constructor(private readonly http: HttpClient) { }

  getHolidaysForMonthAndYear(month: number, year: number): number[] {
    return this.holidays
      .filter(holiday => holiday.month === month &&
        (holiday.isRepeating || holiday.year === year)
      ).map(holiday => holiday.day);
  }

  async readHolidaysFromFile(): Promise<void> {
    try {
      const dates = (await lastValueFrom(this.readFile()))
      this.holidays = dates.split(';').map(date => new Holiday(date));
    } catch (e) {
      // handle silently
    }
  }

  private readFile(): Observable<string> {
    return this.http.get(pathToFileWithHolidays, { responseType: 'text' });
  }

}