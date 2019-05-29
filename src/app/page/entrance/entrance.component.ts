import { Component, OnInit, ViewChild } from '@angular/core';
import { SidenavService } from '../../shared/layout/sidenav/sidenav.service';
import { IMenu } from '../../interface/imenu';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component( {
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: [ './entrance.component.styl' ]
} )
export class EntranceComponent implements OnInit {

  public cards: IMenu[];

  public pdfSrc: string;
  public pageVariable: number;
  public pageLength: number;
  public buttonPreviousDisabled: boolean;
  public buttonNextDisabled: boolean;

  constructor( private sidenavService: SidenavService ) { }

  ngOnInit() {
    this.cards = this.sidenavService.menu;
    this.sidenavService.closesAccord();

    this.pageVariable = 1;
    this.pdfSrc = 'https://10.1.8.155:8080/reports/test/%D1%82%D0%B5%D1%81%D1%82%20%D1%8F%D0%BC%D0%B0%D0%BB';
    this.buttonPreviousDisabled = true;
    this.buttonNextDisabled = false;
  }


  afterLoadComplete( pdf: PDFDocumentProxy ) {
    this.pageLength = pdf.numPages;
  }

  onIncrementPage( amount: number ): void {
    this.pageVariable += amount;
    this.buttonPreviousDisabled = this.pageVariable <= 1;
    this.buttonNextDisabled = this.pageVariable >=  this.pageLength;
  }

  onDownloadPDF() {
    window.open( this.pdfSrc, '_blank' );
  }

  openLink(): void {
    this.sidenavService.openAccord();
  }

}
