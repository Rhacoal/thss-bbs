import React from "react";
import {Avatar, Button, ButtonGroup, Container, createStyles, Divider, Typography, useTheme} from "@material-ui/core";
import {post, PostFull, Reply} from "../backend";
import {Store, tokenSlice} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Alert, Skeleton} from "@material-ui/lab";
import {Strings} from "../strings";
import {TimeView} from "../utils/time_view";
import {Link} from "react-router-dom";
import {LocalUrls} from "../urls";
import {ToolbarButtonGroup} from "../utils/shared_components";
import {MarkdownView} from "../rich_text/markdown_view";
import EditIcon from "@material-ui/icons/Edit";
import RefreshIcon from "@material-ui/icons/Refresh";
import MessageIcon from "@material-ui/icons/MessageOutlined";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ReplyIcon from '@material-ui/icons/Reply';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import {blue, red} from "@material-ui/core/colors";
import {
    createHistoryEntryFromPostFull,
    hasFavorites,
    pushFavorites,
    pushViewHistory,
    removeFavorites
} from "../utils/utils";

const useStyles = makeStyles(theme => createStyles({
    "main": {
        paddingBottom: theme.spacing(5),
    },
    "postContent": {
        display: "flex",
        alignItems: "stretch",
        "& .userInfo": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textOverflow: "ellipse",
            textDecoration: "none",
        },
        "& .userInfo a, & .userInfo a:active": {
            color: theme.palette.text.primary,
            textDecoration: "none",
        },
        "& .userInfo .MuiButton-root": {
            display: "inline-block",
            textAlign: "center",
            width: "calc(4em + 20px)",
        },
        "& .userInfo .name_time": {
            fontSize: "16px",
        },
        "& .userInfo .time": {
            display: "flex",
            flexWrap: "wrap",
        },
        "& .userInfo .MuiAvatar-root": {
            color: theme.palette.getContrastText(blue[700]),
            backgroundColor: blue[700],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(-0.5),
            width: theme.spacing(4),
            height: theme.spacing(4),
            fontSize: theme.spacing(2),
        },
        "& .userInfo .MuiAvatar-root:active": {
            color: theme.palette.getContrastText(blue[700]),
        },
        "& .content-container": {
            display: "flex",
            flexDirection: "row",
            "& .vbar": {
                borderWidth: "0 0 0 2px",
                borderColor: theme.palette.divider,
                marginLeft: theme.spacing(1),
                paddingRight: "2px",
                borderStyle: "solid",
            },
            "& .vbar:hover": {
                borderColor: theme.palette.primary.main,
            },
        },
        "& .content": {
            position: "relative",
            width: "0",
            flex: "1 auto",
            paddingLeft: theme.spacing(1),
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "space-between",
            boxSizing: "border-box",
        },
        flexDirection: "column",
        "& .mainContent": {
            width: "100%",
            position: "relative",
            "minHeight": "2em",
            "& .md-editor-markdown": {
                padding: "10px",
            },
            overflow: "hidden",
            overflowX: "auto",
            "& img": {
                maxWidth: "100%",
            }
        },
        "& .bar": {
            width: "100%",
            maxHeight: "max-content",
            display: "flex",
            justifyContent: "flex-end",
            whiteSpace: "nowrap",
            flexWrap: "wrap",
            color: theme.palette.text.secondary,
        },
        "& .post-button-bar": {
            display: "flex",
            marginTop: theme.spacing(1),
            flexWrap: "wrap",
            justifyContent: "flex-start",
            fontSize: "0.8em",
            alignItems: "center",
        },
        "& .floor-number": {
            marginLeft: "auto",
            color: theme.palette.text.secondary,
        },
        "& .post-button:visited": {},
        "&.main": {
            padding: theme.spacing(2),
            background: theme.palette.background.paper,
            borderRadius: theme.spacing(1),
            boxShadow: "0 0 3px rgba(0, 0, 0, 0.3)"
        },
        "&.reply": {
            marginTop: theme.spacing(1),
        },
        width: "100%",
        boxSizing: "border-box",
    },
    "postButton": {
        marginRight: "1ch",
        color: theme.palette.primary.main,
        textDecoration: "underline",
        cursor: "pointer",
    },
    "reply": {
        boxSizing: "border-box",
        "& .subReply": {
            marginLeft: theme.spacing(5),
        },
    },
    "subReplyList": {
        "&:hover": {
            borderColor: theme.palette.primary.main,
        },
    },
    "replyListControlBar": {
        "& .MuiButton-root": {},
        marginBottom: theme.spacing(1),
    },
    "inFloorReply": {
        marginLeft: "20px",
        marginRight: "10px",
        "& .MuiListItem-root": {
            flexDirection: "column",
            alignItems: "stretch",
            borderWidth: "0 1px 1px 1px",
            borderColor: theme.palette.divider,
            borderStyle: "solid",
        },
        "& .MuiListItem-root:nth-child(1)": {
            borderWidth: "1px 1px 1px 1px",
        }
    },
    "buttonBar": {
        display: "flex",
        "& .MuiButtonGroup-root:nth-child(1)": {
            marginRight: "auto",
            marginLeft: "0",
        },
        "& .favorite": {
            color: red[500],
        },
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
}));

