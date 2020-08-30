import React from "react";
import {Strings} from "../strings";
import {Container, Typography} from "@material-ui/core";
import {PagedPostsView} from "../post/post_list_view";
import {ToolbarButtonGroup} from "../utils/shared_components";
import {createPostDigestFromHistoryEntry, getFavoritesList} from "../utils/utils";

/**
 * 用户收藏页.
 * @constructor
 */
export function FavoritesPage(props: { history: any }) {
    const favoriteList = getFavoritesList();
    return <Container maxWidth="lg">
        <ToolbarButtonGroup history={props.history} marginBottom={true}/>
        <div>{Strings["favorite/title"].replace("{count}", favoriteList.length.toString())}</div>
        {favoriteList.length ?
            <PagedPostsView posts={favoriteList.map(createPostDigestFromHistoryEntry)}/>
            : <Typography variant="h6" component="p">{Strings["favorite/no_favorite"]}</Typography>}
    </Container>
}