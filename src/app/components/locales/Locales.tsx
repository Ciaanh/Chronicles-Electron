import * as React from "react";
import { getLocaleKey, Locale } from "../../models/locale";
import dbContext from "../../dbContext/dbContext";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LocalesProps {}

export interface LocalesState {
    locales: Locale[];

    openError: boolean;
    error: string;
}

export class Locales extends React.Component<LocalesProps, LocalesState> {
    constructor(props: LocalesProps) {
        super(props);

        const initialState: LocalesState = {
            locales: [],

            openError: false,
            error: "",
        };

        try {
            initialState.locales = dbContext.Locales.findAll();
        } catch (error) {
            initialState.openError = true;
            initialState.error = "Error loading locales";
        }

        this.state = initialState;
    }

    removeLocale = (locale: Locale) => {
        const newState: LocalesState = { ...this.state };

        try {
            dbContext.Locales.delete(locale._id);
            newState.locales = this.state.locales.filter((l) => l !== locale);
        } catch (error) {
            newState.openError = true;
            newState.error = "Error removing locale";
        }

        this.setState(newState);
    };

    render() {
        return (
            <div>
                <h1>Locales</h1>
                <ul>
                    {this.state.locales.map((locale) => (
                        <li key={locale._id}>
                            Key (estimated): {getLocaleKey(locale)}
                            {/* <button onClick={() => this.removeLocale(locale)}>
                                Remove
                            </button> */}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
