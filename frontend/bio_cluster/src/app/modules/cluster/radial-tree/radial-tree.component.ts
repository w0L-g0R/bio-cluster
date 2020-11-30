import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WkoDataService } from 'app/data/services/wko-data.service';
import { NgxEchartsConfig } from 'ngx-echarts/lib/ngx-echarts.directive';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import 'lodash';
declare var _: any;
import { paintBranch, turnLabelRedAndBold, toggleLabel } from "./radial-tree-styling"
import { defaultOptions } from "./options/default-options"
import { initOptions } from "./options/init-options"
import { labelStyleInitRoot, lineStyleInitRoot, itemStyleInitRoot } from "./radial-tree-styles"
import { hiddenInitNodes, lighthouses } from "./radial-tree-constants";
import { each } from 'lodash';
import { SidenavService } from './drawer/drawer.service';

@Component({
  selector: 'app-radial-tree',
  templateUrl: './radial-tree.component.html',
  styleUrls: ['./radial-tree.component.sass']
})
export class RadialTreeComponent implements OnInit {

  initData: any;
  data: Array<any>;
  dataSub: Subscription;
  options: any;
  merge: any;
  chart: any;
  layerObjects: any = [];
  openNodes: any = []

  defaultOptions: any;
  initOptions: any;
  match: boolean;

  // Make generic
  activeLayer: number = 3;
  sidenavServiceSub: Subscription;
  lighthouseSub: Subscription;
  changedViewSub: Subscription;
  resetViewSub: Subscription;
  changedLayersSub: Subscription;
  changedNodesSub: Subscription;

  constructor(private backendService: WkoDataService, private sidenavService: SidenavService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(
        (data) => {
          this.initData = data;
        })
    ).subscribe(() => this.setOptions("init"))

    this.lighthouseSub =this.sidenavService.changedLighthouse$.subscribe(
      (event)=> this.onChangeLighthouse(event)
    )

    this.changedViewSub =this.sidenavService.changedView$.subscribe(
      (event)=> this.onChangeView(event)
    )

    this.resetViewSub =this.sidenavService.resetView$.subscribe(
      ()=> this.onResetView()
    )

    this.changedLayersSub =this.sidenavService.changedLayers$.subscribe(
      (event)=> this.onChangeLayer(event)
    )

