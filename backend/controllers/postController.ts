import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
import { getNextSequenceValue } from '../models/Counter';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: String(category) } : {};
    
    // Reverse chronological order
    const posts = await Post.find(filter).sort({ timestamp: -1 });
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    
    // Assign a new auto-increment ID
    const nextId = await getNextSequenceValue('post_id');
    
    const newPost = new Post({
      ...postData,
      id: nextId,
      timestamp: Date.now(),
      knowledgeValue: 0,
      contributionProof: 0,
      reactedWiseUsers: "",
      reactedHelpfulUsers: "",
      reactedInspiringUsers: ""
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error: any) {
    console.error("Create Post Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const reactToPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId, reactionType } = req.body; // reactionType can be 'wise', 'helpful', 'inspiring', or emojis

    if (!userId || !reactionType) {
       res.status(400).json({ error: "userId and reactionType are required." });
       return;
    }

    const post = await Post.findOne({ id: Number(postId) });
    if (!post) {
       res.status(404).json({ error: "Post not found." });
       return;
    }

    const cleanType = String(reactionType).toLowerCase().trim();
    const cleanUserId = String(userId).trim();

    let reactedField: 'reactedWiseUsers' | 'reactedHelpfulUsers' | 'reactedInspiringUsers' = 'reactedWiseUsers';
    let counterField: 'knowledgeValue' | 'contributionProof' | 'reputationImpact' = 'knowledgeValue';
    let creditsAward: { kb: number, cb: number } = { kb: 0, cb: 0 };

    if (cleanType.includes('wise') || cleanType.includes('🧠')) {
      reactedField = 'reactedWiseUsers';
      counterField = 'knowledgeValue';
      creditsAward = { kb: 2, cb: 0 };
    } else if (cleanType.includes('helpful') || cleanType.includes('🔥') || cleanType.includes('🤝')) {
      reactedField = 'reactedHelpfulUsers';
      counterField = 'contributionProof';
      creditsAward = { kb: 0, cb: 2 };
    } else {
      reactedField = 'reactedInspiringUsers';
      counterField = 'reputationImpact';
      creditsAward = { kb: 1, cb: 1 };
    }

    const currentReactedStr = post[reactedField] || "";
    let reactedList = currentReactedStr.split(',').map(s => s.trim()).filter(Boolean);

    let isAdded = false;
    if (reactedList.includes(cleanUserId)) {
      // Toggle off / remove
      reactedList = reactedList.filter(id => id !== cleanUserId);
      post[counterField] = Math.max(0, post[counterField] - 1);
    } else {
      // Add reaction
      reactedList.push(cleanUserId);
      post[counterField] = (post[counterField] || 0) + 1;
      isAdded = true;
    }

    post[reactedField] = reactedList.join(',');
    await post.save();

    // If award is earned, apply credits to original author
    if (isAdded && post.authorId) {
      const author = await User.findOne({
        $or: [
          { _id: post.authorId },
          { email: post.authorId },
          { username: post.authorId }
        ]
      });
      if (author) {
        author.knowledgeCredits = (author.knowledgeCredits || 0) + creditsAward.kb;
        author.contributionCredits = (author.contributionCredits || 0) + creditsAward.cb;
        author.reputationScore = Math.min(100, (author.reputationScore || 98) + 1);
        await author.save();
      }
    }

    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const result = await Post.deleteOne({ id: Number(postId) });
    res.status(200).json({ success: result.deletedCount > 0 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Comments REST actions
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId: Number(postId) }).sort({ timestamp: 1 });
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const commentData = req.body;
    
    const nextId = await getNextSequenceValue('comment_id');
    const comment = new Comment({
      ...commentData,
      id: nextId,
      postId: Number(postId),
      timestamp: Date.now()
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
