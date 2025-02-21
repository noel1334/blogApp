import Like from "../models/like.js";
import Post from "../models/post.js"; 

export const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const date = new Date();

  try {
    // Check if the user already liked the post
    const existingLike = await Like.findLike(postId, userId);

    if (existingLike) {
      // If liked, remove the like
      await Like.removeLike(postId, userId);
    } else {
      // Otherwise, add the like
      await Like.addLike(postId, userId, date);
    }

    // Fetch updated likes count
    const likesCount = await Like.countLikesByPostId(postId);

    res.status(200).json({ message: "Like toggled successfully", likesCount });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "An error occurred while toggling the like" });
  }
};

export const getLike = async (req, res) => {
  const { postId } = req.params;

  try {
    const likesCount = await Like.countLikesByPostId(postId);
    res.status(200).json({ likesCount });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "An error occurred while fetching likes" });
  }
};

export const checkIfLiked = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id; 

  try {
    const existingLike = await Like.findLike(postId, userId);
    res.status(200).json({ isLiked: !!existingLike });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ message: "Failed to check like status" });
  }
};


export const getLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await Like.getLikesByPostId(postId); 
    res.status(200).json({ likes }); 

  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
};

