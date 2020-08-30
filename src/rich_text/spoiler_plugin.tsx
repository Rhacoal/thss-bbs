import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import MdEditor from "react-markdown-editor-lite";
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

function SpoilerPlugin(props: {
    editor: MdEditor
}) {
    return (
        <span
            className="button button-type-sticker"
            title="可折叠内容"
            onClick={() => {
                props.editor.insertText(`#(spoiler)${props.editor.getSelection().text}(/spoiler)`, true)
            }}
            style={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <UnfoldMoreIcon style={{
                lineHeight: "28px",
                fontSize: "18px",
            }}/>
    </span>
    );
}

SpoilerPlugin.align = 'left';
SpoilerPlugin.pluginName = 'spolier';

export {SpoilerPlugin};