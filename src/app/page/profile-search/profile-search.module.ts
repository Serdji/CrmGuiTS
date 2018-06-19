import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchComponent } from './profile-search.component';
import { ProfileSearchService } from './profile-search.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { TableAsyncComponent } from '../../components/table-async/table-async.component';
import { TableAsyncService } from '../../components/table-async/table-async.service';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    ProfileSearchComponent,
    TableAsyncComponent
  ],
  providers: [
    ProfileSearchService,
    TableAsyncService,
  ]
} )
export class ProfileSearchModule {
}
