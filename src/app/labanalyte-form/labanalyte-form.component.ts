import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
  selector: 'app-labanalyte-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
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
  containerForm = this.fb.group({
    laboratoryContainerId: [null],
    containerTypeId: [0,Validators.required],
    specimenTypeId: [0,Validators.required],
    containerCode: ['',Validators.required],
    containerName: ['',Validators.required],
    additive: [null],
    isActive: [true],
    operationCode: [''],
  });
   analyteForm = this.fb.group({
    laboratoryAnalyteId: [null],
    analyteCode: ['',Validators.required],
    analyteName: ['',Validators.required],
    loincId: [null],
    snomedctId: [null],
    laboratorySpecimenTypeId: [null,Validators.required],
    unitId: [null,Validators.required],
    interpretation: ['',Validators.required],
    resultDataTypeId: [null,Validators.required],
    cliaComplexityId: [null,Validators.required],
    testMethodologyId: [null,Validators.required],
    tatMinutes: [null,Validators.required],
    isActive: [true],
    operationCode: [''],
  });
  event: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;

  getanaylte(id: any) {
    this.spinner.show();
    this.http
      .get(this.serverUrl + 'laboratoryProcess/GetLaboratoryAnalyte/' + id)
      .subscribe((data: any) => {
        const editData = data.data;
        this.event = data.data;
        this.editMode = true;
        console.log(this.event, 'this.event');

        this.containerForm.patchValue({
          laboratoryContainerId: editData.laboratoryContainerId,
          containerTypeId: editData.containerTypeId,
          specimenTypeId: editData.specimenTypeId,
          containerCode: editData.containerCode,
          containerName: editData.containerName,
          additive: editData.additive,
          isActive: editData.isActive
        });
        this.spinner.hide();
      });
  }
  
  
  editData: any;
  edit: any;

  saveForm() {
   
    console.log(this.analyteForm.value, 'analyteForm');
   
  }

  specimenTypeData: any;
  resultDataTypeData: any;
  unitData: any;
  cliaComplexityData: any;
  testMethodologyData: any;

  getconatinerType() {
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

        });
      }
        this.spinner.hide();
    });
  }
  

  ngAfterViewInit() {
   $('#a66').on('change', (event: any) => {
      var selectVal = event.target.value;
      console.log(selectVal, 'testMethodologyId');
      //you can use the selected value
      this.analyteForm.get('testMethodologyId')?.setValue(selectVal);
    });
  }

  isNew = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.getanaylte(id);
    }
    this.getconatinerType()
    $('#a66').select2();

    // this.getdepartment();
  }
}
