import React from "react";
import {
  useCateringMarketplacesByAuthQuery,
  CateringMarketplace,
} from "@/queries/cateringMarketplacesAuth";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import AddCateringDialog from "@/components/AddCateringDialog";

function CateringsTable({ caterings }: { caterings: CateringMarketplace[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!caterings || caterings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>No caterings found.</TableCell>
          </TableRow>
        ) : (
          caterings.map((c) => (
            <TableRow key={c._id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.catering_marketplace_category_id ?? "-"}</TableCell>
              <TableCell>{c.address ?? "-"}</TableCell>
              <TableCell>{c.mobile_no ?? "-"}</TableCell>
              <TableCell>{c.status ? "Active" : "Inactive"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default function CateringsPage() {
  const {
    data: caterings = [],
    isLoading,
    isError,
    error,
  } = useCateringMarketplacesByAuthQuery();

  // AddCateringDialog handles create mutation and toast

  return (
    <div className="bg-gray-50 py-5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 py-10 text-center">
          <h1 className="text-5xl mb-2 font-bold text-transparent bg-clip-text bg-gradient-primary">
            Caterings
          </h1>
          <p className="text-muted-foreground">Manage catering listings.</p>
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error: {error?.message ?? "Unknown error"}</div>}

        <div className="mb-4 flex justify-end">
          <AddCateringDialog />
        </div>

        <Card>
          <CardContent>
            <CateringsTable caterings={caterings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
