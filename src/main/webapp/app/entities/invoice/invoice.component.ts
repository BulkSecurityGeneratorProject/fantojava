import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Invoice } from './invoice.model';
import { InvoiceService } from './invoice.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-invoice',
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit, OnDestroy {
invoices: Invoice[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private invoiceService: InvoiceService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.invoiceService.query().subscribe(
            (res: HttpResponse<Invoice[]>) => {
                this.invoices = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInInvoices();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Invoice) {
        return item.id;
    }
    registerChangeInInvoices() {
        this.eventSubscriber = this.eventManager.subscribe('invoiceListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
