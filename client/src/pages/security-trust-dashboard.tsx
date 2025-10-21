import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import KYCVerificationTab from "../components/security-trust-dashboard/KYCVerificationTab";
import PlatformTermsTab from "../components/security-trust-dashboard/PlatformTermsTab";
import EscrowContractsTab from "../components/security-trust-dashboard/EscrowContractsTab";
import RegionalComplianceTab from "../components/security-trust-dashboard/RegionalComplianceTab";
import AuditTrailTab from "../components/security-trust-dashboard/AuditTrailTab";

const tabs = [
  { key: "kyc", label: "KYC/AML Verification" },
  { key: "platform-terms", label: "Platform Terms" },
  { key: "escrow-contracts", label: "Escrow Contracts" },
  { key: "regional-compliance", label: "Regional Compliance" },
  { key: "audit-trail", label: "Audit Trail" },
];

// Tab components extracted to separate files in ./security-trust-dashboard/

export default function SecurityTrustDashboard() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  // expect path like /security-trust/:tab
  const activeTabKey = parts[1] || "kyc";

  const [auditTrail, setAuditTrail] = useState<Array<any>>([
    {
      id: "AT-001",
      user: "Priya Sharma",
      userType: "Vendor",
      verificationId: "KYC-2025-099",
      submittedOn: "09-Sep-2025",
      status: "Pending",
    },
  ]);

  // sample escrow contracts state
  const [escrowContracts, setEscrowContracts] = useState<Array<any>>([
    {
      id: "ESC-0192",
      campaign: "Smart Home Sensor Project",
      createdOn: "09-Sep-2025",
      status: "Active",
      filename: "ESC-0192.pdf",
    },
  ]);

  // sample regional compliance state (matches screenshot)
  const [regionalCompliance, setRegionalCompliance] = useState<Array<any>>([
    {
      region: "EU",
      framework: "GDPR v2.1",
      status: "Compliant",
      lastChecked: "06-Sep-2025",
    },
    {
      region: "US",
      framework: "CGPA",
      status: "Action Required",
      lastChecked: "03-Sep-2025",
    },
  ]);

  // sample admin actions for Audit Trail (matches screenshot)
  const [adminActions, setAdminActions] = useState<Array<any>>([
    {
      id: "AA-001",
      dateTime: "09-Sep-2025 15:10",
      description: "Approved KYC for Priya",
      user: "A. Singh",
      ip: "192.168.0.5",
    },
    {
      id: "AA-002",
      dateTime: "09-Sep-2025 14:55",
      description: "Updated Terms of Service",
      user: "J. Patel",
      ip: "192.168.0.9",
    },
  ]);

  function downloadContract(id: string) {
    const contract = escrowContracts.find((c) => c.id === id);
    if (!contract) return;

    // For demo: create a small text blob and trigger a download with the contract filename.
    const content = `Contract ID: ${contract.id}\nCampaign: ${contract.campaign}\nStatus: ${contract.status}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = contract.filename || `${contract.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function reviewVerification(id: string) {
    setAuditTrail((a) =>
      a.map((x) => (x.id === id ? { ...x, status: "Verified" } : x))
    );
  }

  return (
    <div className="bg-gray-50 py-5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 py-10 text-center">
          <h1 className="text-5xl mb-2 font-bold text-transparent bg-clip-text bg-gradient-primary">
            Security & Trust
          </h1>
          <p className="text-muted-foreground">
            Welcome to the Security & Trust Center. Review verifications, manage
            policies, and monitor compliance activities in real time.
          </p>
        </div>

        <div className="mb-6">
          <Tabs
            value={
              // Tabs expects the label as value; find label for active key
              tabs.find((t) => t.key === activeTabKey)?.label ||
              "KYC/AML Verification"
            }
          >
            <div className="flex justify-center">
              <TabsList className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.label}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Link to={`/security-trust/${t.key}`}>{t.label}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="KYC/AML Verification">
              <KYCVerificationTab
                auditTrail={auditTrail}
                reviewVerification={reviewVerification}
              />
            </TabsContent>

            <TabsContent value="Platform Terms">
              <PlatformTermsTab />
            </TabsContent>

            <TabsContent value="Escrow Contracts">
              <EscrowContractsTab
                escrowContracts={escrowContracts}
                downloadContract={downloadContract}
              />
            </TabsContent>

            <TabsContent value="Regional Compliance">
              <RegionalComplianceTab regionalCompliance={regionalCompliance} />
            </TabsContent>

            <TabsContent value="Audit Trail">
              <AuditTrailTab auditTrail={adminActions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
