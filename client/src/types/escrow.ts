export type EscrowTransactionItem = {
  title: string;
  description?: string;
  quantity?: number;
  inspection_period?: number;
  type?: string;
  price: number; // expressed as cents or main currency units depending on API
};

export type EscrowTransactionParty = {
  role: "buyer" | "seller" | string;
  customer: {
    email?: string;
    name?: string;
  };
};

export type EscrowTransactionRequest = {
  currency: string;
  description?: string;
  items: EscrowTransactionItem[];
  parties: EscrowTransactionParty[];
  asCustomer?: string; // optional override
};

export type EscrowTransactionResponse = {
  id?: string; // transaction id returned by provider
  status?: string; // provider status: pending/created/failed
  raw?: any; // raw response body for debugging until typed
};

export default {} as const;
