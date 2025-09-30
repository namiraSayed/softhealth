import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../environments/environment.development';
import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-pricelist-list',
  imports: [NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslatePipe ],
  templateUrl: './pricelist-list.component.html',
  styleUrl: './pricelist-list.component.css'
})
export class PricelistListComponent {

  http = inject(HttpClient);
  spinner = inject(NgxSpinnerService);
  appTitle = inject(AppComponent);
  toastr = inject(ToastrService)

  serverUrl = environment.baseUrl;

  showAdd = true;

  priceListData: any = [];
  p = 0;
  term: any;
  currentPage = 0;
  itemsPerPage = 10;
  totalItems: any;
  pageSizes = [10, 25, 50, 75, 100];
  searchKey = null;
  searchPage = 0;
  setCP: any;

  onSearchKey(e: any) {
    if (e.target.value.length > 2) {
      this.searchKey = e.target.value;
      this.currentPage = 1 - 1;
      this.searchPage = 1;
      this.getpricelist();
    } else {
      this.searchKey = null;
      if (e.target.value.length == 0) {
        this.getpricelist();
      }
    }
  }

  payerCategory:any = 0
  onpayerCat(evt:any) {
 if(evt.target.value !== null) {
      this.payerCategory = parseInt(evt.target.value)
      this.getpricelist()
    }
  }

  handlePageSizeChange(eve: any) {
    this.itemsPerPage = eve.target.value;
    this.currentPage = 0;
    this.getpricelist();
  }
  notFound = false;
  getpricelist() {
    this.spinner.show();
    this.http
      .get(this.serverUrl + `ContractProcess/GetPriceListSearchBy/${this.searchKey}/${this.payerCategory}/${this.currentPage}/${this.itemsPerPage}`)
      .subscribe((data: any) => {
        if (data.priceListData.priceListList == null) {
          this.priceListData = [];
          this.notFound = true;
        } else {
          this.priceListData = data.priceListData.priceListList.priceList;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.p = 1;
        this.totalItems = data.priceListData.totalCount;
        this.spinner.hide();
      });
  }

  getPage(event: number) {
    this.spinner.show();
    this.p = event;
    this.http
      .get(this.serverUrl + `PayerProcess/GetPayerSearchBy/${this.searchKey}/${this.p - 1}/${this.itemsPerPage}`)
      .subscribe((data: any) => {
        if (data.priceListData.priceListList == null) {
          this.priceListData = [];
          this.notFound = true;
        } else {
          this.priceListData = data.priceListData.priceListList.priceList;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.totalItems = data.priceListData.totalCount;
        this.spinner.hide();
      });
  }


  pricelistDraftD:any = []
  getpricelistDraft() {
    this.http.get(this.serverUrl + `ContractProcess/GetPriceListDraftSearchBy/${this.searchDraftKey}/${this.payrCat}`).subscribe((dataD:any) => {
      if(dataD.priceListDraftList == null) {
        this.pricelistDraftD = []
      } else {
        this.pricelistDraftD = dataD.priceListDraftList.priceListDraft
      }
    })
  }

  payrCat: any = 0
  changeCatForDraft(evee:any) {
    if(evee.target.value !== null) {
      this.payrCat = parseInt(evee.target.value)
      this.getpricelistDraft()
    }
  }

  searchDraftKey:any = null
  searchDraft(evea:any) {
    if(evea.target.value.length >= 3) {
      this.searchDraftKey = evea.target.value;
    } else {
      this.searchDraftKey = null;
    }
    this.getpricelistDraft()
  }

  payerCategoryData:any
  getpayerCat() {
     this.http.get(this.serverUrl + 'MasterProcess/GetDropdownSearchBy/null/103/5/3').subscribe((data:any) => {
      if (data) {
        data.dropdownEntityTypeList.dropdownEntityType.forEach((l1: any) => {
          if (l1.dropdownEntitySubTypeList !== null) {
            l1.dropdownEntitySubTypeList.dropdownEntitySubType.forEach((l2: any) => {
              if (l2.dropdownEntityList !== null) {
                if (l2.entitySubTypeCode == 'GBL') {

                  // Payer Category starts
                  var payerCategory = l2.dropdownEntityList.dropdownEntity.find((obj: any) => obj.entityCode == 'payer-category')
                  console.log(payerCategory);
                  if (payerCategory) {
                    this.payerCategoryData = payerCategory.dropdownValueList.dropdownValue
                  }
                  // Payer Category ends
                }
              }
            });
          }

        });
      }
    })
  }


  finalDraft(dd:any) {
    console.log(dd, 'finaldraft');
    this.spinner.show()
    var apprObj = {
      priceListDraftId: dd.priceListDraftId
    }
    this.http.post(this.serverUrl + 'ContractProcess/SetPriceListDraftApprove/' + dd.priceListDraftId, apprObj).subscribe((data:any) => {
      console.log(data, 'datsa');
      this.spinner.hide()
      this.toastr.success('draft approved')
      this.getpricelist()
      this.getpricelistDraft()
    })
  }

  aclArr: any;
  ngOnInit() {
    this.aclArr = this.appTitle.aclAllowed;
    console.log(this.aclArr, 'this.aclArr');
    this.getpricelist();
    this.getpricelistDraft();
    this.getpayerCat()
  }
}
