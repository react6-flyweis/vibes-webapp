import { useState } from "react";
import { EventDetails } from "../types";

export function useEventDetails() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventMessage, setEventMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [hostName, setHostName] = useState("");

  const eventDetails: EventDetails = {
    title: eventTitle,
    message: eventMessage,
    date: eventDate,
    location: eventLocation,
    hostName,
  };

  return {
    eventTitle,
    setEventTitle,
    eventMessage,
    setEventMessage,
    eventDate,
    setEventDate,
    eventLocation,
    setEventLocation,
    hostName,
    setHostName,
    eventDetails,
  };
}
