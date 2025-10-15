export interface DesignElement {
  id: string;
  type: "text" | "image" | "shape" | "background" | "logo" | "border";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  content: any;
  style: any;
  dataField?: "title" | "message" | "date" | "location" | "hostName"; // Maps to EventDetails fields
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  premium: boolean;
  elements: DesignElement[];
  // optional explicit palette for UI previews
  palette?: string[];
  // optional preview image path
  preview?: string;
  style: any;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface EventDetails {
  title: string;
  message: string;
  date: string;
  location: string;
  hostName: string;
}
