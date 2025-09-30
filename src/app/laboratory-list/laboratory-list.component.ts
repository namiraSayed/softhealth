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
  selector: 'app-laboratory-list',
  imports: [NgxPaginationModule, CommonModule, RouterLink, FormsModule,TranslatePipe],
  templateUrl: './laboratory-list.component.html',
  styleUrl: './laboratory-list.component.css'
})
export class LaboratoryListComponent {

  http = inject(HttpClient);
  spinner = inject(NgxSpinnerService);
  appTitle = inject(AppComponent);

  serverUrl = environment.baseUrl;

  showAdd = true;

  labListData: any = [];
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
      this.getlablist();
    } else {
      this.searchKey = null;
      if (e.target.value.length == 0) {
        this.getlablist();
      }
    }
  }

  handlePageSizeChange(eve: any) {
    this.itemsPerPage = eve.target.value;
    this.currentPage = 0;
    this.getlablist();
  }
  notFound = false;
  getlablist() {
    this.spinner.show();
    this.http
      .get(this.serverUrl + `LaboratoryProcess/GetLaboratoryTestSearchBy/${this.searchKey}/0/${this.currentPage}/${this.itemsPerPage}`)
      .subscribe((data: any) => {
        if (data.laboratoryTestData.laboratoryTestList == null) {
          this.labListData = [];
          this.notFound = true;
        } else {
          this.labListData = data.laboratoryTestData.laboratoryTestList.laboratoryTest;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.p = 1;
        this.totalItems = data.laboratoryTestData.totalCount;
        this.spinner.hide();
      });
  }

  getPage(event: number) {
    this.spinner.show();
    this.p = event;
    this.http
      .get(this.serverUrl + `LaboratoryProcess/GetLaboratoryTestSearchBy/${this.searchKey}/0/${this.p - 1}/${this.itemsPerPage}`)
      .subscribe((data: any) => {
        if (data.laboratoryTestData.laboratoryTestList == null) {
          this.labListData = [];
          this.notFound = true;
        } else {
          this.labListData = data.laboratoryTestData.laboratoryTestList.laboratoryTest;
          this.notFound = false;
        }
        // this.setCP = data.paging;
        this.totalItems = data.laboratoryTestData.totalCount;
        this.spinner.hide();
      });
  }
  modalData: any;
  isModal = false;
  onView(itt: any) {
    console.log(itt, 'dfd');
    this.http.get(this.serverUrl + 'LaboratoryProcess/GetLaboratoryTest/' + itt.laboratoryTestId).subscribe((data: any) => {
      this.modalData = data.laboratoryTest;
      this.isModal = true;
      $('#modal-view').modal('show');
    })
   
  }
  aclArr: any;
  ngOnInit() {
    this.aclArr = this.appTitle.aclAllowed;
    console.log(this.aclArr, 'this.aclArr');
    this.getlablist();
  }

}
