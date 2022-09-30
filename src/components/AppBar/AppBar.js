import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {createTheme, Grid, IconButton} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useState} from "react";
import {Link} from "react-router-dom";

import {themeOptions} from "../Theme/ThemeOptions";

const drawerWidth = 150;
const huldTheme = createTheme(themeOptions);

/*
App bar for the top of the web app, contains app name and drawermenu component
TODO: Better positioning, styling, burgermenu component functions
-AK
 */
const TopAppBar =() => {
    /*
    Anchors and toggles for the hamburgermenu-button
    -AK
     */
    const [anchorEl, setAnchorEl] = useState(false);
    const open = Boolean(anchorEl);
    function toggleDrawer() {setAnchorEl(!open)
    }
    return (
        <div>
            <AppBar
                /*
                Fixing drawer to be under appbar
                Fixing Appbar styling to fit ui-goal -AK
                 */
                position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 ,
                backgroundColor: huldTheme.palette.background.paper,
                color: huldTheme.palette.text.disabled,}}>
                <Toolbar>
                    <Grid
                        /*Grid containing out-for-lunch tittle and hamburgermenu,
                        gridding for ease of alignment -AK
                        */
                        container alignItems="center" spacing={0}>
                        <Grid item xs={2}>
                            <IconButton
                                id="icon-button"
                                onClick={toggleDrawer}>
                                <MenuIcon/>
                            </IconButton>
                        </Grid>

                        <Grid item xs={8}>
                            <Typography variant="h6" align="center">
                                Out for lunch
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Drawer
                /*
                Fixing drawer styleprops to fit ui-goals -AK
                 */
                PaperProps={{sx: {
                        backgroundColor: huldTheme.palette.background.paper,
                        color: huldTheme.palette.text.disabled,}}}
                /*
                 Using left anchoring temporary variant, width previously defin.
                  const -AK
                 */
                variant="temporary"
                sx={{[`& .MuiDrawer-paper`]: { width: drawerWidth},}}
                anchor='left' open={anchorEl} onClose={toggleDrawer}>
                <Toolbar />
                <Box>
                    <List
                        /* Listing menuitems, using router-dom to link
                        TODO: restaurant and group info -AK
                         */
                    >
                        <ListItemButton component={Link} onClick ={toggleDrawer} to="/main"
                        >Main page
                        </ListItemButton>

                        <ListItemButton component={Link} onClick ={toggleDrawer} to="/profile"> Profile
                        </ListItemButton>

                        {/*TODO: LOGOUT FUNCTION*/}
                        <ListItemButton component={Link} onClick ={toggleDrawer} to="/login"> Logout
                        </ListItemButton>
                    </List>
                    <Divider
                        /* TODO: Make it clearer, maybe dividers between
                     TODO: items, maybe dynamic list creation -> see below*/
                    />
                    <List>
                        {['Jotain', 'Muuta', 'Tarvittavaa'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Toolbar />
        </div>
    );
}
export default TopAppBar;