
var svg = d3.select("body")
            .append("svg")
            .attr("width", 300)
            .attr("height", 300)

var rectangle = svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 300)
                    .attr("height", 300)
                    .style("fill", "blue");
