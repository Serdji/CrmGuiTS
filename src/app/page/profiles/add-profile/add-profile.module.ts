import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProfileComponent } from './add-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AddProfileService } from './add-profile.service';
import { DirectivesModule } from '../../../directives/directives.module';
import { AddProfileRoutes } from './add-profile.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    AddProfileRoutes,
    TranslateModule
  ],
  declarations: [ AddProfileComponent ],
  providers: [ AddProfileService ]
} )
export class AddProfileModule {
}
