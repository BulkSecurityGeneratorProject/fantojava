import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Pricing } from './pricing.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Pricing>;

@Injectable()
export class PricingService {

    private resourceUrl =  SERVER_API_URL + 'api/pricings';

    constructor(private http: HttpClient) { }

    create(pricing: Pricing): Observable<EntityResponseType> {
        const copy = this.convert(pricing);
        return this.http.post<Pricing>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(pricing: Pricing): Observable<EntityResponseType> {
        const copy = this.convert(pricing);
        return this.http.put<Pricing>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Pricing>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Pricing[]>> {
        const options = createRequestOption(req);
        return this.http.get<Pricing[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Pricing[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Pricing = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Pricing[]>): HttpResponse<Pricing[]> {
        const jsonResponse: Pricing[] = res.body;
        const body: Pricing[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Pricing.
     */
    private convertItemFromServer(pricing: Pricing): Pricing {
        const copy: Pricing = Object.assign({}, pricing);
        return copy;
    }

    /**
     * Convert a Pricing to a JSON which can be sent to the server.
     */
    private convert(pricing: Pricing): Pricing {
        const copy: Pricing = Object.assign({}, pricing);
        return copy;
    }
}
