import React from "react";
import styled from "styled-components";

type NumericBadgeVariant = "blue" | "red" | "gray";

export interface NumericBadgeProps {
    value?: number;
    large?: boolean;
    valueFormatter?: (value?: number) => string;
    variantFormatter?: (value?: number) => NumericBadgeVariant;
}

const defaultValueFormatter = (value?: number): string => {
    return value === undefined ? "N/A" : String(value);
};

const defaultVariantFormatter = (value?: number): NumericBadgeVariant => {
    return value === undefined ? "gray" : value === 0 ? "blue" : "red";
};

export const NumericBadge: React.FC<NumericBadgeProps> = ({
    value,
    large = false,
    valueFormatter = defaultValueFormatter,
    variantFormatter = defaultVariantFormatter,
}) => {
    const displayValue = valueFormatter(value);
    const variant = variantFormatter(value);

    return (
        <Badge variant={variant} large={large}>
            {displayValue}
        </Badge>
    );
};

interface BadgeProps {
    variant: NumericBadgeVariant;
    large: boolean;
}

const Badge = styled.div<BadgeProps>`
    font-size: ${({ large }) => (large ? "3.5rem" : "1.75rem")};
    font-weight: 700;
    line-height: 1;
    padding: ${({ large }) => (large ? "0.75rem 1.5rem" : "0.5rem 1rem")};
    border-radius: 4px;
    min-width: ${({ large }) => (large ? "260px" : "70px")};
    text-align: center;

    ${({ variant }) => {
        switch (variant) {
            case "blue":
                return `
                    color: #3498db;
                    background-color: #e3f2fd;
                `;
            case "red":
                return `
                    color: #e74c3c;
                    background-color: #ffebee;
                `;
            case "gray":
                return `
                    color: #999;
                    background-color: #f5f5f5;
                `;
        }
    }}
`;
