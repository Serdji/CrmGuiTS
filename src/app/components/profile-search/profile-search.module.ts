import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchComponent } from './profile-search.component';
import { ProfileSearchService } from './profile-search.service';
import { TableAsyncComponent } from '../../shared/table-async/table-async.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

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
  providers: [ ProfileSearchService ]
} )
export class ProfileSearchModule {
}
