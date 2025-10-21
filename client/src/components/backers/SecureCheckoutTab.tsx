import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import EditProviderDialog from "@/components/backers/EditProviderDialog";
import ConnectProviderDialog from "@/components/backers/ConnectProviderDialog";

export default function SecureCheckoutTab({
  providers,
  onConnect,
  onEdit,
}: any) {
  const [openEditFor, setOpenEditFor] = useState<string | null>(null);
  const [openConnectFor, setOpenConnectFor] = useState<string | null>(null);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Secure Checkout</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Tested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <span
                    className={
                      p.status === "Active"
                        ? "text-green-600"
                        : p.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {p.status}
                  </span>
                </TableCell>
                <TableCell>{p.lastTested || "-"}</TableCell>
                <TableCell>
                  {p.editable ? (
                    <>
                      <EditProviderDialog
                        provider={p}
                        open={openEditFor === p.id}
                        onOpenChange={(v) =>
                          v ? setOpenEditFor(p.id) : setOpenEditFor(null)
                        }
                        trigger={
                          <Button variant="link" size="sm">
                            Edit
                          </Button>
                        }
                        onSave={(id, data) => onEdit(id, data)}
                      />

                      <ConnectProviderDialog
                        provider={p}
                        open={openConnectFor === p.id}
                        onOpenChange={(v) =>
                          v ? setOpenConnectFor(p.id) : setOpenConnectFor(null)
                        }
                        trigger={
                          <Button variant="link" size="sm">
                            {p.status === "Active" ? "Disconnect" : "Connect"}
                          </Button>
                        }
                        onSave={(id, data) => onConnect(id, data)}
                      />
                    </>
                  ) : (
                    <ConnectProviderDialog
                      provider={p}
                      open={openConnectFor === p.id}
                      onOpenChange={(v) =>
                        v ? setOpenConnectFor(p.id) : setOpenConnectFor(null)
                      }
                      trigger={
                        <Button variant="ghost" size="sm">
                          Connect
                        </Button>
                      }
                      onSave={(id, data) => onConnect(id, data)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
