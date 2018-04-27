/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { RoombookingTestModule } from '../../../test.module';
import { RoomCategoryDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/room-category/room-category-delete-dialog.component';
import { RoomCategoryService } from '../../../../../../main/webapp/app/entities/room-category/room-category.service';

describe('Component Tests', () => {

    describe('RoomCategory Management Delete Component', () => {
        let comp: RoomCategoryDeleteDialogComponent;
        let fixture: ComponentFixture<RoomCategoryDeleteDialogComponent>;
        let service: RoomCategoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [RoombookingTestModule],
                declarations: [RoomCategoryDeleteDialogComponent],
                providers: [
                    RoomCategoryService
                ]
            })
            .overrideTemplate(RoomCategoryDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(RoomCategoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RoomCategoryService);
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
