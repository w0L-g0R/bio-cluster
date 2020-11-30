import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SidenavService } from '../drawer/drawer.service';
import { lighthouses } from '../radial-tree-constants';

@Component({
  selector: 'app-radial-tree-panel',
  templateUrl: './radial-tree-panel.component.html',
  styleUrls: ['./radial-tree-panel.component.sass']
})
export class RadialTreePanelComponent implements OnInit {

  // @Output() changeLighthouse: EventEmitter<any> = new EventEmitter();
  // @Output() changeView: EventEmitter<any> = new EventEmitter();
  // @Output() resetView: EventEmitter<any> = new EventEmitter();
  // @Output() changeLayers: EventEmitter<any> = new EventEmitter();
  // @Output() changeNodes: EventEmitter<any> = new EventEmitter();

  // Panel automation
  step = -1;

  // Import lighthouses constant
  lighthouses = lighthouses
  selectedLighthouse: string = "None";
  selectedLighthouseControl = new FormControl(this.selectedLighthouse);

  // Views
  selectedView: string = "Vollansicht";
  views: string[] = ['Ursprung', 'Vollansicht'];

  constructor(private sidenavService: SidenavService) { }

  ngOnInit(): void {
  }

  selectLighthouse(value) {

    // TODO: Decode lighthouses
    this.sidenavService.changeLighthouse.next(this.lighthouses.indexOf(value) + 1);
  }

  selectView(value) {
    console.log("~ selectView", value)
    // TODO make more generic
    this.sidenavService.changeView.next(value); //emit event here
  }

  selectLayers(value) {
    console.log("~ selectView", value)
    this.sidenavService.changeLayers.next(value); //emit event here
  }

  addOrRemoveNodes(event) {
    const changeCommand = event.srcElement.textContent
    this.sidenavService.changeNodes.next(changeCommand);
  }

  reset(event) {
    const changeCommand = event.srcElement.textContent
    this.sidenavService.resetView.next(changeCommand);
  }

  exportExcel(event) {
    const changeCommand = event.srcElement.textContent
    this.sidenavService.exportExcel.next(changeCommand);
  }


  // Panel automation
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
