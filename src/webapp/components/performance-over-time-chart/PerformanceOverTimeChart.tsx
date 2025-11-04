import { OrganisationUnitSummary } from "$/domain/entities/OrganisationUnitSummary";
import i18n from "$/utils/i18n";
import { Card as MUICard } from "@material-ui/core";
import { Chart, Series, XAxis, YAxis, Tooltip, Credits } from "@highcharts/react";
import React from "react";
import styled from "styled-components";
import { ReportSummary } from "$/domain/entities/ReportSummary";

export interface PerformanceOverTimeChartProps {
    summary: OrganisationUnitSummary;
}

export const PerformanceOverTimeChart: React.FC<PerformanceOverTimeChartProps> = ({
    summary,
}: PerformanceOverTimeChartProps) => {
    const reportSummariesByDomain = React.useMemo(() => {
        return summary.list.map(({ domain, reports }) => ({
            domain,
            reports: reports.map(r => new ReportSummary(r)),
        }));
    }, [summary]);

    const seriesData = React.useMemo(() => {
        return reportSummariesByDomain.map(({ domain, reports }) => {
            const data = reports
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(report => {
                    return [new Date(report.date).getTime(), report.averageScore] as [
                        number,
                        number
                    ];
                });

            return {
                name: domain.name,
                data: data,
            };
        });
    }, [reportSummariesByDomain]);

    return (
        <Card>
            <CardHeader>
                <Title>{i18n.t("Performance over time graph")}</Title>
            </CardHeader>
            <ChartContainer>
                <Chart>
                    <XAxis
                        type="datetime"
                        title={{ text: i18n.t("Date") }}
                        labels={{ format: "{value:%Y-%m-%d}" }}
                    />
                    <YAxis title={{ text: i18n.t("Average Score (%)") }} min={0} max={100} />
                    <Tooltip shared xDateFormat="%Y-%m-%d" valueSuffix="%" valueDecimals={2} />
                    <Credits enabled={false} />
                    {seriesData.map((series, index) => (
                        <Series
                            key={index}
                            options={{ name: series.name }}
                            type="line"
                            data={series.data}
                        />
                    ))}
                </Chart>
            </ChartContainer>
        </Card>
    );
};

const Card = styled(MUICard)`
    flex: 1;
    margin: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
    padding: 1.5rem 2rem;
    background-color: #fcfcfc;
    border-bottom: 1px solid #ddd;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #333;
`;

const ChartContainer = styled.div`
    padding: 1.5rem;
    background-color: #fff;
`;
