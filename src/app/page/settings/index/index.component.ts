import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndexService } from './index.service';
import { IindexConfig } from '../../../interface/iindex-config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl']
})
export class IndexComponent implements OnInit {

  private formIndex: FormGroup;

  constructor(
    private fb: FormBuilder,
    private indexService: IndexService
  ) { }

  ngOnInit(): void {
    this.initFormIndex();
    this.initGetIndexConfig();
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

  private  initGetIndexConfig() {
    this.indexService.getIndexConfig().subscribe( (config: IindexConfig) => {
      this.formIndex.patchValue( config );
    } );
  }

  public onEditIndexConfig(): void {
    this.indexService.putIndexConfig( this.formIndex.value ).subscribe();
  }

}
