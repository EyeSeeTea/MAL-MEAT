import React from "react";
import { NumericBadge } from "./NumericBadge";

export interface ScoreBadgeProps {
    value?: number;
    large?: boolean;
}

const scoreValueFormatter = (value?: number): string => {
    return value !== undefined ? value.toFixed(2) : "N/A";
};

const scoreVariantFormatter = (value?: number): "blue" | "red" | "gray" => {
    if (value === undefined) return "gray";
    if (value >= 70) return "blue";
    if (value >= 35) return "gray";
    return "red";
};

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ value, large = false }) => {
    return (
        <NumericBadge
            value={value}
            large={large}
            valueFormatter={scoreValueFormatter}
            variantFormatter={scoreVariantFormatter}
        />
    );
};
