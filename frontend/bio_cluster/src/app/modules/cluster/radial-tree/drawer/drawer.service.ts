import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { lighthouses } from '../radial-tree-constants';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {

    public changeLighthouse = new Subject<number>();
    public changeView = new Subject<number>();
    public resetView = new Subject<number>();
    public changeLayers = new Subject<number>();
    public changeNodes = new Subject<number>();
    public exportExcel = new Subject<number>();
    public sidenavSource = new Subject<boolean>();

    changedLighthouse$ = this.changeLighthouse.asObservable();
    changedView$ = this.changeView.asObservable();
    resetView$ = this.resetView.asObservable();
    changedLayers$ = this.changeLayers.asObservable();
    changedNodes$ = this.changeNodes.asObservable();
    exportExcel$ = this.exportExcel.asObservable();

    sidenavChanged$ = this.sidenavSource.asObservable();

    updateState(sidenavOpened: boolean) {
        // Update Chart container when sidenav changes
        this.sidenavSource.next(sidenavOpened);
    }

    // onChangeLighthouse(event){

    // }
    // onChangeView(event) {

    // }
    // onChangeLayer(event){

    // }
    // onChangeNodes(event){

    // }
    // onResetView(event){

    // }

    constructor() {}

    ngOnInit(): void {}


}
