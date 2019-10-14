import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableAsyncService } from '../../../services/table-async.service';

@Component({
  selector: 'app-list-sms',
  templateUrl: './list-sms.component.html',
  styleUrls: ['./list-sms.component.styl']
})
export class ListSmsComponent implements OnInit, OnDestroy {

  public isLoader: boolean;

  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.isLoader = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
