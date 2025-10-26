import { useState, useEffect } from 'react';
import { Package, FileText, DollarSign, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Loader from '../../components/common/Loader';
import { api } from '../../utils/api';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export default function FarmerDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api.getFarmerDashboard();
      setSummary(data.summary);
    } catch (error) {
      // Error handled by api.js
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Products',
      value: summary?.products?.total_count || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Contracts',
      value: summary?.contracts?.active_count || 0,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      label: 'Pending Contracts',
      value: summary?.contracts?.pending_count || 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(summary?.products?.total_inventory_value || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Products by Type */}
      <Card title="Inventory by Product Type">
        <div className="space-y-3">
          {summary?.products?.by_type?.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-gray-900">{product.type}</p>
                <p className="text-sm text-gray-600">
                  Available: {product.available_qty} {product.unit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {product.total_qty} {product.unit}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          ))}
          {(!summary?.products?.by_type ||
            summary.products.by_type.length === 0) && (
            <p className="text-center text-gray-500 py-4">
              No products listed yet
            </p>
          )}
        </div>
      </Card>

      {/* Contract Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Active Contracts Value">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(summary?.contracts?.total_active_value || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {summary?.contracts?.active_count || 0} active contracts
            </p>
          </div>
        </Card>

        <Card title="Pending Contracts Value">
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-yellow-600">
              {formatCurrency(summary?.contracts?.total_pending_value || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {summary?.contracts?.pending_count || 0} pending contracts
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {summary?.recent_activity?.slice(0, 5).map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border-l-4 border-primary-500 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {activity.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  Trader: {activity.trader_name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(activity.amount)}
                </p>
              </div>
            </div>
          ))}
          {(!summary?.recent_activity ||
            summary.recent_activity.length === 0) && (
            <p className="text-center text-gray-500 py-4">No recent activity</p>
          )}
        </div>
      </Card>
    </div>
  );
}
