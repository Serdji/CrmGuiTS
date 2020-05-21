import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component( {
  selector: 'app-age-interval',
  templateUrl: './age-interval.component.html',
  styleUrls: [ './age-interval.component.styl' ]
} )
export class AgeIntervalComponent implements OnInit {



  public formAgeInterval: FormGroup;
  public parameters = [
    {
      id: 1,
      ageTo: 12,
      ageFrom: 15,
      title: 'Подростки'
    },
    {
      id: 2,
      ageTo: 16,
      ageFrom: 18,
      title: 'Совершеннолетнии'
    },
    {
      id: 3,
      ageTo: 18,
      ageFrom: 21,
      title: 'Продажа табака и алкоголя'
    },
  ];


  constructor(
    private fb: FormBuilder,
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
