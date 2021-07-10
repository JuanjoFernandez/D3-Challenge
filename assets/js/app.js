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

// X-axis labels
var xLabels = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

var povertyLabel = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

var ageLabel = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

var ageLabel = xLabels.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Household Income (Median)");

// Y-axis labels
var yLabels = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

var obeseLabel = yLabels.append("text")
    .attr("y", -25)
    .attr("x", - height / 2)
    .attr("value", "obesity")// value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

var smokeLabel = yLabels.append("text")
    .attr("y", -45)
    .attr("x", - height / 2)
    .attr("value", "smokes")// value to grab for event listener
    .classed("active", true)
    .text("Smokes (%)");

var smokeLabel = yLabels.append("text")
    .attr("y", -65)
    .attr("x", - height / 2)
    .attr("value", "healthcare")// value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");


// Function to create xScale
function xScale(healthData, chosenX) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenX]) * 0.9,
        d3.max(healthData, d => d[chosenX]) * 1.05])
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


});
