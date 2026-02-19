import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

export type LoadingProps = {
    message: string;
};

export const Loading: React.FC<LoadingProps> = ({ message }) => {
    return (
        <LoadingContainer>
            <CircularProgress size={60} thickness={4} />
            <LoadingText>{message}</LoadingText>
        </LoadingContainer>
    );
};

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 1.5rem;
`;

const LoadingText = styled.div`
    font-size: 1.1rem;
    color: #666;
    font-weight: 500;
`;
