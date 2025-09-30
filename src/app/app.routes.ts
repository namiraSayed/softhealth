import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentComponent } from './department/department.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { LaboratoryListComponent } from './laboratory-list/laboratory-list.component';
import { LaboratoryFormComponent } from './laboratory-form/laboratory-form.component';
import { PricelistListComponent } from './pricelist-list/pricelist-list.component';
import { PricelistFormComponent } from './pricelist-form/pricelist-form.component';
import { PayerFormComponent } from './payer-form/payer-form.component';
import { PayerListComponent } from './payer-list/payer-list.component';
import { PricelistfinalComponent } from './pricelistfinal/pricelistfinal.component';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceFormComponent } from './insurance-form/insurance-form.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { PatientappointComponent } from './patientappoint/patientappoint.component';
import { LabanalyteListComponent } from './labanalyte-list/labanalyte-list.component';
import { LabanalyteFormComponent } from './labanalyte-form/labanalyte-form.component';
import { LabspecimenListComponent } from './labspecimen-list/labspecimen-list.component';
import { LabspecimenFormComponent } from './labspecimen-form/labspecimen-form.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: HeaderComponent,
     children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'submenu/:menu', component: SubmenuComponent },
      { path: 'department-list', component: DepartmentListComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'department/:id', component: DepartmentComponent },
      { path: 'laboratory-list', component: LaboratoryListComponent },
      { path: 'laboratory', component: LaboratoryFormComponent },
      { path: 'laboratory/:id', component: LaboratoryFormComponent },
      { path: 'priceList-list', component: PricelistListComponent },
      { path: 'pricelistDraft', component: PricelistFormComponent },
      { path: 'pricelistDraft/:id', component: PricelistFormComponent },
      { path: 'pricelist/:id', component: PricelistfinalComponent },
      { path: 'payer-list', component: PayerListComponent },
      { path: 'payer', component: PayerFormComponent },
      { path: 'payer/:id', component: PayerFormComponent },
      { path: 'insurance-list', component: InsuranceListComponent },
      { path: 'insurance', component: InsuranceFormComponent },
      { path: 'insurance/:id', component: InsuranceFormComponent },
      { path: 'register-patient', component: PatientRegisterComponent },
      { path: 'patientAppoint/:id', component: PatientappointComponent },
      { path: 'labanalyte-list', component: LabanalyteListComponent },
      { path: 'labanalyte', component: LabanalyteFormComponent },
      { path: 'labanalyte/:id', component: LabanalyteFormComponent },
      { path: 'labspecimen-list', component: LabspecimenListComponent },
      { path: 'labspecimen', component: LabspecimenFormComponent },
      { path: 'labspecimen/:id', component: LabspecimenFormComponent },
     ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/home' },
  { path: '#', redirectTo: '/home' },

  // {
  //     path: 'login',
  //     component: LoginComponent
  // },
  //   {
  //     path: '',
  //     redirectTo: '/app/home',
  //     pathMatch: 'full'
  //   },
  //   { path: '**', redirectTo: '/app/home' },
  //   { path: '#', redirectTo: '/app/home' }
];
