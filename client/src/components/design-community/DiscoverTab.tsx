import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommunityDesignCard from "@/components/CommunityDesignCard";
import type { SharedDesign } from "@/types/designs";

interface Props {
  designs: SharedDesign[];
  setSelectedDesign: (id: string | null) => void;
  setShowRemixDialog: (v: boolean) => void;
  shareDesignMutation: any;
  likeDesignMutation: any;
  bookmarkDesignMutation: any;
  downloadDesignMutation: any;
}

export default function DiscoverTab({
  designs,
  setSelectedDesign,
  setShowRemixDialog,
  shareDesignMutation,
  likeDesignMutation,
  bookmarkDesignMutation,
  downloadDesignMutation,
}: Props) {
  const [localCategory, setLocalCategory] = useState("all");
  const [localSortBy, setLocalSortBy] = useState("trending");
  const [localSearch, setLocalSearch] = useState("");

  const filteredDesignsLocal = (designs || []).filter((design) => {
    const matchesCategory =
      localCategory === "all" || design.category === localCategory;
    const matchesSearch =
      localSearch === "" ||
      design.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      design.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      design.tags.some((tag) =>
        tag.toLowerCase().includes(localSearch.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const sortedDesignsLocal = [...filteredDesignsLocal].sort((a, b) => {
    switch (localSortBy) {
      case "trending":
        return (
          b.stats.views +
          b.stats.likes * 2 -
          (a.stats.views + a.stats.likes * 2)
        );
      case "recent":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "popular":
        return b.stats.likes - a.stats.likes;
      case "downloads":
        return b.stats.downloads - a.stats.downloads;
      default:
        return 0;
    }
  });

  return (
    <>
      <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search designs, creators, or tags..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <Select
              value={localCategory}
              onValueChange={(v) => setLocalCategory(v)}
            >
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="invitation">Invitations</SelectItem>
                <SelectItem value="decoration">Decorations</SelectItem>
                <SelectItem value="layout">Layouts</SelectItem>
                <SelectItem value="theme">Themes</SelectItem>
                <SelectItem value="logo">Logos</SelectItem>
                <SelectItem value="poster">Posters</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={localSortBy}
              onValueChange={(v) => setLocalSortBy(v)}
            >
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDesignsLocal.map((design) => (
          <CommunityDesignCard
            key={design.id}
            design={design}
            onViewDetails={(id) => setSelectedDesign(id)}
            onCreateRemix={(id) => {
              setSelectedDesign(id);
              setShowRemixDialog(true);
            }}
            onShare={(id) => shareDesignMutation.mutate(id)}
            onLike={(id) => likeDesignMutation.mutate(id)}
            onBookmark={(id) => bookmarkDesignMutation.mutate(id)}
            onDownload={(id) => downloadDesignMutation.mutate(id)}
          />
        ))}
      </div>
    </>
  );
}
