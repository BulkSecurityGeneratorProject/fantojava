import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RoomCategory } from './room-category.model';
import { RoomCategoryService } from './room-category.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-room-category',
    templateUrl: './room-category.component.html'
})
export class RoomCategoryComponent implements OnInit, OnDestroy {
roomCategories: RoomCategory[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private roomCategoryService: RoomCategoryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.roomCategoryService.query().subscribe(
            (res: HttpResponse<RoomCategory[]>) => {
                this.roomCategories = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInRoomCategories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: RoomCategory) {
        return item.id;
    }
    registerChangeInRoomCategories() {
        this.eventSubscriber = this.eventManager.subscribe('roomCategoryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
