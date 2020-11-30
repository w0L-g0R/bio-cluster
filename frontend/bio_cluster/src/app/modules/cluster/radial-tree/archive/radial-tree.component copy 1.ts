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

  data: Array<any>;
  dataSub: Subscription;
  options: any;
  merge: any;

  selectedNodeName: string;
  selectedNodeChildren: Array<string> = []

  leafNodeContent = new Subject()

  chart: any;

  constructor(private backendService: WkoDataService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(data => this.data = [data]),
      tap(() => this.addRecursive(this.data))
    ).subscribe((data) => this.setOptions(data))

  }

  setOptions(option?: any, data?: any) {

    // Options update
    if (data) {

      console.log(this.options)

      if (this.chart) {
        try {
          this.options.series.data = data;
        } catch (e) {
          // console.error(e);
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
            data: this.data,
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

  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
  }

  resizeChart() {
    if (this.chart) {
      this.chart.resize();
    }
  }


  public searchedItems: Array<any> = [];

  setStyleRecursive(
    data: any,
    styleObject: string,
    styleProp: string,
    stylePropValue: string) {

    for (var i = 0; i < data.length; i++) {

      data[i][styleObject][styleProp] = stylePropValue

      if (data[i]["children"]) {

        this.setStyleRecursive(data[i]["children"], styleObject, styleProp, stylePropValue);
      }
    }

    // this.merge = this.options

  }

  searchRecursive(data: any, key?: any, prop?: any) {

    //Declare using class, useful for buil a RegExp from a variable
    if (key != undefined) {
      for (var i = 0; i < data.length; i++) {

        let searchValue = data[i][prop]
        // console.log("~ name", name)

        if (searchValue == key) {

          console.log("MATCH", data[i][prop])

          // Toggle between 1 and 0
          // let opacityState = this.data["children"][i]["itemStyle"]["opacity"]
          // this.data["children"][i]["itemStyle"]["opacity"] = 1 - opacityState

          this.searchedItems.push(data[i]);
        }

        else if (data[i]["children"]) {

          if (data[i]["children"].length > 0) {
            this.searchRecursive(data[i]["children"], key, prop);
          }

        }
      }
    }
    // this.setOptions()
    // return data;
  }


  addRecursive(data: any) {

    for (var i = 0; i < data.length; i++) {

      data[i]["itemStyle"] = {
        color: 'rgb(0, 0, 128)',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
        opacity: 1,
      }

      data[i]["label"] = {
        show: true,
        color: 'rgb(0, 10, 128)',
        verticalAlign: "middle",
      }

      data[i]["lineStyle"] = {
        color: 'rgb(0, 0, 128)',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 10,
        opacity: 1,
        width: 0.5,
        curveness: 0
      }

      // data[i]["collapsed"] = false

      try {

        this.addRecursive(data[i]["children"]);
      }
      catch (e) {
        // console.log("~ e", e)
      }
    }
  }

  onNodeClicked(event) {

    this.searchedItems = []
    if (event) {
      // console.log("~ event", event.data)
      let nodeData: any = event.data
      let searchedItems: Array<any> = []

      this.selectedNodeName = event.data.name
      this.selectedNodeChildren = event.data.children

      // this.addRecursive(this.data)

      console.log("~  -----------------------")
      console.log("~ this.data ", this.data)
      console.log("~  -----------------------")
      // Bioökonomie label toggle
      // if (this.selectedNodeName == "Bioökonomie") {
      //   // console.log("~ Bioökonomie", this.chart)
      //   // console.log("~ this.data[Bioökonomie]", this.data["children"])


      //   let searchedItems = this.searchRecursive(this.data, "0", "layer_id")
      //   console.log("~  -----")
      //   console.log("ITEMS", searchedItems)

      //   // let g = _.filter(this.data, 'Bioökonomie.parent', 'Industrie')
      //   // console.log("~ g", g)

      //   // this.filterBreakfast('Industrie', this.data)
      //   // console.log("~ this.filterBreakfast('Industrie', this.data)", this.filterBreakfast('Industrie', this.data))
      // }

      if (nodeData.layer_id == "0") {

        // All layer nodes except the selected one
        // + label: show : false
        // + itemStyle: opacity: 0
        // + lineStyle: opacity: 0
        this.setStyleRecursive(this.data, "itemStyle", "color", "AliceBlue")
        // this.setStyleRecursive(this.data, "itemStyle", "color", "AliceBlue")
        // this
        // console.log("~ nodeData.layer_id", nodeData.layer_id)
        // let searchedItems = this.searchRecursive(this.data, "2", "layer_id")
        // console.log("ITEMS", this.searchedItems)
        // console.log("THIS DATA", this.data)
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
    let jsonNodeName = name[0].replace(/[^.*[~!-@#$%^&()_+={}[\]|\:;“’<,>.?๐฿].*$]/gi, '').replace(/-/g, "").replace(/,/g, "").replace(/ /g, "_");

    console.log("cleanNodeName", jsonNodeName)
    return jsonNodeName
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe()
  }
}
