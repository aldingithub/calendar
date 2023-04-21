export class Holiday {
    day: number;
    month: number;
    year: number;
    isRepeating: boolean;
    holidayName: string;

    constructor(date: string) {
        const [holidayDate, holidayRepeatingFlag, holidayName] = date.split(':');
        [this.day, this.month, this.year] = holidayDate.split('.').map(Number);
        this.isRepeating = holidayRepeatingFlag === '1';
        this.holidayName = holidayName;
    }
}