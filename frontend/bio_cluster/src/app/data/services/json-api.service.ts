import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
// import flare_data from './json/flare.json';
// import WKO_business_data from '../mocks/database/WKO/tree_WKO.json';


// import { Component, Input } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
// import { map } from 'rxjs/operator';
// import 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class JsonApiService implements OnInit {

  constructor() {
    // var object;
    // this.getJSON().subscribe(data => object = data, error => console.log(error));
  }

  // get(url: string): Observable<any> {
  //   switch (url) {
  //     // case '/flare':
  //     //   return of(flare_data);

  //     case '/business':
  //       return of(WKO_business_data);
  //     //   default: 
  //     //     const id = url.substring(url.lastIndexOf('/') + 1);
  //     //     return of(data.projects[id]);
  //     // }
  //   }
  // }
}
