import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Avatar, IconButton, InputBase, AppBar, Toolbar, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

const ChatMessages = ({ chatId, onBack }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState({});
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch chat messages
    fetch(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setMessages(data.data);
        } else {
          console.error('Unexpected data format:', data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
        setLoading(false);
      });

    // Fetch receiver details (assuming the receiver details are part of the chat data)
    fetch(`https://devapi.beyondchats.com/api/get_all_chats?page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.data) {
          const chat = data.data.data.find((chat) => chat.id === chatId);
          if (chat) setReceiver(chat.creator);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching receiver details:', error);
      });
  }, [chatId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="default">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={onBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar src={receiver.name} alt={receiver.name} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography color="inherit" variant="subtitle1">{receiver.name}</Typography>
            <Typography variant="body2" color="primary">online</Typography>
          </Box>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2, backgroundImage: 'url("https://i.pinimg.com/236x/d2/bf/d3/d2bfd3ea45910c01255ae022181148c4.jpg")' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender_id === receiver.id ? 'flex-start' : 'flex-end', marginBottom: 2 }}>
            <Paper
              sx={{
                padding: 2,
                backgroundColor: msg.sender_id === receiver.id
                  ? theme.palette.mode === 'dark' ? 'rgb(70, 70, 70)' : 'rgb(197, 228, 188)'
                  : theme.palette.mode === 'dark' ? 'rgb(50, 50, 50)' : 'white',
                borderRadius: msg.sender_id === receiver.id ? '10px 10px 0 10px' : '10px 10px 10px 0',
                maxWidth: '60%',
                wordWrap: 'break-word',
              }}
            >
              <Typography variant="body2">{msg.message}</Typography>
              <Typography sx={{ float: 'right', fontSize: '12px', color: 'gray' }}>
                {new Date(msg.created_at).toLocaleString()}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, }}>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <InputBase
          sx={{ flexGrow: 1, marginLeft: 1, color: theme.palette.text.primary }}
          placeholder="Write a message..."
        />
        <IconButton>
          <EmojiEmotionsIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatMessages;
