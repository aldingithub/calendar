import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IDate } from 'src/app/models/idate';
import { daysOfWeek, monthsOfYear } from 'src/app/utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  daysOfMonthInYear: number[][];
  monthAndYearForm: FormGroup<IDate>;
  customChoosenDateCtrl: FormControl<string>;

  daysOfWeek: typeof daysOfWeek = daysOfWeek;
  monthsOfYear: typeof monthsOfYear = monthsOfYear;

  constructor(private readonly datePipe: DatePipe) { }

  get monthCtrl() { return this.monthAndYearForm.controls.month }
  get yearCtrl() { return this.monthAndYearForm.controls.year }

  ngOnInit(): void {
    this.buildForm();
    this.registerFormListener();
    this.generateMonthDays();
    this.prepareCutomDate();
  }

  isSunday(day: number): boolean {
    return new Date(this.yearCtrl.value, this.monthCtrl.value, day).getDay() === 0;
  }

  adjustCalendarToChoosenDate(): void {
    const dateAsArray = this.customChoosenDateCtrl.value.split('.');
    this.monthAndYearForm.patchValue({
      month: +dateAsArray[1] - 1,
      year: +dateAsArray[2]
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

    this.daysOfMonthInYear = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          week.push(null);
        } else if (day > lastDayOfMonth) {
          week.push(null);
        } else {
          week.push(day);
          day++;
        }
      }

      this.daysOfMonthInYear.push(week);
    }
  }
}
