import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndexService } from '../index/index.service';
import { MatDialog } from '@angular/material/dialog';

@Component( {
  selector: 'app-age-interval',
  templateUrl: './age-interval.component.html',
  styleUrls: [ './age-interval.component.styl' ]
} )
export class AgeIntervalComponent implements OnInit {
  public formAgeInterval: FormGroup;

  constructor(
    private fb: FormBuilder,
    private indexService: IndexService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formAgeInterval = this.fb.group( {
      ageTo: '',
      ageFrom: '',
      title: ''
    } );
  }


}
