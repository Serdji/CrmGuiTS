import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './login/login.module';
import { ProfileSearchModule } from './profile-search/profile-search.module';

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    ProfileSearchModule,
  ],
  declarations: []
})
export class ComponentsModule { }
