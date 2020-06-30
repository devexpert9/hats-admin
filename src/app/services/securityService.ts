import {Http,URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class SecurityService{
  constructor(private http:Http){}

 SecurityGuardsList(formdata) {
 return this.http
   .post('securityGuardsList', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
};

ChangeStatus(formdata){
  return this.http.post('update_holiday_status', formdata).map((data)=>{
    return data.json();
  }, error => {
    return error.json();
  });
};


 LatestSecurityGuardsList(formdata) {
 return this.http
   .post('getLatestGuards', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
};



 RequestedSecurityGuardsList(formdata) {
 return this.http
   .post('requestedSecurityGuardsList', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}; 

ChangeStatusForGuards(formdata) {
 return this.http
   .post('changeStatus', formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
} 

UpdateSecurityGuardDetails(formdata, id) {
 return this.http
   .put('updateSecurityGuard/'+ id, formdata)
     .map((data)=>{
           return data.json();
     }, error => {
        return error.json();
     });
}

AddSecurityGuardDetails(formdata) {
    return this.http
      .post('applyNewSecurityGuard', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  }

   SecurityGuardProfile(formdata) {
    return this.http
      .post('securityGuardProfile', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  }




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

     DeleteGuard(formdata) {
    return this.http
      .post('deleteSecurityGuard', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };



  
       ChangeActiveInactiveStatusForGuards(formdata) {
    return this.http
      .post('changeActiveInactiveStatus', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };


       CreateReminders(formdata) {
    return this.http
      .post('createReminders', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

         GetReminders(formdata) {
    return this.http
      .post('getReminders', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };


       UpdateReminders(formdata) {
    return this.http
      .post('updateReminders', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  DeleteNotification(formdata) {
    return this.http
      .post('deleteNotification', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };



    AddHoliday(formdata) {
    return this.http
      .post('createHoliday', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    GetHoliday() {
    return this.http
      .get('getHolidays')
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

    UpdateHoliday(formdata) {
    return this.http
      .post('updateHoliday', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

     DeleteHoliday(formdata) {
    return this.http
      .post('deleteHoliday', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

   addpayRollSettings(formdata) {
    return this.http
      .post('createPayrollSetting', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  getpayRollSettings(formdata) {
    return this.http
      .get('getPayrollSetting', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  updatepayRollSettings(formdata) {
    return this.http
      .post('updatePayrollSetting', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };


  
  AssignRapidId(formdata) {
    return this.http
      .post('setIdtoGuard', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };

  
  GetTrashGuards(formdata) {
    return this.http
      .post('usersTrash', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };
  
  moveRestoreGuradFromTrash(formdata) {
    return this.http
      .post('userMoveRestoreTrash', formdata)
      .map((data) => {
        return data.json();
      }, error => {
        return error.json();
      });
  };


}