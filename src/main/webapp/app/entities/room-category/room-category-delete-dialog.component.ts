import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { RoomCategory } from './room-category.model';
import { RoomCategoryPopupService } from './room-category-popup.service';
import { RoomCategoryService } from './room-category.service';

@Component({
    selector: 'jhi-room-category-delete-dialog',
    templateUrl: './room-category-delete-dialog.component.html'
})
export class RoomCategoryDeleteDialogComponent {

    roomCategory: RoomCategory;

    constructor(
        private roomCategoryService: RoomCategoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.roomCategoryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'roomCategoryListModification',
                content: 'Deleted an roomCategory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-room-category-delete-popup',
    template: ''
})
export class RoomCategoryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private roomCategoryPopupService: RoomCategoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.roomCategoryPopupService
                .open(RoomCategoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
