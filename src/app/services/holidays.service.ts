import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Holiday } from '../models/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {

  holidays: Holiday[];

  constructor(private readonly http: HttpClient) { }

  readFile(filePath: string) {
    return this.http.get(filePath, { responseType: 'text' });
  }

  getHolidaysForMonthAndYear(month: number, year: number): number[] {
    return this.holidays
      .filter(holiday => holiday.month === month &&
        (holiday.isRepeating || holiday.year === year)
      ).map(holiday => holiday.day);
  }

  async readHolidaysFromFile(): Promise<void> {
    try {
      const dates = (await lastValueFrom(this.readFile('assets/holidays.txt')))
      this.holidays = dates.split(';').map(date => new Holiday(date));
    } catch (e) {
      // handle silently
    }
  }
}
