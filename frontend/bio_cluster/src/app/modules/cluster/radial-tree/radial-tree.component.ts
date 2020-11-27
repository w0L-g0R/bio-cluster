import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WkoDataService } from 'app/data/services/wko-data.service';
import { NgxEchartsConfig } from 'ngx-echarts/lib/ngx-echarts.directive';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import 'lodash';
// import * as _ from 'lodash';
declare var _: any;

@Component({
  selector: 'app-radial-tree',
  templateUrl: './radial-tree.component.html',
  styleUrls: ['./radial-tree.component.sass']
})
export class RadialTreeComponent implements OnInit {

  data: any;
  dataSub: Subscription;
  options: any;

  selectedNodeName: string;
  selectedNodeChildren: Array<string> = []

  leafNodeContent = new Subject()

  chart: any;

  constructor(private backendService: WkoDataService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(data => this.data = data)
    ).subscribe((data) => this.setOptions(data))

  }

  setOptions(option?: any, opts?: any, data?: any) {

    // Options update
    if (opts) {
      if (this.chart) {
        try {
          this.chart.setOption(option, opts);
        } catch (e) {
          console.error(e);
          // this.optionsError.emit(e);
        }
      }
    } else {
      this.options = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [this.data],
            height: "200px",
            top: '20%',
            roam: true,
            // edgeShape: "polyline",
            bottom: '0%',
            right: '0%',
            left: '0%',
            layout: 'radial',
            // symbol: 'image://https://www.onlygfx.com/wp-content/uploads/2017/12/grunge-yes-no-icon-1.png',
            // expandAndCollapse: false,
            tooltip: { formatter: "Rooto" },
            symbolKeepAspect: true,
            symbolSize: 9,
            labelSize: 55,
            initialTreeDepth: 1,
            animationDurationUpdate: 750,
            leaves: {
              itemStyle: {
                color: 'rgb(0, 128, 0)',
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10,
                opacity: 50,
              },
              label: {
                show: true,
                color: 'rgb(0, 128, 0)',
                verticalAlign: "middle",
              },
            },
            itemStyle: {
              color: 'rgb(0, 0, 128)',
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              opacity: 10,
            },
            lineStyle: {
              color: 'rgb(0, 0, 128)',
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
              opacity: 10,
              width: 0.5,
              curveness: 0
            },
            label: {
              show: true,
              color: 'rgb(0, 10, 128)',
              verticalAlign: "middle",
            },
          }
        ]
      }
    }
  }


  // onViewChange(ec) {
  //   console.log(ec)
  //   // this.radialTreeChartOptions = ec
  // }

  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
  }

  resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
  }


  private searchedItems: Array<any> = [];
  private key: string;
  private prop: string;
  private childrenPropName: string;

  // searchRecursive(value) {
  //   for (var i = 0; i < value.length; i++) {
  //     let lowerCaseName = value[i][this.prop].toLowerCase();
  //     if (lowerCaseName.includes(this.key)) {
  //       this.searchedItems.push(value[i]);
  //     } else if (value[i][this.childrenPropName]) {
  //       if (value[i][this.childrenPropName].length > 0) {
  //         this.searchRecursive(value[i][this.childrenPropName]);
  //       }
  //     }
  //   }
  // }

  // transform(value: any, key?: any, prop?: any, childrenProp?: any): any {
  //   if (key != undefined) {
  //     this.searchedItems = [];
  //     this.key = key.toLowerCase();
  //     this.prop = prop;
  //     this.childrenPropName = childrenProp;
  //     let searchResult = this.searchRecursive(value);
  //     return searchResult;
  //   }
  //   return value;
  // }

  onNodeClicked(event) {

    if (event) {
      console.log("~ event", event.data)
      this.selectedNodeName = event.data.name
      this.selectedNodeChildren = event.data.children

      // Bioökonomie label toggle
      if (this.selectedNodeName == "Bioökonomie") {
        console.log("~ Bioökonomie", this.chart)
        console.log("~  ---------------------------------------------------")
        console.log("~ this.data[Bioökonomie]", this.data["children"])
        console.log("~  ---------------------------------------------------")
        let g = _.filter(this.data, 'Bioökonomie.parent', 'Industrie')
        console.log("~  -----")
        console.log("~ g", g)
        console.log("~  -----")

      }




      // Set leafnode 
      if (event.data.children === undefined) {
        {
          let nodeName = this.convertNodeNameToJsonFormat(
            this.selectedNodeName)

          this.backendService.setCompanyData(nodeName)
        }
      }

    }


  }

  convertNodeNameToJsonFormat(name: string) {

    //TODO: Replace ugly chaining with proper regex expression
    let jsonNodeName = name.replace(/[^.*[~!-@#$%^&()_+={}[\]|\:;“’<,>.?๐฿].*$]/gi, '').replace(/-/g, "").replace(/,/g, "").replace(/ /g, "_");

    console.log("cleanNodeName", jsonNodeName)
    return jsonNodeName
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe()
  }
}
