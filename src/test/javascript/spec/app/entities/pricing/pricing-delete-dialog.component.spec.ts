/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { RoombookingTestModule } from '../../../test.module';
import { PricingDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/pricing/pricing-delete-dialog.component';
import { PricingService } from '../../../../../../main/webapp/app/entities/pricing/pricing.service';

describe('Component Tests', () => {

    describe('Pricing Management Delete Component', () => {
        let comp: PricingDeleteDialogComponent;
        let fixture: ComponentFixture<PricingDeleteDialogComponent>;
        let service: PricingService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [RoombookingTestModule],
                declarations: [PricingDeleteDialogComponent],
                providers: [
                    PricingService
                ]
            })
            .overrideTemplate(PricingDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PricingDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PricingService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
