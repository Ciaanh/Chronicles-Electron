import React from "react";

import { IconButton, Typography, Link } from "@mui/material";

import GetAppIcon from "@mui/icons-material/GetApp";

import { AddonDownloadUrl } from "../constants";

const Copyright = (props) => {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {" "}
            <IconButton color="inherit" href={AddonDownloadUrl} target="_blank">
                <GetAppIcon />
            </IconButton>
            {"Copyright © "}
            <Link color="inherit" href="https://github.com/Ciaanh">
                Ciaanh
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
};

export default Copyright;
