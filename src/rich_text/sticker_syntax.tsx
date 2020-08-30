import React from "react";
import {Eat, Parser} from 'remark-parse';
import {createStyles, makeStyles, useTheme} from "@material-ui/core/styles";
import {Strings} from "../strings";
import {stickerUrl} from "./sticker_indices";

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

function tokenizeSticker(eat: Eat, value: string, silent?: boolean): any {
    const match = /#\(sticker:(.*?)\)/.exec(value);
    if (match) {
        if (silent) {
            return true;
        }
        try {
            return eat(match[0])({
                type: 'sticker',
                value: match[1]
            });
        } catch {
        }
    }
}

tokenizeSticker.notInLink = true;
tokenizeSticker.locator = function (value: string, fromIndex: number) {
    return value.indexOf('#(sticker', fromIndex);
};

function stickerSyntax(this: any) {
    const Parser = this.Parser as { prototype: Parser };
    const tokenizers = Parser.prototype.inlineTokenizers;
    const methods = Parser.prototype.inlineMethods;

    // Add an inline tokenizer (defined in the following example).
    tokenizers.sticker = tokenizeSticker;

    // Run it just before `text`.
    methods.splice(methods.indexOf('text'), 0, 'sticker');
}

function StickerView(props: { value: string }) {
    const stickerPath = stickerUrl(props.value);
    const stickerAlt = `#(sticker:${props.value})`;
    return stickerPath ? <span style={{
            display: "inline-block",
            width: `${stickerPath.w}px`,
            height: `${stickerPath.h}px`,
            lineHeight: `${stickerPath.h}px`,
            background: `url("${stickerPath.url}") no-repeat ${-stickerPath.x}px ${-stickerPath.y}px`,
        }}/>
        : <React.Fragment>{stickerAlt}</React.Fragment>;
}

export {stickerSyntax, StickerView};
