import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => createStyles({
    code: {
        //boxShadow: "1px 1px 3px black",
        // borderRadius: "3px",
        // borderStyle: "solid",
        // borderColor: theme.palette.divider,
        overflow: "auto",
        //backgroundColor: theme.palette.background.default,
        //margin: theme.spacing(1, 0),
    },
}));

export function CodeView(props: {
    language: string,
    value: string,
}) {
    const theme = useTheme();
    const classes = useStyles(theme);
    return <div className={classes.code}>
        <SyntaxHighlighter language={props.language} style={vs} customStyle={{
            backgroundColor: "#f5f5f5",
        }}>
            {props.value || ""}
        </SyntaxHighlighter>
    </div>
}