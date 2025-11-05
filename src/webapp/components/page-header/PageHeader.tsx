import { ButtonProps, Icon, IconButton as MUIIConButton, Tooltip } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import Typography from "@material-ui/core/Typography";
import { DialogButton } from "@eyeseetea/d2-ui-components";
import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import i18n from "$/utils/i18n";

export const PageHeader: React.FC<PageHeaderProps> = React.memo(props => {
    const { variant = "h5", title, onBackClick, helpText, children } = props;

    return (
        <HeaderContainer>
            <HeaderContent>
                <TitleRow>
                    {!!onBackClick && (
                        <BackButton
                            onClick={onBackClick}
                            color="secondary"
                            aria-label={i18n.t("Back")}
                            data-test={"page-header-back"}
                        >
                            <Icon>arrow_back</Icon>
                        </BackButton>
                    )}

                    <TitleWrapper>
                        <Title variant={variant} data-test={"page-header-title"}>
                            {title}
                        </Title>
                    </TitleWrapper>

                    {helpText && <HelpButton text={helpText} />}
                </TitleRow>

                {children && <ActionsContainer>{children}</ActionsContainer>}
            </HeaderContent>
        </HeaderContainer>
    );
});

export type PageHeaderProps = PropsWithChildren & {
    variant?: Variant;
    title: string;
    onBackClick?: () => void;
    helpText?: string;
};

const HeaderContainer = styled.div`
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    background-color: #fafafa;
    padding: 1.25rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 40px;
`;

const TitleWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`;

const Title = styled(Typography)`
    font-weight: 500;
    color: #333;
    margin: 0;
    line-height: 1.3;
`;

const ActionsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Button: React.FC<ButtonProps> = ({ onClick }) => (
    <Tooltip title={i18n.t("Help")}>
        <IconButton onClick={onClick} aria-label={i18n.t("Help")}>
            <Icon color="primary">help</Icon>
        </IconButton>
    </Tooltip>
);

const HelpButton: React.FC<{ text: string }> = ({ text }) => (
    <DialogButton
        buttonComponent={Button}
        title={i18n.t("Help")}
        maxWidth={"sm"}
        fullWidth={true}
        contents={text}
    />
);

const IconButton = styled(MUIIConButton)`
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: rgba(25, 118, 210, 0.08);
        transform: scale(1.05);
    }

    &:focus-visible {
        outline: 2px solid #1976d2;
        outline-offset: 2px;
    }
`;

const BackButton = styled(IconButton)`
    color: #1976d2;

    &:hover {
        background-color: rgba(25, 118, 210, 0.08);
    }

    .MuiIcon-root {
        font-size: 1.5rem;
    }
`;
