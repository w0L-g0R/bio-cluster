import {

    labelStyleInit,
    lineStyleInit,
    itemStyleInit
} from "../radial-tree-styles"

export class initOptions {

    object: any;
    constructor(data) {

        if (!Array.isArray(data)) {
            data = [data]
        }

        this.object = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',
                    data: data,
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
                    tooltip: {
                        formatter: '{b}'
                    },
                    symbolKeepAspect: false,
                    symbolSize: 9,
                    labelSize: 55,
                    initialTreeDepth: -1,
                    animationDurationUpdate: 500,
                    leaves: {
                        itemStyle: {
                            color: 'rgb(0, 128, 128)',
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10,
                            opacity: 1,
                        },
                        label: {
                            show: true,
                            color: 'rgba(0, 128, 128, 1)',
                            verticalAlign: "middle",
                            // align: "right",
                            // offset: [20, 0]
                        },
                    },
                    itemStyle: itemStyleInit,
                    lineStyle: lineStyleInit,
                    label: labelStyleInit,
                }
            ]
        }
    }

    setTreeDepth(value) {
        this.object.series[0].initialTreeDepth = value
    }

    setData(data) {
        this.object.series[0].data = data
    }
}