import {useDispatch, useSelector} from "react-redux";
import {Store, tokenSlice, userSlice} from "../store";
import React from "react";
import {logout, user} from "../backend";
import {Button, createStyles, IconButton, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {Strings} from "../strings";
import {Link} from "react-router-dom";
import {LocalUrls} from "../urls";

const useStyles = makeStyles((theme) => createStyles({
    avatarIconButton: {
        marginLeft: "auto",
        fontSize: "1em",
        transition: "background-color ease-out 200ms",
        "& .link": {
            color: theme.palette.primary.contrastText,
            textDecoration: "none",
        },
        "& .MuiButton-label": {
            fontSize: "1.15em",
            alignItems: "stretch",
        }
    }
}));

/**
 * 顶端工具条右边的用户信息展示.
 */
export function UserBarInfo(props: any) {
    const classes = useStyles(useTheme());
    const token = useSelector((state: Store) => state.token);
    const userInfo = useSelector((state: Store) => state.user);
    const dispatch = useDispatch();
    React.useEffect(() => {
        if (token != null) {
            user().then((result) => {
                if (result.success) {
                    dispatch(userSlice.actions.updateUserStatus(result.user));
                } else {
                    dispatch(userSlice.actions.updateUserStatus(null));
                    if (!result.authorized) {
                        logout(dispatch);
                    }
                }
            }, (reason) => {
                dispatch(userSlice.actions.updateUserStatus(null));
            });
        }
    }, [token]);

    return <span className={classes.avatarIconButton}>
        <Button color="inherit" component={Link} to={LocalUrls.user()}>
            <AccountCircleIcon /><span>{userInfo ? userInfo.nickname : (token ? "" : Strings["main/not_logged_in"])}</span>
        </Button>
    </span>
}