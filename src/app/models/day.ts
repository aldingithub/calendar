export class Day {
    day: number;
    isSunday: boolean;
    isHoliday: boolean;

    constructor(day: number, isSunday: boolean, isHoliday: boolean) {
        this.day = day;
        this.isSunday = isSunday;
        this.isHoliday = isHoliday;
    }
}
