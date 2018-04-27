import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RoombookingSharedModule } from '../../shared';
import {
    RoomCategoryService,
    RoomCategoryPopupService,
    RoomCategoryComponent,
    RoomCategoryDetailComponent,
    RoomCategoryDialogComponent,
    RoomCategoryPopupComponent,
    RoomCategoryDeletePopupComponent,
    RoomCategoryDeleteDialogComponent,
    roomCategoryRoute,
    roomCategoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...roomCategoryRoute,
    ...roomCategoryPopupRoute,
];

@NgModule({
    imports: [
        RoombookingSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        RoomCategoryComponent,
        RoomCategoryDetailComponent,
        RoomCategoryDialogComponent,
        RoomCategoryDeleteDialogComponent,
        RoomCategoryPopupComponent,
        RoomCategoryDeletePopupComponent,
    ],
    entryComponents: [
        RoomCategoryComponent,
        RoomCategoryDialogComponent,
        RoomCategoryPopupComponent,
        RoomCategoryDeleteDialogComponent,
        RoomCategoryDeletePopupComponent,
    ],
    providers: [
        RoomCategoryService,
        RoomCategoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoombookingRoomCategoryModule {}
