import {spoilerSyntax, SpoilerView} from "./spoiler_syntax";
import {stickerSyntax, StickerView} from "./sticker_syntax";
import {ImageView} from "./image_view";
import {CodeView} from "./code_view";
import ReactMarkdown from "react-markdown";
import React from "react";
import {underlineSyntax, UnderlineView} from "./underline_syntax";

/**
 * React-Markdown 的二次包装，添加了所需要的插件.
 */
export function MarkdownView(props: {
    escapeHTML?: boolean
    source: string
} | any) {
    return <ReactMarkdown escapeHtml={props.escapeHTML}
                          className="custom-html-style"
                          plugins={[spoilerSyntax, stickerSyntax, underlineSyntax]}
                          renderers={{
                              image: ImageView,             // 处理长图
                              imageReference: ImageView,    // 处理长图
                              code: CodeView,               // 高亮代码     ``` ```
                              spoiler: SpoilerView,         // 可折叠文本    #(spoiler)文本(/spoiler)
                              sticker: StickerView,         // 表情       #(sticker:tieba.haha)
                              underline: UnderlineView,     // ++下划线++
                          }}
                          {...props}
    />
}