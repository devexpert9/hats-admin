import{	Component,	OnInit}from '@angular/core';
import{	ShiftService}from '../services/shiftService';
import{	Ng4LoadingSpinnerService}from 'ng4-loading-spinner';
import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';
import{	SecurityService}from '../services/securityService';
declare var jsPDF: any;

@Component(
{
	selector: 'app-payroll',
	templateUrl: './payroll.component.html',
	styleUrls: ['./payroll.component.css']
})

export class PayrollComponent implements OnInit
{

	ShiftsList: any;
	rows: any;
	temp: any;
	formParseDate: any;
	shiftStartDate: any;
	tomorrow: any;
	fromDate: any;
	shiftEnd: any;
	shiftStartDateParse: any;
	workloadDate: any;
	workloadEndDate: any;
	shiftEndDateParse: any;
	today: any;
	parseDate: any;
	shiftEndDate: any;
	maxdate: any;
	titles: any;
	pdfSrc: any;
	payroll: any;
	holidays: any;
	temp1: any;
	temp3: any;
	temp4: any;
	temp2: any;

	sHours: any;
	sMinutes: any;
	hours: any;
	hours1: any;
	minutes: any;
	payrollEnd: any;
	payrollStart: any;
	payrollHours: any;
	payrollHoursDiffrence: any;
	calculatedMinutes: any;
	calculatedHours: any;
	// calculateAmount: any;
	dayArray: any;
	days: any;
	dayName: any;
	daysHours: any;
	nightHours: any;
	satHours: any;
	sunHours: any;
	division: any;
	modulo: any;
	a: any;
	shiftStartTime: any;

	shiftEndTime: any;
	pHolidayHours: any;
	shiftHours: any;
	nightHoursGet: any;
	nightHoursDiffrence: any;
	currentWorkoutDate: any;
	shiftHoursDiffrence: any;
	nightMinutesGet: any;
	parseStartDate: any;
	parseEndDate: any;
	// calculateHours: any;
	payrollMInutes: any;
	shiftMinutes: any;
	day: any;
	night: any;
	totalHours: any;
	totalAmount: any;
	hoursAmount: any;
	OneMinutesAmount: any;
	minutesAmount: any;
	amount: any;
	mindate: any;
	endDate: any;
	startDate: any;



	constructor(public shiftService: ShiftService, public spinnerService: Ng4LoadingSpinnerService, public securityService: SecurityService)
	{
		this.ShiftsList = [];
		this.holidays = [];
		this.endDate = '';
		this.startDate = '';
	};

	ngOnInit()
	{
		window.scrollTo(0, 0);
		this.spinnerService.show();

		var Data = {
			adminId: localStorage.getItem('adminId'),
		};
		this.securityService.getpayRollSettings(Data).subscribe((response) =>
		{
			console.log(response)
			this.payroll = response.data;

			this.securityService.GetHoliday().subscribe((response) =>
			{
				console.log(response.data);
				this.spinnerService.hide();
				// this.holidays = response.data; 
				if (response.data.length > 0)
				{
					for (var i = 0; i < response.data.length; i++)
					{
						if (response.data[i].status == true)
						{
							this.holidays.push(response.data[i]);
						}
					}
				}
			});
		});
	};


	getReport(startDate, endDate)
	{
		var daysTime = [],
			time = [],
			dict1;
		this.spinnerService.show();
		var Data = {
			start_date: Date.parse(startDate),
			adminId: localStorage.getItem('adminId'),
			end_date: Date.parse(endDate),
			type: '1'
		};
		this.shiftService.RoasterShifts(Data).subscribe((response) =>
		{
			console.log(response);
			this.ShiftsList = response.data;
			this.spinnerService.hide();
			this.search(startDate, endDate);
		});
	};


	search(startDate, endDate)
	{

		var rows = [],
			a, userProfile;
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		var d = new Date(startDate);
		var e = new Date(endDate);
		this.parseEndDate = Date.parse(endDate);
		this.parseStartDate = Date.parse(startDate);
		var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		// var d = new Date(dateString);
		// var dayName = days[d.getDay()];

		userProfile = 'Payroll \n Dated from:  ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' Dated to:  ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear();

		var dynamicColumnsDaysName = [];

		dynamicColumnsDaysName.push(
		{
			title: "Name",
			dataKey: "name"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Rate",
			dataKey: "rate"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Hours",
			dataKey: "hours"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Amount",
			dataKey: "amount"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Comments",
			dataKey: "comments"
		});

		var columns = dynamicColumnsDaysName;
		var allshifts = this.ShiftsList,
			AllUsers = [];

		for (var i = 0; i < allshifts.length; i++)
		{
			if (AllUsers.length == 0)
			{
				AllUsers.push(
				{
					'user': allshifts[i].userInfo.firstname,
					'username': allshifts[i].userInfo.firstname + '(' + allshifts[i].userInfo.username + ')',
					'workload': []
				});
			}
			else
			{
				var index = this.getUserIndex(AllUsers, allshifts[i].userInfo.firstname);
				if (index == -1)
				{
					AllUsers.push(
					{
						'user': allshifts[i].userInfo.firstname,
						'username': allshifts[i].userInfo.firstname + '(' + allshifts[i].userInfo.username + ')',
						'workload': []
					});
				}
			}
		}
		this.totalHours = '0:00';
		this.totalAmount = 0;
		for (var i = 0; i < AllUsers.length; i++)
		{
			var filteredArray = allshifts.filter(function (itm)
			{
				return itm.userInfo.firstname == AllUsers[i].user;
			});
			// var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
			AllUsers[i].workload = filteredArray;
			var filteredWorkload = [];


			this.pHolidayHours = 0;
			this.daysHours = 0;
			this.nightHours = 0;
			this.satHours = 0;
			this.sunHours = 0;
			for (var k = 0; k < filteredArray.length; k++)
			{
				//get all times and dates for single location shifts
				if (filteredArray[k].type == '0')
				{
					this.fromDate = new Date(startDate);
					this.formParseDate = Date.parse(this.fromDate);
					this.shiftStartDate = new Date(filteredArray[k].shift_date);
					var shiftStartDateParse = Date.parse(this.shiftStartDate);


					if (shiftStartDateParse >= this.formParseDate)
					{
						var IsPublicHoliday = this.getIsShiftOnPublicHoliday(filteredArray[k].shift_date);
						this.temp3 = new Date(filteredArray[k].shift_date);
						this.dayName = days[this.temp3.getDay()];

						if (IsPublicHoliday == 1)
						{
							var diffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);
							diffrence = diffrence.toString();

							//console.log(diffrence);
							if (this.pHolidayHours != 0)
							{
								this.temp = this.pHolidayHours.split(':');
								this.temp1 = diffrence.split(':');
								this.sHours = Number(this.temp[0]);
								this.sMinutes = Number(this.temp[1]);
								this.hours = Number(this.temp1[0]);
								this.minutes = Number(this.temp1[1]);

								this.calculatedMinutes = this.sMinutes + this.minutes;
								this.calculatedHours = this.sHours + this.hours;

								if (this.calculatedMinutes > 60)
								{
									this.modulo = this.calculatedMinutes % 60;
									this.division = this.calculatedMinutes / 60;
									this.temp = Math.floor(this.division);
									this.calculatedMinutes = this.modulo;
									this.calculatedHours = this.calculatedHours + Number(this.temp);
									this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}else{
									this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							else
							{
								this.temp1 = diffrence.split(':');
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);
								this.calculatedMinutes = this.minutes;
									this.calculatedHours = this.hours;
								this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
							}
						}
						else if (this.dayName == 'Sat')
						{
							var diffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time)
							//console.log(diffrence);
							if (this.satHours != 0)
							{
								this.temp = this.satHours.split(':');
								this.temp1 = diffrence.split(':');
								this.sHours = Number(this.temp[0]),
								this.sMinutes = Number(this.temp[1]),
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);

								this.calculatedMinutes = this.sMinutes + this.minutes,
								this.calculatedHours = this.sHours + this.hours;

								if (this.calculatedMinutes > 60)
								{
									this.modulo = this.calculatedMinutes % 60;
									this.division = this.calculatedMinutes / 60;
									this.temp = Math.floor(this.division);
									this.calculatedMinutes = this.modulo;
									this.calculatedHours = this.calculatedHours + Number(this.temp);
									this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}else{
									this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							else
							{
								this.temp1 = diffrence.split(':');
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);
								this.calculatedMinutes = this.minutes;
								this.calculatedHours = this.hours;
								this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
							}
						}
						else if (this.dayName == 'Sun')
						{
							var diffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time)
							//console.log(diffrence);
							if (this.sunHours != 0)
							{
								this.temp = this.sunHours.split(':');
								this.temp1 = diffrence.split(':');
								this.sHours = Number(this.temp[0]),
								this.sMinutes = Number(this.temp[1]),
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);

								this.calculatedMinutes = this.sMinutes + this.minutes;
								this.calculatedHours = this.sHours + this.hours;

								if (this.calculatedMinutes > 60)
								{
									this.modulo = this.calculatedMinutes % 60;
									this.division = this.calculatedMinutes / 60;
									this.temp = Math.floor(this.division);
									this.calculatedMinutes = this.modulo;
									this.calculatedHours = this.calculatedHours + Number(this.temp);
									this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}else{
									this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							else
							{
								this.temp1 = diffrence.split(':');
								this.hours = Number(this.temp1[0]);
								this.minutes = Number(this.temp1[1]);
								this.calculatedMinutes = this.minutes;
								this.calculatedHours = this.hours;
								this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
							}
						}else{
							console.log('shift-start-time:' + filteredArray[k].start_time );
							console.log('shift-end-time:' + filteredArray[k].end_time );


							console.log('payroll-start-time:' + this.payroll.day_start_hours );
							console.log('payroll-end-time:' + this.payroll.day_end_hours );


							this.night = 0;
							this.day = 0;
							this.temp = new Date('1970-01-01T' + filteredArray[k].start_time + ':00');
							this.temp1 = new Date('1970-01-01T' + filteredArray[k].end_time + ':00');
							this.shiftStartTime = Date.parse(this.temp);
							this.shiftEndTime =  Date.parse(this.temp1);

							this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
							this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

							this.payrollStart = Date.parse(this.temp2);
							this.payrollEnd = Date.parse(this.temp3);

							this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
							this.shiftHoursDiffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);
							this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

							console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
							console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
							console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

							this.temp = this.payrollHoursDiffrence.split(':');
							this.temp1 = this.shiftHoursDiffrence.split(':');
							this.temp3 = this.nightHoursDiffrence.split(':');

							this.payrollHours = Number(this.temp[0]);
							this.payrollMInutes = Number(this.temp[1]);
							this.shiftHours = Number(this.temp1[0]);
							this.shiftMinutes = Number(this.temp1[1]);
							this.nightHoursGet = Number(this.temp3[0]);
							this.nightMinutesGet = Number(this.temp3[1]);


							if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd && this.shiftHours <= this.payrollHours){
								this.day = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);
							}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
								this.night = this.diff(filteredArray[k].start_time, filteredArray[k].end_time)
							}else{
								if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

									this.night = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);

								}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

