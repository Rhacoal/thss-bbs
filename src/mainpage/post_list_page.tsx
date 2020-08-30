import React from "react";
import {makeStyles, Theme, withStyles} from "@material-ui/core/styles";
import {
    Button,
    ButtonGroup, Card, CardActions, CardContent,
    Collapse,
    Container,
    createStyles, Divider, Grid,
    Hidden, Switch,
    TextField,
    Typography,
    useTheme
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {Store, tokenSlice} from "../store";
import {logout, PostList, posts, User, userOther, UserSelf} from "../backend";
import {Constants} from "../constants";
import {formatMessage, Strings} from "../strings";
import {PostListView} from "../post/post_list_view";
import {Alert, Pagination, Skeleton} from "@material-ui/lab";
import {current} from "@reduxjs/toolkit";
import {toTimeString} from "../utils/time_view";
import {Link} from "react-router-dom";
import {LocalUrls} from "../urls";
import {KeyValueView} from "../user/user_page";
import {GoBack, GoHome, ToolbarButtonGroup} from "../utils/shared_components";
import EditIcon from "@material-ui/icons/Edit";
import RefreshIcon from "@material-ui/icons/Refresh";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import {getPostListSettings, setPostListSettings} from "../utils/utils";

const useStyles = makeStyles((theme) => createStyles({
    "main": {
        display: "flex",
        flexDirection: "column",
        minHeight: "auto",
    },
    "pageChange": {
        alignSelf: "center",
        display: "flex",
        alignItems: "center",
        "& .pageNumberButton": {
            marginLeft: theme.spacing(1),
            cursor: "pointer"
        },
        "& .pageNumberButton:hover": {
            textDecoration: "underline",
            //cursor: "pointer",
        },
        "& .MuiTextField-root": {
            width: "5ch",
            marginLeft: theme.spacing(1),
        },
        "& .MuiInputBase-input": {
            padding: "5px 5px",
        },
        "& .MuiButtonBase-root": {
            minWidth: "0",
        },
        "& .selectedPage": {
            color: theme.palette.text.secondary,
            textDecoration: "underline",
        }
    },
    "buttonBar": {
        display: "flex",
        // justifyContent: "flex-end",
        "& .MuiButtonGroup-root": {
            marginLeft: "auto",
            marginRight: "0",
        },
        alignItems: "center",
        paddingLeft: theme.spacing(2),
    },
    "userInfo": {
        paddingLeft: theme.spacing(2),
    },
    "middle": {
        display: "flex",
        justifyContent: "center",
    },
    "settingsPanel": {
        marginTop: theme.spacing(1),
        "& .inline": {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
        },
        "& .inline .uid": {
            width: "5em",
        },
        "& .inline .label": {
            marginRight: theme.spacing(1),
        },
        "& .inline .MuiButtonGroup-root": {
            marginLeft: "auto",
        },
    },
}));


function PageChangeControl(props: {
    current: number,
    max: number,
    onClick?: (newPage: number) => any,
    large: boolean,
}) {
    const classes = useStyles(useTheme());
    let buttonList = [];
    let [textValue, setTextValue] = React.useState(current.toString());
    const handleClick = (page: number) => {
        if (isFinite(page) && !isNaN(page)) {
            page = Math.max(Math.min(page, props.max), 1);
            if (page !== props.current && props.onClick) {
                props.onClick(page);
            }
        }
    }
    let left = Math.max(1, props.current - (props.large ? 5 : 2));
    let right = Math.min(props.current + (props.large ? 5 : 3), props.max);
    if (left > 1 && props.large) {
        buttonList.push(<span key={"left"}>...</span>)
    }
    for (let i = left; i <= right; ++i) {
        buttonList.push(<span key={i}
                              className={i === props.current ? "pageNumberButton selectedPage" : "pageNumberButton"}
                              onClick={() => handleClick(i)}>{i.toString()}
        </span>);
    }
    if (right < props.max && props.large) {
        buttonList.push(<span key={"right"}>...</span>)
    }
    return <span className={classes.pageChange}>
        <span className="pageNumberButton" onClick={() => handleClick(1)}>{"<<"}</span>
        <span className="pageNumberButton" onClick={() => handleClick(props.current - 1)}>{"<"}</span>
        {buttonList}
        <span className="pageNumberButton" onClick={() => handleClick(props.current + 1)}>{">"}</span>
        <span className="pageNumberButton" onClick={() => handleClick(props.max)}>{">>"}</span>
        <TextField variant="outlined" placeholder={`  /${props.max}`} inputMode="numeric"
                   onChange={(evt) => setTextValue(evt.target.value)}/>
        <Button onClick={() => handleClick(parseInt(textValue))}>{Strings["posts/jump_to"]}</Button>
    </span>
}


export function PostListViewPage(props: {
    userId: string | null,
    history: any,
}) {
    const userInfo = useSelector((store: Store) => store.user);
    const classes = useStyles(useTheme());
    const dispatch = useDispatch();
    const [currentPosts, setPosts] = React.useState(null as (PostList | null));
    const [postLoadingFailed, setPostLoadingFailed] = React.useState(false);
    const [postFailMessage, setPostFailMessage] = React.useState(null as (string | null));
    const [userInfoOthers, setUserInfoOthers] = React.useState(null as (User | null));
    const [userErrorMessage, setUserErrorMessage] = React.useState(null as (string | null));
    const [open, setOpen] = React.useState(false);
    const [settings, setSettings] = React.useState(getPostListSettings());
    const [tempUserId, setTempUserId] = React.useState(0);

    const [currentPage, setPage] = React.useState(1);
    const resetStates = () => {
        setPosts(null);
        setPostLoadingFailed(false);
        setPostFailMessage(null);
        setUserInfoOthers(null);
        setUserErrorMessage(null);
        setOpen(false);
    }

    const reloadPosts = () => {
        if (userInfo != null) {
            setPosts(null);
            posts({
                page: currentPage,
                size: Constants["post-per-page"],
                userId: props.userId == null ? undefined : props.userId,
                orderByReply: getPostListSettings().orderByReplyTime,
            }).then((result) => {
                if (result.success) {
                    setPostLoadingFailed(false);
                    setPosts(result.posts);
                    setPostLoadingFailed(false);
                    setPostFailMessage(null);
                } else {
                    if (result.authorized) {
                        setPostLoadingFailed(true);
                        setPostFailMessage(result.message);
                    } else {
                        dispatch(tokenSlice.actions.setToken(null));
                        props.history.push("/");
                    }
                }
            }, (reason) => {
                setPostLoadingFailed(true);
                setPostFailMessage(reason.toString());
            });
        }
    }
    React.useEffect(() => {
        resetStates();
        reloadPosts();
    }, [props.userId, userInfo, currentPage, getPostListSettings().orderByReplyTime]);

    React.useEffect(() => {
        if (props.userId) {
            userOther(parseInt(props.userId)).then((result) => {
                if (result.success) {
                    setUserInfoOthers(result.user);
                } else {
                    if (!result.authorized) {
                        logout(dispatch);
                    }
                    setUserErrorMessage(result.message);
                }
            }, (reason) => {
                setUserErrorMessage(reason.toString());
            });
        }
    }, [props.userId]);

    const openSettings = () => {
        setSettings(getPostListSettings());
        setOpen(true);
    }

    const closeSettings = () => {
        setOpen(false);
    }

    const saveSettings = () => {
        setPostListSettings(settings);
        setOpen(false);
    }

    return <React.Fragment>
        <Container className={classes.main} maxWidth="lg">
            {props.userId ?
                <React.Fragment>
                    <ToolbarButtonGroup history={props.history}/>
                    {userInfoOthers ?
                        <div className={classes.userInfo}>
                            <Typography variant="h6" color="primary" component="div">
                                {Strings["main/user_post_list"].replace("{nickname}", userInfoOthers.nickname)}
                            </Typography>
                            <KeyValueView keyString={Strings["user/id"]}
                                          value={userInfoOthers.id.toString()}/>
                            <KeyValueView keyString={Strings["user/create_time"]}
                                          value={toTimeString(userInfoOthers.created)}/>
                        </div>
                        : (userErrorMessage == null ? <React.Fragment>
                                <Skeleton animation="wave" height="30px"/>
                                <Skeleton animation="wave"/>
                                <Skeleton animation="wave"/>
                                <Skeleton animation="wave"/>
                            </React.Fragment>
                            :
                            <Alert
                                severity="error">{formatMessage("posts/user_loading_failed", userErrorMessage)}</Alert>)}
                </React.Fragment> : <div className={classes.buttonBar}>
                    <Typography variant="h6" component="span">{Strings["main/post_list"]}</Typography>
                    <ButtonGroup>
                        <Button variant="outlined" onClick={reloadPosts}><RefreshIcon/>{Strings["main/refresh"]}
                        </Button>
                        <Button variant="outlined" component={Link}
                                to={LocalUrls.createPost()}><EditIcon/>{Strings["main/drawer/submit_post"]}</Button>
                        <Button variant="outlined" color={open ? "primary" : "default"} onClick={open ? closeSettings : openSettings}>
                            <MoreHorizIcon/>
                        </Button>
                    </ButtonGroup>
                </div>
            }
            {!props.userId ? <Collapse in={open}>
                <div className={classes.settingsPanel}>
                    <Card className={classes.settingsPanel} variant="outlined">
                        <CardContent>
                            <Typography component="div" className="inline">
                                <span className="label">{Strings["posts/order_way"]}</span>
                                <label>
                                    {Strings["posts/order_by_post"]}
                                    <Switch checked={settings.orderByReplyTime} onChange={(evt: any) => {
                                        setSettings({...settings, orderByReplyTime: evt.target.checked});
                                    }}/>
                                    {Strings["posts/order_by_reply"]}
                                </label>
                                <ButtonGroup>
                                    <Button onClick={saveSettings}>{Strings["posts/apply_options"]}</Button>
                                    <Button onClick={closeSettings}>{Strings["posts/cancel_options"]}</Button>
                                </ButtonGroup>
                            </Typography>
                        </CardContent>
                        <Divider/>
                        <CardContent>
                            <Typography component="div" className="inline">
                                <span className="label">{Strings["posts/filter"]}</span>
                                <TextField className="uid" placeholder={"ID"} defaultValue={""} onChange={
                                    (evt) => setTempUserId(parseInt(evt.target.value))}/>
                                <ButtonGroup>
                                    <Button variant="outlined"
                                            component={Link} to={(tempUserId && !isNaN(tempUserId)) ?
                                        LocalUrls.postList(tempUserId) : ""}>{Strings["posts/apply_filter"]}</Button>
                                </ButtonGroup>
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            </Collapse> : undefined}
            {(postLoadingFailed && postFailMessage) ?
                <Alert severity="error">{formatMessage("posts/loading_failed", postFailMessage)}</Alert>
                : (currentPosts && (!props.userId || userInfoOthers) ? (<React.Fragment>
                    <PostListView posts={currentPosts.posts}/>
                    <Hidden smUp={true}>
                        <PageChangeControl
                            large={false}
                            current={currentPage}
                            max={Math.max(1, Math.ceil(currentPosts.total / Constants["post-per-page"]))}
                            onClick={(pageNumber) => {
                                setPage(pageNumber);
                            }}
                        />
                    </Hidden>
                    <Hidden xsDown={true}>
                        <div className={classes.middle}>
                            <Pagination count={Math.max(1, Math.ceil(currentPosts.total / Constants["post-per-page"]))}
                                        page={currentPage}
                                        onChange={(evt, value) => {
                                            setPage(value);
                                        }}/>
                        </div>
                    </Hidden>
                </React.Fragment>) : <React.Fragment>
                    <Skeleton animation="wave" height={20}/>
                    <Skeleton animation="wave" height={20}/>
                    <Skeleton animation="wave" height={20}/>
                    <Skeleton animation="wave" height={20}/>
                    <Skeleton animation="wave" height={20}/>
                    <Skeleton animation="wave" height={20}/>
                </React.Fragment>)}
        </Container>
    </React.Fragment>;
}
