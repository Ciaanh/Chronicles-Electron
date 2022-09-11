import React from "react";

import { Typography, } from "@mui/material";

const NoData = (props) => {
    return (
        <Typography
            color="text.secondary"
            align="center"
            {...props}
        >No data to display
        </Typography>
    );
};

export default NoData;
