export class Day {
    value: number;
    isSunday = false;
    isHoliday = false;
    isCurrentlyViewedMonth = false;

    constructor(day: number, isSunday?: boolean, isHoliday?: boolean, isCurrentMonth?: boolean) {
        this.value = day;
        this.isSunday = isSunday;
        this.isHoliday = isHoliday;
        this.isCurrentlyViewedMonth = isCurrentMonth;
    }
}
