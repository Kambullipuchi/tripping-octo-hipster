(function (d3, BarChart) {

	'use strict';

	$(document).ready(function() {



		var margin = {
	        top: 20,
	        right: 30,
	        bottom: 30,
	        left: 40
	    };
		var width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
		var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
		var y = d3.scale.linear().range([
		    height,
		    0
		]);
		var z = d3.scale.ordinal().range(["steelblue", "#aaa"]);
		var chart = d3.select('body').append('svg').attr('width', width + 2 * margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var xAxis = d3.svg.axis().scale(x).orient('bottom');
		var yAxis = d3.svg.axis().scale(y).orient('left');

		d3.json('data.json', function (error, data) {
			x.domain(data.map(function(d){ return d.parent; }));

		    y.domain([
		        0,
		        d3.max(data, function (d) {
		            return d.frequency;
		        })
		    ]);
		    console.log(data.length);
		    var barWidth = width / data.length;
		    var bar = chart.selectAll('g').data(data).enter().append('g').attr('transform', function (d, i) {
		        return 'translate(' + x(d.parent) + ', 0)';
		    });
		    bar.attr("class", "enter");
		    bar.append('rect').attr('y', function (d) {
		        return y(d.frequency);
		    }).attr('x', function (d, i) {
		    	return x.rangeBand() + margin.left / 4;
		    })
		    .attr('height', function (d) {
		        return height - y(d.frequency);
		    }).attr('width', x.rangeBand());
		    bar.append('text').attr('x', x.rangeBand() + margin.left).attr('y', function (d) {
		        return y(d.frequency) - 10;
		    }).attr('dy', '.75em').text(function (d) {
		        return d.parent;
		    });

		    bar.on('click', down);

		    chart.append('g')
		    	.attr('class', 'x axis')
		    	.attr('transform', 'translate(' + margin.left + ',' + height + ')')
		    	.call(xAxis);

		    chart.append('g')
		    	.attr('class', 'y axis')
		    	.attr('transform', 'translate(' + margin.left + ', 0)')
		    	.call(yAxis)
		    	.append('text')
		    	.attr('transform', 'rotate(-90)')
		    	.attr('y', 6)
		    	.attr('dy', '.71em')
		    	.style('text-anchor', 'end')
		    	.text('Frequency');
		});

		function down (d, i) {
			console.log("UP");

			if (!d.parent || this.__transition__) return;
			var duration = d3.event && d3.event.altKey ? 7500 : 750,
			      delay = duration / d.children.length;

			var exit = chart.selectAll(".enter")
				.attr("class", "exit");

			exit.selectAll("rect")
				.filter(function(p) {
					return p === d;
				})
				.style("fill-opacity", 1e-6);

			var enter = createBar(d)
				.attr('transform', function (d, i) {
		        	return 'translate(' + x(d.parent) + ', 0)';
		    	});


  			x.domain(d.children.map(function(dx){ return dx.parent; }));

			chart.selectAll(".y.axis").transition()
		      .duration(duration * 2)
		      .call(yAxis);

			var exitTransition = exit.transition()
			      .duration(duration)
			      .style("opacity", 1e-6)
			      .remove();

			  // Transition exiting bars to the new x-scale.
			  exitTransition.selectAll("rect").attr("height", function(d) { return y(d.frequency); });

			  chart.select(".background").data([d]).transition().duration(duration * 2);
			  d.index = i;
		}

		function stack(i) {
		  var y0 = 0;
		  return function(d) {
		    var ty = "translate(" + x * i * 0 + "," + y0 + ")";
		    // y0 += y(d.frequency);
		    return ty;
		  };
		}

		function createBar (d) {

			var bar = chart.insert('g', '.x.axis')
				.attr('class', 'enter')
				.attr('transform', 'translate(0, 5)')
				.selectAll('g')
				.data(d.children)
				.enter().append('g')
				.on('click', down);

			bar.append('rect')
				.attr('y', function (d) {
		        	return y(d.frequency);
		    	}).attr('x', function (d, i) {
		    		return x.rangeBand() + margin.left / 4;
		    	})
		    	.attr('height', function (d) {
		        	return height - y(d.frequency);
		    	}).attr('width', x.rangeBand());

		    bar.append('text').attr('x', x.rangeBand() + margin.left).attr('y', function (d) {
		        return y(d.frequency) - 10;
		    }).attr('dy', '.75em').text(function (d) {
		        return d.parent;
		    });

		    return bar;
		};

	});



})(window.d3, window.BarChart);