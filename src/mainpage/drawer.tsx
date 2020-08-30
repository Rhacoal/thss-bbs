import React from "react";
import {Button, createStyles, Divider, List, ListItem, ListItemIcon, ListItemText, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {Store} from "../store";
import {Link} from "react-router-dom";
import {LocalUrls, Urls} from "../urls";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ViewListIcon from '@material-ui/icons/ViewList';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonIcon from '@material-ui/icons/Person';
import InfoIcon from '@material-ui/icons/Info';
import {Strings} from "../strings";

const drawerWidth = 240;

const useStyles = makeStyles(theme => createStyles({
    list: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'center',
    },
    verticalCenter: {
        display: "flex",
        alignItems: "center",
    }
}));

export function DrawerContents(props: any) {
    const classes = useStyles(useTheme());
    const userInfo = useSelector((store: Store) => store.user);
    return <React.Fragment>
        <div className={classes.drawerHeader}>
            <Button color="inherit" component={Link} to={LocalUrls.user()}>
                <span className={classes.verticalCenter}>
                    {userInfo ?
                        <React.Fragment><PersonIcon fontSize="small"/>{userInfo.nickname}</React.Fragment>
                        : (Strings["main/not_logged_in"])}
                </span>
            </Button>
        </div>
        <Divider/>
        <List className={classes.list}>
            {userInfo ?
                <React.Fragment>
                    <ListItem button component={Link} to={LocalUrls.postList()}>
                        <ListItemIcon><ViewListIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/post_list"]}/>
                    </ListItem>
                    <ListItem button component={Link} to={LocalUrls.createPost()}>
                        <ListItemIcon><EditIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/submit_post"]}/>
                    </ListItem>
                    <Divider/>
                    <ListItem button component={Link} to={LocalUrls.user()}>
                        <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/user_center"]}/>
                    </ListItem>
                    <ListItem button component={Link} to={LocalUrls.postList(userInfo.id)}>
                        <ListItemIcon><ViewListIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/self_post_list"]}/>
                    </ListItem>
                    <ListItem button component={Link} to={LocalUrls.viewHistory()}>
                        <ListItemIcon><HistoryIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/history"]}/>
                    </ListItem>
                    <ListItem button component={Link} to={LocalUrls.favorites()}>
                        <ListItemIcon><FavoriteIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/favorite"]}/>
                    </ListItem>
                    <Divider/>
                    <ListItem button component={Link} to={LocalUrls.about()}>
                        <ListItemIcon><InfoIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/about"]}/>
                    </ListItem>
                </React.Fragment>
                : <React.Fragment>
                    <ListItem button component={Link} to={LocalUrls.login()}>
                        <ListItemIcon><AccountCircleIcon/></ListItemIcon>
                        <ListItemText primary={Strings["main/drawer/login"]}/>
                    </ListItem>
                </React.Fragment>}
        </List>
    </React.Fragment>
}