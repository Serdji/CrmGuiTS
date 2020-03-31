import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl']
})
export class IndexComponent implements OnInit {

  private formIndex: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initFormIndex();
  }

  initFormIndex() {
    this.formIndex = this.fb.group( {
      saleDateFrom: '',
      saleDateTo: '',
      pastActiveFrom: '',
      pastActiveTo: '',
      actualActiveFrom: '',
      actualActiveTo: ''
    } );
  }

}
