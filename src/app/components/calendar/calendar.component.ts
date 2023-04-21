import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Day } from 'src/app/models/day';
import { IDate } from 'src/app/models/idate';
import { CalendarService } from 'src/app/services/calendar.service';
import { dateFormat, dateRegex, daysOfWeek, maxDaysInWeek, maxWeeksInMonth, monthsOfYear } from 'src/app/utils';

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
    private readonly calendarService: CalendarService) { }

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
    // customChoosenDate by default set to today date
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
    const lastDayOfMonth = this.calendarService.getLastDayOfMonth(this.yearCtrl.value, this.monthCtrl.value)
    const firstDayOfMonth = this.calendarService.getFirstDayOfMonth(this.yearCtrl.value, this.monthCtrl.value);
    const holidaysForMonthAndYear = this.calendarService
      .getHolidaysForMonthAndYear(+this.monthCtrl.value + 1, +this.yearCtrl.value);

    this.daysOfMonthInYear = [];
    let dayOfCurrentMonth = 1;
    let dayOfNextMonth = 1;
    let dayOfPrevisiousMonth = this.calendarService.getLastDayOfMonth(this.yearCtrl.value, +this.monthCtrl.value - 1);

    for (let weekOfMonth = 0; weekOfMonth < maxWeeksInMonth; weekOfMonth++) {
      const week: Day[] = [];

      for (let dayOfWeek = 0; dayOfWeek < maxDaysInWeek; dayOfWeek++) {
        if (weekOfMonth === 0 && dayOfWeek < firstDayOfMonth) { // days from previsious month
          week[firstDayOfMonth - dayOfWeek - 1] = new Day(dayOfPrevisiousMonth--);
        } else if (dayOfCurrentMonth > lastDayOfMonth) { // days from next month
          week.push(new Day(dayOfNextMonth++));
        } else { // days of current month
          week.push(
            new Day(
              dayOfCurrentMonth,
              this.calendarService.isSunday(this.yearCtrl.value, this.monthCtrl.value, dayOfCurrentMonth), // checks if date is on sunday
              holidaysForMonthAndYear.includes(dayOfCurrentMonth++), // checks if date is holiday
              true)); // checks if day is from currently viewed month
        }
      }

      this.daysOfMonthInYear.push(week);
    }
  }
}
