import Ping from "@/components/Ping";
import { formatViews } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/writeClient";

// Helper function to manage views in local storage (or session-based tracking)
const hasViewed = (id: string) => {
  const viewed = localStorage.getItem("viewedPosts") || "[]";
  const parsed = JSON.parse(viewed) as string[];
  return parsed.includes(id);
};

const markAsViewed = (id: string) => {
  const viewed = localStorage.getItem("viewedPosts") || "[]";
  const parsed = JSON.parse(viewed) as string[];
  localStorage.setItem("viewedPosts", JSON.stringify([...parsed, id]));
};

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  if (typeof window !== "undefined" && !hasViewed(id)) {
    // Increment views only if the post hasn't been viewed in this session
    await writeClient
      .patch(id)
      .inc({ views: 1 }) // Increment by 1
      .commit();
    markAsViewed(id); // Mark as viewed in localStorage
  }

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">{formatViews(totalViews)}</span>
      </p>
    </div>
  );
};

export default View;
