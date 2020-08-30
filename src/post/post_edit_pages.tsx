import {useDispatch, useSelector} from "react-redux";
import {Store, tokenSlice} from "../store";
import React from "react";
import {Container} from "@material-ui/core";
import {GoBack} from "../utils/shared_components";
import {editPost, editReply, replyPost, submitPost} from "../backend";
import {LocalUrls} from "../urls";
import {Alert} from "@material-ui/lab";
import {PostEditor} from "./post_editor";
import {Strings} from "../strings";

/**
 * 发帖页面.
 */
export function PostSubmitPage(props: any) {
    const token = useSelector((store: Store) => store.token);
    const [message, setMessage] = React.useState(null as string | null);
    const dispatch = useDispatch();
    return <Container maxWidth="lg">
        <GoBack history={props.history}/>
        <PostEditor titleEditable={true} initialContent={""} initialTitle={""} onFinish={(title, content) => {
            submitPost(title, content).then(result => {
                if (result.success) {
                    props.history.push(LocalUrls.post(result.postId));
                    setMessage(null);
                } else {
                    if (!result.authorized) {
                        dispatch(tokenSlice.actions.setToken(null));
                        props.history.push("/");
                    }
                    setMessage(result.message);
                }
            }, reason => {
                setMessage(reason.toString());
            })
        }}/>
        {message ? <Alert severity="error">{message}</Alert> : undefined}
    </Container>
}

/**
 * 编辑帖子页面.
 */
export function PostEditPage(props: {
    match: {
        params: {
            postId: string,
        }
    },
    location: {
        state: {
            initialTitle: string,
            initialContent: string,
        }
    },
    history: any,
}) {
    const token = useSelector((store: Store) => store.token);
    const [message, setMessage] = React.useState(null as string | null);
    const dispatch = useDispatch();
    return <Container maxWidth="lg">
        <GoBack history={props.history}/>
        <PostEditor h1={Strings["post/edit"]}
                    titleEditable={true} initialTitle={props.location?.state?.initialTitle || ""}
                    initialContent={props.location?.state?.initialContent || ""} onFinish={(title, content) => {
            editPost(parseInt(props.match.params.postId), title, content).then(result => {
                if (result.success) {
                    props.history.push(LocalUrls.post(props.match.params.postId));
                    setMessage(null);
                } else {
                    if (!result.authorized) {
                        dispatch(tokenSlice.actions.setToken(null));
                        props.history.push("/");
                    }
                    setMessage(result.message);
                }
            }, reason => {
                setMessage(reason.toString());
            })
        }}/>
        {message ? <Alert severity="error">{message}</Alert> : undefined}
    </Container>
}

/**
 * 编辑回复页面.
 */
export function ReplyEditPage(props: {
    match: {
        params: {
            postId: string,
            replyId: string,
        }
    },
    location: {
        state: {
            initialTitle: string,
            initialContent: string,
        }
    },
    history: any,
}) {
    const token = useSelector((store: Store) => store.token);
    const [message, setMessage] = React.useState(null as string | null);
    const dispatch = useDispatch();
    return <Container maxWidth="lg">
        <GoBack history={props.history}/>
        <PostEditor h1={Strings["post/edit"]}
                    titleEditable={false} initialTitle={props.location?.state?.initialTitle || ""}
                    initialContent={props.location?.state?.initialContent || ""} onFinish={(title, content) => {
            editReply(parseInt(props.match.params.postId), parseInt(props.match.params.replyId), content).then(result => {
                if (result.success) {
                    props.history.push(LocalUrls.post(props.match.params.postId));
                    setMessage(null);
                } else {
                    if (!result.authorized) {
                        dispatch(tokenSlice.actions.setToken(null));
                        props.history.push("/");
                    }
                    setMessage(result.message);
                }
            }, reason => {
                setMessage(reason.toString());
            })
        }}/>
        {message ? <Alert severity="error">{message}</Alert> : undefined}
    </Container>
}

/**
 * 回复页面
 * @param props
 * @constructor
 */
export function ReplyPage(props: {
    match: {
        params: {
            postId: string,
            replyId?: string,
        }
    },
    location: {
        state: {
            initialTitle: string,
        }
    },
    history: any,
}) {
    const token = useSelector((store: Store) => store.token);
    const [message, setMessage] = React.useState(null as string | null);
    const dispatch = useDispatch();
    return <Container maxWidth="lg">
        <GoBack history={props.history}/>
        <PostEditor h1={Strings["post/reply"]}
                    titleEditable={false}
                    initialTitle={props.location?.state?.initialTitle || ""}
                    initialContent={""} onFinish={(title, content) => {
            replyPost(parseInt(props.match.params.postId),
                parseInt(props.match?.params?.replyId || "0"), content)
                .then(result => {
                    if (result.success) {
                        props.history.push(LocalUrls.post(props.match.params.postId));
                        setMessage(null);
                    } else {
                        if (!result.authorized) {
                            dispatch(tokenSlice.actions.setToken(null));
                            props.history.push("/");
                        }
                        setMessage(result.message);
                    }
                }, reason => {
                    setMessage(reason.toString());
                })
        }}/>
        {message ? <Alert severity="error">{message}</Alert> : undefined}
    </Container>
}