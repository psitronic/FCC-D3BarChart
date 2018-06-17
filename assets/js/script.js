'use strict'
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var dataset;

d3.json(url, (error, data) => {

	dataset = data.data;

	const parseTime = d3.timeParse("%Y-%m-%d");

	dataset.forEach( (element, index) => {
		element[0] = parseTime(element[0]);
		element[1] = parseFloat(element[1]);
	});

	// console.log(dataset);


	const w = 1000;
	const h = 500;
	const padding = 50;

	const xScale = d3.scaleTime()
					.domain([
							d3.min(dataset, (d) => d[0]),
							d3.max(dataset, (d) => d[0])
						])
					.range([padding, w - padding]);

    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[1])])
                    .range([h - padding, padding]);


	const svg = d3.select("body")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	svg.append("g")
		.attr("id", "x-axis")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + (h - padding) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("id", "y-axis")
		.attr("class", "axis")
		.attr("transform", "translate( " + (padding) + ",0)")
		.call(yAxis);

	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("fill", "blue")
		.attr("class", "bar")
		.attr("x", (d) => xScale(d[0]))
		.attr("y", (d) => yScale(d[1]))
		.attr("width", 2)
		.attr("height", (d) => d[1] )
		.append("title")
		.text((d) => d[1]);

});


