import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-sms',
  templateUrl: './editor-sms.component.html',
  styleUrls: ['./editor-sms.component.styl']
})
export class EditorSmsComponent implements OnInit {

  @Input() params: any;
  @Input() totalCount: number;


  constructor() { }

  ngOnInit() {
  }

}
