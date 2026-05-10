import { Spinner } from "@shared/ui/spinner";
import { useChartPreview } from "../hooks";
import type { ChartPreviewProps, LineMode } from "../types";
import styles from "./styles.module.css";
import {
	Line,
	LineChart,
	AreaChart,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	ScatterChart,
	Tooltip,
	Legend,
	CartesianGrid,
	Area,
	Bar,
	Scatter,
} from "recharts";
import { getChartColor, mapToReChartFormat } from "../lib";
import { Select, SelectItem } from "@shared/ui/select";
import { useTranslation } from "react-i18next";

export const ChartPreview = ({
	fileId,
	visibleOptions,
	mode = "line-chart",
}: ChartPreviewProps) => {
	const {
		columns,
		isLoading,
		lineMode,
		setLineMode,
		xAxisOn,
		setXAxisOn,
		yAxisOn,
		setYAxisOn,
		legendOn,
		setLegendOn,
		gridOn,
		setGridOn,
		dotsOn,
		setDotsOn,
	} = useChartPreview({
		fileId,
		visibleOptions,
	});
	const { t } = useTranslation("chartPreview");

	const ChartComponent =
		mode === "line-chart"
			? LineChart
			: mode === "area-chart"
				? AreaChart
				: mode === "bar-chart"
					? BarChart
					: mode === "scatter-chart"
						? ScatterChart
						: LineChart;

	return (
		<div className={styles.Container}>
			{isLoading && <Spinner />}

			{columns && (
				<div className={styles.Content}>
					<div className={styles.ControllPanel}>
						<Select<"on" | "off">
							value={xAxisOn}
							defaultValue={"on"}
							onValueChange={(value) => setXAxisOn(value)}
							label={<p>{t("selectors.axisX")}</p>}
						>
							<SelectItem value={"on"}>{t("selectors.on")}</SelectItem>
							<SelectItem value={"off"}>{t("selectors.off")}</SelectItem>
						</Select>

						<Select<"on" | "off">
							value={yAxisOn}
							defaultValue={"off"}
							onValueChange={(value) => setYAxisOn(value)}
							label={<p>{t("selectors.axisY")}</p>}
						>
							<SelectItem value={"on"}>{t("selectors.on")}</SelectItem>
							<SelectItem value={"off"}>{t("selectors.off")}</SelectItem>
						</Select>

						<Select<"on" | "off">
							value={legendOn}
							defaultValue={"on"}
							onValueChange={(value) => setLegendOn(value)}
							label={<p>{t("selectors.legend")}</p>}
						>
							<SelectItem value={"on"}>{t("selectors.on")}</SelectItem>
							<SelectItem value={"off"}>{t("selectors.off")}</SelectItem>
						</Select>

						<Select<"on" | "off">
							value={gridOn}
							defaultValue={"on"}
							onValueChange={(value) => setGridOn(value)}
							label={<p>{t("selectors.grid")}</p>}
						>
							<SelectItem value={"on"}>{t("selectors.on")}</SelectItem>
							<SelectItem value={"off"}>{t("selectors.off")}</SelectItem>
						</Select>

						{(mode === "line-chart" || mode === "area-chart") && (
							<>
								<Select<"on" | "off">
									onValueChange={(value) => setDotsOn(value)}
									label={<p>{t("selectors.dots")}</p>}
									defaultValue={"on"}
								>
									<SelectItem value={"on"}>{t("selectors.on")}</SelectItem>
									<SelectItem value={"off"}>{t("selectors.off")}</SelectItem>
								</Select>

								<Select<LineMode>
									onValueChange={(value) => setLineMode(value)}
									label={<p>{t("selectors.typeChart.title")}</p>}
									defaultValue={"linear"}
								>
									<SelectItem value={"basis"}>
										{t("selectors.typeChart.basis")}
									</SelectItem>
									<SelectItem value={"monotone"}>
										{t("selectors.typeChart.monotone")}
									</SelectItem>
									<SelectItem value={"bump"}>
										{t("selectors.typeChart.bump")}
									</SelectItem>
									<SelectItem value={"linear"}>
										{t("selectors.typeChart.linear")}
									</SelectItem>
									<SelectItem value={"natural"}>
										{t("selectors.typeChart.natural")}
									</SelectItem>
									<SelectItem value={"step"}>
										{t("selectors.typeChart.step")}
									</SelectItem>
								</Select>
							</>
						)}
					</div>

					<div className={styles.ChartContainer}>
						<ResponsiveContainer width={"100%"}>
							<ChartComponent
								data={mapToReChartFormat(columns)}
								margin={{
									top: 20,
									right: 0,
									bottom: 0,
									left: 0,
								}}
							>
								{xAxisOn === "on" && (
									<XAxis
										dataKey="index"
										style={{
											fontSize: "var(--shaligula-ui-font-size-tiny)",
										}}
									/>
								)}

								{yAxisOn === "on" && (
									<YAxis
										style={{
											fontSize: "var(--shaligula-ui-font-size-tiny)",
										}}
									/>
								)}

								{legendOn === "on" && (
									<Legend
										labelStyle={{
											fontSize: "var(--shaligula-ui-font-size-tiny)",
										}}
									/>
								)}

								{gridOn === "on" && (
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="hsla(var(--shaligula-ui-color-primary) / 0.2)"
									/>
								)}

								<Tooltip
									contentStyle={{
										backgroundColor:
											"hsla(var(--shaligula-ui-color-background) / 0.8)",
										fontSize: "var(--shaligula-ui-font-size-tiny)",
										borderRadius: "var(--shaligula-ui-border-radius)",
										border: "var(--shaligula-ui-border)",
									}}
								/>

								{mode === "line-chart" &&
									columns.map((column, index) => (
										<Line
											type={lineMode}
											key={column.name}
											dataKey={column.name}
											stroke={`hsl(${getChartColor(index)})`}
											dot={{
												r: dotsOn === "on" ? 4 : 0,
												fill: "hsl(var(--shaligula-ui-color-primary))",
											}}
											activeDot={{
												r: dotsOn === "on" ? 8 : 0,
												fill: "hsla(var(--shaligula-ui-color-primary) / 0.5)",
											}}
										/>
									))}

								{mode === "area-chart" &&
									columns.map((column, index) => (
										<Area
											type={lineMode}
											key={column.name}
											dataKey={column.name}
											stroke={`hsl(${getChartColor(index)})`}
											fill={`hsla(${getChartColor(index)} / 0.5)`}
											dot={{
												r: dotsOn === "on" ? 4 : 0,
												fill: "hsl(var(--shaligula-ui-color-primary))",
											}}
											activeDot={{
												r: dotsOn === "on" ? 8 : 0,
												fill: "hsla(var(--shaligula-ui-color-primary) / 0.5)",
											}}
										/>
									))}

								{mode === "bar-chart" &&
									columns.map((column, index) => (
										<Bar
											key={column.name}
											dataKey={column.name}
											radius={[20, 20, 0, 0]}
											stroke={`hsl(${getChartColor(index)})`}
											fill={`hsla(${getChartColor(index)} / 0.5)`}
										/>
									))}

								{mode === "scatter-chart" &&
									columns.map((column, index) => (
										<Scatter
											name={column.name}
											key={column.name}
											dataKey={column.name}
											stroke={`hsl(${getChartColor(index)})`}
											fill={`hsla(${getChartColor(index)} / 0.5)`}
										/>
									))}
							</ChartComponent>
						</ResponsiveContainer>
					</div>
				</div>
			)}
		</div>
	);
};
