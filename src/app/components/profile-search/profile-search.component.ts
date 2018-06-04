import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icity } from '../../interface/icity';
import { ProfileSearchService } from './profile-search.service';
import { takeWhile, map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.styl']
})
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public formProfileSearch: FormGroup;
  public citys: Icity[];

  private isActive: boolean = true;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
  ) { }

  ngOnInit(): void {
    this.initCity();
    this.initForm();
  }

  private initCity() {
    this.profileSearchService.getCity()
      .pipe(
        takeWhile( _ => this.isActive ),
        map( city => city.slice(0, 10) )
      )
      .subscribe( (value: Icity[]) => this.citys = value );
  }

  private initForm() {
    this.formProfileSearch = this.fb.group({
      lastname: '',
      firstname: '',
      ticketnum: '',
      booknum: '',
      emdnum: '',
      flightnum: '',
      flightdatefrom: '',
      flightdateto: '',
      cityfrom: '',
      cityto: '',
      citydatefrom: '',
      citydateto: '',
    });
  }

  ngOnDestroy() {
    this.isActive = false;
  }

}
