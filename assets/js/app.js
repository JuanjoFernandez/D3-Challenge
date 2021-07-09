// General chart parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to create the xScale
function xScale(healthData, chosenX) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenX]) * 0.8,
        d3.max(healthData, d => d[chosenX]) * 1.2])
        .range([0, width]);
    return xLinearScale
};

// Reading and parsing the csv
d3.csv("../assets/data/data.csv").then(function (healthData) {
    console.log(healthData)
    healthData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // X axis
    var xLinearScale = xScale(healthData, healthData.poverty);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
 
});
