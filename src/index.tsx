import "normalize.css/normalize.css";
import React from "react";
import ReactDOM from 'react-dom';
import {createMuiTheme, Theme, AppBar, Toolbar, IconButton, Typography, ThemeProvider, Drawer} from "@material-ui/core";
import {Strings} from "./strings";
import {LoginPage} from "./user/login_page";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HomePage} from "./mainpage/homepage";
import {Provider} from "react-redux";
import {store} from "./store";
import MenuIcon from "@material-ui/icons/Menu";
import {UserBarInfo} from "./user/user_bar_view";
import {PostPage} from "./post/post_detail_page";
import {UserInfoPage} from "./user/user_page";
import {DrawerContents} from "./mainpage/drawer";
import {HistoryPage} from "./user/history_page";
import {FavoritesPage} from "./user/favorites_page";
import {AboutPage} from "./about/about";
import {PageNotFoundPage} from "./page_not_found/page_not_found";
import {PostEditPage, PostSubmitPage, ReplyEditPage, ReplyPage} from "./post/post_edit_pages";

class App extends React.Component<{}, { drawerOpen: boolean }> {
    theme: Theme;

    constructor(props: {}) {
        super(props);
        this.theme = createMuiTheme();
        this.state = {
            drawerOpen: false,
        };
    }

    render(): React.ReactNode {
        return (
            <ThemeProvider theme={this.theme}>
                <div style={{
                    color: this.theme.palette.text.primary,
                    backgroundColor: this.theme.palette.background.default, "minHeight": "100%"
                }}>
                    <BrowserRouter>
                        <AppBar position="fixed">
                            <Toolbar>
                                <IconButton color="inherit"
                                            aria-label="open drawer"
                                            onClick={() => this.setState({drawerOpen: true})}
                                            edge="start"
                                            style={{
                                                marginRight: this.theme.spacing(2),
                                            }}
                                >
                                    <MenuIcon/>
                                </IconButton>
                                <Typography variant="h6" color="inherit">
                                    {Strings["main/title"]}
                                </Typography>
                                <UserBarInfo/>
                            </Toolbar>
                        </AppBar>
                        <Toolbar/>

                        <Drawer anchor="left" open={this.state.drawerOpen}
                                onClose={() => this.setState({drawerOpen: false})}>
                            <div onClick={() => this.setState({drawerOpen: false})}>
                                <DrawerContents />
                            </div>
                        </Drawer>

                        <div style={{height: this.theme.spacing(1)}}/>
                        <div style={{overflow: "auto", height: `calc(100vh - ${64 + this.theme.spacing(2)}px)`}}>
                            <Switch>
                                <Route exact path="/" component={HomePage}/>
                                <Route path='/login' component={LoginPage}/>
                                <Route path='/submit-post' component={PostSubmitPage}/>
                                <Route path='/edit-post/:postId' component={PostEditPage}/>
                                <Route path='/edit-reply/:postId/:replyId' component={ReplyEditPage}/>
                                <Route path='/reply/:postId/:replyId?' component={ReplyPage}/>
                                <Route path='/post/:postId' component={PostPage}/>
                                <Route path='/user/:userId?' component={UserInfoPage}/>
                                <Route path='/history' component={HistoryPage}/>
                                <Route path='/favorites' component={FavoritesPage}/>
                                <Route path='/about' component={AboutPage}/>
                                <Route component={PageNotFoundPage}/>
                            </Switch>
                        </div>
                        <div style={{height: this.theme.spacing(1)}}/>
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        );
    }
}

ReactDOM.render(
    (<Provider store={store}><App/></Provider>),
    document.getElementById('root')
);
