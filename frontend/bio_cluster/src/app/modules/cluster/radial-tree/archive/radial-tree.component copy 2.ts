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
  chart: any;

  hoverStyle = { lineStyle: { color: 'black' } };

  constructor(private backendService: WkoDataService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(data => this.data = [data]),
      // tap(() => this.addRecursive(this.data))
    ).subscribe((data) => this.setOptions(data))

  }

  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
  }

  onNodeClicked(event) {

    if (event) {
      var chartTree = this.chart.getOption().series[0].data[0];
      console.log("~ chartTree", chartTree)

      var nodeSelected = this.isNodeSelected(chartTree, event.name);
      console.log("~ nodeSelected", nodeSelected)



      if (nodeSelected) {
        cleanTree(chart)
      } else {
        this.paintBranch(this.chart, event.name)
      }

    }
  }


  isNodeSelected(tree, nodeName) {
    let status = false;
    this.traverseFrom({
      tree: tree,
      nodeName: nodeName,
      callback: node => {
        if (node.hasOwnProperty('lineStyle')) status = true;
      },
      skipStartNode: true
    })
    return status
  }

  // Traverse from target node
  traverseFrom(opts) {

    let defaults = { tree: this.data, nodeName: null, callback: null, skipStartNode: false };

    Object.assign(defaults, opts);

    let targetNode = null;

    // Find node for start paint
    this.traverse(defaults.tree, node => {
      if (node.name === defaults.nodeName) {
        targetNode = node;
      }
    });

    // Find all children of found node
    this.traverse(targetNode, node => {
      if (defaults.skipStartNode && node.name === defaults.nodeName) {
        // Skip first because it is start branch
      } else {
        defaults.callback(node)
      }
    });
  }

  // Traverse each node in tree
  traverse(node, callback) {
    console.log("~  -----------")
    console.log("~ node", node)
    console.log("~  -----------")

    if (node) {
      if (node.children) {
        callback(node);
        node.children.forEach(subNode => this.traverse(subNode, callback))
      } else {
        callback(node)
        // console.log("NODE", node)
      }
    }
  }

  cleanTree(chartInstance) {
    // var clonedData = echarts.util.clone(data);
    let clonedData = { ...this.data }
    chartInstance.setOption({
      series: [{ type: 'tree', id: '0', data: [clonedData] }]
    }, false);
  };

  // General paint function
  paintBranch(chartInstance, nodeName) {
    let nodesForPaint = [];

    let newSeries = null;
    let mainOption = null;

    this.traverseFrom({
      nodeName: nodeName,
      callback: node => nodesForPaint.push(node.name),
      skipStartNode: true
    });

    console.log("~  -----------------------------")
    console.log("~ nodesForPaint", nodesForPaint)
    console.log("~  -----------------------------")

    if (nodesForPaint) {
      newSeries = this.buildSeriesConfig(nodesForPaint, this.hoverStyle)
    } else {
      throw 'Nodes for paint is not exists'
    }

    if (newSeries) {
      // chartInstance.setOption({
      //   series: [{ type: 'tree', id: '0', data: [newSeries] }]
      // }, false);

      this.data = newSeries
      this.merge = this.options
    } else {
      throw 'New series config is not builded'
    }
  };

  // Build new config with painted nodes
  buildSeriesConfig(nodes, style) {
    let seriesConfig = { ...this.data }
    console.log("~  ---------------------------")
    console.log("~ seriesConfig", seriesConfig)
    console.log("~  ---------------------------")

    // var seriesConfig = echarts.util.clone(data);
    var nodes = [...nodes].flat();

    this.traverse(seriesConfig, node => {
      if (nodes.includes(node.name)) {
        Object.assign(node, style);
      }
    });
    return seriesConfig
  };


  convertNodeNameToJsonFormat(name: string) {

    //TODO: Replace ugly chaining with proper regex expression
    let jsonNodeName = name[0].replace(/[^.*[~!-@#$%^&()_+={}[\]|\:;“’<,>.?๐฿].*$]/gi, '').replace(/-/g, "").replace(/,/g, "").replace(/ /g, "_");

    console.log("cleanNodeName", jsonNodeName)
    return jsonNodeName
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe()
  }

  setOptions(option?: any, data?: any) {

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
