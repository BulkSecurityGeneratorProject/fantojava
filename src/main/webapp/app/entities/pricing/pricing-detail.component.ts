import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Pricing } from './pricing.model';
import { PricingService } from './pricing.service';

@Component({
    selector: 'jhi-pricing-detail',
    templateUrl: './pricing-detail.component.html'
})
export class PricingDetailComponent implements OnInit, OnDestroy {

    pricing: Pricing;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private pricingService: PricingService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPricings();
    }

    load(id) {
        this.pricingService.find(id)
            .subscribe((pricingResponse: HttpResponse<Pricing>) => {
                this.pricing = pricingResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPricings() {
        this.eventSubscriber = this.eventManager.subscribe(
            'pricingListModification',
            (response) => this.load(this.pricing.id)
        );
    }
}
