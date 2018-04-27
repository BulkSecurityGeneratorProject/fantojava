import { BaseEntity } from './../../shared';

export class Room implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public photoContentType?: string,
        public photo?: any,
        public category?: BaseEntity,
    ) {
    }
}
