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
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";

import { Locale, LocaleChange } from "../../models/locale";
import { Language } from "../../constants";

const Item = styled(Paper)(({ theme }) => ({
    //backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

interface ILocaleProps {
    locale: Locale;
    islabel: boolean;
    remove: (key: string) => void;
    change: (changes: LocaleChange) => void;
}

interface ILocaleState {
    locale: Locale;
    open: boolean;

    openError: boolean;
    error: string;

    selectedLocale: ISelectedLocaleItem;
}

interface ISelectedLocaleItem {
    key: string;
    value: string;
    selected: boolean;
    language: Language;
}

class LocaleView extends React.Component<ILocaleProps, ILocaleState> {
    constructor(props: ILocaleProps) {
        super(props);

        const initialState: ILocaleState = {
            locale: props.locale,
            open: false,

            openError: false,
            error: "",

            selectedLocale: {
                selected: false,
                key: "",
                value: "",
                language: Language.enUS,
            } as ISelectedLocaleItem,
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

    selectLocale(value: string, key: string, language: Language) {
        const newState: ILocaleState = { ...this.state };
        newState.selectedLocale = {
            selected: true,
            key: key,
            value: value,
            language: language,
        } as ISelectedLocaleItem;

        this.setState(newState);
    }

    render() {
        return (
            <React.Fragment>
                <Item elevation={10}>
                    <Grid container spacing={2}>
                        <Grid xs={11}>
                            <Typography noWrap variant="subtitle2">
                                Key : {this.state.locale.key}
                            </Typography>
                        </Grid>
                        <Grid xs={1}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    this.props.remove(this.state.locale.key);
                                }}
                                aria-label="close"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>

                        <Grid xs={11}>
                            <Typography noWrap variant="subtitle2">
                                enUS : {this.state.locale.enUS}
                            </Typography>
                        </Grid>
                        <Grid xs={1}>
                            <IconButton size="small" onClick={this.open}>
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Item>

                <Dialog
                    onClose={this.close}
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
                            Modal title
                            {this.close ? (
                                <IconButton
                                    aria-label="close"
                                    onClick={this.close}
                                    sx={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                        color: (theme) =>
                                            theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            ) : null}
                        </Toolbar>
                    </AppBar>
                    <DialogContent dividers>
                        <Grid container spacing={0.5}>
                            <Grid xs={4}>
                                <Item>
                                    <List dense={true}>
                                        <ListItemText
                                            primary="enUS"
                                            secondary="Secondary text"
                                            onClick={() =>
                                                this.selectLocale(
                                                    this.state.locale.enUS,
                                                    this.state.locale.key,
                                                    Language.enUS
                                                )
                                            }
                                        />
                                        <ListItemText
                                            primary="frFR"
                                            secondary="Secondary text"
                                            onClick={() =>
                                                this.selectLocale(
                                                    this.state.locale.frFR,
                                                    this.state.locale.key,
                                                    Language.frFR
                                                )
                                            }
                                        />
                                    </List>
                                </Item>
                            </Grid>
                            <Grid
                                xs={8}
                                sx={{
                                    minWidth: 400,
                                }}
                            >
                                <TextField
                                    id="filled-multiline-static"
                                    label="Multiline"
                                    multiline
                                    rows={15}
                                    value={this.state.selectedLocale.value}
                                    onChange={(event) =>
                                        this.props.change({
                                            key: this.state.selectedLocale.key,
                                            value: event.target.value,
                                            language:
                                                this.state.selectedLocale
                                                    .language,
                                        })
                                    }
                                    variant="filled"
                                />
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
