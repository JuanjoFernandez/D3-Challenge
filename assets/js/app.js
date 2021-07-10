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

// Function to create xScale
function xScale(healthData, chosenX) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenX]) * 0.9,
        d3.max(healthData, d => d[chosenX])*1.05])
        .range([0, width]);
    return xLinearScale;
};

// Function to create yScale
function yScale(healthData, chosenY) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenY]) * 0.8,
        d3.max(healthData, d => d[chosenY]) * 1.05])
        .range([height, 0]);
    return yLinearScale;
};

// Reading and parsing the csv
d3.csv("assets/data/data.csv").then(function (healthData) {
    healthData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // X axis
    var xLinearScale = xScale(healthData, "poverty");
    var bottomAxis = d3.axisBottom(xLinearScale);
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Y axis
    var yLinearScale = yScale(healthData, "healthcare");
    var leftAxis = d3.axisLeft(yLinearScale);
    var yAxis = chartGroup.append("g")
        // .classed("y-axis", true)
        // .attr("transform", `translate(${width}, 0)`)
        .call(leftAxis)

    // Scatter points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "red")
        .attr("opacity", "1");

    // Points labels
    var circlesLabels = chartGroup.selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 8)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("fill", "white")
        .text(d => d.abbr);

    //     svg.append("g")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", 10)
    //   .selectAll("text")
    //   .data(data)
    //   .join("text")
    //     .attr("dy", "0.35em")
    //     .attr("x", d => x(d.x) + 7)
    //     .attr("y", d => y(d.y))
    //     .text(d => d.name);

});
