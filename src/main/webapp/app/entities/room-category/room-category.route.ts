import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { RoomCategoryComponent } from './room-category.component';
import { RoomCategoryDetailComponent } from './room-category-detail.component';
import { RoomCategoryPopupComponent } from './room-category-dialog.component';
import { RoomCategoryDeletePopupComponent } from './room-category-delete-dialog.component';

export const roomCategoryRoute: Routes = [
    {
        path: 'room-category',
        component: RoomCategoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.roomCategory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'room-category/:id',
        component: RoomCategoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.roomCategory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const roomCategoryPopupRoute: Routes = [
    {
        path: 'room-category-new',
        component: RoomCategoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.roomCategory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'room-category/:id/edit',
        component: RoomCategoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.roomCategory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'room-category/:id/delete',
        component: RoomCategoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.roomCategory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
