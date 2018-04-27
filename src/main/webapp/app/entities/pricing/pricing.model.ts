import { BaseEntity } from './../../shared';

export class Pricing implements BaseEntity {
    constructor(
        public id?: number,
        public priceGuest?: number,
        public pricing?: BaseEntity,
    ) {
    }
}
