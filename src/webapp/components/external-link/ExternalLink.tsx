import React, { ReactNode } from "react";
import styled from "styled-components";

export type ExternalLinkVariant = "dark" | "light";

export interface ExternalLinkProps {
    href: string;
    children: ReactNode;
    target?: string;
    rel?: string;
    variant?: ExternalLinkVariant;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
    href,
    children,
    target = "_blank",
    rel = "noopener noreferrer",
    variant = "light",
}) => {
    return (
        <StyledLink href={href} target={target} rel={rel} variant={variant}>
            {children}
        </StyledLink>
    );
};

const StyledLink = styled.a<{ variant: ExternalLinkVariant }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    ${({ variant: $variant }) =>
        $variant === "light"
            ? `
        color: white;
        background-color: rgba(255, 255, 255, 0.15);
        
        &:hover {
            background-color: rgba(255, 255, 255, 0.25);
        }
    `
            : `
        color: #3498db;
        background-color: rgba(52, 152, 219, 0.1);
        
        &:hover {
            background-color: rgba(52, 152, 219, 0.2);
        }
    `}

    svg {
        font-size: 1rem;
    }
`;
