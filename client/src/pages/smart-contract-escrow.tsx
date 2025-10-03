import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Lock, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  FileText,
  Users,
  Zap,
  TrendingUp,
  Wallet,
  Eye,
  ChevronRight,
  ArrowUpDown,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

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
  status: 'pending' | 'funded' | 'in_progress' | 'completed' | 'disputed' | 'refunded';
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
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [newContractData, setNewContractData] = useState({
    vendorId: '',
    amount: '',
    eventDate: '',
    beneficiaryAddress: '',
    milestones: [{ description: '', percentage: 100 }]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch escrow contracts
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['/api/escrow/contracts'],
    retry: false,
  });

  // Fetch contract statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/escrow/stats'],
    retry: false,
  });

  // Fetch available vendors
  const { data: vendors } = useQuery({
    queryKey: ['/api/vendors'],
    retry: false,
  });

  // Fetch real blockchain network info
  const { data: networkInfo } = useQuery({
    queryKey: ['/api/blockchain/network'],
    retry: false,
  });

  // Fetch gas prices
  const { data: gasPrice } = useQuery({
    queryKey: ['/api/blockchain/gas-price'],
    retry: false,
  });

  // Create escrow contract mutation
  const createContractMutation = useMutation({
    mutationFn: async (contractData: any) => {
      const response = await fetch('/api/escrow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      });
      if (!response.ok) throw new Error('Failed to create contract');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Smart Contract Created",
        description: "Escrow contract deployed to blockchain successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/escrow/contracts'] });
      setNewContractData({
        vendorId: '',
        amount: '',
        eventDate: '',
        beneficiaryAddress: '',
        milestones: [{ description: '', percentage: 100 }]
      });
    },
    onError: () => {
      toast({
        title: "Contract Creation Failed",
        description: "Failed to deploy smart contract. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Release milestone payment mutation
  const releaseMilestoneMutation = useMutation({
    mutationFn: async ({ contractId, milestoneId }: { contractId: string; milestoneId: string }) => {
      const response = await fetch('/api/escrow/release-milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, milestoneId }),
      });
      if (!response.ok) throw new Error('Failed to release milestone');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Milestone Payment Released",
        description: "Funds have been automatically transferred to vendor's wallet.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/escrow/contracts'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'funded': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <p className="text-white/90 mt-2 text-xl">Secure vendor payments with blockchain technology</p>
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
                <p className="text-white/80 text-sm">Funds locked until work completion</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Milestone Releases</h3>
                <p className="text-white/80 text-sm">Automatic payment based on progress</p>
              </div>
              <div className="text-center">
                <Eye className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Full Transparency</h3>
                <p className="text-white/80 text-sm">All transactions on blockchain</p>
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
                  {networkInfo?.name || 'Loading...'}
                </div>
                <p className="text-white/80 text-sm">Network</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200 mb-1">
                  #{networkInfo?.blockNumber || '...'}
                </div>
                <p className="text-white/80 text-sm">Latest Block</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-200 mb-1">
                  {gasPrice?.gasPrice ? Math.round(parseInt(gasPrice.gasPrice) / 1e9) + ' Gwei' : 'Loading...'}
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
                <div className="text-2xl font-bold text-party-coral">${stats.totalValue?.toLocaleString() || 0}</div>
                <div className="text-sm text-party-gray">Total Secured</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-purple">{stats.activeContracts || 0}</div>
                <div className="text-sm text-party-gray">Active Contracts</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-turquoise">{stats.completedContracts || 0}</div>
                <div className="text-sm text-party-gray">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-yellow">{stats.disputeRate || 0}%</div>
                <div className="text-sm text-party-gray">Dispute Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-party-pink">{stats.avgResolutionTime || 0}h</div>
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
              <CardDescription>Set up secure vendor payment with blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vendor">Select Vendor</Label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newContractData.vendorId}
                  onChange={(e) => setNewContractData(prev => ({ ...prev, vendorId: e.target.value }))}
                >
                  <option value="">Choose a vendor...</option>
                  {vendors?.map((vendor: any) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="amount">Contract Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newContractData.amount}
                  onChange={(e) => setNewContractData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newContractData.eventDate}
                  onChange={(e) => setNewContractData(prev => ({ ...prev, eventDate: e.target.value }))}
                />
              </div>

              <div>
                <Label>Payment Milestones</Label>
                {newContractData.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder="Milestone description"
                      value={milestone.description}
                      onChange={(e) => {
                        const updated = [...newContractData.milestones];
                        updated[index].description = e.target.value;
                        setNewContractData(prev => ({ ...prev, milestones: updated }));
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="%"
                      className="w-20"
                      value={milestone.percentage}
                      onChange={(e) => {
                        const updated = [...newContractData.milestones];
                        updated[index].percentage = parseInt(e.target.value) || 0;
                        setNewContractData(prev => ({ ...prev, milestones: updated }));
                      }}
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={() => createContractMutation.mutate(newContractData)}
                disabled={createContractMutation.isPending || !newContractData.vendorId || !newContractData.amount}
                className="w-full bg-party-gradient-2 hover:scale-105 transition-transform"
              >
                {createContractMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deploying to Blockchain...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Create Smart Contract
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Active Contracts */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-party-dark flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Your Escrow Contracts
              </CardTitle>
              <CardDescription>Manage active blockchain payment contracts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-party-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-party-gray">Loading contracts...</p>
                </div>
              ) : contracts?.length > 0 ? (
                <div className="space-y-4">
                  {contracts.map((contract: EscrowContract) => (
                    <div key={contract.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-party-dark">{contract.eventTitle}</h3>
                          <p className="text-sm text-party-gray">
                            Vendor: {contract.vendorName}
                          </p>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-party-coral">
                          ${contract.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-party-gray">
                          Event: {new Date(contract.eventDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-2">
                        {contract.milestones.map((milestone, index) => (
                          <div key={milestone.id} className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                              )}
                              <span className="text-sm">{milestone.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{milestone.percentage}%</span>
                              {!milestone.completed && contract.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  onClick={() => releaseMilestoneMutation.mutate({
                                    contractId: contract.id,
                                    milestoneId: milestone.id
                                  })}
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
                  <p className="text-sm mt-1">Create your first secure vendor payment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-8 bg-white/95 backdrop-blur-sm border-2 border-white/30">
          <CardHeader>
            <CardTitle className="text-party-dark">How Smart Contract Escrow Works</CardTitle>
            <CardDescription>Understanding the blockchain-powered payment process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-party-coral rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Contract</h3>
                <p className="text-sm text-party-gray">Host creates smart contract with vendor details and payment terms</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-party-purple rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Fund Escrow</h3>
                <p className="text-sm text-party-gray">Payment is locked in blockchain escrow until conditions are met</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-party-turquoise rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Complete Milestones</h3>
                <p className="text-sm text-party-gray">Vendor completes work, host confirms milestones reached</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-party-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Auto Release</h3>
                <p className="text-sm text-party-gray">Smart contract automatically releases payment to vendor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}