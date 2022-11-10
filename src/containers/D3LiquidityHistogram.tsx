import * as d3 from "d3";
import { findMax } from "../utils/math";
import { getPriceFromTick } from "../utils/uniswapv3/math";

export interface Bin {
  x0: number;
  x1: number;
  y: number;
}
interface D3LiquidityHistogramProps {
  width: number;
  height: number;
  data: Bin[];
  currentTick: number;
  minTick: number;
  maxTick: number;
  token0Symbol: string;
  token1Symbol: string;
  token0Decimal: string;
  token1Decimal: string;
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
  token0Symbol;
  token1Symbol;

  constructor(containerEl: any, props: D3LiquidityHistogramProps) {
    this.containerEl = containerEl;
    this.props = props;
    this.token0Symbol = props.token0Symbol;
    this.token1Symbol = props.token1Symbol;

    this.svg = d3
      .select(containerEl)
      .append("svg")
      .attr("viewBox", `0 0 ${props.width} ${props.height}`);

    // add x axis
    const x = d3
      .scaleLinear()
      .domain([props.minTick, this.props.maxTick])
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

    this.handleMouseMove();
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
  updateMinMaxTickRange(
    minTick: number,
    maxTick: number,
    isFullRange: boolean
  ) {
    this.minTick.attr("opacity", !isFullRange ? 1 : 0.4);
    this.maxTick.attr("opacity", !isFullRange ? 1 : 0.4);

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

  handleMouseMove() {
    const focusTextToken0 = this.svg
      .append("g")
      .append("text")
      .style("opacity", 0)
      .attr("fill", "white")
      .attr("font-size", "0.6rem")
      .attr("alignment-baseline", "middle");
    const focusTextToken1 = this.svg
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
      .style("stroke", "rgba(255,255,255,0.25)");

    const onMouseMove = (e: any) => {
      let coords = d3.pointer(e);
      const x0 = this.x.invert(coords[0]);
      verticalLine
        .attr("x1", this.x(x0))
        .attr("y1", 0)
        .attr("x2", this.x(x0))
        .attr("y2", this.props.height - 20);

      const self = this;
      if (this.x(x0) > this.props.width * 0.8) {
        focusTextToken0
          .html(
            `${this.token0Symbol}: ${getPriceFromTick(
              x0,
              this.props.token0Decimal,
              this.props.token1Decimal
            ).toFixed(6)} ${this.token1Symbol}`
          )
          .attr("x", function (d: any) {
            return self.x(x0) - (this.getComputedTextLength() + 5);
          })
          .attr("text-anchor", "right")
          .attr("y", 5);
        focusTextToken1
          .html(
            `${this.token1Symbol}: ${(
              1 /
              getPriceFromTick(
                x0,
                this.props.token0Decimal,
                this.props.token1Decimal
              )
            ).toFixed(6)} ${this.token0Symbol}`
          )
          .attr("x", function (d: any) {
            return self.x(x0) - (this.getComputedTextLength() + 5);
          })
          .attr("text-anchor", "right")
          .attr("y", 20);
      } else {
        focusTextToken0
          .html(
            `${this.token0Symbol}: ${getPriceFromTick(
              x0,
              this.props.token0Decimal,
              this.props.token1Decimal
            )} ${this.token1Symbol}`
          )
          .attr("x", this.x(x0) + 5)
          .attr("text-anchor", "left")
          .attr("y", 5);
        focusTextToken1
          .html(
            `${this.token1Symbol}: ${(
              1 /
              getPriceFromTick(
                x0,
                this.props.token0Decimal,
                this.props.token1Decimal
              )
            ).toFixed(6)} ${this.token0Symbol}`
          )
          .attr("x", this.x(x0) + 5)
          .attr("text-anchor", "left")
          .attr("y", 20);
      }
    };

    this.svg
      .append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("width", this.props.width)
      .attr("height", this.props.height)
      .on("mouseover", () => {
        focusTextToken0.style("opacity", 1);
        focusTextToken1.style("opacity", 1);
        verticalLine.style("opacity", 1);
      })
      .on("mouseout", () => {
        focusTextToken0.style("opacity", 0);
        focusTextToken1.style("opacity", 0);
        verticalLine.style("opacity", 0);
      })
      .on("mousemove", onMouseMove);
  }
}

export default D3LiquidityHistogram;
