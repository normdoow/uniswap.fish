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
interface D3CorrelationChartProps {
  width: number;
  height: number;
  data: Point[];
  mostActivePrice: number;
  minRange: number;
  maxRange: number;
}
class D3CorrelationChart {
  containerEl;
  props;
  svg;
  x;
  y;
  xAxis;
  yAxis;
  mostActivePrice;
  minPrice;
  maxPrice;
  // brush;

  constructor(containerEl: any, props: D3CorrelationChartProps) {
    this.containerEl = containerEl;
    this.props = props;

    const xData = props.data.map((d) => d.x);
    const yData = props.data.map((d) => d.y);
    const data = props.data as any;

    this.svg = d3
      .select(containerEl)
      .append("svg")
      .attr("viewBox", `0 0 ${props.width} ${props.height}`);

    this.createLinearGradient("blue-gradient", { r: 38, g: 108, b: 221 });

    // add x axis
    const x = d3
      .scaleTime()
      .domain([findMin(xData), findMax(xData)])
      .range([0, props.width]);
    this.xAxis = this.svg
      .append("g")
      .attr("transform", "translate(0," + (props.height - 20) + ")")
      .attr("color", "#666")
      .call(d3.axisBottom(x));
    this.x = x;

    // add y axis
    const min = findMin(yData);
    const max = findMax(yData);
    const margin = max - min;
    const y = d3
      .scaleLinear()
      .domain([min - margin, max + margin / 1.5])
      .range([props.height, 0]);
    this.yAxis = this.svg
      .append("g")
      .attr("color", "transparent")
      .call(d3.axisLeft(y));
    this.y = y;

    // render chart
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
      .attr(
        "d",
        d3
          .area()
          .x(function (d: any) {
            return x(d.x);
          })
          .y0(props.height)
          .y1(function (d: any) {
            return y(d.y);
          })
      );

    this.handleMouseMove();
    this.mostActivePrice = this.renderMostActivePriceAssumption(
      props.mostActivePrice
    );

    const { minPriceSVG, maxPriceSVG } = this.renderMinMaxPriceRange(
      props.minRange,
      props.maxRange
    );
    this.minPrice = minPriceSVG;
    this.maxPrice = maxPriceSVG;
    // this.brush = this.initBrush(props.minRange, props.maxRange);
    // let offsetY: number = 0;
    // this.brush.call(
    //   d3
    //     .drag<SVGRectElement, unknown>()
    //     .on("start", (e: any) => {
    //       offsetY = this.y(props.maxRange) - e.y;
    //     })
    //     .on("drag", (e: any) => {
    //       this.brush.attr("y", e.y + offsetY);
    //     })
    // );
  }

  destroy() {
    this.svg.remove();
  }

  // initBrush(minRange: number, maxRange: number) {
  //   return this.svg
  //     .append("g")
  //     .append("rect")
  //     .style("fill", "rgba(37, 175, 96, 0.3)")
  //     .style("cursor", "grab")
  //     .attr("x", 0)
  //     .attr("y", this.y(maxRange))
  //     .attr("width", this.props.width)
  //     .attr("height", this.y(minRange) - this.y(maxRange));
  // }

  handleMouseMove() {
    const bisect = d3.bisector(function (d: Point) {
      return d.x;
    }).left;
    const focus = this.svg
      .append("g")
      .append("circle")
      .style("fill", "rgba(255,255,255,0.15)")
      .attr("stroke", "white")
      .attr("r", 5)
      .style("opacity", 0);
    const focusText = this.svg
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("fill", "white")
      .attr("font-size", "0.6rem")
      .attr("alignment-baseline", "middle");
    const verticalLine = this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1)
      .style("stroke", "rgba(255,255,255,0.15)");

    const onMouseMove = (e: any) => {
      let coords = d3.pointer(e);
      const x0 = this.x.invert(coords[0]);
      const i = bisect(this.props.data, x0, 1);
      const selectedData = this.props.data[i];
      verticalLine
        .attr("x1", this.x(selectedData.x))
        .attr("y1", 0)
        .attr("x2", this.x(selectedData.x))
        .attr("y2", this.props.height - 20);
      focus
        .attr("cx", this.x(selectedData.x))
        .attr("cy", this.y(selectedData.y));

      const self = this;
      if (this.x(selectedData.x) > this.props.width * 0.8) {
        focusText
          .html(`Price: ${selectedData.y.toFixed(4)}`)
          .attr("x", function (d: any) {
            return self.x(selectedData.x) - (this.getComputedTextLength() + 5);
          })
          .attr("text-anchor", "right")
          .attr("y", 5);
      } else {
        focusText
          .html(`Price: ${selectedData.y.toFixed(4)}`)
          .attr("x", this.x(selectedData.x) + 5)
          .attr("text-anchor", "left")
          .attr("y", 5);
      }
    };

    this.svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .on("mouseover", () => {
        focus.style("opacity", 1);
        focusText.style("opacity", 1);
        verticalLine.style("opacity", 1);
      })
      .on("mouseout", () => {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
        verticalLine.style("opacity", 0);
      })
      .on("mousemove", onMouseMove);
  }

  renderMostActivePriceAssumption(price: number) {
    return this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1.25)
      .style("stroke-dasharray", "10, 3")
      .style("stroke", "rgb(255, 112, 181)")
      .attr("x1", 0)
      .attr("y1", this.y(price))
      .attr("x2", this.props.width)
      .attr("y2", this.y(price));
  }
  updateMostActivePriceAssumption(price: number) {
    this.mostActivePrice
      .attr("x1", 0)
      .attr("y1", this.y(price))
      .attr("x2", this.props.width)
      .attr("y2", this.y(price));
  }

  renderMinMaxPriceRange(minPrice: number, maxPrice: number) {
    const minPriceSVG = this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1.25)
      .style("stroke-dasharray", "10, 3")
      .style("stroke", "rgba(37, 175, 96, 1)")
      .attr("x1", 0)
      .attr("y1", this.y(minPrice))
      .attr("x2", this.props.width)
      .attr("y2", this.y(minPrice));

    const maxPriceSVG = this.svg
      .append("g")
      .append("line")
      .style("stroke-width", 1.25)
      .style("stroke-dasharray", "10, 3")
      .style("stroke", "rgba(37, 175, 96, 1)")
      .attr("x1", 0)
      .attr("y1", this.y(maxPrice))
      .attr("x2", this.props.width)
      .attr("y2", this.y(maxPrice));

    return { minPriceSVG, maxPriceSVG };
  }
  updateMinMaxPriceRange(
    minPrice: number,
    maxPrice: number,
    isFullRange: boolean
  ) {
    this.minPrice.attr("opacity", !isFullRange ? 1 : 0.4);
    this.maxPrice.attr("opacity", !isFullRange ? 1 : 0.4);

    this.minPrice
      .attr("x1", 0)
      .attr("y1", this.y(minPrice))
      .attr("x2", this.props.width)
      .attr("y2", this.y(minPrice));

    this.maxPrice
      .attr("x1", 0)
      .attr("y1", this.y(maxPrice))
      .attr("x2", this.props.width)
      .attr("y2", this.y(maxPrice));
  }

  createLinearGradient(id: string, { r, g, b }: RGB) {
    const lg = this.svg
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

export default D3CorrelationChart;
