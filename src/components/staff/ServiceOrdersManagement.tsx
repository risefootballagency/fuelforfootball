import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ShoppingCart } from "lucide-react";
import { format } from "date-fns";

interface ServiceOrder {
  id: string;
  service_id: string | null;
  customer_email: string;
  customer_name: string | null;
  amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  selected_option: string | null;
  created_at: string;
  service_catalog?: { name: string } | null;
}

export const ServiceOrdersManagement = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('service_orders')
      .select('*, service_catalog(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }
    setOrders((data || []) as ServiceOrder[]);
    setLoading(false);
  };

  const filteredOrders = orders.filter(o => 
    statusFilter === 'all' || o.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500',
      paid: 'bg-green-500/20 text-green-500',
      completed: 'bg-blue-500/20 text-blue-500',
      cancelled: 'bg-red-500/20 text-red-500',
      refunded: 'bg-gray-500/20 text-gray-500',
    };
    return <Badge variant="outline" className={colors[status] || ''}>{status}</Badge>;
  };

  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'completed')
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Service Orders
        </h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="text-lg font-bold text-green-500">£{totalRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Orders</span>
              <span className="text-lg font-bold text-yellow-500">{pendingOrders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Option</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.service_catalog?.name || 'Unknown Service'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name || 'Guest'}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      £{order.amount.toFixed(2)} {order.currency !== 'GBP' && order.currency}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.selected_option || '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
