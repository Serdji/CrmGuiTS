import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-profile-sms-distribution',
  templateUrl: './profile-sms-distribution.component.html',
  styleUrls: ['./profile-sms-distribution.component.styl']
})
export class ProfileSmsDistributionComponent implements OnInit, OnDestroy {

  private isActive: boolean;
  private smsProfileId: number;

  constructor(
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initQueryParams();
  }

  private initQueryParams() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.smsProfileId = +params.id;
          console.log( this.smsProfileId );
        }
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
