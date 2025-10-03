import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Users, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Crown, 
  Wallet, 
  QrCode, 
  Award, 
  Clock,
  FileText,
  Vote,
  Target,
  Gavel,
  CreditCard,
  Smartphone,
  Coins,
  Receipt,
  BarChart3,
  UserCheck,
  Settings,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function VibeLedgerDashboard() {
  const [communityData, setCommunityData] = useState({
    name: "Tech Innovators Club",
    totalMembers: 247,
    treasuryBalance: 15750.50,
    monthlyDues: 25.00,
    averageAttendance: 78.5,
    governanceProposals: 3
  });

  const [treasuryStats, setTreasuryStats] = useState({
    totalCollected: 15750.50,
    pendingPayments: 3250.00,
    monthlyExpenses: 2840.75,
    budgetAllocated: 18500.00,
    committees: [
      { name: "Events Committee", budget: 8500, spent: 6200, remaining: 2300 },
      { name: "Marketing", budget: 4000, spent: 2800, remaining: 1200 },
      { name: "Technology", budget: 3500, spent: 2100, remaining: 1400 },
      { name: "Operations", budget: 2500, spent: 1900, remaining: 600 }
    ]
  });

  const [members, setMembers] = useState([
    {
      id: "member_001",
      name: "Sarah Chen",
      role: "President",
      membershipNFT: "VTC-001",
      duesStatus: "paid",
      reputationScore: 98,
      attendance: 95,
      walletAddress: "0x1234...5678",
      lastPayment: "2024-12-01",
      finesOwed: 0,
      contributions: 2400
    },
    {
      id: "member_002", 
      name: "Marcus Johnson",
      role: "Vice President",
      membershipNFT: "VTC-002",
      duesStatus: "pending",
      reputationScore: 92,
      attendance: 88,
      walletAddress: "0x9876...4321",
      lastPayment: "2024-11-15",
      finesOwed: 50,
      contributions: 1950
    },
    {
      id: "member_003",
      name: "Elena Rodriguez",
      role: "Treasurer",
      membershipNFT: "VTC-003", 
      duesStatus: "paid",
      reputationScore: 96,
      attendance: 92,
      walletAddress: "0xabcd...efgh",
      lastPayment: "2024-12-01",
      finesOwed: 0,
      contributions: 2100
    }
  ]);

  const [proposals, setProposals] = useState([
    {
      id: "prop_001",
      title: "Increase Annual Event Budget",
      description: "Allocate additional $3,000 for premium venue booking",
      proposer: "Sarah Chen",
      status: "active",
      votesFor: 89,
      votesAgainst: 23,
      totalVotes: 112,
      deadline: "2024-12-20",
      requiredQuorum: 50
    },
    {
      id: "prop_002",
      title: "New Member Onboarding Fee",
      description: "Implement $100 one-time fee for new member processing",
      proposer: "Marcus Johnson", 
      status: "pending",
      votesFor: 45,
      votesAgainst: 67,
      totalVotes: 112,
      deadline: "2024-12-25",
      requiredQuorum: 50
    }
  ]);

  const [attendanceData, setAttendanceData] = useState([
    { event: "Monthly Tech Talk", date: "2024-12-01", attendees: 198, capacity: 250, checkInMethod: "QR Code" },
    { event: "Networking Mixer", date: "2024-11-20", attendees: 156, capacity: 200, checkInMethod: "NFC Tag" },
    { event: "Workshop: AI Ethics", date: "2024-11-15", attendees: 89, capacity: 100, checkInMethod: "Manual Check-in" },
    { event: "Board Meeting", date: "2024-11-10", attendees: 12, capacity: 15, checkInMethod: "Virtual Auto-track" }
  ]);

  const { toast } = useToast();

  const processPayment = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest('/api/vibeledger/payments/process', 'POST', paymentData);
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Payment Processed",
        description: `Successfully processed payment via ${data.method}`
      });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const createProposal = useMutation({
    mutationFn: async (proposalData: any) => {
      const response = await apiRequest('/api/vibeledger/governance/proposals', 'POST', proposalData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Proposal Created",
        description: "Your governance proposal has been submitted for voting"
      });
    }
  });

  const issueFine = useMutation({
    mutationFn: async (fineData: any) => {
      const response = await apiRequest('/api/vibeledger/fines/issue', 'POST', fineData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Fine Issued",
        description: "Member fine has been recorded on blockchain"
      });
    }
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              VibeLedger Finance Hub
            </h1>
            <DollarSign className="h-8 w-8 text-teal-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Blockchain-powered finance and admin system for transparent community governance, secure treasury management, and automated member operations.
          </p>
        </div>

        {/* Community Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold">{communityData.totalMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                  <Wallet className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Treasury Balance</p>
                  <p className="text-2xl font-bold">${communityData.treasuryBalance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                  <p className="text-2xl font-bold">{communityData.averageAttendance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Vote className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Proposals</p>
                  <p className="text-2xl font-bold">{communityData.governanceProposals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="treasury" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Treasury Management Tab */}
          <TabsContent value="treasury" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Treasury Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">Total Collected</p>
                      <p className="text-xl font-bold text-green-800 dark:text-green-300">
                        ${treasuryStats.totalCollected.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="text-sm text-orange-700 dark:text-orange-400">Pending Payments</p>
                      <p className="text-xl font-bold text-orange-800 dark:text-orange-300">
                        ${treasuryStats.pendingPayments.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">Committee Budget Allocation</h3>
                    <div className="space-y-4">
                      {treasuryStats.committees.map((committee, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{committee.name}</span>
                            <span className="text-sm text-gray-600">
                              ${committee.spent.toLocaleString()} / ${committee.budget.toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={(committee.spent / committee.budget) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Remaining: ${committee.remaining.toLocaleString()}</span>
                            <span>{((committee.spent / committee.budget) * 100).toFixed(1)}% used</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Blockchain Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-300">Smart Contract Active</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      All transactions secured on Polygon network
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Treasury Wallet</span>
                      <Badge variant="secondary">0x7890...abcd</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Audit</span>
                      <Badge variant="default">Dec 1, 2024</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Security Score</span>
                      <Badge variant="default">98/100</Badge>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Audit Log
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Management Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Member Registry & NFT Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.duesStatus === 'paid' ? 'default' : 'destructive'}>
                            {member.duesStatus}
                          </Badge>
                          <Badge variant="outline">{member.membershipNFT}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Reputation Score</p>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{member.reputationScore}</span>
                            <Award className="h-4 w-4 text-yellow-500" />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Attendance</p>
                          <span className="font-semibold">{member.attendance}%</span>
                        </div>
                        <div>
                          <p className="text-gray-600">Contributions</p>
                          <span className="font-semibold">${member.contributions}</span>
                        </div>
                        <div>
                          <p className="text-gray-600">Fines Owed</p>
                          <span className={`font-semibold ${member.finesOwed > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ${member.finesOwed}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {member.finesOwed > 0 && (
                          <Button size="sm" variant="outline" className="text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Collect Fine
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Gavel className="h-4 w-4 mr-1" />
                          Issue Fine
                        </Button>
                        <Button size="sm" variant="outline">
                          <Crown className="h-4 w-4 mr-1" />
                          View NFT
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span>Credit/Debit</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Coins className="h-6 w-6 mb-2" />
                      <span>Crypto Wallet</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Smartphone className="h-6 w-6 mb-2" />
                      <span>Apple Pay</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Smartphone className="h-6 w-6 mb-2" />
                      <span>Google Pay</span>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Quick Actions</h4>
                    <Button className="w-full">
                      <Receipt className="h-4 w-4 mr-2" />
                      Collect Monthly Dues
                    </Button>
                    <Button variant="outline" className="w-full">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Send Payment Reminders
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Payment Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">Collection Rate</p>
                      <p className="text-xl font-bold text-green-800 dark:text-green-300">94.2%</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-400">Avg. Payment Time</p>
                      <p className="text-xl font-bold text-blue-800 dark:text-blue-300">2.3 days</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Credit Card</span>
                      <div className="flex items-center gap-2">
                        <Progress value={65} className="w-20 h-2" />
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Crypto</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-20 h-2" />
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mobile Pay</span>
                      <div className="flex items-center gap-2">
                        <Progress value={10} className="w-20 h-2" />
                        <span className="text-sm">10%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tracking Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Attendance Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendanceData.map((event, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{event.event}</h3>
                            <p className="text-sm text-gray-600">{event.date}</p>
                          </div>
                          <Badge variant="outline">{event.checkInMethod}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Attendance</span>
                              <span>{event.attendees}/{event.capacity}</span>
                            </div>
                            <Progress value={(event.attendees / event.capacity) * 100} className="h-2" />
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {((event.attendees / event.capacity) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Check-in Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <QrCode className="h-6 w-6 mb-1" />
                    <span>QR Code Scan</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <Smartphone className="h-6 w-6 mb-1" />
                    <span>NFC Tag</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <UserCheck className="h-6 w-6 mb-1" />
                    <span>Manual Check-in</span>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <Clock className="h-6 w-6 mb-1" />
                    <span>Auto Virtual</span>
                  </Button>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Blockchain Records</span>
                      <Badge variant="default">Immutable</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Sync</span>
                      <span className="text-gray-600">2 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  VibeDAO Governance Proposals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {proposals.map((proposal, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Proposed by {proposal.proposer}</p>
                      </div>
                      <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                        {proposal.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Votes For: {proposal.votesFor}</span>
                            <span>Votes Against: {proposal.votesAgainst}</span>
                          </div>
                          <div className="flex gap-1">
                            <Progress 
                              value={(proposal.votesFor / proposal.totalVotes) * 100} 
                              className="flex-1 h-2"
                            />
                            <Progress 
                              value={(proposal.votesAgainst / proposal.totalVotes) * 100} 
                              className="flex-1 h-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span>Quorum: {proposal.totalVotes}/{proposal.requiredQuorum}</span>
                        <span>Deadline: {proposal.deadline}</span>
                      </div>

                      {proposal.status === 'active' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Target className="h-4 w-4 mr-1" />
                            Vote For
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Target className="h-4 w-4 mr-1" />
                            Vote Against
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <Button className="w-full">
                  <Vote className="h-4 w-4 mr-2" />
                  Create New Proposal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Member Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Members</span>
                      <Badge>92%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Reputation</span>
                      <Badge variant="default">94</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment Compliance</span>
                      <Badge variant="default">96%</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-300">AI Alert</span>
                    </div>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      Attendance down 5% - consider event format changes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Reputation Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members
                      .sort((a, b) => b.reputationScore - a.reputationScore)
                      .slice(0, 5)
                      .map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.role}</p>
                          </div>
                          <Badge variant="outline">{member.reputationScore}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Financial Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                      <p className="text-xs text-green-700 dark:text-green-400">Revenue</p>
                      <p className="font-bold text-green-800 dark:text-green-300">+12%</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                      <p className="text-xs text-blue-700 dark:text-blue-400">Expenses</p>
                      <p className="font-bold text-blue-800 dark:text-blue-300">-8%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span>73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800 dark:text-purple-300">Forecast</span>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-400">
                      On track to exceed annual budget by 15%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}