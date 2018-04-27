import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoombookingRoomModule } from './room/room.module';
import { RoombookingRoomCategoryModule } from './room-category/room-category.module';
import { RoombookingBookingModule } from './booking/booking.module';
import { RoombookingInvoiceModule } from './invoice/invoice.module';
import { RoombookingPricingModule } from './pricing/pricing.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        RoombookingRoomModule,
        RoombookingRoomCategoryModule,
        RoombookingBookingModule,
        RoombookingInvoiceModule,
        RoombookingPricingModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoombookingEntityModule {}