/**
 * 展平回复列表.
 * @param subReplies 一级回复列表
 * @param replyTreeMap 回复树
 * @param base 用于递归的临时参数
 */
function flattenReplies(subReplies: Reply[], replyTreeMap: { [id: number]: Reply[] }, base?: Reply[]) {
    let base1 = base || [];
    for (let reply of subReplies) {
        base1.push(reply);
        let children = replyTreeMap[reply.id];
        if (children) {
            flattenReplies(children, replyTreeMap, base1);
        }
    }
    return base1;
}

/**
 * 展示回复.
 * @param props.level 层级
 * @param props.subReplies 一级子回复
 * @param props.replyTreeMap 回复树
 * @param props.allReplies 回复的 id 到对象映射
 * @param props.main 是否是主贴
 * @param props.reply 回复/主贴
 * @param props.selfFlatten 是否需要展平
 * @param props.repliedName 展平后，回复的目标昵称
 */
function ReplyView(props: {
    level: number,
    subReplies: Reply[],
    replyTreeMap: { [id: number]: Reply[] },
    allReplies: { [id: number]: Reply },
} & ({ reply: Reply, main: false, title: string } | { reply: PostFull, main: true, posterOnly: boolean })
    & ({ selfFlatten: true, repliedName: string } | { selfFlatten: false })) {
    const classes = useStyles(useTheme());
    const userId = useSelector((store: Store) => store.user)?.id || -1;
    const [displayHTML, setDisplayHTML] = React.useState(true);
    const [displayLength, setDisplayLength] = React.useState(props.level < 3 ? 5 : 0);
    const flatten = props.level >= 2 || props.selfFlatten;
    const [subReplies, setSubReplies] = React.useState(flatten ? [] : props.subReplies);
    React.useEffect(() => {
        if (flatten) {
            setSubReplies(flattenReplies(props.subReplies, props.replyTreeMap));
        }
    }, [props.level, props.subReplies, props.replyTreeMap]);

    return <React.Fragment>
        <div className={classes.postContent + (props.main ? " main" : " reply")}
             id={(props.main ? "post-main" : props.reply.id.toString())}>

            {/*用户信息*/}
            <div className="userInfo">
                <Avatar component={Link}
                        to={LocalUrls.user(props.reply.userId)}>{props.reply.nickname.substring(0, 1)}</Avatar>
                <span className="name_time">
                    <Typography component={Link} to={LocalUrls.user(props.reply.userId)}
                                variant="body1">{props.reply.nickname}</Typography>
                    <Typography variant="body2" component="div" className="time">
                        <span>{Strings["post/create_time"]}:&nbsp;<TimeView time={props.reply.created}/>&nbsp;</span>
                        <span>{props.reply.created !== props.reply.updated ? <React.Fragment>
                            {Strings["post/update_time"]}:&nbsp;<TimeView time={props.reply.updated}/>
                        </React.Fragment> : undefined}</span>
                    </Typography>
                </span>
            </div>

            {/*主体内容*/}
            <div className="content-container">
                <span className="vbar" onClick={() => {
                    setDisplayLength(displayLength > 0 ? 0 : Math.min(5, props.subReplies.length))
                }}/>
                <span className="content">
                    {(props.selfFlatten && props.repliedName && !props.main) ?
                        <Typography variant="body2"
                                    component="a"
                                    href={`#${props.reply.replyId}`}>
                            {Strings["post/reply_to"].replace("{nickname}", props.repliedName)}
                            {`(#${props.reply.replyId})`}
                        </Typography>
                        : undefined}
                    <div className="mainContent">
                        <MarkdownView source={props.reply.content}
                                      escapeHtml={!displayHTML}
                        />
                    </div>
                    <span className="post-button-bar">
                        {userId === props.reply.userId ?
                            <Button
                                className="post-button"
                                component={Link}
                                to={props.main ? {
                                    pathname: LocalUrls.editPost(props.reply.id),
                                    state: {
                                        "initialTitle": props.reply.title,
                                        "initialContent": props.reply.content,
                                    }
                                } : {
                                    pathname: LocalUrls.editReply(props.reply.postId, props.reply.id),
                                    state: {
                                        "initialTitle": Strings["reply_edit/title_prefix"].replace("{title}", props.title),
                                        "initialContent": props.reply.content,
                                    }
                                }}
                            >
                                <EditIcon/>{Strings["post/edit"]}
                            </Button>
                            : undefined}
                        <Button
                            component={Link}
                            className="post-button"
                            to={props.main ? {
                                pathname: LocalUrls.replyToPost(props.reply.id),
                                state: {
                                    "initialTitle": Strings["reply_edit/title_prefix"].replace("{title}", props.reply.title),
                                }
                            } : {
                                pathname: LocalUrls.replyToReply(props.reply.postId, props.reply.id),
                                state: {
                                    "initialTitle": Strings["reply_edit/title_prefix"].replace("{title}", props.title),
                                }
                            }}
                        >
                            <ReplyIcon/>{Strings["post/reply"]}
                        </Button>
                        {props.reply.content.match(/<[a-zA-Z]+.*?>/) ? <Button
                            className="post-button"
                            onClick={() => {
                                setDisplayHTML(!displayHTML);
                            }}
                        >
                            {displayHTML ? <VisibilityOutlinedIcon/> : <VisibilityOffOutlinedIcon/>}
                            {displayHTML ? Strings["post/hide_html"] : Strings["post/show_html"]}
                        </Button> : undefined}
                        {props.main ?
                            (props.posterOnly ?
                                    <Button component={Link}
                                            to={LocalUrls.post(props.reply.id, false)}>
                                        <CheckBoxOutlinedIcon/>{Strings["post/poster_only"]}</Button> :
                                    <Button component={Link}
                                            to={LocalUrls.post(props.reply.id, true)}>
                                        <CheckBoxOutlineBlankOutlinedIcon/>{Strings["post/poster_only"]}</Button>
                            )
                            : undefined}
                        <Typography variant="body1" component="span" className="floor-number">
                            {props.main ? "" : `#${props.reply.id}`}
                        </Typography>
                    </span>
                    <Divider/>
                    {subReplies.length ? <React.Fragment>
                        <span className={classes.subReplyList}>
                            {subReplies.slice(0, displayLength).map((value, index) => (
                                <React.Fragment key={index}>
                                    <ReplyView selfFlatten={flatten}
                                               allReplies={props.allReplies}
                                               repliedName={(!props.main && value.replyId !== props.reply.id)
                                                   ? props.allReplies[value.replyId]?.nickname || ""
                                                   : ""}
                                               main={false} reply={value} level={props.level + 1}
                                               subReplies={flatten ? [] : (props.replyTreeMap[value.id] || [])}
                                               replyTreeMap={props.replyTreeMap}
                                               title={props.main ? props.reply.title : props.title}/>
                                </React.Fragment>
                            ))}
                        </span>
                    </React.Fragment> : undefined}
                </span>
            </div>
            <ButtonGroup className={classes.replyListControlBar}>
                {displayLength < subReplies.length ?
                    <Button variant="outlined" color="primary" onClick={() => {
                        setDisplayLength(Math.min(displayLength + 10, subReplies.length));
                    }}>{Strings["post/more_replies"]}{`(${subReplies.length - displayLength})`}</Button> : undefined
                }
                {displayLength > 0 && subReplies.length > 0 ?
                    <Button variant="outlined" color="primary" component="a" onClick={() => {
                        setDisplayLength(0);
                    }}
                            href={props.main ? "#post-main" : `#${props.reply.id}`}>{Strings["post/fold_replies"]}</Button> : undefined
                }
            </ButtonGroup>
        </div>
    </React.Fragment>;
}

