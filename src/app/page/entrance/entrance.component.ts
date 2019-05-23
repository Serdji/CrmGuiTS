import { Component, OnInit, ViewChild } from '@angular/core';
import { SidenavService } from '../../shared/layout/sidenav/sidenav.service';
import { IMenu } from '../../interface/imenu';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { MatPaginator } from '@angular/material';
import { IpagPage } from '../../interface/ipag-page';

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


  @ViewChild( MatPaginator ) paginator: MatPaginator;

  constructor( private sidenavService: SidenavService ) { }

  ngOnInit() {
    this.cards = this.sidenavService.menu;
    this.sidenavService.closesAccord();

    this.pageVariable = 1;
    this.initPaginator();
    this.pdfSrc = 'assets/test.pdf';
  }

  private initPaginator() {
    this.paginator.page
      .subscribe( ( value: IpagPage ) => {
        this.pageVariable = ++value.pageIndex;
      } );
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pageLength = pdf.numPages;
  }

  openLink(): void {
    this.sidenavService.openAccord();
  }

}
