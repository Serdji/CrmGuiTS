import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
} )
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private localStorage: LocalStorage,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.localStorage.getItem( 'token' ).subscribe(
      value => {
        if ( !value ) this.router.navigate([ '/' ] );
        if ( this.location.path() === '' ) this.router.navigate([ '/admin/users' ] );
      }
    );
  }

}
