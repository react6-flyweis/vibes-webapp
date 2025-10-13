import React, { useEffect, useRef } from "react";

import { useNavigate } from "react-router";
import { useEventsByAuthQuery } from "@/queries/events";

export default function EventPlanningAuth() {
  const navigate = useNavigate();
  const navigatedRef = useRef(false);

  const { data, isLoading, isError } = useEventsByAuthQuery();

  useEffect(() => {
    if (!data || navigatedRef.current) return;
    if (data.length) {
      const first = data[0];
      // prefer numeric event_id if present, otherwise fallback to _id
      const id = first.event_id ?? first._id;
      navigatedRef.current = true;
      navigate(`/plan-event/${id}`);
    }
  }, [data, navigate]);

  if (isLoading) return <div>Loading events...</div>;
  //   if (isError) return <div>Failed to load events. Please try again later.</div>;

  //   const hasEvents = !!(
  //     data && data.success && Array.isArray(data.data) && data.data.length > 0
  //   );

  //   if (!hasEvents) {
  // If no events exist, show options to create or view list
  return (
    <div style={{ padding: 24 }}>
      <h2>No events found to plan</h2>
      <p>
        You don't have any events yet. Create a new event or view the list of
        events.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={() => navigate("/create-event")}>
          Create New Event
        </button>
        <button onClick={() => navigate("/events")}>List Events</button>
      </div>
    </div>
  );
}

// If there are events, we're navigating — render nothing to avoid flicker.
//   return null;
// }
