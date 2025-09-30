import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../environments/environment.development';


class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

declare var $: any;



@Component({
  selector: 'app-patient-register',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './patient-register.component.html',
  styleUrl: './patient-register.component.css'
})
export class PatientRegisterComponent {

  serverUrl = environment.baseUrl

  selectedCar: number | undefined;

    cars = [
        { id: 1, name: 'Volvo' },
        { id: 2, name: 'Saab' },
        { id: 3, name: 'Opel' },
        { id: 4, name: 'Audi' },
    ];
  selectedFile!: ImageSnippet;
    
    fb =  inject(FormBuilder);
    http = inject(HttpClient);
    toastr = inject(ToastrService);
    spinner = inject(NgxSpinnerService);
    router = inject(Router);
    route = inject(ActivatedRoute);

  patientList:any = []
  showlist = false
  onSearchKey(e:any) {
    console.log(e, 'ere');
    var pKey :any = null
    if(e.target.value.length == 0) {
      pKey = null
    } else {
      pKey = e.target.value 
    }
    this.http.get(this.serverUrl + `PatientProcess/GetPatientSearchBy/${pKey}/0/50`).subscribe((data:any) => {
      if(data.patientData.patientList !== null) {
        this.patientList = data.patientData.patientList.patient;
      } else {
         this.patientList = []
      }
      this.showlist = true
    })
  }

  selectPatient(pt:any) {
    console.log(pt, 'otttpttt');
    this.router.navigate(['patientAppoint', pt.patientId])
  }

  isNewPatient = false
  newPatient() {
    this.isNewPatient = true

    setTimeout(() => {
    $('#nationSelect').select2()
    },100)
    this.getDropValues()
    this.getCountryApi();

  }

 
  
  nationalityData: any =[]
  getCountryApi() {
    this.http.get(this.serverUrl + 'MasterProcess/GetCountryAll').subscribe((data: any) => {
      this.nationalityData = data.countryList.country
      $('#d1').select2()
    })
  }

