import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component( {
  selector: 'app-distribution-topic',
  templateUrl: './distribution-topic.component.html',
  styleUrls: [ './distribution-topic.component.styl' ]
} )
export class DistributionTopicComponent implements OnInit {

  public formDistSubject: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initFormDistSubject();
  }

  private initFormDistSubject() {
    this.formDistSubject = this.fb.group( {
      'distSubjectName': [ '', Validators.required ],
      'distSubjectDescription': ''
    } );
  }

}