									this.day = this.diff(this.payroll.day_start_hours, filteredArray[k].end_time);

									this.night = this.diff(filteredArray[k].start_time, this.payroll.day_start_hours);

								}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

									this.night = this.diff(this.payroll.day_end_hours, filteredArray[k].end_time);

									this.day = this.diff(filteredArray[k].start_time, this.payroll.day_end_hours);

								}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

									this.day = this.diff(filteredArray[k].start_time, this.payroll.day_end_hours);
									this.night = this.diff(this.payroll.day_end_hours, filteredArray[k].end_time);

								}
							}
							
							if(this.day != 0){
								
								//console.log(diffrence);
								if (this.daysHours != 0)
								{
									this.temp = this.daysHours.split(':');
									this.temp1 = this.day.split(':');
									this.sHours = Number(this.temp[0]),
									this.sMinutes = Number(this.temp[1]),
									this.hours = Number(this.temp1[0]),
									this.minutes = Number(this.temp1[1]);

									this.calculatedMinutes = this.sMinutes + this.minutes;
									this.calculatedHours = this.sHours + this.hours;

									if (this.calculatedMinutes > 60)
									{
										this.modulo = this.calculatedMinutes % 60;
										this.division = this.calculatedMinutes / 60;
										this.temp = Math.floor(this.division);
										this.calculatedMinutes = this.modulo;
										this.calculatedHours = this.calculatedHours + Number(this.temp);
										this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}else{
										this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}
								}
								else
								{
									this.temp1 = this.day.split(':');
									this.hours = Number(this.temp1[0]);
									this.minutes = Number(this.temp1[1]);
									this.calculatedMinutes = this.minutes;
									this.calculatedHours = this.hours;
									this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							if(this.night != 0){
								//night hours
								if (this.nightHours != 0)
								{
									this.temp = this.night.split(':');
									this.sHours = Number(this.temp[0]),
									this.sMinutes = Number(this.temp[1]),
									this.hours = Number(this.temp1[0]),
									this.minutes = Number(this.temp1[1]);

									this.calculatedMinutes = this.sMinutes + this.minutes;
									this.calculatedHours = this.sHours + this.hours;

									if (this.calculatedMinutes > 60)
									{
										this.modulo = this.calculatedMinutes % 60;
										this.division = this.calculatedMinutes / 60;
										this.temp = Math.floor(this.division);
										this.calculatedMinutes = this.modulo;
										this.calculatedHours = this.calculatedHours + Number(this.temp);
										this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}else{
										this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}
								}
								else
								{
									this.temp1 = this.night.split(':');
									this.hours = Number(this.temp1[0]);
									this.minutes = Number(this.temp1[1]);
									this.calculatedMinutes = this.minutes;
									this.calculatedHours = this.hours;
									this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}

							console.log('day'+this.day)
							console.log('night'+this.night)
						}
					}
				}
				else
				{
					for (var n = 0; n < filteredArray[k].days.length; n++)
					{
						//parseStartDate <= parseEndDate)

						this.shiftStartDate = new Date(filteredArray[k].start_date);
						this.shiftEnd = new Date(filteredArray[k].end_date);
						this.shiftEndDate = Date.parse(this.shiftEnd);
						this.shiftStartDateParse = Date.parse(this.shiftStartDate);

						// if (parseStartDate >= shiftStartDateParse)
						// {
						if (n == 0)
						{
							this.workloadDate = new Date(startDate);
							this.workloadEndDate = Date.parse(this.workloadDate);

							this.dayName = days[this.workloadDate.getDay()];
							this.dayArray = this.returnDateAndTime(this.dayName, filteredArray[k].days);

							if (this.dayArray.start_time != '' && this.workloadEndDate <= this.parseEndDate && this.workloadEndDate <= this.shiftEndDate)
							{
								if (filteredWorkload.length == 0)
								{
									var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
									var p = Date.parse(currentWorkoutDate);

									if (p >= this.shiftStartDateParse)
									{
										var IsPublicHoliday = this.getIsShiftOnPublicHoliday(this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate());
										this.temp3 = new Date(filteredArray[k].shift_date);
										// var dayName = days[this.temp3.getDay()];

										if (IsPublicHoliday == 1)
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.pHolidayHours != 0)
											{
												this.temp = this.pHolidayHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes,
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sat')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.satHours != 0)
											{
												this.temp = this.satHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes =this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]),
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes,
												this.calculatedHours = this.hours;
												this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sun')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.sunHours != 0)
											{
												this.temp = this.sunHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]),
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes,
												this.calculatedHours = this.hours;
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}else{

											console.log('shift-start-time:' + this.dayArray.start_time );
											console.log('shift-end-time:' + this.dayArray.end_time );


											console.log('payroll-start-time:' + this.payroll.day_start_hours );
											console.log('payroll-end-time:' + this.payroll.day_end_hours );


											this.night = 0;
											this.day = 0;
											this.temp = new Date('1970-01-01T' + this.dayArray.start_time + ':00');
											this.temp1 = new Date('1970-01-01T' + this.dayArray.end_time + ':00');
											this.shiftStartTime = Date.parse(this.temp);
											this.shiftEndTime =  Date.parse(this.temp1);

											this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
											this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

											this.payrollStart = Date.parse(this.temp2);
											this.payrollEnd = Date.parse(this.temp3);

											this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
											this.shiftHoursDiffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

											console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
											console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
											console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

											this.temp = this.payrollHoursDiffrence.split(':');
											this.temp1 = this.shiftHoursDiffrence.split(':');
											this.temp3 = this.nightHoursDiffrence.split(':');

											this.payrollHours = Number(this.temp[0]),
											this.payrollMInutes = Number(this.temp[1]),
											this.shiftHours = Number(this.temp1[0]),
											this.shiftMinutes = Number(this.temp1[1]),
											this.nightHoursGet = Number(this.temp3[0]),
											this.nightMinutesGet = Number(this.temp3[1]);




											if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd &&this. shiftHours <= this.payrollHours){

												this.day = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
												this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											}else{
												if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

													this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time);

												}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

													this.day = this.diff(this.payroll.day_start_hours, this.dayArray.end_time);

													this.night = this.diff(this.dayArray.start_time, this.payroll.day_start_hours);

												}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);

												}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);
													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

												}
											}
											
											if(this.day != 0){
												
												//console.log(diffrence);
												if (this.daysHours != 0)
												{
													this.temp = this.daysHours.split(':');
													this.temp1 = this.day.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes;
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.day.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes;
													this.calculatedHours = this.hours;
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											if(this.night != 0){
												//night hours
												if (this.nightHours != 0)
												{
													this.temp = this.night.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes;
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.night.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes;
													this.calculatedHours = this.hours;
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}

											console.log('day'+this.day)
											console.log('night'+this.night)
										}
									}
								}
								else
								{
									this.workloadDate = new Date(this.parseStartDate);
									var workloadDate1 = Date.parse(this.workloadDate);
									//var selectedDate = new Date(startDate);
									this.dayName = days[this.workloadDate.getDay()];
									this.dayArray = this.returnDateAndTime(this.dayName, filteredArray[k].days);

									var dates = [];
									var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
									var p = Date.parse(currentWorkoutDate);
									if (p >= this.shiftStartDateParse)
									{
										var IsPublicHoliday = this.getIsShiftOnPublicHoliday(this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate());
										this.temp3 = new Date(filteredArray[k].shift_date);
										// var dayName = days[this.temp3.getDay()];

										if (IsPublicHoliday == 1)
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.pHolidayHours != 0)
											{
												this.temp = this.pHolidayHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes =this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sat')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.satHours != 0)
											{
												this.temp = this.satHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sun')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.sunHours != 0)
											{
												this.temp = this.sunHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes +this.minutes,
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}else{
											console.log('shift-start-time:' + this.dayArray.start_time );
											console.log('shift-end-time:' + this.dayArray.end_time );


											console.log('payroll-start-time:' + this.payroll.day_start_hours );
											console.log('payroll-end-time:' + this.payroll.day_end_hours );


											this.night = 0;
											this.day = 0;
											this.temp = new Date('1970-01-01T' + this.dayArray.start_time + ':00');
											this.temp1 = new Date('1970-01-01T' + this.dayArray.end_time + ':00');
											this.shiftStartTime = Date.parse(this.temp);
											this.shiftEndTime =  Date.parse(this.temp1);

											this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
											this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

											this.payrollStart = Date.parse(this.temp2);
											this.payrollEnd = Date.parse(this.temp3);

											this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
											this.shiftHoursDiffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

											console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
											console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
											console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

											this.temp = this.payrollHoursDiffrence.split(':');
											this.temp1 = this.shiftHoursDiffrence.split(':');
											this.temp3 = this.nightHoursDiffrence.split(':');

											this.payrollHours = Number(this.temp[0]);
											this.payrollMInutes = Number(this.temp[1]);
											this.shiftHours = Number(this.temp1[0]);
											this.shiftMinutes = Number(this.temp1[1]);
											this.nightHoursGet = Number(this.temp3[0]);
											this.nightMinutesGet = Number(this.temp3[1]);




											if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd && this.shiftHours <=this.payrollHours){

												this.day = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
												this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											}else{
												if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

													this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time);

												}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

													this.day = this.diff(this.payroll.day_start_hours, this.dayArray.end_time);

													this.night = this.diff(this.dayArray.start_time, this.payroll.day_start_hours);

												}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);

												}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);
													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

												}

											}
											
											if(this.day != 0){
												
												//console.log(diffrence);
												if (this.daysHours != 0)
												{
													this.temp = this.daysHours.split(':');
													this.temp1 = this.day.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes;
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.day.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes;
													this.calculatedHours = this.hours;
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											if(this.night != 0){
												//night hours
												if (this.nightHours != 0)
												{
													this.temp = this.night.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes,
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.night.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes,
													this.calculatedHours = this.hours;
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}

											console.log('day'+this.day)
											console.log('night'+this.night)
										}
									}

								}

							}

						}
						else
						{
							this.today = new Date(startDate);
							this.parseDate = Date.parse(this.today);
							this.tomorrow = new Date();
							this.tomorrow = new Date(this.tomorrow.setHours(0, 0, 0, 0));
							this.tomorrow.setDate(this.today.getDate() + n);
							this.parseStartDate = Date.parse(this.tomorrow);

							this.shiftEndDate = new Date(filteredArray[k].end_date);
							this.shiftEndDateParse = Date.parse(this.shiftEndDate);

							this.dayName = days[this.tomorrow.getDay()];
							this.dayArray = this.returnDateAndTime(this.dayName, filteredArray[k].days);

							if (this.dayArray.start_time != '' && this.parseStartDate <= this.parseEndDate && this.parseStartDate <= this.shiftEndDateParse)
							{

								var dates = [];

								this.currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
								var p = Date.parse(this.currentWorkoutDate);
								if (p >= this.shiftStartDateParse)
								{
									var IsPublicHoliday = this.getIsShiftOnPublicHoliday(this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate());
									this.temp3 = new Date(filteredArray[k].shift_date);
									// var dayName = days[this.temp3.getDay()];

									if (IsPublicHoliday == 1)
									{
										var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										//console.log(diffrence);
										if (this.pHolidayHours != 0)
										{
											this.temp = this.pHolidayHours.split(':');
											this.temp1 = diffrence.split(':');
											this.sHours = Number(this.temp[0]);
											this.sMinutes = Number(this.temp[1]);
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);

											this.calculatedMinutes =this.sMinutes + this.minutes,
											this.calculatedHours =this.sHours + this.hours;

											if (this.calculatedMinutes > 60)
											{
												this.modulo = this.calculatedMinutes % 60;
												this.division = this.calculatedMinutes / 60;
												this.temp = Math.floor(this.division);
												this.calculatedMinutes = this.modulo;
												this.calculatedHours = this.calculatedHours + Number(this.temp);
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}else{
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else
										{
											this.temp1 = diffrence.split(':');
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);
											this.calculatedMinutes = this.minutes;
											this.calculatedHours = this.hours;
											this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
										}
									}
									else if (this.dayName == 'Sat')
									{
										var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										//console.log(diffrence);
										if (this.satHours != 0)
										{
											this.temp = this.satHours.split(':');
											this.temp1 = diffrence.split(':');
											this.sHours = Number(this.temp[0]);
											this.sMinutes = Number(this.temp[1]);
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);

											this.calculatedMinutes =this.sMinutes + this.minutes;
											this.calculatedHours =this.sHours + this.hours;

											if (this.calculatedMinutes > 60)
											{
												this.modulo = this.calculatedMinutes % 60;
												this.division = this.calculatedMinutes / 60;
												this.temp = Math.floor(this.division);
												this.calculatedMinutes = this.modulo;
												this.calculatedHours = this.calculatedHours + Number(this.temp);
												this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}else{
												this.satHours =this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else
										{
											this.temp1 = diffrence.split(':');
											this.hours = Number(this.temp1[0]),
											this.minutes = Number(this.temp1[1]);
											this.calculatedMinutes = this.minutes,
											this.calculatedHours = this.hours;
											this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
										}
									}
									else if (this.dayName == 'Sun')
									{
										var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										//console.log(diffrence);
										if (this.sunHours != 0)
										{
											this.temp = this.sunHours.split(':');
											this.temp1 = diffrence.split(':');
											this.sHours = Number(this.temp[0]);
											this.sMinutes = Number(this.temp[1]);
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);

											this.calculatedMinutes =this.sMinutes + this.minutes;
											this.calculatedHours =this.sHours + this.hours;

											if (this.calculatedMinutes > 60)
											{
												this.modulo = this.calculatedMinutes % 60;
												this.division = this.calculatedMinutes / 60;
												this.temp = Math.floor(this.division);
												this.calculatedMinutes =this. modulo;
												this.calculatedHours = this.calculatedHours + Number(this.temp);
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}else{
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else
										{
											this.temp1 = diffrence.split(':');
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);
											this.calculatedMinutes = this.minutes;
											this.calculatedHours = this.hours;
											this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
										}
									}else{
										console.log('shift-start-time:' + this.dayArray.start_time );
										console.log('shift-end-time:' + this.dayArray.end_time );


										console.log('payroll-start-time:' + this.payroll.day_start_hours );
										console.log('payroll-end-time:' + this.payroll.day_end_hours );


										this.night = 0;
										this.day = 0;
										this.temp = new Date('1970-01-01T' + this.dayArray.start_time + ':00');
										this.temp1 = new Date('1970-01-01T' + this.dayArray.end_time + ':00');
										this.shiftStartTime = Date.parse(this.temp);
										this.shiftEndTime =  Date.parse(this.temp1);

										this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
										this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

										this.payrollStart = Date.parse(this.temp2);
										this.payrollEnd = Date.parse(this.temp3);

										this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
										this.shiftHoursDiffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time);
										this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

										console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
										console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
										console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

										this.temp = this.payrollHoursDiffrence.split(':');
										this.temp1 = this.shiftHoursDiffrence.split(':');
										this.temp3 = this.nightHoursDiffrence.split(':');

										this.payrollHours = Number(this.temp[0]);
										this.payrollMInutes = Number(this.temp[1]);
										this.shiftHours = Number(this.temp1[0]);
										this.shiftMinutes = Number(this.temp1[1]);
										this.nightHoursGet = Number(this.temp3[0]);
										this.nightMinutesGet = Number(this.temp3[1]);




										if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd && this.shiftHours <= this.payrollHours						){

											this.day = this.diff(this.dayArray.start_time, this.dayArray.end_time);
										}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
											this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										}else{
											if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

												this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time);

											}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

												this.day = this.diff(this.payroll.day_start_hours, this.dayArray.end_time);

												this.night = this.diff(this.dayArray.start_time, this.payroll.day_start_hours);

											}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

												this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

												this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);

											}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

												this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);
												this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

											}
										}
										
										if(this.day != 0){
											
											//console.log(diffrence);
											if (this.daysHours != 0)
											{
												this.temp = this.daysHours.split(':');
												this.temp1 = this.day.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}else{
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = this.day.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										if(this.night != 0){
											//night hours
											if (this.nightHours != 0)
											{
												this.temp = this.night.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes,
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}else{
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = this.night.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}

										console.log('day'+this.day)
										console.log('night'+this.night)
									}
								}


							}

						}
							// }
						// }
					}
				}
			}


			var rates = '';
			var hours = '';
			var amount = '';
			var comments = '';

			for (var n = 0; n < 5; n++)
			{
				if (n == 0)
				{
					rates = rates + '<span class="row"> $' + this.payroll.day + ' </span>';
					hours = hours + '<span class="row"> ' + this.daysHours + ' </span>';
					comments = comments + '<span class="row"> DAY </span>';
					if(this.daysHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.daysHours, this.payroll.day) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.daysHours);
						this.totalAmount = this.totalAmount + Number(this.calculateAmount(this.daysHours, this.payroll.day));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
				else if (n == 1)
				{
					rates = rates + '<span class="row"> $' + this.payroll.night + ' </span>'
					hours = hours + '<span class="row"> ' + this.nightHours + ' </span>';
					comments = comments + '<span class="row"> NIGHT </span>';
					if(this.nightHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.nightHours, this.payroll.night) + '</span>';						
						this.totalHours = this.calculateHoursFun(this.totalHours, this.nightHours);
						this.totalAmount = this.totalAmount + Number(this.calculateAmount(this.nightHours, this.payroll.night));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
				else if (n == 2)
				{
					rates = rates + '<span class="row"> $' + this.payroll.sat + ' </span>';
					hours = hours + '<span class="row"> ' + this.satHours + ' </span>'
					comments = comments + '<span class="row"> SATURDAY</span>';
					if(this.satHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.satHours, this.payroll.sat) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.satHours);
						this.totalAmount = this.totalAmount + Number(this.calculateAmount(this.satHours, this.payroll.sat));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
					
				}
				else if (n == 3)
				{
					rates = rates + '<span class="row"> $' + this.payroll.sun + ' </span>';
					hours = hours + '<span class="row"> ' + this.sunHours + ' </span>';
					comments = comments + '<span class="row"> SUNDAY </span>';
					if(this.sunHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.sunHours, this.payroll.sun) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.sunHours);
						this.totalAmount = this.totalAmount + Number(this.calculateAmount(this.sunHours, this.payroll.sun));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
				else if (n == 4)
				{
					rates = rates + '<span class="row"> $' + this.payroll.public + ' </span>';
					hours = hours + '<span class="row"> ' + this.pHolidayHours + ' </span>';
					comments = comments + '<span class="row"> PUBLIC HOLIDAY </span>';
					if(this.pHolidayHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.pHolidayHours, this.payroll.public) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.pHolidayHours);
						this.totalAmount = this.totalAmount + Number(this.calculateAmount(this.pHolidayHours, this.payroll.public));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
			}

			this.a = {
				'name': AllUsers[i].username ,
				'rate': rates,
				'hours': hours,
				'amount': amount,
				'comments': comments
			};
			// rows.push(a)
			rows.push(this.a);
		}




		this.a = {
			'name': '<div class="t-footer"></div>',
			'rate': '<div class="t-footer"></div>',
			'hours': '<div class="t-footer">' + this.totalHours + '</div>',
			'amount': '<div class="t-footer">' + this.totalAmount + '</div>',
			'comments': '<div class="t-footer"></div>'
		};


		console.log('totalAmount', this.totalAmount);
		console.log('totalHours', this.totalHours);
		// rows.push(a)
		rows.push(this.a);
		// EXTRACT VALUE FOR HTML HEADER. 
		// ('Book ID', 'Book Name', 'Category' and 'Price')
		var col = [];
		for (var i = 0; i < columns.length; i++)
		{
			col.push(columns[i].title);
		}

		// CREATE DYNAMIC TABLE.
		var table = document.createElement("table");
		table.classList.add('table-payroll');
		// CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

		var tr = table.insertRow(-1); // TABLE ROW.

		for (var i = 0; i < col.length; i++)
		{
			var th = document.createElement("th"); // TABLE HEADER.
			th.innerHTML = col[i];
			tr.appendChild(th);
		}

		for (var i = 0; i < rows.length; i++)
		{
			console.log(rows[i])
			tr = table.insertRow(-1);

			for (var j = 0; j < col.length; j++)
			{
				if(j == (col.length - 1)){
					var tabCell = tr.insertCell(-1);

					if (columns[j].dataKey == 'name')
					{
						tabCell.innerHTML = rows[i].name;
					}
					else if (columns[j].dataKey == 'rate')
					{
						tabCell.innerHTML = rows[i].rate;
					}
					else if (columns[j].dataKey == 'hours')
					{
						tabCell.innerHTML = rows[i].hours;
					}
					else if (columns[j].dataKey == 'amount')
					{
						tabCell.innerHTML = rows[i].amount;
					}
					else if (columns[j].dataKey == 'comments')
					{
						tabCell.innerHTML = rows[i].comments;
					}
				}else{
					var tabCell = tr.insertCell(-1);

					if (columns[j].dataKey == 'name')
					{
						tabCell.innerHTML = '<div class="bg-color">' + rows[i].name + '</div>';
					}
					else if (columns[j].dataKey == 'rate')
					{
						tabCell.innerHTML = rows[i].rate;
					}
					else if (columns[j].dataKey == 'hours')
					{
						tabCell.innerHTML = rows[i].hours;
					}
					else if (columns[j].dataKey == 'amount')
					{
						tabCell.innerHTML = rows[i].amount;
					}
					else if (columns[j].dataKey == 'comments')
					{
						tabCell.innerHTML = rows[i].comments;
					}
				}
				
			}
		}

		// FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
		var divContainer = document.getElementById("showData");
		divContainer.innerHTML = "";
		divContainer.appendChild(table);

	};




	DownloadReport(startDate, endDate)
	{

		var rows = [],
			a, userProfile;
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		var d = new Date(startDate);
		var e = new Date(endDate);
		this.parseEndDate = Date.parse(endDate);
		this.parseStartDate = Date.parse(startDate);
		var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		// var d = new Date(dateString);
		// var dayName = days[d.getDay()];

		userProfile = 'Payroll \n Dated from:  ' + monthNames[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' Dated to:  ' + monthNames[e.getMonth()] + ' ' + e.getDate() + ' ' + e.getFullYear();

		var dynamicColumnsDaysName = [];

		dynamicColumnsDaysName.push(
		{
			title: "Name",
			dataKey: "name"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Rate",
			dataKey: "rate"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Hours",
			dataKey: "hours"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Amount",
			dataKey: "amount"
		});
		dynamicColumnsDaysName.push(
		{
			title: "Comments",
			dataKey: "comments"
		});

		var columns = dynamicColumnsDaysName;
		var allshifts = this.ShiftsList,
			AllUsers = [];

		for (var i = 0; i < allshifts.length; i++)
		{
			if (AllUsers.length == 0)
			{
				AllUsers.push(
				{
					'user': allshifts[i].userInfo.firstname,
					'username': allshifts[i].userInfo.firstname + '(' + allshifts[i].userInfo.username + ')',
					'workload': []
				});
			}
			else
			{
				var index = this.getUserIndex(AllUsers, allshifts[i].userInfo.firstname);
				if (index == -1)
				{
					AllUsers.push(
					{
						'user': allshifts[i].userInfo.firstname,
						'username': allshifts[i].userInfo.firstname + '(' + allshifts[i].userInfo.username + ')',
						'workload': []
					});
				}
			}
		}
		this.totalHours = '0:00';
		this.totalAmount = '';
		for (var i = 0; i < AllUsers.length; i++)
		{
			var filteredArray = allshifts.filter(function (itm)
			{
				return itm.userInfo.firstname == AllUsers[i].user;
			});
			// var shifts = allshifts.filter(checkLocation(AllLocaions[]));;
			AllUsers[i].workload = filteredArray;
			var filteredWorkload = [];


			this.pHolidayHours = 0;
			this.daysHours = 0;
			this.nightHours = 0;
			this.satHours = 0;
			this.sunHours = 0;
			for (var k = 0; k < filteredArray.length; k++)
			{
				//get all times and dates for single location shifts
				if (filteredArray[k].type == '0')
				{
					this.fromDate = new Date(startDate);
					this.formParseDate = Date.parse(this.fromDate);
					this.shiftStartDate = new Date(filteredArray[k].shift_date);
					var shiftStartDateParse = Date.parse(this.shiftStartDate);


					if (shiftStartDateParse >= this.formParseDate)
					{
						var IsPublicHoliday = this.getIsShiftOnPublicHoliday(filteredArray[k].shift_date);
						this.temp3 = new Date(filteredArray[k].shift_date);
						this.dayName = days[this.temp3.getDay()];

						if (IsPublicHoliday == 1)
						{
							var diffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);
							diffrence = diffrence.toString();

							//console.log(diffrence);
							if (this.pHolidayHours != 0)
							{
								this.temp = this.pHolidayHours.split(':');
								this.temp1 = diffrence.split(':');
								this.sHours = Number(this.temp[0]);
								this.sMinutes = Number(this.temp[1]);
								this.hours = Number(this.temp1[0]);
								this.minutes = Number(this.temp1[1]);

								this.calculatedMinutes = this.sMinutes + this.minutes;
								this.calculatedHours = this.sHours + this.hours;

								if (this.calculatedMinutes > 60)
								{
									this.modulo = this.calculatedMinutes % 60;
									this.division = this.calculatedMinutes / 60;
									this.temp = Math.floor(this.division);
									this.calculatedMinutes = this.modulo;
									this.calculatedHours = this.calculatedHours + Number(this.temp);
									this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}else{
									this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							else
							{
								this.temp1 = diffrence.split(':');
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);
								this.calculatedMinutes = this.minutes;
									this.calculatedHours = this.hours;
								this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
							}
						}
						else if (this.dayName == 'Sat')
						{
							var diffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time)
							//console.log(diffrence);
							if (this.satHours != 0)
							{
								this.temp = this.satHours.split(':');
								this.temp1 = diffrence.split(':');
								this.sHours = Number(this.temp[0]),
								this.sMinutes = Number(this.temp[1]),
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);

								this.calculatedMinutes = this.sMinutes + this.minutes,
								this.calculatedHours = this.sHours + this.hours;

								if (this.calculatedMinutes > 60)
								{
									this.modulo = this.calculatedMinutes % 60;
									this.division = this.calculatedMinutes / 60;
									this.temp = Math.floor(this.division);
									this.calculatedMinutes = this.modulo;
									this.calculatedHours = this.calculatedHours + Number(this.temp);
									this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}else{
									this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							else
							{
								this.temp1 = diffrence.split(':');
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);
								this.calculatedMinutes = this.minutes;
								this.calculatedHours = this.hours;
								this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
							}
						}
						else if (this.dayName == 'Sun')
						{
							var diffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time)
							//console.log(diffrence);
							if (this.sunHours != 0)
							{
								this.temp = this.sunHours.split(':');
								this.temp1 = diffrence.split(':');
								this.sHours = Number(this.temp[0]),
								this.sMinutes = Number(this.temp[1]),
								this.hours = Number(this.temp1[0]),
								this.minutes = Number(this.temp1[1]);

								this.calculatedMinutes = this.sMinutes + this.minutes;
								this.calculatedHours = this.sHours + this.hours;

								if (this.calculatedMinutes > 60)
								{
									this.modulo = this.calculatedMinutes % 60;
									this.division = this.calculatedMinutes / 60;
									this.temp = Math.floor(this.division);
									this.calculatedMinutes = this.modulo;
									this.calculatedHours = this.calculatedHours + Number(this.temp);
									this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}else{
									this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							else
							{
								this.temp1 = diffrence.split(':');
								this.hours = Number(this.temp1[0]);
								this.minutes = Number(this.temp1[1]);
								this.calculatedMinutes = this.minutes;
								this.calculatedHours = this.hours;
								this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
							}
						}else{
							console.log('shift-start-time:' + filteredArray[k].start_time );
							console.log('shift-end-time:' + filteredArray[k].end_time );


							console.log('payroll-start-time:' + this.payroll.day_start_hours );
							console.log('payroll-end-time:' + this.payroll.day_end_hours );


							this.night = 0;
							this.day = 0;
							this.temp = new Date('1970-01-01T' + filteredArray[k].start_time + ':00');
							this.temp1 = new Date('1970-01-01T' + filteredArray[k].end_time + ':00');
							this.shiftStartTime = Date.parse(this.temp);
							this.shiftEndTime =  Date.parse(this.temp1);

							this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
							this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

							this.payrollStart = Date.parse(this.temp2);
							this.payrollEnd = Date.parse(this.temp3);

							this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
							this.shiftHoursDiffrence = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);
							this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

							console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
							console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
							console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

							this.temp = this.payrollHoursDiffrence.split(':');
							this.temp1 = this.shiftHoursDiffrence.split(':');
							this.temp3 = this.nightHoursDiffrence.split(':');

							this.payrollHours = Number(this.temp[0]);
							this.payrollMInutes = Number(this.temp[1]);
							this.shiftHours = Number(this.temp1[0]);
							this.shiftMinutes = Number(this.temp1[1]);
							this.nightHoursGet = Number(this.temp3[0]);
							this.nightMinutesGet = Number(this.temp3[1]);


							if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd && this.shiftHours <= this.payrollHours){
								this.day = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);
							}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
								this.night = this.diff(filteredArray[k].start_time, filteredArray[k].end_time)
							}else{
								if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

									this.night = this.diff(filteredArray[k].start_time, filteredArray[k].end_time);

								}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

									this.day = this.diff(this.payroll.day_start_hours, filteredArray[k].end_time);

									this.night = this.diff(filteredArray[k].start_time, this.payroll.day_start_hours);

								}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

									this.night = this.diff(this.payroll.day_end_hours, filteredArray[k].end_time);

									this.day = this.diff(filteredArray[k].start_time, this.payroll.day_end_hours);

								}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

									this.day = this.diff(filteredArray[k].start_time, this.payroll.day_end_hours);
									this.night = this.diff(this.payroll.day_end_hours, filteredArray[k].end_time);

								}
							}
							
							if(this.day != 0){
								
								//console.log(diffrence);
								if (this.daysHours != 0)
								{
									this.temp = this.daysHours.split(':');
									this.temp1 = this.day.split(':');
									this.sHours = Number(this.temp[0]),
									this.sMinutes = Number(this.temp[1]),
									this.hours = Number(this.temp1[0]),
									this.minutes = Number(this.temp1[1]);

									this.calculatedMinutes = this.sMinutes + this.minutes;
									this.calculatedHours = this.sHours + this.hours;

									if (this.calculatedMinutes > 60)
									{
										this.modulo = this.calculatedMinutes % 60;
										this.division = this.calculatedMinutes / 60;
										this.temp = Math.floor(this.division);
										this.calculatedMinutes = this.modulo;
										this.calculatedHours = this.calculatedHours + Number(this.temp);
										this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}else{
										this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}
								}
								else
								{
									this.temp1 = this.day.split(':');
									this.hours = Number(this.temp1[0]);
									this.minutes = Number(this.temp1[1]);
									this.calculatedMinutes = this.minutes;
									this.calculatedHours = this.hours;
									this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}
							if(this.night != 0){
								//night hours
								if (this.nightHours != 0)
								{
									this.temp = this.night.split(':');
									this.sHours = Number(this.temp[0]),
									this.sMinutes = Number(this.temp[1]),
									this.hours = Number(this.temp1[0]),
									this.minutes = Number(this.temp1[1]);

									this.calculatedMinutes = this.sMinutes + this.minutes;
									this.calculatedHours = this.sHours + this.hours;

									if (this.calculatedMinutes > 60)
									{
										this.modulo = this.calculatedMinutes % 60;
										this.division = this.calculatedMinutes / 60;
										this.temp = Math.floor(this.division);
										this.calculatedMinutes = this.modulo;
										this.calculatedHours = this.calculatedHours + Number(this.temp);
										this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}else{
										this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
									}
								}
								else
								{
									this.temp1 = this.night.split(':');
									this.hours = Number(this.temp1[0]);
									this.minutes = Number(this.temp1[1]);
									this.calculatedMinutes = this.minutes;
									this.calculatedHours = this.hours;
									this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
								}
							}

							console.log('day'+this.day)
							console.log('night'+this.night)
						}
					}
				}
				else
				{
					for (var n = 0; n < filteredArray[k].days.length; n++)
					{
						//parseStartDate <= parseEndDate)

						this.shiftStartDate = new Date(filteredArray[k].start_date);
						this.shiftEnd = new Date(filteredArray[k].end_date);
						this.shiftEndDate = Date.parse(this.shiftEnd);
						this.shiftStartDateParse = Date.parse(this.shiftStartDate);

						// if (parseStartDate >= shiftStartDateParse)
						// {
						if (n == 0)
						{
							this.workloadDate = new Date(startDate);
							this.workloadEndDate = Date.parse(this.workloadDate);

							this.dayName = days[this.workloadDate.getDay()];
							this.dayArray = this.returnDateAndTime(this.dayName, filteredArray[k].days);

							if (this.dayArray.start_time != '' && this.workloadEndDate <= this.parseEndDate && this.workloadEndDate <= this.shiftEndDate)
							{
								if (filteredWorkload.length == 0)
								{
									var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
									var p = Date.parse(currentWorkoutDate);

									if (p >= this.shiftStartDateParse)
									{
										var IsPublicHoliday = this.getIsShiftOnPublicHoliday(this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate());
										this.temp3 = new Date(filteredArray[k].shift_date);
										// var dayName = days[this.temp3.getDay()];

										if (IsPublicHoliday == 1)
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.pHolidayHours != 0)
											{
												this.temp = this.pHolidayHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes,
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sat')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.satHours != 0)
											{
												this.temp = this.satHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes =this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]),
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes,
												this.calculatedHours = this.hours;
												this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sun')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.sunHours != 0)
											{
												this.temp = this.sunHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]),
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes,
												this.calculatedHours = this.hours;
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}else{

											console.log('shift-start-time:' + this.dayArray.start_time );
											console.log('shift-end-time:' + this.dayArray.end_time );


											console.log('payroll-start-time:' + this.payroll.day_start_hours );
											console.log('payroll-end-time:' + this.payroll.day_end_hours );


											this.night = 0;
											this.day = 0;
											this.temp = new Date('1970-01-01T' + this.dayArray.start_time + ':00');
											this.temp1 = new Date('1970-01-01T' + this.dayArray.end_time + ':00');
											this.shiftStartTime = Date.parse(this.temp);
											this.shiftEndTime =  Date.parse(this.temp1);

											this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
											this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

											this.payrollStart = Date.parse(this.temp2);
											this.payrollEnd = Date.parse(this.temp3);

											this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
											this.shiftHoursDiffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

											console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
											console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
											console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

											this.temp = this.payrollHoursDiffrence.split(':');
											this.temp1 = this.shiftHoursDiffrence.split(':');
											this.temp3 = this.nightHoursDiffrence.split(':');

											this.payrollHours = Number(this.temp[0]),
											this.payrollMInutes = Number(this.temp[1]),
											this.shiftHours = Number(this.temp1[0]),
											this.shiftMinutes = Number(this.temp1[1]),
											this.nightHoursGet = Number(this.temp3[0]),
											this.nightMinutesGet = Number(this.temp3[1]);




											if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd &&this. shiftHours <= this.payrollHours){

												this.day = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
												this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											}else{
												if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

													this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time);

												}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

													this.day = this.diff(this.payroll.day_start_hours, this.dayArray.end_time);

													this.night = this.diff(this.dayArray.start_time, this.payroll.day_start_hours);

												}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);

												}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);
													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

												}
											}
											
											if(this.day != 0){
												
												//console.log(diffrence);
												if (this.daysHours != 0)
												{
													this.temp = this.daysHours.split(':');
													this.temp1 = this.day.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes;
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.day.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes;
													this.calculatedHours = this.hours;
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											if(this.night != 0){
												//night hours
												if (this.nightHours != 0)
												{
													this.temp = this.night.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes;
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.night.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes;
													this.calculatedHours = this.hours;
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}

											console.log('day'+this.day)
											console.log('night'+this.night)
										}
									}
								}
								else
								{
									this.workloadDate = new Date(this.parseStartDate);
									var workloadDate1 = Date.parse(this.workloadDate);
									//var selectedDate = new Date(startDate);
									this.dayName = days[this.workloadDate.getDay()];
									this.dayArray = this.returnDateAndTime(this.dayName, filteredArray[k].days);

									var dates = [];
									var currentWorkoutDate = this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate();
									var p = Date.parse(currentWorkoutDate);
									if (p >= this.shiftStartDateParse)
									{
										var IsPublicHoliday = this.getIsShiftOnPublicHoliday(this.workloadDate.getFullYear() + '-' + (this.workloadDate.getMonth() + 1) + '-' + this.workloadDate.getDate());
										this.temp3 = new Date(filteredArray[k].shift_date);
										// var dayName = days[this.temp3.getDay()];

										if (IsPublicHoliday == 1)
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.pHolidayHours != 0)
											{
												this.temp = this.pHolidayHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes =this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sat')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.satHours != 0)
											{
												this.temp = this.satHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else if (this.dayName == 'Sun')
										{
											var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											//console.log(diffrence);
											if (this.sunHours != 0)
											{
												this.temp = this.sunHours.split(':');
												this.temp1 = diffrence.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes +this.minutes,
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = diffrence.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}else{
											console.log('shift-start-time:' + this.dayArray.start_time );
											console.log('shift-end-time:' + this.dayArray.end_time );


											console.log('payroll-start-time:' + this.payroll.day_start_hours );
											console.log('payroll-end-time:' + this.payroll.day_end_hours );


											this.night = 0;
											this.day = 0;
											this.temp = new Date('1970-01-01T' + this.dayArray.start_time + ':00');
											this.temp1 = new Date('1970-01-01T' + this.dayArray.end_time + ':00');
											this.shiftStartTime = Date.parse(this.temp);
											this.shiftEndTime =  Date.parse(this.temp1);

											this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
											this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

											this.payrollStart = Date.parse(this.temp2);
											this.payrollEnd = Date.parse(this.temp3);

											this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
											this.shiftHoursDiffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

											console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
											console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
											console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

											this.temp = this.payrollHoursDiffrence.split(':');
											this.temp1 = this.shiftHoursDiffrence.split(':');
											this.temp3 = this.nightHoursDiffrence.split(':');

											this.payrollHours = Number(this.temp[0]);
											this.payrollMInutes = Number(this.temp[1]);
											this.shiftHours = Number(this.temp1[0]);
											this.shiftMinutes = Number(this.temp1[1]);
											this.nightHoursGet = Number(this.temp3[0]);
											this.nightMinutesGet = Number(this.temp3[1]);




											if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd && this.shiftHours <=this.payrollHours){

												this.day = this.diff(this.dayArray.start_time, this.dayArray.end_time);
											}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
												this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time)
											}else{
												if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

													this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time);

												}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

													this.day = this.diff(this.payroll.day_start_hours, this.dayArray.end_time);

													this.night = this.diff(this.dayArray.start_time, this.payroll.day_start_hours);

												}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);

												}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

													this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);
													this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

												}

											}
											
											if(this.day != 0){
												
												//console.log(diffrence);
												if (this.daysHours != 0)
												{
													this.temp = this.daysHours.split(':');
													this.temp1 = this.day.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes;
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.day.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes;
													this.calculatedHours = this.hours;
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											if(this.night != 0){
												//night hours
												if (this.nightHours != 0)
												{
													this.temp = this.night.split(':');
													this.sHours = Number(this.temp[0]);
													this.sMinutes = Number(this.temp[1]);
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);

													this.calculatedMinutes =this.sMinutes + this.minutes,
													this.calculatedHours =this.sHours + this.hours;

													if (this.calculatedMinutes > 60)
													{
														this.modulo = this.calculatedMinutes % 60;
														this.division = this.calculatedMinutes / 60;
														this.temp = Math.floor(this.division);
														this.calculatedMinutes = this.modulo;
														this.calculatedHours = this.calculatedHours + Number(this.temp);
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}else{
														this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
													}
												}
												else
												{
													this.temp1 = this.night.split(':');
													this.hours = Number(this.temp1[0]);
													this.minutes = Number(this.temp1[1]);
													this.calculatedMinutes = this.minutes,
													this.calculatedHours = this.hours;
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}

											console.log('day'+this.day)
											console.log('night'+this.night)
										}
									}

								}

							}

						}
						else
						{
							this.today = new Date(startDate);
							this.parseDate = Date.parse(this.today);
							this.tomorrow = new Date();
							this.tomorrow = new Date(this.tomorrow.setHours(0, 0, 0, 0));
							this.tomorrow.setDate(this.today.getDate() + n);
							this.parseStartDate = Date.parse(this.tomorrow);

							this.shiftEndDate = new Date(filteredArray[k].end_date);
							this.shiftEndDateParse = Date.parse(this.shiftEndDate);

							this.dayName = days[this.tomorrow.getDay()];
							this.dayArray = this.returnDateAndTime(this.dayName, filteredArray[k].days);

							if (this.dayArray.start_time != '' && this.parseStartDate <= this.parseEndDate && this.parseStartDate <= this.shiftEndDateParse)
							{

								var dates = [];

								this.currentWorkoutDate = this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate();
								var p = Date.parse(this.currentWorkoutDate);
								if (p >= this.shiftStartDateParse)
								{
									var IsPublicHoliday = this.getIsShiftOnPublicHoliday(this.tomorrow.getFullYear() + '-' + (this.tomorrow.getMonth() + 1) + '-' + this.tomorrow.getDate());
									this.temp3 = new Date(filteredArray[k].shift_date);
									// var dayName = days[this.temp3.getDay()];

									if (IsPublicHoliday == 1)
									{
										var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										//console.log(diffrence);
										if (this.pHolidayHours != 0)
										{
											this.temp = this.pHolidayHours.split(':');
											this.temp1 = diffrence.split(':');
											this.sHours = Number(this.temp[0]);
											this.sMinutes = Number(this.temp[1]);
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);

											this.calculatedMinutes =this.sMinutes + this.minutes,
											this.calculatedHours =this.sHours + this.hours;

											if (this.calculatedMinutes > 60)
											{
												this.modulo = this.calculatedMinutes % 60;
												this.division = this.calculatedMinutes / 60;
												this.temp = Math.floor(this.division);
												this.calculatedMinutes = this.modulo;
												this.calculatedHours = this.calculatedHours + Number(this.temp);
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}else{
												this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else
										{
											this.temp1 = diffrence.split(':');
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);
											this.calculatedMinutes = this.minutes;
											this.calculatedHours = this.hours;
											this.pHolidayHours = this.calculatedHours + ':' + this.calculatedMinutes;
										}
									}
									else if (this.dayName == 'Sat')
									{
										var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										//console.log(diffrence);
										if (this.satHours != 0)
										{
											this.temp = this.satHours.split(':');
											this.temp1 = diffrence.split(':');
											this.sHours = Number(this.temp[0]);
											this.sMinutes = Number(this.temp[1]);
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);

											this.calculatedMinutes =this.sMinutes + this.minutes;
											this.calculatedHours =this.sHours + this.hours;

											if (this.calculatedMinutes > 60)
											{
												this.modulo = this.calculatedMinutes % 60;
												this.division = this.calculatedMinutes / 60;
												this.temp = Math.floor(this.division);
												this.calculatedMinutes = this.modulo;
												this.calculatedHours = this.calculatedHours + Number(this.temp);
												this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}else{
												this.satHours =this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else
										{
											this.temp1 = diffrence.split(':');
											this.hours = Number(this.temp1[0]),
											this.minutes = Number(this.temp1[1]);
											this.calculatedMinutes = this.minutes,
											this.calculatedHours = this.hours;
											this.satHours = this.calculatedHours + ':' + this.calculatedMinutes;
										}
									}
									else if (this.dayName == 'Sun')
									{
										var diffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										//console.log(diffrence);
										if (this.sunHours != 0)
										{
											this.temp = this.sunHours.split(':');
											this.temp1 = diffrence.split(':');
											this.sHours = Number(this.temp[0]);
											this.sMinutes = Number(this.temp[1]);
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);

											this.calculatedMinutes =this.sMinutes + this.minutes;
											this.calculatedHours =this.sHours + this.hours;

											if (this.calculatedMinutes > 60)
											{
												this.modulo = this.calculatedMinutes % 60;
												this.division = this.calculatedMinutes / 60;
												this.temp = Math.floor(this.division);
												this.calculatedMinutes =this. modulo;
												this.calculatedHours = this.calculatedHours + Number(this.temp);
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}else{
												this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										else
										{
											this.temp1 = diffrence.split(':');
											this.hours = Number(this.temp1[0]);
											this.minutes = Number(this.temp1[1]);
											this.calculatedMinutes = this.minutes;
											this.calculatedHours = this.hours;
											this.sunHours = this.calculatedHours + ':' + this.calculatedMinutes;
										}
									}else{
										console.log('shift-start-time:' + this.dayArray.start_time );
										console.log('shift-end-time:' + this.dayArray.end_time );


										console.log('payroll-start-time:' + this.payroll.day_start_hours );
										console.log('payroll-end-time:' + this.payroll.day_end_hours );


										this.night = 0;
										this.day = 0;
										this.temp = new Date('1970-01-01T' + this.dayArray.start_time + ':00');
										this.temp1 = new Date('1970-01-01T' + this.dayArray.end_time + ':00');
										this.shiftStartTime = Date.parse(this.temp);
										this.shiftEndTime =  Date.parse(this.temp1);

										this.temp2 = new Date('1970-01-01T' + this.payroll.day_start_hours + ':00');
										this.temp3 = new Date('1970-01-01T' + this.payroll.day_end_hours + ':00');

										this.payrollStart = Date.parse(this.temp2);
										this.payrollEnd = Date.parse(this.temp3);

										this.payrollHoursDiffrence = this.diff(this.payroll.day_start_hours, this.payroll.day_end_hours);
										this.shiftHoursDiffrence = this.diff(this.dayArray.start_time, this.dayArray.end_time);
										this.nightHoursDiffrence = this.diff(this.payroll.day_end_hours, this.payroll.day_start_hours);

										console.log('payroll-hours-diffrence:' + this.payrollHoursDiffrence);
										console.log('shift-hours-diffrence:' + this.shiftHoursDiffrence);
										console.log('shift-night-hours-diffrence:' + this.nightHoursDiffrence);

										this.temp = this.payrollHoursDiffrence.split(':');
										this.temp1 = this.shiftHoursDiffrence.split(':');
										this.temp3 = this.nightHoursDiffrence.split(':');

										this.payrollHours = Number(this.temp[0]);
										this.payrollMInutes = Number(this.temp[1]);
										this.shiftHours = Number(this.temp1[0]);
										this.shiftMinutes = Number(this.temp1[1]);
										this.nightHoursGet = Number(this.temp3[0]);
										this.nightMinutesGet = Number(this.temp3[1]);




										if(this.payrollStart <= this.shiftStartTime && this.shiftEndTime <= this.payrollEnd && this.shiftHours <= this.payrollHours						){

											this.day = this.diff(this.dayArray.start_time, this.dayArray.end_time);
										}else if(this.shiftStartTime >= this.payrollEnd && this.shiftEndTime <= this.payrollStart && this.shiftHours <= this.nightHoursGet){
											this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time)
										}else{
											if(this.shiftStartTime >= this.payrollEnd && this.shiftHours <= this.nightHoursGet){

												this.night = this.diff(this.dayArray.start_time, this.dayArray.end_time);

											}else if(this.shiftStartTime >= this.payrollEnd && this.shiftHours > this.nightHoursGet){

												this.day = this.diff(this.payroll.day_start_hours, this.dayArray.end_time);

												this.night = this.diff(this.dayArray.start_time, this.payroll.day_start_hours);

											}else if(this.shiftStartTime > this.payrollStart && this.shiftEndTime <= this.payrollStart){

												this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

												this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);

											}else if(this.shiftStartTime < this.payrollEnd && this.shiftEndTime <= this.payrollStart){

												this.day = this.diff(this.dayArray.start_time, this.payroll.day_end_hours);
												this.night = this.diff(this.payroll.day_end_hours, this.dayArray.end_time);

											}
										}
										
										if(this.day != 0){
											
											//console.log(diffrence);
											if (this.daysHours != 0)
											{
												this.temp = this.daysHours.split(':');
												this.temp1 = this.day.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes;
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}else{
													this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = this.day.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.daysHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}
										if(this.night != 0){
											//night hours
											if (this.nightHours != 0)
											{
												this.temp = this.night.split(':');
												this.sHours = Number(this.temp[0]);
												this.sMinutes = Number(this.temp[1]);
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);

												this.calculatedMinutes =this.sMinutes + this.minutes,
												this.calculatedHours =this.sHours + this.hours;

												if (this.calculatedMinutes > 60)
												{
													this.modulo = this.calculatedMinutes % 60;
													this.division = this.calculatedMinutes / 60;
													this.temp = Math.floor(this.division);
													this.calculatedMinutes = this.modulo;
													this.calculatedHours = this.calculatedHours + Number(this.temp);
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}else{
													this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
												}
											}
											else
											{
												this.temp1 = this.night.split(':');
												this.hours = Number(this.temp1[0]);
												this.minutes = Number(this.temp1[1]);
												this.calculatedMinutes = this.minutes;
												this.calculatedHours = this.hours;
												this.nightHours = this.calculatedHours + ':' + this.calculatedMinutes;
											}
										}

										console.log('day'+this.day)
										console.log('night'+this.night)
									}
								}


							}

						}
							// }
						// }
					}
				}
			}


			var rates = '';
			var hours = '';
			var amount = '';
			var comments = '';

			for (var n = 0; n < 5; n++)
			{
				if (n == 0)
				{
					rates = rates + '<span class="row"> $' + this.payroll.day + ' </span>';
					hours = hours + '<span class="row"> ' + this.daysHours + ' </span>';
					comments = comments + '<span class="row"> DAY </span>';
					if(this.daysHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.daysHours, this.payroll.day) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.daysHours);
						this.totalAmount = Number(this.totalAmount) + Number(this.calculateAmount(this.daysHours, this.payroll.day));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
				else if (n == 1)
				{
					rates = rates + '<span class="row"> $' + this.payroll.night + ' </span>'
					hours = hours + '<span class="row"> ' + this.nightHours + ' </span>';
					comments = comments + '<span class="row"> NIGHT </span>';
					if(this.nightHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.nightHours, this.payroll.night) + '</span>';						
						this.totalHours = this.calculateHoursFun(this.totalHours, this.nightHours);
						this.totalAmount = Number(this.totalAmount) + Number(this.calculateAmount(this.nightHours, this.payroll.night));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
				else if (n == 2)
				{
					rates = rates + '<span class="row"> $' + this.payroll.sat + ' </span>';
					hours = hours + '<span class="row"> ' + this.satHours + ' </span>'
					comments = comments + '<span class="row"> SATURDAY</span>';
					if(this.satHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.satHours, this.payroll.sat) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.satHours);
						this.totalAmount = Number(this.totalAmount) + Number(this.calculateAmount(this.satHours, this.payroll.sat));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
					
				}
				else if (n == 3)
				{
					rates = rates + '<span class="row"> $' + this.payroll.sun + ' </span>';
					hours = hours + '<span class="row"> ' + this.sunHours + ' </span>';
					comments = comments + '<span class="row"> SUNDAY </span>';
					if(this.sunHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.sunHours, this.payroll.sun) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.sunHours);
						this.totalAmount = Number(this.totalAmount) + Number(this.calculateAmount(this.sunHours, this.payroll.sun));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
				else if (n == 4)
				{
					rates = rates + '<span class="row"> $' + this.payroll.public + ' </span>';
					hours = hours + '<span class="row"> ' + this.pHolidayHours + ' </span>';
					comments = comments + '<span class="row"> PUBLIC HOLIDAY </span>';
					if(this.pHolidayHours != 0){
						amount = amount + '<span class="row"> $' + this.calculateAmount(this.pHolidayHours, this.payroll.public) + '</span>';
						this.totalHours = this.calculateHoursFun(this.totalHours, this.pHolidayHours);
						this.totalAmount = Number(this.totalAmount) + Number(this.calculateAmount(this.pHolidayHours, this.payroll.public));
					}else{
						amount = amount + '<span class="row"> $0.00 </span>';
					}
				}
			}

			this.a = {
				'name': AllUsers[i].username ,
				'rate': rates,
				'hours': hours,
				'amount': amount,
				'comments': comments
			};
			// rows.push(a)
			rows.push(this.a);
		}


		this.a = {
			'name': '<div class="t-footer"></div>',
			'rate': '<div class="t-footer"></div>',
			'hours': '<div class="t-footer">' + this.totalHours + '</div>',
			'amount': '<div class="t-footer">' + this.totalAmount + '</div>',
			'comments': '<div class="t-footer"></div>'
		};
		// rows.push(a)
		rows.push(this.a);
		// EXTRACT VALUE FOR HTML HEADER. 
		// ('Book ID', 'Book Name', 'Category' and 'Price')
		   var doc = new jsPDF('l', 'pt');
            var totalPagesExp = doc.internal.getNumberOfPages();
            doc.page = 1;
            console.log(doc);
            var pageContent = function (data)
            {
                console.log(data);
                // HEADER
                doc.setFontSize(16);
                doc.setTextColor(40);
                doc.setFontStyle('Bold');

                doc.text(userProfile, data.settings.margin.left + 15, 52);

                // FOOTER
                var str = "Page " + doc.page;
                doc.setFontSize(10);
                // doc.text(150,285, 'page ' + data.pageCount);
                // doc.text('page ' + doc.page);

                // var str = 'page ' + doc.page;
                doc.text(data.settings.margin.left, doc.internal.pageSize.getHeight - 10, str);
                // doc.text( 'page ' + doc.page, 150,285);

            };
            doc.setTextColor(6, 6, 6);
            doc.autoTable(columns, rows,
            {
                theme: 'grid',
                bodyStyles:
                {
                    lineWidth: 1,
                    lineColor: [0, 0, 0]
                },
                headerStyles:
                {
                    lineWidth: 1,
                    lineColor: [0, 0, 0],
                    fillColor: [191, 191, 191]
                },
                createdCell: function (columns, rows)
                {
                    if (columns.text[0] != '')
                    {
                        columns.styles.fillColor = "#fff";
                    }
                },
                // styles: {fillColor: [0,0,0, .5],
                // whiteBreak:'breakAll',
                // columnWidth: 'auto' }, 
                // columnStyles: { loc: { columnWidth: 'auto' ,wordBreak:'breakAll', width:20 }},
                styles:
                {
                    fillColor: [224, 224, 224],
                    overflow: 'linebreak'
                },
                columnStyles:
                {
                    'loc':
                    {
                        rowHeight: 30,
                        columnWidth: 200
                    }
                },
                margin:
                {
                    top: 60
                },
                startY: false, // false (indicates margin top value) or a number
                pageBreak: 'auto', // 'auto', 'avoid' or 'always'
                tableWidth: 'auto', // 'auto', 'wrap' or a number, 
                showHeader: 'everyPage', // 'everyPage', 'firstPage', 'never',
                tableLineColor: 200, // number, array (see color section below)
                tableLineWidth: 0,
                addPageContent: pageContent
            });
            // this.pdfSrc = doc.save('workload.pdf');
            doc.save('Payroll.pdf');

	};

	

	getIsShiftOnPublicHoliday(date)
	{
		if (this.holidays.map(x => x.select_date).indexOf(date) == -1)
		{
			return -1;
		}
		else
		{
			return 1;
		}
	}

	calculateHoursFun(total, diffrence){
		this.temp = total.split(':');
		this.temp1 = diffrence.split(':');
		this.sHours = Number(this.temp[0]);
			this.sMinutes = Number(this.temp[1]);
			this.hours = Number(this.temp1[0]);
			this.minutes = Number(this.temp1[1]);

		this.calculatedMinutes = this.sMinutes + this.minutes;
		this.calculatedHours =this.sHours + this.hours;

		if (this.calculatedMinutes > 60)
		{
			this.modulo = this.calculatedMinutes % 60;
			this.division = this.calculatedMinutes / 60;
			this.temp = Math.floor(this.division);
			this.calculatedMinutes = this.modulo;
			this.calculatedHours = this.calculatedHours + Number(this.temp);
			this.temp = this.calculatedHours + ':' + this.calculatedMinutes;
		}else{
			this.temp = this.calculatedHours + ':' + this.calculatedMinutes;
		}

		return this.temp;
	};


	calculateAmount(hours1, amount){
		this.temp3 = hours1.split(':');
		this.hours1 = Number(this.temp3[0]);
		this.minutes = Number(this.temp3[1]);

		this.hoursAmount = this.hours1 * amount;
		this.OneMinutesAmount = amount / 60;
		this.minutesAmount = this.minutes * this.OneMinutesAmount;

		this.temp3 = this.hoursAmount + this.minutesAmount;

		return this.temp3.toFixed(2);

	}






	returnDateAndTime(date, days)
	{
		if (date == 'Mon')
		{
			return days[0];
		}
		else if (date == 'Tue')
		{
			return days[1];
		}
		else if (date == 'Wed')
		{
			return days[2];
		}
		else if (date == 'Thu')
		{
			return days[3];
		}
		else if (date == 'Fri')
		{
			return days[4];
		}
		else if (date == 'Sat')
		{
			return days[5];
		}
		else
		{
			return days[6];
		}
	};

	getTimeIndex(filteredWorkload, start_time, end_time)
	{
		var isValueExist = -1;
		for (var j = 0; j < filteredWorkload.length; j++)
		{
			if (filteredWorkload[j].start_time == start_time && filteredWorkload[j].end_time == end_time)
			{
				isValueExist = 1;
			}
		}

		return isValueExist;
	};

	checkLocation(location, loc)
	{
		return location == loc;
	};
	// getAllEntriesBasedOnSelectedLocation(array, loc){
	//   return array.find(x => x.location.address === loc)
	// };

	ampmForPdf(time)
	{
		console.log(time);
		var start_time = time.start_time,
			end_time = time.end_time,
			start_time_am_pm = time.start_time_am_pm,
			end_time_am_pm = time.end_time_am_pm;
		console.log(start_time, end_time, start_time_am_pm, end_time_am_pm);
		if (start_time != '')
		{
			if (start_time_am_pm == '0')
			{
				start_time_am_pm = 'AM';
			}
			else
			{
				start_time_am_pm = 'PM';
			}

			if (end_time_am_pm == '0')
			{
				end_time_am_pm = 'AM';
			}
			else
			{
				end_time_am_pm = 'PM';
			}
			var formated = start_time + ' ' + start_time_am_pm + ' - ' + end_time + ' ' + end_time_am_pm;
			return formated;
		}
		else
		{
			return "";
		}

	};

	getIndex(array, location)
	{
		if (array.map(x => x.loc).indexOf(location) == -1)
		{
			return -1;
		}
		else
		{
			return 1;
		}
	};

	getUserIndex(array, name)
	{
		var isValueExist = -1;
		for (var j = 0; j < array.length; j++)
		{
			if (array[j].user == name)
			{
				isValueExist = 1;
			}
		}

		return isValueExist;
	}

	handlerStart(e)
	{

		this.today = new Date(e.target.value);
		this.tomorrow = new Date(e.target.value);
		this.tomorrow.setDate(this.today.getDate() + 6);
		console.log(this.formatDate(this.tomorrow));
		this.mindate = e.target.value;
		this.maxdate = this.formatDate(this.tomorrow);
		// this.minimumdate = fullDate;

		console.log('parse select value', e.target.value,Date.parse(e.target.value) )
		// console.log('parse end date value', this.endDate,Date.parse(this.endDate) )
		// console.log('dff bw select and  end date value', this.daysBetween(e.target.value, this.endDate))
		if(this.endDate == ''){
		this.endDate = e.target.value;
		}else if(Date.parse(e.target.value) < Date.parse(this.endDate) && this.daysBetween(e.target.value, this.endDate) <= 7){
		// this.endDate = e.target.value;
		}else if(Date.parse(e.target.value) > Date.parse(this.endDate)){
		this.endDate = e.target.value;
		}else if(Date.parse(e.target.value) < Date.parse(this.endDate) && this.daysBetween(e.target.value, this.endDate) > 7){
		this.startDate = e.target.value;
		this.endDate = e.target.value;
		}
	};

	formatDate(date)
	{
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	};

	diff(start, end)
	{	
		if(start != null){
			start = start.split(":");
			end = end.split(":");
			var startDate = new Date(0, 0, 0, start[0], start[1], 0);
			var endDate = new Date(0, 0, 0, end[0], end[1], 0);
			var diff = endDate.getTime() - startDate.getTime();
			var hours = Math.floor(diff / 1000 / 60 / 60);
			diff -= hours * 1000 * 60 * 60;
			var minutes = Math.floor(diff / 1000 / 60);

			// If using time pickers with 24 hours format, add the below line get exact hours
			if (hours < 0)
			{
				hours = hours + 24;
			}

			return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
		}
	}

	daysBetween( date1, date2 ) {
	   //Get 1 day in milliseconds
	   var one_day=1000*60*60*24;

	   // Convert both dates to milliseconds
	   var date1_ms = new Date(date1).getTime();
	   var date2_ms = new Date(date2).getTime();

	   // Calculate the difference in milliseconds
	   var difference_ms = date2_ms - date1_ms;
	     
	   // Convert back to days and return
	   return Math.round(difference_ms/one_day);
	};

}