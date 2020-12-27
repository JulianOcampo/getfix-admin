import { Injectable } from '@angular/core';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getAdminItem(item: string): Admin {
    return Object.assign(new Admin(), JSON.parse(localStorage.getItem(item)));
  }

  getString(item: string): string {
    return localStorage.getItem(item);
  }
}
