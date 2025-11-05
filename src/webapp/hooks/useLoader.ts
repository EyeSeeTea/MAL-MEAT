import { useSnackbar } from "@eyeseetea/d2-ui-components";
import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { CompositionRoot } from "$/CompositionRoot";
import { Maybe } from "$/utils/ts-utils";
import { FutureData } from "$/data/api-futures";

export type LoaderState<Value> =
    | { type: "loading" }
    | { type: "loaded"; value: Value }
    | { type: "error"; message: string };

export type LoaderGetter<Value> = (compositionRoot: CompositionRoot) => FutureData<Value>;

export function useLoader<Value>(
    getter: (compositionRoot: CompositionRoot) => Maybe<FutureData<Value>>,
    options: { refreshKey?: object } = {}
): LoaderState<Value> {
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [state, setState] = React.useState<LoaderState<Value>>({ type: "loading" });

    React.useEffect(() => {
        const res = getter(compositionRoot);
        if (!res) return;

        return res.run(
            value => setState({ type: "loaded", value }),
            err => {
                const errorMessage = typeof err === "string" ? err : err.message;
                const isAbortError = errorMessage.startsWith("AbortError");

                if (!isAbortError) {
                    snackbar.error(errorMessage);
                    setState({ type: "error", message: errorMessage });
                }
            }
        );
    }, [setState, snackbar, getter, compositionRoot, options.refreshKey]);

    return state;
}
