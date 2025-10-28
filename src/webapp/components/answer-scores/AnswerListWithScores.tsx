import { Report } from "$/domain/entities/Report";
import { AnswerScores } from "$/webapp/components/answer-scores/AnswerScores";
import React from "react";

export interface AnswerListWithScoresProps {
    current: Report;
    previous: Report[];
}

export const AnswerListWithScores: React.FC<AnswerListWithScoresProps> = ({
    current,
    previous,
}) => {
    const answers = React.useMemo(
        () =>
            current.questions.map(currentQuestion => ({
                current: currentQuestion,
                previous: previous
                    .map(report => {
                        const question = report.questions.find(
                            previousQuestion => previousQuestion.id === currentQuestion.id
                        );
                        return question ? { question, date: report.date } : null;
                    })
                    .filter((item): item is { question: typeof currentQuestion; date: Date } =>
                        Boolean(item)
                    )
                    .sort((a, b) => b.date.getTime() - a.date.getTime()),
            })),
        [current.questions, previous]
    );
    return answers.map(a => <AnswerScores key={a.current.id} {...a} />);
};
