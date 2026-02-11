import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import React, { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

export interface LayoutProps {
    children: ReactNode;
    title: string;
    withGoBack?: boolean;
    headerRight?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, withGoBack, headerRight }) => {
    const history = useHistory();

    const goBack = React.useCallback(() => {
        history.goBack();
    }, [history]);
    return (
        <Container>
            <PageHeader title={title} onBackClick={withGoBack ? goBack : undefined}>
                {headerRight}
            </PageHeader>
            {children}
        </Container>
    );
};

const Container = styled.div`
    padding: 2rem;
`;
