import { AppBar, Box, Button, Divider, IconButton, Menu, MenuItem, MenuList, Modal, Select, Toolbar, Typography } from "@mui/material";
import { useContext, useRef, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { Dropdown } from "@mui/base";
import { AccountContext } from "../Context";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ShoppingCart } from "../components/ShoppingCart";

export const Layout = (props) => {
    const {setUserView,userEnum,getShoppingCart} = useContext(AccountContext);
    const {login,logout} = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartOpen,setCartOpen] = useState(false);
    const anchorEl = useRef();
    const cartRef = useRef();

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
                <Button onClick={() => setCartOpen(!cartOpen)} ><ShoppingCartIcon sx={{color: "#d4ccb6"}} /></Button>
                <Modal
                    open={cartOpen}
                    onClose={() => setCartOpen(false)}
                    ref={cartRef}
                >
                    <Box>
                        <ShoppingCart />
                    </Box>
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