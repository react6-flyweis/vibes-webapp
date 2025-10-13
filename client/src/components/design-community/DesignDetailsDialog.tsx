import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy, Download, Heart } from "lucide-react";
import type { SharedDesign, DesignComment } from "@/types/designs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Props {
  design: SharedDesign;
  onLike: () => void;
  onDownload: () => void;
  onOpenRemix: () => void;
  onShare: () => void;
}

export default function DesignDetailsDialog({
  design,
  onLike,
  onDownload,
  onOpenRemix,
  onShare,
}: Props) {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const { data: comments = [] } = useQuery<DesignComment[]>({
    queryKey: ["/api/designs/comments", design.id],
    enabled: !!design.id,
    refetchInterval: 15000,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (data: { designId: string; content: string }) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${data.designId}/comments`,
        data
      );
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your feedback has been posted",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/designs/comments", design.id],
      });
    },
  });
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">{design.title}</DialogTitle>
        <DialogDescription className="text-gray-400">
          {design.description}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Images */}
        <div className="space-y-4">
          <img
            src={design.previewImages[0]}
            alt={design.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="grid grid-cols-3 gap-2">
            {design.previewImages.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index + 2}`}
                className="w-full h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Design Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={design.creator.avatar} />
              <AvatarFallback>{design.creator.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{design.creator.name}</span>
                {design.creator.verified && (
                  <Badge className="bg-blue-500 text-white text-xs">✓</Badge>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {design.creator.followers} followers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Category:</span>
              <span className="ml-2 text-white">{design.category}</span>
            </div>
            <div>
              <span className="text-gray-400">Difficulty:</span>
              <span className="ml-2 text-white capitalize">
                {design.difficulty}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Time:</span>
              <span className="ml-2 text-white">
                {design.timeToComplete} minutes
              </span>
            </div>
            <div>
              <span className="text-gray-400">License:</span>
              <span className="ml-2 text-white capitalize">
                {design.license}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-gray-400 text-sm">Tools used:</span>
            <div className="flex flex-wrap gap-1">
              {design.tools.map((tool) => (
                <Badge key={tool} variant="outline" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-gray-400 text-sm">Color palette:</span>
            <div className="flex gap-2">
              {design.colors.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded border border-white/20"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {design.isRemix && design.originalDesign && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400 text-sm">
                <Copy className="h-4 w-4" />
                <span>
                  Remix of "{design.originalDesign.title}" by{" "}
                  {design.originalDesign.creator}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 text-center p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-lg font-bold text-white">
                {design.stats.views}
              </div>
              <div className="text-xs text-gray-400">Views</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {design.stats.likes}
              </div>
              <div className="text-xs text-gray-400">Likes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {design.stats.downloads}
              </div>
              <div className="text-xs text-gray-400">Downloads</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {design.stats.remixes}
              </div>
              <div className="text-xs text-gray-400">Remixes</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onLike}
              className={`flex-1 ${
                design.isLiked
                  ? "bg-red-500/20 border-red-500 text-red-400"
                  : "bg-white/10"
              }`}
              variant="outline"
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  design.isLiked ? "fill-current" : ""
                }`}
              />
              {design.isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              onClick={onDownload}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={onOpenRemix} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Create Remix
            </Button>
            <Button onClick={onShare} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your thoughts on this design..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={() =>
                addCommentMutation.mutate({
                  designId: design.id,
                  content: newComment,
                })
              }
              disabled={!newComment.trim()}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Post Comment
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {comments.map((comment: DesignComment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-3 bg-white/5 rounded-lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
