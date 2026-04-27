import { useEffect, useState, lazy, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MyEarnings } from "./staffpay/MyEarnings";
import { PayslipTab } from "./staffpay/PayslipTab";

const ExpensesManagement = lazy(() => import("./ExpensesManagement").then(m => ({ default: m.ExpensesManagement })));
const AllStaffTab = lazy(() => import("./staffpay/AllStaffTab").then(m => ({ default: m.AllStaffTab })));

interface Props { isAdmin?: boolean; }

const Fallback = () => (
  <div className="flex items-center justify-center p-8"><Loader2 className="w-5 h-5 animate-spin" /></div>
);

export const StaffPay = ({ isAdmin }: Props) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<string>(() => localStorage.getItem('staffpay_tab') || 'earnings');

  useEffect(() => { localStorage.setItem('staffpay_tab', tab); }, [tab]);

  if (!user) return <Fallback />;

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="earnings">My Earnings</TabsTrigger>
            <TabsTrigger value="payslip">Payslip</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            {isAdmin && <TabsTrigger value="all">All Staff</TabsTrigger>}
          </TabsList>

          <TabsContent value="earnings" className="mt-4">
            {tab === 'earnings' && <MyEarnings staffUserId={user.id} isAdmin={isAdmin} />}
          </TabsContent>
          <TabsContent value="payslip" className="mt-4">
            {tab === 'payslip' && <PayslipTab staffUserId={user.id} staffEmail={user.email || undefined} />}
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            {tab === 'expenses' && (
              <Suspense fallback={<Fallback />}><ExpensesManagement isAdmin={isAdmin} /></Suspense>
            )}
          </TabsContent>
          {isAdmin && (
            <TabsContent value="all" className="mt-4">
              {tab === 'all' && (
                <Suspense fallback={<Fallback />}><AllStaffTab /></Suspense>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};