    this.changedNodesSub =this.sidenavService.changedLayers$.subscribe(
      (event)=> this.onChangeNodes(event)
    )

  }

  setOptions(options: any, data?: any) {

    switch (options) {
      case "init":
        this.data = [JSON.parse(JSON.stringify(this.initData))]

        console.log("~  -----------------------")
        console.log("~ ON INIT ", this.data)
        console.log("~  -----------------------")
        this.initOptions = new initOptions(this.data);

        // Root style
        this.data[0]["itemStyle"] = itemStyleInitRoot
        this.data[0]["labelStyle"] = labelStyleInitRoot
        this.data[0]["lineStyle"] = lineStyleInitRoot

        // Trigger chart update
        this.options = this.initOptions.object
        break;

      case "update":

        console.log("~  -----------------------")
        console.log("~ ON UPDATE ", this.data)
        console.log("~  -----------------------")

        this.initOptions = new initOptions(this.data);
        this.initOptions.setTreeDepth(this.activeLayer)

        // Trigger chart update
        this.options = this.initOptions.object
        break;

      default:
        this.defaultOptions = new defaultOptions([data]);
        this.options = this.defaultOptions.object
        break;
    }

    //NOTE: Move this to backend operation with pandas
    this.setParent(this.data, "parent", this.data[0])

    // Hide nodes
    this.traverse(this.data, hiddenInitNodes, "name", node => {
      toggleLabel(node)
    })

  }

  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
  }


  onChangeLighthouse(event) {
    console.log("~  -------------")
    console.log("~ onChangeLighthouse", event)
    console.log("~  -------------")

    // Reset
    if (event == 0) {
      this.setOptions("init")
    }

    // Update
    else {
      this.traverse(this.data, [event], "flag_LT", node => {
        turnLabelRedAndBold(node)
        this.paintPath(node, "red")
      })

      // Pass tree depth 
      this.setOptions("update")

      // this.initOptions.setData(this.data)
      // this.merge = this.initOptions.object
    }
  }
  onChangeView(event) {
    console.log("~ onChangeView", event)

  }

  onChangeLayer(event) {
    console.log("~ onChangeLayers", event)

    // Return number between 0-3
    this.activeLayer = event

    // Hide nodes
    this.traverse(this.data, 4, "layer_id", node => {
      toggleLabel(node)
    })

    this.setOptions("update", this.activeLayer)
    // this.initOptions.setTreeDepth(event)
    // this.options = this.initOptions.object
    this.merge = this.options
  }

  onChangeNodes(event) {
    console.log("~ onAddOrRemoveNodes", event)
  }

  onResetView() {

    this.setOptions("init")


  }

  traverse(data: any, targets: any, searchProp: any, callback: any) {

    // Check if targets is an array, else parse
    if (!Array.isArray(targets)) {
      targets = [targets]
    }

    //Declare using class, useful for buil a RegExp from a variable
    if (this.match == true || data != undefined) {

      // Iter over key-value pairs (Nodes) at the given branch (Data)
      for (var i = 0; i < data.length; i++) {

        // Get the value of the searchProp
        let foundValue = data[i][searchProp]

        // See if the found value matches the searching values
        if (targets.includes(foundValue)) {

          callback(data[i])
        }

        // If no match but still node children, further search the tree
        else if (data[i]["children"]) {

          // if (data[i]["children"].length > 0) {
          this.traverse(data[i]["children"], targets, searchProp, callback);
          // }
        }
      }
    }
    this.match = false
  }

  traverseParents(node, callback) {

    if (node !== undefined) {
      if (node.parent) {
        callback(node);
        this.traverseParents(node["parent"], callback)
      }
    }
  }

  traversePath(data: any, path: any, pathProp: any, callback: any) {

    if (data != undefined) {

      // Iter over key-value pairs (Nodes) at the given branch (Data)
      for (var i = 0; i < data.length; i++) {

        // Get the value of the searchProp
        let foundPath = data[i][pathProp]

        // See if the found value matches the searching value
        if (path[0] == foundPath) {

          callback(data[i])
          path.shift()
          this.traversePath(data[i]["children"], path, pathProp, callback);

          if (path[0] == undefined) {
            break;
          }
        }
      }
    }
  }

  paintPath(node, color) {

    let path: any = []

    this.traverseParents(node, node => path.push(node.name))

    this.traversePath(this.data, path.reverse(), "name", node => {

      if (node.children) {
        // Dont show labels on the path
        paintBranch(node, false, color)
      }
      else {
        // But show labels on the leafs
        paintBranch(node, true, color)
      }
    })
  }

  setParent(data: any, newProp: any, newValue: any) {

    if (data == undefined) {

      return
      // Base casee
    } else {

      // Iter over key-value pairs (Nodes) at the given branch (Data)
      for (let i = 0; i < data.length; i++) {

        // Assign parent name
        data[i][newProp] = _.omit(newValue, 'children')

        // Difference to setPropRecursive: Assign newValue is the current node
        this.setParent(data[i]["children"], newProp, data[i]);
      }
    }
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
            // console.log("~  -------------------------------------")
            // console.log("~ data[i][newProp] ", data[i][newProp])
            // console.log("~  -------------------------------------")
            // console.log("~  -------------------------------------")
            // console.log("~ data[i][newProp] ", data[i][newProp])
            // console.log("~  -------------------------------------")
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


      }

    }
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

  onNodeClick(event) {

    if (event) {

      let node = event.data

      if (node.children == undefined) {

        this.backendService.setCompanyData(this.convertNodeNameToJsonFormat(node.name))

        // Reset
        // this.layerObjects = []

        // this.search(this.data, node.layer_id, "layer_id")

        //   console.log("~ this.layerObjects", this.layerObjects)

        //   let selectedNodeLayerIndex = this.getNodesLayerIndex(this.layerObjects, event.data.name)

        //   let activeLayerObjects = this.data[0]["children"]
        //   let hiddenLayerObjects = this.layerObjects.filter(
        //     (value, index) => selectedNodeLayerIndex != index)

        //   console.log("~ hiddenLayerObjects", hiddenLayerObjects)

        //   // Hide all other nodes in layer 
        //   this.setStyleRecursive(
        //     activeLayerObjects,
        //     hiddenLayerObjects,
        //     this.hideProps,
        //     this.activeProps,
        //     // Recursion one layer further
        //     2
        //   )

        // }
        // else {
        //   // Click on main node bio
        //   this.setStyleRecursive(
        //     this.data[0]["children"],
        //     this.data[0]["children"],
        //     { "collapsed": true },
        //     { "collapsed": false },
        //     5
        //   )

      }
    }
    // this.setOptions()
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
