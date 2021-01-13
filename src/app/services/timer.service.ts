import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private time: string;
  private hours: number;
  private minutes: number;
  private seconds: number;

  constructor() { }

  setTime(startDate: number) {
    let result = Date.now() - startDate;
    this.hours = Math.floor((result % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((result % (1000 * 60)) / 1000);
    this.time = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
  }

  getTime(): string {
    return this.time;
  }
  
  getSeconds(): number {
    return this.seconds;
  }

}
