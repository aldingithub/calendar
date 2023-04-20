import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Day } from 'src/app/models/day';
import { Holiday } from 'src/app/models/holiday';
import { IDate } from 'src/app/models/idate';
import { HolidaysService } from 'src/app/services/holidays.service';
import { daysOfWeek, monthsOfYear } from 'src/app/utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  daysOfMonthInYear: Day[][];
  monthAndYearForm: FormGroup<IDate>;
  customChoosenDateCtrl: FormControl<string>;

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
    this.prepareCutomDate();
  }

  adjustCalendarToChoosenDate(): void {
    const [newMonth, newYear] = this.customChoosenDateCtrl.value.split('.');
    this.monthAndYearForm.patchValue({
      month: Number(newMonth) - 1,
      year: Number(newYear)
    })
  }

  private prepareCutomDate(): void {
    this.customChoosenDateCtrl = new FormControl(
      this.datePipe.transform(new Date(), 'dd.MM.yyyy'),
      [Validators.required, Validators.pattern(/^\d{1,2}\.\d{1,2}\.\d{4}$/)]
    )
  }

  private buildForm(): void {
    this.monthAndYearForm = new FormBuilder().group({
      month: new FormControl(new Date().getMonth(), Validators.required),
      year: new FormControl(new Date().getFullYear(), [Validators.required, Validators.max(9999)])
    });
  }

  private registerFormListener(): void {
    this.monthAndYearForm.valueChanges
      .subscribe(_res => {
        if (!this.monthAndYearForm.invalid) this.generateMonthDays();
      });
  }

  private generateMonthDays(): void {
    const lastDayOfMonth = new Date(this.yearCtrl.value, +this.monthCtrl.value + 1, 0).getDate();
    const firstDayOfMonth = (new Date(this.yearCtrl.value, this.monthCtrl.value, 1).getDay() + 6) % 7;
    const holidaysForMonthAndYear = this.holidaysService
      .getHolidaysForMonthAndYear(+this.monthCtrl.value + 1, +this.yearCtrl.value);

    this.daysOfMonthInYear = [];
    let dayOfMonth = 1;

    for (let i = 0; i < 6; i++) {
      const week: Day[] = [];

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          week.push(null);
        } else if (dayOfMonth > lastDayOfMonth) {
          week.push(null);
        } else {
          week.push(
            new Day(
              dayOfMonth,
              this.isSunday(dayOfMonth),
              holidaysForMonthAndYear.includes(dayOfMonth)));
          dayOfMonth++;
        }
      }

      this.daysOfMonthInYear.push(week);
    }
  }

  private isSunday(day: number): boolean {
    return new Date(this.yearCtrl.value, this.monthCtrl.value, day).getDay() === 0;
  }
}
