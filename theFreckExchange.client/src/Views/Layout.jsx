import { AppBar, Box, Button, Divider, Grid2, IconButton, Menu, MenuItem, MenuList, Modal, Paper, Select, Toolbar, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Dropdown } from "@mui/base";
import { AuthContext } from "../Context";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ShoppingCart } from "../components/ShoppingCart";
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from "react-router";

export const Layout = (props) => {
    const { getShoppingCart,getConfig,isMobile,setSelectedProductName } = useContext(AuthContext);
    const {LoginButton} = props;
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [isUser,setIsUser] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [ready,setReady] = useState(false);
    const [siteName,setSiteName] = useState("");
    const anchorEl = useRef();
    const cartRef = useRef();

    useEffect(()=> {
        let config = getConfig();
        setSiteName(config?.siteTitle ? config.siteTitle : "The Freck Exchange");
        if(localStorage.getItem("loginToken")){
            setIsLoggedIn(true);
            if(localStorage.getItem("permissions.admin")){
                setIsAdmin(true);
            }
            if(localStorage.getItem("permissions.user")){
                setIsUser(true);
            }
        }
        setReady(true);
    },[]);

    const goHome = () => {
        setSelectedProductName("");
    }

    return <Box 
        sx={{
            width: "100%",
            height: "98%",
        }}
    >
        <AppBar
            sx={{
                opacity: .5,
                background: "gray",
            }}
        >
            <Toolbar>
                <Dropdown>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setMenuOpen(!menuOpen)}
                        ref={anchorEl}
                    >
                        <MenuIcon />

                        {
                            menuOpen &&
                            <Menu
                                open={menuOpen}
                                onClose={() => setMenuOpen(false)}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "left"
                                }}
                                anchorEl={() => anchorEl.current}
                            >
                                <NavLink to="/Home" onClick={goHome} end>
                                    <MenuItem>
                                        Return Home
                                    </MenuItem>
                                </NavLink>
                                {
                                    isAdmin &&
                                    <MenuList dense>
                                        <MenuItem disabled>Admin</MenuItem>
                                        <NavLink to="/Admin/Products/Create" end>
                                            <MenuItem>
                                                Create Product
                                            </MenuItem>
                                        </NavLink>
                                        <NavLink to="/Admin/Config" end>
                                            <MenuItem>
                                                Site Configuration
                                            </MenuItem>
                                        </NavLink>
                                        <NavLink to="/Admin/Products/Modify" end>
                                            <MenuItem>
                                                Modify Product
                                            </MenuItem>
                                        </NavLink>
                                        <NavLink to="/Admin/Items/Create" end>
                                            <MenuItem>
                                                Create Items
                                            </MenuItem>
                                        </NavLink>
                                    </MenuList>
                                }
                                <Divider />
                                {
                                    isUser && 
                                    <MenuList dense>
                                        <MenuItem disabled>User</MenuItem>
                                        <NavLink to="/User/Shopping" end>
                                            <MenuItem>
                                                Go Shopping
                                            </MenuItem>
                                        </NavLink>
                                        <NavLink to="User/Account" end>
                                            <MenuItem>
                                                View Account
                                            </MenuItem>
                                        </NavLink>
                                    </MenuList>
                                }
                            </Menu>
                        }
                    </IconButton>
                </Dropdown>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, letterSpacing: `${isMobile ? 0 : "2em"}` }}>
                    {siteName}
                </Typography>
                {isLoggedIn && getShoppingCart().length > 0 && 
                <Box>
                    <Button onClick={() => {
                        setCheckoutOpen(false);
                        setCartOpen(!cartOpen);
                    }}
                    >
                        <ShoppingCartIcon sx={{ color: "#d4ccb6" }} />
                    </Button>
                    <Modal
                        open={cartOpen}
                        onClose={() => {
                            setCheckoutOpen(false);
                            setCartOpen(false);
                        }}
                        ref={cartRef}
                    >
                        <Paper
                            sx={{ 
                                width: `${isMobile ? "90vw" : "80vw"}`, 
                                margin: "10vh auto", 
                                padding: "1em", 
                                maxHeight: "80vh" 
                            }}
                            elevation={10}
                        >
                            <Box
                                sx={{ 
                                    width: "100%", 
                                    display: "flex", 
                                    flexDirection: "row-reverse" 
                                }}
                            >
                                <Button
                                    sx={{}}
                                    onClick={() => {
                                        setCheckoutOpen(false);
                                        setCartOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize="large" />
                                </Button>
                            </Box>
                            <ShoppingCart setCheckoutOpen={setCartOpen} />
                        </Paper>
                    </Modal>
                </Box>
                }
                <LoginButton />
            </Toolbar>
        </AppBar>
        {props.children}
    </Box>
}

export default Layout;