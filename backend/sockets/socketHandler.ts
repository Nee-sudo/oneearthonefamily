import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../models/ChatMessage';
import { ChatRoom } from '../models/ChatRoom';
import { getNextSequenceValue } from '../models/Counter';

export const setupSocketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 WebSockets: Client connected (${socket.id})`);

    // Listen to subscribe to a chat room channel
    socket.on('join_room', (data: { roomId: string | number }) => {
      const roomChannel = `room_${data.roomId}`;
      socket.join(roomChannel);
      console.log(`💬 WebSockets: Client ${socket.id} joined channel ${roomChannel}`);
    });

    // Real-time chat message exchange
    socket.on('send_message', async (data: { 
      roomId: number; 
      senderId: string; 
      senderName: string; 
      messageText: string; 
    }) => {
      try {
        const { roomId, senderId, senderName, messageText } = data;
        
        // Save to Database
        const nextId = await getNextSequenceValue('message_id');
        const newMessage = new ChatMessage({
          id: nextId,
          roomId,
          senderId,
          senderName,
          messageText,
          timestamp: Date.now()
        });
        
        await newMessage.save();

        // Update ChatRoom
        await ChatRoom.findOneAndUpdate(
          { id: roomId },
          {
            lastMessage: messageText,
            lastMessageTime: Date.now()
          }
        );

        // Broadcast to dynamic channel
        const roomChannel = `room_${roomId}`;
        io.to(roomChannel).emit('new_message', newMessage);
        
        console.log(`✉️ WebSockets: Message broadcasted in ${roomChannel}`);
      } catch (error) {
        console.error("WebSockets error on send_message:", error);
      }
    });

    // Broadcast feed update when a new post or reaction occurs
    socket.on('post_broadcast', (data: { type: string; postId?: number }) => {
      io.emit('feed_updated', data);
      console.log(`📢 WebSockets: Broadcasted feed update event [${data.type}]`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSockets: Client disconnected (${socket.id})`);
    });
  });
};
