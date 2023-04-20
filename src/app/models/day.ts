export class Day {
    value: number;
    isSunday: boolean;
    isHoliday: boolean;

    constructor(day: number, isSunday: boolean, isHoliday: boolean) {
        this.value = day;
        this.isSunday = isSunday;
        this.isHoliday = isHoliday;
    }
}
