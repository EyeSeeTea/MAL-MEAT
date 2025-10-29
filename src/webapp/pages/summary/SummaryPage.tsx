import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { Layout } from "$/webapp/components/layout/Layout";

export interface SummaryProps {
    orgUnitId: Id;
}

export const SummaryPage: React.FC<SummaryProps> = ({ orgUnitId }: SummaryProps) => {
    const pageTitle = i18n.t("Summary for {{orgUnitId}}", { orgUnitId });
    return (
        <Layout title={pageTitle} withGoBack>
            Summary content for org unit {orgUnitId}
        </Layout>
    );
};
