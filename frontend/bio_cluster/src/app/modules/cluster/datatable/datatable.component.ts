import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'app/data/services/excel.service';
import { WkoDataService } from 'app/data/services/wko-data.service';
import { Subscription } from 'rxjs';
import { SidenavService } from '../radial-tree/drawer/drawer.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.sass']
})
export class DatatableComponent implements OnInit {
  
  constructor(private backendService: WkoDataService, private excelService: ExcelService, private sidenavService: SidenavService) { }
  
  sidenavSub: Subscription;
  tableDataSub: Subscription;
  dataSource: any;
  displayedColumns: any;

  ngOnInit(): void {
    this.dataSource = Object.values(this.backendService.getCompaniesData())
    this.displayedColumns = Object.keys(this.dataSource[0])
    this.sidenavSub = this.sidenavService.exportExcel$.subscribe(()=>{this.onExportAsExcelFile()})
  }

  onExportAsExcelFile() {
    this.excelService.exportAsExcelFile(this.dataSource, "Test_EXCEL.xlsx")
  }

}
