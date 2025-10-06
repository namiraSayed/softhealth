import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslatePipe } from '@ngx-translate/core';


declare var $: any;

@Component({
  selector: 'app-labanalyte-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './labanalyte-form.component.html',
  styleUrl: './labanalyte-form.component.css'
})
export class LabanalyteFormComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  serverUrl = environment.baseUrl;
  submitted = false;
  now = new Date();
   analyteForm = this.fb.group({
    laboratoryAnalyteId: [null],
    analyteCode: ['',Validators.required],
    analyteName: ['',Validators.required],
    loincId: [null],
    snomedctId: [null],
    laboratorySpecimenTypeId: [null],
    unitId: [null],
    interpretation: [''],
    resultDataTypeId: [null],
    cliaComplexityId: [null],
    testMethodologyId: [null],
    tatMinutes: [null],
    isActive: [true],
    operationCode: [''],
  });
  event: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;

  referenceData:any =[]
  getanaylte(id: any) {
    this.referenceData = []
    this.spinner.show();
    this.http
      .get(this.serverUrl + 'laboratoryProcess/GetLaboratoryAnalyte/' + id)
      .subscribe((data: any) => {
        const editData = data.laboratoryAnalyte;
        this.event = data.laboratoryAnalyte;
        this.editMode = true;
        console.log(this.event, 'this.event');

        this.analyteForm.patchValue({
          laboratoryAnalyteId: editData.laboratoryAnalyteId,
          analyteCode: editData.analyteCode,
          analyteName: editData.analyteName,
          loincId: editData.loincId,
          snomedctId: editData.snomedctId,
          laboratorySpecimenTypeId: editData.laboratorySpecimenTypeId,
          unitId: editData.unitId,
          interpretation: editData.interpretation,
          resultDataTypeId: editData.resultDataTypeId,
          cliaComplexityId: editData.cliaComplexityId,
          testMethodologyId: editData.testMethodologyId,
          tatMinutes: editData.tatMinutes,
          isActive: editData.isActive
        });

        if(editData.laboratoryAnalyteReferenceList !== null) {
          this.referenceData = editData.laboratoryAnalyteReferenceList.laboratoryAnalyteReference
        }
        this.spinner.hide();
        
        this.initSelect2()
      });
  }
  
  
  editData: any;
  edit: any;

  saveForm() {
   
    console.log(this.analyteForm.value, 'analyteForm');
    this.submitted = true
    if (this.analyteForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
   var saveObj:any = this.analyteForm.value
   if(saveObj.laboratoryAnalyteId == null) {
    saveObj.operationCode = 'C'
   } else {
    saveObj.operationCode = 'U'
   }
   saveObj.laboratorySpecimenTypeId = parseInt(saveObj.laboratorySpecimenTypeId)
   saveObj.resultDataTypeId = parseInt(saveObj.resultDataTypeId)
   saveObj.unitId = parseInt(saveObj.unitId)
   saveObj.cliaComplexityId = parseInt(saveObj.cliaComplexityId)
   saveObj.testMethodologyId = parseInt(saveObj.testMethodologyId)
   this.spinner.show()
   this.http.post(this.serverUrl + 'laboratoryProcess/SetLaboratoryAnalyte ', saveObj).subscribe((data22:any) => {
    console.log(data22,'data');
   this.spinner.hide()
    if(saveObj.operationCode == 'C') {
      console.log('wsrdx');
      
      this.router.navigate(['labanalyte', data22.id])
    } else {
      this.reloadCurrentRoute()
    }
   })
  }

     
reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}

  specimenTypeData: any;
  resultDataTypeData: any;
  unitData: any;
  cliaComplexityData: any;
  testMethodologyData: any;

  getDropValues() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/0/6').subscribe((data: any) => {
        if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GUM') {
                  // specimenTypeData starts
                  var specimenType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'lab-specimenType')
                  if (specimenType) {
                    this.specimenTypeData = specimenType.dropdownValueList.dropdownValue
                  }
                  // specimenTypeData ends

                  // resultDataTypeData starts
                  var resultDataType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'result-datatype')
                  if (resultDataType) {
                    this.resultDataTypeData = resultDataType.dropdownValueList.dropdownValue
                  }
                  // resultDataTypeData ends

                  // cliaComplexityData starts
                  var cliacomplex = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'CLIAComplexity')
                  if (cliacomplex) {
                    this.cliaComplexityData = cliacomplex.dropdownValueList.dropdownValue
                  }
                  // cliaComplexityData ends

                  // testMethodologyData starts
                  var testMethodology = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'test-methodologies')
                  if (testMethodology) {
                    this.testMethodologyData = testMethodology.dropdownValueList.dropdownValue
                  }
                  // testMethodologyData ends
                  
                }
              }
            });
          }
        this.initSelect2()

        });
      }
        this.spinner.hide();
    });
  }

  getUnitData() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/71/0/5').subscribe((data: any) => {
        if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'HUM') {
                  // unitData starts
                  var unit = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'analyte-unit')
                  if (unit) {
                    this.unitData = unit.dropdownValueList.dropdownValue
                  }
                  // unitData ends

                  
                }
              }
            });
          }

        });
      }
        this.spinner.hide();
    });
  }

  genderData:any
  getReferenceDrop() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/1/0/1').subscribe((data: any) => {
        if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'NFD') {
                  // unitData starts
                  var unit = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'gender')
                  if (unit) {
                    this.genderData = unit.dropdownValueList.dropdownValue
                  }
                  // unitData ends

                  
                }
              }
            });
          }

        });
      }
        this.spinner.hide();
    });
  }

  submitted1 = false
  labRefForm = this.fb.group({
    laboratoryAnalyteReferenceId: [null],
    laboratoryAnalyteId: [null],
    LaboratoryStationId: [null],
    genderId: [null],
    ageMin: [null, Validators.required],
    ageMax: [null,  Validators.required],
    ageUnitId: [null],
    normalLow: ['', Validators.required],
    normalHigh: [''],
    criticalLow: [null],
    criticalHigh: [null],
    displayRange: [''],
    isActive: [true],
    operationCode: [],
  })

  editReference(edi:any) {
    console.log(edi, 'edooo');
    $('#b4').val(edi.ageUnitId).trigger('change')
    this.labRefForm.patchValue({
    laboratoryAnalyteReferenceId: edi.laboratoryAnalyteReferenceId,
    laboratoryAnalyteId: edi.laboratoryAnalyteId,
    LaboratoryStationId: edi.LaboratoryStationId,
    genderId: edi.genderId,
    ageMin: edi.ageMin,
    ageMax: edi.ageMax,
    ageUnitId: edi.ageUnitId,
    normalLow: edi.normalLow,
    normalHigh: edi.normalHigh,
    criticalLow: edi.criticalLow,
    criticalHigh: edi.criticalHigh,
    displayRange: edi.displayRange,
    isActive: edi.isActive
  })
  }

  clearform() {
    this.labRefForm.reset()
  }

  saveReferenceForm() {
    console.log(this.labRefForm.value, 'labRefForm');
     this.submitted1 = true
    if (this.labRefForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    var saveObj1:any = this.labRefForm.value
    if(saveObj1.laboratoryAnalyteReferenceId == null) {
      saveObj1.operationCode = 'C'
    } else {
      saveObj1.operationCode = 'U'
    }
    saveObj1.laboratoryAnalyteId = this.analyteId
    saveObj1.genderId = parseInt(saveObj1.genderId)
    saveObj1.ageUnitId = parseInt(saveObj1.ageUnitId)
    this.spinner.show()
    this.http.post(this.serverUrl + 'laboratoryProcess/SetLaboratoryAnalyteReference',saveObj1).subscribe((data:any) => {
      console.log(data, 'datatat');
      this.toastr.success('data updated sucessfully')
      this.spinner.hide()
      this.clearform()
      this.getanaylte(this.analyteId);
    })
  }
  

  

  initSelect2() {
// --- 1. Initialize Department Speciality (Single-Select) ---
    const select1 = $('#b4');
    if (select1.length) {
      (select1 as any).select2({
        width: '100%',
        placeholder: 'Select Speciality'
      });
      select1.on('change', (e: any) => {
        // For single-select, e.target.value is the single selected value
        this.labRefForm.get('ageUnitId')?.setValue(e.target.value)
      });
    }

    const select2 = $('#a3');
    if (select2.length) {
      (select2 as any).select2({
        width: '100%',
        placeholder: 'Select Speciality'
      });
      select2.on('change', (e: any) => {
        // For single-select, e.target.value is the single selected value
        this.analyteForm.get('unitId')?.setValue(e.target.value)
      });
    }
    
    const select3 = $('#a7');
    if (select3.length) {
      (select3 as any).select2({
        width: '100%',
        placeholder: 'Select Speciality'
      });
      select3.on('change', (e: any) => {
        // For single-select, e.target.value is the single selected value
        this.analyteForm.get('testMethodologyId')?.setValue(e.target.value)
      });
    }
  }

  isEdit = false;
  analyteId:any
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.analyteId = parseInt(id)
      this.getanaylte(id);
    }
    this.getDropValues()
    this.getUnitData()
    this.getReferenceDrop()
    
    $('#a66').select2();

    // this.getdepartment();
  }
}
