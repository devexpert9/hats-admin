import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DataTableModule} from "angular2-datatable";
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriesComponent } from './categories/categories.component';
import { SecurityGuardComponent } from './security-guard/security-guard.component';
import { OpenShiftComponent } from './open-shift/open-shift.component';
import { OngoingComponent } from './ongoing/ongoing.component';
import { UpcomingShiftsComponent } from './upcoming-shifts/upcoming-shifts.component';
import { CompletedShiftsComponent } from './completed-shifts/completed-shifts.component';
import { CancelledShiftsComponent } from './cancelled-shifts/cancelled-shifts.component';
import { ReassignedShiftsComponent } from './reassigned-shifts/reassigned-shifts.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportsComponent } from './reports/reports.component';
import { GuardDetailsComponent } from './guard-details/guard-details.component';
import { OpenShiftDetailsComponent } from './open-shift-details/open-shift-details.component';
import { RemarksComponent } from './remarks/remarks.component';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { ShiftDetailsComponent } from './shift-details/shift-details.component';
import { ReassignShiftDetailsComponent } from './reassign-shift-details/reassign-shift-details.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { CustomRequestOptions } from './services/apilink';
import { LoginService } from './services/loginService';
import { ShiftService } from './services/shiftService';
import { SecurityService } from './services/securityService';
import { NotificationService } from './services/notificationService';
import { LocationService } from './services/locationService';
import { ClientService } from './services/clientService';
import { ManagerService } from './services/managerService';
// import { ReminderService } from './services/ReminderService';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AgmCoreModule } from '@agm/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductsComponent } from './products/products.component';
import { CurrentShiftComponent } from './current-shift/current-shift.component';
import { SocketIoModule, SocketIoConfig } from 'ng6-socket-io';
//import {ServiceWorkerModule} from '@angular/service-worker';
//import { PushNotificationComponent } from 'ng2-notifications/ng2-notifications';

 
const config: SocketIoConfig = { url: 'http://13.59.189.135:3002', options: {} };
import { CoreService } from './services/coreService';
import { RequestedGuardsComponent } from './requested-guards/requested-guards.component';
import {ProgressBarModule} from "angular-progress-bar";
import { MomentModule } from 'angular2-moment';
import { RoasterShiftsComponent } from './roaster-shifts/roaster-shifts.component';
import { PayrollComponent } from './payroll/payroll.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PublicHolidayComponent } from './public-holiday/public-holiday.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UserRoasterComponent } from './user-roaster/user-roaster.component';
import { PayrollSettingComponent } from './payroll-setting/payroll-setting.component';
import { LocationsComponent } from './locations/locations.component';
import { ClientsComponent } from './clients/clients.component';
import { PayrollManagerComponent } from './payroll-manager/payroll-manager.component';
import { ShiftManagerComponent } from './shift-manager/shift-manager.component';
import { ManagersComponent } from './managers/managers.component';
import { RolesPermissionsComponent } from './roles-permissions/roles-permissions.component';
import { UsertrashComponent } from './usertrash/usertrash.component';
import { SentNotificationsComponent } from './sent-notifications/sent-notifications.component';
import { TrackUserComponent } from './track-user/track-user.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [{ path: 'openshift', component: OpenShiftComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'security-guard', component: SecurityGuardComponent },
  { path: 'open-shift', component: OpenShiftComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'assigned-shifts', component: OngoingComponent },
  { path: 'current-shifts', component: CurrentShiftComponent },
  { path: 'upcoming-shifts', component: UpcomingShiftsComponent },
  { path: 'completed-shifts', component: CompletedShiftsComponent },
  { path: 'cancelled-shifts', component: CancelledShiftsComponent },
  { path: 'reassigned-shifts', component: ReassignedShiftsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'guard-details', component: GuardDetailsComponent },
  { path: 'open-shift-details', component: OpenShiftDetailsComponent },
  { path: 'remarks', component: RemarksComponent },
  { path: 'add-shift', component: AddShiftComponent },
  { path: 'shift-details', component: ShiftDetailsComponent },
  { path: 'reassign-shift-details', component: ReassignShiftDetailsComponent },
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'requested-guards', component: RequestedGuardsComponent },
  { path: 'business-report', component: RoasterShiftsComponent },
  { path: 'payroll', component: PayrollComponent },
  { path: 'public-holiday', component: PublicHolidayComponent },
  { path: 'user-roaster', component: UserRoasterComponent },
  { path: 'payroll-setting', component: PayrollSettingComponent },
  { path: 'add-location', component: LocationsComponent },
  { path: 'add-client', component: ClientsComponent },
  { path: 'managers', component: ManagersComponent },
  { path: 'trash', component: UsertrashComponent },
  { path: 'roles&permissions', component: RolesPermissionsComponent },
  { path: 'sentnotifications', component: SentNotificationsComponent },
  { path: 'track-user-activity', component: TrackUserComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'history', component: HistoryComponent }]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    CategoriesComponent,
    SecurityGuardComponent,
    OpenShiftComponent,
    OngoingComponent,
    UpcomingShiftsComponent,
    CompletedShiftsComponent,
    CancelledShiftsComponent,
    ReassignedShiftsComponent,
    SettingsComponent,
    NotificationsComponent,
    ProfileComponent,
    ReportsComponent,
    GuardDetailsComponent,
    OpenShiftDetailsComponent,
    RemarksComponent,
    AddShiftComponent,
    ShiftDetailsComponent,
    ReassignShiftDetailsComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProductsComponent,
    CurrentShiftComponent,
    RequestedGuardsComponent,
    RoasterShiftsComponent,   
    PayrollComponent,
    PublicHolidayComponent,
    UserRoasterComponent,
    PayrollSettingComponent,
    LocationsComponent,
    ClientsComponent,
    PayrollManagerComponent,
    ShiftManagerComponent,
    ManagersComponent,
    RolesPermissionsComponent,
    UsertrashComponent,
    
    SentNotificationsComponent,
    TrackUserComponent,
    ContactUsComponent,
    HistoryComponent
  ],
  imports: [
  NgxMaterialTimepickerModule.forRoot(),
  MomentModule,
  ProgressBarModule,
  PdfViewerModule,
    BrowserModule,
    DataTableModule,
    SocketIoModule.forRoot(config) ,
    // MatDialogModule,
    NgxDatatableModule,
    NgbModule,
     Ng4LoadingSpinnerModule.forRoot() ,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCk_zrE74VOviFJ-kx_tSwbRmrZH-JxAJI'
    }),
    RouterModule.forRoot(routes,{useHash: true}),
    NgMultiSelectDropDownModule.forRoot(),    
    //ServiceWorkerModule.register('../node_modules/@angular/service-worker/ngsw-worker.js', { enabled: true })
  ],
  providers: [ManagerService, ClientService, LocationService,NotificationService,LoginService,ShiftService,SecurityService,/*ReminderService,*/ CoreService,{ provide: RequestOptions, useClass: CustomRequestOptions }],
  bootstrap: [AppComponent] 
})
export class AppModule {
  
}
