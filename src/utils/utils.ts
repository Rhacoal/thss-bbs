import {Constants} from "../constants";
import {Post, PostFull} from "../backend";
import moment from "moment";

/**
 * 将 HTML 字符串展平并裁剪，用于帖子预览.
 * @param htmlString
 */
export function flatten(htmlString: string): string {
    let str = htmlString.replace(/<\/?\w+.*?>/g, "");
    if (str.length > Constants["preview-content-length"]) {
        str = str.substring(0, Constants["preview-content-length"]) + "...";
    }
    return str;
}

export type HistoryEntry = { postId: number, title: string, content: string, replyTime: string, replyNickname: string, userNickname: string };

/**
 * 将 post 转换为历史记录条目，删除不必要的信息.
 * @param post 帖子完整内容
 */
export function createHistoryEntryFromPostFull(post: PostFull): HistoryEntry {
    let lastRepliedNickname = post.nickname;
    let lastReplyTime = moment(post.updated).unix();
    for (let reply of post.reply) {
        let t = moment(reply.updated).unix();
        if (t > lastReplyTime) {
            lastReplyTime = t;
            lastRepliedNickname = reply.nickname;
        }
    }
    return {
        postId: post.id,
        title: post.title,
        content: flatten(post.content),
        replyTime: post.lastRepliedTime,
        replyNickname: lastRepliedNickname,
        userNickname: post.nickname,
    }
}

/**
 * 将历史条目转换为帖子内容. 仅有预览需要的信息.
 * @param entry 历史记录条目
 */
export function createPostDigestFromHistoryEntry(entry: HistoryEntry): Post {
    return {
        "id": entry.postId,
        "userId": 0,
        "nickname": entry.userNickname,
        "title": entry.title,
        "content": entry.content,
        "created": "",
        "updated": "",
        "lastRepliedUserId": "",
        "lastRepliedNickname": entry.replyNickname,
        "lastRepliedTime": entry.replyTime
    }
}

/**
 * 添加一个历史记录.
 * @param historyEntry 历史记录条目
 */
export function pushViewHistory(historyEntry: HistoryEntry) {
    const hist = localStorage.getItem("viewHistory") || "[]";
    const obj = JSON.parse(hist) || [];
    if (obj.length > 0 && obj[0].postId === historyEntry.postId) {
        obj.shift();
    }
    obj.unshift(historyEntry);
    localStorage.setItem("viewHistory", JSON.stringify(obj));
}

/**
 * 获取历史记录列表.
 */
export function getViewHistory(): HistoryEntry[] {
    const hist = localStorage.getItem("viewHistory") || "[]";
    return JSON.parse(hist) || [];
}

/**
 * 清空历史记录.
 */
export function clearHistory() {
    localStorage.setItem("viewHistory", "[]");
}

/**
 * 加入收藏.
 * @param historyEntry 历史记录条目
 */
export function pushFavorites(historyEntry: HistoryEntry) {
    const fav = localStorage.getItem("favorites") || "{}";
    const obj = JSON.parse(fav) || {};
    obj[historyEntry.postId] = historyEntry;
    localStorage.setItem("favorites", JSON.stringify(obj));
}

/**
 * 获取收藏列表.
 */
export function getFavoritesList(): HistoryEntry[] {
    const fav = localStorage.getItem("favorites") || "{}";
    const obj = JSON.parse(fav) || {};
    return Object.entries(obj).map(([key, value]) => value as HistoryEntry);
}

/**
 * 删除收藏.
 * @param postId 帖子 ID
 */
export function removeFavorites(postId: number) {
    const fav = localStorage.getItem("favorites") || "{}";
    const obj = JSON.parse(fav) || {};
    if (obj[postId]) {
        delete obj[postId];
    }
    localStorage.setItem("favorites", JSON.stringify(obj));
}

/**
 * 是否收藏.
 * @param postId 帖子 ID
 */
export function hasFavorites(postId: number): boolean {
    const fav = localStorage.getItem("favorites") || "{}";
    const obj = JSON.parse(fav) || {};
    return !!(obj[postId]);
}

export interface PostListSettings {
    orderByReplyTime: boolean,
}

const defaultSettings : PostListSettings = {
    orderByReplyTime: true,
}

export function getPostListSettings() : PostListSettings {
    const st = localStorage.getItem("post-list-settings");
    return {...defaultSettings, ...(st ? (JSON.parse(st) || {}) : {})};
}

export function setPostListSettings(settings: PostListSettings) {
    localStorage.setItem("post-list-settings", JSON.stringify(settings));
}
