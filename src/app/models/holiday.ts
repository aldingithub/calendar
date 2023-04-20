export class Holiday {
    day: number;
    month: number;
    year: number;
    isRepeating: boolean;

    constructor(date: string) {
        const [holidayDate, holidayRepeatingFlag] = date.split(':');
        [this.day, this.month, this.year] = holidayDate.split('.').map(Number);
        this.isRepeating = holidayRepeatingFlag === '1';
    }
}