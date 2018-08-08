import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class HomeService {
  user: any = JSON.parse(localStorage.getItem('traclapioUser'));
  headers = new Headers();
  _url: string = '';

  constructor(private http: Http) {

    this.headers.append('Content-Type', 'application/json');
    if (this.user) {
      this.headers.append('user_id', this.user.id);
      this.headers.append('auth_token', this.user.internalToken);
    }
    this.headers.append('Access-Control-Allow-Origin', '*');

    if (environment.ENV == 'DEBUG') {
      this._url = environment.API_ENDPOINT_DEBUG;
    } else if (environment.ENV == 'PROD') {
      this._url = environment.API_ENDPOINT_PROD;
    } else {
      this._url = environment.API_ENDPOINT_HOMOLOG;
    }
  }  

  getTodayList(): Observable<any[]> {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    return this.http
      .get(this._url + `schedules/all/${this.user.companyId}/today`, options)
      .map((response: Response) => {
        return response.json();
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