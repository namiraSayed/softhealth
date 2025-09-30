import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

declare var $: any;
@Component({
  selector: 'app-insurance-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './insurance-form.component.html',
  styleUrl: './insurance-form.component.css'
})
export class InsuranceFormComponent {

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  serverUrl = environment.baseUrl
  imageUrl = environment.imageUrl
  editMode = false
  submitted = false
  insuranceMaster = this.fb.group({
    insuranceId: [null],
    insuranceName: ['', Validators.required],
    insuranceNameL: [''],
    billingCycleId: [null, Validators.required],
    cchiRegistrationNumber: [''],
    vatNumber: [''],
    commercialRegistrationNumber: [''],
    licenseExpiry: [null],
    paymentTerms: [true],
    paymentTermsDaysId: [null],
    claimSubmissionMethodId: [null],
    creditLimit: [null],
    availableLimit: [null],
    eligibilityCheckMethodId: [null],
    nPhieInsuranceCode: [''],
    insuranceFhirId: [''],
    fhirEndpoint: [''],
    supportedFHIRVersion: [''],
    authenticationMethod: [''],
    logoImage: [''],
    zatcaCompliant: [false],
    sfdaCompliant: [false],
    isActive: [true],
    operationalStatusId: [1],
    operationCode: ['']
  });

  insuranceData: any
  getInsuranceData(id: any) {
    this.http.get(this.serverUrl + 'InsuranceProcess/GetInsurance/' + id).subscribe((data: any) => {
      this.insuranceData = data.insurance
      this.insuranceMaster.patchValue({
        insuranceId: this.insuranceData.insuranceId,
        insuranceName: this.insuranceData.insuranceName,
        insuranceNameL: this.insuranceData.insuranceNameL,
        billingCycleId: this.insuranceData.billingCycleId,
        cchiRegistrationNumber: this.insuranceData.cchiRegistrationNumber,
        vatNumber: this.insuranceData.vatNumber,
        commercialRegistrationNumber: this.insuranceData.commercialRegistrationNumber,
        paymentTerms: this.insuranceData.paymentTerms,
        paymentTermsDaysId: this.insuranceData.paymentTermsDaysId,
        claimSubmissionMethodId: this.insuranceData.claimSubmissionMethodId,
        creditLimit: this.insuranceData.creditLimit,
        availableLimit: this.insuranceData.availableLimit,
        eligibilityCheckMethodId: this.insuranceData.eligibilityCheckMethodId,
        nPhieInsuranceCode: this.insuranceData.nPhieInsuranceCode,
        insuranceFhirId: this.insuranceData.insuranceFhirId,
        fhirEndpoint: this.insuranceData.fhirEndpoint,
        supportedFHIRVersion: this.insuranceData.supportedFHIRVersion,
        authenticationMethod: this.insuranceData.authenticationMethod,
        logoImage: this.insuranceData.logoImage,
        zatcaCompliant: this.insuranceData.zatcaCompliant,
        sfdaCompliant: this.insuranceData.sfdaCompliant,
        isActive: this.insuranceData.isActive
      })
      this.spinner.hide()

    })
  }
  urlImage: any
  processEmpImg(ss: any) {
    console.log(ss, 'ss');

  }

  saveForm() {
    console.log(this.insuranceMaster.value, 'insuranceMaster');
    this.submitted = true
    if (this.insuranceMaster.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    this.spinner.show()

    var saveObj: any = this.insuranceMaster.value
    saveObj.branchId = this.userloginData.branchId
    if (saveObj.paymentTerms == 'false') {
      saveObj.paymentTerms = false
    } else {
      saveObj.paymentTerms = true
    }
    if (this.editMode == true) {
      saveObj.operationCode = 'U'
    } else {
      saveObj.operationCode = 'C'
    }

    console.log(saveObj, 'saveObj');
    this.http.post(this.serverUrl + 'InsuranceProcess/SetInsurance', saveObj).subscribe((data: any) => {
      this.toastr.success('Insurance Created Successfully')
      this.spinner.hide()
      this.router.navigate(['insurance-list'])
    })

  }

  editPayTerm = false
  billingCycleData: any = []
  paymentTermsDayData: any = []
  claimSubMethodData: any = []
  eigibleCheckData: any = []
  getDropValues() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/5/3').subscribe((data: any) => {
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GBL') {

                  // billingCycleData starts
                  var billinCy = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'billing-cycle')
                  if (billinCy) {
                    this.billingCycleData = billinCy.dropdownValueList.dropdownValue
                  }
                  // billingCycleData ends

                  // paymentTermsDayData starts
                  var payTermDay = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'payment-terms-days')
                  if (payTermDay) {
                    this.paymentTermsDayData = payTermDay.dropdownValueList.dropdownValue
                  }
                  // paymentTermsDayData ends

                  // claimSubMethodData starts
                  var claimSubMeth = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'claim-submission-method')
                  if (claimSubMeth) {
                    this.claimSubMethodData = claimSubMeth.dropdownValueList.dropdownValue
                  }
                  // claimSubMethodData ends

                  // eigibleCheckData starts
                  var eigibleCheck = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'eligibility-check-method')
                  if (eigibleCheck) {
                    this.eigibleCheckData = eigibleCheck.dropdownValueList.dropdownValue
                  }
                  // eigibleCheckData ends
                }
              }
            });
          }

        });
      }
    })
  }

  ngAfterViewInit() {
    // $('#a3').on('change', (event: any) => {
    //   var selectVal = parseInt(event.target.value);
    //   this.payerMaster.get('billingCycleId')?.setValue(selectVal)
    // });
  }

  payerRId: any = 0
  userloginData: any
  ngOnInit() {
    let userD: any = localStorage.getItem('8FB6N6GSUD')
    let user = JSON.parse(userD);
    this.userloginData = user
    console.log(this.userloginData, 'userloginData')

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.payerRId = id
      if (this.payerRId !== 0) {
        this.spinner.show()
        this.getInsuranceData(id)
        // this.getDraftItemsList()
      }
    }
    // $('#b1').select2();
    this.getDropValues();
  }

}
