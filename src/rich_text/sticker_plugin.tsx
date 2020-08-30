import React from "react";
import MdEditor, {Plugins} from 'react-markdown-editor-lite'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import {StickerDatabase, stickerUrl} from "./sticker_indices";
import {makeStyles} from "@material-ui/core/styles";

const useDropMenuStyles = makeStyles({
    dropMenuWrap: {
        display: "block",
        "&.hidden": {
            display: "none !important",
        },
        position: "absolute",
        right: "-150px",
        top: "28px",
        zIndex: 2,
        minWidth: "20px",
        padding: "10px 0",
        textAlign: "center",
        backgroundColor: "#fff",
        border: "1px solid #f1f1f1",
        borderRightColor: "#ddd",
        borderBottomColor: "#ddd",
    }
});

function Drop(props: {
    show: boolean,
    onClose?: () => any,
    children: any,
}) {
    const classes = useDropMenuStyles();
    const handleClose = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        const {onClose} = props;
        if (typeof onClose === 'function') {
            onClose();
        }
    }, []);
    return (
        <div className={`${classes.dropMenuWrap} ${props.show ? 'show' : 'hidden'}`} onClick={handleClose}>
            {props.children}
        </div>
    );
}


const useStyles = makeStyles({
    stickerPreview: {
        display: "inline-flex",
        width: "60px",
        height: "60px",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
            backgroundColor: "#eee",
        }
    }
});

function StickerPlugin(props: {
    editor: MdEditor
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    }

    return (
        <span
            className="button button-type-sticker"
            title="表情"
            onClick={handleClick}
            style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <InsertEmoticonIcon style={{
                lineHeight: "28px",
                fontSize: "18px",
            }}/>
            <Drop show={open} onClose={() => setOpen(false)}>
                <div style={{
                    width: "320px",
                    display: "flex",
                    flexWrap: "wrap",
                    height: "400px",
                    overflow: "auto",
                }}>{Object.entries(StickerDatabase['tieba'].stickers).map(([key, value]) => {
                    return <span key={`tieba.${key}`} className={classes.stickerPreview} onClick={() => {
                        props.editor.insertText(`#(sticker:tieba.${key})`)
                    }}>
                        <span style={{
                            display: "inline-block",
                            width: `${value.w}px`,
                            height: `${value.h}px`,
                            lineHeight: `${value.h}px`,
                            background: `url("${StickerDatabase['tieba'].url}") no-repeat ${-value.x}px ${-value.y}px`,
                        }}/>
                    </span>;
                })}</div>
            </Drop>
    </span>
    );
}

StickerPlugin.align = 'left';
StickerPlugin.pluginName = 'sticker';

export {StickerPlugin};