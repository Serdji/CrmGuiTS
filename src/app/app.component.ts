import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
} )
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    const token = JSON.parse(localStorage.getItem('paramsToken'));
    if ( !token ) this.router.navigate([ '/' ] );
  }

}
