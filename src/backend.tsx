import {Urls} from "./urls";
import {Strings, translate} from "./strings";
import {Dispatch} from "react";
import {tokenSlice, userSlice} from "./store";

export interface Floor {
    "id": number,
    "userId": number,
    "nickname": string,
    "content": string,
    "created": string,
    "updated": string
}

export interface Post extends Floor {
    "id": number,
    "userId": number,
    "nickname": string,
    "title": string,
    "content": string,
    "created": string,
    "updated": string
    "lastRepliedUserId": string,
    "lastRepliedNickname": string,
    "lastRepliedTime": string
}

export interface PostList {
    'page': number,
    'size': number,
    'total': number,
    'posts': Post[],
}

export interface User {
    "id": number,
    "nickname": string,
    "created": string
}

export interface UserSelf extends User {
    "id": number,
    "username": string,
    "nickname": string,
    "created": string
}

export interface Reply extends Floor {
    "id": number,
    "userId": number,
    "nickname": string,
    "postId": number,
    "replyId": number,
    "content": string,
    "created": string,
    "updated": string,
}

export interface PostFull extends Floor {
    "id": number,
    "userId": number,
    "nickname": string,
    "title": string,
    "content": string,
    "created": string,
    "updated": string
    "reply": Reply[],// | null,
    "lastRepliedTime": string,
}

/**
 * 登录.
 * @param username 用户名
 * @param password 密码
 */
export async function login(username: string, password: string)
    : Promise<{ success: true, username: string, nickname: string, jwt: string } | { success: false, message: string }> {
    let response = await fetch(Urls.login, {
        "method": "PATCH",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
        })
    });
    let json: { message?: string, username?: string, nickname?: string, jwt?: string };
    try {
        json = await response.json();
    } catch (e) {
        json = {"message": Strings["api/illegal_json"]}
    }
    if (response.status !== 200 || (json.username == null || json.nickname == null || json.jwt == null)) {
        return {
            "success": false,
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        setToken(json.jwt);
        return {
            "success": true,
            "username": json.username,
            "nickname": json.nickname,
            "jwt": json.jwt,
        }
    }
}

/**
 * 登出.
 * @param dispatch Redux useDispatch
 */
export async function logout(dispatch?: Dispatch<any>)
    : Promise<{ success: true } | { success: false, message: string }> {
    let response = await fetch(Urls.logout, {
        "method": "PATCH",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
        }
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
        json = {"message": Strings["api/illegal_json"]}
    }
    if (dispatch) {
        dispatch(userSlice.actions.updateUserStatus(null));
        dispatch(tokenSlice.actions.setToken(null));
    } else {
        removeToken();
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
        }
    }
}

/**
 * 其他用户信息.
 * @param userId 用户 id
 */
export async function userOther(userId: number)
    : Promise<({ success: true, user: User } | { success: false, authorized: boolean, message: string })> {
    let response = await fetch(userId == null ? Urls.user
        : Urls["other-user"].replace("{userId}", userId.toString()), {
        "method": "GET",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
        }
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "user": json,
        }
    }

}

/**
 * 自己的用户信息.
 */
export async function user()
    : Promise<({ success: true, user: UserSelf } | { success: false, authorized: boolean, message: string })> {
    let response = await fetch( Urls.user, {
        "method": "GET",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
        }
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "user": json,
        }
    }
}

/**
 * 帖子列表.
 * @param params.page (可选) 第几页
 * @param params.size (可选) 每页大小
 * @param params.userId (可选) 用户 ID (只显示某一用户)
 * @param params.orderByReply (可选) 是否按照回复时间序排序
 */
export async function posts(params: { page?: number, size?: number, userId?: number | string, orderByReply?: boolean })
    : Promise<{ success: true, posts: PostList } | { success: false, authorized: boolean, message: string }> {
    let response = await fetch(Urls.post + "?" + new URLSearchParams(Object.entries(params).reduce((prev: any, [k, v]) => {
        if (v != null) {
            prev[k] = v.toString();
        }
        return prev;
    }, {})).toString(), {
        "method": "GET",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
        },
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "posts": json,
        }
    }
}

/**
 * 帖子详情.
 * @param postId 帖子ID
 */
export async function post(postId: number)
    : Promise<{ success: true, post: PostFull } | { success: false, authorized: boolean, message: string }> {
    let response = await fetch(Urls["post-info"].replace("{postId}", postId.toString()), {
        "method": "GET",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
        },
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "post": json,
        }
    }
}

/**
 * 发帖.
 * @param title 标题
 * @param content 内容
 */
export async function submitPost(title: string, content: string)
    : Promise<{ success: true, postId: number } | { success: false, authorized: boolean, message: string }> {
    let response = await fetch(Urls["post"], {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        })
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "postId": json.postId,
        }
    }
}

/**
 * 编辑帖子.
 * @param postId 帖子ID
 * @param title 新标题
 * @param content 新内容
 */
export async function editPost(postId: number, title: string, content: string)
    : Promise<{ success: true, post: PostFull } | { success: false, authorized: boolean, message: string }> {
    let response = await fetch(Urls["edit-post"].replace("{postId}", postId.toString()), {
        "method": "PUT",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        })
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "post": json,
        }
    }
}

/**
 * 编辑回复.
 * @param postId 帖子ID
 * @param replyId 回复ID
 * @param content 新内容
 */
export async function editReply(postId: number, replyId: number, content: string)
    : Promise<{ success: true, post: PostFull } | { success: false, authorized: boolean, message: string }> {
    let response = await fetch(Urls["edit-reply"].replace("{postId}", postId.toString())
        .replace("{replyId}", replyId.toString()), {
        "method": "PUT",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: content,
        })
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "post": json,
        }
    }
}

/**
 * 回复回复.
 * @param postId 帖子ID
 * @param replyId 回复ID
 * @param content 内容
 */
export async function replyPost(postId: number, replyId: number, content: string)
    : Promise<{ success: true, post: PostFull } | { success: false, authorized: boolean, message: string }> {
    let response = await fetch(Urls["reply"].replace("{postId}", postId.toString()), {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Authorization": getToken() || "",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(replyId === 0 ? {
            content: content,
        } : {
            content: content,
            replyId: replyId,
        })
    });
    let json;
    try {
        json = await response.json();
    } catch (e) {
    }
    if (response.status !== 200) {
        return {
            "success": false,
            "authorized": (response.status !== 401),
            "message": translate(json.message || Strings["api/unknown_error"]),
        }
    } else {
        return {
            "success": true,
            "post": json,
        }
    }
}

/**
 * 是否已登录.
 */
function isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
}

/**
 * 当前的 token.
 */
function getToken(): string | null {
    return localStorage.getItem("token");
}

/**
 * 设置 token.
 * @param token token
 */
function setToken(token: string) {
    localStorage.setItem("token", token);
}

/**
 * 清除 token.
 */
function removeToken() {
    localStorage.removeItem("token");
}
