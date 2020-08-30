import React from "react";
import {Button, createStyles, useTheme, ButtonGroup} from "@material-ui/core";
import {Strings} from "../strings";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import clsx from "clsx";

const useStyles = makeStyles(theme => createStyles({
    "marginBottom": {
        marginBottom: theme.spacing(1),
    }
}));

/**
 * 返回主页.
 */
export function GoHome(props: any) {
    return <Button variant="outlined" component={Link} to="/">
        <HomeIcon/><span>{Strings["main/go_homepage"]}</span></Button>;
}

/**
 * 返回上一页.
 * @param props.history History 对象
 */
export function GoBack(props: {
    history: any,
}) {
    return <Button variant="outlined" component="span"
                   onClick={() => props.history.goBack()}>
        <ArrowBackIcon/><span>{Strings["main/go_back"]}</span>
    </Button>
}

/**
 * 返回主页和返回上一页按钮合并的 ButtonGroup.
 * @param props.history History 对象
 * @param props.marginBottom 是否添加一个 8px 的外边距
 */
export function ToolbarButtonGroup(props: {
    history: any,
    marginBottom?: boolean
}) {
    const classes = useStyles(useTheme());
    return <ButtonGroup className={clsx(props.marginBottom && classes.marginBottom)}>
        <Button variant="outlined" component={Link} to="/">
            <HomeIcon/><span>{Strings["main/go_homepage"]}</span></Button>
        <Button variant="outlined"  component="span"
                onClick={() => props.history.goBack()}>
            <ArrowBackIcon/><span>{Strings["main/go_back"]}</span>
        </Button>
    </ButtonGroup>
}