import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateEscrowTransaction } from "@/mutations/integrations/escrow";
import {
  EscrowTransactionRequest,
  EscrowTransactionItem,
  EscrowTransactionParty,
} from "@/types/escrow";

export default function EscrowForm() {
  const [currency, setCurrency] = useState<string>("usd");
  const [description, setDescription] = useState<string>("");
  const [items, setItems] = useState<EscrowTransactionItem[]>([
    {
      title: "",
      description: "",
      quantity: 1,
      price: 0,
      type: "",
      inspection_period: 0,
    },
  ]);
  const [parties, setParties] = useState<EscrowTransactionParty[]>([
    { role: "buyer", customer: { email: "buyer@test.escrow.com" } },
    { role: "seller", customer: { email: "seller@test.escrow.com" } },
  ]);
  const [asCustomer, setAsCustomer] = useState<string>(
    "broker@test.escrow.com"
  );
  const { toast } = useToast();

  const mutation = useCreateEscrowTransaction({
    onSuccess: (data) => {
      toast({
        title: "Escrow Created",
        description: "Transaction created successfully",
      });
      // Optionally reset form
      setDescription("");
      setItems([
        {
          title: "",
          description: "",
          quantity: 1,
          price: 0,
          type: "",
          inspection_period: 0,
        },
      ]);
    },
    onError: (err) => {
      toast({
        title: "Failed to create escrow",
        description: String(err),
        variant: "destructive",
      });
    },
  });

  function updateItem(index: number, next: Partial<EscrowTransactionItem>) {
    const out = [...items];
    out[index] = { ...out[index], ...next };
    setItems(out);
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        quantity: 1,
        price: 0,
        type: "",
        inspection_period: 0,
      },
    ]);
  }

  function updateParty(index: number, next: Partial<EscrowTransactionParty>) {
    const out = [...parties];
    out[index] = { ...out[index], ...next };
    setParties(out);
  }

  function addParty() {
    setParties((prev) => [...prev, { role: "buyer", customer: { email: "" } }]);
  }

  async function submitForm() {
    const payload: EscrowTransactionRequest = {
      currency,
      description,
      items: items.map((i) => ({ ...i })),
      parties: parties.map((p) => ({ ...p })),
      asCustomer,
    };
    mutation.mutate(payload);
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Currency</Label>
        <select
          className="p-2 w-full rounded"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      <div>
        <Label>Items</Label>
        {items.map((item, idx) => (
          <div className="grid grid-cols-2 gap-2 mb-2" key={idx}>
            <Input
              placeholder="Title"
              value={item.title}
              onChange={(e) => updateItem(idx, { title: e.target.value })}
            />
            <Input
              placeholder="Type"
              value={item.type}
              onChange={(e) => updateItem(idx, { type: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
            />
            <Input
              placeholder="Price"
              type="number"
              value={String(item.price)}
              onChange={(e) =>
                updateItem(idx, { price: parseFloat(e.target.value || "0") })
              }
            />
            <Input
              placeholder="Quantity"
              type="number"
              value={String(item.quantity)}
              onChange={(e) =>
                updateItem(idx, { quantity: parseInt(e.target.value || "1") })
              }
            />
            <Input
              placeholder="Inspection Period"
              type="number"
              value={String(item.inspection_period)}
              onChange={(e) =>
                updateItem(idx, {
                  inspection_period: parseInt(e.target.value || "0"),
                })
              }
            />
          </div>
        ))}
        <div>
          <Button type="button" onClick={addItem} className="mt-2">
            Add Item
          </Button>
        </div>
      </div>

      <div>
        <Label>Parties</Label>
        {parties.map((p, idx) => (
          <div className="flex gap-2 mb-2" key={idx}>
            <select
              value={p.role}
              onChange={(e) => updateParty(idx, { role: e.target.value })}
              className="p-2 rounded w-40"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="broker">Broker</option>
            </select>
            <Input
              placeholder="Email"
              value={p.customer.email || ""}
              onChange={(e) =>
                updateParty(idx, {
                  customer: { ...(p.customer || {}), email: e.target.value },
                })
              }
            />
          </div>
        ))}
        <div>
          <Button type="button" onClick={addParty} className="mt-2">
            Add Party
          </Button>
        </div>
      </div>

      <div>
        <Label>As Customer (optional)</Label>
        <Input
          placeholder="broker@test.escrow.com"
          value={asCustomer}
          onChange={(e) => setAsCustomer(e.target.value)}
        />
      </div>

      <div>
        <Button
          onClick={submitForm}
          disabled={mutation.status === "pending"}
          className="w-full"
        >
          {mutation.status === "pending"
            ? "Creating..."
            : "Create Escrow Transaction"}
        </Button>
      </div>
    </div>
  );
}
