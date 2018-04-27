/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RoombookingTestModule } from '../../../test.module';
import { PricingDetailComponent } from '../../../../../../main/webapp/app/entities/pricing/pricing-detail.component';
import { PricingService } from '../../../../../../main/webapp/app/entities/pricing/pricing.service';
import { Pricing } from '../../../../../../main/webapp/app/entities/pricing/pricing.model';

describe('Component Tests', () => {

    describe('Pricing Management Detail Component', () => {
        let comp: PricingDetailComponent;
        let fixture: ComponentFixture<PricingDetailComponent>;
        let service: PricingService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [RoombookingTestModule],
                declarations: [PricingDetailComponent],
                providers: [
                    PricingService
                ]
            })
            .overrideTemplate(PricingDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PricingDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PricingService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Pricing(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.pricing).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
