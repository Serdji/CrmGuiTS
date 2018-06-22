import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSearchComponent } from './profile-search.component';
import { ProfileSearchService } from './profile-search.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [ProfileSearchComponent],
  providers: [ ProfileSearchService ]
} )
export class ProfileSearchModule {
}
