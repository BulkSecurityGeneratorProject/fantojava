/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { RoombookingTestModule } from '../../../test.module';
import { RoomCategoryComponent } from '../../../../../../main/webapp/app/entities/room-category/room-category.component';
import { RoomCategoryService } from '../../../../../../main/webapp/app/entities/room-category/room-category.service';
import { RoomCategory } from '../../../../../../main/webapp/app/entities/room-category/room-category.model';

describe('Component Tests', () => {

    describe('RoomCategory Management Component', () => {
        let comp: RoomCategoryComponent;
        let fixture: ComponentFixture<RoomCategoryComponent>;
        let service: RoomCategoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [RoombookingTestModule],
                declarations: [RoomCategoryComponent],
                providers: [
                    RoomCategoryService
                ]
            })
            .overrideTemplate(RoomCategoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RoomCategoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RoomCategoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new RoomCategory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.roomCategories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
