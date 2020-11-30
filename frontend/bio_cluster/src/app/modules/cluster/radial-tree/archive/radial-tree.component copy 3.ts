import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WkoDataService } from 'app/data/services/wko-data.service';
import { NgxEchartsConfig } from 'ngx-echarts/lib/ngx-echarts.directive';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import 'lodash';
import { not } from '@angular/compiler/src/output/output_ast';
import { keyBy } from 'lodash';
// import * as _ from 'lodash';
// declare var _: any;

// import * as dfd from 'danfojs-node';

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
  layerObjects: any = [];
  // hoverStyle = { lineStyle: { color: 'black' } };
  openNodes: any = []


  constructor(private backendService: WkoDataService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(data => this.data = [data]),
      tap(() => this.addNodeStyles(this.data))
    ).subscribe((data) => this.setOptions(data))

  }


  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
  }



  searchRecursive(data: any, searchValue: any, searchProp: any) {

    // depth -= 1

    //Declare using class, useful for buil a RegExp from a variable
    if (searchValue != undefined) {

      // Iter over key-value pairs (Nodes) at the given branch (Data)
      for (var i = 0; i < data.length; i++) {

        // Get the value of the searchProp
        let foundValue = data[i][searchProp]

        // See if the found value matches the searching value
        if (foundValue == searchValue) {

          console.log("MATCH", data[i][searchProp])

          // Add to layer objects array
          this.layerObjects.push(data[i]);
        }

        // If no match but still node children, further search the tree
        else if (data[i]["children"]) {

          // if (data[i]["children"].length > 0) {
          this.searchRecursive(data[i]["children"], searchValue, searchProp);
          // }
        }
      }
    }
    // this.setOptions()
    // return data;
  }


  setStyleRecursive(
    data: any,
    lookup: any,
    hideProps: any,
    activeProps: any,
    depth: any
  ) {

    depth -= 1
    // Iter over all children of current branch
    for (let i = 0; i < data.length; i++) {

      let nodeName = data[i].name
      let nodeChildren = data[i].children
      console.log("~  -------------------")
      console.log("~ nodeName", nodeName)

      // console.log("~ searchValue", searchProp)

      let hiddenNodeNames = []

      for (const value of Object.values(lookup)) {
        hiddenNodeNames.push(value["name"])
      }

      console.log("~ hiddenNodeNames", hiddenNodeNames)

      // Nodes to hide
      if (hiddenNodeNames.includes(nodeName)) {
        console.log("~ LOOKEDUP", nodeName)
        Object.keys(hideProps).forEach(
          (key) => {
            data[i][key] = hideProps[key]
          }
        )


        // Nodes to show
      } else {
        console.log("~ EXCEPTION", nodeName)

        Object.keys(activeProps).forEach(
          (key) => {

            if (key == "collapsed") {
              data[i]["collapsed"] != data[i]["collapsed"]
            }

            data[i][key] = activeProps[key]
          }

        )
        // var zoom = this.chart.getOption().dataZoom[0];
        // this.chart.dispatchAction({
        //   type: 'dataZoom',
        //   dataZoomIndex: 0,
        //   startValue: zoom.startValue,
        //   endValue: zoom.endValue
        // });

        if (depth > 0) {
          if (data[i]["children"].length > 0) {
            this.setStyleRecursive(data[i]["children"], [], hideProps, activeProps, depth);
          }
        }

        // Style all children of selected node



        // Object.keys(activeProps).forEach(
        //   (key) => {
        //     // activeProps.forEach(
        //     //   (prop, index) => {
        //     data[i][key] = activeProps[0][key]
        //   }
        // )
      }

      // let lookupName = value["name"]
      // console.log("~ lookupName", lookupName)
      // console.log("~ key", key)

      // // Elements to hide
      // if (nodeName == lookupName) {

      //   // console.log(`${key} ${value["name"]}`); // "a 5", "b 7", "c 9"

      //   // Hide props

      //   Object.keys(hideProps).forEach(
      //     (key) => {

      //       // console.log("~ index", key)
      //       // console.log("~ prop", hideProps[key])
      //       // console.log("~  -----------")

      //       // if (prop in Object.keys(hideProps[0])) {

      //       data[i][key] = hideProps[key]
      //       // console.log("~ data[i][prop] ", data[i][key])

      //       // }
      //     }
      //   )

      //   console.log("~ data", data)
      //   console.log("~  ---------")

      //   //pass
      // } else {

      //   console.log("~ data[i][prop] ", data[i])

      //   Object.keys(activeProps).forEach(
      //     (key) => {
      //       // activeProps.forEach(
      //       //   (prop, index) => {
      //       data[i][key] = activeProps[0][key]
      //     }
      //   )
      // }
      // }


      // if (data[i]["children"]) {



      // }

      // if data[i]["name"] in Objectlookup


      // if (foundProp == searchKey) {

      //   console.log("MATCH", data[i][searchProp])

      //   // Push to array of findings
      //   this.layerObjects.push(data[i]);
      // }


    }



    // Iter over all children of current branch
    // for (let i = 0; i < data.length; i++) {

    //   styleProps.forEach(
    //     (value, index) => {
    //       data[i][value] = styleObjects[index]
    //     }
    //   )

    //   // Go to next children layer if exists
    //   if (data[i]["children"]) {

    //     this.setStyleRecursive(data[i]["children"], styleProps, styleObjects);
    //   }
    // }
  }


  getNodesLayerIndex(
    object,
    eventDataName
  ) {
    // Iter over objects key value pairs
    for (const [key, value] of Object.entries(object)) {
      // Look for matches
      if (value["name"] == eventDataName) {
        return key
      }
    }
  }

  onNodeClicked(event) {

    if (event) {

      let node = event.data

      if (node.layer_id >= 0) {

        // Reset
        this.layerObjects = []

        this.searchRecursive(this.data, node.layer_id, "layer_id")

        console.log("~ this.layerObjects", this.layerObjects)

        let selectedNodeLayerIndex = this.getNodesLayerIndex(this.layerObjects, event.data.name)

        let activeLayerObjects = this.data[0]["children"]
        let hiddenLayerObjects = this.layerObjects.filter(
          (value, index) => selectedNodeLayerIndex != index)

        console.log("~ hiddenLayerObjects", hiddenLayerObjects)

        // Hide all other nodes in layer 
        this.setStyleRecursive(
          activeLayerObjects,
          hiddenLayerObjects,
          this.hideProps,
          this.activeProps,
          // Recursion one layer further
          2
        )

      }
      else {
        // Click on main node bio
        this.setStyleRecursive(
          this.data[0]["children"],
          this.data[0]["children"],
          { "collapsed": true },
          { "collapsed": false },
          5
        )

      }
    }
    this.setOptions()
  }


  // let toggleLabel = node => {

  //   if (node.layer_id >= 0) {

  //     if (node.layer_id == event.data.layer_id)

  //       if (node.name == event.data.name) {



  //         node.label = { show: true, color: "rgb(0, 10, 128)", verticalAlign: "middle" }

  //         node.lineStyle = {
  //           color: 'rgb(0, 0, 128)',
  //           shadowColor: 'rgba(0, 0, 0, 0.5)',
  //           shadowBlur: 10,
  //           opacity: 10,
  //           width: 0.5,
  //           curveness: 0
  //         }

  //         node.itemStyle = {
  //           color: "rgb(0, 0, 128)",
  //           shadowColor: "rgba(0, 0, 0, 0.5)",
  //           shadowBlur: 1,
  //           opacity: 1,
  //         }
  //         node.collapsed = !node.collapsed
  //       }


  //       else {
  //         node.label = { show: false, verticalAlign: "top", color: "rgba(0, 10, 128, 0.1)" }

  //         node.lineStyle = { width: 0 }

  //         node.itemStyle = {
  //           color: "rgb(0, 0, 128)",
  //           shadowColor: "rgba(0, 0, 0, 1)",
  //           shadowBlur: 10,
  //           opacity: 0.1,
  //         }

  //         node.collapsed = true

  //       }
  //   }
  // }

  // this.traverse(
  //   this.data[0],
  //   toggleLabel
  // )







  // Traverse each node in tree
  traverse(node, callback) {
    // console.log("~  -----------")
    // console.log("~ node", node)
    // console.log("~  -----------")

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

  // isNodeSelected(tree, nodeName) {
  //   let status = false;
  //   this.traverseFrom({
  //     tree: tree,
  //     nodeName: nodeName,
  //     callback: node => {
  //       if (node.hasOwnProperty('lineStyle')) status = true;
  //     },
  //     skipStartNode: true
  //   })
  //   return status
  // }

  // cleanTree(chartInstance) {
  //   // var clonedData = echarts.util.clone(data);
  //   let clonedData = { ...this.data }
  //   chartInstance.setOption({
  //     series: [{ type: 'tree', id: '0', data: [clonedData] }]
  //   }, false);
  // };

  // General paint function
  // paintBranch(chartInstance, nodeName) {
  //   let nodesForPaint = [];
  //   let newSeries = null;
  //   let mainOption = null;

  //   this.traverseFrom({
  //     nodeName: nodeName,
  //     callback: node => nodesForPaint.push(node.name),
  //     skipStartNode: true
  //   });

  //   console.log("~  -----------------------------")
  //   console.log("~ nodesForPaint", nodesForPaint)
  //   console.log("~  -----------------------------")

  //   if (nodesForPaint) {
  //     newSeries = this.buildSeriesConfig(nodesForPaint, this.hoverStyle)
  //   } else {
  // throw 'Nodes for paint is not exists'
  //   }

  //   if (newSeries) {
  //     // chartInstance.setOption({
  //     //   series: [{ type: 'tree', id: '0', data: [newSeries] }]
  //     // }, false);

  //     this.data = newSeries
  //     this.merge = this.options
  //   } else {
  //     throw 'New series config is not builded'
  //   }
  // };

  // Build new config with painted nodes
  buildSeriesConfig(nodes, style) {
    let seriesConfig = { ...this.data }
    console.log("~  ---------------------------")
    console.log("~ seriesConfig", seriesConfig)
    console.log("~  ---------------------------")

    // var seriesConfig = echarts.util.clone(data);
    var nodes: any = { ...nodes }.flat();

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

  labelOffset: Array<any> = [0, 10]

  activeProps: any = {
    label: {
      show: true, color: "rgb(0, 10, 128)", offset: this.labelOffset
    },
    lineStyle: {
      color: 'rgb(0, 0, 128)',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 10,
      opacity: 10,
      width: 0.5,
      curveness: 1
    },
    itemStyle: {
      color: "rgb(0, 0, 128)",
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowBlur: 1,
      opacity: 1,
    },
    collapsed: false
  }

  hideProps: any = {

    label: {
      show: false, color: "rgb(0, 10, 128)", offset: this.labelOffset
    },
    lineStyle: {
      width: 0,
      curveness: 1
    },
    itemStyle: { opacity: 0 },
    collapsed: true

  }


  addNodeStyles(data: any) {

    // for (let i = 0; i < data.length; i++) {
    //   console.log("////////////////////////////////////////////////////: ", i)

    //   // if (data[i] && i == 0) {
    //   //   // console.log("ZERO")
    //   //   console.log(data[i].name)
    //   //   console.log("")
    //   // }

    //   switch (i) {

    //     case 0:
    //       if (data[0] && i == 0) {
    //         console.log("ZERO")
    //         console.log(data[0].name)
    //         console.log("")
    //       }

    //       data[0]["itemStyle"] = {
    //         color: 'rgb(0, 0, 128)',
    //         shadowColor: 'rgba(0, 0, 0, 1)',
    //         shadowBlur: 10,
    //         opacity: 0.1,
    //       }

    //       data[0]["label"] = {
    //         show: true,
    //         color: 'rgba(0, 10, 128, 1)',
    //         // verticalAlign: "top",
    //         offset: [30, 40]
    //       }

    //       data[0]["lineStyle"] = {
    //         color: 'rgba(122, 0, 128, 1)',
    //         shadowColor: 'rgba(0, 0, 0, 0.5)',
    //         shadowBlur: 10,
    //         opacity: 1,
    //         width: 0.5,
    //         curveness: 0
    //       }


    //     case 1:

    //       if (data[1] && i == 1) {
    //         console.log("FIRST")
    //         console.log(data[1].name)
    //         console.log("")

    //         data[1]["itemStyle"] = {
    //           color: 'rgb(0, 0, 128)',
    //           shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           shadowBlur: 10,
    //           opacity: 0.1,
    //         }

    //         data[1]["label"] = {
    //           show: false,
    //           color: 'rgba(0, 10, 128, .5)',
    //           // verticalAlign: "top",
    //           offset: [30, 40]
    //         }

    //         data[1]["lineStyle"] = {
    //           color: 'rgba(122, 0, 128, 0.5)',
    //           shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           shadowBlur: 10,
    //           opacity: 1,
    //           width: 0.5,
    //           curveness: 0
    //         }
    //       }

    //     default:

    //       if (data[i]) {
    //         console.log("Node: ", i)
    //         console.log(data[i].name)
    //         console.log("")

    //         data[i]["itemStyle"] = {
    //           color: 'rgb(0, 0, 128)',
    //           shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           shadowBlur: 10,
    //           opacity: 0.1,
    //         }

    //         data[i]["label"] = {
    //           show: false,
    //           color: 'rgba(0, 10, 128, .1)',
    //           // verticalAlign: "top",
    //           offset: [30, 40]
    //         }

    //         data[i]["lineStyle"] = {
    //           color: 'rgba(122, 0, 128, 0.5)',
    //           shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           shadowBlur: 10,
    //           opacity: 0.1,
    //           width: 0.5,
    //           curveness: 0
    //         }

    //         data[i]["collapsed"] = false
    //       }
    //   }
    // }
  }

  lineStyleInit: any = {
    color: 'rgba(122, 0, 128, 0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10,
    opacity: 0.1,
    width: 0.5,
    curveness: 0
  }

  lineStyleDefault: any = {
    color: 'rgba(122, 0, 128, 0.5)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10,
    opacity: 0.1,
    width: 0.5,
    curveness: 0
  }

  labelStyleInit = {
    show: false,
    color: 'rgba(0, 10, 128, .5)',
    // verticalAlign: "top",
    offset: [30, 40]
  }

  labelStyleDefault = {
    show: false,
    color: 'rgba(0, 10, 128, .5)',
    // verticalAlign: "top",
    offset: [30, 40]
  }

  itemStyleInit = {
    color: 'rgb(0, 0, 128)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10,
    opacity: 0.1,
  }

  itemStyleDefault = {
    color: 'rgb(0, 0, 128)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 10,
    opacity: 0.1,
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
          height: "400px",
          top: '20%',
          roam: true,
          // edgeShape: "polyline",
          bottom: '10%',
          right: '0%',
          left: '0%',
          layout: 'radial',
          // symbol: 'image://https://icons.iconarchive.com/icons/hopstarter/soft-scraps/96/Network-MAC-icon.png',
          // expandAndCollapse: false,
          tooltip: { formatter: "Rooto" },
          symbolKeepAspect: true,
          symbolSize: 12,
          labelSize: 55,
          initialTreeDepth: -1,
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
          itemStyle: this.itemStyleDefault,
          lineStyle: this.lineStyleDefault,
          labelStyle: this.labelStyleDefault,
        }
      ]
    }
  }
}
