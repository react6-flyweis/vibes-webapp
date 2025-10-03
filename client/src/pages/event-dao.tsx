import { useState, useEffect } from "react";
import { Vote, Users, Coins, Shield, TrendingUp, Calendar, Music, Palette, ChefHat, Gavel } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

interface DAOProposal {
  id: string;
  title: string;
  description: string;
  category: "theme" | "vendor" | "dj" | "budget" | "venue" | "rules";
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  deadline: string;
  status: "active" | "passed" | "failed" | "executed";
  details: any;
}

interface DAOMember {
  id: string;
  address: string;
  name: string;
  avatar: string;
  votingPower: number;
  contribution: number;
  reputation: number;
  joinedAt: string;
  role: "founder" | "member" | "contributor";
}

interface DAOTreasury {
  totalFunds: number;
  availableFunds: number;
  lockedFunds: number;
  pendingWithdrawals: number;
  transactions: TreasuryTransaction[];
  budgetAllocations: BudgetAllocation[];
}

interface TreasuryTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "allocation" | "fine";
  amount: number;
  description: string;
  from: string;
  to: string;
  timestamp: string;
  txHash: string;
  status: "pending" | "confirmed" | "failed";
}

interface BudgetAllocation {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export default function EventDAO() {
  const [selectedTab, setSelectedTab] = useState("proposals");
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "theme" as const,
    details: {}
  });

  const { data: daoData } = useQuery({
    queryKey: ["/api/dao/community"],
    refetchInterval: 15000,
  });

  const { data: proposals } = useQuery({
    queryKey: ["/api/dao/proposals"],
    refetchInterval: 10000,
  });

  const { data: members } = useQuery({
    queryKey: ["/api/dao/members"],
    refetchInterval: 30000,
  });

  const { data: treasury } = useQuery({
    queryKey: ["/api/dao/treasury"],
    refetchInterval: 20000,
  });

  // Mock data for demonstration
  const dao = daoData || {
    id: "party-dao-1",
    name: "Sunset Collective DAO",
    description: "A community-driven party collective focused on unforgettable experiences",
    totalMembers: 47,
    totalProposals: 12,
    successfulEvents: 8,
    treasuryValue: 15750,
    governanceToken: "PARTY",
    quorumPercentage: 30,
    proposalThreshold: 100,
    votingPeriod: "7 days"
  };

  const activeProposals: DAOProposal[] = proposals || [
    {
      id: "prop-1",
      title: "Summer Beach Festival Theme",
      description: "Proposal to organize a beach festival with tropical theme, live DJ sets, and beach volleyball tournament",
      category: "theme",
      proposer: "0x742...d4e3",
      votesFor: 34,
      votesAgainst: 8,
      totalVotes: 42,
      quorum: 15,
      deadline: "2025-01-30T23:59:59Z",
      status: "active",
      details: {
        budget: 8500,
        venue: "Malibu Beach Club",
        duration: "8 hours",
        capacity: 200
      }
    },
    {
      id: "prop-2",
      title: "Select DJ Kollective for Main Event",
      description: "Vote to book DJ Kollective for our next major event based on their electronic/house music expertise",
      category: "dj",
      proposer: "0x123...abc7",
      votesFor: 28,
      votesAgainst: 6,
      totalVotes: 34,
      quorum: 15,
      deadline: "2025-01-31T23:59:59Z",
      status: "active",
      details: {
        fee: 2500,
        duration: "4 hours",
        genre: "Electronic/House",
        equipment: "Full DJ booth setup"
      }
    },
    {
      id: "prop-3",
      title: "Increase Event Photography Budget",
      description: "Proposal to allocate additional 15% budget for professional event photography and videography",
      category: "budget",
      proposer: "0x456...def9",
      votesFor: 15,
      votesAgainst: 12,
      totalVotes: 27,
      quorum: 15,
      deadline: "2025-02-02T23:59:59Z",
      status: "active",
      details: {
        currentBudget: 1500,
        proposedIncrease: 225,
        justification: "Enhanced social media presence and event memories"
      }
    }
  ];

  const daoMembers: DAOMember[] = members || [
    {
      id: "member-1",
      address: "0x742d4e3c9d12a1b8f7e6c3a9",
      name: "Alex Chen",
      avatar: "AC",
      votingPower: 850,
      contribution: 2400,
      reputation: 94,
      joinedAt: "2024-08-15",
      role: "founder"
    },
    {
      id: "member-2",
      address: "0x123abc7f9e8d6c5b4a3f2e1d",
      name: "Maya Rodriguez", 
      avatar: "MR",
      votingPower: 720,
      contribution: 1900,
      reputation: 87,
      joinedAt: "2024-09-03",
      role: "contributor"
    },
    {
      id: "member-3",
      address: "0x456def9c8b7a6e5d4c3b2a1f",
      name: "Jordan Kim",
      avatar: "JK",
      votingPower: 650,
      contribution: 1650,
      reputation: 82,
      joinedAt: "2024-09-20",
      role: "contributor"
    },
    {
      id: "member-4",
      address: "0x789ghi3f2e1d9c8b7a6e5d4c",
      name: "Casey Taylor",
      avatar: "CT",
      votingPower: 580,
      contribution: 1320,
      reputation: 76,
      joinedAt: "2024-10-08",
      role: "member"
    }
  ];

  const treasuryData: DAOTreasury = treasury || {
    totalFunds: 15750,
    availableFunds: 12300,
    lockedFunds: 2450,
    pendingWithdrawals: 1000,
    transactions: [
      {
        id: "tx-1",
        type: "deposit",
        amount: 500,
        description: "Monthly contribution from Alex Chen",
        from: "0x742...d4e3",
        to: "DAO Treasury",
        timestamp: "2025-01-26T14:30:00Z",
        txHash: "0xabc123...def789",
        status: "confirmed"
      },
      {
        id: "tx-2",
        type: "withdrawal",
        amount: 2500,
        description: "DJ booking payment for December event",
        from: "DAO Treasury",
        to: "0x987...654f",
        timestamp: "2025-01-25T16:45:00Z",
        txHash: "0xdef456...abc123",
        status: "confirmed"
      },
      {
        id: "tx-3",
        type: "allocation",
        amount: 1200,
        description: "Venue deposit for Beach Festival",
        from: "DAO Treasury",
        to: "Venue Escrow",
        timestamp: "2025-01-24T10:15:00Z",
        txHash: "0x123def...789abc",
        status: "pending"
      }
    ],
    budgetAllocations: [
      { category: "Venue", allocated: 6000, spent: 3200, remaining: 2800, percentage: 38 },
      { category: "Entertainment", allocated: 4000, spent: 2500, remaining: 1500, percentage: 25 },
      { category: "Catering", allocated: 3500, spent: 1800, remaining: 1700, percentage: 22 },
      { category: "Marketing", allocated: 1500, spent: 800, remaining: 700, percentage: 10 },
      { category: "Equipment", allocated: 750, spent: 400, remaining: 350, percentage: 5 }
    ]
  };

  const submitVote = (proposalId: string, vote: "for" | "against") => {
    // Handle voting logic
  };

  const createProposal = () => {
    // Handle proposal creation
  };

  const depositFunds = (amount: number) => {
    // Handle treasury deposit
  };

  const withdrawFunds = (amount: number, reason: string) => {
    // Handle treasury withdrawal
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Vote className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Decentralized Party DAOs</h1>
            <Gavel className="h-8 w-8 text-indigo-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Community-governed event planning with transparent treasury management and democratic decision-making
          </p>
        </div>

        {/* DAO Overview */}
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              {dao.name}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {dao.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{dao.totalMembers}</div>
                <div className="text-sm text-gray-400">DAO Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{dao.totalProposals}</div>
                <div className="text-sm text-gray-400">Total Proposals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">${dao.treasuryValue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Treasury Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{dao.successfulEvents}</div>
                <div className="text-sm text-gray-400">Events Hosted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DAO Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/20">
            <TabsTrigger value="proposals" className="data-[state=active]:bg-purple-600">
              <Vote className="h-4 w-4 mr-2" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="treasury" className="data-[state=active]:bg-blue-600">
              <Coins className="h-4 w-4 mr-2" />
              Treasury
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-green-600">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:bg-indigo-600">
              <Gavel className="h-4 w-4 mr-2" />
              Governance
            </TabsTrigger>
          </TabsList>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-4">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Vote className="h-5 w-5 text-purple-400" />
                  Active Proposals
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Vote on community decisions for upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{proposal.title}</h3>
                          <p className="text-gray-400 text-sm mt-1">{proposal.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={`${
                              proposal.category === 'theme' ? 'text-purple-400 border-purple-400' :
                              proposal.category === 'dj' ? 'text-blue-400 border-blue-400' :
                              proposal.category === 'budget' ? 'text-green-400 border-green-400' :
                              'text-gray-400 border-gray-400'
                            }`}
                          >
                            {proposal.category.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Voting Progress:</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-green-400 text-sm">For: {proposal.votesFor}</span>
                              <span className="text-red-400 text-sm">Against: {proposal.votesAgainst}</span>
                            </div>
                            <Progress 
                              value={(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100} 
                              className="mb-2" 
                            />
                            <div className="text-xs text-gray-500">
                              Quorum: {proposal.totalVotes}/{proposal.quorum} votes
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Proposal Details:</div>
                          <div className="space-y-1">
                            {Object.entries(proposal.details).map(([key, value]) => (
                              <div key={key} className="text-xs text-white flex justify-between">
                                <span className="capitalize">{key}:</span>
                                <span className="text-blue-300">
                                  {typeof value === 'number' && key.includes('budget') || key.includes('fee') 
                                    ? `$${value.toLocaleString()}` 
                                    : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Deadline: {new Date(proposal.deadline).toLocaleDateString()}
                          <br />
                          Proposed by: {proposal.proposer}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                            onClick={() => submitVote(proposal.id, "against")}
                          >
                            Vote Against
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => submitVote(proposal.id, "for")}
                          >
                            Vote For
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Create New Proposal */}
                <div className="mt-6 p-4 rounded-lg bg-gray-800/30 border border-gray-600">
                  <h4 className="text-white font-semibold mb-3">Create New Proposal</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Proposal title"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Textarea
                      placeholder="Proposal description"
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <div className="flex gap-2">
                      <select 
                        value={newProposal.category}
                        onChange={(e) => setNewProposal({...newProposal, category: e.target.value as any})}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="theme">Theme</option>
                        <option value="vendor">Vendor</option>
                        <option value="dj">DJ</option>
                        <option value="budget">Budget</option>
                        <option value="venue">Venue</option>
                        <option value="rules">Rules</option>
                      </select>
                      <Button onClick={createProposal} className="bg-purple-600 hover:bg-purple-700">
                        Submit Proposal
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treasury Tab */}
          <TabsContent value="treasury" className="space-y-4">
            <Card className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-400" />
                  DAO Treasury Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Transparent fund management and budget allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-green-900/30 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">${treasuryData.totalFunds.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Total Treasury</div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-900/30 border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">${treasuryData.availableFunds.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Available Funds</div>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-900/30 border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">${treasuryData.lockedFunds.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Locked in Escrow</div>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-900/30 border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">${treasuryData.pendingWithdrawals.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Pending Withdrawals</div>
                  </div>
                </div>

                {/* Budget Allocations */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Budget Allocations</h4>
                  <div className="space-y-3">
                    {treasuryData.budgetAllocations.map((allocation, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{allocation.category}</span>
                          <span className="text-gray-400 text-sm">{allocation.percentage}%</span>
                        </div>
                        <Progress value={(allocation.spent / allocation.allocated) * 100} className="mb-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Spent: ${allocation.spent.toLocaleString()}</span>
                          <span>Remaining: ${allocation.remaining.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Recent Transactions</h4>
                  <div className="space-y-2">
                    {treasuryData.transactions.map((tx) => (
                      <div key={tx.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">{tx.description}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(tx.timestamp).toLocaleDateString()} • {tx.txHash.slice(0, 10)}...
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                tx.status === 'confirmed' ? 'text-green-400 border-green-400' :
                                tx.status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                                'text-red-400 border-red-400'
                              }`}
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treasury Actions */}
                <div className="mt-6 flex gap-3">
                  <Button 
                    onClick={() => depositFunds(500)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Deposit Funds
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => withdrawFunds(1000, "Event expenses")}
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  >
                    Request Withdrawal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  DAO Members
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Community members and their contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {daoMembers.map((member) => (
                    <div key={member.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-white font-bold">{member.name}</h3>
                              <p className="text-gray-400 text-sm">{member.address}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${
                                member.role === 'founder' ? 'text-purple-400 border-purple-400' :
                                member.role === 'contributor' ? 'text-blue-400 border-blue-400' :
                                'text-gray-400 border-gray-400'
                              }`}
                            >
                              {member.role}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <div className="text-sm text-gray-400">Voting Power</div>
                              <div className="text-lg font-semibold text-blue-400">{member.votingPower}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Contribution</div>
                              <div className="text-lg font-semibold text-green-400">${member.contribution}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Reputation</div>
                              <div className="text-lg font-semibold text-yellow-400">{member.reputation}%</div>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            Joined: {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-4">
            <Card className="border-indigo-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-indigo-400" />
                  DAO Governance Rules
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Democratic decision-making parameters and protocols
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Governance Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <h4 className="text-white font-semibold mb-3">Voting Parameters</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quorum Required:</span>
                          <span className="text-blue-400">{dao.quorumPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Voting Period:</span>
                          <span className="text-blue-400">{dao.votingPeriod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Proposal Threshold:</span>
                          <span className="text-blue-400">{dao.proposalThreshold} {dao.governanceToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Execution Delay:</span>
                          <span className="text-blue-400">24 hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <h4 className="text-white font-semibold mb-3">Token Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Supply:</span>
                          <span className="text-green-400">100,000 {dao.governanceToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Circulating:</span>
                          <span className="text-green-400">67,420 {dao.governanceToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Treasury Reserve:</span>
                          <span className="text-green-400">25,000 {dao.governanceToken}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Founder Pool:</span>
                          <span className="text-green-400">7,580 {dao.governanceToken}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Contract Rules */}
                  <div className="p-4 rounded-lg bg-indigo-900/30 border border-indigo-500/30">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Smart Contract Governance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-indigo-300 font-medium mb-2">Automated Execution</h5>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>• Proposals auto-execute after successful vote</li>
                          <li>• Treasury withdrawals require multi-sig approval</li>
                          <li>• Event funds locked in escrow until completion</li>
                          <li>• Automatic fine distribution for no-shows</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-indigo-300 font-medium mb-2">Transparency Features</h5>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>• All transactions publicly viewable on-chain</li>
                          <li>• Real-time treasury balance updates</li>
                          <li>• Immutable voting records</li>
                          <li>• Automated financial reporting</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Governance Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      View Smart Contract
                    </Button>
                    <Button variant="outline" className="border-indigo-500 text-indigo-400">
                      Governance Proposals
                    </Button>
                    <Button variant="outline" className="border-green-500 text-green-400">
                      Treasury Audit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}