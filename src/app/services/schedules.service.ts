import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class SchedulesService {
  user: any = {};
  headers = new Headers();
  _url: string = '';

  constructor(private http: Http) {
    this.user = JSON.parse(localStorage.getItem("currentUser"));

    this.headers.append('Content-Type', 'application/json');
    this.headers.append('user_id', this.user.id);
    this.headers.append('auth_token', this.user.internalToken);
    this.headers.append('Access-Control-Allow-Origin', '*');

    if (environment.ENV == 'DEBUG') {
      this._url = environment.API_ENDPOINT_DEBUG;
    } else if (environment.ENV == 'PROD') {
      this._url = environment.API_ENDPOINT_PROD;
    } else {
      this._url = environment.API_ENDPOINT_HOMOLOG;
    }
  }

  getList(companyId: string): Observable<any[]> {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    return this.http
      .get(this._url + "schedules/all/" + companyId, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getListEmployees(companyId: string): Observable<any[]> {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    return this.http
      .get(this._url + "employees/all/" + companyId, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  delete(id: String): Observable<any[]> {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    return this.http
      .delete(this._url + "schedules/" + id, options)
      .map((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getDetail(id: string): Observable<any> {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    return this.http
      .get(this._url + "schedules/" + id, options)
      .map((response: Response) => {
        let item = response.json();
        return item;
      })
      .catch(this.handleError);
  }

  getCEP(cep: string): Observable<any> {
    return this.http
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .map((response: Response) => {
        let item = response.json();
        return item;
      })
      .catch(this.handleError);
  }

  update(model: any) {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    model.companyId = '5b48be0402eebd0014cef631';

    return this.http.put(this._url + 'schedules', model, options)
      .map((response: Response) => {
        if (response.json().success == false)
          this.handleErrorMessage(response.json().errorMessage);

        return response.json()
      })
      .catch(this.handleError);
  }

  insert(model: any) {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    model.companyId = '5b48be0402eebd0014cef631';

    return this.http.post(this._url + 'schedules', model, options)
      .map((response: Response) => {
        if (response.json().success == false)
          this.handleErrorMessage(response.json().errorMessage);

        return response.json()
      })
      .catch(this.handleError);
  }

  private handleErrorMessage(error: String) {
    return Observable.throw(error);
  }

  private handleError(error: Response) {
    if (error.status == 401) {
      localStorage.removeItem("currentUser");
      alert('A sessão expirou. Voce sera redirecionado para o login.');
    }
    return Observable.throw(error.status);
  }
}