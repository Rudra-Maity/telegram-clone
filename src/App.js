import React, { useState, useMemo } from 'react';
import {
  Box, CssBaseline, Drawer, TextField, IconButton, Toolbar, Typography,
  List, ListItem, ListItemText, Divider, Avatar, Switch, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatList from './Chats';
import ChatMessages from './ChatMessages';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const App = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
    }), [darkMode]
  );
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ?600:300;
  const sidebarWidth = 240;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <CssBaseline />
        {(!isMobile || !selectedChat) && (
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={!isMobile || !selectedChat}
            onClose={handleSidebarClose}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', maxWidth: '100vw' },
            }}
          >
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search"
                sx={{
                  marginLeft: 2,
                  '& .MuiInputBase-input': {
                    padding: '8px',
                  },
                }}
              />
            </Toolbar>
            <Box sx={{ overflow: 'auto', flex: 2 }}>
              <ChatList onSelectChat={setSelectedChat} />
            </Box>
          </Drawer>
        )}
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={handleSidebarClose}
          sx={{
            [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap>
              <Avatar src='https://cdn-icons-png.flaticon.com/128/2111/2111646.png' alt='app' />
            </Typography>
            <Switch checked={darkMode} onChange={handleThemeChange} />
          </Toolbar>
          <Divider />
          <List>
            <ListItem button >
              <Avatar src='s' alt='s' sx={{ backgroundColor: "Highlight" }} />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', backgroundImage: 'url("https://i.pinimg.com/236x/d2/bf/d3/d2bfd3ea45910c01255ae022181148c4.jpg")' }}>
          {selectedChat ? (
            <ChatMessages chatId={selectedChat} onBack={() => setSelectedChat(null)} />
          ) : (
            <Typography color="primary" sx={{textAlign:"center",fontSize :"34px"}}>Select a chat to view messages</Typography>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