  genderData: any = []
  documentTypeData: any = []
  martialStatusData: any = []
  religionData: any = []
  occupationData: any = []
  residenceTypeData: any = []
  bloodGroupData: any = []
  getDropValues() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/1/1').subscribe((data:any) => {
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'NFD') {

                  // genderData starts
                  var gender = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'gender')
                  if (gender) {
                    this.genderData = gender.dropdownValueList.dropdownValue
                  }
                  // genderData ends
                  
                  // documentTypeData starts
                  var docType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'document-type')
                  if (docType) {
                    this.documentTypeData = docType.dropdownValueList.dropdownValue
                  }
                  // documentTypeData ends

                  // martialStatusData starts
                  var martialStatus = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'marital-status')
                  if (martialStatus) {
                    this.martialStatusData = martialStatus.dropdownValueList.dropdownValue
                  }
                  // martialStatusData ends

                  // religionData starts
                  var religion = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'religion')
                  if (religion) {
                    this.religionData = religion.dropdownValueList.dropdownValue
                  }
                  // religionData ends

                   // occupationData starts
                  var occupation = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'patient-occupation')
                  if (occupation) {
                    this.occupationData = occupation.dropdownValueList.dropdownValue
                  }
                  // occupationData ends

                  // residenceTypeData starts
                  var resType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'residency-type')
                  if (resType) {
                    this.residenceTypeData = resType.dropdownValueList.dropdownValue
                  }
                  // residenceTypeData ends

                  // bloodGroupData starts
                  var bloodGroup = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'blood-group')
                  if (bloodGroup) {
                    this.bloodGroupData = bloodGroup.dropdownValueList.dropdownValue
                  }
                  // bloodGroupData ends

                 
                }
              }
            });
          }

        });
      }
    })
  }

  cancelReg() {
    this.isNewPatient = false
  }

  editPt(data: any) {
    this.isNewPatient = true;
    this.getDropValues()
    this.getCountryApi();
    setTimeout(() => {
      // $('#nationality').select2()
      $('#d1').val(data.nationalityId).trigger('change');
       $('#txtDob').val(moment(data.birthDate).format('YYYY-MM-DD'))
     
    }, 300)
     this.register.patchValue({
        patientId: data.patientId,
        identifier: data.identifier,
        emrNo: data.emrNo,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        firstNameL: data.firstNameL,
        middleNameL: data.middleNameL,
        lastNameL: data.lastNameL,
        documentTypeId: data.documentTypeId,
        documentValue: data.documentValue,
        contactNumber: data.contactNumber,
        email: data.email,
        genderId: data.genderId,
        birthDate: data.birthDate,
        age: data.age,
        bloodGroupId: data.bloodGroupId,
        maritalStatusId: data.maritalStatusId,
        patientOccupationId: data.patientOccupationId,
        residencyTypeId: data.residencyTypeId,
        nationalityId: data.nationalityId,
        waseelCode: data.waseelCode,
        religionId: data.religionId,
        isMultipleBirth: data.isMultipleBirth,
        multipleBirthCount: data.multipleBirthCount,
        isDeceased: data.isDeceased,
        deceasedDate: data.deceasedDate,
        operationCode: data.operationCode
      })

  }
    submitted = false
    now = new Date();
    register = this.fb.group({
      patientId: [null],
      identifier: [null],
      emrNo: [null],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      firstNameL: [null],
      middleNameL: [null],
      lastNameL: [null],
      documentTypeId:[, Validators.required],
      documentValue:[null, Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: [],
      genderId: [null, Validators.required],
      birthDate: ['', Validators.required],
      age: [null],
      displayAge: [''],
      bloodGroupId: [],
      maritalStatusId: [, Validators.required],
      patientOccupationId: [, Validators.required],
      residencyTypeId: [],
      nationalityId: [0, Validators.required],
      waseelCode: [null],
      religionId: [, Validators.required],
      isMultipleBirth: [false],
      multipleBirthCount: [null],
      isDeceased: [false],
      deceasedDate: [null],
      operationCode: ['']
    });
  
    isEdit = false
    saveForm() {
      this.submitted = true
      if (this.register.invalid) {
        return this.toastr.error('please enter correct data', 'Invalid Data');
      }
      this.spinner.show()
      console.log(this.register.value, 'wrdf');
      var saveOnj = this.register.value
      if(saveOnj.patientId == null){
        saveOnj.operationCode = 'C'
      } else {
         saveOnj.operationCode = 'U'
      }
      this.http.post(this.serverUrl + 'PatientProcess/SetPatient', saveOnj).subscribe((data:any) => {
        console.log(data, 'data22');
        this.toastr.success('Patient Updated Successfully')
        this.spinner.hide()
        this.router.navigate(['patientAppoint', data.id])
      })
    }
  
    
    calcAge() {
      var inputValue = $('#txtDob').val();
      var age: number = (moment().diff(inputValue, 'years', true));
      var age_type = "Year"
  
      if (age < 1) {
        var age: number = (moment().diff(inputValue, 'months', true));
        var age_type = "Month"
  
        if (age < 1) {
          var age: number = (moment().diff(inputValue, 'days', true));
          var age_type = "Day"
        }
      }
      if (Math.trunc(age) > 100) {
        $('#ageNo').val('')
        $('#txtDob').val('')
        return this.toastr.error('Age cannot be more than 100')
      } else {
        $('#ageNo').val(Math.trunc(age))
        setTimeout(() => {
          this.register.patchValue({
            displayAge: `${Math.trunc(age)} ${age_type}`
          })
          // this.ageUnitData.forEach((el:any) => {
          //   if (el.description == age_type) {
          //     $("#ageType").val(el.uomId).trigger('change')
          //   }
          // });
  
  
  
          var ageval = $('#ageType').val()
          console.log(Number($('#ageNo').val()), 'wraesd', age_type);
          
        
        }, 200)
      }
  
    }
  
    ageNo: any
    age_type: any
    ageType:any
    calcDOB() {
      var inputValue = $('#txtDob').val();
  
      this.ageNo = $('#ageNo').val()
      this.age_type = $("#ageType option:selected").text();
  
      if (this.age_type.toLowerCase().search("day") >= 0) {
        this.ageType = "day"
      }
      else if (this.age_type.toLowerCase().search("month") >= 0) {
        this.ageType = "months"
      }
      else {
        this.ageType = "years"
      }
  
      if (this.ageNo) {
        var dob = moment().subtract(this.ageNo, this.ageType);
        var dob1 = moment(dob).format('YYYY-MM-DD')
        $('#txtDob').val(dob1)
        this.register.patchValue({
          birthDate: dob1
        })
        this.calcAge();
      }
      // else {
      //   this.calcAge();
      // }
  
    }
  
    checkDateCal(f:any) {
      var e = f.value
      if (e !== '') {
        let curDate = moment().format('YYYY-MM-DD')
        let dobDate = moment(e).format('YYYY-MM-DD')
        console.log(dobDate, 'dobDate', curDate, 'curDate');
        if (moment(dobDate).isAfter(moment(curDate)) == true) {
          $('#ageNo').val('')
          $('#txtDob').val('')
          return this.toastr.error('Please Enter Date Before Today')
        } else {
          this.calcAge();
        }
      }
    }
  
    checkCal1() {
      this.calcDOB();
    }
    
  
    // readP:any
    // processIdImg(event:any) {
    //   const file: File = event.target.files[0];
    //   if (event.target.files && event.target.files[0]) {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       this.readP = event.target.files[0]
    //       this.register.get('NationalIdImg')?.setValue(event.target.files[0]);
    //     };
    //     reader.readAsDataURL(event.target.files[0]);
    //     if (file) {
    //       const reader1 = new FileReader();
    //       reader1.addEventListener('load', (event: any) => {
    //         this.selectedFile = new ImageSnippet(event.target.result, file);
    //       });
    //       reader1.readAsDataURL(event.target.files[0]);
    //     }
    //   }
    //   setTimeout(() =>
    //     this.nationalIdImageCall(), 300)
    // }
  
    // isImage1: any;
    // urlImage1: any;
    // nationalIdImageCall() {
    //   const fd = new FormData();
    //   fd.append('NationalIdImages', this.readP);
    //   console.log(fd,'ytfydf');
      
    //   this.http.post(this.serverUrl + "patientmaster/NationalIdImage", fd).subscribe((result1: any) => {
    //     this.isImage1 = result1.data;
    //     this.readP = '';
  
    //     this.register.patchValue({
    //       nationalIdImage: this.isImage1.imageURL
    //     })
    //     this.urlImage1 = this.isImage1.imageURL;
    //   })
    // }
  
changeNation(dd:any) {
  console.log('srdzf');
  
}
    
ngAfterViewInit(){
  $('#nationSelect')
      .on('select2:open', function () {
        console.log('wsdax11');
        $('input.select2-search__field')[0].focus()
      })
      .on('change', (event:any) => {
      var selectVal = parseInt(event.target.value);
      console.log(selectVal, 'sl44433capple');
      //you can use the selected value
      this.register.get('nationalityId')?.setValue(selectVal)
  });
  
}


  ngOnInit() {
   
  }
}
