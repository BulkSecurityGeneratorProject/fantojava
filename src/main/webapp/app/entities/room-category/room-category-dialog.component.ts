import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { RoomCategory } from './room-category.model';
import { RoomCategoryPopupService } from './room-category-popup.service';
import { RoomCategoryService } from './room-category.service';

@Component({
    selector: 'jhi-room-category-dialog',
    templateUrl: './room-category-dialog.component.html'
})
export class RoomCategoryDialogComponent implements OnInit {

    roomCategory: RoomCategory;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private roomCategoryService: RoomCategoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.roomCategory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.roomCategoryService.update(this.roomCategory));
        } else {
            this.subscribeToSaveResponse(
                this.roomCategoryService.create(this.roomCategory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<RoomCategory>>) {
        result.subscribe((res: HttpResponse<RoomCategory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: RoomCategory) {
        this.eventManager.broadcast({ name: 'roomCategoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-room-category-popup',
    template: ''
})
export class RoomCategoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private roomCategoryPopupService: RoomCategoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.roomCategoryPopupService
                    .open(RoomCategoryDialogComponent as Component, params['id']);
            } else {
                this.roomCategoryPopupService
                    .open(RoomCategoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
