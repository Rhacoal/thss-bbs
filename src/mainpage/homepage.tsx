import React from "react";
import {Button, Container, createStyles, TextField, Typography, useTheme} from "@material-ui/core";
import {formatMessage, Strings} from "../strings";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {Store, tokenSlice} from "../store";
import {PostListViewPage} from "./post_list_page";

function UnloggedInPage(props: any) {
    return <Container maxWidth="sm" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }}>
        <Typography variant="h6" component="h1">{Strings["main/welcome_title"]}</Typography>
        <Typography variant="body1">{Strings["main/welcome_content"]}</Typography>
        <Button variant="contained"
                component={Link}
                to="/login"
                color="primary"
                style={{
                    marginTop: "16px",
                }}
        >{Strings["login/login"]}</Button>
    </Container>;
}

export function HomePage(props: {
    location: {
        search: string
    }, history: any,
}) {
    const token = useSelector((store: Store) => store.token);
    const [emptyState, setEmptyState] = React.useState(false);
    React.useEffect(() => {
        setEmptyState(!emptyState);
    }, [props.location.search]);
    let params = new URLSearchParams(props.location.search);
    return token != null ?
        <PostListViewPage history={props.history}
                          userId={params.get("user_id")}/>
        : <UnloggedInPage/>;
}