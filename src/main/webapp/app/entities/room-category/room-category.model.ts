import { BaseEntity } from './../../shared';

export class RoomCategory implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
    ) {
    }
}
