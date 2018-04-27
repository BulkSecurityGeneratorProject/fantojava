/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RoombookingTestModule } from '../../../test.module';
import { RoomCategoryDetailComponent } from '../../../../../../main/webapp/app/entities/room-category/room-category-detail.component';
import { RoomCategoryService } from '../../../../../../main/webapp/app/entities/room-category/room-category.service';
import { RoomCategory } from '../../../../../../main/webapp/app/entities/room-category/room-category.model';

describe('Component Tests', () => {

    describe('RoomCategory Management Detail Component', () => {
        let comp: RoomCategoryDetailComponent;
        let fixture: ComponentFixture<RoomCategoryDetailComponent>;
        let service: RoomCategoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [RoombookingTestModule],
                declarations: [RoomCategoryDetailComponent],
                providers: [
                    RoomCategoryService
                ]
            })
            .overrideTemplate(RoomCategoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RoomCategoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RoomCategoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new RoomCategory(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.roomCategory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
