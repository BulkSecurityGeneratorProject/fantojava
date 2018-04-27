/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { RoombookingTestModule } from '../../../test.module';
import { PricingComponent } from '../../../../../../main/webapp/app/entities/pricing/pricing.component';
import { PricingService } from '../../../../../../main/webapp/app/entities/pricing/pricing.service';
import { Pricing } from '../../../../../../main/webapp/app/entities/pricing/pricing.model';

describe('Component Tests', () => {

    describe('Pricing Management Component', () => {
        let comp: PricingComponent;
        let fixture: ComponentFixture<PricingComponent>;
        let service: PricingService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [RoombookingTestModule],
                declarations: [PricingComponent],
                providers: [
                    PricingService
                ]
            })
            .overrideTemplate(PricingComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PricingComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PricingService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Pricing(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.pricings[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
