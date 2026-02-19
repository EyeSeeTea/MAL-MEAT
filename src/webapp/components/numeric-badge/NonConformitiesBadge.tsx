import React from "react";
import { NumericBadge } from "./NumericBadge";

export interface NonConformitiesBadgeProps {
    value?: number;
    large?: boolean;
}

const nonConformitiesValueFormatter = (value?: number): string => {
    return value === undefined ? "N/A" : String(value);
};

const nonConformitiesVariantFormatter = (value?: number): "blue" | "red" | "gray" => {
    return value === undefined ? "gray" : value === 0 ? "blue" : "red";
};

export const NonConformitiesBadge: React.FC<NonConformitiesBadgeProps> = ({
    value,
    large = false,
}) => {
    return (
        <NumericBadge
            value={value}
            large={large}
            valueFormatter={nonConformitiesValueFormatter}
            variantFormatter={nonConformitiesVariantFormatter}
        />
    );
};
