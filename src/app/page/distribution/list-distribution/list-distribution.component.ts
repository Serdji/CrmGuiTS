import { Component, OnDestroy, OnInit } from '@angular/core';
import { Idistribution } from '../../../interface/idistribution';
import { takeWhile } from 'rxjs/operators';
import { ListDistributionService } from './list-distribution.service';
import { timer } from 'rxjs';

@Component( {
  selector: 'app-list-distribution',
  templateUrl: './list-distribution.component.html',
  styleUrls: [ './list-distribution.component.styl' ]
} )
export class ListDistributionComponent implements OnInit, OnDestroy {

  public distribution: Idistribution[];
  public isLoader: boolean;

  private isActive: boolean;

  constructor( private listDistributionService: ListDistributionService) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
    this.initDistribution();
    this.listDistributionService.subjectDistributionDelete
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
    this.listDistributionService.getDistribution()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( distribution: Idistribution[]) => {
        this.distribution = distribution;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
