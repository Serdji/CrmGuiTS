import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import { takeWhile } from 'rxjs/operators';
import { Icontact } from '../../../../interface/icontact';

@Component( {
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: [ './contact.component.styl' ]
} )
export class ContactComponent implements OnInit, OnDestroy {

  @Input() id: number;
  private isActive: boolean = true;

  constructor( private contactService: ContactService ) { }

  ngOnInit(): void {
    this.initContact();
  }

  private initContact() {
    this.contactService.getContact( 1 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: Icontact[] ) => {
        console.log( value );
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
