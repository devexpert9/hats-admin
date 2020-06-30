import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ManagerService{
  constructor(private http:Http){
  }  

  AddManager(formdata) {
    return this.http
      .post('createManager', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  GetManagers() {
    return this.http
      .get('getManagers')
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  UpdateManager(formdata) {
    return this.http
      .post('updateManager', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

 DeleteManager(formdata) {
    return this.http
      .post('deleteManager', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  
   ChangeStatus(formdata) {
    return this.http
      .post('updateManagerStatus', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };





//permissions 

AddPermissions(formdata) {
    return this.http
      .post('createPermission', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  GetPermissions() {
    return this.http
      .get('getPermissions')
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  UpdatePermissions(formdata) {
    return this.http
      .post('updatePermission', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };



}; 