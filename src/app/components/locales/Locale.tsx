import React from "react";

import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Paper,
    TextField,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

import Grid from "@mui/material/Unstable_Grid2";

import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";

import { Locale, LocaleChange } from "../../models/locale";
import { Language } from "../../constants";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

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

const Locale = (props: ILocaleProps) => {
    const { locale, islabel, remove, change } = props;

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const selectLocale = (value: string, key: string, language: Language) => {
        selectedLocale = {
            selected: true,
            key: key,
            value: value,
            language: language,
        };
    };

    let selectedLocale = {
        selected: false,
        key: "",
        value: "",
        language: Language.enUS,
    };

    return (
        <React.Fragment>
            <Item elevation={10}>
                <Grid container spacing={2}>
                    {!islabel && (
                        <React.Fragment>
                            <Grid xs={11}>
                                <Typography noWrap variant="subtitle2">
                                    Key : {locale.key}
                                </Typography>
                            </Grid>
                            <Grid xs={1}>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        remove(locale.key);
                                    }}
                                    aria-label="close"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    )}
                    <Grid xs={11}>
                        <Typography noWrap variant="subtitle2">
                            enUS : {locale.enUS}
                        </Typography>
                    </Grid>
                    <Grid xs={1}>
                        <IconButton size="small" onClick={handleClickOpen}>
                            <EditIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Item>

            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth="lg"
            >
                <AppBar
                    sx={{
                        position: "relative",
                    }}
                >
                    <Toolbar>
                        Modal title
                        {handleClose ? (
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
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
                                            selectLocale(
                                                locale.enUS,
                                                locale.key,
                                                Language.enUS
                                            )
                                        }
                                    />
                                    <ListItemText
                                        primary="frFR"
                                        secondary="Secondary text"
                                        onClick={() =>
                                            selectLocale(
                                                locale.frFR,
                                                locale.key,
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
                                value={selectedLocale.value}
                                onChange={(event) =>
                                    change({
                                        key: selectedLocale.key,
                                        value: event.target.value,
                                        language: selectedLocale.language,
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
};

export default Locale;
