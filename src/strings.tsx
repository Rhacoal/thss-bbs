export const Strings = {
    "api/illegal_json": "服务器返回了一个非法的 JSON",
    "api/unknown_error": "未知的错误",
    "api/ok": "ok",

    "main/title": "清软论坛",
    "main/not_logged_in": "未登录",
    "main/go_homepage": "返回主页",
    "main/go_back": "返回上一页",

    "main/welcome_title": "欢迎来到清软论坛！",
    "main/welcome_content": "你还没有登录！登录以查看精彩内容..",
    "main/user_post_list": "{nickname} 的发帖记录",
    "main/refresh": "刷新",
    "main/favorite": "收藏",
    "main/post_list": "帖子列表",

    "main/drawer/login": "登录",
    "main/drawer/user_center": "个人中心",
    "main/drawer/post_list": "帖子列表",
    "main/drawer/submit_post": "发帖",
    "main/drawer/self_post_list": "发帖记录",
    "main/drawer/history": "浏览历史",
    "main/drawer/favorite": "我的收藏",
    "main/drawer/about": "关于",

    "posts/user_loading_failed": "用户信息加载失败: {message}",
    "posts/illegal_user_id": "无效的 user id",
    "posts/loading_failed": "页面加载失败：{message}",
    "posts/jump_to": "转到",

    "posts/apply_options": "确定",
    "posts/cancel_options": "取消",
    "posts/order_way": "排序方式",
    "posts/order_by_reply": "最新回复",
    "posts/order_by_post": "主贴编辑",
    "posts/filter": "筛选用户发帖",
    "posts/apply_filter": "确定",

    "post/poster": "发帖人",
    "post/create_time": "发帖时间",
    "post/update_time": "最后编辑",
    "post/edit": "编辑",
    "post/reply": "回复",
    "post/reply_to": "回复给: {nickname}",
    "post/show_html": "显示HTML内容",
    "post/hide_html": "隐藏HTML内容",
    "post/jump_to_reply": "查看回复",
    "post/fold_replies": "收起回复",
    "post/more_replies": "更多回复",

    "post/view_user_info": "个人资料",
    "post/poster_only": "只看楼主",
    "post/cancel_poster_only": "取消只看楼主",

    "post/expand_image": "⬇点击展开图片",
    "post/fold_image": "⬆点击折叠图片",
    "post/expand_spoiler": "展开隐藏内容",
    "post/fold_spoiler": "收起隐藏内容",

    "post_create/create_post": "创建帖子",
    "post_create/placeholder_title": "标题",
    "post_create/placeholder_content": "正文内容",
    "post_create/submit": "提交",

    "reply_edit/title_prefix": "回复: {title}",

    "user/create_time": "注册时间",
    "user/show_user_post": "发帖记录",
    "user/show_self_post": "发帖记录",
    "user/show_history": "浏览历史",
    "user/show_favorites": "我的收藏",
    "user/username": "用户名",
    "user/id": "ID",
    "user/nickname": "昵称",

    "history/title": "浏览历史 ({count})",
    "history/clear_history": "清除所有记录",

    "favorite/title": "我的收藏 ({count})",
    "favorite/no_favorite": "暂时没有收藏",

    "login/title": "清软论坛",
    "login/login": "登录",
    "login/username": "用户名",
    "login/password": "密码",
    "login/failed": "登录失败: {message}",
    "login/logout": "登出",
};

const translations : {[message: string] : string} = {
    "user not found": "用户不存在",
}

export function translate(message: string): string {
    return translations[message] || message;
}
export function formatMessage(key: keyof typeof Strings, message: string) : string {
    return Strings[key].replace("{message}", message);
}
