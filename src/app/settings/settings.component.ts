import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
	reminder: any;
	ongoing: any;
	admin : any;
	array: any;
	reminderValues: any;

	constructor(public securityService: SecurityService, public spinnerService: Ng4LoadingSpinnerService, public toastr: ToastrService) { 

		this.array = [
		{	'id':1,
			'title':'15 mins',
			'value': 'min',
			'minutes': '15'
		},
		{	'id':2,
			'title':'30 mins',
			'value': 'min',
			'minutes': '30'
		},
		{	'id':3,
			'title':'45 mins',
			'value': 'min',
			'minutes': '45'
		},
		{	'id':4,
			'title':'1 hour',
			'value': 'hr',
			'minutes': '60'
		},
		{	'id':5,
			'title':'1:15 hours',
			'value': 'hr',
			'minutes': '75'
		},
		{	'id':6,
			'title':'1:30 hours',
			'value': 'hr',
			'minutes': '90'
		}];
		this.getRemindersValue();

	}

	ngOnInit() {
		window.scrollTo(0, 0);
	}

	getRemindersValue(){
		this.spinnerService.show();
			var Data = {
			adminId: localStorage.getItem('adminId'),
		};
		this.securityService.GetReminders(Data).subscribe((response) => {
			console.log(response);
			this.reminderValues = response.data;
			this.reminder = this.reminderValues.reminder;
		this.admin = this.reminderValues.admin;
		this.ongoing = this.reminderValues.ongoing;
			this.spinnerService.hide();
		})
	}

	onSelectionChange(value, reminderOption){
		console.log(value, reminderOption)
		var exactMin = value.minutes;
		if(reminderOption == 'reminder'){
			this.reminder = exactMin;
		}else if( reminderOption == 'ongoing'){
			this.ongoing = exactMin;
		}else{
			this.admin = exactMin;
		}

		console.log(this.reminder, this.ongoing, this.admin);	

	};

	SaveReminders(){
		this.spinnerService.show();
		console.log(this.reminder, this.ongoing, this.admin);	
		// var Data = {
		// 	reminder: this.reminder,
		// 	ongoing: this.ongoing,
		// 	admin: this.admin
		// };
		// this.securityService.CreateReminders(Data).subscribe((response) => {
		// 	console.log(response);
		// 	this.spinnerService.hide();
		// })

		var Data = {
			id: this.reminderValues._id,
			reminder: this.reminder,
			ongoing: this.ongoing,
			admin: this.admin
		};
		this.securityService.UpdateReminders(Data).subscribe((response) => {
			console.log(response);
			this.toastr.success('Reminder setting has been updated successfully.');
			this.spinnerService.hide();
		})
	};

	allFieldsValueCheck(){
		if(this.reminder == undefined && this.ongoing == undefined &&  this.admin == undefined){
			return false;
		}else{
			return true;
		}
	}
};

