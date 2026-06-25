import { usePriceHistory } from '../hooks/usePriceHistory'
import { X, Calendar, DollarSign, Percent, Building2, Hash, TrendingUp } from 'lucide-react'
import type { GiltItem } from '../types/database'
import { useEffect, useState } from 'react'

interface ItemDetailProps {
  item: GiltItem
  onClose: () => void
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function ItemDetail({ item, onClose }: ItemDetailProps) {
  const { history, addPriceEntry } = usePriceHistory(item.id)
  const [showPriceInput, setShowPriceInput] = useState(false)
  const [newPrice, setNewPrice] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAddPrice = async () => {
    if (!newPrice) return
    setAdding(true)
    try {
      await addPriceEntry(parseFloat(newPrice))
      setNewPrice('')
      setShowPriceInput(false)
    } catch (error) {
      console.error('Failed to add price:', error)
    } finally {
      setAdding(false)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const gainLoss = (item.current_value || 0) - (item.face_value || 0)
  const gainLossPercent = item.face_value ? (gainLoss / item.face_value) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.category && (
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.category.color }} />
            )}
            <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Face Value
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${(item.face_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Current Value
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${(item.current_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-xl ${gainLoss >= 0 ? 'bg-teal-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${gainLoss >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                  {gainLoss >= 0 ? 'Gain' : 'Loss'}
                </p>
                <p className={`text-2xl font-bold ${gainLoss >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
                  {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`text-right ${gainLoss >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                <p className="text-2xl font-bold">
                  {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">ISIN</p>
                <p className="text-sm font-medium text-gray-900">{item.isin || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Issuer</p>
                <p className="text-sm font-medium text-gray-900">{item.issuer || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Percent className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Coupon Rate</p>
                <p className="text-sm font-medium text-gray-900">
                  {item.coupon_rate ? `${item.coupon_rate}%` : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900">{item.category?.name || '-'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Purchase Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(item.purchase_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Maturity Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(item.maturity_date)}</p>
              </div>
            </div>
          </div>

          {item.description && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700">{item.description}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Price History</h3>
              <button
                onClick={() => setShowPriceInput(!showPriceInput)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Entry
              </button>
            </div>

            {showPriceInput && (
              <div className="flex gap-2 mb-3 animate-fade-in">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter price"
                  />
                </div>
                <button
                  onClick={handleAddPrice}
                  disabled={adding || !newPrice}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>
            )}

            {history.length > 0 ? (
              <div className="space-y-2">
                {[...history].reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        ${entry.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.recorded_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No price history yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
