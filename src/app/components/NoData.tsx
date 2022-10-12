import React from "react";

import { Typography } from "@mui/material";

const NoData = (props: any) => {
    return (
        <Typography color="text.secondary" align="center" {...props}>
            No data to display
        </Typography>
    );
};

export default NoData;
