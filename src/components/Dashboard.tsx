import { useGiltItems } from '../hooks/useGiltItems'
import { TrendingUp, TrendingDown, Wallet, BarChart3, Plus } from 'lucide-react'

interface DashboardProps {
  onAddItem: () => void
}

export function Dashboard({ onAddItem }: DashboardProps) {
  const { items, loading } = useGiltItems()

  const totalValue = items.reduce((sum, item) => sum + (item.current_value || 0), 0)
  const totalFaceValue = items.reduce((sum, item) => sum + (item.face_value || 0), 0)
  const gainLoss = totalValue - totalFaceValue
  const gainLossPercent = totalFaceValue > 0 ? ((gainLoss / totalFaceValue) * 100) : 0

  const stats = [
    {
      label: 'Total Portfolio Value',
      value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Face Value',
      value: `$${totalFaceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Gain/Loss',
      value: `${gainLoss >= 0 ? '+' : ''}$${gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: gainLoss >= 0 ? TrendingUp : TrendingDown,
      color: gainLoss >= 0 ? 'from-teal-500 to-teal-600' : 'from-red-500 to-red-600',
      subtext: `${gainLossPercent.toFixed(2)}%`,
    },
    {
      label: 'Total Items',
      value: items.length.toString(),
      icon: BarChart3,
      color: 'from-amber-500 to-amber-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                {stat.subtext && (
                  <p className={`text-sm ${gainLoss >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                    {stat.subtext}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your gilt investments</p>
          <button
            onClick={onAddItem}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Item
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Items</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {item.category && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.category.color }}
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.isin || item.issuer || 'No details'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${(item.current_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Face: ${(item.face_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
