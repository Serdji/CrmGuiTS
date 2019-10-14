import { Component, OnDestroy, OnInit } from '@angular/core';
import { IEmail } from '../../../interface/iemail';
import { takeWhile } from 'rxjs/operators';
import { ListEmailService } from './list-email.service';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-list-email',
  templateUrl: './list-email.component.html',
  styleUrls: [ './list-email.component.styl' ]
} )
export class ListEmailComponent implements OnInit, OnDestroy {

  public email: IEmail[];
  public isLoader: boolean;

  private isActive: boolean;

  constructor( private listEmailService: ListEmailService) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initDistribution();
    this.listEmailService.subjectDistributionDelete
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.refreshDistribution() );
  }

  private refreshDistribution() {
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.isLoader = true;
        this.initDistribution();
      } );
  }

  private initDistribution() {
    this.listEmailService.getAllEmail()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( email: IEmail[]) => {
        this.email = email;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
