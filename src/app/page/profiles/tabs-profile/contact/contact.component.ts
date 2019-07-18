import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import { takeWhile } from 'rxjs/operators';
import { Icontact } from '../../../../interface/icontact';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IcontactType } from '../../../../interface/icontact-type';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { timer } from 'rxjs/observable/timer';
import { MatDialog } from '@angular/material/dialog';

@Component( {
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: [ './contact.component.styl' ]
} )
export class ContactComponent implements OnInit, OnDestroy {

  @Input() id: number;
  private isActive: boolean = true;

  public formContact: FormGroup;
  public contactTypes: IcontactType[];
  public contacts: Icontact[];
  public isLoader: boolean = true;
  public showHide: boolean;

  constructor(
    private contactService: ContactService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initContact();
    this.initFormContact();
    this.initContactType();
    this.contactService.subjectDeleteContact
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshTable() );
    this.contactService.subjectPutContact
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshTable() );
  }

  private initContact() {
    this.contactService.getContact( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: Icontact[] ) => {
        this.contacts = value;
        this.isLoader = false;
      } );
  }

  private initContactType() {
    this.contactService.getContactType()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IcontactType[] ) => {
        this.contactTypes = value;
      } );
  }

  private initFormContact() {
    this.formContact = this.fb.group( {
      contactTypeId: '',
      contactText: '',
    } );
  }

  private refreshTable() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initContact();
      } );
  }

  private resetForm() {
    this.formContact.reset();
    for ( const formControlName in this.formContact.value ) {
      this.formContact.get( `${ formControlName }` ).setErrors( null );
    }
  }

  sendForm(): void {
    const params: any = {};
    Object.assign( params, this.formContact.getRawValue(), { customerId: this.id } );
    this.contactService.addContact( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.dialog.open( DialogComponent, {
          data: {
            message: 'Контакт успешно добавлен',
            status: 'ok',
          },
        } );
        timer( 1500 )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( _ => {
            this.dialog.closeAll();
            this.refreshTable();
            this.resetForm();
          } );
      } );
  }

  showHiden(): void {
    this.showHide = !this.showHide;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
