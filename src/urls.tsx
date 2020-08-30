export const Urls = {
    "hello": "/api/v1/hello", // 测试 API. GET
    "hello-user": "/api/v1/hello-user", // 测试 API. GET
    "login": "/api/v1/login", // PATCH
    "logout": "/api/v1/logout", // PATCH
    "user": "/api/v1/user", // GET
    "other-user": "/api/v1/user/{userId}", // GET
    "post": "/api/v1/post", // GET, POST
    "edit-post": "/api/v1/post/{postId}", // PUT
    "post-info": "/api/v1/post/{postId}", // GET
    "reply": "/api/v1/post/{postId}/reply", // POST
    "edit-reply": "/api/v1/post/{postId}/reply/{replyId}", // POST
}

export const LocalUrls = {

    postList: function (userId?: number | string) {
        return `/${userId !== undefined ? `?user_id=${userId}` : ""}`;
    },

    post: function (postId: number | string, posterOnly : boolean = false) {
        return `/post/${postId}${posterOnly ? "?posterOnly=1" : ""}`;
    },

    replyToPost: function (postId: number | string) {
        return `/reply/${postId}`;
    },

    replyToReply: function (postId: number | string, replyId: number | string) {
        return `/reply/${postId}/${replyId}`
    },

    editPost: function (postId: number | string) {
        return `/edit-post/${postId}`;
    },

    editReply: function (postId: number | string, replyId: number | string) {
        return `/edit-reply/${postId}/${replyId}`
    },

    user: function (userId?: number | string) {
        return userId === undefined ? "/user" : `/user/${userId}`;
    },

    login: function() {
        return "/login";
    },

    createPost: function() {
        return "/submit-post";
    },

    viewHistory: function() {
        return "/history";
    },

    favorites: function() {
        return "/favorites";
    },

    about: function() {
        return "/about";
    }
}