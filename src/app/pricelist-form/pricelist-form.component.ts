import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterPipe } from '../core/pipes/filter.pipe';
import moment from 'moment';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
declare var $: any;


@Component({
  selector: 'app-pricelist-form',
  imports: [TranslatePipe, RouterLink, CommonModule, ReactiveFormsModule, FilterPipe, FormsModule, AutocompleteLibModule],
  templateUrl: './pricelist-form.component.html',
  styleUrl: './pricelist-form.component.css'
})
export class PricelistFormComponent {

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  serverUrl = environment.baseUrl
  editMode = false
  submitted = false
  plDraftForm = this.fb.group({
    priceListDraftId: [],
    payerCategoryId: [0],
    priceListName: ['', Validators.required],
    branchId: [1],
    payerId: [1],
    insuranceId: [null],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    isActive: [true], 
    ExcelFile: [],
    operationCode: ['C']
  })

  saveForm() {
    console.log(this.plDraftForm.value, 'ersdfc32');
    if(this.editMode == true) {
      this.plDraftForm.get('operationCode')?.setValue('U');
    }
    this.http.post(this.serverUrl + 'ContractProcess/SetPriceListDraft', this.plDraftForm.value).subscribe((data:any) => {
      console.log(data, 'data');
      this.toastr.success('Data Saved Successfully')
      if(this.plDraftForm.get('operationCode')?.value == 'U') {
        // this.router.navigate(['pricelistDraft', this.listDraftId])
        this.reloadCurrentRoute()
      } else {
        this.router.navigate(['pricelistDraft', data.id])
      }
    })
  }

