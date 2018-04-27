import { BaseEntity } from './../../shared';

export class Booking implements BaseEntity {
    constructor(
        public id?: number,
        public from?: any,
        public until?: any,
        public guestName?: string,
        public guestEmail?: string,
        public guestPhone?: string,
        public room?: BaseEntity,
    ) {
    }
}
