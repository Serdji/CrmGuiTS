import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-button-promo-cod',
  templateUrl: './button-promo-cod.component.html',
  styleUrls: ['./button-promo-cod.component.styl']
})
export class ButtonPromoCodComponent implements OnDestroy, OnInit {

  @Input() ids: any;
  @Input() disabled: boolean;

  private isActive: boolean;



  constructor(
    public dialog: MatDialog,
  ) { }

  openDialog(): void {

  }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false
  }

}
