import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class LocationService{
  constructor(private http:Http){}

  

    AddLocation(formdata) {
    return this.http
      .post('createLocation', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    GetLocation() {
    return this.http
      .get('getLocations')
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    UpdateLocation(formdata) {
    return this.http
      .post('updateLocation', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

     DeleteLocation(formdata) {
    return this.http
      .post('deleteLocation', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  
   ChangeStatus(formdata) {
    return this.http
      .post('updateClientLocationStatus', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };
  }; 