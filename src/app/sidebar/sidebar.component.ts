import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/loginService';
import { CoreService } from '../services/coreService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  imageURL: any;
  profile: any;
  name: any;
  private _opened: boolean = true;

  constructor(public loginService: LoginService, public router: Router, public coreService: CoreService) {
    this.getAdminProfile();
    this.imageURL = 'http://13.59.189.135:3002/images/';
//     this.coreService.toggleSidebar.subscribe(() => {
//   //open your sidebar by setting classes, whatever

//     $(#sidebar).toggleClass('show collapse');

// });

}

ngOnInit() {}

getAdminProfile() {
  var profileData = {
    adminId: localStorage.getItem('adminId')
  };
  this.loginService.GetProfile(profileData).subscribe((response) => {
    console.log(response);
    this.profile = response.data[0];
  })
};



checkActiveTab(name){
  console.log(name);
  this.name = name;
  if(name == 'dash'){
       this.router.navigateByUrl('/dashboard');
        // this.router.navigate(['/', 'dashboard']);
        // this.router.navigateByUrl('/dashboard', { skipLocationChange: true });
      }else  if(name == 'avail'){
       this.router.navigateByUrl('/available');
     }else  if(name == 'guard'){
       this.router.navigateByUrl('/security-guard');
     }else  if(name == 'addShift'){
       this.router.navigateByUrl('/add-shift');
     }else  if(name == 'adhoc'){
       this.router.navigateByUrl('/broadcast-shift');
     }else  if(name == 'current'){
       this.router.navigateByUrl('/current-shifts');
     }else  if(name == 'open'){
       this.router.navigateByUrl('/open-shift');
     }else  if(name == 'ongoing'){
      this.router.navigateByUrl('/ongoing');
    }else  if(name == 'upcoming'){
      this.router.navigateByUrl('/upcoming-shifts');
    }else  if(name == 'report'){
      this.router.navigateByUrl('/reports');
    }else  if(name == 'profile'){
      this.router.navigateByUrl('/profile');
    }else  if(name == 'completed'){
      this.router.navigateByUrl('/completed-shifts');
    }else  if(name == 'cancelled'){
      this.router.navigateByUrl('/cancelled-shifts');
    }else  if(name == 'requestedguard'){
      this.router.navigateByUrl('/requested-guards');
    }

    window.scrollTo(0, 0);
  }

}
