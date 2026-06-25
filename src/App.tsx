import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { ItemList } from './components/ItemList'
import { ItemForm } from './components/ItemForm'
import { ItemDetail } from './components/ItemDetail'
import { CategoryManager } from './components/CategoryManager'
import { useGiltItems } from './hooks/useGiltItems'
import type { GiltItem, GiltItemInsert } from './types/database'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GiltItem | null>(null)
  const [viewingItem, setViewingItem] = useState<GiltItem | null>(null)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const { addItem, updateItem } = useGiltItems()

  const handleAddItem = () => {
    setEditingItem(null)
    setShowItemForm(true)
  }

  const handleEditItem = (item: GiltItem) => {
    setEditingItem(item)
    setShowItemForm(true)
  }

  const handleViewItem = (item: GiltItem) => {
    setViewingItem(item)
  }

  const handleSubmitItem = async (data: GiltItemInsert) => {
    if (editingItem) {
      await updateItem(editingItem.id, data)
    } else {
      await addItem(data)
    }
  }

  const handleNavigate = (page: string) => {
    if (page === 'categories') {
      setShowCategoryManager(true)
    } else {
      setCurrentPage(page)
    }
  }

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'dashboard' && (
        <Dashboard onAddItem={handleAddItem} />
      )}
      {currentPage === 'items' && (
        <ItemList onEditItem={handleEditItem} onViewItem={handleViewItem} />
      )}

      {showItemForm && (
        <ItemForm
          item={editingItem}
          onSubmit={handleSubmitItem}
          onClose={() => {
            setShowItemForm(false)
            setEditingItem(null)
          }}
        />
      )}

      {viewingItem && (
        <ItemDetail
          item={viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}

      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </Layout>
  )
}
