import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Pricing } from './pricing.model';
import { PricingService } from './pricing.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-pricing',
    templateUrl: './pricing.component.html'
})
export class PricingComponent implements OnInit, OnDestroy {
pricings: Pricing[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private pricingService: PricingService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.pricingService.query().subscribe(
            (res: HttpResponse<Pricing[]>) => {
                this.pricings = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInPricings();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Pricing) {
        return item.id;
    }
    registerChangeInPricings() {
        this.eventSubscriber = this.eventManager.subscribe('pricingListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
