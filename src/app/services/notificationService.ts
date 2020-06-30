import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class NotificationService{
  constructor(private http:Http){}

  GetNotifications(formdata) {
    return this.http
       .post('getAdminNotifications', formdata)
       .map((data)=>{
         return data.json();
       }, error => {
        return error.json();
    });
  };  

  GetAdminNotifications(formdata) {
    return this.http
       .post('adminSentNotification', formdata)
       .map((data)=>{
         return data.json();
       }, error => {
        return error.json();
    });
  }; 


    GetLogs(formdata) {
    return this.http
       .get('getLogs', formdata)
       .map((data)=>{
         return data.json();
       }, error => {
        return error.json();
    });
  };  
}