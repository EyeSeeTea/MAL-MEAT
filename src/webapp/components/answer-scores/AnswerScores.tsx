import React from "react";
import {
    Card as MUICard,
    CardContent as MUICardContent,
    Typography,
    Divider,
    Collapse,
    IconButton,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import styled from "styled-components";
import { AnsweredQuestion, QuestionOption } from "$/domain/entities/Question";
import i18n from "$/utils/i18n";

export interface AnswerScoresProps {
    current: AnsweredQuestion;
    previous: Array<{ question: AnsweredQuestion; date: Date }>;
}

export const AnswerScores: React.FC<AnswerScoresProps> = ({ current, previous }) => {
    const [expandedIndexes, setExpandedIndexes] = React.useState<Set<number>>(new Set());

    const currentOption = current.options.find(option => option.score === current.value);

    if (!currentOption) return null;

    const toggleExpanded = (index: number) => {
        setExpandedIndexes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const formatDate = (date: Date): string => {
        return date.toISOString().split("T")[0] as string;
    };

    const getScoreColor = (option: QuestionOption): string => {
        if (option.isMajorNonConformity) return "#f44336";
        return "#607d8b";
    };

    return (
        <Card elevation={3}>
            <CardContent>
                <HeaderContainer>
                    <QuestionTitle variant="h6">{current.text}</QuestionTitle>
                </HeaderContainer>

                <BodyContainer>
                    <ScoreBadge color={getScoreColor(currentOption)}>
                        <ScoreValue>{current.value}</ScoreValue>
                    </ScoreBadge>
                    <ResponseSection>
                        <SectionTitle variant="subtitle2">
                            {i18n.t("Current Response")}
                        </SectionTitle>
                        <ResponseText>{currentOption.response}</ResponseText>
                    </ResponseSection>
                </BodyContainer>
                {currentOption.report && (
                    <ExplanationSection>
                        <SectionTitle variant="subtitle2">{i18n.t("Explanation")}</SectionTitle>
                        <ExplanationText>{currentOption.report}</ExplanationText>
                    </ExplanationSection>
                )}

                {previous.length > 0 && (
                    <>
                        <StyledDivider />
                        <PreviousSection>
                            <SectionTitle variant="subtitle2">
                                {i18n.t("Previous Scores")}
                            </SectionTitle>
                            <PreviousScoresContainer>
                                {previous.map((prev, index) => {
                                    const prevOption = prev.question.options.find(
                                        opt => opt.score === prev.question.value
                                    );
                                    if (!prevOption) return null;

                                    const isExpanded = expandedIndexes.has(index);

                                    return (
                                        <PreviousScoreItem key={index}>
                                            <PreviousScoreHeader
                                                onClick={() => toggleExpanded(index)}
                                                hasExplanation={Boolean(prevOption.report)}
                                            >
                                                <PreviousScoreBadge
                                                    color={getScoreColor(prevOption)}
                                                >
                                                    {prev.question.value}
                                                </PreviousScoreBadge>
                                                <PreviousScoreDetails>
                                                    <PreviousScoreDate>
                                                        {formatDate(prev.date)}
                                                    </PreviousScoreDate>
                                                    <PreviousScoreResponse>
                                                        {prevOption.response}
                                                    </PreviousScoreResponse>
                                                </PreviousScoreDetails>
                                                {prevOption.report && (
                                                    <ExpandIconButton expanded={isExpanded}>
                                                        <ExpandMoreIcon />
                                                    </ExpandIconButton>
                                                )}
                                            </PreviousScoreHeader>
                                            {prevOption.report && (
                                                <Collapse in={isExpanded} timeout="auto">
                                                    <PreviousScoreExplanation>
                                                        {prevOption.report}
                                                    </PreviousScoreExplanation>
                                                </Collapse>
                                            )}
                                        </PreviousScoreItem>
                                    );
                                })}
                            </PreviousScoresContainer>
                        </PreviousSection>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

const Card = styled(MUICard)`
    margin: 1rem 0;
    border-radius: 12px !important;
    transition: box-shadow 0.2s ease-in-out;

    &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    }
`;

const CardContent = styled(MUICardContent)`
    padding: 1.5rem !important;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
`;

const BodyContainer = styled.div`
    display: flex;
    gap: 2rem;
`;

const QuestionTitle = styled(Typography)`
    font-weight: 500 !important;
    color: #2c3e50;
    flex: 1;
`;

const ScoreBadge = styled.div<{ color: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${props => props.color};
    color: white;
    border-radius: 12px;
    padding: 0.25rem 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 120px;
    flex-shrink: 0;
`;

const ScoreValue = styled.div`
    font-size: 3rem;
    font-weight: 700;
`;

const ResponseSection = styled.div`
    margin: 0.25rem 0;
`;

const SectionTitle = styled(Typography)`
    font-weight: 600 !important;
    color: #34495e;
    margin-bottom: 0.5rem !important;
`;

const ResponseText = styled.div`
    padding: 1rem;
    background-color: #f8f9fa;
    border-left: 4px solid #3498db;
    border-radius: 4px;
    font-size: 0.95rem;
    color: #2c3e50;
    line-height: 1.6;
`;

const ExplanationSection = styled.div`
    margin: 1.5rem 0;
`;

const ExplanationText = styled.div`
    padding: 1rem;
    background-color: #fff3e0;
    border-left: 4px solid #ff9800;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #5d4037;
    line-height: 1.6;
    white-space: pre-wrap;
`;

const StyledDivider = styled(Divider)`
    margin: 1.5rem 0 !important;
`;

const PreviousSection = styled.div`
    margin-top: 1.5rem;
`;

const PreviousScoresContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
`;

const PreviousScoreItem = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;
`;

const PreviousScoreHeader = styled.div<{ hasExplanation: boolean }>`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem;
    cursor: ${props => (props.hasExplanation ? "pointer" : "default")};
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${props => (props.hasExplanation ? "#eeeeee" : "transparent")};
    }
`;

const PreviousScoreBadge = styled.div<{ color: string }>`
    min-width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color};
    color: white;
    border-radius: 8px;
    font-size: 1.25rem;
    font-weight: 700;
    flex-shrink: 0;
`;

const PreviousScoreDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
`;

const PreviousScoreDate = styled.div`
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 600;
`;

const PreviousScoreResponse = styled.div`
    font-size: 0.875rem;
    color: #2c3e50;
    font-weight: 500;
`;

const PreviousScoreExplanation = styled.div`
    padding: 1rem 0.75rem;
    font-size: 0.8rem;
    color: #7f8c8d;
    font-style: italic;
    line-height: 1.4;
    background-color: #e8e8e8;
    border-top: 1px solid #d0d0d0;
    white-space: pre-wrap;
`;

const ExpandIconButton = styled(IconButton)<{ expanded: boolean }>`
    padding: 0.25rem !important;
    margin-left: auto;
    transition: transform 0.3s ease !important;
    transform: ${props => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};
`;
