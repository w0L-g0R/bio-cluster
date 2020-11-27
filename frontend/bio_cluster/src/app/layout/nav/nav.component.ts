import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {

  navItems = [
    {
      label: 'Info',
      icon: 'help',
      isDisabled: false,
      routerLink: "/info"
    },
    {
      label: 'Cluster',
      icon: 'bubble_chart',
      isDisabled: false,
      routerLink: "/cluster"
    },
    {
      label: 'Contact',
      icon: 'contact_page',
      isDisabled: false,
      routerLink: "/contact"
    },
    {
      label: 'Datatable',
      icon: 'table_chart',
      isDisabled: false,
      routerLink: "/cluster/datatable"
    },

  ];


  constructor() { }

  ngOnInit(): void {
  }

}
