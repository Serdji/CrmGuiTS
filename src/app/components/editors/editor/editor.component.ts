import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxWigToolbarService } from 'ngx-wig';

@Component( {
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.styl' ]
} )
export class EditorComponent implements OnInit {

  @Input() ids: number[];

  nameControl = new FormControl( 'Angular 7' );


  constructor( private ngxWigToolbarService: NgxWigToolbarService ) {
  }

  ngOnInit(): void {
    this.nameControl.valueChanges.subscribe( value =>  console.log( value ) );
    console.log( this.ids );
    console.log( this.ngxWigToolbarService.getToolbarButtons() );
  }

}
