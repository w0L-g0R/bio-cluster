import { itemStyleInit, labelStyleInit, lineStyleInit } from './radial-tree-styles'


////////////////////////////////////////////////////////////////////////////////
export function paintBranch(node, showLabel, style?) {

    // console.log("~ style", style)
    switch (style) {
        case ("init"):

            node["lineStyle"] = lineStyleInit
            node["itemStyle"] = itemStyleInit
            let label = labelStyleInit
            label["show"] = showLabel
            node["label"] = label
            break

        case ("red"):

            node["lineStyle"] = { color: "red", width: 5 }
            node["itemStyle"] = {
                color: 'rgb(0, 128, 128)',
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10,
                opacity: 1,
            }
            node["label"] = {
                show: showLabel,
                color: 'red',
                verticalAlign: "middle",
                shadowBlur: 10,
                // offset: [0, 40]
            }
            break

    }
}

////////////////////////////////////////////////////////////////////////////////

export function toggleLabel(node) {

    if (node) {
        let value = node["label"]

        if (value == undefined) {
            node["label"] = {
                show: false,
                color: 'rgb(0, 10, 128)',
                verticalAlign: "middle",
                // offset: [0, 40]
            }
        } else {

            node["label"] = {
                show: !value,
                color: 'rgb(0, 10, 128)',
                verticalAlign: "middle",
                // offset: [0, 40]
            }
        }

    }

}

////////////////////////////////////////////////////////////////////////////////

export function turnLabelRedAndBold(node) {
    node["label"] = {
        show: true,
        color: 'red',
        verticalAlign: "middle",
        // offset: [0, 40]
    }
}
