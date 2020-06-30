import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payroll-setting',
  templateUrl: './payroll-setting.component.html',
  styleUrls: ['./payroll-setting.component.css']
})



export class PayrollSettingComponent implements OnInit {
	payroll:any;

	constructor(public securityService: SecurityService, public spinnerService: Ng4LoadingSpinnerService, public toastr: ToastrService) { 

		this.spinnerService.show();

		var Data = {
			adminId: localStorage.getItem('adminId'),
		};
		this.securityService.getpayRollSettings(Data).subscribe((response) => {
			console.log(response)
			this.payroll = response.data;
			this.spinnerService.hide();
		});
	}

	ngOnInit() {
		window.scrollTo(0, 0);
	}

	save(payroll){
		this.spinnerService.show();

		var data = {
			day: payroll.day,
			night: payroll.night,
			sat: payroll.sat,
			sun: payroll.sun, 
			public: payroll.public,
			id: this.payroll._id,
			day_end_hours: payroll.day_end_hours,
			day_start_hours: payroll.day_start_hours
		};
		this.securityService.updatepayRollSettings(data).subscribe((response) => {
			console.log(response)
			//this.payroll = response.data;
			this.spinnerService.hide();
			this.toastr.success('Payroll setting has been updated successfully.');
		});
	}

}
