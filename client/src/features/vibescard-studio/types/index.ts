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
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  premium: boolean;
  elements: DesignElement[];
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
