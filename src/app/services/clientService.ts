import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ClientService{
  constructor(private http:Http){}

  

    AddClient(formdata) {
    return this.http
      .post('createClient', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    GetClients() {
    return this.http
      .get('getClients')
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    UpdateClient(formdata, id) {
    return this.http
      .post('updateClient/' + id, formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

     DeleteClient(formdata) {
    return this.http
      .post('deleteClient', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  //contact us cms page api
  GetContacts(formdata) {
    return this.http
      .post('getContacts', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  AddContact(formdata) {
    return this.http
      .post('addNewContact', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  UpdateContact(formdata) {
    return this.http
      .post('updateContact', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  DeleteContact(formdata) {
    return this.http
      .post('deleteContact', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  ChangeStatus(formdata) {
    return this.http
      .post('updateStatus', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  UpdateMainLocation(formdata) {
   return this.http
     .post('updateMainLocation', formdata)
     .map((data) => {
       return data.json();
     }, error => {
       return error.json();
     });
 };
  }; 