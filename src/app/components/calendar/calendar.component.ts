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

  daysOfMonth: number[][];
  date: FormGroup<IDate>;

  daysOfWeek: typeof daysOfWeek = daysOfWeek;
  monthsOfYear: typeof monthsOfYear = monthsOfYear;

  get monthCtrl() { return this.date.controls.month }
  get yearCtrl() { return this.date.controls.year }

  ngOnInit(): void {
    this.buildForm();
    this.registerFormListener();
    this.generateMonthDays();
  }

  isSunday(day: number): boolean {
    return new Date(this.yearCtrl.value, this.monthCtrl.value, day).getDay() === 0;
  }

  private buildForm(): void {
    this.date = new FormBuilder().group({
      month: new FormControl(new Date().getMonth(), Validators.required),
      year: new FormControl(new Date().getFullYear(), Validators.compose([Validators.required]))
    })
  }

  private registerFormListener(): void {
    this.date.valueChanges
      .subscribe(_res => {
        if (!this.date.invalid) this.generateMonthDays();
      });
  }

  private generateMonthDays(): void {
    const lastDayOfMonth = new Date(this.yearCtrl.value, +this.monthCtrl.value + 1, 0).getDate();
    const firstDayOfMonth = (new Date(this.yearCtrl.value, this.monthCtrl.value, 1).getDay() + 6) % 7;

    this.daysOfMonth = [];
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

      this.daysOfMonth.push(week);
    }
  }
}
