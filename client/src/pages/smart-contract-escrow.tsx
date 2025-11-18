import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEscrowTransactions } from "@/queries/integrations/escrow";
import { useToast } from "@/hooks/use-toast";
import LegacyEscrowForm from "@/components/escrow/LegacyEscrowForm";
import type { EscrowTransactionResponse } from "@/types/escrow";
import type { UseQueryResult } from "@tanstack/react-query";

import {
  Shield,
  Lock,
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  Zap,
  Eye,
} from "lucide-react";

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

interface ContractStats {
  totalValue: number;
  activeContracts: number;
  completedContracts: number;
  disputeRate: number;
  avgResolutionTime: number;
}

export default function SmartContractEscrow() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: escrowTransactions,
    isLoading: isLoadingEscrowTransactions,
    error: escrowTransactionsError,
  } = useEscrowTransactions({ page: 1, limit: 25 }) as UseQueryResult<
    EscrowTransactionResponse[] | undefined
  >;

  // Fetch escrow contracts
  const { data: contracts, isLoading } = useQuery<EscrowContract[]>({
    queryKey: ["/api/escrow/contracts"],
    retry: false,
  });

  // Fetch contract statistics
  const { data: stats } = useQuery<ContractStats | undefined>({
    queryKey: ["/api/escrow/stats"],
    retry: false,
  });

  // Vendors are fetched inside the legacy form using `useVendors` to better support the onboarding portal format

  // Fetch real blockchain network info
  const { data: networkInfo } = useQuery<
    { name?: string; blockNumber?: number } | undefined
  >({
    queryKey: ["/api/blockchain/network"],
    retry: false,
  });

  // Fetch gas prices
  const { data: gasPrice } = useQuery<
    { gasPrice?: string | number } | undefined
  >({
    queryKey: ["/api/blockchain/gas-price"],
    retry: false,
  });

  // Release milestone payment mutation
  const releaseMilestoneMutation = useMutation({
    mutationFn: async ({
      contractId,
      milestoneId,
    }: {
      contractId: string;
      milestoneId: string;
    }) => {
      const response = await fetch("/api/escrow/release-milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, milestoneId }),
      });
      if (!response.ok) throw new Error("Failed to release milestone");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Milestone Payment Released",
        description:
          "Funds have been automatically transferred to vendor's wallet.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/escrow/contracts"] });
    },
  });

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

  return (
    <div className="min-h-screen bg-party-gradient-1 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-party-rainbow opacity-10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-party-pink rounded-full opacity-20 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-party-yellow rounded-full opacity-30 animate-party-wiggle"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-party-turquoise rounded-full opacity-15 animate-pulse-slow"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-green-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-linear-to-r from-white to-green-200 bg-clip-text text-transparent">
            Smart Contract Escrow
          </h1>
          <p className="text-white/90 mt-2 text-xl">
            Secure vendor payments with blockchain technology
          </p>
        </div>

        {/* Key Features Overview */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Lock className="w-8 h-8 mr-3 text-green-200" />
              Blockchain-Powered Trust
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Eliminate payment disputes with automated smart contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Escrow Protection</h3>
                <p className="text-white/80 text-sm">
                  Funds locked until work completion
                </p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Milestone Releases</h3>
                <p className="text-white/80 text-sm">
                  Automatic payment based on progress
                </p>
              </div>
              <div className="text-center">
                <Eye className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Full Transparency</h3>
                <p className="text-white/80 text-sm">
                  All transactions on blockchain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Blockchain Network Status */}
        <Card className="mb-8 bg-linear-to-r from-green-900/90 to-blue-900/90 text-white border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Zap className="w-8 h-8 mr-3 text-yellow-200 animate-pulse" />
              Live Blockchain Network Status
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Connected to real blockchain network using your API credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-200 mb-1">
                  {networkInfo?.name || "Loading..."}
                </div>
                <p className="text-white/80 text-sm">Network</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200 mb-1">
                  #{networkInfo?.blockNumber || "..."}
                </div>
                <p className="text-white/80 text-sm">Latest Block</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200 mb-1">
                  {gasPrice?.gasPrice
                    ? Math.round(Number(gasPrice.gasPrice) / 1e9) + " Gwei"
                    : "Loading..."}
                </div>
                <p className="text-white/80 text-sm">Gas Price</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xl font-bold text-green-200">Live</span>
                </div>
                <p className="text-white/80 text-sm">API Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Dashboard */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-coral">
                  ${stats.totalValue?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-party-gray">Total Secured</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-purple">
                  {stats.activeContracts || 0}
                </div>
                <div className="text-sm text-party-gray">Active Contracts</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-turquoise">
                  {stats.completedContracts || 0}
                </div>
                <div className="text-sm text-party-gray">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-yellow">
                  {stats.disputeRate || 0}%
                </div>
                <div className="text-sm text-party-gray">Dispute Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-pink">
                  {stats.avgResolutionTime || 0}h
                </div>
                <div className="text-sm text-party-gray">Avg Resolution</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Contract */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-party-dark flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Create Escrow Contract
              </CardTitle>
              <CardDescription>
                Set up secure vendor payment with blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LegacyEscrowForm />
            </CardContent>
          </Card>
          {/* EscrowForm usage commented out while keeping legacy UI for now */}
          {/*
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-party-dark flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Create Escrow Transaction
              </CardTitle>
              <CardDescription>
                Create a transaction using the integrated escrow provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EscrowForm />
            </CardContent>
          </Card>
          */}

          {/* Active Contracts */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-party-dark flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Your Escrow Contracts
              </CardTitle>
              <CardDescription>
                Manage active blockchain payment contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-party-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-party-gray">Loading contracts...</p>
                </div>
              ) : contracts && contracts.length > 0 ? (
                <div className="space-y-4">
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
                                      releaseMilestoneMutation.mutate({
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
                </div>
              ) : (
                <div className="text-center py-8 text-party-gray">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No escrow contracts yet</p>
                  <p className="text-sm mt-1">
                    Create your first secure vendor payment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Escrow Provider Transactions */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-party-dark flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Escrow Provider Transactions
              </CardTitle>
              <CardDescription>
                Recent transactions from your configured escrow provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-party-gray">
                  Latest transactions
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["/api/integrations/escrow/transactions"],
                      })
                    }
                    className="bg-party-coral hover:bg-party-coral/90"
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              {isLoadingEscrowTransactions ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-4 border-party-coral border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-party-gray text-sm">
                    Loading transactions...
                  </p>
                </div>
              ) : Array.isArray(escrowTransactions) &&
                escrowTransactions.length > 0 ? (
                <div className="space-y-3">
                  {(escrowTransactions as EscrowTransactionResponse[]).map(
                    (tx: EscrowTransactionResponse) => (
                      <div
                        key={tx.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-semibold text-party-dark">
                              {tx.id}
                            </h4>
                            <p className="text-sm text-party-gray">
                              {tx.raw?.provider ||
                                tx.currency?.toUpperCase() ||
                                "provider"}{" "}
                              •{" "}
                              {tx.amount
                                ? `$${(tx.amount / 100).toFixed(2)}`
                                : "—"}
                            </p>
                          </div>
                          <Badge className={getStatusColor(tx.status || "")}>
                            {(tx.status || "unknown").replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-xs text-party-gray mt-2">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString()
                            : "—"}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-party-gray">
                  <p>No transactions yet</p>
                </div>
              )}
              {escrowTransactionsError && (
                <div className="mt-4 text-center text-sm text-red-500">
                  Failed to load transactions
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-8 bg-white/95 backdrop-blur-sm border-2 border-white/30">
          <CardHeader>
            <CardTitle className="text-party-dark">
              How Smart Contract Escrow Works
            </CardTitle>
            <CardDescription>
              Understanding the blockchain-powered payment process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-party-coral rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Contract</h3>
                <p className="text-sm text-party-gray">
                  Host creates smart contract with vendor details and payment
                  terms
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-party-purple rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Fund Escrow</h3>
                <p className="text-sm text-party-gray">
                  Payment is locked in blockchain escrow until conditions are
                  met
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-party-turquoise rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Complete Milestones</h3>
                <p className="text-sm text-party-gray">
                  Vendor completes work, host confirms milestones reached
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-party-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Auto Release</h3>
                <p className="text-sm text-party-gray">
                  Smart contract automatically releases payment to vendor
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
