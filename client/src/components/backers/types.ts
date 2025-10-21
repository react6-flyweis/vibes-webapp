export type Provider = {
  id: string;
  name: string;
  status: "Active" | "Pending" | "Disabled" | string;
  lastTested?: string | null;
  editable?: boolean;
};

export type Comment = {
  id: string;
  user: string;
  date: string;
  text: string;
  status: "Approved" | "Pending" | string;
  actions?: any;
};

export type Notification = {
  id: string;
  title: string;
  date: string;
  type: string;
  sentTo: string;
  status: string;
  actions?: Array<{ label: string; className?: string }>;
};

export type Receipt = {
  id: string;
  transactionId: string;
  backer: string;
  amount: string;
  provider: string;
  status: string;
  date: string;
  action: "download" | "retry" | string;
};

export type ShareLink = {
  id: string;
  platform: string;
  short: string;
  clicks: number;
  conversions: number;
  action: "copy" | "download" | string;
};
