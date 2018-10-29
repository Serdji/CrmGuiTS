import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: [ './editor.component.styl']
})
export class EditorComponent implements OnInit {

  nameControl = new FormControl('Angular 5');

  constructor() { }

  ngOnInit() {
    this.nameControl.valueChanges.subscribe(value => console.log(value));
  }

}
