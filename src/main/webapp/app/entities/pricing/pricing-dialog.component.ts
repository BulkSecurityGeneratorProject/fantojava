import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Pricing } from './pricing.model';
import { PricingPopupService } from './pricing-popup.service';
import { PricingService } from './pricing.service';
import { RoomCategory, RoomCategoryService } from '../room-category';

@Component({
    selector: 'jhi-pricing-dialog',
    templateUrl: './pricing-dialog.component.html'
})
export class PricingDialogComponent implements OnInit {

    pricing: Pricing;
    isSaving: boolean;

    pricings: RoomCategory[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private pricingService: PricingService,
        private roomCategoryService: RoomCategoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.roomCategoryService
            .query({filter: 'pricing-is-null'})
            .subscribe((res: HttpResponse<RoomCategory[]>) => {
                if (!this.pricing.pricing || !this.pricing.pricing.id) {
                    this.pricings = res.body;
                } else {
                    this.roomCategoryService
                        .find(this.pricing.pricing.id)
                        .subscribe((subRes: HttpResponse<RoomCategory>) => {
                            this.pricings = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.pricing.id !== undefined) {
            this.subscribeToSaveResponse(
                this.pricingService.update(this.pricing));
        } else {
            this.subscribeToSaveResponse(
                this.pricingService.create(this.pricing));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Pricing>>) {
        result.subscribe((res: HttpResponse<Pricing>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Pricing) {
        this.eventManager.broadcast({ name: 'pricingListModification', content: 'OK'});
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
    selector: 'jhi-pricing-popup',
    template: ''
})
export class PricingPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pricingPopupService: PricingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.pricingPopupService
                    .open(PricingDialogComponent as Component, params['id']);
            } else {
                this.pricingPopupService
                    .open(PricingDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
