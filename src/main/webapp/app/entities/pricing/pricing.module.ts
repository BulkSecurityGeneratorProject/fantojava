import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoombookingSharedModule } from '../../shared';
import {
    PricingService,
    PricingPopupService,
    PricingComponent,
    PricingDetailComponent,
    PricingDialogComponent,
    PricingPopupComponent,
    PricingDeletePopupComponent,
    PricingDeleteDialogComponent,
    pricingRoute,
    pricingPopupRoute,
} from './';

const ENTITY_STATES = [
    ...pricingRoute,
    ...pricingPopupRoute,
];

@NgModule({
    imports: [
        RoombookingSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PricingComponent,
        PricingDetailComponent,
        PricingDialogComponent,
        PricingDeleteDialogComponent,
        PricingPopupComponent,
        PricingDeletePopupComponent,
    ],
    entryComponents: [
        PricingComponent,
        PricingDialogComponent,
        PricingPopupComponent,
        PricingDeleteDialogComponent,
        PricingDeletePopupComponent,
    ],
    providers: [
        PricingService,
        PricingPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoombookingPricingModule {}
