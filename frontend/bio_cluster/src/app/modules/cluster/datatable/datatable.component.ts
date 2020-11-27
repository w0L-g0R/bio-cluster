import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'app/data/services/excel.service';
import { WkoDataService } from 'app/data/services/wko-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.sass']
})
export class DatatableComponent implements OnInit {

  constructor(private backendService: WkoDataService, private excelService: ExcelService) { }

  tableDataSub: Subscription;
  dataSource: any;
  displayedColumns: any;

  ngOnInit(): void {

    this.dataSource = Object.values(this.backendService.getCompaniesData())
    console.log("🚀 ~ file: datatable.component.ts ~ line 21 ~ DatatableComponent ~ ngOnInit ~ this.dataSource", this.dataSource)
    this.displayedColumns = Object.keys(this.dataSource[0])
  }

  onExportAsExcelFile() {
    this.excelService.exportAsExcelFile(this.dataSource, "Test_EXCEL.xlsx")
  }

}
