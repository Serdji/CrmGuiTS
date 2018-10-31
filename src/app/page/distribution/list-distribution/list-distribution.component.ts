import { Component, OnDestroy, OnInit } from '@angular/core';
import { Idistribution } from '../../../interface/idistribution';
import { takeWhile } from 'rxjs/operators';
import { ListDistributionService } from './list-distribution.service';

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
    this.initDistribution();
  }

  private initDistribution() {
    this.listDistributionService.getDistribution()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( distribution => {
        this.distribution = distribution;
        this.isLoader = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
