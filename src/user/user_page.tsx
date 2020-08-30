import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Store, tokenSlice, userSlice} from "../store";
import {Button, ButtonGroup, Container, createStyles, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Redirect} from "react-router";
import {Alert, Skeleton} from "@material-ui/lab";
import {toTimeString} from "../utils/time_view";
import {Strings} from "../strings";
import {logout, User, userOther, UserSelf} from "../backend";
import {ToolbarButtonGroup} from "../utils/shared_components";
import {Link} from "react-router-dom";
import {LocalUrls} from "../urls";

const useStyles = makeStyles(theme => createStyles({
    list: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxSizing: "border-box",
        lineHeight: "1.7em",
        "& .MuiSkeleton-root": {
            width: "100%",
        },
        //maxWidth: "max-content",
    },
    buttonBar: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        "& .MuiButton-root": {
            marginBottom: theme.spacing(1),
        },
        "& .logout-button": {
            marginLeft: theme.spacing(1),
        },
        justifyContent: "center",
        display: "flex",
        alignSelf: "center",
        flexWrap: "wrap",
    }
}))

export function KeyValueView(props: {
    keyString: string,
    value: string,
}) {
    return <div>
        <Typography component="span" variant="body2"
                    style={{display: "inline-block", width: "6em"}}>{props.keyString}</Typography>
        <Typography component="span" variant="body1">{props.value}</Typography>
    </div>;
}

export function UserInfoPage(props: {
    match: {
        params: {
            userId?: string,
        }
    },
    history: any,
}) {
    const classes = useStyles(useTheme());
    const token = useSelector((state: Store) => state.token);
    const userInfo = useSelector((state: Store) => state.user);
    const dispatch = useDispatch();
    const handleClick = () => {
        if (userInfo) {
            logout(dispatch);
        }
    };
    let [userInfoOthers, setUserInfoOthers] = React.useState(null as (User | null));
    let [errorMessage, setErrorMessage] = React.useState(null as (string | null));
    const isOther = props?.match?.params?.userId;
    React.useEffect(() => {
        if (props?.match?.params?.userId) {
            userOther(parseInt(props.match.params.userId)).then((result) => {
                if (result.success) {
                    setUserInfoOthers(result.user);
                    setErrorMessage(null);
                } else {
                    if (!result.authorized) {
                        logout(dispatch);
                    }
                    setErrorMessage(result.message);
                }
            }, (reason) => {
                setErrorMessage(reason.toString());
            });
        }
    }, [props?.match?.params?.userId]);

    const userInfoToRender = isOther ? userInfoOthers : userInfo;

    return <React.Fragment>
        <Container maxWidth="sm" className={classes.list}>
            <ToolbarButtonGroup history={props.history} marginBottom={true}/>
            {token == null ? <Redirect to="/"/>
                : (userInfoToRender == null ?
                    (errorMessage == null ? <React.Fragment>
                            <Skeleton animation="wave" height="20px"/>
                            <Skeleton animation="wave"/>
                            <Skeleton animation="wave"/>
                            <Skeleton animation="wave"/>
                        </React.Fragment>
                        : <Alert style={{alignSelf: "stretch"}} severity="error">{errorMessage}</Alert>) :
                    <React.Fragment>
                        <Typography variant="h6" color="primary" component="div">
                            {userInfoToRender.nickname}
                        </Typography>
                        <KeyValueView keyString={Strings["user/id"]}
                                      value={userInfoToRender.id.toString()}/>
                        {isOther ? undefined : <KeyValueView keyString={Strings["user/username"]}
                                                             value={(userInfoToRender as UserSelf).username}/>}
                        <KeyValueView keyString={Strings["user/create_time"]}
                                      value={toTimeString(userInfoToRender.created)}/>
                        <div className={classes.buttonBar}>
                            {!isOther ?
                                <React.Fragment>
                                    <ButtonGroup>
                                        <Button variant="outlined" color="primary" component={Link}
                                                to={LocalUrls.postList(userInfoToRender.id)}>
                                            {Strings["user/show_self_post"]}
                                        </Button>
                                        <Button variant="outlined" color="primary" component={Link}
                                                to={LocalUrls.viewHistory()}>
                                            {Strings["user/show_history"]}
                                        </Button>
                                        <Button variant="outlined" color="primary" component={Link}
                                                to={LocalUrls.favorites()}>
                                            {Strings["user/show_favorites"]}
                                        </Button>
                                    </ButtonGroup>
                                    <Button variant="outlined" color="secondary" className="logout-button"
                                            onClick={handleClick}>{Strings["login/logout"]}</Button>
                                </React.Fragment>
                                : <Button variant="outlined" color="primary" component={Link}
                                          to={LocalUrls.postList(userInfoToRender.id)}>
                                    {Strings["user/show_user_post"]}
                                </Button>}
                        </div>
                    </React.Fragment>)}
        </Container>
    </React.Fragment>

}