/**
 * 展示帖子详情.
 * @param props 帖子详情
 */
function PostView(props: PostFull & { posterOnly: boolean }) {
    const classes = useStyles(useTheme());
    const replyTreeMap: { [id: number]: Reply[] } = {};
    if (props.reply) {
        props.reply.forEach((reply) => {
            if (reply.replyId) {
                if (!replyTreeMap[reply.replyId]) {
                    replyTreeMap[reply.replyId] = [reply];
                } else {
                    replyTreeMap[reply.replyId].push(reply);
                }
            }
        })
    }
    let replies: any[] = [<ReplyView level={0} posterOnly={props.posterOnly} main={true} reply={props}
                                     selfFlatten={false}
                                     replyTreeMap={replyTreeMap}
                                     allReplies={props.reply.reduce((prev, reply) => {
                                         prev[reply.id] = reply;
                                         return prev;
                                     }, {} as { [id: number]: Reply })}
                                     subReplies={props.reply.reduce((arr, reply) => {
                                         if (reply.replyId === 0) {
                                             arr.push(reply);
                                         }
                                         return arr;
                                     }, [] as Reply[])} key={0}/>];
    return <React.Fragment>
        <Typography variant="h4" component="h1">{props.title}</Typography>
        <hr/>
        {replies}
    </React.Fragment>;
}

