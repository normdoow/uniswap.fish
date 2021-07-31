import React from "react";
import * as d3 from "d3";
import { findMax, findMin } from "../utils/math";

export interface Bin {
  x0: number;
  x1: number;
  y: number;
}
interface RGB {
  r: number;
  g: number;
  b: number;
}
interface D3LiquidityHistogramProps {
  width: number;
  height: number;
  data: Bin[];
  currentTick: number;
  minTick: number;
  maxTick: number;
}
class D3LiquidityHistogram {
  containerEl;
  props;
  svg;
  x;
  y;
  xAxis;
  yAxis;
  currentTick;
  minTick;
  maxTick;

  constructor(containerEl: any, props: D3LiquidityHistogramProps) {
    this.containerEl = containerEl;
    this.props = props;

    this.svg = d3
      .select(containerEl)
      .append("svg")
      .attr("width", props.width)
      .attr("height", props.height);

    // add x axis
    const x = d3
      .scaleLinear()
      .domain([props.currentTick - 7500, this.props.currentTick + 7500])
      .range([0, props.width]);
    this.xAxis = this.svg
      .append("g")
      .attr("transform", "translate(0," + (props.height - 20) + ")")
      .attr("color", "#666")
      .call(d3.axisBottom(x));
    this.x = x;

    // add y axis
    const y = d3
      .scaleLinear()
      .domain([0, findMax(this.props.data.map((d) => d.y)) * 1.25])
      .range([props.height, 0]);
    this.yAxis = this.svg
      .append("g")
      .attr("color", "transparent")
      .call(d3.axisLeft(y));
    this.y = y;

    this.svg
      .selectAll("rect")
      .data(this.props.data)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return "translate(" + x(d.x0) + "," + (y(d.y) - 20) + ")";
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return props.height - y(d.y);
      })
      .style("fill", "rgb(38, 108, 221)");

    // this.handleMouseMove();
    this.currentTick = this.renderCurrentTick(this.props.currentTick);

    const { minTickSVG, maxTickSVG } = this.renderMinMaxTickRange(
      props.minTick,
      props.maxTick
    );
    this.minTick = minTickSVG;
    this.maxTick = maxTickSVG;
  }

  destroy() {
    this.svg.remove();
  }

  renderMinMaxTickRange(minTick: number, maxTick: number) {
    const minTickSVG = this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1.25)
      .style("stroke-dasharray", "10, 3")
      .style("stroke", "rgba(37, 175, 96, 1)")
      .attr("y1", 0)
      .attr("x1", this.x(minTick))
      .attr("y2", this.props.height - 20)
      .attr("x2", this.x(minTick));

    const maxTickSVG = this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1.25)
      .style("stroke-dasharray", "10, 3")
      .style("stroke", "rgba(37, 175, 96, 1)")
      .attr("y1", 0)
      .attr("x1", this.x(maxTick))
      .attr("y2", this.props.height - 20)
      .attr("x2", this.x(maxTick));

    return { minTickSVG, maxTickSVG };
  }
  updateMinMaxTickRange(minTick: number, maxTick: number) {
    this.minTick
      .attr("y1", 0)
      .attr("x1", this.x(minTick))
      .attr("y2", this.props.height - 20)
      .attr("x2", this.x(minTick));

    this.maxTick
      .attr("y1", 0)
      .attr("x1", this.x(maxTick))
      .attr("y2", this.props.height - 20)
      .attr("x2", this.x(maxTick));
  }

  renderCurrentTick(currentTick: number) {
    return this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1.25)
      .style("stroke-dasharray", "10, 3")
      .style("stroke", "rgb(255, 112, 181)")
      .attr("x1", this.x(currentTick))
      .attr("y1", 0)
      .attr("x2", this.x(currentTick))
      .attr("y2", this.props.height - 20);
  }
  updateCurrentTick(currentTick: number) {
    this.currentTick
      .attr("x1", this.x(currentTick))
      .attr("y1", 0)
      .attr("x2", this.x(currentTick))
      .attr("y2", this.props.height - 20);
  }

  // handleMouseMove() {
  //   const bisect = d3.bisector(function (d: Point) {
  //     return d.x;
  //   }).left;
  //   const focus = this.svg
  //     .append("g")
  //     .append("circle")
  //     .style("fill", "rgba(255,255,255,0.15)")
  //     .attr("stroke", "white")
  //     .attr("r", 5)
  //     .style("opacity", 0);
  //   const focusText = this.svg
  //     .append("g")
  //     .append("text")
  //     .style("opacity", 0)
  //     .attr("fill", "white")
  //     .attr("font-size", "0.6rem")
  //     .attr("alignment-baseline", "middle");
  //   const verticalLine = this.svg
  //     .append("g")
  //     .append("line")
  //     .style("stroke-width", 1)
  //     .style("stroke", "rgba(255,255,255,0.15)");

  //   const onMouseMove = (e: any) => {
  //     let coords = d3.pointer(e);
  //     const x0 = this.x.invert(coords[0]);
  //     const i = bisect(this.data0, x0, 1);
  //     const selectedData = this.data0[i];
  //     verticalLine
  //       .attr("x1", this.x(selectedData.x))
  //       .attr("y1", 0)
  //       .attr("x2", this.x(selectedData.x))
  //       .attr("y2", this.props.height - 20);
  //     focus
  //       .attr("cx", this.x(selectedData.x))
  //       .attr("cy", this.y(selectedData.y));

  //     const self = this;
  //     if (this.x(selectedData.x) > this.props.width * 0.8) {
  //       focusText
  //         .html(`Price: ${selectedData.y.toFixed(4)}`)
  //         .attr("x", function (d: any) {
  //           return self.x(selectedData.x) - (this.getComputedTextLength() + 5);
  //         })
  //         .attr("text-anchor", "right")
  //         .attr("y", 5);
  //     } else {
  //       focusText
  //         .html(`Price: ${selectedData.y.toFixed(4)}`)
  //         .attr("x", this.x(selectedData.x) + 5)
  //         .attr("text-anchor", "left")
  //         .attr("y", 5);
  //     }
  //   };

  //   this.svg
  //     .append("rect")
  //     .style("fill", "none")
  //     .style("pointer-events", "all")
  //     .attr("width", this.props.width)
  //     .attr("height", this.props.height)
  //     .on("mouseover", () => {
  //       focus.style("opacity", 1);
  //       focusText.style("opacity", 1);
  //       verticalLine.style("opacity", 1);
  //     })
  //     .on("mouseout", () => {
  //       focus.style("opacity", 0);
  //       focusText.style("opacity", 0);
  //       verticalLine.style("opacity", 0);
  //     })
  //     .on("mousemove", onMouseMove);
  // }
}

export default D3LiquidityHistogram;
