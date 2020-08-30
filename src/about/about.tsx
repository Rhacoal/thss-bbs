import React from "react";
import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import {ToolbarButtonGroup} from "../utils/shared_components";
import {Container, Divider, List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";

export function AboutPage(props: {
    history: any,
}) {
    return <Container maxWidth="md">
        <ToolbarButtonGroup history={props.history} marginBottom={true}/>
        <Typography variant="h4" component="h1">清软论坛前端</Typography>
        <Typography variant="body1" component="p">By: Rhacoal</Typography>
        <List>
            <Divider/>
            <ListItem button component="a" href={"https://github.com/Rhacoal"}>
                <ListItemIcon><GitHubIcon/></ListItemIcon>
                <ListItemText
                    primary={"GitHub"}
                    secondary={"https://github.com/Rhacoal"}
                />
            </ListItem>
            <Divider/>
            <ListItem button component="a" href={"https://rhacoal.com/"}>
                <ListItemIcon><HomeIcon/></ListItemIcon>
                <ListItemText
                    primary={"(空空如也的)个人主页"}
                    secondary={"https://rhacoal.com/"}
                />
            </ListItem>
            <Divider/>
            <ListItem button component="a" href={"mailto:rhacoal@gmail.com"}>
                <ListItemIcon><MailIcon/></ListItemIcon>
                <ListItemText
                    primary={"邮箱"}
                    secondary={"rhacoal@gmail.com"}
                />
            </ListItem>
            <Divider/>
        </List>
    </Container>
}