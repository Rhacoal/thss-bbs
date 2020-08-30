import React from 'react';
import {createStyles, Divider, List, ListItem, ListItemText, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Post} from "../backend";
import {Link} from "react-router-dom";
import {toShortTimeString} from "../utils/time_view";
import {LocalUrls} from "../urls";
import MessageIcon from '@material-ui/icons/Message';
import ReplyIcon from '@material-ui/icons/Reply';
import {Constants} from "../constants";
import {Pagination} from "@material-ui/lab";
import {flatten} from "../utils/utils";

const useStyles = makeStyles((theme) => createStyles({
    "postCard": {
        backgroundColor: theme.palette.background.paper,
    },
    "list": {
        marginTop: theme.spacing(1),
    },
    "postPreview": {
        "& .MuiListItemText-secondary": {
            display: "-webkit-box",
            "-webkit-line-clamp": 2,
            "-webkit-box-orient": "vertical",
            overflow: "hidden",
            textOverflow: "ellipse",
            lineBreak: "anywhere",
        },
        "& .MuiListItem-root": {
            alignItems: "flex-start",
        }
    },
    "right": {
        marginLeft: "auto",
        marginRight: "0",
        flex: "0 0 5em",
    },
    "verticalCentralize": {
        display: "flex",
        alignItems: "center",
        fontSize: "0.9em",
    }
}));

/**
 * 简短的帖子预览.
 * @param props 帖子
 */
function PostPreview(props: Post) {
    const classes = useStyles(useTheme());
    return <ListItem className={classes.postPreview}
                     button
                     component={Link}
                     to={LocalUrls.post(props.id)}
    >
        <ListItemText
            primary={props.title}
            secondary={flatten(props.content)}
        />
        <ListItemText
            className={classes.right}
            primary={<React.Fragment>
                <div className={classes.verticalCentralize}><MessageIcon fontSize="inherit"/>{props.nickname}</div>
                <div className={classes.verticalCentralize}><ReplyIcon fontSize="inherit"/>{props.lastRepliedNickname}
                </div>
            </React.Fragment>}
            secondary={toShortTimeString(props.lastRepliedTime)}
        />
    </ListItem>;
}

/**
 * 帖子预览列表.
 * @param props.posts 帖子列表
 */
export function PostListView(props: {
    posts: Post[],
}) {
    const classes = useStyles(useTheme());
    const postPreviewList = [];
    let first = true;
    let i = 0;
    for (let post of props.posts) {
        if (first) {
            first = false;
            postPreviewList.push(<Divider variant="fullWidth" component="li" key={i}/>);
            ++i;
        }
        postPreviewList.push(<PostPreview {...post} key={i}/>);
        ++i;
        postPreviewList.push(<Divider variant="fullWidth" component="li" key={i}/>);
        ++i;
    }
    return <List className={classes.list}>
        {postPreviewList}
    </List>;
}

/**
 * 分页的帖子预览列表.
 * @param props.posts 帖子列表
 */
export function PagedPostsView(props: {
    posts: Post[],
}) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const maxPages = Math.max(1, Math.ceil(props.posts.length / Constants["post-per-page"]));
    const pageStart = (currentPage - 1) * Constants["post-per-page"];
    const pageEnd = pageStart + Constants["post-per-page"];
    return <React.Fragment>
        <PostListView posts={props.posts.slice(pageStart, pageEnd)}/>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Pagination page={currentPage} count={maxPages}
                        onChange={(evt, value) => setCurrentPage(value)}/>
        </div>
    </React.Fragment>
}