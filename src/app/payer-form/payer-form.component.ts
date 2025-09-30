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
  selector: 'app-payer-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './payer-form.component.html',
  styleUrl: './payer-form.component.css'
})
export class PayerFormComponent {
  
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
  payerMaster = this.fb.group({
    payerId: [null],
    payerName: ['', Validators.required],
    payerNameL: [''],
    billingCycleId: [null, Validators.required],
    billingCycleCode: [null],
    billingCycleO: [null],
    vatNumber: [''],
    commercialRegistrationNumber: [''],
    paymentTerms: [true],
    paymentTermsDaysId: [null],
    paymentTermsDaysCode: [null],
    paymentTermsDays: [null],
    claimSubmissionMethodId: [null],
    claimSubmissionMethodCode: [null],
    claimSubmissionMethod: [null],
    creditLimit: [null],
    availableLimit: [null],
    priorAuthorizationRequired: [false],
    zatcaCompliant: [false],
    logoImage: [''],
    isActive: [true],
    operationCode: ['']
  });

  payerData:any
  getPayerData(id:any) {
    this.http.get(this.serverUrl + 'PayerProcess/GetPayer/' + id).subscribe((data:any) => {
      this.payerData = data.payer
      this.payerMaster.patchValue({
        payerId: this.payerData.payerId,
        payerName: this.payerData.payerName,
        payerNameL: this.payerData.payerNameL,
        billingCycleId: this.payerData.billingCycleId,
        billingCycleCode: this.payerData.billingCycleCode,
        billingCycleO: this.payerData.billingCycleO,
        vatNumber: this.payerData.vatNumber,
        commercialRegistrationNumber: this.payerData.commercialRegistrationNumber,
        paymentTerms: this.payerData.paymentTerms,
        paymentTermsDaysId: this.payerData.paymentTermsDaysId,
        paymentTermsDaysCode: this.payerData.paymentTermsDaysCode,
        paymentTermsDays: this.payerData.paymentTermsDays,
        claimSubmissionMethodId: this.payerData.claimSubmissionMethodId,
        claimSubmissionMethodCode: this.payerData.claimSubmissionMethodCode,
        claimSubmissionMethod: this.payerData.claimSubmissionMethod,
        creditLimit: this.payerData.creditLimit,
        availableLimit: this.payerData.availableLimit,
        priorAuthorizationRequired: this.payerData.priorAuthorizationRequired,
        zatcaCompliant: this.payerData.zatcaCompliant,
        logoImage: this.payerData.logoImage,
        isActive: this.payerData.isActive
      })
      this.spinner.hide()

    })
  }
  urlImage:any
  processEmpImg(ss:any) {
    console.log(ss,'ss');
    
  }

  saveForm() {
    console.log(this.payerMaster.value, 'payerMaster');
    this.submitted = true
    if (this.payerMaster.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    this.spinner.show()

    var saveObj :any = this.payerMaster.value
    saveObj.branchId = this.userloginData.branchId
    if(saveObj.paymentTerms == 'false') {
      saveObj.paymentTerms = false
    } else {
       saveObj.paymentTerms = true
    }
    if(this.editMode == true) {
      saveObj.operationCode = 'U'
    } else {
      saveObj.operationCode = 'C'
    }

    console.log(saveObj, 'saveObj');
    this.http.post(this.serverUrl + 'PayerProcess/SetPayer', saveObj).subscribe((data:any) => {
      this.toastr.success('Payer Created Successfully')
      this.spinner.hide()
      this.router.navigate(['payer-list'])
    })

  }

  editPayTerm = false
  billingCycleData: any = []
  paymentTermsDayData: any = []
  claimSubMethodData: any = []
  getDropValues() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/5/3').subscribe((data:any) => {
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

  payerRId:any = 0
  userloginData:any
  ngOnInit() {
     let userD:any = localStorage.getItem('8FB6N6GSUD')
    let user = JSON.parse(userD);
    this.userloginData = user
    console.log(this.userloginData, 'userloginData')

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.payerRId = id
      if(this.payerRId !== 0) {
        this.spinner.show()
        this.getPayerData(id)
        // this.getDraftItemsList()
      }
    }
    // $('#b1').select2();
    this.getDropValues();
  }

}
