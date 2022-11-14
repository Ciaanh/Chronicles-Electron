import React from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    Paper,
    TextField,
    List,
    ListItemText,
    Checkbox,
    Badge,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/material/styles";

import { getLocaleKey, Locale } from "../../models/locale";
import { Language } from "../../constants";
import dbContext from "../../dbContext/dbContext";

const Item = styled(Paper)(({ theme }) => ({
    //backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

interface ILocaleProps {
    locale: Locale;
    isRequired: boolean;
    deleted?: (localeId: number) => void;
    updated: (localeId: number) => void;
    index?: number;
}

interface ILocaleState {
    locale: Locale;
    open: boolean;

    openError: boolean;
    error: string;

    selectedLanguage: Language | null;
}

class LocaleView extends React.Component<ILocaleProps, ILocaleState> {
    constructor(props: ILocaleProps) {
        super(props);

        if (!props.isRequired && !props.deleted) {
            throw new Error("deleted callback is required");
        }

        const initialState: ILocaleState = {
            locale: { ...props.locale },
            open: false,

            openError: false,
            error: "",

            selectedLanguage: null,
        };

        this.state = initialState;
    }

    open() {
        const newState: ILocaleState = { ...this.state };
        newState.open = true;

        this.setState(newState);
    }

    close() {
        const newState: ILocaleState = { ...this.state };
        newState.open = false;

        this.setState(newState);
    }

    selectLocale(value: string, language: Language) {
        const newState: ILocaleState = { ...this.state };

        newState.selectedLanguage = language;

        this.setState(newState);
    }

    changeLocale(value: string, language: Language) {
        const newState: ILocaleState = { ...this.state };

        newState.locale[language] = value ?? "";

        this.setState(newState);
    }

    delete(localeId: number) {
        if (localeId !== null) {
            const newState: ILocaleState = { ...this.state };
            newState.open = false;

            dbContext.Locales.delete(localeId);
            this.props.deleted(localeId);

            this.setState(newState);
        }
    }

    save() {
        const newState: ILocaleState = { ...this.state };
        newState.open = false;

        if (newState.locale._id === null) {
            newState.locale = dbContext.Locales.create(newState.locale);
        } else {
            newState.locale = dbContext.Locales.update(newState.locale);
        }

        this.props.updated(newState.locale._id);
        this.setState(newState);
    }

    render() {
        return (
            <React.Fragment>
                <Item elevation={10}>
                    <Grid container spacing={2}>
                        <Grid xs={11}>
                            <Badge
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                color="primary"
                                showZero
                                badgeContent={this.props.index ?? ""}
                                invisible={
                                    this.props.index === undefined ||
                                    this.props.index === null
                                }
                                sx={{
                                    zIndex: 1000,
                                }}
                            >
                                <Typography
                                    noWrap
                                    variant="subtitle2"
                                    sx={{
                                        marginLeft: () =>
                                            this.props.index === undefined ||
                                            this.props.index === null
                                                ? "0px"
                                                : "10px",
                                    }}
                                >
                                    Key (estimated):{" "}
                                    {getLocaleKey(this.state.locale)}
                                </Typography>
                            </Badge>
                        </Grid>
                        <Grid xs={1}>
                            {!this.props.isRequired ? (
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        this.delete(this.state.locale._id);
                                    }}
                                    aria-label="close"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            ) : null}
                        </Grid>

                        <Grid xs={11}>
                            <Typography noWrap variant="subtitle2">
                                enUS : {this.state.locale.enUS}
                            </Typography>
                        </Grid>
                        <Grid xs={1}>
                            <IconButton
                                size="small"
                                onClick={() => this.open()}
                            >
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Item>

                <Dialog
                    onClose={() => this.close()}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                    maxWidth="lg"
                >
                    <AppBar
                        sx={{
                            position: "relative",
                        }}
                    >
                        <Toolbar>
                            Editing locale (estimated key):{" "}
                            {getLocaleKey(this.state.locale)}
                            <IconButton
                                aria-label="close"
                                onClick={() => this.close()}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <IconButton
                                aria-label="save"
                                onClick={() => this.save()}
                                sx={{
                                    position: "absolute",
                                    right: 64,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <SaveIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <DialogContent dividers>
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                minWidth: 800,
                            }}
                        >
                            <Grid xs={4}>
                                <Item>
                                    <List dense={true}>
                                        <ListItemText
                                            primary="enUS"
                                            secondary=""
                                            onClick={() =>
                                                this.selectLocale(
                                                    this.state.locale.enUS,
                                                    Language.enUS
                                                )
                                            }
                                        />
                                        <ListItemText
                                            primary="frFR"
                                            secondary=""
                                            onClick={() =>
                                                this.selectLocale(
                                                    this.state.locale.frFR,
                                                    Language.frFR
                                                )
                                            }
                                        />
                                    </List>
                                </Item>
                            </Grid>
                            <Grid xs={8} container spacing={1}>
                                {this.state.selectedLanguage !== null && (
                                    <React.Fragment>
                                        <Grid xs={6}>
                                            <Typography variant="subtitle2">
                                                {this.state.selectedLanguage.toString()}
                                            </Typography>
                                        </Grid>

                                        <Grid xs={6}>
                                            <Typography variant="subtitle2">
                                                Is HTML ?
                                            </Typography>
                                            <Checkbox
                                                checked={
                                                    this.state.locale.ishtml
                                                }
                                                tabIndex={-1}
                                                disableRipple
                                                onChange={(event) => {
                                                    const newState: ILocaleState =
                                                        {
                                                            ...this.state,
                                                        };

                                                    newState.locale.ishtml =
                                                        event.target.checked;

                                                    this.setState(newState);
                                                }}
                                            />
                                        </Grid>

                                        <Grid xs={12}>
                                            <TextField
                                                id="filled-multiline-static"
                                                label="Multiline"
                                                multiline
                                                rows={15}
                                                value={
                                                    this.state.locale[
                                                        this.state
                                                            .selectedLanguage
                                                    ] ?? ""
                                                }
                                                onChange={(event) =>
                                                    this.changeLocale(
                                                        event.target.value,
                                                        this.state
                                                            .selectedLanguage
                                                    )
                                                }
                                                variant="filled"
                                                sx={{
                                                    width: "100%",
                                                }}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                )}
                            </Grid>
                        </Grid>

                        {/* <Typography variant="subtitle2">deDE</Typography>
                    <TextField label="deDE" margin="dense" value={locale.deDE} />
                    <Typography variant="subtitle2">esES</Typography>
                    <TextField label="esES" margin="dense" value={locale.esES} />
                    <Typography variant="subtitle2">esMX</Typography>
                    <TextField label="esMX" margin="dense" value={locale.esMX} />
                    <Typography variant="subtitle2">frFR</Typography>
                    <TextField label="frFR" margin="dense" value={locale.frFR} />
                    <Typography variant="subtitle2">itIT</Typography>
                    <TextField label="itIT" margin="dense" value={locale.itIT} />
                    <Typography variant="subtitle2">ptBR</Typography>
                    <TextField label="ptBR" margin="dense" value={locale.ptBR} />
                    <Typography variant="subtitle2">ruRU</Typography>
                    <TextField label="ruRU" margin="dense" value={locale.ruRU} />
                    <Typography variant="subtitle2">koKR</Typography>
                    <TextField label="koKR" margin="dense" value={locale.koKR} />
                    <Typography variant="subtitle2">zhCN</Typography>
                    <TextField label="zhCN" margin="dense" value={locale.zhCN} />
                    <Typography variant="subtitle2">zhTW</Typography>
                    <TextField label="zhTW" margin="dense" value={locale.zhTW} /> */}
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default LocaleView;
