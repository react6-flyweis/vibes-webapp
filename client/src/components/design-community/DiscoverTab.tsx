import React, { useState } from "react";
import { Search } from "lucide-react";
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
import { useCommunityDesignsQuery } from "@/queries/communityDesigns";

export default function DiscoverTab() {
  // Use community designs from the API
  const { data: designs = [], isLoading } = useCommunityDesignsQuery();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [search, setSearch] = useState("");

  const filteredDesigns = (designs || []).filter((design) => {
    const matchesCategory = category === "all" || design.category === category;
    const matchesSearch =
      search === "" ||
      design.title.toLowerCase().includes(search.toLowerCase()) ||
      design.description.toLowerCase().includes(search.toLowerCase()) ||
      design.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <Select value={category} onValueChange={(v) => setCategory(v)}>
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

            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
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

      {/* Results grid / Loading / Empty state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-white/10 bg-black/30 p-4 flex flex-col gap-3"
              aria-hidden
            >
              <div className="h-40 bg-white/5 rounded-md" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
              <div className="h-3 w-1/2 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : sortedDesigns.length === 0 ? (
        <div className="col-span-full">
          <Card className="border-dashed border-white/10 bg-black/30">
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-white mb-2">
                No designs found
              </h3>
              <p className="text-sm text-gray-300 max-w-xl mx-auto">
                We couldn't find any community designs matching your search or
                filters. Try clearing filters or searching for something else.
              </p>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setCategory("all");
                    setSortBy("trending");
                    setSearch("");
                  }}
                  className="inline-flex items-center px-4 py-2 mt-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Clear filters
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDesigns.map((design) => (
            <CommunityDesignCard key={design.id} design={design} />
          ))}
        </div>
      )}
    </>
  );
}
