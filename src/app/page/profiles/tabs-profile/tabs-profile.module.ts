import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from '../../../shared/shared.module';
import { TabsProfileComponent } from './tabs-profile.component';
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
import { TranslateModule } from '@ngx-translate/core';
import { CompanionsModule } from './companions/companions.module';

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
    CompanionsModule,
    TabsProfileRoutes,
    TranslateModule
  ],
  declarations: [ TabsProfileComponent ],
  providers: [ OrderService ]
} )
export class TabsProfileModule {
}
