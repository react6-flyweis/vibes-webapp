export default function useTicketDownloader() {
  const formatMoney = (val: any) => {
    if (val === null || val === undefined || val === "") return "-";
    const num = Number(val);
    if (Number.isNaN(num)) return String(val);
    return `$${num.toFixed(2)}`;
  };

  const renderTicketSection = (t: any) => {
    const title = t.ticket_title || t.title || "Ticket";
    const qty = t.quantity ?? "-";
    const price = formatMoney(t.price_per_ticket ?? t.price ?? null);
    const subtotal = formatMoney(
      t.item_subtotal ?? t.subtotal ?? t.total ?? null
    );

    return `
      <div class="ticket-item">
        <div class="ticket-details">
          <div class="ticket-title">${title}</div>
          <div class="ticket-meta">Quantity: ${qty} &times; ${price}</div>
        </div>
        <div class="ticket-price">
          ${subtotal}
        </div>
      </div>`;
  };

  const renderTicketsHtml = (breakdown: any[]) =>
    breakdown.map(renderTicketSection).join("");

  const openPrintable = (opts: {
    eventTitle: string;
    order: any;
    breakdown: any[];
    toast: any;
    venueDetails?: { name?: string; address?: string };
    eventDate?: string;
    eventTime?: string;
  }) => {
    const {
      eventTitle,
      order,
      breakdown,
      toast,
      venueDetails,
      eventDate,
      eventTime,
    } = opts;

    const calc = order.calculation_details || {};
    const orderId = order.event_entry_tickets_order_id ?? order._id ?? "-";
    const finalAmount = order.final_amount ?? calc.final_amount ?? 0;

    const logoSvg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f97316;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="240" fill="url(#gradient)" />
      <path d="M 160 180 L 256 340 L 352 180" stroke="white" stroke-width="32" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="200" cy="160" r="12" fill="white" opacity="0.8"/>
      <circle cx="312" cy="160" r="12" fill="white" opacity="0.8"/>
      <circle cx="256" cy="140" r="8" fill="white" opacity="0.6"/>
      <circle cx="256" cy="380" r="16" fill="white" opacity="0.9"/>
    </svg>`;

    const styles = `
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000; background: #f3f4f6; margin: 0; padding: 20px; }
      .ticket-container { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ddd; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .header { padding: 20px; border-bottom: 2px solid #000; display: flex; justify-content: space-between; align-items: center; }
      .brand-section { display: flex; align-items: center; gap: 12px; }
      .brand-text { font-size: 24px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px; }
      .event-title-section { text-align: right; }
      .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
      .header .order-id { font-size: 14px; color: #666; margin-top: 4px; }
      .event-info { padding: 20px; border-bottom: 1px solid #eee; background: #fafafa; }
      .event-info div { margin-bottom: 5px; }
      .event-info div:last-child { margin-bottom: 0; }
      .content { padding: 20px; }
      .ticket-item { border-bottom: 1px dashed #ccc; padding: 15px 0; display: flex; justify-content: space-between; }
      .ticket-item:last-child { border-bottom: none; }
      .ticket-details { flex: 1; }
      .ticket-title { font-weight: bold; font-size: 18px; margin-bottom: 5px; }
      .ticket-meta { font-size: 14px; color: #444; }
      .ticket-price { font-weight: bold; font-size: 16px; text-align: right; min-width: 100px; }
      .summary { background: #f9fafb; padding: 20px; border-top: 2px solid #000; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 5px 0; }
      .right { text-align: right; }
      .total-row { font-weight: bold; font-size: 18px; border-top: 1px solid #ddd; }
      .total-row td { padding-top: 10px; }
      .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
      .actions { padding: 20px; text-align: center; background: #eee; border-top: 1px solid #ddd; }
      button { background: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; margin: 0 5px; }
      button:hover { background: #333; }
      @media print {
        body { background: #fff; padding: 0; }
        .ticket-container { box-shadow: none; border: none; width: 100%; max-width: 100%; }
        .actions { display: none; }
      }
    `;

    const ticketsHtml = renderTicketsHtml(breakdown);

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Tickets - ${eventTitle}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="header">
            <div class="brand-section">
               ${logoSvg}
               <span class="brand-text">VIBES</span>
            </div>
            <div class="event-title-section">
              <h1>${eventTitle}</h1>
              <div class="order-id">Order #${orderId}</div>
            </div>
          </div>

          <div class="event-info">
             ${
               eventDate
                 ? `<div><strong>Date:</strong> ${new Date(
                     eventDate
                   ).toLocaleDateString()}</div>`
                 : ""
             }
             ${
               eventTime ? `<div><strong>Time:</strong> ${eventTime}</div>` : ""
             }
             ${
               venueDetails?.name
                 ? `<div><strong>Venue:</strong> ${venueDetails.name}</div>`
                 : ""
             }
             ${
               venueDetails?.address
                 ? `<div><strong>Address:</strong> ${venueDetails.address}</div>`
                 : ""
             }
          </div>

          <div class="content">
            ${ticketsHtml}
          </div>

          <div class="summary">
            <table>
              <tbody>
                <tr><td>Subtotal</td><td class="right">${formatMoney(
                  calc.subtotal ?? order.subtotal ?? null
                )}</td></tr>
                <tr><td>Tax (${
                  calc.tax_percentage ?? "-"
                }%)</td><td class="right">${formatMoney(
      calc.tax_amount ?? order.tax ?? null
    )}</td></tr>
                <tr class="total-row"><td>Total</td><td class="right">${formatMoney(
                  finalAmount
                )}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div style="margin-bottom: 8px; font-weight: bold; color: #7c3aed;">Powered by VIBES</div>
            Thank you for your purchase! Please present this ticket at the entrance.
          </div>

          <div class="actions">
            <button id="printBtn">Print Ticket</button>
            <button id="closeBtn">Close Window</button>
          </div>
        </div>

        <script>
          document.getElementById('printBtn').addEventListener('click', function(){ window.print(); });
          document.getElementById('closeBtn').addEventListener('click', function(){ window.close(); });
        </script>
      </body>
    </html>`;

    // Try a few strategies to reliably open the printable ticket view.
    // 1) window.open without features (some blockers disallow feature strings)
    // 2) fall back to a data: URL via programmatic anchor click
    // Only show the "popup blocked" toast if all methods fail.
    let opened = false;

    try {
      const w = window.open("", "_blank");
      if (w) {
        try {
          w.document.open();
          w.document.write(html);
          w.document.close();
          opened = true;
        } catch (e) {
          // Some browsers may refuse write on a newly opened window. Try navigating it to a data URL instead.
          try {
            w.location.href =
              "data:text/html;charset=utf-8," + encodeURIComponent(html);
            opened = true;
          } catch (err) {
            // give up on this window handle
            try {
              w.close();
            } catch {}
          }
        }
      }
    } catch (e) {
      // ignore and try anchor fallback
    }

    if (!opened) {
      try {
        const a = document.createElement("a");
        a.href = "data:text/html;charset=utf-8," + encodeURIComponent(html);
        a.target = "_blank";
        // Safari requires the element to be in the document
        document.body.appendChild(a);
        a.click();
        a.remove();
        opened = true;
      } catch (e) {
        opened = false;
      }
    }

    if (!opened) {
      toast({
        title: "Popup blocked",
        description:
          "Please allow popups to download tickets or use the browser's print to save.",
        variant: "destructive",
      });
    }
  };

  return { openPrintable };
}
