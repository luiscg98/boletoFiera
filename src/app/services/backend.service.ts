import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

let urlBase='http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http:HttpClient) {
    console.log("backenservice corriendo");
  }

  login(body:Object){
    let url = `${urlBase}login`;
    return this.http.post(url,body);
  }

  logout(token:string, body:Object){
    let headers = new HttpHeaders({
      Authorization:token
    });
    let url = `${urlBase}logout`
    return this.http.post(url,body,{headers});
  }

  metodo(termino:string,metodo:string,token:string,body:Object){
    let url = `${urlBase}${termino}`;
    let headers = new HttpHeaders({
      Authorization:token
    });
    switch(metodo){
      case 'GET':
        if(token!='')
        return this.http.get(url,{headers});
        else
        return this.http.get(url);
        break;
      case 'POST':
        if(token!='')
        return this.http.post(url,body,{headers});
        else
        return this.http.post(url,body);
        break;
      case 'PUT':
        if(token!='')
        return this.http.put(url,body,{headers});
        else
        return this.http.put(url,body);
        break;
      case 'DELETE':
        if(token!='')
        return this.http.delete(url,{headers});
        else
        return this.http.delete(url);
        break;
      default:
        return undefined;
        break;
    }
  }
}
