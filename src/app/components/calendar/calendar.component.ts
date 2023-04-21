import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Day } from 'src/app/models/day';
import { IDate } from 'src/app/models/idate';
import { HolidaysService } from 'src/app/services/holidays.service';
import { dateFormat, dateRegex, daysOfWeek, monthsOfYear } from 'src/app/utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  daysOfMonthInYear: Day[][];
  monthAndYearForm: FormGroup<IDate>;
  customChoosenDateCtrl: FormControl<string>;
  customDateInvalid: boolean;

  daysOfWeek: typeof daysOfWeek = daysOfWeek;
  monthsOfYear: typeof monthsOfYear = monthsOfYear;

  constructor(
    private readonly datePipe: DatePipe,
    private readonly holidaysService: HolidaysService) { }

  get monthCtrl() { return this.monthAndYearForm.controls.month }
  get yearCtrl() { return this.monthAndYearForm.controls.year }

  ngOnInit(): void {
    this.buildForm();
    this.registerFormListener();
    this.generateMonthDays();
    this.prepareCustomDate();
  }

  adjustCalendarToChoosenDate(): void {
    const [_newDay, newMonth, newYear] = this.customChoosenDateCtrl.value.split('.').map(Number);

    this.customDateInvalid = (newMonth < 1 || newMonth > 12);
    if (this.customDateInvalid) { return; }

    this.monthAndYearForm.patchValue({
      month: newMonth - 1,
      year: newYear
    })
  }

  private prepareCustomDate(): void {
    this.customChoosenDateCtrl = new FormControl(
      this.datePipe.transform(new Date(), dateFormat),
      [Validators.required, Validators.pattern(dateRegex)]
    )
  }

  private buildForm(): void {
    this.monthAndYearForm = new FormBuilder().group({
      month: new FormControl(new Date().getMonth(), Validators.required),
      year: new FormControl(new Date().getFullYear(), [Validators.required, Validators.max(9999)])
    });
  }

  private registerFormListener(): void {
    // regenarate days of month for every change of monthAndYear if form is valid
    this.monthAndYearForm.valueChanges
      .subscribe(_res => {
        if (!this.monthAndYearForm.invalid) this.generateMonthDays();
      });
  }

  private generateMonthDays(): void {
    const lastDayOfMonth = this.getLastDayOfMonth(this.monthCtrl.value)
    const firstDayOfMonth = this.getFirstDayOfMonth(this.monthCtrl.value);
    const holidaysForMonthAndYear = this.holidaysService
      .getHolidaysForMonthAndYear(+this.monthCtrl.value + 1, +this.yearCtrl.value);

    this.daysOfMonthInYear = [];
    let dayOfMonth = 1;

    for (let i = 0; i < 6; i++) {
      const week: Day[] = [];

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (i === 0 && dayOfWeek < firstDayOfMonth) {
          week.push(null);
        } else if (dayOfMonth > lastDayOfMonth) {
          week.push(null);
        } else {
          week.push(
            new Day(
              dayOfMonth,
              this.isSunday(dayOfMonth), // checks if date is on sunday
              holidaysForMonthAndYear.includes(dayOfMonth))); // checks if date is holiday
          dayOfMonth++;
        }
      }

      this.daysOfMonthInYear.push(week);
    }
  }

  private isSunday(day: number): boolean {
    return new Date(this.yearCtrl.value, this.monthCtrl.value, day).getDay() === 0;
  }

  private getFirstDayOfMonth(month: number): number {
    return (new Date(this.yearCtrl.value, month, 1).getDay() + 6) % 7
  }

  private getLastDayOfMonth(month: number): number {
    return new Date(this.yearCtrl.value, month + 1, 0).getDate();
  }
}
