import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersSearchComponent } from './users-search.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersSearchService } from './users-search.service';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule
  ],
  declarations: [UsersSearchComponent],
  providers: [UsersSearchService]
})
export class UsersSearchModule { }
