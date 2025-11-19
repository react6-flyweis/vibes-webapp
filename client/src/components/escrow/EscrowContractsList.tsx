import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, Shield } from "lucide-react";
import type { EscrowTransactionResponse } from "@/types/escrow";

interface EscrowContract {
  id: string;
  eventId: number;
  eventTitle: string;
  vendorId: number;
  vendorName: string;
  hostId: number;
  hostName: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "funded"
    | "in_progress"
    | "completed"
    | "disputed"
    | "refunded";
  milestones: Array<{
    id: string;
    description: string;
    percentage: number;
    completed: boolean;
    releasedAt?: string;
  }>;
  createdAt: string;
  eventDate: string;
  autoReleaseDate: string;
  contractAddress: string;
  transactionHash?: string;
}

interface Props {
  contracts?: EscrowContract[];
  escrowTransactions?: EscrowTransactionResponse[] | undefined;
  isLoading?: boolean;
  isLoadingEscrowTransactions?: boolean;
  escrowTransactionsError?: any;
  onRefresh: () => void;
  onReleaseMilestone: (args: {
    contractId: string;
    milestoneId: string;
  }) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "funded":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "disputed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function EscrowContractsList({
  contracts,
  escrowTransactions,
  isLoading,
  isLoadingEscrowTransactions,
  escrowTransactionsError,
  onRefresh,
  onReleaseMilestone,
}: Props) {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
      <CardHeader>
        <CardTitle className="text-party-dark flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Your Escrow Contracts
        </CardTitle>
        <CardDescription>
          Manage active blockchain payment contracts and escrow transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-party-gray">
            All contracts and transactions
          </div>
          <Button
            size="sm"
            onClick={onRefresh}
            className="bg-party-coral hover:bg-party-coral/90"
          >
            Refresh
          </Button>
        </div>

        {isLoading || isLoadingEscrowTransactions ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-party-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-party-gray">Loading contracts...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Blockchain Contracts */}
            {contracts && contracts.length > 0 && (
              <>
                <div className="text-xs font-semibold text-party-gray uppercase mb-2">
                  Blockchain Contracts
                </div>
                {contracts.map((contract: EscrowContract) => (
                  <div
                    key={contract.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-party-dark">
                          {contract.eventTitle}
                        </h3>
                        <p className="text-sm text-party-gray">
                          Vendor: {contract.vendorName}
                        </p>
                      </div>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-party-coral">
                        ${contract.amount.toLocaleString()}
                      </span>
                      <span className="text-sm text-party-gray">
                        Event:{" "}
                        {new Date(contract.eventDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                      {contract.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center flex-1">
                            {milestone.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                            )}
                            <span className="text-sm">
                              {milestone.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {milestone.percentage}%
                            </span>
                            {!milestone.completed &&
                              contract.status === "in_progress" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    onReleaseMilestone({
                                      contractId: contract.id,
                                      milestoneId: milestone.id,
                                    })
                                  }
                                  className="bg-party-coral hover:bg-party-coral/90"
                                >
                                  Release
                                </Button>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t text-xs text-party-gray">
                      Contract: {contract.contractAddress.substring(0, 10)}...
                      {contract.transactionHash && (
                        <span className="ml-2">
                          TX: {contract.transactionHash.substring(0, 10)}...
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Escrow Provider Transactions */}
            {Array.isArray(escrowTransactions) &&
              escrowTransactions.length > 0 && (
                <>
                  <div className="text-xs font-semibold text-party-gray uppercase mb-2 mt-6">
                    Escrow Provider Transactions
                  </div>
                  {escrowTransactions.map((tx: EscrowTransactionResponse) => (
                    <div
                      key={tx.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-party-dark">
                            {tx.id}
                          </h4>
                          <p className="text-sm text-party-gray">
                            {tx.raw?.provider ||
                              tx.currency?.toUpperCase() ||
                              "provider"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(tx.status || "")}>
                          {(tx.status || "unknown").replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-party-coral">
                          {tx.amount ? `$${(tx.amount / 100).toFixed(2)}` : "—"}
                        </span>
                        <span className="text-xs text-party-gray">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}

            {/* Empty State */}
            {(!contracts || contracts.length === 0) &&
              (!escrowTransactions || escrowTransactions.length === 0) && (
                <div className="text-center py-8 text-party-gray">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No escrow contracts or transactions yet</p>
                  <p className="text-sm mt-1">
                    Create your first secure vendor payment
                  </p>
                </div>
              )}
          </div>
        )}

        {escrowTransactionsError && (
          <div className="mt-4 text-center text-sm text-red-500">
            Note: Some transactions may not be available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
