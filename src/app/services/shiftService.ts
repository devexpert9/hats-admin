import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class ShiftService{
  constructor(private http:Http){}

  userlisting() {
    return this.http.post('listuser').map((data)=>{
      return data.json();
    }, error => {
      return error.json();
    });
  };  

  IsWorkerAvailable(formdata) {
    return this.http
    .post('isworkeravailableforshift', formdata)
    .map((data) => {
      return data.json();
    }, error => {
      return error.json();
    });
  };

  AvailableUnavailableGuards(formdata) {
    return this.http
     .post('availableUnavailableGuards', formdata)
     .map((data)=>{
       return data.json();
     }, error => {
      return error.json();
    });
  };  

  listLocationsBasedOnShift(formdata) {
    return this.http
       .post('listLocationsBasedOnShift', formdata)
       .map((data)=>{
         return data.json();
       }, error => {
        return error.json();
    });
  };
  
  AdhocShiftsList(formdata) {
    return this.http
       .post('adhocshiftsWeb', formdata)
       .map((data)=>{
         return data.json();
       }, error => {
        return error.json();
    });
  };

  AvailableWorker(formdata) {
    return this.http
       .post('isworkeravailableforshift', formdata)
       .map((data)=>{
         return data.json();
       }, error => {
        return error.json();
    });
  };
  OngoingShiftsList(formdata) {
    return this.http
     .post('ongoingShiftList', formdata)
     .map((data)=>{
       return data.json();
     }, error => {
      return error.json();
    });
  };



  UpdateShiftDetails(formdata, id) {
    return this.http
     .post('updateShiftDetail/' + id, formdata)
     .map((data)=>{
       return data.json();
     }, error => {
      return error.json();
    });
  };

  assignShift(formdata){
    return this.http
     .post('assignShift', formdata)
     .map((data)=>{
       return data.json();
     }, error => {
      return error.json();
    });
  };



 OngoingShiftsListAssigned(formdata){
   return this.http
   .post('currentShiftList', formdata)
   .map((data)=>{
     return data.json();
   }, error => {
    return error.json();
  });
 }

 changeAdminApproval(formdata){
   return this.http
   .post('changeAdminApproval', formdata)
   .map((data)=>{
     return data.json();
   }, error => {
    return error.json();
  });
 }


 UpcomingShiftListWeb(formdata){
   return this.http
   .post('upcomingShiftListWeb', formdata)
   .map((data)=>{
     return data.json();
   }, error => {
    return error.json();
  });
 };

 CurrentShiftUsers(formdata){
   return this.http
   .post('currentShiftUsers', formdata)
   .map((data)=>{
     return data.json();
   }, error => {
    return error.json();
  });
 };



 //api for curent shift 
 currentShift(formdata) {
    return this.http
    .post('currentShift', formdata)
    .map((data) => {
      return data.json();
    }, error => {
      return error.json();
    });
};

 //api for show the listing for the upcoming shifts 
  UpcomingShiftsList(formdata) {
    return this.http
      .post('upcomingShiftList', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
    });
  };


   //api for show the listing for the upcoming shifts 
  OpenShiftsList(formdata) {
    return this.http
      .post('upcomingShiftList', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
    });
  };

  
     //api for show the listing for the upcoming shifts 
  CurrentShiftsList(formdata) {
    return this.http
      .post('currentShiftListWeb', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
    });
  };

  //api for display all shifts
  AllShifts(formdata) {
    return this.http
      .post('allShifts', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };


   //api for display all shifts
  DeleteShift(formdata) {
    return this.http
      .post('deleteShift' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

     //api for display all shifts
  CompletedShifts(formdata) {
    return this.http
      .post('completedShiftList' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };


     //api for display all shifts
  CancelledShifts(formdata) {
    return this.http
      .post('cancelledShiftList' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

       //api for display all shifts
  DashboardCounts(formdata) {
    return this.http
      .post('dashboardCounts' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

         //api for get remarks of all ended, discontiue, not coming shifts
  GetRemarks(formdata) {
    return this.http
      .post('getRemarks' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };





//api for get remarks of all ended, discontiue, not coming shifts
  RoasterShifts(formdata) {
    return this.http
      .post('all_locations' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    //api for get remarks of all ended, discontiue, not coming shifts
  UserRoasterShifts(formdata) {
    return this.http
      .post('userRoaster' , formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  //api for get remarks of all ended, discontiue, not coming shifts
 UserRelatedShifts(formdata) {
   return this.http
     .post('userOngoingShifts' , formdata)
     .map((data) => {
       return data.json();
     }, error => {
       return error.json();
     });
 };



     //api for get remarks of all ended, discontiue, not coming shifts
 ShiftDetail(formdata) {
   return this.http
     .post('shiftDetail' , formdata)
     .map((data) => {
       return data.json();
     }, error => {
       return error.json();
     });
 };



     //api for get remarks of all ended, discontiue, not coming shifts
 AssignedShiftsList(formdata) {
   return this.http
     .post('userAssignedShifts' , formdata)
     .map((data) => {
       return data.json();
     }, error => {
       return error.json();
     });
 };


  //api for get  all ended, discontiue, not coming shifts
  AllShiftsExceptCurrent(formdata) {
   return this.http
     .post('allShiftsExceptCurrent' , formdata)
     .map((data) => {
       return data.json();
     }, error => {
       return error.json();
     });
 };

}; 