var container = document.getElementById('main');
var chart = echarts.init(container);

var data = {
    name: "node 1",
    children: [{
        name: "node 1.1",
        children: [{
            name: "node 1.1.1",
            children: [{
                name: "node 1.1.1.1",
                value: 721
            }]
        },
        {
            name: "node 1.1.2",
            children: [{
                name: "node 1.1.2.1",
                value: 727,
                children: [{
                    name: "node 1.1.2.1.1",
                    children: [{
                        name: "node 1.1.2.1.1.1",
                        value: 727
                    }]
                }, {
                    name: "node 1.1.2.1.2",
                    children: [{
                        name: "node 1.1.2.1.2.1",
                        value: 727
                    }]
                }]
            }]
        },
        {
            name: "node 1.1.3",
            children: [{
                name: "node 1.1.3.1",
                value: 725
            }]
        }]
    }]
};

var option = {
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    series: [{
        type: 'tree',
        id: 0,
        name: 'tree1',
        data: [data],
        top: '10%',
        left: '8%',
        bottom: '22%',
        right: '20%',
        symbolSize: 7,
        edgeShape: 'curve',
        edgeForkPosition: '10%',
        initialTreeDepth: 5,
        lineStyle: {
            width: 3,
            curveness: 0.3
        },
        label: {
            backgroundColor: '#fff',
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            borderColor: 'red',
            borderWidth: 1,
            borderRadius: 10,
            padding: 10
        },
        leaves: {
            label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
            }
        },
        expandAndCollapse: true,
        animation: false,
    }]
};

chart.setOption(option);

var hoverStyle = { lineStyle: { color: 'black' } };

// Traverse each node in tree
function traverse(node, callback) {
    if (node.children) {
        callback(node);
        node.children.forEach(subNode => traverse(subNode, callback))
    } else {
        callback(node)
    }
}

// Traverse from target node
function traverseFrom(opts) {

    var defaults = { tree: data, nodeName: null, callback: null, skipStartNode: false };

    Object.assign(defaults, opts);

    var targetNode = null;

    // Find node for start paint
    traverse(defaults.tree, node => {
        if (node.name === defaults.nodeName) {
            targetNode = node;
        }
    });

    // Find all children of found node
    traverse(targetNode, node => {
        if (defaults.skipStartNode && node.name === defaults.nodeName) {
            // Skip first because it is start branch
        } else {
            defaults.callback(node)
        }
    });
}

// Build new config with painted nodes
function buildSeriesConfig(nodes, style) {
    var seriesConfig = echarts.util.clone(data);
    var nodes = [...nodes].flat();

    traverse(seriesConfig, node => {
        if (nodes.includes(node.name)) {
            Object.assign(node, style);
        }
    });
    return seriesConfig
};

// General paint function
function paintBranch(chartInstance, nodeName) {
    var nodesForPaint = [];
    var newSeries = null;
    var mainOption = null;

    traverseFrom({
        nodeName: nodeName,
        callback: node => nodesForPaint.push(node.name),
        skipStartNode: true
    });

    if (nodesForPaint) {
        newSeries = buildSeriesConfig(nodesForPaint, hoverStyle)
    } else {
        throw 'Nodes for paint is not exists'
    }

    if (newSeries) {
        chartInstance.setOption({
            series: [{ type: 'tree', id: '0', data: [newSeries] }]
        }, false);
    } else {
        throw 'New series config is not builded'
    }
};

function isNodeSelected(tree, nodeName) {
    var status = false;
    traverseFrom({
        tree: tree,
        nodeName: nodeName,
        callback: node => {
            if (node.hasOwnProperty('lineStyle')) status = true;
        },
        skipStartNode: true
    })
    return status
}

function cleanTree(chartInstance) {
    var clonedData = echarts.util.clone(data);
    chartInstance.setOption({
        series: [{ type: 'tree', id: '0', data: [clonedData] }]
    }, false);
};

chart.on('click', (e) => {
    var chartTree = chart.getOption().series[0].data[0];
    var nodeSelected = isNodeSelected(chartTree, e.name);

    if (nodeSelected) {
        cleanTree(chart)
    } else {
        paintBranch(chart, e.name)
    }

});