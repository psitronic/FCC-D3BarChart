'use strict'
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url, (error, data) => {

	const w = 1000;
	const h = 600;
	const padding = 100;
	const barWidth = 4;
	const parseTime = d3.timeParse("%Y-%m-%d");

	let dataset = data.data;
	let parsedData = dataset.map((d) => {
		return {
			date: parseTime(d[0]),
			GDP: parseFloat(d[1])
		}
	});
	let minDate = d3.min(parsedData, (d) => d.date);
	let maxDate = d3.max(parsedData, (d) => d.date);
	let maxGDP = d3.max(parsedData, (d) => d.GDP);

	var xScale = d3.scaleTime()
					.domain([minDate, maxDate])
					.range([padding, w - padding]);

    var yScale = d3.scaleLinear()
                    .domain([0, maxGDP])
                    .range([h - padding, padding]);


	var div = d3.select("body").append("div")	
		.attr("class", "tooltip")
		.attr("id", "tooltip")				
		.style("opacity", 0);

	var svg = d3.select("body")
		.append("svg")
		.attr("class", "container")
		.attr("width", w)
		.attr("height", h);

	var xAxis = d3.axisBottom(xScale);
	var yAxis = d3.axisLeft(yScale);

	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", - h/2 - padding)
		.attr("y", 30)
		.text("GDP [Million USD]")
		.attr("class", "axisTitle");

	svg.append("text")
		.attr("x", (w- padding)/2)
		.attr("y", h + 50 - padding)
		.text("Time [Year]")
		.attr("class", "axisTitle");

	svg.append("text")
		.attr("x", (w)/2  - padding)
		.attr("y", padding)
		.text("United States GDP")
		.attr("class", "title");

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
		.data(parsedData)
		.enter()
		.append("rect")
		.attr("fill", "steelblue")
		.attr("class", "bar")
		.attr("data-date", (d, i) => dataset[i][0])
		.attr("data-gdp", (d) => d.GDP)
		.attr("x", (d) => xScale(d.date))
		.attr("y", (d) => yScale(d.GDP))
		.attr("width", barWidth)
		.attr("height", (d) => h - padding - yScale(d.GDP) )
        .on("mouseover", function(d, i) {

            div.transition()		
                .duration(100)		
                .style("opacity", .9);		
            div	.html(d.date.getFullYear() + " Q" + Math.floor((d.date.getMonth() / 3) + 1) + "<br />" + "$" + d.GDP + " Million")	
            	.attr('data-date', dataset[i][0])
				.style("left", (d3.event.pageX + 50) + "px")
				.style("top", (250) + "px");	
            })					

        .on("mouseout", function(d) {		
            div.transition()		
                .duration(750)		
                .style("opacity", 0);
            });
});


