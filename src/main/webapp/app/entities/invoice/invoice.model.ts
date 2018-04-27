import { BaseEntity } from './../../shared';

export class Invoice implements BaseEntity {
    constructor(
        public id?: number,
        public uri?: string,
        public booking?: BaseEntity,
    ) {
    }
}
