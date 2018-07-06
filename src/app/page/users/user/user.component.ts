import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component( {
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.styl' ]
} )
export class UserComponent implements OnInit {

  public title: string;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.params.subscribe( value => this.title = value.id);
  }

}
