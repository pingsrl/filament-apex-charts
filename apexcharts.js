import ApexCharts from "apexcharts";
import ApexSankey from "apexsankey";

var merge = require("lodash.merge");

export default function apexcharts({
    options,
    chartId,
    theme,
    extraJsOptions,
}) {
    return {
        chart: null,
        options,
        chartId,
        theme,
        extraJsOptions,
        init: function () {
            this.$wire.$on("updateOptions", ({ options }) => {
                options = merge(options, this.extraJsOptions);
                this.updateChart(options);
            });

            Alpine.effect(() => {
                const theme = Alpine.store("theme");

                this.$nextTick(() => {
                    if (this.chart === null) {
                        this.initChart();
                    } else {
                        this.updateChart({
                            theme: { mode: theme },
                            chart: {
                                background:
                                    this.options.chart.background || "inherit",
                            },
                        });
                    }
                });
            });
        },
        initChart: function () {
            this.options.theme = { mode: this.theme };
            this.options.chart.background =
                this.options.chart.background || "inherit";

            this.options = merge(this.options, this.extraJsOptions);

            if (this.options.chart_type === "sankey") {
                this.chart = new ApexSankey(
                    document.querySelector(this.chartId),
                    this.options
                );
            } else {
                this.chart = new ApexCharts(
                    document.querySelector(this.chartId),
                    this.options
                );
            }
            this.chart.render(this.options.data ?? null);
        },
        updateChart: function (options) {
            this.chart.updateOptions(options, false, true, true);
        },
    };
}
