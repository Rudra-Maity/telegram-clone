import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, CircularProgress, Box, IconButton, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatList = ({ onSelectChat }) => {
  const theme = useTheme();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    fetch('https://devapi.beyondchats.com/api/get_all_chats?page=1')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.data) {
          setChatList(data.data.data);
        } else {
          console.error('Unexpected data format:', data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chat list:', error);
        setLoading(false);
      });
  }, []);

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
    onSelectChat(chatId);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ margin: 0, marginTop: 0, minHeight: 0, }}>
      <List>
        {chatList.map((chat) => (
          <ListItem
            button
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            sx={{
              backgroundColor: selectedChatId === chat.id ? theme.palette.primary.main : 'inherit',
              color: selectedChatId === chat.id ? theme.palette.primary.contrastText : 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.light : 'GrayText',
                color: theme.palette.mode === 'light' ? theme.palette.primary.contrastText : 'white',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar src={chat.creator.name} alt={chat.creator && chat.creator.name} />
            </ListItemAvatar>
            <ListItemText primary={chat.creator && chat.creator.name} secondary={chat.status} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
