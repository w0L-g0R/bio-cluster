import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, HostBinding, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SidenavService } from './drawer.service';


@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.sass']
})
export class DrawerComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('snav') public sidenav;
  @HostBinding('class') className = '';

  public toggleControl = new FormControl(true);

  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  showSpinner: boolean;
  userName: string;
  isAdmin: boolean;

  constructor(
    private sidenavService: SidenavService,
    private overlay: OverlayContainer,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {

    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {

  }

  onToggleSidenav(toggleEvent: Event) {
    // Toggle sidenav
    this.sidenav.toggle()
    // Update state
    this.sidenavService.updateState(this.sidenav.opened)
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}