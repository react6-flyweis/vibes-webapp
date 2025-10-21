import React from "react";
import { useStaffByVendorQuery, StaffUser } from "@/queries/staffing";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function StaffTable({ staff }: { staff: StaffUser[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Online</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!staff || staff.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>No staff found.</TableCell>
          </TableRow>
        ) : (
          staff.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email ?? "-"}</TableCell>
              <TableCell>{s.mobile ?? "-"}</TableCell>
              <TableCell>
                {s.role_details?.name ?? s.fixed_role_details?.name ?? "-"}
              </TableCell>
              <TableCell>{s.online_status ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default function StaffingsPage() {
  const {
    data: staff = [],
    isLoading,
    isError,
    error,
  } = useStaffByVendorQuery(null);

  return (
    <div className="bg-gray-50 py-5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 py-10 text-center">
          <h1 className="text-5xl mb-2 font-bold text-transparent bg-clip-text bg-gradient-primary">
            Staffings
          </h1>
          <p className="text-muted-foreground">Manage staffing listings.</p>
        </div>

        {/* Vendor selection removed from UI; table header is shown even when empty */}

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error?.message ?? "Unknown error"}</div>}

        <div className="mb-4 flex justify-end">
          <Button variant="default">Add Staff</Button>
        </div>

        <Card>
          <CardContent>
            <StaffTable staff={staff} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
