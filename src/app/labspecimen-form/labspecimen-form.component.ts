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
  selector: 'app-labspecimen-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './labspecimen-form.component.html',
  styleUrl: './labspecimen-form.component.css'
})
export class LabspecimenFormComponent {
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
  event: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;

  getanaylte(id: any) {
    this.spinner.show();
    this.http
      .get(this.serverUrl + 'laboratoryProcess/GetLaboratoryContainer/' + id)
      .subscribe((data: any) => {
        const editData = data.laboratoryContainer;
        this.event = data.laboratoryContainer;
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
    this.submitted = true
    if (this.containerForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    console.log(this.containerForm.value, 'analyteForm');
    this.spinner.show()
    var saveObj:any = this.containerForm.value
    if(saveObj.laboratoryContainerId == null) {
      saveObj.operationCode = 'C'
    } else {
      saveObj.operationCode = 'U'
    }
    saveObj.containerTypeId = parseInt(saveObj.containerTypeId)
    saveObj.specimenTypeId = parseInt(saveObj.specimenTypeId)
    this.http.post(this.serverUrl + 'laboratoryProcess/SetLaboratoryContainer', saveObj).subscribe((data:any) => {
      console.log(data.data);
      this.spinner.hide()
      this.reloadCurrentRoute()
    })
   
  }

  reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}


  conatinerTypeData: any;
  specimenTypeData: any;

  getconatinerType() {
    this.spinner.show();
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/0/6').subscribe((data: any) => {
        if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GUM') {
                  // conatinerTypeData starts
                  var containerType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'container-type')
                  if (containerType) {
                    this.conatinerTypeData = containerType.dropdownValueList.dropdownValue
                  }
                  // conatinerTypeData ends

                  // specimenTypeData starts
                  var specimenType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'lab-specimenType')
                  if (specimenType) {
                    this.specimenTypeData = specimenType.dropdownValueList.dropdownValue
                  }
                  // specimenTypeData ends
                  
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
    // 
  }

  isNew = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.getanaylte(id);
    }
    this.getconatinerType()
    // $('#a13').select2();

    // this.getdepartment();
  }
}
