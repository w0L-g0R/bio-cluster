import {
    labelStyleDefault,
    lineStyleDefault,
    itemStyleDefault,

} from "../radial-tree-styles"

export class defaultOptions {

    object: any;
    constructor(data) {
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
                    symbolKeepAspect: true,
                    symbolSize: 6,
                    labelSize: 55,
                    initialTreeDepth: 5,
                    animationDurationUpdate: 750,
                    leaves: {
                        itemStyle: {
                            color: 'rgb(128, 128, 0)',
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10,
                            opacity: 1,
                        },
                        label: {
                            show: true,
                            color: 'rgb(0, 128, 0)',
                            // verticalAlign: "middle",
                            // offset: [0, 10]
                        },
                    },
                    itemStyle: itemStyleDefault,
                    lineStyle: lineStyleDefault,
                    label: labelStyleDefault,
                }
            ]
        }
    }
}
