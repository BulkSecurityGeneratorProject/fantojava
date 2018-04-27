import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PricingComponent } from './pricing.component';
import { PricingDetailComponent } from './pricing-detail.component';
import { PricingPopupComponent } from './pricing-dialog.component';
import { PricingDeletePopupComponent } from './pricing-delete-dialog.component';

export const pricingRoute: Routes = [
    {
        path: 'pricing',
        component: PricingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.pricing.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'pricing/:id',
        component: PricingDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.pricing.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pricingPopupRoute: Routes = [
    {
        path: 'pricing-new',
        component: PricingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.pricing.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'pricing/:id/edit',
        component: PricingPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.pricing.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'pricing/:id/delete',
        component: PricingDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.pricing.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
