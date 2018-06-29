import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component( {
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: [ './layout.component.styl' ],
} )

export class LayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    ) { }

  ngOnInit() {
    if ( JSON.parse( localStorage.getItem( 'paramsToken' ) ) ) this.router.navigate( [ 'crm/entrance' ] );
  }

}
