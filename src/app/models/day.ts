export class Day {
    value: number;
    isSunday = false;
    isHoliday = false;
    isCurrentlyViewedMonth = false;
    description = '';

    constructor(day: number, isSunday?: boolean, isHoliday?: boolean, desc?: string, isCurrentMonth?: boolean) {
        this.value = day;
        this.isSunday = isSunday;
        this.isHoliday = isHoliday;
        this.isCurrentlyViewedMonth = isCurrentMonth;
        this.description = desc;
    }
}
