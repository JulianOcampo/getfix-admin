import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private time: string;

  constructor() { }

  setTime(startDate: number) {
    let result = Date.now() - startDate;
    let hours = Math.floor((result % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((result % (1000 * 60)) / 1000);
    this.time = `${hours}:${minutes}:${seconds}`;
  }

  getTime(): string {
    return this.time;
  }

}
