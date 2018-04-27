import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Pricing } from './pricing.model';
import { PricingPopupService } from './pricing-popup.service';
import { PricingService } from './pricing.service';

@Component({
    selector: 'jhi-pricing-delete-dialog',
    templateUrl: './pricing-delete-dialog.component.html'
})
export class PricingDeleteDialogComponent {

    pricing: Pricing;

    constructor(
        private pricingService: PricingService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pricingService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'pricingListModification',
                content: 'Deleted an pricing'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-pricing-delete-popup',
    template: ''
})
export class PricingDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pricingPopupService: PricingPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.pricingPopupService
                .open(PricingDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
