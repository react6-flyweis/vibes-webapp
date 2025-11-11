export type TicketDetail = {
  ticket_type_id: number;
  ticket_query: string;
  price: number;
};

export type TicketTypeForm = {
  ticket_type_id: number;
  ticket_query: string;
  price: string;
};

export type CreateEventTicketPayload = {
  ticketDetails: TicketDetail[];
};
