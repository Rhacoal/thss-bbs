import React from "react";
import {Button, createStyles, TextField, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Strings} from "../strings";
import MdEditor, {Plugins} from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import {MarkdownView} from "../rich_text/markdown_view";
import {StickerPlugin} from "../rich_text/sticker_plugin";
import {SpoilerPlugin} from "../rich_text/spoiler_plugin";

MdEditor.unuse(Plugins.FullScreen);
MdEditor.use(StickerPlugin);
MdEditor.use(SpoilerPlugin);

const useStyles = makeStyles(theme => createStyles({
    postCreate: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        "& .MuiTextField-root": {
            marginTop: theme.spacing(1),
        },
        margin: theme.spacing(1, 0),
    },
    submitButtons: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: theme.spacing(1),
    },
}));

export function PostEditor(props: {
    h1?: string,
    initialTitle: string,
    titleEditable?: boolean,
    height?: number,
    initialContent: string,
    onFinish?: (title: string, content: string) => any,
}) {
    let [[title, content], setTempContent] = React.useState([
        props.initialTitle, props.initialContent]);
    const classes = useStyles(useTheme());
    React.useEffect(() => {
        setTempContent([props.initialTitle, props.initialContent]);
    }, [props.initialTitle, props.initialContent]);
    const canSubmit = () => (!props.titleEditable || title !== "");
    const handleSubmitClick = () => {
        if (canSubmit() && props.onFinish) {
            props.onFinish(title, content);
        }
    }

    return <div className={classes.postCreate}>
        <Typography variant="h4" component="h1">{props.h1 || Strings["post_create/create_post"]}</Typography>
        <TextField value={title}
                   disabled={!props.titleEditable}
                   onChange={(evt) => {
                       setTempContent([evt.target.value, content])
                   }}
                   placeholder={Strings["post_create/placeholder_title"]}
        />
        <MdEditor
            value={content}
            style={{ height: "500px" }}
            renderHTML={(text) => (
                <MarkdownView source={text} escapeHTML={false}/>
            )}
            onChange={({html, text}) => {
                setTempContent([title, text]);
            }}
        />
        <div className={classes.submitButtons}>
            <Button variant="contained" color="primary"
                    onClick={handleSubmitClick}>{Strings["post_create/submit"]}</Button>
        </div>
    </div>;
}
