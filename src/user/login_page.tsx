import React from "react";
import {Button, CircularProgress, createStyles, TextField, Typography, useTheme} from "@material-ui/core";
import {formatMessage, Strings} from "../strings";
import {makeStyles} from "@material-ui/core/styles";
import {login} from "../backend";
import {Store, tokenSlice, userSlice} from "../store";
import {Alert} from "@material-ui/lab";
import {Link, Redirect} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const useStyles = makeStyles((theme) => createStyles({
    list: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .MuiTextField-root, .MuiButton-root": {
            margin: theme.spacing(1),
            width: "30ch",
        },
    },
    alert: {
        justifySelf: "flex-end",
    }
}))

export function LoginPage(props: any) {
    const classes = useStyles(useTheme());
    const token = useSelector((store: Store) => store.token);
    const dispatch = useDispatch();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loggingIn, setLoggingIn] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(token != null);
    const [errorMessage, setErrorMessage] = React.useState(null as (string | null));

    const handleClick = () => {
        if ((username !== "" && password !== "") && !loggingIn && !loggedIn) {
            setLoggingIn(true);
            setErrorMessage(null);
            login(username, password).then((result) => {
                setLoggingIn(false);
                if (result.success) {
                    dispatch(tokenSlice.actions.setToken(result.jwt));
                    setLoggedIn(true);
                } else {
                    setErrorMessage(result.message);
                }
            }, (reason) => {
                setLoggingIn(false);
                setErrorMessage(reason);
            });
        }
    }

    return <div className={classes.list}>
        {loggedIn ? <Redirect to="/"/> : undefined}
        <Typography variant="h4">{Strings["login/title"]}</Typography>
        <TextField
            required
            id="username"
            label={Strings["login/username"]}
            onChange={(evt) => {
                setUsername(evt.target.value);
            }}
        />
        <TextField
            required
            id="password"
            label={Strings["login/password"]}
            type="password"
            onSubmit={() => handleClick()}
            onChange={(evt) => {
                setPassword(evt.target.value);
            }}
        />
        <Button onClick={() => handleClick()}
                variant="contained"
                color={(username !== "" && password !== "" && !loggingIn) ? "primary" : "default"}>
            {loggingIn ? <CircularProgress size="1em" color="primary"/> : undefined}
            {Strings["login/login"]}
            {loggingIn ? <span style={{"width": "1em"}}/> : undefined}
        </Button>
        {errorMessage ? <Alert severity="error">{formatMessage("login/failed", errorMessage)}</Alert> : undefined}
    </div>
}