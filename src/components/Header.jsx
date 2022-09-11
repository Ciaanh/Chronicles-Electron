import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import {
    AppBar,
    Box,
    Toolbar,
    Button,
    ButtonBase,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

import GetAppIcon from "@mui/icons-material/GetApp";
import AccountCircle from "@mui/icons-material/AccountCircle";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { AddonDownloadUrl } from "../constants";

const Header = () => {
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <AppBar
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    position: "fixed",
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            "& .link": {
                                textDecoration: "none",
                                color: "inherit",
                            },
                        }}
                    >
                        <NavLink
                            className="link"
                            to="/"
                            sx={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            Chronicles DB{" "}{window.database.test}
                        </NavLink>
                        <Button
                            sx={{
                                borderRadius: (theme) =>
                                    theme.shape.borderRadius,
                                marginRight: 0,
                                marginLeft: 0,
                                color: "inherit",
                            }}
                            href={AddonDownloadUrl}
                            target="_blank"
                        >
                            <GetAppIcon />
                        </Button>
                    </Typography>
                    <Box style={{ flexGrow: 1 }} />
                   
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
