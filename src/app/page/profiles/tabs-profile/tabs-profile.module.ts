import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '../../../shared/shared.module';
import { TabsProfileComponent } from './tabs-profile.component';
import { TabsProfileService } from './tabs-profile.service';
import { ContactModule } from './contact/contact.module';
import { DocumentModule } from './document/document.module';
import { OrderModule } from './order/order.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { OrderService } from './order/order.service';
import { RouterModule } from '@angular/router';
import { MessagesModule } from './messages/messages.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { TabsProfileRoutes } from './tabs-profile.routing';
import { PrivilegesModule } from './privileges/privileges.module';

@NgModule( {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProfileModule,
    ContactModule,
    DocumentModule,
    OrderModule,
    MessagesModule,
    PipesModule,
    RouterModule,
    DirectivesModule,
    PromoCodeModule,
    PrivilegesModule,
    TabsProfileRoutes
  ],
  declarations: [ TabsProfileComponent ],
  providers: [
    TabsProfileService,
    OrderService,
  ]
} )
export class TabsProfileModule {
}
