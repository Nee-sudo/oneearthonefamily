import { Request, Response } from 'express';
import { ChatRoom } from '../models/ChatRoom';
import { ChatMessage } from '../models/ChatMessage';
import { getNextSequenceValue } from '../models/Counter';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await ChatRoom.find().sort({ lastMessageTime: -1 });
    res.status(200).json(rooms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const roomData = req.body;
    
    // Check if room with this participantName already exists to avoid duplication
    const participantName = roomData.participantName ? String(roomData.participantName).trim() : '';
    const existing = await ChatRoom.findOne({ participantName: { $regex: new RegExp(`^${participantName}$`, "i") } });
    
    if (existing) {
       res.status(200).json(existing);
       return;
    }

    // Enforce max 3 active connections constraint
    const activeCount = await ChatRoom.countDocuments({ isActive: true });
    const makeActive = activeCount < 3;

    const nextId = await getNextSequenceValue('room_id');
    const newRoom = new ChatRoom({
      ...roomData,
      id: nextId,
      isActive: makeActive,
      isWaiting: !makeActive,
      lastMessageTime: Date.now()
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error: any) {
    console.error("Create ChatRoom Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await ChatMessage.find({ roomId: Number(roomId) }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messageData = req.body;

    const nextId = await getNextSequenceValue('message_id');
    const newMessage = new ChatMessage({
      ...messageData,
      id: nextId,
      roomId: Number(roomId),
      timestamp: Date.now()
    });

    await newMessage.save();

    // Update parent room details
    await ChatRoom.findOneAndUpdate(
       { id: Number(roomId) },
       { 
         lastMessage: messageData.messageText || "",
         lastMessageTime: Date.now()
       }
    );

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const swapOrActivateRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = await ChatRoom.findOne({ id: Number(roomId) });

    if (!room) {
       res.status(404).json({ error: "Room not found." });
       return;
    }

    if (room.isActive) {
       res.status(200).json(room);
       return;
    }

    // Check active rooms
    const activeCount = await ChatRoom.countDocuments({ isActive: true });
    if (activeCount >= 3) {
       res.status(400).json({ error: "Active dialogue slots are full. Archive a slot starting with index swapping." });
       return;
    }

    room.isActive = true;
    room.isWaiting = false;
    await room.save();

    res.status(200).json(room);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const archiveRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = await ChatRoom.findOne({ id: Number(roomId) });

    if (!room) {
       res.status(404).json({ error: "Room not found." });
       return;
    }

    room.isActive = false;
    room.isWaiting = true;
    await room.save();

    res.status(200).json(room);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
