import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
  user: any = {};
  headers = new Headers();
  _url: string = '';

  constructor(private http: Http) {
    this.user = JSON.parse(localStorage.getItem("currentUser"));

    this.headers.append('Content-Type', 'application/json');    
    this.headers.append('Access-Control-Allow-Origin', '*');

    if (environment.ENV == 'DEBUG') {
      this._url = environment.API_ENDPOINT_DEBUG;
    } else if (environment.ENV == 'PROD') {
      this._url = environment.API_ENDPOINT_PROD;
    } else {
      this._url = environment.API_ENDPOINT_HOMOLOG;
    }
  }  

  login(model: any) {
    const options = new RequestOptions(
      {
        headers: this.headers
      }
    );

    return this.http.post(this._url + 'auth/email', model, options)
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
    return Observable.throw(error.status);
  }
}