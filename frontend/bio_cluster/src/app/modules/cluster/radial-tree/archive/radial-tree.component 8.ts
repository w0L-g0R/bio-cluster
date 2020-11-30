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

  activeLayer: number;

  constructor(private backendService: WkoDataService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(
        (data) => {
          this.initData = data;
        })
    ).subscribe(() => this.setOptions("init"))
  }

  setOptions(options: any, data?: any) {

    if (options == "default") {

      this.defaultOptions = new defaultOptions([data]);
      this.options = this.defaultOptions.object

      // this.merge = this.options
    } else if (options == "init") {


      // Updated data
      // if (data) {
      //   this.options = new initOptions(data);
      // }
      // // Init data
      // else {
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
    }

    //NOTE: Move this to backend operation with pandas
    this.setParent(this.data, "parent", this.data[0])

    // Hide nodes
    this.traverse(this.data, hiddenInitNodes, "name", node => {
      toggleLabel(node)
    })

    // Reset leave colors
    // TODO: Not generic
    let allLayers = [0, 1, 2, 3]
    // console.log("~  ---------------------")
    // console.log("~ allLayers", allLayers)
    // console.log("~  ---------------------")

    // allLayers.forEach(element => {

    // });

    // this.traverse(this.data, 0, "layer_id", node => {
    //   if (node.children) {
    //     // Dont show labels on the path
    //     paintBranch(node, false, "init")
    //   }
    //   else {
    //     // But show labels on the leafs
    //     paintBranch(node, true, "init")
    //   }
    // })


    // this.traverse(this.data, "2", "layer_id", node => {
    //   node["collapsed"] = true
    // })

    // this.traverse(this.data, "1", "flag_LT", node => {
    //   this.paintPath(node)
    // })

    // this.options = this.defaultOptions.object
    // console.log("~  -----------------------------")
    // console.log("~ this.options ", this.options)
    // console.log("~  -----------------------------")

    // console.log("~  -----------------------------")
    // console.log("~ this.data ", this.data)
    // console.log("~  -----------------------------")
  }

  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
  }


  onChangeLighthouse(event) {
    console.log("~  -------------")
    console.log("~ onChangeLighthouse", event)
    console.log("~  -------------")

    this.traverse(this.data, [event], "flag_LT", node => {
      turnLabelRedAndBold(node)
      this.paintPath(node, "red")
    })

    this.initOptions.setData(this.data)
    this.options = this.initOptions.object
    this.merge = this.options

  }
  onChangeView(event) {
    console.log("~  -------------")
    console.log("~ onChangeView", event)
    console.log("~  -------------")

  }

  onChangeLayer(event) {
    console.log("~  -------------")
    console.log("~ onChangeLayers", event)
    console.log("~  -------------")

    this.onResetView("event")
    this.initOptions.setTreeDepth(event - 1)
    this.options = this.initOptions.object
    this.merge = this.options
  }

  onChangeNodes(event) {
    console.log("~  -------------")
    console.log("~ onAddOrRemoveNodes", event)
    console.log("~  -------------")
  }

  onResetView(event) {
    console.log("~  -------------")
    console.log("~ onReset", event)
    console.log("~  -------------")

    // this.traverse(this.data, new Array(3), "layer_id", node => {
    //   // turnLabelRedAndBold(node)
    //   // this.paintPath(node)
    //   node["collapsed"] = false
    //   // node["collapsed"] = true
    // })

    this.setOptions("init")

    // this.options = new initOptions(this.data).object

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

          console.log("PARENTS", data[i][pathProp])

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

  paintTree(node, style) {

    // this.traverse(this.data, , "name", node => {

    //   if (node.children) {
    //     // Dont show labels on the path
    //     paintBranch(node, false)
    //   }
    //   else {
    //     // But show labels on the leafs
    //     paintBranch(node, true)
    //   }
    // })

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

        // var copy = Object.assign({}, newValue)
        // delete copy["children"];

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

  onNodeClick(event) {

    if (event) {

      let node = event.data

      if (node.layer_id >= 0) {

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

}
