import React from "react";
import { useSelector } from "react-redux";
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

const NavBar = (props) => {
    const activeRoute = (routeName) => {
        return props.location.pathname === routeName ? true : false;
    };
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
                        <ListItem button selected={activeRoute("/")}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </NavLink>

                    <NavLink to="/timelines" className="link">
                        <ListItem button selected={activeRoute("/timelines")}>
                            <ListItemIcon>
                                <MoreVertIcon />
                            </ListItemIcon>
                            <ListItemText primary="Timelines" />
                        </ListItem>
                    </NavLink>

                    <Divider variant="middle" />

                    <NavLink to="/events" className="link">
                        <ListItem button selected={activeRoute("/events")}>
                            <ListItemIcon>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary="Events" />
                        </ListItem>
                    </NavLink>

                    <NavLink to="/characters" className="link">
                        <ListItem button selected={activeRoute("/characters")}>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Characters" />
                        </ListItem>
                    </NavLink>

                    <NavLink to="/factions" className="link">
                        <ListItem button selected={activeRoute("/factions")}>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Factions" />
                        </ListItem>
                    </NavLink>

                    <Divider variant="middle" />

                    <NavLink to="/dbname" className="link">
                        <ListItem button selected={activeRoute("/dbname")}>
                            <ListItemIcon>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary="DB Names" />
                        </ListItem>
                    </NavLink>

                    <NavLink to="/addon" className="link">
                        <ListItem button selected={activeRoute("/addon")}>
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
};

export default NavBar;
