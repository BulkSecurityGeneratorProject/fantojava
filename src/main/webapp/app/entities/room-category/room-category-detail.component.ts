import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { RoomCategory } from './room-category.model';
import { RoomCategoryService } from './room-category.service';

@Component({
    selector: 'jhi-room-category-detail',
    templateUrl: './room-category-detail.component.html'
})
export class RoomCategoryDetailComponent implements OnInit, OnDestroy {

    roomCategory: RoomCategory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private roomCategoryService: RoomCategoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRoomCategories();
    }

    load(id) {
        this.roomCategoryService.find(id)
            .subscribe((roomCategoryResponse: HttpResponse<RoomCategory>) => {
                this.roomCategory = roomCategoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRoomCategories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'roomCategoryListModification',
            (response) => this.load(this.roomCategory.id)
        );
    }
}
