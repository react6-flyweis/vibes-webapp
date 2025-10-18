import React, { createContext, useState } from "react";
import { NavLink, Outlet } from "react-router";

export const FinancialDashboardContext = createContext<any>(null);

export default function FinancialDashboard() {
  const [tipPercent, setTipPercent] = useState<number>(5);
  const [customMessage, setCustomMessage] = useState<string>("");
  const [refunds, setRefunds] = useState<Array<any>>([
    {
      id: "RF-456",
      backer: "Alice K.",
      campaign: "Eco-Bottle",
      amount: "$60",
      reason: "Duplicate Pledge",
      status: "Pending",
    },
    {
      id: "RF-457",
      backer: "Ben S.",
      campaign: "Smart Lamp",
      amount: "$120",
      reason: "Product Change",
      status: "Approved",
    },
  ]);

  function approveRefund(id: string) {
    setRefunds((r) =>
      r.map((x) => (x.id === id ? { ...x, status: "Approved" } : x))
    );
  }

  function denyRefund(id: string) {
    setRefunds((r) =>
      r.map((x) => (x.id === id ? { ...x, status: "Denied" } : x))
    );
  }

  const ctx = {
    tipPercent,
    setTipPercent,
    customMessage,
    setCustomMessage,
    refunds,
    approveRefund,
    denyRefund,
  };

  return (
    <FinancialDashboardContext.Provider value={ctx}>
      <div className="bg-gray- py-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 py-10 text-center">
            <h1 className="text-5xl mb-2 font-bold text-transparent bg-clip-text bg-gradient-primary">
              Financial Management
            </h1>
            <p className="text-muted-foreground">
              Quick snapshot of all financial activity.
            </p>
          </div>

          <div className="mb-6 flex justify-center w-full">
            <div className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1">
              <NavLink
                to="/financial-management"
                end
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-white shadow-sm border border-gray-300"
                      : "text-gray-600"
                  }`
                }
              >
                Financial Dashboard
              </NavLink>
              <NavLink
                to="/financial-management/escrow"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-white shadow-sm border border-gray-300"
                      : "text-gray-600"
                  }`
                }
              >
                Escrow Management
              </NavLink>
              <NavLink
                to="/financial-management/payouts"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-white shadow-sm border border-gray-300"
                      : "text-gray-600"
                  }`
                }
              >
                Auto Payouts
              </NavLink>
              <NavLink
                to="/financial-management/processing"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-white shadow-sm border border-gray-300"
                      : "text-gray-600"
                  }`
                }
              >
                Free Processing
              </NavLink>
              <NavLink
                to="/financial-management/tips"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-white shadow-sm border border-gray-300"
                      : "text-gray-600"
                  }`
                }
              >
                Platform Tips
              </NavLink>
              <NavLink
                to="/financial-management/refunds"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-white shadow-sm border border-gray-300"
                      : "text-gray-600"
                  }`
                }
              >
                Refund System
              </NavLink>
            </div>
          </div>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </FinancialDashboardContext.Provider>
  );
}
