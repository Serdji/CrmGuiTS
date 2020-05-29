import { Component, Input, OnInit } from '@angular/core';
import { ICompanions } from '../../../../interface/icompanions';
import { CompanionsService } from './companions.service';
import { pluck, tap } from 'rxjs/operators';

@Component( {
  selector: 'app-companions',
  templateUrl: './companions.component.html',
  styleUrls: [ './companions.component.styl' ]
} )
export class CompanionsComponent implements OnInit {

  @Input() id: number;

  public isLoader: boolean;
  public companions: ICompanions[];

  constructor(
    private companionsService: CompanionsService
  ) { }

  ngOnInit() {
    this.isLoader = true;
    this.initCompanions();
  }

  private initCompanions() {
    this.companionsService.getCompanions( this.id )
      .pipe(
        pluck( 'result' ),
        tap( _ => this.isLoader = false )
      )
      .subscribe( ( companions: ICompanions[] ) => this.companions = companions );
  }

}
