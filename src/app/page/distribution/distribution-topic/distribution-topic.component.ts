import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DistributionTopicService } from './distribution-topic.service';
import { IDistributionTopic } from '../../../interface/idistribution-topic';
import { delay, tap } from 'rxjs/operators';

@Component( {
  selector: 'app-distribution-topic',
  templateUrl: './distribution-topic.component.html',
  styleUrls: [ './distribution-topic.component.styl' ]
} )
export class DistributionTopicComponent implements OnInit {

  public formDistSubject: FormGroup;
  public isLoader: boolean;
  public distSubject: IDistributionTopic[];

  constructor(
    private fb: FormBuilder,
    private distributionTopicService: DistributionTopicService,
  ) { }

  ngOnInit() {
    this.isLoader = true;
    this.initFormDistSubject();
    this.initDistSubject();
  }

  private initDistSubject() {
    this.distributionTopicService.getAllDistributionSubjects()
      .pipe( tap( _ => this.isLoader = false ) )
      .subscribe( ( distSubject: IDistributionTopic[] ) => this.distSubject = distSubject );
  }

  private initFormDistSubject() {
    this.formDistSubject = this.fb.group( {
      'distSubjectName': [ '', Validators.required ],
      'distSubjectDescription': ''
    } );
  }

  public onSaveForm(): void {
    const params = this.formDistSubject.value;
    this.distributionTopicService.addAllDistributionSubjects( params )
      .pipe(
        tap( _ => this.isLoader = true ),
        delay( 500 )
        )
      .subscribe( _ => {
        this.initDistSubject();
      } );
  }

}
