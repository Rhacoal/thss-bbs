import React from "react";
import {Eat, Parser} from 'remark-parse';
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {Strings} from "../strings";

const useStyles = makeStyles(theme => createStyles({
    spoiler: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        "& .folded": {
            display: "none",
        },
        "& .open": {},
        "& .spoiler-content": {
            border: "3px solid",
            borderColor: theme.palette.divider,
            alignSelf: "stretch",
        }
    }
}))

function tokenizeSpoiler(eat: Eat, value: string, silent?: boolean): any {
    const match = /#\(spoiler\)((.|[\r\n])*?)\(\/spoiler\)/.exec(value);
    if (match) {
        if (silent) {
            return true;
        }
        try {
            return eat(match[0])({
                type: 'spoiler',
                value: match[1]
            });
        } catch {
        }
    }
}

tokenizeSpoiler.notInLink = true;
tokenizeSpoiler.locator = function (value: string, fromIndex: number) {
    return value.indexOf('#(spoiler)', fromIndex);
};

function spoilerSyntax(this: any) {
    const Parser = this.Parser as { prototype: Parser };
    const tokenizers = Parser.prototype.inlineTokenizers;
    const methods = Parser.prototype.inlineMethods;

    // Add an inline tokenizer (defined in the following example).
    tokenizers.spoiler = tokenizeSpoiler;

    // Run it just before `text`.
    methods.splice(methods.indexOf('text'), 0, 'spoiler');
}

function SpoilerView(props: { value: string }) {
    const classes = useStyles(useTheme());
    const [open, setOpen] = React.useState(false);
    return <span className={classes.spoiler}>
        <button //variant="contained"
            onClick={() => setOpen(!open)}>
            {open ? Strings["post/fold_spoiler"] : Strings["post/expand_spoiler"]}
        </button>
        <span className={"spoiler-content " + (open ? "open" : "folded")}>
            {props.value}
        </span>
    </span>;
}

export {spoilerSyntax, SpoilerView};