/**
 * 帖子详情展示页面.
 */
export function PostPage(props: {
    match: {
        params: {
            postId: string,
        }
    },
    location: {
        search: string,
    },
    history: any,
}) {
    let [message, setMessage] = React.useState(null as string | null);
    let [postInfo, setPostInfo] = React.useState(null as PostFull | null);
    const token = useSelector((store: Store) => store.token);
    const dispatch = useDispatch();
    const classes = useStyles(useTheme());
    const postId = parseInt(props.match.params.postId);
    let [favorite, setFavorite] = React.useState(hasFavorites(postId));
    const params = new URLSearchParams(props.location.search);
    const loadPost = () => {
        setMessage(null);
        setPostInfo(null);
        post(postId).then((result) => {
            if (result.success) {
                setMessage(null);
                setPostInfo(params.get("posterOnly") ? {
                    ...result.post,
                    reply: result.post.reply ? result.post.reply.reduce((arr, value, index) => {
                        if (value.userId === result.post.userId) {
                            arr.push(value);
                        }
                        return arr;
                    }, [] as Reply[]) : [],
                } : result.post);
                pushViewHistory(createHistoryEntryFromPostFull(result.post));
            } else {
                setMessage(result.message);
                if (!result.authorized) {
                    dispatch(tokenSlice.actions.setToken(null));
                    props.history.push("/");
                }
            }
        }, reason => {
            setMessage(reason.toString());
        })
    }
    React.useEffect(() => {
        loadPost();
    }, [postId, props.location.search]);
    return <Container className={classes.main} maxWidth="lg">
        <div className={classes.buttonBar}>
            <ToolbarButtonGroup history={props.history}/>
            {postInfo != null ?
                (<ButtonGroup>
                    <Button variant="outlined" onClick={loadPost}><RefreshIcon/>{Strings["main/refresh"]}</Button>
                    <Button variant="outlined" component={Link}
                            to={{
                                pathname: LocalUrls.replyToPost(postId),
                                state: {
                                    "initialTitle": Strings["reply_edit/title_prefix"]
                                        .replace("{title}", postInfo.title),
                                }
                            }}><MessageIcon/>{Strings["post/reply"]}</Button>
                    <Button variant="outlined" onClick={() => {
                        if (favorite) {
                            removeFavorites(postId);
                            setFavorite(false);
                        } else if (postInfo) {
                            pushFavorites(createHistoryEntryFromPostFull(postInfo));
                            setFavorite(true);
                        }
                    }}>{favorite ? <FavoriteIcon className="favorite"/> : <FavoriteBorderIcon className="favorite"/>}
                        {Strings["main/favorite"]}
                    </Button>
                </ButtonGroup>) : undefined}
        </div>
        {
            postInfo ? <PostView {...postInfo} posterOnly={!!params.get("posterOnly")}/> :
                message ?
                    <Alert severity="error">
                        {message}
                    </Alert>
                    : <React.Fragment>
                        <Skeleton animation="wave"/>
                        <Skeleton animation="wave"/>
                        <Skeleton animation="wave"/>
                    </React.Fragment>
        }
    </Container>
}