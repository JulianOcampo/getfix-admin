import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private apiUrl = environment.firebaseFunctionApi.url;
  private sendMessageToDevicePoint = environment.firebaseFunctionApi.sendMessageToDevice;
  private sendMailPoint = environment.firebaseFunctionApi.sendMail;
  private handleError: HandleError;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
  }
  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler

  ) { }

  sendMessageToDevice(to: string, type: string): Observable<any> {
    return this.http.post(this.apiUrl + this.sendMessageToDevicePoint,
      {
        to: to,
        type: type
      }, { observe: 'body', ...this.httpOptions })
  }

  sendEmailToUser(email: string, subject: string, message: string, messageType: string): Observable<any> {
    return this.http.post(this.apiUrl + this.sendMailPoint,
      {
        email: email,
        message: message,
        subject: subject,
        messageType: messageType
      }, { observe: 'body', ...this.httpOptions })
  }
}
