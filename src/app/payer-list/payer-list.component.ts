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

declare var $: any;


@Component({
  selector: 'app-payer-list',
  imports: [NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslatePipe],
  templateUrl: './payer-list.component.html',
  styleUrl: './payer-list.component.css'
})
export class PayerListComponent {

  http = inject(HttpClient);
  spinner = inject(NgxSpinnerService);
  appTitle = inject(AppComponent);

  serverUrl = environment.baseUrl;

  showAdd = true;

  payerListData: any = [];
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
      this.getpayerlist();
    } else {
      this.searchKey = null;
      if (e.target.value.length == 0) {
        this.getpayerlist();
      }
    }
  }

  handlePageSizeChange(eve: any) {
    this.itemsPerPage = eve.target.value;
    this.currentPage = 0;
    this.getpayerlist();
  }
  notFound = false;
  getpayerlist() {
    this.spinner.show();
    this.http
      .get(this.serverUrl + `PayerProcess/GetPayerSearchBy/${this.searchKey}/${this.currentPage}/${this.itemsPerPage}`)
      .subscribe((data: any) => {
        if (data.payerData.payerList == null) {
          this.payerListData = [];
          this.notFound = true;
        } else {
          this.payerListData = data.payerData.payerList.payer;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.p = 1;
        this.totalItems = data.payerData.totalCount;
        this.spinner.hide();
      });
  }

  getPage(event: number) {
    this.spinner.show();
    this.p = event;
    this.http
      .get(this.serverUrl + `PayerProcess/GetPayerSearchBy/${this.searchKey}/${this.p - 1}/${this.itemsPerPage}`)
      .subscribe((data: any) => {
        if (data.payerData.payerList == null) {
          this.payerListData = [];
          this.notFound = true;
        } else {
          this.payerListData = data.payerData.payerList.payer;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.totalItems = data.payerData.totalCount;
        this.spinner.hide();
      });
  }
  modalData: any;
  isModal = false;
  onView(itt: any) {
    console.log(itt, 'dfd');
    this.modalData = itt;
    this.isModal = true;
    $('#modal-view').modal('show');
  }
  aclArr: any;
  ngOnInit() {
    this.aclArr = this.appTitle.aclAllowed;
    console.log(this.aclArr, 'this.aclArr');
    this.getpayerlist();
  }

}
