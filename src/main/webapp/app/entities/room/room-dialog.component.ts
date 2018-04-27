import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Room } from './room.model';
import { RoomPopupService } from './room-popup.service';
import { RoomService } from './room.service';
import { RoomCategory, RoomCategoryService } from '../room-category';

@Component({
    selector: 'jhi-room-dialog',
    templateUrl: './room-dialog.component.html'
})
export class RoomDialogComponent implements OnInit {

    room: Room;
    isSaving: boolean;

    roomcategories: RoomCategory[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private roomService: RoomService,
        private roomCategoryService: RoomCategoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.roomCategoryService.query()
            .subscribe((res: HttpResponse<RoomCategory[]>) => { this.roomcategories = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.room.id !== undefined) {
            this.subscribeToSaveResponse(
                this.roomService.update(this.room));
        } else {
            this.subscribeToSaveResponse(
                this.roomService.create(this.room));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Room>>) {
        result.subscribe((res: HttpResponse<Room>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Room) {
        this.eventManager.broadcast({ name: 'roomListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackRoomCategoryById(index: number, item: RoomCategory) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-room-popup',
    template: ''
})
export class RoomPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private roomPopupService: RoomPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.roomPopupService
                    .open(RoomDialogComponent as Component, params['id']);
            } else {
                this.roomPopupService
                    .open(RoomDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
