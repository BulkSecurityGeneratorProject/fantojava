import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { RoomComponent } from './room.component';
import { RoomDetailComponent } from './room-detail.component';
import { RoomPopupComponent } from './room-dialog.component';
import { RoomDeletePopupComponent } from './room-delete-dialog.component';

export const roomRoute: Routes = [
    {
        path: 'room',
        component: RoomComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.room.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'room/:id',
        component: RoomDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.room.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const roomPopupRoute: Routes = [
    {
        path: 'room-new',
        component: RoomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.room.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'room/:id/edit',
        component: RoomPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.room.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'room/:id/delete',
        component: RoomDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'roombookingApp.room.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
