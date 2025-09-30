import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-submenu',
  imports: [],
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.css'
})
export class SubmenuComponent {

  route = inject(ActivatedRoute)
  constructor(
    private router: Router,
  ) {

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkMenu()
      }
   });

  }

  checkMenu() {
    let menuD:any = localStorage.getItem('YHZEBH8LMD')
    let menu = JSON.parse(menuD);
    this.allMenuData = menu
    console.log(this.allMenuData, 'allMenuData');
    this.currentRoute = this.router.url;
    console.log(this.currentRoute, 'this.currentRoute');
    var tempUrl = this.router.url.replace("/submenu/","");
    var tempUrl = tempUrl.replace("?p=","?");  
    console.log(tempUrl, 'tempUrl');
    
     if (this.allMenuData) {
       this.allMenuData.forEach((m1: any) => {
         if (m1.childrenList !== null) {
           m1.childrenList.children.forEach((m2: any) => {
             if (m2.menuUrl == tempUrl) {
               console.log('found it', m2);
               this.currentMenu = m2
               if (m2.childrenList !== null) {
                 this.submenuList = m2.childrenList.children
               } else {
                 this.submenuList = []
               }
             }
           });
         }
       });
       
     }
  }

  currentRoute:any;
  id:any;
  allMenuData:any
  submenuList:any = [];
  currentMenu:any
   ngOnInit() {
    

   
  
    
  }
}
