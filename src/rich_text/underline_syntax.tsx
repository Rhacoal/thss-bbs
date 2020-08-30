import React from "react";
import {Eat, Parser} from 'remark-parse';

function tokenizeUnderline(eat: Eat, value: string, silent?: boolean): any {
    const match = /\+\+(.*?)\+\+/.exec(value);
    if (match) {
        if (silent) {
            return true;
        }
        try {
            return eat(match[0])({
                type: 'underline',
                value: match[1]
            });
        } catch {
        }
    }
}

tokenizeUnderline.notInLink = true;
tokenizeUnderline.locator = function (value: string, fromIndex: number) {
    return value.indexOf('++', fromIndex);
};

function underlineSyntax(this: any) {
    const Parser = this.Parser as { prototype: Parser };
    const tokenizers = Parser.prototype.inlineTokenizers;
    const methods = Parser.prototype.inlineMethods;

    // Add an inline tokenizer (defined in the following example).
    tokenizers.underline = tokenizeUnderline;

    // Run it just before `text`.
    methods.splice(methods.indexOf('text'), 0, 'underline');
}

function UnderlineView(props: { value: string }) {
    return <u>{props.value}</u>
}

export {underlineSyntax, UnderlineView};
