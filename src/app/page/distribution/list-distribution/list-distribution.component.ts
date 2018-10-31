import { Component, OnDestroy, OnInit } from '@angular/core';
import { Idistribution } from '../../../interface/idistribution';

@Component( {
  selector: 'app-list-distribution',
  templateUrl: './list-distribution.component.html',
  styleUrls: [ './list-distribution.component.styl' ]
} )
export class ListDistributionComponent implements OnInit, OnDestroy {

  public distribution: Idistribution[];
  public isLoader: boolean;

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
