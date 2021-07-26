import React from "react";
import * as d3 from "d3";
import { findMax, findMin } from "../utils/math";

export interface Point {
  x: number;
  y: number;
}
interface RGB {
  r: number;
  g: number;
  b: number;
}
interface D3PriceChartProps {
  width: number;
  height: number;
  data: Point[];
}
class D3PriceChart {
  containerEl;
  props;
  svg;

  constructor(containerEl: any, props: D3PriceChartProps) {
    this.containerEl = containerEl;
    this.props = props;

    const xData = props.data.map((d) => d.x);
    const yData = props.data.map((d) => d.y);

    this.svg = d3
      .select(containerEl)
      .append("svg")
      .attr("width", props.width)
      .attr("height", props.height);

    this.createLinearGradient("blue-gradient", { r: 38, g: 108, b: 221 });

    // add x axis
    var x = d3
      .scaleTime()
      .domain([findMin(xData), findMax(xData)])
      .range([0, props.width]);
    this.svg
      .append("g")
      .attr("transform", "translate(0," + (props.height - 20) + ")")
      .attr("color", "#666")
      .call(d3.axisBottom(x));

    // add y axis
    var y = d3
      .scaleLinear()
      .domain([0, findMax(yData) * 1.25])
      .range([props.height, 0]);
    this.svg.append("g").attr("color", "transparent").call(d3.axisLeft(y));

    var bisect = d3.bisector(function (d: Point) {
      return d.x;
    }).left;

    var focus = this.svg
      .append("g")
      .append("circle")
      .style("fill", "none")
      .attr("stroke", "black")
      .attr("r", 8.5)
      .style("opacity", 0);

    var focusText = this.svg
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");

    const data = props.data as any;

    this.svg
      .append("path")
      .datum(data)
      .attr("fill", "transparent")
      .attr("stroke", "rgb(38, 108, 221)")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d: any) {
            return x(d.x);
          })
          .y(function (d: any) {
            return y(d.y);
          })
      );
    this.svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#blue-gradient)")
      // .attr("stroke", "rgb(38, 108, 221)")
      // .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .area()
          .x(function (d: any) {
            return x(d.x);
          })
          .y0(y(0))
          .y1(function (d: any) {
            return y(d.y);
          })
      );
  }

  createLinearGradient(id: string, { r, g, b }: RGB) {
    var lg = this.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", id)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    lg.append("stop")
      .attr("offset", "0%")
      .style("stop-color", `rgb(${r}, ${g}, ${b}, 1)`)
      .style("stop-opacity", 1);
    lg.append("stop")
      .attr("offset", "10%")
      .style("stop-color", `rgb(${r}, ${g}, ${b}, 0.5)`)
      .style("stop-opacity", 1);
    lg.append("stop")
      .attr("offset", "25%")
      .style("stop-color", `rgb(${r}, ${g}, ${b}, 0.3)`)
      .style("stop-opacity", 1);
    lg.append("stop")
      .attr("offset", "50%")
      .style("stop-color", `rgb(${r}, ${g}, ${b}, 0.15)`)
      .style("stop-opacity", 1);
    lg.append("stop")
      .attr("offset", "100%")
      .style("stop-color", `rgb(${r}, ${g}, ${b}, 0)`)
      .style("stop-opacity", 1);
  }
}

export default D3PriceChart;