   priceListDrafts(event:any) {

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file, 'filr', file.type);
      const reader = new FileReader();
      reader.onload = () => {
        this.readP1 = event.target.files[0]
        this.plDraftForm.get('ExcelFile')?.setValue(event.target.files[0]);
      };
      reader.readAsDataURL(event.target.files[0])
    }
    setTimeout(() => 
      this.pImage(), 300)
  }

  pImage1: any;
  pImageUrl: any;
  isexceluploded = false;
  readP1: any;
  pImage() {
    const fd = new FormData();

    fd.append('ExcelFile', this.readP1);
    console.log(fd, 'fddd')
    console.log(this.plDraftForm, 'aggrDrugM');

    this.http.post(this.serverUrl + "ContractProcess/UploadPriceListItemsDraft/" + this.listDraftId, fd).subscribe((result: any) => {
      this.pImage1 = result.data;
      console.log(this.pImage1, 'sdijfuhy');
      this.toastr.info('Excel Uploaded Successfully');
      this.isexceluploded = true;
      this.reloadCurrentRoute()
      this.pImageUrl = this.pImage1.imageURL;

    })
  }


  payerCategoryData: any = []
  getDropValues() {
    this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/103/5/3').subscribe((data:any) => {
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GBL') {

                  // payer Cat starts
                  var payerCategory = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'payer-category')
                  console.log(payerCategory);
                  if (payerCategory) {
                    this.payerCategoryData = payerCategory.dropdownValueList.dropdownValue
                  }
                  // payer Cat ends
                }
              }
            });
          }

        });
        console.log(this.payerCategoryData, ';wsrdzfx');
        
      }
    })
  }


  draftItemData: any = []
  draftValidItemArr: any = []
  draftInValidItemArr:any = []
  draftDuplicateItemArr:any = []
  duplicateSerIdArr: any = []
  duplicateSerArr: any = []
  isExcelUploaded = false
  validterm: any
  invalidterm: any
  duplicateterm: any
  getDraftItemsList(data:any) {
     this.draftItemData = data.priceListItemsDraftData
      if (this.draftItemData.validPriceListItemsDraft !== null && this.draftItemData.duplicatePriceListItemsDraft !== null) {
        this.isExcelUploaded = true
        
        if(this.draftItemData.validPriceListItemsDraft !== null) {
          this.draftValidItemArr = this.draftItemData?.validPriceListItemsDraft?.priceListItemsDraftList?.priceListItemsDraft 
        } else {
          this.draftValidItemArr = []
        }
         if(this.draftItemData.inValidPriceListItemsDraft !== null) {
          this.draftInValidItemArr = this.draftItemData?.inValidPriceListItemsDraft?.priceListItemsDraftList?.priceListItemsDraft 
          // this.getServices()
        } else {
          this.draftInValidItemArr = []
        }
        console.log(this.draftValidItemArr.length, 'wrad');
        console.log(this.draftInValidItemArr.length, 'wrad');
        
        
        var serviceIdArr: any = []
        var serviceArr: any = []
        if (this.draftItemData.duplicatePriceListItemsDraft !== null) {
          this.draftItemData.duplicatePriceListItemsDraft.priceListItemsDraftList.priceListItemsDraft.forEach((element: any) => {
            if (!serviceIdArr.includes(element.serviceId)) {
              this.draftDuplicateItemArr.push(element)
              serviceIdArr.push(element.serviceId)
              serviceArr['SER_' + element.serviceId] = []
            }
            serviceArr['SER_' + element.serviceId].push(element)
          });
        } else {
          this.draftDuplicateItemArr = []
        }

        this.duplicateSerIdArr = serviceIdArr
        this.duplicateSerArr = serviceArr
        console.log(serviceArr, 'serviceArr', serviceIdArr);
        console.log(this.duplicateSerIdArr, 'serviceArr', this.duplicateSerArr);
      } else {
        this.isExcelUploaded = false
      }

      this.spinner.hide()
      console.log(this.draftItemData, 'vALIDTW');
    // this.http.get(this.serverUrl + 'ContractProcess/GetPriceListItemsDraft/' + this.listDraftId).subscribe((data: any) => {
    //   this.draftItemData = data.priceListDraftList
    //   if (this.draftItemData.validPriceListItemsDraft !== null && this.draftItemData.duplicatePriceListItemsDraft !== null) {
    //     this.isExcelUploaded = true
        
    //     if(this.draftItemData.validPriceListItemsDraft !== null) {
    //       this.draftValidItemArr = this.draftItemData?.validPriceListItemsDraft?.priceListItemsDraftList?.priceListItemsDraft 
    //     } else {
    //       this.draftValidItemArr = []
    //     }
    //      if(this.draftItemData.inValidPriceListItemsDraft !== null) {
    //       this.draftInValidItemArr = this.draftItemData?.inValidPriceListItemsDraft?.priceListItemsDraftList?.priceListItemsDraft 
    //     } else {
    //       this.draftInValidItemArr = []
    //     }
    //     console.log(this.draftValidItemArr.length, 'wrad');
    //     console.log(this.draftInValidItemArr.length, 'wrad');
        
        
    //     var serviceIdArr: any = []
    //     var serviceArr: any = []
    //     if (this.draftItemData.duplicatePriceListItemsDraft !== null) {
    //       this.draftItemData.duplicatePriceListItemsDraft.priceListItemsDraftList.priceListItemsDraft.forEach((element: any) => {
    //         if (!serviceIdArr.includes(element.serviceId)) {
    //           this.draftDuplicateItemArr.push(element)
    //           serviceIdArr.push(element.serviceId)
    //           serviceArr['SER_' + element.serviceId] = []
    //         }
    //         serviceArr['SER_' + element.serviceId].push(element)
    //       });
    //     } else {
    //       this.draftDuplicateItemArr = []
    //     }

    //     this.duplicateSerIdArr = serviceIdArr
    //     this.duplicateSerArr = serviceArr
    //     console.log(serviceArr, 'serviceArr', serviceIdArr);
    //     console.log(this.duplicateSerIdArr, 'serviceArr', this.duplicateSerArr);
    //   } else {
    //     this.isExcelUploaded = false
    //   }


    //   console.log(this.draftItemData, 'vALIDTW');
    // })
  }

  
  
  today: number = Date.now();
  keyword = 'serviceKey';
  errorMsg: any = '';
  isLoadingResult:any = false;
  searchedValue: any;
  selectedService: any
  serviceData: any
  getServerResponse(event: any) {

    if(event.length == 0) {
      this.searchCleared()
    } else {
      this.spinner.show();
      this.searchedValue = event;
      this.isLoadingResult = true;
      return this.http.get(this.serverUrl + `ContractProcess/GetBranchServiceSearchBy/${event}/0/0/0/0/50`).subscribe((data: any) => {
        this.spinner.hide();
        if (data.branchServiceData.branchServiceList == null) {
          this.serviceData = [];
          this.errorMsg = data['Error'];
        } else {
          this.serviceData = data.branchServiceData.branchServiceList.branchService;
          this.serviceData.map((drug:any) => drug.serviceKey = `[${drug.serviceCode}]  ${drug.displayName}`);
        }
        this.isLoadingResult = false;
  
      })
    }
   
  }

  searchCleared() {
    this.serviceData = [];
  }

  selectEvent(item:any) {
    // do something with selected item
    console.log(item,'sfzdx');
    this.selectedService = item
    
  }
  
  onFocused(e:any){
    // do something when input is focused
  }

  updateDup(dea:any) {
    this.spinner.show()
    var saveArr: any[] = []
    this.duplicateSerArr['SER_' + dea.serviceId].forEach((dup1:any) => {
      if($('#checkDup_' + dup1.priceListItemsDraftId).prop('checked')) {
        console.log('yess', dup1);
        dup1.isDuplicate = false
        dup1.isValid = true
        dup1.operationCode = 'U'
        saveArr.push(dup1)
      } else {
        console.log('no', dup1);
      }
    });
    if(saveArr.length > 0) {
      console.log(saveArr, 'saveArr');
      var saveObj = {
        "priceListItemsDraft": saveArr
      }
      this.http.post(this.serverUrl + `ContractProcess/SetPriceListItemsDraft/false/${this.listDraftId}`, saveObj).subscribe((data:any) => {
        console.log(data, 'data');
        this.toastr.success('Updated sucessfully')
        // this.reloadCurrentRoute()
        this.draftItemData = []
        this.draftValidItemArr = []
        this.draftInValidItemArr = []
        this.draftDuplicateItemArr = []
        this.duplicateSerIdArr = []
        this.duplicateSerArr = []
        this.getDraftData(this.listDraftId)
        
      })
    }
    
  }

     
reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([currentUrl]);
  });
}

  priceDraftData:any
  getDraftData(id: any) {
    this.http.get(this.serverUrl + 'ContractProcess/GetPriceListDraft/' + id).subscribe((data:any) => {
      this.priceDraftData = data.priceList;
      setTimeout(() => {
        $('#a2').val(moment(this.priceDraftData.startDate).format('YYYY-MM-DD'))
        $('#a3').val(moment(this.priceDraftData.endDate).format('YYYY-MM-DD'))
      }, 100)
      this.plDraftForm.patchValue({
        priceListDraftId: this.priceDraftData.priceListDraftId,
        payerCategoryId: this.priceDraftData.payerCategoryId,
        priceListName: this.priceDraftData.priceListName,
        branchId: this.priceDraftData.branchId,
        startDate: this.priceDraftData.startDate,
        endDate: this.priceDraftData.endDate,
        isActive: this.priceDraftData.isActive,
      })

      this.getDraftItemsList(this.priceDraftData)
      

    })
  }

  invalidSerData:any 
  showInvalidSerM = false
  invalidAction(inData:any) {
    console.log(inData, 'inddaatttaa');
    this.showInvalidSerM = true
    this.invalidSerData = inData
    $('#invalidAddSerM').modal('show')
  }

  saveInvalid() {
    console.log(this.selectedService, 'wrsed', this.invalidSerData);
    var objss:any = this.invalidSerData
    objss.serviceId = this.selectedService.serviceId[0]
    objss.isValid = true
    objss.operationCode = 'U'
    var finaOnj = []
    finaOnj.push(objss)
    console.log(objss, 'invalidSerData', finaOnj);
     var saveObj = {
        "priceListItemsDraft": finaOnj
      }
      this.http.post(this.serverUrl + `ContractProcess/SetPriceListItemsDraft/false/${this.listDraftId}`, saveObj).subscribe((data:any) => {
        console.log(data, 'data');
        this.toastr.info('Updated sucessfully')
        // this.reloadCurrentRoute()
        this.draftItemData = []
        this.draftValidItemArr = []
        this.draftInValidItemArr = []
        this.draftDuplicateItemArr = []
        this.duplicateSerIdArr = []
        this.duplicateSerArr = []
        this.getDraftData(this.listDraftId)
        
      })
  }

  approveDraft() {
    this.spinner.show()
    var apprObj = {
      priceListDraftId: this.listDraftId
    }
    this.http.post(this.serverUrl + 'ContractProcess/SetPriceListDraftApprove/' + this.listDraftId, apprObj).subscribe((data:any) => {
      console.log(data, 'datsa');
      this.spinner.hide()
      this.toastr.success('draft approved')
      this.router.navigate(['/priceList-list'])
    })
  }

  
  
  ngAfterViewInit() {
    $('#a1').on('change', (event: any) => {
        var selectVal = parseInt(event.target.value);
        console.log(selectVal, 'collectionContainerId');
        //you can use the selected value
        this.plDraftForm.get('payerCategoryId')?.setValue(selectVal);
      });
  }

  listDraftId:any = 0
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.listDraftId = id
      if(this.listDraftId !== 0) {
        this.spinner.show()
        this.getDraftData(id)
        // this.getDraftItemsList()
      }
      // this.getlabTest(id);
    }
    // $('#b1').select2();
    this.getDropValues();
  }
}
