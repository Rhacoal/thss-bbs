import React from "react";
import {Container, createStyles, Typography, useTheme} from "@material-ui/core";
import {ToolbarButtonGroup} from "../utils/shared_components";
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => createStyles({
    "main": {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        "& .alert": {
            fontSize: "128px",
            color: theme.palette.error.main,
        },
        "& .margin": {
            margin: theme.spacing(2, 0),
        }
    }
}))

export function PageNotFoundPage(props: {
    history: any
}) {
    const classes = useStyles(useTheme());
    return <Container maxWidth="lg">
        <div className={classes.main}>
            <RemoveCircleOutlineOutlinedIcon className="alert" fontSize="inherit"/>
            <Typography variant="h4" component="h1" className="margin">页面不存在</Typography>
            <ToolbarButtonGroup history={props.history}/>
        </div>
    </Container>
}