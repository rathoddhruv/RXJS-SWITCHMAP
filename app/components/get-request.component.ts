import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "get-request",
  templateUrl: "get-request.component.html"
})
export class GetRequestComponent implements OnInit {
  totalAngularPackages;

  testOutput: Observable<any>;
  intervalDataSub = new Subject<number>();
  intervalDataSub$ = this.intervalDataSub.asObservable();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.testOutput = this.intervalDataSub$.pipe(
      switchMap((data: number) => {
        return this.http
          .get<any>("https://api.npms.io/v2/search?q=scope:angular")
          .pipe(
            debounceTime(data),
            map((res: any) => {
              return res;
            }),
            tap(res => {
              console.log(res);
              console.log(data);
            })
          );
      })
    );

    this.testOutput.subscribe(res => {
      this.totalAngularPackages = res;
    });
  }

  callBE() {
    this.intervalDataSub.next(100);
  }
}
