 import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/securityService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../services/loginService';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ShiftService } from '../services/shiftService';
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';
import * as html2canvas from "html2canvas";
// import * as html2pdf from "html2pdf";

declare var jsPDF: any;

declare var $: any;
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

const uploadFormData = new FormData();

@Component({
  selector: 'app-security-guard',
  templateUrl: './security-guard.component.html',
  styleUrls: ['./security-guard.component.css']
})
export class SecurityGuardComponent implements OnInit {
  securityGuardsList: any;
  viewGuardData: any;
  imageURL: any;
  authForm: FormGroup; 
  guardDetails: any;
  previewProfile: any;
  previewLicense: any;
  selectedFileProfile: any;
  selectedFileLicense: any;
  imagePreviewProfile: any;
  imagePreviewLicense: any;
  modalRef: any;
  closeResult: any;
  rows: any;
  guard: any;
  profile: any;
  viewGuardAllShift: any;
  formatted_current_time: any;
  formatted_current_date: any;
  shifts: any;
  rows1: any;
  currentShift: any;
  finalDate:any;
  finalExpDate: any;
  viewShiftData: any;
  rows2: any;
  viewGuardValue: any;
  shiftType: any;
  longitude: any;
  latitude: any;
  status: any;
  temp: any;
  rapidId: any;
  mindate: any;
  mindateEnd: any;
  error: any;
  errorReg: any;
  imageSrc: any;
  radioBtn :any = false;
  open_super_acc: any;
  images: any;
  imagesUpdated: any;
  fromGallery: any;
  filesExtension: any;
  counter: any;
  totalCount: any;
  edit: any;
  printData: any = '';
  criminal_offence: any;
  work_claim: any;
  injury: any;
  resident: any;
  first_aid: any;
  visa_condi: any;
  occupation: any;

  constructor(public securityService: SecurityService,public fb: FormBuilder, public loginService: LoginService,private spinnerService: Ng4LoadingSpinnerService,private toastr: ToastrService,private modalService: NgbModal, public shiftService: ShiftService , public router: Router /*,private dialog: MatDialog*/) {

    this.rapidId = '';
    
    if(localStorage.getItem('adminId') == undefined || localStorage.getItem('adminId') == '' || localStorage.getItem('adminId') == null){
      this.router.navigateByUrl('/');
    };

    this.spinnerService.show();
    this.getSecurityGuardsList();
    this.createForm();
    this.imageURL = 'http://13.59.189.135:3002/images/';
    this.previewProfile = false;
    this.previewLicense = false;

      //get formatted current date   YYYY-MM-DD
      var current_date = new Date();
      var isodate = current_date.toISOString();
      var index = isodate.lastIndexOf('T');
      this.formatted_current_date = isodate.slice(0,index);

    //get formatted current time   HH:MM
    var current_time = current_date.toLocaleTimeString();
    var z = current_time.lastIndexOf(':');
    this.formatted_current_time = current_time.slice(0,z); 

    this.guardDetails = {
      profile_image: '',
      licence_image:''
    };
    this.error = false;
    this.errorReg = false;

    this.filesObjects();

    

  };

  ngOnInit() {
    window.scrollTo(0, 0);
  };

  filesObjects(){
    this.images = {
      'profileImage': null,
      'licenceImage': null,
      'certificateImage': null,
      'visaImage': null,
      'passportImage': null,
      'tfn': null,
      'firstAidImage': null,
      'drivingImage': null,
     };

     this.imagesUpdated = {
      'profileImage': null,
      'licenceImage': null,
      'certificateImage': null,
      'visaImage': null,
      'passportImage': null,
      'tfn': null,
      'firstAidImage': null,
      'drivingImage': null,
     };
     

     this.filesExtension = {
        'profile': null,
        'licence': null,
        'certificate': null,
        'visa': null,
        'passport': null,
        'tfn': null,
        'firstAid': null,
        'driving': null,
     };

     this.fromGallery = {
        'profile': false,
        'license': false,
        'certificate': false,
        'visa': false,
        'passport': false,
        'tfn': false,
        'firstAid': false,
        'driving': false,
     };

     this.counter = 1;
     this.totalCount = 0;
     this.edit = false;
  }


  save(){

    var specialElementHandlers = {
    '#print': function (element, renderer) {
        return true;
      }
    };
    var doc = new jsPDF('l', 'pt');
    doc.fromHTML($('#print').html(), 15, 15, {
        'width': 170,
            'elementHandlers': specialElementHandlers
    },
    function(){

      doc.save('saveInCallback.pdf');
    });
    // doc.save('sample-file.pdf');
  }


  cancel(){
    document.getElementById('print').style.display = 'none';
      document.getElementById('save').style.display = 'none';
      document.getElementById('cancel').style.display = 'none';
  }


  downloadPdf(row) {

      this.printData = row;
      console.log(this.printData)
      var doc = new jsPDF('l', 'pt');
      document.getElementById('print').style.display = 'block';
      document.getElementById('save').style.display = 'block';
      document.getElementById('cancel').style.display = 'block';


       // var data = document.getElementById('print');
       // console.log(data)
      // let printContent = document.getElementById("print");
      // console.log('printContent', printContent);
      // doc.addHTML(printContent, function() {
      //    doc.save("application-form.pdf");
      // });



      // var dd = $("#print").html();
      // alert(dd);
      // console.log(dd)


    // setTimeout(function(){
    //   var element = document.getElementById('print');
    //   html2pdf(element);
        
    //   },5000);


    //   html2canvas(document.querySelector('#print')).then(canvas => {
    //     console.log(canvas)
    //   let pdf = new jsPDF('p', 'mm', 'a4');
    //   pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
    //   pdf.save('filename.pdf');
    // });
  }

  Print(row){
    var ptr = this;
    this.printData = row;
    this.spinnerService.show();
    console.log(this.printData)
    setTimeout(function(){
      ptr.spinnerService.hide();
      let printContent = document.getElementById("print");
      console.log('printContent', printContent);
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();

    }, 2000);
    
  }

  printComponent(cmpName) {
     let printContents = document.getElementById(cmpName).innerHTML;
     let originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}

  getActive(){
    console.log(this.authForm.valid, this.guardDetails.profile_image, this.guardDetails.licence_image);
    if(this.authForm.valid == false && this.guardDetails.profile_image == '' && this.guardDetails.licence_image == ''){
      return true;
    }else  if(this.authForm.valid == false && this.guardDetails.profile_image != '' && this.guardDetails.licence_image != ''){
      return true;
    }else  if(this.authForm.valid == true && this.guardDetails.profile_image != '' && this.guardDetails.licence_image != ''){
      return false;
    }else{
      return false;
    }
  };


  getActive1(){   
    console.log(this.authForm.valid, this.guardDetails.profile_image, this.guardDetails.licence_image); 
    if(this.authForm.valid == false && this.guardDetails.profile_image == '' && this.guardDetails.licence_image == ''){
      return true;
    }else  if(this.authForm.valid == false && this.guardDetails.profile_image != '' && this.guardDetails.licence_image != ''){
      return true;
    }else  if(this.authForm.valid == true && this.guardDetails.profile_image != '' && this.guardDetails.licence_image != ''){
      return false;
    }else{
      return false;
    }
  };



  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var temp;

    // filter our data
    // const temp = this.temp.filter(function(d) {
      
    //   return  d.rapidId.indexOf(val) !== -1 || !val ;
    // });

    if(val != ''){
       temp = this.temp.filter(function(d) {

        if(d){
          return d.rapidId.toLowerCase().indexOf(val) !== -1 || !val ;
        }   
      });
    }else{
      temp = this.temp;
    }

