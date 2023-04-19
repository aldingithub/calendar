import { FormControl } from "@angular/forms";

export interface IDate {
    month: FormControl<number>;
    year: FormControl<number>;
}