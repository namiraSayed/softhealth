import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

declare var $: any;

@Component({
  selector: 'app-department',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {
  selectedFile!: ImageSnippet;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  serverUrl = environment.baseUrl;
  submitted = false;
  now = new Date();
  department = this.fb.group({
    departmentId: [null],
    departmentCategoryId: [0],
    code: ['', Validators.required],
    departmentName: ['', Validators.required],
    departmentNameL: ['', Validators.required],
    expenseAccount: [null],
    revenueAccount: [null],
    isActive: [true],
    createdBy: [null],
    createdAt: [null],
    updatedBy: [null],
    updatedAt: [null],
    operationBy: [null],
    operationCode: [''],
  });
  event: any;
  editMode: boolean = false;
  isFormDisabled: boolean = false;

  getdepartments(id: any) {
    this.spinner.show();
    this.http
      .get(this.serverUrl + 'MasterProcess/GetDepartment/' + id)
      .subscribe((data: any) => {
        const editData = data.department;
        this.event = data.department;
        this.editMode = true;
        console.log(this.event, 'this.event');

        this.department.patchValue({
          departmentId: editData.departmentId,
          departmentCategoryId: editData.departmentCategoryId,
          code: editData.code,
          departmentName: editData.departmentName,
          departmentNameL: editData.departmentNameL,
          expenseAccount: editData.expenseAccount,
          revenueAccount: editData.revenueAccount,
          isActive: editData.isActive,
          createdBy: editData.createdBy,
          createdAt: editData.createdOn,
          updatedBy: editData.modifiedBy,
          updatedAt: editData.modifiedOn,
          operationBy: editData.modifiedOn,
          operationCode: editData.modifiedOn,
        });
        this.spinner.hide();
      });
  }
  departmentCategoryData: any;
  getdepartment() {
    this.spinner.show();
    this.http
      .get(this.serverUrl + 'MasterProcess/GetDepartmentTypeAll')
      .subscribe((data: any) => {
        this.departmentCategoryData = data.data.departmentType;
        this.spinner.hide();
      });
  }
  
  editData: any;
  edit: any;

  saveForm() {
    this.submitted = true;
    if (this.department.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    if (this.department.value.departmentId == null) {
      this.department.patchValue({
        operationCode: 'C',
      });
    } else {
      this.department.patchValue({
        operationCode: 'U',
      });
    }
    console.log(this.department.value, 'wrdf');
    this.spinner.show();
    this.http
      .post(
        this.serverUrl + 'MasterProcess/SetDepartment',
        this.department.value
      )
      .subscribe((data: any) => {
        console.log(data);
        this.toastr.success(data.message, 'Saved Successfully');
        this.spinner.hide();
        this.router.navigate(['/department-list']);
      });
  }

  ngAfterViewInit() {
    $('#a13').on('change', (event: any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'departmentCategoryId');
      //you can use the selected value
      this.department.get('departmentCategoryId')?.setValue(selectVal);
    });
  }

  isNew = true;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.getdepartments(id);
    }
    // $('#a13').select2();

    // this.getdepartment();
  }
}