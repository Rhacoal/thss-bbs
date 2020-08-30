import React from "react";
import {Button, ButtonGroup, Container} from "@material-ui/core";
import {Strings} from "../strings";
import {PagedPostsView, PostListView} from "../post/post_list_view";
import {GoBack, GoHome, ToolbarButtonGroup} from "../utils/shared_components";
import {clearHistory, createPostDigestFromHistoryEntry, getViewHistory} from "../utils/utils";

export function HistoryPostView(props: {}) {
    const historyList = getViewHistory();
    // 没有用，单纯是为了刷新显示
    const [historyStatus, setHistoryStatus] = React.useState(true);
    return <React.Fragment>
        <div>{Strings["history/title"].replace("{count}", historyList.length.toString())}&nbsp;
            {historyList.length > 0 ?
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                        clearHistory();
                        setHistoryStatus(!historyStatus);
                    }}
                >
                    {Strings["history/clear_history"]}
                </Button> : undefined}
        </div>
        <PagedPostsView posts={historyList.map(createPostDigestFromHistoryEntry)}/>
    </React.Fragment>
}

/**
 * 用户浏览历史页.
 * @constructor
 */
export function HistoryPage(props: { history: any }) {
    return <Container maxWidth="lg">
        <ToolbarButtonGroup history={props.history} marginBottom={true}/>
        <HistoryPostView/>
    </Container>;
}