import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ShiftService } from '../services/shiftService';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'app-track-user',
  templateUrl: './track-user.component.html',
  styleUrls: ['./track-user.component.css']
})

export class TrackUserComponent implements OnInit {
	row: any = [];
	rows: any = [];
	temp: any = [];
	viewShiftData: any;
	locs: any = [];
	modalRef: any;
	closeResult: any;
	latitude: any;
	longitude: any;
  	constructor(private shiftService: ShiftService, private spinnerService: Ng4LoadingSpinnerService, public modalService:NgbModal) {
  		this.getCurrentshiftsList();
  	} 

  	ngOnInit() {
  	}

   	getAmPmTime(days){
	    for(var i = 0; i < days.length; i++){
	      if(days[i].start_time != 0){
	        var time =  days[i].start_time  + ' - ' + days[i].end_time;  
	        return  time ; 
	        break;
	      }
	    }
  	};

  	getTimeAMPM(start_time){
    	if(start_time != null){
	      	var start, am ;
	      	var start_time1 = start_time.split(':');
	      	start_time = start_time1[0];
	      	start = Number(start_time)
	      	return start  + ':' + start_time1[1];
    	}
  	};

  	//get all security guards list 
    getCurrentshiftsList() {
      	this.spinnerService.show();
      	var Data = {
        	adminId: localStorage.getItem('adminId')
 	 	};

      	this.shiftService.CurrentShiftsList(Data).subscribe((response) => {
        	console.log(response);
        	this.rows = response.data;
         	this.temp = response.data;
        	this.spinnerService.hide();
      	});
    };

    getExactDate(datevalue){
 	 	if(datevalue != null){
	        var date = datevalue.split('-'), finalDate;
	        if(date[2].length == 4){
		        // finalDate = date[2] + '-' + date[1] + '-' + date[0];
		        finalDate = date[0] + '-' + date[1] + '-' + date[2];
      		}else{
		        var str = date[2].split('T');
		        // finalDate = date[0] + '-' + date[1] + '-' + str[0];
		        finalDate = str[0] + '-' + date[1] + '-' + date[0];
 	 		}
      		return finalDate;
    	}
  	};

  	ViewShiftdetail(row, shifts){
      	this.spinnerService.show();
      	this.viewShiftData = row;
      	this.spinnerService.show();
      	var Data = {
        	shiftId: row._id,
        	userId: row.userInfo._id
 	 	};

      	this.shiftService.listLocationsBasedOnShift(Data).subscribe((response) => {
        	console.log(response);
        	this.locs = response.data;
        	this.modalRef = this.modalService.open(shifts);
	      	this.modalRef.result.then((result) => {
	    		this.closeResult = `Closed with: ${result}`;
	  		}, (reason) => {
	    		this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		 	});

		 	//create a geofence on map
	   //      var map = new GMaps({
				// 	div: '#dvMap',
				// 	lat: row.location.address.latitude,
				// 	lng: row.location.address.longitude
				// });

			var map = new google.maps.Map(document.getElementById('dvMap'), {
					    zoom: 2,
					    center: {lat: row.location.address.latitude, lng: row.location.address.longitude},
					    mapTypeId: google.maps.MapTypeId.ROADMAP
					  });
			var polygon =  new google.maps.Circle({
						      strokeColor: '#FF0000',
						      strokeOpacity: 0.8,
						      strokeWeight: 10,
						      fillColor: '#FF0000',
						      fillOpacity: 0.35,
						      map: map,
						      center: {lat: row.location.address.latitude, lng: row.location.address.longitude},
						      radius: Number(row.location.geofence)
			    			});
        	//var mapOptions = {
	        //     center: new google.maps.LatLng(this.locs[0].lat, this.locs[0].lng),
	        //     zoom: 10,
	        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        	// };
	        //var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
	        var infoWindow = new google.maps.InfoWindow();
	        var lat_lng = new Array();
	        var latlngbounds = new google.maps.LatLngBounds();
	        for (i = 0; i < this.locs.length; i++) {
	            var data = this.locs[i]
	            var myLatlng = new google.maps.LatLng(data.lat, data.lng);
	            lat_lng.push(myLatlng);
	            if(i== 0 || i == (this.locs.length-1)){
	            	var marker = new google.maps.Marker({
		                position: myLatlng,
		                map: map,
		                title: 'ABC'
		            });
		            latlngbounds.extend(marker.position);
		            (function (marker, data) {
		                google.maps.event.addListener(marker, "click", function (e) {
		                    infoWindow.setContent(data.description);
		                    infoWindow.open(map, marker);
		                });
		            })(marker, data);
	            }
	           
	        }
	        map.setCenter(latlngbounds.getCenter());
	        map.fitBounds(latlngbounds);
	 
	        //***********ROUTING****************//
	 
	        //Initialize the Path Array
	        var path = new google.maps.MVCArray();
	 
	        //Initialize the Direction Service
	        var service = new google.maps.DirectionsService();
	 
	        //Set the Path Stroke Color
	        var poly = new google.maps.Polyline({ map: map, strokeColor: 'blue' });
	 
	        //Loop and Draw Path Route between the Points on MAP
	        for (var i = 0; i < lat_lng.length; i++) {
	            if ((i + 1) < lat_lng.length) {
	                var src = lat_lng[i];
	                var des = lat_lng[i + 1];
	                path.push(src);
	                poly.setPath(path);
	                service.route({
	                    origin: src,
	                    destination: des,
	                    travelMode: 'WALKING'
	                }, function (result, status) {
	                    if (status == google.maps.DirectionsStatus.OK) {
	                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
	                            path.push(result.routes[0].overview_path[i]);
	                        }
	                    }
	                });
	            }
	        }

	        

	    
        	this.spinnerService.hide();
        	this.latitude = row.location.address.latitude;
	      	this.longitude = row.location.address.longitude;
	      	this.spinnerService.hide();
	      	
      	});
   		
    };

    private getDismissReason(reason: any): string {
	    if (reason === ModalDismissReasons.ESC) {
	      return 'by pressing ESC';
	    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	      return 'by clicking on a backdrop';
	    } else {
	      return  'with:${reason}';
	    }
  	};

    closeModal(){
      	this.modalRef.close();
    };

   

}
