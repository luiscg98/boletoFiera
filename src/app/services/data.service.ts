import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private subject$ = new Subject<object>();
  private subject2$ = new Subject<object>();
  private subject3$ = new Subject<object>();
  private subject4$ = new Subject<boolean>();
  private subject5$ = new Subject<object>();

  constructor() { }

  sendCriterio(criterio: object) {
    this.subject$.next(criterio);
  }

  /**
   * Método para subscribirnos al Observable
   */
  onListenCriterio(): Observable<object> {
    return this.subject$.asObservable();
  }

  sendModalButaca(bandera:boolean){
    this.subject4$.next(bandera);
  }

  onListenModalButaca(): Observable<boolean>{
    return this.subject4$.asObservable();
  }


  sendButaca(criterio:object){
    this.subject2$.next(criterio);
  }

  onListenButaca(): Observable<object>{
    return this.subject2$.asObservable();
  }

  sendDelete(criterio:object){
    this.subject3$.next(criterio);
  }

  onListenDelete(): Observable<object>{
    return this.subject3$.asObservable();
  }

  sendSector(criterio:object){
    this.subject5$.next(criterio);
  }

  onListenSector(): Observable<object>{
    return this.subject5$.asObservable();
  }

}