    // update the rows
    this.rows = temp;
  };

  createForm(){
      this.authForm = this.fb.group({
      username: [''],
      password: [''],

      firstname: ['', Validators.compose([Validators.required])],
      primary_email: [''],
      city: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4,15}')])], 
      state: ['', Validators.compose([Validators.required])],  
      postcode:['', Validators.compose([Validators.required])],

      home: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{4,15}')])],
      address: ['', Validators.compose([Validators.required])],
      gender: ['Male', Validators.compose([Validators.required])],
      sstate:[''],
      scity: [''],
      spostcode: [''],
      dob: ['',  Validators.compose([Validators.required])],
      tax_file: ['', Validators.compose([Validators.required])],


      licenseNo: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9]{6,12}$')])],
      drivingLicenseNo: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9]{6,12}$')])],
      licence_exp_date: ['', Validators.compose([Validators.required])],
      first_aid_exp_date: ['', Validators.compose([Validators.required])],

      passportNo: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9]{6,12}$')])],
      bsb: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9]{6,12}$')])],
      acnumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{6,15}$')])],
      acname: ['', Validators.compose([Validators.required])],

      profile_image:[''],
      licence_image:[''],
      certificate_image:[''],
      visa_image:[''],
      first_aid_image:[''],
      tfn_file:[''],
      passport_image:[''],
      driving_image:[''],

      criminal_offence: [''],
      work_claim: [''],
      injury: [''],
      resident: [''],
      first_aid: [''],
      visa_condi: [''],
      occupation: [''],
      work_claim_details: [''],
    });
    };

  fileExtension(string){
    if(string != null){
      var extension = string.split('.').pop();
      if(extension == 'pdf' || extension == 'doc' || extension == 'docx' || extension == 'odt' || extension == 'txt' || extension == 'ppt' || extension == 'ptx' || extension == 'html'){
        return 'pdf';
      }else{
        return 'png';
      }
    }
    
  };

  open(value) {
    if(value.includes("/")){
      window.open(value);
    }else{
      window.open(this.imageURL + value);
    }
    
  };

  formValid(){
    console.log(this.authForm.value);

    if(this.authForm.valid && this.fromGallery.license != false && this.fromGallery.profile != false && this.fromGallery.certificate != false && this.fromGallery.visa != false && this.fromGallery.passport != false && this.fromGallery.firstAid != false && this.fromGallery.tfn != false){    
        return false;
    }else{
      return true;
    }
   
  }

  formValid1(){
    console.log(this.authForm.value);

    if(this.authForm.valid){    
        return false;
    }else{
      return true;
    }
   
  }


  getSecurityGuardsList() {
    var Data = {
      adminId: localStorage.getItem('adminId')
    };
    this.securityService.SecurityGuardsList(Data).subscribe((response) => {
      console.log(response);
      this.securityGuardsList = response;
      this.rows = response.data;
      this.temp = response.data;
      this.spinnerService.hide();
    })
  };

  OnshiftUsers(){
    this.spinnerService.show();
    var Data = {
      admin_id: localStorage.getItem('adminId')
    };
    this.shiftService.CurrentShiftUsers(Data).subscribe((response) => {
      console.log(response);
      this.rows = response.data;
      this.spinnerService.hide();

    })
  };

  //get security guard profile
  getSecurityGuardProfile(){
    var profileData = {
      userId: this.viewGuardAllShift._id
    };

    this.securityService.SecurityGuardProfile(profileData).subscribe((data) => {
      console.log(data);
      this.profile = data[0];
    });
  }; 


  allShiftsofGuard(row,shifts){
    console.log(row);
    this.viewGuardAllShift = row;
    this.getCurrentShift();
     this.modalRef = this.modalService.open(shifts);
    this.modalRef.result.then((result) => {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };


  //get current shift of selected guard
  getCurrentShift(){ 

   if(this.viewGuardValue == "onshiftuser"){
    this.viewGuardAllShift._id = this.viewGuardAllShift.userid;
    }else{
      this.viewGuardAllShift._id = this.viewGuardAllShift._id;
    }   
    var data = {
      userId: this.viewGuardAllShift._id
    };

    this.shiftService.currentShift(data).subscribe((data) => {
      console.log(data);
      this.currentShift = data.data;
      this.getUpcomingShifts();
      this.spinnerService.hide();     
    }); 
  };


  getUpcomingShifts() {
    this.shifts = [];
    this.spinnerService.show();

    var data = {
      userId: this.viewGuardAllShift._id,
      current_date: this.formatted_current_date,
      current_time: this.formatted_current_time

    }
    this.shiftService.UpcomingShiftsList(data).subscribe((data) => {
      console.log(data);
      this.shifts = data.data;
      this.rows1 = data.data;
      this.getPastShifts();
      this.spinnerService.hide();
    });
  };

  getPastShifts(){
    this.shifts = [];
    this.spinnerService.show();

    var data = {
      userId: this.viewGuardAllShift._id,
      current_date: this.formatted_current_date,
      current_time: this.formatted_current_time
    };

    this.shiftService.AllShifts(data).subscribe((data) => {
      console.log(data);
      this.shifts = data.data;
      this.rows2 = data.data;
      this.spinnerService.hide();
    });
  };


  viewGuard(value){
    this.viewGuardData = value;
     this.open_super_acc = value.open_super_acc;
    if(this.viewGuardData.signature != ''){
      this.imageSrc = this.viewGuardData.signature;
    };  
    // if(this.viewGuardData.open_super_acc == true){
    //   document.getElementById("yes1").checked = true;
    // }else{
    //   document.getElementById("no1").checked = true;
    // }
    this.criminal_offence = this.viewGuardData.criminal_offence;
    this.work_claim = this.viewGuardData.work_claim;
    this.injury = this.viewGuardData.injury;
    this.resident = this.viewGuardData.resident;
    this.first_aid = this.viewGuardData.first_aid;
    this.visa_condi = this.viewGuardData.visa_condi;
    this.occupation = this.viewGuardData.occupation;
    // $(document).ready(function(){
    //   if(value.open_super_acc == true){
    //     $('input:radio[name="aaa"][value="criminalYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa"][value="criminalNo"]').attr('checked',true);
    //   } 

    //   if(value.work_claim == true){
    //     $('input:radio[name="aaa1"][value="workClaimYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa1"][value="workClaimNo"]').attr('checked',true);
    //   } 

    //   if(value.injury == true){
    //     $('input:radio[name="aaa2"][value="injuryYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa2"][value="injuryNo"]').attr('checked',true);
    //   }

    //   if(value.resident == true){
    //     $('input:radio[name="aaa3"][value="residentYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa3"][value="iresidentNo"]').attr('checked',true);
    //   }

    //   if(value.occupation == true){
    //     $('input:radio[name="aaa4"][value="occupationYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa4"][value="occupationNo"]').attr('checked',true);
    //   }

    //   if(value.visa_condi == true){
    //     $('input:radio[name="aaa5"][value="visaCondiYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa5"][value="visaCondiNo"]').attr('checked',true);
    //   }

    //     if(value.first_aid == true){
    //     $('input:radio[name="aaa6"][value="firstAidYes"]').attr('checked',true);
    //   }else{
    //     $('input:radio[name="aaa6"][value="firstAidNo"]').attr('checked',true);
    //   }
    // });
  
  };

 openSUperAccValue(value){
    console.log(value)
    this.open_super_acc = value;
  }

  onProfileImageChanged(event,string) {
    console.log(event,string);

    var reader = new FileReader();

    if(string == 'license'){
      this.imagesUpdated.licenceImage = event.target.files[0];
      // this.authForm.get('licence_image').setValue(this.images.licenceImage);
      this.fromGallery.license = true;
      this.totalCount = this.totalCount + 1;
      var extn = event.target.value.split('.')[1];
      this.filesExtension.licence = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.licenceImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.licenceImage = event.target.files[0].name;
      }

    }else if(string == 'profile'){

      // this.authForm.get('profile_image').setValue(this.images.profileImage);
      this.fromGallery.profile = true;
      this.totalCount = this.totalCount + 1;
      this.imagesUpdated.profileImage = event.target.files[0];
      var extn = event.target.value.split('.')[1];
      this.filesExtension.profile = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.profileImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.profileImage = event.target.files[0].name;
      }

    }else if(string == 'certificate'){

      this.imagesUpdated.certificateImage = event.target.files[0];
      // this.authForm.get('certificate_image').setValue(this.images.certificateImage);
      this.fromGallery.certificate = true;
      this.totalCount = this.totalCount + 1;
      var extn = event.target.value.split('.')[1];
      this.filesExtension.certificate = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.certificateImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.certificateImage = event.target.files[0].name;
      }

    }else if(string == 'firstAid'){

      this.imagesUpdated.firstAidImage = event.target.files[0];
      // this.authForm.get('first_aid_image').setValue(this.images.firstAidImage);
      this.fromGallery.firstAid = true;
      this.totalCount = this.totalCount + 1;
      var extn = event.target.value.split('.')[1];
      this.filesExtension.firstAid = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {

          this.images.firstAidImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
               
      }else if(extn == 'pdf'){
         this.images.firstAidImage = event.target.files[0].name;
      }

    }else if(string == 'passport'){

      this.imagesUpdated.passportImage = event.target.files[0];
      // this.authForm.get('passport_image').setValue(this.images.passportImage);
      this.fromGallery.passport = true;
      this.totalCount = this.totalCount + 1;
       var extn = event.target.value.split('.')[1];
      this.filesExtension.passport = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.passportImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.passportImage = event.target.files[0].name;
      }  

    }else if(string == 'visa'){

      this.imagesUpdated.visaImage = event.target.files[0];
      // this.authForm.get('visa_image').setValue(this.images.visaImage);
      this.fromGallery.visa = true;
      this.totalCount = this.totalCount + 1;
      var extn = event.target.value.split('.')[1];
      this.filesExtension.visa = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.visaImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.visaImage = event.target.files[0].name;
      }

    }else if(string == 'driving'){

      this.imagesUpdated.drivingImage = event.target.files[0];
      // this.authForm.get('driving_image').setValue(this.images.drivingImage);
      this.fromGallery.driving = true;
      this.totalCount = this.totalCount + 1;
      var extn = event.target.value.split('.')[1];
      this.filesExtension.driving = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.drivingImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.drivingImage = event.target.files[0].name;
      }

    }else if(string == 'tfn'){

      this.imagesUpdated.tfn = event.target.files[0];
      // this.authForm.get('tfn_file').setValue(this.images.tfn);
      this.fromGallery.tfn = true;
      this.totalCount = this.totalCount + 1;
      var extn = event.target.value.split('.')[1];
      this.filesExtension.tfn = extn;
      if(extn =='jpg' || extn =='png' || extn =='jpeg'){
        reader.onload = () => {
          this.images.tfn = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);               
      }else if(extn == 'pdf'){
         this.images.tfn = event.target.files[0].name;
      }
    }
  };
  
  UpdateGuardInfo1(){
    // alert('updateGuard');
    console.log(this.fromGallery);

    if(this.fromGallery.license == true){
       this.uploadFile(this.imagesUpdated.licenceImage, 'license', 'updateGuard');

    }else if(this.fromGallery.profile == true){
     this.uploadFile(this.imagesUpdated.profileImage, 'profile', 'updateGuard');

    }else if(this.fromGallery.visa == true){
         this.uploadFile(this.imagesUpdated.visaImage, 'visa', 'updateGuard');

    }else if(this.fromGallery.passport == true){
         this.uploadFile(this.imagesUpdated.passportImage, 'passport', 'updateGuard');

    }else if(this.fromGallery.driving == true){
       this.uploadFile(this.imagesUpdated.drivingImage, 'driving', 'updateGuard');

    }else if(this.fromGallery.certificate == true){
       this.uploadFile(this.imagesUpdated.certificateImage, 'certificate', 'updateGuard');

    }else if(this.fromGallery.firstAid == true){
       this.uploadFile(this.imagesUpdated.firstAidImage, 'firstAid', 'updateGuard');

    }else if(this.fromGallery.tfn == true){
      this.uploadFile(this.imagesUpdated.tfn, 'tfn', 'updateGuard');

    }else{

       console.log('this.imagesUpdated', this.imagesUpdated);
      console.log('this.images', this.images);
      console.log('this.fromGallery', this.fromGallery);
      console.log('this.filesExtension', this.filesExtension);

      let dict = {
          city: this.authForm.value.city,
          country: this.authForm.value.country,
          email: this.authForm.value.email,
          firstname: this.authForm.value.firstname,
          contact: this.authForm.value.mobile,
          postcode: this.authForm.value.postcode,
          primary_email: this.authForm.value.primary_email,
          state: this.authForm.value.state,
          address: this.authForm.value.address,
          dob: this.authForm.value.dob,
          gender: this.authForm.value.gender,
          home: this.authForm.value.home,
          scity: this.authForm.value.scity,
          spostcode: this.authForm.value.spostcode,
          sstate: this.authForm.value.sstate,
          tax_file: this.authForm.value.tax_file,
          first_aid_exp_date: this.authForm.value.first_aid_exp_date,
          licence_exp_date: this.authForm.value.licence_exp_date,
          licenseNo: this.authForm.value.licenseNo,
          acname: this.authForm.value.acname,
          acnumber: this.authForm.value.acnumber,
          bsb: this.authForm.value.bsb,
          passportNo: this.authForm.value.passportNo,
          licence_image: this.authForm.value.licence_image,
          first_aid_image: this.authForm.value.first_aid_image,
          driving_image: this.authForm.value.driving_image,
          certificate_image: this.authForm.value.certificate_image,
          passport_image: this.authForm.value.passport_image,
          visa_image: this.authForm.value.visa_image,
          profile_image: this.authForm.value.profile_image,
          tfn_file: this.authForm.value.tfn_file,
          username: this.authForm.value.username,
          password: this.authForm.value.password,

          work_claim: this.authForm.value.work_claim,
          work_claim_details: this.authForm.value.work_claim_details,
          resident: this.authForm.value.resident,
          criminal_offence: this.authForm.value.criminal_offence,
          visa_condi: this.authForm.value.visa_condi,
          injury: this.authForm.value.injury,
          occupation: this.authForm.value.occupation,
          first_aid: this.authForm.value.first_aid,
          drivingLicenseNo: this.authForm.value.drivingLicenseNo,
      };
      console.log('dict------', dict)

      this.UpdateProfileDataNew(dict);
    } 

  };

  uploadFile(value, string, popupValue){
    this.edit = true;
    console.log('----------------');
    console.log('------value----------', value);
    console.log('--------string--------', string);
    console.log('----------------');

    var payload = new FormData();
    payload.append('image', value, value.name);

    this.loginService.UploadImage(payload).subscribe((response) => {
      console.log('image response', response);
        
    if(string == 'license'){
        this.authForm.value.licence_image = response;
        this.imagesUpdated.licenceImage = 'licensestring11';
        this.counter = this.counter + 1;
        this.fromGallery.license = false;
          // loading.dismissAll();
          if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }
        

      }else if(string == 'profile'){
        this.authForm.value.profile_image = response;
        this.imagesUpdated.profileImage = 'profilestring11';
        this.counter = this.counter + 1;
        this.fromGallery.profile = false;
          // loading.dismissAll();
         // this.UpdateGuardInfo1();
          if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }

      }else if(string == 'visa'){
        this.authForm.value.visa_image = response;
        this.imagesUpdated.visaImage = 'visastring11';
        this.counter = this.counter + 1;
        this.fromGallery.visa = false;
        // loading.dismissAll();
        // this.UpdateGuardInfo1();
         if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }

      }else if(string == 'passport'){
        this.authForm.value.passport_image = response;
        this.imagesUpdated.passportImage = 'passportstring11';
        this.counter = this.counter + 1;
        this.fromGallery.passport = false;
          // loading.dismissAll();
        // this.UpdateGuardInfo1();
         if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }

      }else if(string == 'driving'){
        this.authForm.value.driving_image = response;
         this.imagesUpdated.drivingImage = 'drivingstring11';
         this.counter = this.counter + 1;
         this.fromGallery.driving = false;
          // loading.dismissAll();
         // this.UpdateGuardInfo1();
          if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }

      }else if(string == 'certificate'){
        this.authForm.value.certificate_image = response;
         this.imagesUpdated.certificateImage = 'certistring11';
         this.counter = this.counter + 1;
         this.fromGallery.certificate = false;
          // loading.dismissAll();
         // this.UpdateGuardInfo1();
          if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }

      }else if(string == 'firstAid'){
        this.authForm.value.first_aid_image = response;
         this.imagesUpdated.firstAidImage = 'firstadstring11';
         this.counter = this.counter + 1;
         this.fromGallery.firstAid = false;
          // loading.dismissAll();
         // this.UpdateGuardInfo1();
          if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }

      }else if(string == 'tfn'){
        // alert('sss')\
        this.authForm.value.tfn_file = response;
        this.imagesUpdated.tfn = 'tfnstring11';
        this.counter = this.counter + 1;
        this.fromGallery.tfn = false;
          // loading.dismissAll();
         // this.UpdateGuardInfo1();
          if(popupValue == "addGuard"){
            this.AddGuard1();
          }else{
              this.UpdateGuardInfo1();
          }
         // this.uploadFile(this.images.tfn, 'tfn');

      }
    
    });

  };

  UpdateProfileDataNew(dict){
    this.spinnerService.show();
    this.securityService.UpdateSecurityGuardDetails(dict, this.guardDetails._id).subscribe((response) => {
      console.log(response);        
      this.spinnerService.hide(); 
      this.edit = false;
      this.counter = 1;
      this.totalCount = 0;

        if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.getSecurityGuardsList();
            this.toastr.success('Worker has been added successfully!');
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          } 
      // this.getRequestedSecurityGuardsList()         
      // this.toastr.success('Worker has been updated successfully!');
      // this.modalRef.close();
    });
  };


  EditGuard(value, editshift){
    // this.guardDetails = {};
    this.filesObjects();
    this.authForm.get('password').setValidators([Validators.required]);
    this.previewProfile = false;
    console.log('value edit ', value,editshift);
    this.guardDetails = value;
    this.open_super_acc = value.open_super_acc;
    // this.viewGuardValue = uservalue;
    $(document).ready(function(){
      if(value.open_super_acc == true){
        $('input:radio[name="aaa"][value="criminalYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa"][value="criminalNo"]').attr('checked',true);
      } 

      if(value.work_claim == true){
        $('input:radio[name="aaa1"][value="workClaimYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa1"][value="workClaimNo"]').attr('checked',true);
      } 

      if(value.injury == true){
        $('input:radio[name="aaa2"][value="injuryYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa2"][value="injuryNo"]').attr('checked',true);
      }

      if(value.resident == true){
        $('input:radio[name="aaa3"][value="residentYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa3"][value="iresidentNo"]').attr('checked',true);
      }

      if(value.occupation == true){
        $('input:radio[name="aaa4"][value="occupationYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa4"][value="occupationNo"]').attr('checked',true);
      }

      if(value.visa_condi == true){
        $('input:radio[name="aaa5"][value="visaCondiYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa5"][value="visaCondiNo"]').attr('checked',true);
      }

        if(value.first_aid == true){
        $('input:radio[name="aaa6"][value="firstAidYes"]').attr('checked',true);
      }else{
        $('input:radio[name="aaa6"][value="firstAidNo"]').attr('checked',true);
      }
    });

    // this.mindateEnd = value.licence_start_date;
    var finalDate, finalExpDate, finalStartDate;

    var date = value.licence_exp_date.split('-'), finalDate;
    if(date[2].length == 4){
      finalExpDate = date[2] + '-' + date[1] + '-' + date[0];
      // finalExpDate = new Date(finalDate);
    }else{
      var str = date[2].split('T');
      finalExpDate = date[0] + '-' + date[1] + '-' + str[0];
      // finalExpDate = new Date(finalDate); 
    }

    var temp_licence  = value.licence_exp_date.split('T'); 

    //set values on form
    this.authForm.patchValue({

        firstname: value.firstname,
        primary_email: value.primary_email,
        city:  value.city,
        country: value.country,
        email: value.email,
        state: value.state,
        mobile: value.contact,
        postcode: value.postcode,

        home: value.home,
        address: value.address,
        gender: value.gender,
        sstate:  value.sstate,
        scity: value.scity,
        spostcode: value.spostcode,
        dob: value.dob,
        tax_file: value.tax_file,

                
        licenseNo: value.licenseNo,
        licence_exp_date: temp_licence[0],
        first_aid_exp_date: value.first_aid_exp_date,

        passportNo: value.passportNo,
        bsb: value.bsb,
        acnumber:value.acnumber,
        acname: value.acname,

        profile_image: value.profile_image,
        licence_image: value.licence_image,
        certificate_image: value.certificate_image,
        visa_image: value.visa_image,
        passport_image: value.passport_image,
        first_aid_image: value.first_aid_image,
        tfn_file: value.tfn_file,
        driving_image: value.driving_image,

        username: value.username,
        password: value.password,

        work_claim: value.work_claim,
        work_claim_details: value.work_claim_details,
        resident: value.resident,
        injury: value.injury,
        first_aid: value.first_aid,
        criminal_offence: value.criminal_offence,
        occupation: value.occupation,
        visa_condi: value.visa_condi,
    });
    
   

    this.modalRef = this.modalService.open(editshift);
    this.modalRef.result.then((result) => {
        //  console.log(result);
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // console.log(reason);
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  UpdateGuardInfo(){
  var guardData, userData,value;
  this.spinnerService.show();
  this.guardDetails._id = this.guardDetails._id;

  if(this.previewProfile == true && this.previewLicense == true){
    var payload = new FormData();
    payload.append('image', this.selectedFileProfile, this.selectedFileProfile.name);

    this.loginService.UploadImage(payload).subscribe((response) => {
      console.log(response);
      this.authForm.value.profile_image = response;
      var payload1 = new FormData();
      payload1.append('image', this.selectedFileLicense, this.selectedFileLicense.name);

      this.loginService.UploadImage(payload1).subscribe((response) => {
        console.log(response);
        this.authForm.value.licence_image = response;
        console.log(this.authForm.value);

          var value = this.authForm.value;

          userData = {
            eName: value.eName,
              eaddress: value.eaddress,
              econtact: value.econtact,
              fund_name: value.fund_name,
              membership: value.membership,
              relationship: value.relationship,

              firstname: value.firstname,
              primary_email: value.primary_email,
              city:  value.city,
              country: value.country,
              email: value.email,
              state: value.state,
              postcode: value.postcode,

              address: value.address,
              gender: value.gender,
              sstate:  value.sstate,
              scity: value.scity,
              spostcode: value.spostcode,
              dob: value.dob,
              tax_file: value.tax_file,

              home: value.home,
              mobile: value.contact,
              licenseNo: value.licenseNo,
              licence_exp_date: value.licence_exp_date,
              bsb: value.bsb,
              acnumber:value.acnumber,
              acname: value.acname,
              open_super_acc: this.open_super_acc,
              profile_image: response,

              username: value.username,
              password: value.password
          };
          
        this.securityService.UpdateSecurityGuardDetails(userData, this.guardDetails._id).subscribe((response) => {
          console.log(response);
          this.spinnerService.hide();

          if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            //this.getSecurityGuardsList();
            this.toastr.success('Worker has been added successfully!');
            this.getSecurityGuardsList();
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          } 
        })
        
      });
    });

  }else if(this.previewLicense == true){
    uploadFormData.append('image', this.selectedFileLicense, this.selectedFileLicense.name);
    this.loginService.UploadImage(uploadFormData).subscribe((response) => {
      console.log(response);
      this.authForm.value.licence_image = response;
      console.log(this.authForm.value);

      guardData = {
        firstname: this.authForm.value.firstname,
        // lastname: '',
        username:  this.authForm.value.username,
        password: this.authForm.value.password,
        contact:  this.authForm.value.contact,
        address: this.authForm.value.address,
        city: this.authForm.value.city,
        email:  this.authForm.value.email,
        country: this.authForm.value.country,
        // licence_start_date: this.authForm.value.licence_start_date,
        licence_exp_date: this.authForm.value.licence_exp_date,
        profile_image: this.authForm.value.profile_image,
        licence_image: this.authForm.value.licence_image,
        licenseNo: this.authForm.value.licenseNo,
        idNumber: this.authForm.value.idNumber,
        gender: this.authForm.value.gender,
        value: 'admin'
      };
      this.securityService.UpdateSecurityGuardDetails(guardData, this.guardDetails._id).subscribe((response) => {
        console.log(response);
        this.spinnerService.hide();

         if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.getSecurityGuardsList();
            this.toastr.success('Worker has been added successfully!');
            this.getSecurityGuardsList();
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          } 
        //  if(this.viewGuardValue == "onshiftuser"){
        //   this.OnshiftUsers();
        //  }else{
        //   this.getSecurityGuardsList();
        //  }
        
        // this.toastr.success('Worker has been updated successfully!');
        // this.modalRef.close();
      });        
    });
  }else if(this.previewProfile == true){
    uploadFormData.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
    this.loginService.UploadImage(uploadFormData).subscribe((response) => {
      console.log(response);
      this.authForm.value.profile_image = response;
      console.log(this.authForm.value);
      value = this.authForm.value;

      userData = {
        eName: value.eName,
          eaddress: value.eaddress,
          econtact: value.econtact,
          fund_name: value.fund_name,
          membership: value.membership,
          relationship: value.relationship,

          firstname: value.firstname,
          primary_email: value.primary_email,
          city:  value.city,
          country: value.country,
          email: value.email,
          state: value.state,
          postcode: value.postcode,

          address: value.address,
          gender: value.gender,
          sstate:  value.sstate,
          scity: value.scity,
          spostcode: value.spostcode,
          dob: value.dob,
          tax_file: value.tax_file,

          home: value.home,
          mobile: value.mobile,
          licenseNo: value.licenseNo,
          licence_exp_date: value.licence_exp_date,
          bsb: value.bsb,
          acnumber:value.acnumber,
          acname: value.acname,
          open_super_acc: this.open_super_acc,
          profile_image: response,

          username: value.username,
          password: value.password
      }
      this.securityService.UpdateSecurityGuardDetails(userData, this.guardDetails._id).subscribe((response) => {
        console.log(response);
        this.spinnerService.hide();


          if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.getSecurityGuardsList();
            this.toastr.success('Worker has been added successfully!');
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          } 


        //   if(this.viewGuardValue == "onshiftuser"){
        //   this.OnshiftUsers();
        //  }else{
        //   this.getSecurityGuardsList();
        //  }
        // this.toastr.success('Worker has been updated successfully!');
        // this.modalRef.close();
      });        
    });
  }else{
    console.log(this.authForm.value);
     value = this.authForm.value;

      userData = {
        eName: value.eName,
          eaddress: value.eaddress,
          econtact: value.econtact,
          fund_name: value.fund_name,
          membership: value.membership,
          relationship: value.relationship,

          firstname: value.firstname,
          primary_email: value.primary_email,
          city:  value.city,
          country: value.country,
          email: value.email,
          state: value.state,
          postcode: value.postcode,

          address: value.address,
          gender: value.gender,
          sstate:  value.sstate,
          scity: value.scity,
          spostcode: value.spostcode,
          dob: value.dob,
          tax_file: value.tax_file,

          home: value.home,
          mobile: value.mobile,
          licenseNo: value.licenseNo,
          licence_exp_date: value.licence_exp_date,
          bsb: value.bsb,
          acnumber:value.acnumber,
          acname: value.acname,
          open_super_acc: this.open_super_acc,
          profile_image: value.profile_image,

          username: value.username,
          password: value.password
      }
    this.securityService.UpdateSecurityGuardDetails(userData, this.guardDetails._id).subscribe((response) => {
      console.log(response);        
      this.spinnerService.hide(); 

        if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.getSecurityGuardsList();
            this.toastr.success('Worker has been added successfully!');
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          } 
      // this.getSecurityGuardsList();         
      // this.toastr.success('Worker has been updated successfully!');
      // this.modalRef.close();
    });  
  }
  };


  // onProfileImageChanged(event) {
  //   this.previewProfile = true;
  //   var selectedFileProfile = event.target.files[0];
  //   this.selectedFileProfile = selectedFileProfile;
  //   this.authForm.get('profile_image').setValue(selectedFileProfile);
  //   console.log(event.target, event.target.files[0])
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreviewProfile = reader.result;
  //     console.log('imagePreviewProfile', this.imagePreviewProfile);
  //   };
  //   reader.readAsDataURL(selectedFileProfile);
  // };

  onLicenseImageChanged(event) {
  this.previewLicense = true;
  var selectedFileLicense = event.target.files[0];
  this.selectedFileLicense = selectedFileLicense;
  this.authForm.get('licence_image').setValue(selectedFileLicense);
  console.log(event.target, event.target.files[0])
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreviewLicense = reader.result;
  };
  reader.readAsDataURL(selectedFileLicense);
  };


  changeStatus(data, value){
  this.spinnerService.show();
  console.log(data, value);
  var Data = {
    id: data._id,
    status: value, 
    value: 'admin'
  };
  this.securityService.ChangeStatusForGuards(Data).subscribe((response) => {
    console.log(response);
    // this.securityGuardsList = response;
      this.spinnerService.hide();
      this.getSecurityGuardsList();
  if(response[0].adminStatus == 2){
  this.toastr.success('Worker has been approved successfully!');

  }else if(response[0].adminStatus == 1){
  this.toastr.success('Worker has been declined successfully!');

  }

  })
  };

  changeUserStatus(row, status){
  this.guard = row;
   this.status = status; 
  }

  changeActiveInctiveStatus(row, status){
  
  this.spinnerService.show();
  console.log(row, status);
  var Data = {
    id: row._id,
    status: status,
    value: 'admin'
  };

    this.securityService.ChangeStatusForGuards(Data).subscribe((response) => {
    console.log(response);
    // this.securityGuardsList = response;
      this.spinnerService.hide();
      this.getSecurityGuardsList();
  if(response[0].adminStatus == 2){
  this.toastr.success('Worker has been approved successfully!');

  }else if(response[0].adminStatus == 1){
  this.toastr.success('Worker has been declined successfully!');

  }

  })
  // this.securityService.ChangeActiveInactiveStatusForGuards(Data).subscribe((response) => {
  //   console.log(response);
  //   // this.securityGuardsList = response;
  //     this.spinnerService.hide();
  //     this.getSecurityGuardsList();
  // if(response[0].adminActiveInactiveStatus == 2){
  // this.toastr.success('User is active now!');

  // }else if(response[0].adminActiveInactiveStatus == 1){
  // this.toastr.success('User is inactive now!');

  // }

  // });
  };


  DeleteGuard(row){
    this.guard = row;
  }

  deleteGuard(guard){
    this.spinnerService.show();
    var shiftData = {
      id: guard._id,
      trashValue: 1, 
      value: 'user',
    }
    console.log(shiftData);
    this.securityService.moveRestoreGuradFromTrash(shiftData).subscribe((response) => {
      console.log(response);  
      this.spinnerService.hide();
      this.getSecurityGuardsList();  
      this.toastr.success('Worker moved to trash!');
    // this.modalRef.close(); 

  }); 
  };

  closeModal(){
    this.modalRef.close();
  };

  viewShift(row, shifts, type){
    this.shiftType = type;
    this.spinnerService.show();
    this.viewShiftData = row;
    console.log(row)
     this.latitude = row.location.latitude;
    this.longitude = row.location.longitude;
    this.spinnerService.hide();
    this.modalRef = this.modalService.open(shifts);
    this.modalRef.result.then((result) => {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  changeStatusShift(row,i, is_approve){
    this.spinnerService.show();
    console.log(row,i,is_approve);

    var shiftData = {
      shiftId: row._id,
        status: is_approve,
        userId: is_approve ? row.accepted_by.toString() : ''
      };
    console.log(shiftData);
    this.shiftService.changeAdminApproval(shiftData).subscribe((response) => {
      console.log(response);  
      this.spinnerService.hide();
      if(is_approve != true){
        alert('Shift has been approved successfully.');
      }else{
        alert('Shift has been disapproved successfully.');
      }
      
    // this.modalRef.close(); 

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

   formatedDate1(value){
  if(value != null){
    var temp = value.split('T'); 
      var temp1 = temp[0].split('-');
      return (temp1[2] + '-' + temp1[1] + '-' + temp1[0]);
  }
    
  };

   formatedDate12(value){
  if(value != null){ 
      var temp1 = value.split('-');
      return (temp1[2] + '-' + temp1[1] + '-' + temp1[0]);
  }
    
  };


  getCalenderDate(datevalue){
    if(datevalue != null){
      var date = datevalue.split('-'), finalDate;
      if(date[2].length == 4){
        finalDate = date[2] + '-' + date[1] + '-' + date[0];
        finalDate = new Date(finalDate);
      }else{
        var str = date[2].split('T');
        finalDate = date[0] + '-' + date[1] + '-' + str[0];
        finalDate = new Date(finalDate); 
      }
      return finalDate;
    }
  };

  getAmPmTime(days){
    console.log(days)
    if(days[0].start_time != 0){
      return days[0].start_time + '-' + days[0].end_time;
    }else if(days[1].start_time != 0){
      return days[1].start_time + '-' + days[1].end_time;
    }else  if(days[2].start_time != 0){
    
      return days[2].start_time + '-' + days[2].end_time;
    }else if(days[3].start_time != 0){
      
      return days[3].start_time + '-' + days[3].end_time;
    }else if(days[4].start_time != 0){
    
      return days[4].start_time + '-' + days[4].end_time;
    }else if(days[5].start_time != 0){
      return days[5].start_time + '-' + days[5].end_time;
    }else if(days[6].start_time != 0){
      return days[6].start_time + '-' + days[6].end_time;
    }
      // var test = this.checkAvailableTime(days, 1);
      // return test;

      // var start = days[0].start_time + ':00',
      // am = days[0].start_time_am_pm == 1 ? ' PM' : ' AM',
      // end = days[0].end_time + ':00',
      // pm = days[0].end_time_am_pm == 1 ? ' PM' : ' AM';
      //return  start + am + ' - ' + end + pm;  
  };

  checkAvailableTime(days, index){
    if(days[index].start_time != 0){
      var start = days[index].start_time + ':00',
      am = days[index].start_time_am_pm == 1 ? ' PM' : ' AM',
      end = days[index].end_time + ':00',
      pm = days[index].end_time_am_pm == 1 ? ' PM' : ' AM';
      //return  start + am + ' - ' + end + pm; 
      //return days[index].start_time + '-' + days[index].end_time;
    }else{
      var indexValue = index + 1;
      this.checkAvailableTime(days, indexValue);
    }
  };

  getAmPmDay(shift, days){
    if(days[0].start_time != 0){
      var startDate = shift.start_date_parsed; 
      var dateObject = new Date(startDate);
      var selectedDate = dateObject.toLocaleDateString();
      var currentDay = dateObject.toString().split(' ')[0];
      return dateObject;
      console.log(selectedDate + ' = ' + currentDay)
    }else{
      var startDate = shift.start_date_parsed; 
      var dateObject = new Date(startDate);
      var selectedDate = dateObject.toLocaleDateString();
      var currentDay = dateObject.toString().split(' ')[0];
      var test = this.getDateAccordingDays(currentDay, shift, dateObject, 1);
      return test;
    }   
  };

  getIndex(day, days){
    for(var i=0; i < days.length; i++){
      if(days[i].day == day){
        return i;
      }
    }
  };

  getDateAccordingDays(currentDay, shift, selectedDate, index){
    var indexValue;
    if(currentDay == 'Mon'){
      indexValue = this.getIndex('Monday', shift.days);
    }else if(currentDay == 'Tue'){
      indexValue = this.getIndex('Tuesday', shift.days);
    }else if(currentDay == 'Wed'){
      indexValue = this.getIndex('Wednesday', shift.days);
    }else if(currentDay == 'Thu'){
      indexValue = this.getIndex('Thursday', shift.days);
    }else if(currentDay == 'Fri'){
      indexValue = this.getIndex('Friday', shift.days);
    }else if(currentDay == 'Sat'){
      indexValue = this.getIndex('Saturday', shift.days);
    }else if(currentDay == 'Sun'){
      indexValue = this.getIndex('Sunday', shift.days);
    }
    if(shift.days[indexValue].start_time != 0){
      //console.log(shift.days[indexValue].start_time)
      var d = selectedDate;
      var currentSelectedDate = Date.parse(selectedDate);
      return selectedDate;
    }else{
      var nextDay = selectedDate;
      nextDay.setDate(selectedDate.getDate()+1);
      // console.log(nextDay);
      var nextSelectedDate = nextDay.toLocaleDateString();
      var currentDay = nextDay.toString().split(' ')[0];
      var endDate = shift.end_date_parsed;
      var nextDate = Date.parse(nextDay);
      index = index + 1;
      this.getDateAccordingDays(currentDay, shift, nextDay, index);
    }
  };


getTime(start_time, end_time){
  if(start_time != null){
    var start, am , pm, end;
    var start_time1 = start_time.split(':');
    var end_time1 = end_time.split(':');
    start_time = start_time1[0];
    end_time = end_time1[0];
    // if(Number(start_time) > 12){
    //   start = Number(start_time) - 12; 
    //   am = ' PM';
    // }else if(Number(start_time) == 12){
    //   start = Number(start_time);
    //   am = ' PM';
    // }else {
    //   start = Number(start_time);
    //   am = ' AM';
    // }


    // if(Number(end_time) > 12){
    //   end = Number(end_time) - 12;
    //   pm = ' PM'; 
    // }else if(Number(end_time) == 12){
    //   end = Number(end_time);
    //   pm = ' PM'; 
    // }else {
    //   end = Number(end_time);
    //   pm = ' AM'; 
    // }

    start = Number(start_time);
    end = Number(end_time);

    // return start  + ':' + start_time1[1] + am + ' - ' + end + ':' + end_time1[1] + pm;
    return start  + ':' + start_time1[1] + ' - ' + end + ':' + end_time1[1];
  }   

 };

getTimeAMPM(start_time){
    if(start_time != null){
      var start, am ;
      var start_time1 = start_time.split(':');
      start_time = start_time1[0];
      // if(Number(start_time) > 12){
      //   start = Number(start_time) - 12; 
      //   am = ' PM';
      // }else if(Number(start_time) == 12){
      //   start = Number(start_time);
      //   am = ' PM';
      // }else {
      //   start = Number(start_time);
      //   am = ' AM';
      // }

      start = Number(start_time)

      // return start  + ':' + start_time1[1] + am;
      return start  + ':' + start_time1[1];
    }
    
  };

  addNewSecurityGuard(addGuard){
    this.authForm.get('password').setValidators(null);
    this.authForm.get('password').setErrors(null);

    this.open_super_acc = true;
    console.log('addnewsecurityguard');
        this.authForm.patchValue({
      firstname:'',
      // lastname: '',
      username: '',
      password:'',
      contact: '',
      address:'',
      city:'',
      email: '',
      country: '',
      // licence_start_date: '',
      licence_exp_date: '' ,
      profile_image: '',
      licence_image: '',
      licenseNo: '',
      idNumber: '',
      gender: ''
    });

        this.authForm.reset();

    this.guardDetails = {
      profile_image: '',
      licence_image:''
    }
        this.previewLicense = false;
        this.previewProfile = false

       this.modalRef = this.modalService.open(addGuard);
    this.modalRef.result.then((result) => {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

AddGuard1(){
  // alert('addGuard');
  console.log(this.fromGallery);
    if(this.fromGallery.license == true){
       this.uploadFile(this.imagesUpdated.licenceImage, 'license', 'addGuard');

    }else if(this.fromGallery.profile == true){
     this.uploadFile(this.imagesUpdated.profileImage, 'profile', 'addGuard');

    }else if(this.fromGallery.visa == true){
         this.uploadFile(this.imagesUpdated.visaImage, 'visa', 'addGuard');

    }else if(this.fromGallery.passport == true){
         this.uploadFile(this.imagesUpdated.passportImage, 'passport', 'addGuard');

    }else if(this.fromGallery.driving == true){
       this.uploadFile(this.imagesUpdated.drivingImage, 'driving', 'addGuard');

    }else if(this.fromGallery.certificate == true){
       this.uploadFile(this.imagesUpdated.certificateImage, 'certificate', 'addGuard');

    }else if(this.fromGallery.firstAid == true){
       this.uploadFile(this.imagesUpdated.firstAidImage, 'firstAid', 'addGuard');

    }else if(this.fromGallery.tfn == true){
      this.uploadFile(this.imagesUpdated.tfn, 'tfn', 'addGuard');

    }else{

      console.log('this.imagesUpdated', this.imagesUpdated);
      console.log('this.images', this.images);
      console.log('this.fromGallery', this.fromGallery);
      console.log('this.filesExtension', this.filesExtension);

      let dict = {
        city: this.authForm.value.city,
        country: this.authForm.value.country,
        email: this.authForm.value.email,
        firstname: this.authForm.value.firstname,
        contact: this.authForm.value.mobile,
        postcode: this.authForm.value.postcode,
        primary_email: this.authForm.value.primary_email,
        state: this.authForm.value.state,
        address: this.authForm.value.address,
        dob: this.authForm.value.dob,
        gender: this.authForm.value.gender,
        home: this.authForm.value.home,
        scity: this.authForm.value.scity,
        spostcode: this.authForm.value.spostcode,
        sstate: this.authForm.value.sstate,
        tax_file: this.authForm.value.tax_file,
        first_aid_exp_date: this.authForm.value.first_aid_exp_date,
        licence_exp_date: this.authForm.value.licence_exp_date,
        licenseNo: this.authForm.value.licenseNo,
        acname: this.authForm.value.acname,
        acnumber: this.authForm.value.acnumber,
        bsb: this.authForm.value.bsb,
        passportNo: this.authForm.value.passportNo,
        licence_image: this.authForm.value.licence_image,
        first_aid_image: this.authForm.value.first_aid_image,
        driving_image: this.authForm.value.driving_image,
        certificate_image: this.authForm.value.certificate_image,
        passport_image: this.authForm.value.passport_image,
        visa_image: this.authForm.value.visa_image,
        profile_image: this.authForm.value.profile_image,
        tfn_file: this.authForm.value.tfn_file,
        value: 'admin',
        signature: '',
      };
      console.log('dict------', dict)

      this.AddGuardNew(dict);
    }
}



AddGuardNew(dict){
  this.securityService.AddSecurityGuardDetails(dict).subscribe((response) => {
          console.log(response);
          this.edit = false;
          this.counter = 1;
          this.totalCount = 0;

          this.spinnerService.hide();
          // isSpinner = true;
          if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.toastr.success('Worker has been added successfully!');
            this.getSecurityGuardsList();
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          }   
         
        })
}

AddGuard(){
  var isSpinner = false, guardData;
  this.spinnerService.show();
  console.log(this.authForm.value);
  console.log(this.selectedFileProfile, this.selectedFileLicense)
   if(this.previewProfile == true ){
    var payload = new FormData();
    payload.append('image', this.selectedFileProfile, this.selectedFileProfile.name);

    this.loginService.UploadImage(payload).subscribe((response) => {
      console.log(response);
      this.authForm.value.profile_image = response;
      var payload1 = new FormData();
      payload1.append('image', this.selectedFileLicense, this.selectedFileLicense.name);
      if(isSpinner == false){
        this.spinnerService.show();
      }
      
      // this.loginService.UploadImage(payload1).subscribe((response) => {
      //   console.log(response);
      //   this.authForm.value.licence_image = response;
      //   console.log(this.authForm.value);

      var value = this.authForm.value;

        guardData = {
          eName: value.eName,
          eaddress: value.eaddress,
          econtact: value.econtact,
          fund_name: value.fund_name,
          membership: value.membership,
          relationship: value.relationship,

          firstname: value.firstname,
          primary_email: value.primary_email,
          city:  value.city,
          country: value.country,
          email: value.email,
          state: value.state,
          postcode: value.postcode,

          address: value.address,
          gender: value.gender,
          sstate:  value.sstate,
          scity: value.scity,
          spostcode: value.spostcode,
          dob: value.dob,
          tax_file: value.tax_file,
          signature: '',
          home: value.home,
          mobile: value.mobile,
          licenseNo: value.licenseNo,
          licence_exp_date: value.licence_exp_date,
          bsb: value.bsb,
          acnumber:value.acnumber,
          acname: value.acname,
          open_super_acc: this.open_super_acc,
          profile_image: response,

          username: value.username,
          password: value.password,
          value: 'admin'
        } 
 
        this.securityService.AddSecurityGuardDetails(guardData).subscribe((response) => {
          console.log(response);

          this.spinnerService.hide();
          isSpinner = true;
          if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.toastr.success('Worker has been added successfully!');
            this.getSecurityGuardsList();
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          }   
         
        })
        
    });

  }
  // else if(this.previewLicense == true){
  //   uploadFormData.append('image', this.selectedFileLicense, this.selectedFileLicense.name);
  //   this.loginService.UploadImage(uploadFormData).subscribe((response) => {
  //     console.log(response);
  //     this.authForm.value.licence_image = response;
  //     console.log(this.authForm.value);
  //       guardData = {
  //         firstname: this.authForm.value.firstname,
  //         // lastname: '',
  //         username:  this.authForm.value.username,
  //         password: this.authForm.value.password,
  //         contact:  this.authForm.value.contact,
  //         address: this.authForm.value.address,
  //         city: this.authForm.value.city,
  //         email:  this.authForm.value.email,
  //         country: this.authForm.value.country,
  //         licence_start_date: this.authForm.value.licence_start_date,
  //         licence_exp_date: this.authForm.value.licence_exp_date,
  //         profile_image: this.authForm.value.profile_image,
  //         licence_image: this.authForm.value.licence_image,
  //         licenseNo: this.authForm.value.licenseNo,
  //         idNumber: this.authForm.value.idNumber,
  //         gender: this.authForm.value.gender,
  //         value: 'admin'
  //       } 

  //     this.securityService.AddSecurityGuardDetails(guardData).subscribe((response) => {
  //       console.log(response);
  //       this.spinnerService.hide();  

  //       if(response.status == 2){
  //           this.toastr.error('Another user having same license number!');
  //         }else if(response.status == 3){
  //           this.toastr.error('Another user having same license id!');
  //         }else if(response.status == 4){
  //           this.toastr.error('Another user having same email!');
  //         }else{
  //           this.toastr.success('Worker has been added successfully!');
  //           this.getSecurityGuardsList();
  //           // this.router.navigateByUrl('/requested-guards');
  //           this.modalRef.close();
  //         } 
        
  //       // this.toastr.success('Worker has been added successfully!');
  //       // // this.router.navigateByUrl('/requested-guards');
  //       // this.modalRef.close();
  //     });        
  //   });
  // }else if(this.previewProfile == true){
  //   uploadFormData.append('image', this.selectedFileProfile, this.selectedFileProfile.name);
  //   this.loginService.UploadImage(uploadFormData).subscribe((response) => {
  //     console.log(response);
  //     this.authForm.value.profile_image = response;
  //     console.log(this.authForm.value);
  //       guardData = {
  //         firstname: this.authForm.value.firstname,
  //         // lastname: '',
  //         username:  this.authForm.value.username,
  //         password: this.authForm.value.password,
  //         contact:  this.authForm.value.contact,
  //         address: this.authForm.value.address,
  //         city: this.authForm.value.city,
  //         email:  this.authForm.value.email,
  //         country: this.authForm.value.country,
  //         licence_start_date: this.authForm.value.licence_start_date,
  //         licence_exp_date: this.authForm.value.licence_exp_date,
  //         profile_image: this.authForm.value.profile_image,
  //         licence_image: this.authForm.value.licence_image,
  //         licenseNo: this.authForm.value.licenseNo,
  //         idNumber: this.authForm.value.idNumber,
  //         gender: this.authForm.value.gender,
  //         value: 'admin'
  //       } 

  //     this.securityService.AddSecurityGuardDetails(guardData).subscribe((response) => {
  //       console.log(response);
  //       this.spinnerService.hide();   

  //            if(response.status == 2){
  //           this.toastr.error('Another user having same license number!');
  //         }else if(response.status == 3){
  //           this.toastr.error('Another user having same license id!');
  //         }else if(response.status == 4){
  //           this.toastr.error('Another user having same email!');
  //         }else{
  //           this.toastr.success('Worker has been added successfully!');
  //           this.getSecurityGuardsList();
  //           // this.router.navigateByUrl('/requested-guards');
  //           this.modalRef.close();
  //         } 
  //       // this.toastr.success('Worker has been added successfully!');
  //       // this.router.navigateByUrl('/requested-guards');
  //       // this.modalRef.close();
  //     });        
  //   });
  // }
  else{
    console.log(this.authForm.value);

    var value = this.authForm.value;
    guardData = {
     eName: value.eName,
    eaddress: value.eaddress,
    econtact: value.econtact,
    fund_name: value.fund_name,
    membership: value.membership,
    relationship: value.relationship,

    firstname: value.firstname,
    primary_email: value.primary_email,
    city:  value.city,
    country: value.country,
    email: value.email,
    state: value.state,
    postcode: value.postcode,

    address: value.address,
    gender: value.gender,
    sstate:  value.sstate,
    scity: value.scity,
    spostcode: value.spostcode,
    dob: value.dob,
    tax_file: value.tax_file,

    home: value.home,
    mobile: value.mobile,
    licenseNo: value.licenseNo,
    licence_exp_date: value.licence_exp_date,
    bsb: value.bsb,
    acnumber:value.acnumber,
    acname: value.acname,
    open_super_acc: this.open_super_acc,
    profile_image: '',
    signature: '',
    username: value.username,
    password: value.password,
      value: 'admin'
    } 
    this.securityService.AddSecurityGuardDetails(guardData).subscribe((response) => {
      console.log(response);        
      this.spinnerService.hide(); 

        if(response.status == 2){
            this.toastr.error('Another user having same license number!');
          }else if(response.status == 3){
            this.toastr.error('Another user having same license id!');
          }else if(response.status == 4){
            this.toastr.error('Another user having same email!');
          }else{
            this.toastr.success('Worker has been added successfully!');
            this.getSecurityGuardsList();
            // this.router.navigateByUrl('/requested-guards');
            this.modalRef.close();
          } 
      // this.getSecurityGuardsList();         
      // this.toastr.success('Worker has been added successfully!');
      // this.router.navigateByUrl('/requested-guards');
      // this.modalRef.close();
    });    
  }
};


  onchange(rapidId){
    console.log('sdfdsfds',rapidId);
    var patt = /^[a-zA-Z0-9]*$/;
    var res = patt.test(rapidId);
    console.log(res)
    if(rapidId == ''){
      this.error = true;
      this.errorReg = false;
      // return false;
    }/*else if(res == false){
      this.errorReg = true;
      this.error = false;
      // return false;
    }else{
      this.errorReg = false;
      this.error = false;
    };*/
  };

  AssignId(row,assignid){
    console.log(row);
    this.error = false;
    this.errorReg = false;
    this.guard = row;
    this.rapidId = '';
    this.modalRef = this.modalService.open(assignid);
    this.modalRef.result.then((result) => {
      //  console.log(result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // console.log(reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  };

  assignId(rapidId, guard){
    // alert(rapidId, guard)
    this.rapidId = rapidId;
    this.error = false;
    this.errorReg = false;
    var patt = new RegExp('^[0-9]+$');
    var res = patt.test(rapidId);
    // this.checkid(rapidId);
    if(rapidId == ''){
      this.error = true;
      this.errorReg = false;
      return false;
    }/*else if(res == false){
      this.error = false;
      this.errorReg = true;
      return false;
    }*/else{
      this.spinnerService.show();
      var data = {
        id: guard._id,
        rapidId: rapidId
      }
      console.log(data);
      this.securityService.AssignRapidId(data).subscribe((response) => {
        console.log(response);  
        this.spinnerService.hide();
        if(response.status == 0){

          this.getSecurityGuardsList();  
          this.toastr.error('Rapid ID is already assigned to another worker!');
        }else{
        this.getSecurityGuardsList();  
        this.toastr.success('Rapid ID assigned to worker successfully!');
        this.modalRef.close();    
      }    
    });
    } 
  };

  clear(){
    this.rapidId = '';
    this.modalRef.close();
  };


 handlerStartAvail(e){
  this.mindate = e.target.value;
  if(Date.parse(this.authForm.value.licence_exp_date) < Date.parse(e.target.value)){
     this.temp = new Date(e.target.value);
     var month = this.temp.getMonth()+1;
     var day = this.temp.getDate();
     if(day <= 9){
       day = '0' + day.toString();
     }
     if(month <= 9){
       month = '0' + month.toString();
     }
     this.temp = this.temp.getFullYear() + '-' + month + '-' + day;
     this.authForm.patchValue({
       licence_exp_date: this.temp
     })
   }
 };



  handlerStartEnd(e){
    this.mindateEnd = e.target.value;
    if(Date.parse(this.authForm.value.licence_exp_date) < Date.parse(e.target.value)){
       this.temp = new Date(e.target.value);
       var month = this.temp.getMonth()+1;
       var day = this.temp.getDate();
       if(day <= 9){
         day = '0' + day.toString();
       }
       if(month <= 9){
         month = '0' + month.toString();
       }
       this.temp = this.temp.getFullYear() + '-' + month + '-' + day;
       this.authForm.patchValue({
         licence_exp_date: this.temp
       })
    }
  };

 
}