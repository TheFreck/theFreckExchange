import { AppBar, Box, Button, Divider, Grid2, IconButton, Menu, MenuItem, MenuList, Modal, Paper, Select, Toolbar, Typography } from "@mui/material";
import { useContext, useRef, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Dropdown } from "@mui/base";
import { AccountContext } from "../Context";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ShoppingCart } from "../components/ShoppingCart";
import CloseIcon from '@mui/icons-material/Close';
import Checkout from "../components/Checkout";

export const Layout = (props) => {
    const {setUserView,userEnum,getShoppingCart} = useContext(AccountContext);
    const {login,logout} = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen,setCartOpen] = useState(false);
    const [checkoutOpen,setCheckoutOpen] = useState(false);
    const anchorEl = useRef();
    const cartRef = useRef();
    const checkouRef = useRef();


    return <Box sx={{ 
            width: "100%", 
            height: "98%",
            position: "absolute",
            top: 0    
        }}>
    <AppBar 
        sx={{
            opacity: .5,
            background: "gray"
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
                    <MenuItem onClick={() => {
                        setUserView(userEnum.home);
                    }}>
                        Return Home
                    </MenuItem>
                    {
                        localStorage.getItem("permissions.admin") !== null && 
                        <MenuList dense>
                            <MenuItem disabled>Admin</MenuItem>
                            <MenuItem onClick={() => {
                                setUserView(userEnum.createProduct);
                            }}>Create Product</MenuItem>
                            <MenuItem onClick={() => {
                                setUserView(userEnum.createItems);
                            }}>Create Items</MenuItem>
                            <MenuItem onClick={() => {
                                setUserView(userEnum.updateProduct);
                            }}>Update Product</MenuItem>
                            <MenuItem onClick={() => {
                                setUserView(userEnum.siteConfig)
                            }}>
                                Configure Site
                            </MenuItem>
                        </MenuList>
                    }
                    <Divider />
                    {
                        localStorage.getItem("permissions.user") !== null && 
                        <MenuList dense>
                            <MenuItem disabled>User</MenuItem>
                            <MenuItem onClick={() => {
                                setUserView(userEnum.shop);
                            }}>Go Shopping</MenuItem>
                            <MenuItem onClick={() => {
                                setUserView(userEnum.viewAccount);
                            }}>View Account</MenuItem>
                        </MenuList>
                    }
                </Menu>
            }
            </IconButton>
            </Dropdown>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, letterSpacing: "2em" }}>
                {localStorage.getItem("siteTitle")}
            </Typography>
            {getShoppingCart().length > 0 && 
            <Box>
                <Button onClick={() => {
                    setCheckoutOpen(false);
                    setCartOpen(!cartOpen);
                }}
                >
                    <ShoppingCartIcon sx={{color: "#d4ccb6"}} />
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
                        sx={{width: "80vw", margin: "10vh auto", padding: "1em", maxHeight: "80vh"}}
                        elevation={10}
                    >
                        <Grid2 container
                        >
                            <Grid2 size={11}>
                                <Typography
                                    variant="h4"
                                >
                                    Shopping Cart
                                </Typography>
                            </Grid2>
                            <Grid2 size={1}
                                sx={{display: "flex",flexDirection: "row-reverse"}}
                            >
                                <Button
                                    onClick={() => {
                                        setCheckoutOpen(false);
                                        setCartOpen(false);
                                    }}
                                >
                                    <CloseIcon fontSize="large"/>
                                </Button>
                            </Grid2>
                        </Grid2>
                        {!checkoutOpen &&
                            <ShoppingCart setCheckoutOpen={setCheckoutOpen} />
                        }
                        {checkoutOpen &&
                            <Checkout />
                        }
                    </Paper>
                </Modal>
                </Box>
            }
            {localStorage.getItem("loginToken") === null && <Button onClick={login} color="inherit">Login</Button>}
            {localStorage.getItem("loginToken") !== null && <Button onClick={logout} color="inherit">Logout</Button>}
        </Toolbar>
    </AppBar>
    {props.children}
  </Box>
}

export default Layout;