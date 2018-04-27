import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Invoice } from './invoice.model';
import { InvoicePopupService } from './invoice-popup.service';
import { InvoiceService } from './invoice.service';
import { Booking, BookingService } from '../booking';

@Component({
    selector: 'jhi-invoice-dialog',
    templateUrl: './invoice-dialog.component.html'
})
export class InvoiceDialogComponent implements OnInit {

    invoice: Invoice;
    isSaving: boolean;

    bookings: Booking[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private invoiceService: InvoiceService,
        private bookingService: BookingService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.bookingService
            .query({filter: 'invoice-is-null'})
            .subscribe((res: HttpResponse<Booking[]>) => {
                if (!this.invoice.booking || !this.invoice.booking.id) {
                    this.bookings = res.body;
                } else {
                    this.bookingService
                        .find(this.invoice.booking.id)
                        .subscribe((subRes: HttpResponse<Booking>) => {
                            this.bookings = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.invoice.id !== undefined) {
            this.subscribeToSaveResponse(
                this.invoiceService.update(this.invoice));
        } else {
            this.subscribeToSaveResponse(
                this.invoiceService.create(this.invoice));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Invoice>>) {
        result.subscribe((res: HttpResponse<Invoice>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Invoice) {
        this.eventManager.broadcast({ name: 'invoiceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackBookingById(index: number, item: Booking) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-invoice-popup',
    template: ''
})
export class InvoicePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private invoicePopupService: InvoicePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.invoicePopupService
                    .open(InvoiceDialogComponent as Component, params['id']);
            } else {
                this.invoicePopupService
                    .open(InvoiceDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
