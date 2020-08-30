import React from "react";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {Strings} from "../strings";

const useStyles = makeStyles(theme => createStyles({
    "imageContainer": {
        lineHeight: "0",
    },
    "imageContainerClose": {
        height: "300px",
        overflow: "hidden",
    },
    "imageContainerOversize": {
        border: "1px 1px 0 1px solid",
        borderColor: theme.palette.divider,
    },
    "imageOpenControl": {
        height: "1.5em",
        background: theme.palette.background.default,
        borderStyle: "solid",
        borderWidth: "1px 0 0 0",
        borderColor: theme.palette.divider,
        cursor: "pointer",
        alignSelf: "stretch",
    },
    "list": {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "max-content",
        border: "1px solid",
        borderColor: theme.palette.divider,
    }
}))

/**
 * 图片显示组件.
 * @param props <img> 的 props
 * @constructor
 */
export function ImageView(props: {
    src?: string,
    alt?: string,
    title?: string,
}) {
    const [overSize, setOverSize] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles(useTheme());
    return <span className={classes.list}>
        <span className={classes.imageContainer + ((overSize && !open) ? " " + classes.imageContainerClose : "")}>
            <img className={"image-view"} src={props.src} onLoad={(evt) => {
                let imageElement: HTMLImageElement = evt.target as HTMLImageElement;
                if (imageElement.height && imageElement.width && (imageElement.height / imageElement.width) > 2) {
                    setOverSize(true);
                }
            }} alt={props.alt} title={props.title}/>
        </span>
        {overSize ? <span className={classes.imageOpenControl} onClick={() => setOpen(!open)}>
            {open ? Strings["post/fold_image"] : Strings["post/expand_image"]}
        </span> : undefined}
    </span>
}
