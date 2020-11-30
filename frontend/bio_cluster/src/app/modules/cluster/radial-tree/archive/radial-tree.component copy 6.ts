import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WkoDataService } from 'app/data/services/wko-data.service';
import { NgxEchartsConfig } from 'ngx-echarts/lib/ngx-echarts.directive';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import 'lodash';
import { not } from '@angular/compiler/src/output/output_ast';
import { keyBy } from 'lodash';
// import * as _ from 'lodash';
declare var _: any;
import { defaultOptions, initOptions } from "./options"
import { labelStyleInitRoot, lineStyleInitRoot, itemStyleInitRoot } from "./styles"
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

  defaultOptions: any;
  initOptions: any;
  match: boolean;
  pathToLeaf: any = []

  constructor(private backendService: WkoDataService) { }

  ngOnInit(): void {

    // Fetch tree data from service
    this.dataSub = this.backendService.getTreeWKObusiness$().pipe(
      tap(data => this.data = [data]),
      tap(data => {
        this.defaultOptions = new defaultOptions([data])
        this.initOptions = new initOptions([data])
      })
      // tap(() => this.addNodeStyles(this.data))
    ).subscribe(() => this.setOptions("default"))
  }

  setOptions(options: any, data?: any) {


    if (options == "default") {
      // this.defaultOptions.object.series["data"] = this.data
      this.options = this.defaultOptions.object

      // this.merge = this.options
    } else if (options == "init") {
      this.data[0]["itemStyle"] = itemStyleInitRoot
      this.data[0]["labelStyle"] = labelStyleInitRoot
      this.data[0]["lineStyle"] = lineStyleInitRoot

      console.log("~  ---------------------------")
      console.log("~ this.data[0]", this.data[0])
      console.log("~  ---------------------------")

      // Trigger chart update
      this.options = this.initOptions.object

    }


    //NOTE: Move this to backend operation with pandas
    this.setParentRecursive(this.data, "parent", this.data[0])

    // setPropsRecursive(data: any, searchValue: any, searchProp: any, newValue: any, newProp: any)

    this.setPropsRecursive(this.data, "Handel mit Holz", "name", { color: "black", width: 5 }, "lineStyle", [], [])


    this.options = this.defaultOptions.object

    console.log("~  -----------------------------")
    console.log("~ this.options ", this.options)
    console.log("~  -----------------------------")

    console.log("~  -----------------------------")
    console.log("~ this.data ", this.data)
    console.log("~  -----------------------------")
  }


  onChartInit(ec) {
    // Get access to chartobject
    this.chart = ec;
    // this.options = this.setOptions("default")
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
  }

  // Traverse each node in tree
  // Traverse each node in tree
  traverseParents(node, callback) {
    // console.log("~  -----------")
    // console.log("~ node", node)
    // console.log("~  -----------")

    if (node !== undefined) {
      if (node.parent) {
        callback(node);
        this.traverseParents(node["parent"], callback)
        // node.parent.forEach(subNode => this.traverse(subNode, callback))
      } else {
        // callback(node)
        // console.log("NODE", node)
      }
    }
  }






  traversePath(data: any, path: any, pathProp: any, callback: any) {

    // depth -= 1

    //Declare using class, useful for buil a RegExp from a variable
    if (data != undefined) {

      // Iter over key-value pairs (Nodes) at the given branch (Data)
      for (var i = 0; i < data.length; i++) {

        // Get the value of the searchProp
        let foundPath = data[i][pathProp]
        console.log("~  ---------------------")
        console.log("~ foundPath", foundPath)
        console.log("~  ---------------------")

        console.log("~  -----------------")
        console.log("~ path[0]", path[0])
        console.log("~  -----------------")

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

  paintBranch(node) {

    node["lineStyle"] = { color: "red", width: 5 }

  }

  setPropsRecursive(data: any, searchValue: any, searchProp: any, newValue: any, newProp: any, pathVisited, path) {

    if (this.match == true || data == undefined) {

      return false
      // Base casee
    } else {

      // Iter over key-value pairs (Nodes) at the given branch (Data)
      for (let i = 0; i < data.length; i++) {

        // console.log("~ data[i]", data[i].name)

        // if (!pathVisited.includes(data[i].name)) {
        //   pathVisited[data[i].name] = true
        //   path.push(data[i])
        // }


        // Get the value of the searchProp
        let foundValue = data[i][searchProp]

        data[i][newProp] = newValue


        // See if the found value matches the searching value
        if (foundValue == searchValue) {

          this.match = true

          // let matchingNode = data[i]
          this.traverseParents(data[i], node => this.pathToLeaf.push(node.name))
          this.pathToLeaf = this.pathToLeaf.reverse()

          this.traversePath(this.data, this.pathToLeaf, "name", node => {
            this.paintBranch(node)
          })

          console.log("~  -----------------")
          console.log("~ data[i]", data[i])
          console.log("~ this.pathToLeaf", this.pathToLeaf)

          console.log("~  -----------------")

          // pathObjects.push(data[i])
          console.log("MATCH", data[i][searchProp])
          break

        }
        else {

          // Difference to setPropRecursive: Assign newValue is the current node
          this.setPropsRecursive(data[i]["children"], searchValue, searchProp, newValue, newProp, pathVisited, path);
        }
      }

    }

  }

  setParentRecursive(data: any, newProp: any, newValue: any) {

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
        this.setParentRecursive(data[i]["children"], newProp, data[i]);
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

  setPathtoRoot() {

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
    // this.setOptions()
  }




  // Build new config with painted nodes
  // buildSeriesConfig(nodes, style) {
  //   let seriesConfig = { ...this.data }
  //   console.log("~  ---------------------------")
  //   console.log("~ seriesConfig", seriesConfig)
  //   console.log("~  ---------------------------")

  //   // var seriesConfig = echarts.util.clone(data);
  //   var nodes: any = { ...nodes }.flat();

  //   this.traverse(seriesConfig, node => {
  //     if (nodes.includes(node.name)) {
  //       Object.assign(node, style);
  //     }
  //   });
  //   return seriesConfig
  // };


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




}
