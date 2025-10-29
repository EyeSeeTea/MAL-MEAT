import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { Layout } from "$/webapp/components/layout/Layout";
import { Loading } from "$/webapp/components/loading/Loading";
import { useReportsByDomainForOrgUnit } from "$/webapp/hooks/useReportsByDomainForOrgUnit";
import { NoticeBox } from "@dhis2/ui";

export interface SummaryProps {
    orgUnitId: Id;
}

export const SummaryPage: React.FC<SummaryProps> = ({ orgUnitId }: SummaryProps) => {
    const defaultPageTitle = i18n.t("Summary");
    const { loader } = useReportsByDomainForOrgUnit(orgUnitId);
    if (loader.type === "loading") {
        return (
            <Layout title={defaultPageTitle} withGoBack>
                <Loading message={i18n.t("Loading summary...")} />
            </Layout>
        );
    }
    if (loader.type === "error") {
        return (
            <Layout title={defaultPageTitle} withGoBack>
                <NoticeBox title={i18n.t("Error loading summary")} error>
                    {i18n.t("An error occurred while loading the summary.")}
                    <pre>{loader.message}</pre>
                </NoticeBox>
            </Layout>
        );
    }
    const { value } = loader;
    const pageTitle = i18n.t("Summary for {{orgUnitName}}", {
        orgUnitName: value.organisationUnit.name,
    });

    return (
        <Layout title={pageTitle} withGoBack>
            {value.list.map(summary => (
                <div key={summary.domain.id}>
                    <h2>{summary.domain.name}</h2>
                    <p>
                        {i18n.t("Number of reports {{count}}", { count: summary.reports.length })}
                    </p>
                </div>
            ))}
        </Layout>
    );
};
