import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';

declare var $: any;


@Component({
  selector: 'app-laboratory-form',
  imports: [TranslatePipe, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './laboratory-form.component.html',
  styleUrl: './laboratory-form.component.css'
})
export class LaboratoryFormComponent {


  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  serverUrl = environment.baseUrl

  isPanelShow = false
  panelchange(e:any) {
    console.log(e, 'ee');
    var vale = this.labTestForm.get('isPanel')?.value;
    if(vale == true) {
      this.isPanelShow = true
    } else {
       this.isPanelShow = false
    }
  }
  editMode = false
  submitted = false
  labTestForm = this.fb.group({
    laboratoryTestId: [null],
    testCode: ['', Validators.required],
    shortDescription: ['', Validators.required],
    fullDescription: [''],
    isPanel: [false],
    isActive: [true],
    operationCode: ['']
  })

  saveForm() {
    console.log(this.labTestForm.value, 'ewsrdfx')
     this.submitted = true
    if (this.labTestForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    this.spinner.show()
    var saveObj = this.labTestForm.value
    if(saveObj.laboratoryTestId == null) {
      saveObj.operationCode = 'C'
    } else {
      saveObj.operationCode = 'U'
    }
    this.http.post(this.serverUrl + 'LaboratoryProcess/SetLaboratoryTest', saveObj).subscribe((data:any) => {
      this.spinner.hide()
      this.toastr.success('Data updated successfully')
        if(saveObj.operationCode == 'C') {
          this.router.navigate(['laboratory', data.id])
        } else {
          this.reloadCurrentRoute()
        }
      // if(this.editMode == false) {
      //   this.editId = data.id
      // }
      // this.getlabTest(this.editId)
    })
   }

   reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}



  isEditSpecimen = false
  editSpecimen(spec:any) {
    console.log(spec, 'dsdefd');
    this.isEditSpecimen = true;
    var subTy:any = {
      value: spec.specimenTypeId
    }
    this.changeSpecimenType(subTy)
    $('#b1').val(spec.collectionContainerId).trigger('change');
    $('#b2').val(spec.submissionContainerId).trigger('change');
    this.labSpecimenForm.patchValue({
      laboratoryTestSpecimenId: spec.laboratoryTestSpecimenId,
      laboratoryTestId: spec.laboratoryTestId,
      collectionContainerId: spec.collectionContainerId,
      submissionContainerId: spec.submissionContainerId,
      specimenTypeId: spec.specimenTypeId,
      specimenTypeCode: spec.specimenTypeCode,
      specimenType: spec.specimenType,
      specimenTypeO: spec.specimenTypeO,
      specimenSubTypeId: spec.specimenSubTypeId,
      specimenSubTypeCode: spec.specimenSubTypeCode,
      specimenSubType: spec.specimenSubType,
      specimenSubTypeO: spec.specimenSubTypeO,
      minVolume: spec.minVolume,
      maxVolume: spec.maxVolume,
      handlingInstructions: spec.handlingInstructions,
      specimenStorageTypeId: spec.specimenStorageTypeId,
      specimenStorageTypeCode: spec.specimenStorageTypeCode,
      specimenStorageType: spec.specimenStorageType,
      specimenStorageTypeO: spec.specimenStorageTypeO,
      storageTime: spec.storageTime,
      isActive: spec.isActive
    })
  }

  specimenModalData:any
  isSpecimenModal = false
  viewSpecimen(speci:any) {
    this.isSpecimenModal = true
    this.specimenModalData = speci
    $('#specimenInfoM').modal('show')
  }

  submitted1 = false
  labSpecimenForm = this.fb.group({
    laboratoryTestSpecimenId: [],
    laboratoryTestId: [],
    collectionContainerId: [null, Validators.required],
    submissionContainerId: [null, Validators.required],
    specimenTypeId: [null, Validators.required],
    specimenTypeCode: [],
    specimenType: [],
    specimenTypeO: [],
    specimenSubTypeId: [null, Validators.required],
    specimenSubTypeCode: [],
    specimenSubType: [],
    specimenSubTypeO: [],
    minVolume: [''],
    maxVolume: [''],
    handlingInstructions: [''],
    specimenStorageTypeId: [null],
    specimenStorageTypeCode: [],
    specimenStorageType: [],
    specimenStorageTypeO: [],
    storageTime: [],
    isActive: [true],
    operationCode: ['']
  })

  specimenSubTypeFinal:any = []
  changeSpecimenType(e:any) {
    console.log('eee', e.value);
    var subTypeF = this.specimenSubTypeData.filter((obj:any) => obj.parentId == parseInt(e.value))
    console.log(subTypeF, 'subTypeF');
    if(subTypeF) {
      this.specimenSubTypeFinal = subTypeF
    }
  }

  saveSpecimenForm() { 
    console.log(this.labSpecimenForm.value, 'srzdxf');
    this.submitted1 = true
    if (this.labSpecimenForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
    var saveObj:any = this.labSpecimenForm.value
    saveObj.collectionContainerId = parseInt(saveObj.collectionContainerId)
    saveObj.submissionContainerId = parseInt(saveObj.submissionContainerId)
    saveObj.specimenTypeId = parseInt(saveObj.specimenTypeId)
    saveObj.specimenSubTypeId = parseInt(saveObj.specimenSubTypeId)
    saveObj.specimenStorageTypeId = parseInt(saveObj.specimenStorageTypeId)
    if(saveObj.laboratoryTestSpecimenId == null){
      saveObj.operationCode = 'C'
    } else {
      saveObj.operationCode = 'U'
    }
    console.log(saveObj, 'saveObj');
    this.spinner.show()
    this.http.post(this.serverUrl + 'laboratoryProcess/SetLaboratoryTestSpecimen', saveObj).subscribe((data:any) => {
      console.log(data, 'data');
      $('#b1').val('null').trigger('change');
      $('#b2').val('null').trigger('change');
      this.labSpecimenForm.reset()
      this.spinner.hide()
      this.getlabTest(this.editId)
    })
    
  }


  editAnalyte(anat:any) {
    console.log(anat, ' anat');
    $('#c1').val(anat.laboratoryAnalyteId).trigger('change');
    this.labAnalyteForm.patchValue({
      laboratoryTestAnalyteId: anat.laboratoryTestAnalyteId,
      laboratoryTestId: anat.laboratoryTestId,
      laboratoryAnalyteId: anat.laboratoryAnalyteId,
      displayOrder: anat.displayOrder,
      isRequired: anat.isRequired,
    })
  }

  analyteModalData:any
  isAnalyteModal = false
  analyteModal(daaa:any) {
    console.log(daaa, 'daaa');
      this.isAnalyteModal = true
      var analy = daaa.laboratoryAnalyteList?.laboratoryAnalyte.find((ob1:any) => ob1.laboratoryAnalyteId == daaa.laboratoryAnalyteId)
      console.log(analy, 'analyanaly');
      
      this.analyteModalData = analy

      $('#analyteInfoM').modal('show')  
  }

  submitted2 = false
  labAnalyteForm = this.fb.group({
     laboratoryTestAnalyteId: [],
     laboratoryTestId: [],
     laboratoryAnalyteId: [null, Validators.required],
     displayOrder: [],
     isRequired: [true],
     operationCode: ['']
  })

  saveAnaltyeForm() {
    console.log(this.labAnalyteForm.value, 'labAnalyteForm')
     this.submitted2 = true
    if (this.labAnalyteForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
     this.submitted2 = false
    var saveAnalObj:any = this.labAnalyteForm.value
    if(saveAnalObj.laboratoryTestAnalyteId == null) {
      saveAnalObj.operationCode = 'C'
    } else {
      saveAnalObj.operationCode = 'U'
    }
    saveAnalObj.laboratoryAnalyteId = parseInt(saveAnalObj.laboratoryAnalyteId)
    console.log(saveAnalObj, 'saveAnalObj');
    this.spinner.show()
    this.http.post(this.serverUrl + 'laboratoryProcess/SetLaboratoryTestAnalyte', saveAnalObj).subscribe((dataa:any) => {
      $('#c1').val('null').trigger('change');
      this.labAnalyteForm.reset()
      this.spinner.hide()
      this.getlabTest(this.editId)
    })
  }


  
  editPanel(panel:any) {
    console.log(panel, ' panel');
    $('#d1').val(panel.laboratoryTestPanelId).trigger('change');
    this.labPanelForm.patchValue({
      laboratoryPanelTestId: panel.laboratoryPanelTestId,
      laboratoryTestPanelId: panel.laboratoryTestPanelId,
      laboratoryTestId: panel.laboratoryTestId,
      sequenceNo: panel.sequenceNo,
      isOptional: panel.isOptional,
    })
  }

  submitted3 = false
  labPanelForm = this.fb.group({
    laboratoryPanelTestId: [null],
    laboratoryTestPanelId: [null],
    laboratoryTestId: [null],
    sequenceNo: [],
    isOptional: [false],
    operationCode: ['']
  })

  savePanelForm() {
    console.log(this.labPanelForm.value,'save panel');
     this.submitted3 = true
    if (this.labPanelForm.invalid) {
      return this.toastr.error('please enter correct data', 'Invalid Data');
    }
     this.submitted3 = false
    var savePanelObj:any = this.labPanelForm.value
    if(savePanelObj.laboratoryPanelTestId == null) {
      savePanelObj.operationCode = 'C'
    } else {
      savePanelObj.operationCode = 'U'
    }
    savePanelObj.laboratoryTestPanelId = parseInt(savePanelObj.laboratoryTestPanelId)
    console.log(savePanelObj, 'savePanelObj');
    this.spinner.show()
    this.http.post(this.serverUrl + 'laboratoryProcess/SetLaboratoryPanelTest', savePanelObj).subscribe((dataa:any) => {
      $('#d1').val('null').trigger('change');
      this.labPanelForm.reset()
      this.spinner.hide()
      this.getlabTest(this.editId)
    })
  }

  clearform() {
     this.labPanelForm.reset()
     this.labAnalyteForm.reset()
     this.labSpecimenForm.reset()
  }

  labData:any
  specimenList: any = []
  analyteList: any = []
  panelList: any = []
  getlabTest(id:any) {
    console.log(id, 'id');
    this.specimenList = []
    this.analyteList = []
    this.panelList = []
    this.http.get(this.serverUrl + 'LaboratoryProcess/GetLaboratoryTest/' + id).subscribe((data:any) => {
      console.log(data, 'data');
      this.labData = data.laboratoryTest
      this.labTestForm.patchValue({
        laboratoryTestId: this.labData.laboratoryTestId,
        testCode: this.labData.testCode,
        shortDescription: this.labData.shortDescription,
        fullDescription: this.labData.fullDescription,
        isPanel: this.labData.isPanel,
        isActive: this.labData.isActive,
      })
        this.labSpecimenForm.get('laboratoryTestId')?.setValue(this.labData.laboratoryTestId);
        this.labAnalyteForm.get('laboratoryTestId')?.setValue(this.labData.laboratoryTestId);
        this.labPanelForm.get('laboratoryTestId')?.setValue(this.labData.laboratoryTestId);
      
      if(this.labData.laboratoryTestSpecimenList !== null) {
        // this.specimenList.push(this.labData.laboratoryTestSpecimenList.laboratoryTestSpecimen)
        this.specimenList = this.labData.laboratoryTestSpecimenList.laboratoryTestSpecimen
      }
      var anlArr:any = []
      if(this.labData.laboratoryTestAnalyteList !== null) {
        // this.analyteList = this.labData.laboratoryTestAnalyteList.laboratoryTestAnalyte
        this.labData.laboratoryTestAnalyteList.laboratoryTestAnalyte.forEach((el22:any) => {
          anlArr.push(el22.laboratoryAnalyteId)
          this.analyteList.push(el22)
        });
      }
      if(this.labData.isPanel == true) {
        this.isPanelShow = true
        if(this.labData.laboratoryPanelTestList !== null) {
          this.labData.laboratoryPanelTestList.laboratoryPanelTest.forEach((el1:any) => {
            this.panelList.push(el1)
            if(el1.laboratoryTestAnalyteList !== null) {
              el1.laboratoryTestAnalyteList.laboratoryTestAnalyte.forEach((el33:any) => {
                if(anlArr.includes(el33.laboratoryAnalyteId) == false) {
                   anlArr.push(el33.laboratoryAnalyteId)
                    this.analyteList.push(el33)
                } else {
                  console.log('is duplicate');
                }
              });
            }
          });
        } 
      }
      console.log(this.analyteList, 'allanalyteList');
      
    })
    
  }
  
  
  specimenTypeData: any = []
  specimenSubTypeData: any = []
  specimenStorageTypeData: any = []
  getDropValues() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/0/0/6').subscribe((data:any) => {
      console.log(data, 'dataty');
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GUM') {

                  // specimen Type starts
                  var specimenType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'lab-specimenType')
                  console.log(specimenType);
                  if (specimenType) {
                    this.specimenTypeData = specimenType.dropdownValueList.dropdownValue
                  }
                  console.log(this.specimenTypeData, 'esrdfersd852');
                  
                  // specimen Type ends

                  // specimen SubType starts
                  var specimensubType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'lab-specimenSubType')
                  console.log(specimensubType);
                  if (specimensubType) {
                    this.specimenSubTypeData = specimensubType.dropdownValueList.dropdownValue
                  }
                  // specimen SubType ends

                  // specimen StorageType starts
                   var specimenStorageType = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'specimen-storage-type')
                  console.log(specimenStorageType);
                  if (specimenStorageType) {
                    this.specimenStorageTypeData = specimenStorageType.dropdownValueList.dropdownValue
                  }
                  // specimen StorageType ends
                }
              }
            });
          }

        });
      }
    })
  }


  containerData:any = []
  getLabContainer() {
    this.http.get(this.serverUrl + 'LaboratoryProcess/GetLaboratoryContainerAll').subscribe((data:any) => {
      if(data.laboratoryContainerlist !== null) {
        this.containerData = data.laboratoryContainerlist.laboratoryContainer;
        setTimeout(()=> {
        $('#b1').select2()
        $('#b2').select2()
        },200)
       
      }
    })
  }

  analyteData:any = []
  getLabAnalyte(){
    this.http.get(this.serverUrl + 'LaboratoryProcess/GetLaboratoryAnalyteAll').subscribe((data:any) => {
      if(data.laboratoryAnalytelist !== null) {
        this.analyteData = data.laboratoryAnalytelist.laboratoryAnalyte;
        setTimeout(() => {
         $('#c1').select2();
        }, 100)
      }
      console.log(this.analyteData, 'this.analyteDatathis.analyteData');
      
    })
  }

  panelTestData:any = []
  getLabPanelTest(){
    this.http.get(this.serverUrl + 'LaboratoryProcess/GetLaboratoryTestAll').subscribe((data:any) => {
      if(data.laboratoryTestlist !== null) {
        this.panelTestData = data.laboratoryTestlist.laboratoryTest;
        setTimeout(() => {
         $('#d1').select2();
        }, 200)
      }
      console.log(this.panelTestData, 'this.panelTestData.panelTestData');
      
    })
  }

  ngAfterViewInit() {
    $('#b1')
      .on('select2:open', function () {
        console.log('wsdax');
        $('input.select2-search__field')[0].focus()
      })
      .on('change', (event: any) => {
        var selectVal = event.target.value;
        // var selectVal = parseInt(event.target.value);
        console.log(selectVal, 'collectionContainerId');
        //you can use the selected value
        this.labSpecimenForm.get('collectionContainerId')?.setValue(selectVal);
      });

    $('#b2')
      .on('select2:open', function () {
        console.log('wsdax');
        $('input.select2-search__field')[0].focus()
      })
      .on('change', (event: any) => {
        var selectVal = event.target.value
        console.log(selectVal, 'submissionContainerId');
        //you can use the selected value
        this.labSpecimenForm.get('submissionContainerId')?.setValue(selectVal);
      });

    $('#c1')
      .on('select2:open', function () {
        console.log('wsdax');
        $('input.select2-search__field')[0].focus()
      })
      .on('change', (event: any) => {
        var selectVal = parseInt(event.target.value);
        console.log(selectVal, 'laboratoryAnalyteId');
        //you can use the selected value
        // this.labAnalyteForm.get('laboratoryAnalyteId')?.setValue(selectVal);
        this.labAnalyteForm.get('laboratoryAnalyteId')?.setValue(event.target.value);
      });

       $('#d1')
      .on('select2:open', function () {
        console.log('wsdax11');
        $('input.select2-search__field')[0].focus()
      })
      .on('change', (event: any) => {
        console.log('wsdax2211');

        var selectVal = event.target.value;
        console.log(selectVal, 'laboratoryPanelTestId');
        //you can use the selected value
        this.labPanelForm.get('laboratoryTestPanelId')?.setValue(selectVal);
      });
  }

  editId:any = 0
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = id
      this.getlabTest(id);
    }
    $('#b1').select2();
    $('#b2').select2();
    $('#c1').select2();
    this.getDropValues();
    this.getLabContainer();
    this.getLabAnalyte();
    this.getLabPanelTest();
  }
}
