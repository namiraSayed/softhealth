import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import 'select2';

declare var $: any;


@Component({
  selector: 'app-patientappoint',
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patientappoint.component.html',
  styleUrl: './patientappoint.component.css'
})
export class PatientappointComponent {

  serverUrl = environment.baseUrl;

  http = inject(HttpClient)
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService)

  patientData:any

  getPatientData(id: any) {
    this.spinner.show()
    this.http.get(this.serverUrl + 'BillingProcess/GetPatientForBilling/' + id).subscribe((data1: any) => {
      this.patientData = data1.patient
      this.patientData.payerCategoryList.payerCategory.forEach((lvl1: any) => {
        if (lvl1.patientCoverageList !== null) {
          lvl1.patientCoverageList.patientCoverage.forEach((lvl2: any) => {
            if (this.patientData.encounterForBilling !== null) {
              if (this.patientData.encounterForBilling.patientEncounterList !== null) {
                this.patientData.encounterForBilling.patientEncounterList.patientEncounter.forEach((p1: any) => {
                  console.log(p1, 'p11');

                  if (lvl2.patientCoverageId == p1.patientCoverageId) {
                    console.log(p1, 'p1ed');
                    lvl2.showSubTable = true
                  } else {
                    lvl2.showSubTable = false
                  }
                });
              }

            }
          });
        }
      });
     

      this.payerState = this.patientData?.payerCategoryList?.payerCategory?.map(() => true) || [];
      // Open all inner accordions by default
      this.patientData?.payerCategoryList?.payerCategory?.forEach((payer: any, parentIndex: number) => {
        this.subState[parentIndex] = payer?.patientCoverageList?.patientCoverage?.map(() => true) || [];
      });
      console.log(this.patientData, 'patientData final');
    
      this.spinner.hide()
    })
  }


   insuranceData: any =[]
  getInsurance() {
    this.http.get(this.serverUrl + 'InsuranceProcess/GetInsuranceSearchBy/null/0/1000').subscribe((data:any) => {
      this.insuranceData = data.insuranceData.insuranceList.insurance
    })
  }
  insCoverageData: any =[]
  getCoverage() {
    this.http.get(this.serverUrl + 'InsuranceProcess/GetInsuranceCoverageAll').subscribe((data:any) => {
      this.insCoverageData = data.insuranceCoverageList.insuranceCoverage
    })
  }
  insCoverageClassData: any =[]
  getCoverageClass() {
    this.http.get(this.serverUrl + 'InsuranceProcess/GetInsuranceCoverageClassAll').subscribe((data:any) => {
      this.insCoverageClassData = data.insuranceCoverageClassList.insuranceCoverageClass
    })
  }


  relationData:any = []
  encounterClassData:any = []
  encounterTypeData:any = []
  encounterPriorityData:any = []
  encServiceTypeData:any = []
  encSerEveTypeData:any = []
  emergencyArrivalData:any = []
  emergencyDepDisData:any = []
  triageTypeData:any = []
  emergencyData:any = []
    getDropValues() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/1/1').subscribe((data: any) => {
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'NFD') {

                  // relationData starts
                  var relation = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'subscriber-relationship')
                  if (relation) {
                    this.relationData = relation.dropdownValueList.dropdownValue
                  }
                  // relationData ends

                  // encounterTypeData starts
                  var encounterType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'encounter-type')
                  if (encounterType) {
                    this.encounterTypeData = encounterType.dropdownValueList.dropdownValue
                  }
                  // encounterTypeData ends

                  // encounterClassData starts
                  var encounterClass = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'encounter-class')
                  if (encounterClass) {
                    this.encounterClassData = encounterClass.dropdownValueList.dropdownValue
                  }
                  // encounterClassData ends
                  
                  // encounterPriorityData starts
                  var encounterPrior = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'encounter-priority')
                  if (encounterPrior) {
                    this.encounterPriorityData = encounterPrior.dropdownValueList.dropdownValue
                  }
                  // encounterPriorityData ends

                   // encServiceTypeData starts
                  var ecountServiceType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'encounter-servicetype')
                  if (ecountServiceType) {
                    this.encServiceTypeData = ecountServiceType.dropdownValueList.dropdownValue
                  }
                  // encServiceTypeData ends

                  // encSerEveTypeData starts
                  var ecountServiceEveType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'service-event-type')
                  if (ecountServiceEveType) {
                    this.encSerEveTypeData = ecountServiceEveType.dropdownValueList.dropdownValue
                  }
                  // encSerEveTypeData ends

                  // emergencyArrivalData starts
                  var emergencyArrival = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'emergency-arrival-code')
                  if (emergencyArrival) {
                    this.emergencyArrivalData = emergencyArrival.dropdownValueList.dropdownValue
                  }
                  // emergencyArrivalData ends

                  // emergencyDepDisData starts
                  var emerDepDispo = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'emergency-department-disposition')
                  if (emerDepDispo) {
                    this.emergencyDepDisData = emerDepDispo.dropdownValueList.dropdownValue
                  }
                  // emergencyDepDisData ends

                  // triageTypeData starts
                  var triageType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'triage-category')
                  if (triageType) {
                    this.triageTypeData = triageType.dropdownValueList.dropdownValue
                  }
                  // triageTypeData ends

                }
              }
            });
          }

        });
      }
    })
  }

  addNewCoverage(cover:any) {
    console.log(cover, 'cover');
    // this.getDropValues()
    this.getCoverage()
    this.getInsurance()
    this.getCoverageClass()
    this.coverForm.patchValue({
      patientId: this.patientId,
      branchId: this.userloginData.branchId
    })
    $('#newCoverModal').modal('show')
  }

  coverSubmit:any = false
  coverForm = this.fb.group({
    patientCoverageId: [null],
    patientId: [null],
    branchId: [null],
    payerCategoryId: [3018],
    insuranceId: [null],
    payerId: [null],
    insuranceCoverageId: [0, Validators.required],
    insuranceCoverageClassId: [0, Validators.required],
    memberId: [null],
    subscriberRelationshipId: [0, Validators.required],
    inForce: [false],
    isVerified: [false],
    isActive: [true],
    operationCode: ['C'],
  })

  saveCoverage() {
     this.coverSubmit = true
    if (this.coverForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    this.spinner.show()
    console.log(this.coverForm.value, 'coverForm');
    this.http.post(this.serverUrl + 'patientProcess/SetPatientCoverage', this.coverForm.value).subscribe((datae:any) => {
      console.log(datae, 'esrds');
      this.spinner.hide()
      $('#newCoverModal').modal('hide')
      this.getPatientData(this.patientId)
      // this.reloadCurrentRoute()
    })
  }

  eligibleFun(eliD:any) {
    console.log(eliD, 'eliD');
    $('#eligibilityModal').modal('show')
  }

  submittedE = false
  eligibleForm = this.fb.group({
    isEligible: [false],
    eligibilityReferenceNo: [null, Validators.required],
    eligibilityResponseId: [null, Validators.required],
    eligibilityIdentifierURL: [null, Validators.required],
    eligibilityAttachment: [null],
  })

  saveEligibilty() {
    console.log(this.eligibleForm.value, 'eligibleFormeligibleForm');
     this.submittedE = true
    if (this.eligibleForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    $('#eligibilityModal').modal('hide')
  }

  doctorsData:any = []
  getDoctors() {
    this.http.get(this.serverUrl + 'practitionerProcess/GetPractitionerAll').subscribe((data:any) => {
      this.doctorsData = data.practitionerList.practitioner
    })
  }
  depSpecialData:any = []
  getDepartmentSpecial() {
    this.http.get(this.serverUrl + 'masterProcess/GetDepartmentSpecialityAll').subscribe((data:any) => {
      this.depSpecialData = data.departmentSpecialityList.departmentSpecialty
      // this.initSelect2()
    })
  }

  clinicalCondtionData:any
  getClinicalCondition() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/123/3/2').subscribe((data: any) => {
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'CAD') {

                  // clinicalCondtionData starts
                  var clinicConditon = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'clinical-condition')
                  if (clinicConditon) {
                    this.clinicalCondtionData = clinicConditon.dropdownValueList.dropdownValue
                  }
                  // clinicalCondtionData ends
                }
              }
            });
          }

        });
      }
    })
  }
  public initSelect2s(): void {
    
    const modalParentId = '#newEncounterModal';
    
    // --- 1. Initialize Department Speciality (Single-Select) ---
    const select1 = $('#n13');
    if (select1.length) {
      (select1 as any).select2({
        dropdownParent: $(modalParentId),
        width: '100%',
        placeholder: 'Select Speciality'
      });
      select1.on('change', (e: any) => {
        // For single-select, e.target.value is the single selected value
        console.log(e.target.value, 'Department Speciality selected', this.depSpecialData, 'dep', this.doctorsData, 'doc');
        this.encounterForm.get('departmentSpecialityId')?.setValue(e.target.value)
      });
    }

    // --- 2. Initialize Practitioner (Single-Select) ---
    const select2 = $('#n14');
    if (select2.length) {
      (select2 as any).select2({
        dropdownParent: $(modalParentId),
        width: '100%',
        placeholder: 'Select Practitioner'
      });
      select2.on('change', (e: any) => {
        // For single-select, e.target.value is the single selected value
        console.log(e.target.value, 'Practitioner selected', this.depSpecialData, 'dep', this.doctorsData, 'doc');
        this.encounterForm.get('practitionerId')?.setValue(e.target.value)
      });
    }

    // --- 3. Initialize Treatment Type (Multi-Select) ---
    const select3 = $('#n15');
    if (select3.length) {
      // The initialization code is the same, Select2 handles the 'multiple' attribute
      (select3 as any).select2({
        dropdownParent: $(modalParentId), // Still crucial for modal fix
        width: '100%',
        placeholder: 'Select Treatment Types'
      });
      
      // *** IMPORTANT: Handling the 'change' event for multi-select ***
      select3.on('change', (e: any) => {
        // For multi-select, you should use .val() to get an ARRAY of selected values
        const selectedValues = (select3 as any).val(); 
        console.log(selectedValues, 'Treatment Types selected (array)');
        this.selectedClinicCondition = selectedValues
        // Update your Angular Form Array or Control here with the 'selectedValues' array
      });
    }
    
    // Global Focus Fix (Recommended to keep)
    $(document).on('focus', '.select2-container--open .select2-search__field', function (e: any) {
        e.stopPropagation();
    });
  }

  initSelect2() {
    const select2 = $('#n13');
    // Ensure the modal element exists before trying to use it as dropdownParent
    if ($('#newEncounterModal').length) {
        (select2 as any).select2({
            dropdownParent: $('#newEncounterModal'),
            width: '100%'
        });
        // ... rest of your code
    }
}
  newEncounData:any
  selectedClinicCondition :any = []
  newTreatment(newData:any, subData:any, payMethod: any) {
    console.log(newData, 'newww', subData, 'subData', payMethod);
    newData.payMethod = payMethod
    newData.subData = subData
    this.newEncounData = newData
    this.getDoctors()
    this.getDepartmentSpecial()
    this.getClinicalCondition()
    this.initSelect2s()
    $('#newEncounterModal').modal('show')
  }

  submitted:any = false
  encounterForm = this.fb.group({
    encounterTypeId:[4781, Validators.required],
    encounterClassId: [32, Validators.required],
    encounterPriorityId: [49, Validators.required],
    encounterServiceTypeId: [38, Validators.required],
    encounterServiceEventTypeId: [360, Validators.required],
    triageTypeId: [null],
    emergencyArrivalCodeId: [null],
    emergencyDepartmentDispositionId: [null],
    emergencyStartDate: [null],
    triageDate: [null],
    practitionerId: [null, Validators.required],
    departmentSpecialityId: [null, Validators.required],
    clinicalConditionId: [null]
  })

  saveEncounter() {
    this.submitted = true
    if (this.encounterForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    console.log(this.encounterForm.value, 'newEncounData', this.newEncounData);
   
    var formD: any = this.encounterForm.value
    var sObj: any = {
      "patientEncounterId": null,
      "branchId": this.userloginData.branchId,
      "branchName": null,
      "branchNameL": null,
      "branchUnitId": this.userloginData.branchUnitId,
      "branchUnit": null,
      "branchUnitL": null,
      "patientId": this.patientData.patientId,
      "emrNo": null,
      "firstName": null,
      "lastName": null,
      "patientCoverageId": null,
      "insuranceId": null,
      "practitionerId": parseInt(formD.practitionerId),
      "practitionerName": null,
      "encounterNumber": null,
      "encounterTypeId": parseInt(formD.encounterTypeId),
      "encounterTypeCode": null,
      "encounterType": null,
      "encounterSubTypeId": null,
      "encounterSubTypeCode": null,
      "encounterSubType": null,
      "encounterClassId": parseInt(formD.encounterClassId),
      "encounterClassCode": null,
      "encounterClass": null,
      "encounterServiceTypeId": parseInt(formD.encounterServiceTypeId),
      "encounterServiceTypeCode": null,
      "encounterServiceType": null,
      "encounterPriorityId": parseInt(formD.encounterPriorityId),
      "encounterPriorityCode": null,
      "encounterPriority": null,
      "encounterServiceEventTypeId": parseInt(formD.encounterServiceEventTypeId),
      "encounterServiceEventTypeCode": null,
      "encounterServiceEventType": null,
      "peEmergency": {
        "emergencyDepartmentDispositionId": parseInt(formD.emergencyDepartmentDispositionId),
        "emergencyArrivalCodeId": parseInt(formD.emergencyArrivalCodeId),
        "emergencyStartDate": formD.emergencyStartDate,
        "triageDate": formD.triageDate,
        "triageTypeId": parseInt(formD.triageTypeId)
      },
      "triageTypeId": parseInt(formD.triageTypeId),
      "triageTypeCode": null,
      "triageType": null,
      "scheduledDateTime": moment().format('YYYY-MM-DDTHH:mm:ss'),
      "followUpDateTime": moment().format('YYYY-MM-DDTHH:mm:ss'),
      "additionalFollowup": null,
      "isAdverseEvent": null,
      "encounterStatusId": null,
      "encounterStatusCode": null,
      "encounterStatus": null,
      "pendingServices": null,
      "pendingBundleServices": null,
      "followUp": null,
      "encounterClinicalConditionList": null,
      "claimHeader": null,
      "insuranceCoverage": null,
      "isPractitionerChange": null,
      "operationBy": null,
      "operationCode": "CON"
    }
     var clinicConArr:any = []
    if (this.selectedClinicCondition.length !== 0) {
      const inputArray = this.selectedClinicCondition;

      const result = inputArray.map((item:any) => {
        // Regular expression to match any characters (\\d+) between single quotes (').
        const match = item.match(/'(.*?)'/);

        // Check if a match was found and return the captured group (index 1)
        return match ? match[1] : null;
      }).filter((value:any) => value !== null); // Filter out any nulls if an item didn't match

      console.log(result);
      if(result.length >= 0) {
        result.forEach((res:any) => {
          var clinicObj = {
            "patientClinicalConditionId": null,
            "branchId": this.userloginData.branchId,
            "branchCode": null,
            "branchName": null,
            "branchNameL": null,
            "patientId": this.patientData.patientId,
            "clinicalConditionId": parseInt(res),
            "clinicalConditionCode": null,
            "clinicalCondition": null,
            "clinicalConditionO": null,
            "practionerId": formD.practionerId,
            "practionerName": null,
            "onsetDate": "2024-01-01T00:00:00",
            "diagnosisDate": "2024-01-01T00:00:00",
            "abatementDate": null,
            "bodySiteId": null,
            "bodySiteCode": null,
            "bodySite": null,
            "lateralityId": null,
            "lateralityCode": null,
            "laterality": null,
            "severityId": null,
            "severityCode": null,
            "severity": null,
            "severityO": null,
            "notes": "",
            "verificationStatusId": null,
            "pccStatusId": null,
            "pccStatusCode": null,
            "pccStatus": null,
            "pccStatusO": null
          }
          clinicConArr.push(clinicObj)
        });
      }
    }


    if(clinicConArr.length !== 0) {
      sObj.encounterClinicalConditionList = {
        "patientClinicalConditionList": {
          "patientClinicalCondition": clinicConArr
        }
      }
    }
    if (this.newEncounData.payMethod == 'cash') {
      sObj.patientCoverageId = null
    } else {
      sObj.patientCoverageId = this.newEncounData.subData.patientCoverageId
      sObj.insuranceId = this.newEncounData.subData.insuranceId
    }
    var saveObj = {
      "encounterForBilling": {
        "billEncounter": {
          "patientEncounter": sObj,
          "orderPractitionerServiceIds": null,
          "operation": null,
          "operationValue": null,
          "notPerformedReasonId": null
        }
      }
    }
    console.log(saveObj, 'saveObj');

    this.http.post(this.serverUrl + 'BillingProcess/GetServiceBilling', saveObj).subscribe((daya: any) => {
      console.log(daya, 'sdsd');

    })

  }

  isEmergency = false
  selEncounType(e:any) {
    console.log(e.target.value, 'sfd');
    var findT = this.encounterTypeData.find((obj:any) => obj.dropdownValueId == parseInt(e.target.value))
    console.log(findT, 'sdazs');
    
    if(findT.code == 'ERD') {
      this.isEmergency = true
    } else {
      this.isEmergency = false
      this.encounterForm.get('triageTypeId')?.reset();
    }
  }

// For outer accordions
payerState: boolean[] = [];

// For inner accordions
subState: { [parentIndex: number]: boolean[] } = {};

showSubTable: any = false
subTableData:any = []
toggleItem(index: number, data1:any): void {
  this.payerState[index] = !this.payerState[index];
}

toggleSubItem(parentIndex: number, subIndex: number, data2: any): void {
  if (!this.subState[parentIndex]) {
    this.subState[parentIndex] = [];
  }
  this.subState[parentIndex][subIndex] = !this.subState[parentIndex][subIndex];

   
}



  reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}


  ngAfterViewInit() {
    const select2 = $('#n13');

    (select2 as any).select2({
      dropdownParent: $('#newEncounterModal'),
      width: '100%'
    });
    select2.on('change', (e:any) => {
       var selectVal = e.target.value;
        console.log(selectVal, 'departmentspeacial');
      // this.form.get('payer')?.setValue((select2 as any).val(), { emitEvent: true });
    });

     
  }

  patientId:any
  userloginData:any
  ngOnInit() {

     let userD: any = localStorage.getItem('8FB6N6GSUD')
    let user = JSON.parse(userD);
    this.userloginData = user
    console.log(this.userloginData, 'userloginData')

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.patientId = id
      this.getPatientData(id);
      this.getDropValues()
    }
  }

}
