import { Injectable, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
// import flare_data from './json/flare.json';
// import WKO_business_data from '../mocks/database/WKO/tree_WKO.json';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { InMemoryDataService } from './in-memory-data.service';


@Injectable({
  providedIn: 'root'
})
export class WkoDataService implements OnInit {

  // private wkoBusinessTree = 'C:/Code/bio-economy-cluster/frontend/src/app/data/mocks/databases/WKO/tree_WKO.json';
  private businessDataTree = new Subject();
  // private companyData = new Subject();
  private companyData;
  private companyDataSubs: Subscription;
  // public companyData$ = this.companyData.asObservable()

  private wkoCompaniesDir = 'data/mocks/database/WKO/companies';
  private wkoDatabaseURL = 'http://localhost:8080/api/';

  constructor(private http: HttpClient, private inMemoryApi: InMemoryDataService) { }

  ngOnInit(): void {
    // this.businessDataTree.next(this.fetchBusinessTree())
  };

  public setCompanyData(data: string) {

    if (data !== undefined) {
      this.http.get(this.wkoDatabaseURL + data).subscribe(data => this.companyData = data)

      // console.log("this.companyData", this.companyData$.subscribe(d => console.log(d)))
      // console.log("value", value)
      // this.companyData.next(value)
    }
  }

  public getCompaniesData(): any {

    console.log("🚀 ~ file: wko-data.service.ts ~ line 21 ~ WkoDataService ~ companyData", this.companyData)

    // console.log("this.companyData", this.companyData$.subscribe(data => console.log(data)))
    if (this.companyData !== undefined) {
      return this.companyData
    }
    // let value;
    // this.companyData$.subscribe(data => value = data)
    // console.log("🚀 ~ file: wko-data.service.ts ~ line 44 ~ WkoDataService ~  value", value)


  }

  public getTreeWKObusiness$() {

    return this.http.get(this.wkoDatabaseURL + "WKO_branchen_struktur");
    // let fetchedBusinessTree: any;
    // console.log("🚀 ~ file: wko-data.service.ts ~ line 32 ~ WkoDataService ~ fetchBusinessTree ~ fetchedBusinessTree", fetchedBusinessTree)
    // g = this.http.get(this.heroesUrl)
    // console.log(g)
    // return this.http.get(this.heroesUrl)


    // fetchedBusinessTree = this.http.get(this.heroesUrl).pipe(
    //   // debounceTime()
    //   // catchError((response: any) => this.handleError(response)),
    //   // map((response: any) => response.json())
    // );

    // console.log("FETCHED", this.businessDataTree)
    // return fetchedBusinessTree

  };

  // public fetchCompanies(name: string): Observable<any> {

  //   const url = `${this.wkoCompaniesDir}/${name}.json`;

  //   return this.http.get(this.wkoCompaniesDir).pipe(
  //     catchError((response: any) => this.handleError(response)),
  //     map((response: any) => response.json()),
  //   )
  // };

  // get companies$(): Observable<any> {
  //   return this.companies.asObservable()
  // }

  // get businessDataTree$(): Observable<any> {
  //   return this.http.get(this.wkoBusinessTree).pipe(
  //     // debounceTime()
  //     // catchError((response: any) => this.handleError(response)),
  //     map((response: any) => response.json())
  //   );
  //   // return this.businessDataTree.asObservable()
  // }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error("ERRRRROORR:", error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
