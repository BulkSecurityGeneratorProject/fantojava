import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Booking } from './booking.model';
import { BookingService } from './booking.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-booking',
    templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit, OnDestroy {
bookings: Booking[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private bookingService: BookingService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.bookingService.query().subscribe(
            (res: HttpResponse<Booking[]>) => {
                this.bookings = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBookings();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Booking) {
        return item.id;
    }
    registerChangeInBookings() {
        this.eventSubscriber = this.eventManager.subscribe('bookingListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
