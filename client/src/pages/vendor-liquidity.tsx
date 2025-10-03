import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Zap,
  Shield,
  Users,
  Calendar,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle,
  AlertTriangle,
  Banknote,
  CreditCard,
  Wallet
} from "lucide-react";

interface LiquidityPool {
  id: string;
  name: string;
  totalLiquidity: number;
  apy: number;
  riskLevel: 'low' | 'medium' | 'high';
  lockPeriod: string;
  minimumInvestment: number;
  currentUtilization: number;
  protocol: string;
}

interface VendorReceivable {
  id: string;
  vendorId: string;
  vendorName: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  contractValue: number;
  discountRate: number;
  liquidityOffered: number;
  timeToEvent: number;
  riskScore: number;
  status: 'available' | 'funded' | 'completed' | 'defaulted';
  investors: number;
  category: string;
}

interface LiquidityStats {
  totalVolumeProcessed: number;
  activeInvestments: number;
  averageReturn: number;
  defaultRate: number;
  totalVendorsHelped: number;
  avgTimeToFunding: number;
}

export default function VendorLiquidity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedReceivable, setSelectedReceivable] = useState<string | null>(null);

  // Fetch liquidity data
  const { data: liquidityPools = [], isLoading: poolsLoading } = useQuery({
    queryKey: ["/api/vendor-liquidity/pools"],
  });

  const { data: receivables = [], isLoading: receivablesLoading } = useQuery({
    queryKey: ["/api/vendor-liquidity/receivables"],
  });

  const { data: liquidityStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/vendor-liquidity/stats"],
  });

  // Investment mutation
  const investMutation = useMutation({
    mutationFn: async (data: { poolId: string; amount: number }) => {
      return await apiRequest("POST", "/api/vendor-liquidity/invest", data);
    },
    onSuccess: () => {
      toast({
        title: "Investment Successful",
        description: "Your investment has been processed and liquidity deployed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vendor-liquidity"] });
      setInvestmentAmount("");
    },
    onError: (error: any) => {
      toast({
        title: "Investment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fund receivable mutation
  const fundMutation = useMutation({
    mutationFn: async (receivableId: string) => {
      return await apiRequest("POST", "/api/vendor-liquidity/fund", { receivableId });
    },
    onSuccess: () => {
      toast({
        title: "Funding Completed",
        description: "Vendor receivable has been successfully funded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vendor-liquidity"] });
    },
    onError: (error: any) => {
      toast({
        title: "Funding Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInvest = () => {
    if (!selectedPool || !investmentAmount) return;
    
    investMutation.mutate({
      poolId: selectedPool,
      amount: parseFloat(investmentAmount)
    });
  };

  const handleFundReceivable = (receivableId: string) => {
    fundMutation.mutate(receivableId);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-blue-600 bg-blue-50';
      case 'funded': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-purple-600 bg-purple-50';
      case 'defaulted': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (poolsLoading || receivablesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DeFi Vendor Liquidity
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Instant cash flow for vendors through tokenized future receivables and DeFi lending pools
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-green-400" />
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${liquidityStats.totalVolumeProcessed?.toLocaleString() || '0'}
              </div>
              <p className="text-blue-100 text-sm">Processed through DeFi</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Average Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {liquidityStats.averageReturn || 0}%
              </div>
              <p className="text-blue-100 text-sm">Annual yield to investors</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-purple-400" />
                Fast Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {liquidityStats.avgTimeToFunding || 0}h
              </div>
              <p className="text-blue-100 text-sm">Average time to funding</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* DeFi Liquidity Pools */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Coins className="h-6 w-6 text-yellow-400" />
                DeFi Liquidity Pools
              </CardTitle>
              <CardDescription className="text-blue-100">
                Invest in vendor financing pools for passive yield
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {liquidityPools.map((pool: LiquidityPool) => (
                <div 
                  key={pool.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedPool === pool.id 
                      ? 'border-blue-400 bg-blue-500/20' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{pool.name}</h3>
                      <p className="text-blue-100 text-sm">{pool.protocol}</p>
                    </div>
                    <Badge className={getRiskColor(pool.riskLevel)}>
                      {pool.riskLevel} risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200">APY:</span>
                      <span className="text-green-400 font-semibold ml-2">{pool.apy}%</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Lock Period:</span>
                      <span className="text-white ml-2">{pool.lockPeriod}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Min Investment:</span>
                      <span className="text-white ml-2">${pool.minimumInvestment}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Utilization:</span>
                      <span className="text-white ml-2">{pool.currentUtilization}%</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-200">Pool Utilization</span>
                      <span className="text-white">{pool.currentUtilization}%</span>
                    </div>
                    <Progress value={pool.currentUtilization} className="h-2" />
                  </div>
                </div>
              ))}

              {selectedPool && (
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400">
                  <h4 className="font-semibold text-white mb-3">Invest in Pool</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="investment" className="text-blue-100">Investment Amount (USD)</Label>
                      <Input
                        id="investment"
                        type="number"
                        placeholder="1000"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                      />
                    </div>
                    <Button 
                      onClick={handleInvest} 
                      disabled={investMutation.isPending || !investmentAmount}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {investMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Wallet className="h-4 w-4 mr-2" />
                          Invest in Pool
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Vendor Receivables */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-6 w-6 text-green-400" />
                Vendor Receivables Market
              </CardTitle>
              <CardDescription className="text-blue-100">
                Fund specific vendor contracts for higher returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {receivables.map((receivable: VendorReceivable) => (
                  <div key={receivable.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{receivable.vendorName}</h3>
                        <p className="text-blue-100 text-sm">{receivable.eventTitle}</p>
                      </div>
                      <Badge className={getStatusColor(receivable.status)}>
                        {receivable.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-blue-200">Contract Value:</span>
                        <span className="text-white ml-2">${receivable.contractValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-blue-200">Discount Rate:</span>
                        <span className="text-green-400 ml-2">{receivable.discountRate}%</span>
                      </div>
                      <div>
                        <span className="text-blue-200">Event Date:</span>
                        <span className="text-white ml-2">{new Date(receivable.eventDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-blue-200">Risk Score:</span>
                        <span className="text-white ml-2">{receivable.riskScore}/100</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-blue-200">Available:</span>
                        <span className="text-green-400 font-semibold ml-2">
                          ${receivable.liquidityOffered.toLocaleString()}
                        </span>
                      </div>
                      
                      {receivable.status === 'available' && (
                        <Button 
                          size="sm"
                          onClick={() => handleFundReceivable(receivable.id)}
                          disabled={fundMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {fundMutation.isPending ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-1" />
                              Fund Now
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between text-xs text-blue-200">
                        <span>{receivable.investors} investors</span>
                        <span>{receivable.timeToEvent} days to event</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Info className="h-6 w-6 text-blue-400" />
              How DeFi Vendor Liquidity Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Vendor Applies</h3>
                <p className="text-blue-100 text-sm">Vendors submit future event contracts for instant liquidity funding</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Coins className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">DeFi Pools Fund</h3>
                <p className="text-blue-100 text-sm">Automated smart contracts deploy liquidity from decentralized pools</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Returns Paid</h3>
                <p className="text-blue-100 text-sm">Event completion triggers automatic repayment with yield to investors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}