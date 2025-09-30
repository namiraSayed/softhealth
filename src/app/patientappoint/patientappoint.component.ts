import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;


@Component({
  selector: 'app-patientappoint',
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule],
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
    this.http.get(this.serverUrl + 'BillingProcess/GetPatientForBilling/' + id).subscribe((data1:any) => {
      this.patientData = data1.patient
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

  eligibleForm = this.fb.group({
    
  })

  doctorsData:any = []
  getDoctors() {
    this.http.get(this.serverUrl + 'practitionerProcess/GetPractitionerAll').subscribe((data:any) => {
      this.doctorsData = data.practitionerList.practitioner
    })
  }
  newEncounData:any
  newTreatment(newData:any, subData:any, payMethod: any) {
    console.log(newData, 'newww', subData, 'subData', payMethod);
    newData.payMethod = payMethod
    newData.subData = subData
    this.newEncounData = newData
    this.getDoctors()
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
    practitionerId: [null, Validators.required]
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
      "patientId": this.patientId,
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



  activeIndex: any = null;
  subActive: any = {}; // track active subItem per section

  toggleItem(index: number, data1:any) {
    this.activeIndex = this.activeIndex === index ? null : index;
    console.log(data1, 'weadsfx', this.patientData);

   
    
  }
  showSubTable: any = false
  subTableData:any = []
  toggleSubItem(parentIndex: number, subIndex: number, data2:any) {
    this.subActive[parentIndex] = this.subActive[parentIndex] === subIndex ? null : subIndex;
    console.log(data2, 'weadsfx', this.patientData);

        if (this.patientData.encounterForBilling !== null) {
      if (this.patientData.encounterForBilling.patientEncounterList !== null) {
        this.patientData.encounterForBilling.patientEncounterList.patientEncounter.forEach((p1: any) => {
          if(data2.patientCoverageId == p1.patientCoverageId) {
            console.log(p1,'p1ed');
            this.showSubTable = true
            this.subTableData.push(p1)
          }
        });
      }

    }
  }

  reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
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
