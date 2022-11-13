import React from "react";
import { NavLink } from "react-router-dom";

import Copyright from "./Copyright";

import {
    Box,
    Divider,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import StorageIcon from "@mui/icons-material/Storage";
import DataArrayIcon from "@mui/icons-material/DataArray";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const drawerWidth = 240;

class NavBar extends React.Component {
    constructor(props: any) {
        super(props);
    }

    activeRoute(routeName: string): boolean {
        const location: Location = window.location;
        return location.hash.indexOf(routeName) > -1 ? true : false;
    }

    isHome(): boolean {
        const location: Location = window.location;
        return location.hash === "" || location.hash === "#/";
    }

    render() {
        return (
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
            >
                <Toolbar />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "calc(100% - 64px)",
                        overflow: "auto",
                    }}
                >
                    <List
                        sx={{
                            mb: 2,
                            "& .link": {
                                textDecoration: "none",
                                color: "inherit",
                            },
                        }}
                    >
                        <NavLink to="/" className="link">
                            <ListItem button selected={this.isHome()}>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        </NavLink>

                        <NavLink to="/timelines" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/timelines")}
                            >
                                <ListItemIcon>
                                    <MoreVertIcon />
                                </ListItemIcon>
                                <ListItemText primary="Timelines" />
                            </ListItem>
                        </NavLink>

                        <Divider variant="middle" />

                        <NavLink to="/events" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/events")}
                            >
                                <ListItemIcon>
                                    <EventIcon />
                                </ListItemIcon>
                                <ListItemText primary="Events" />
                            </ListItem>
                        </NavLink>

                        <NavLink to="/characters" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/characters")}
                            >
                                <ListItemIcon>
                                    <AccountBoxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Characters" />
                            </ListItem>
                        </NavLink>

                        <NavLink to="/factions" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/factions")}
                            >
                                <ListItemIcon>
                                    <GroupIcon />
                                </ListItemIcon>
                                <ListItemText primary="Factions" />
                            </ListItem>
                        </NavLink>

                        <Divider variant="middle" />

                        <NavLink to="/locales" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/locales")}
                            >
                                <ListItemIcon>
                                    <MoreVertIcon />
                                </ListItemIcon>
                                <ListItemText primary="Locales cleanup" />
                            </ListItem>
                        </NavLink>

                        <Divider variant="middle" />

                        <NavLink to="/dbname" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/dbname")}
                            >
                                <ListItemIcon>
                                    <StorageIcon />
                                </ListItemIcon>
                                <ListItemText primary="DB Names" />
                            </ListItem>
                        </NavLink>

                        <NavLink to="/addon" className="link">
                            <ListItem
                                button
                                selected={this.activeRoute("/addon")}
                            >
                                <ListItemIcon>
                                    <DataArrayIcon />
                                </ListItemIcon>
                                <ListItemText primary="Addon Data" />
                            </ListItem>
                        </NavLink>
                    </List>
                    <Box
                        component="span"
                        sx={{
                            py: 3,
                            px: 2,
                            mt: "auto",
                            backgroundColor: (theme) =>
                                theme.palette.mode === "light"
                                    ? theme.palette.grey[200]
                                    : theme.palette.grey[800],
                        }}
                    >
                        <Copyright />
                    </Box>
                </Box>
            </Drawer>
        );
    }
}

export default NavBar;
