var BarChart = (function (d3) {

	'use strict';

	/*
		var chartConfiguration = {
			"name": "TestChart",
			"width": window.innerWidth,
			"height": window.innerHeight,
			"margin": {"left": 60, "top": 100, "right": 60, "bottom": 100},
			"selector": "#barchart",
			"x" : {
				"orient": "bottom"
			},
			"y" : {
				"orient": "left"
			},
			"url": "data.json"
		};

		var chart =	new BarChart(chartConfiguration);
		chart.render();

	 */

	var self;
	var BarChart = function (chart) {
		self = this;
		self.name = chart.name;
		self.margin = chart.margin;
		self.width = chart.width;
		self.height = chart.height;
		self.selector = chart.selector;
		self.image = d3.select(chart.selector);
		self.setX = chart.x;
		self.setY = chart.y;
		self.url = chart.url;
	};

	BarChart.prototype.setImageWidth = function () {
		return self.width - self.margin.left - self.margin.right;
	};

	BarChart.prototype.setImageHeight = function () {
		return self.height - self.margin.top - self.margin.bottom;
	};

	BarChart.prototype.setDimensions = function () {
		self.image
			.append('svg')
			.attr('width', self.setImageWidth)
			.attr('height', self.setImageHeight)
			.append('g')
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
	};

	BarChart.prototype.setRange = function () {
		self.x = d3.scale.ordinal().rangeRoundBands([0, self.width], 0.1);
		self.y = d3.scale.linear().range([self.height, 0]);
		self.z = d3.scale.ordinal().range(["steelblue", "#aaa"]);
	};

	BarChart.prototype.setAxes = function() {
		self.xAxis = d3.svg.axis().scale(self.x).orient(self.setX.orient);
		self.yAxis = d3.svg.axis().scale(self.y).orient(self.setY.orient);
	};

	BarChart.prototype.readData = function() {
		d3.json(self.url, function (error, data) {
			self.data = data;
		});
	};

	BarChart.prototype.setDomain = function () {
		self.x.domain(self.data.map(function (d) { return d.parent }));
		self.y.domain([0, d3.max(self.data, function (d) { return d.frequency; })]);
	};

	BarChart.prototype.generateBar = function(bardata) {
		var bar = self.image
			.selectAll('g')
			.data(self.data)
			.enter()
			.append('g')
			.attr('transform', function (d, i) {
				return 'translate(' + self.x(d.parent) + ', 0)';
			});

			bar.append('class', 'enter');

			bar.append('rect')
				.attr('y', function (d) {
					return self.y(d.frequency);
				})
				.attr('x', function (d, i) {
					return self.x.rangeBand() + self.margin.left / 4;
				})
				.attr('height', function (d) {
					return height - y(d.frequency);
				})
				.attr('width', x.rangeBand());

			bar.append

			return bar;
	};

	BarChart.prototype.render = function () {
		self.readData();
		self.setRange();
		self.setDimensions();
		self.setAxes();

		$.when(self.readData()).then(function () {
			self.setDomain();
		});
	};

	return BarChart;

})(window.d3);