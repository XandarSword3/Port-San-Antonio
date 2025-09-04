'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Save, X, Trash2, Eye, EyeOff } from 'lucide-react'
import { Dish } from '@/types'

interface MenuManagerProps {
  dishes: Dish[]
  onUpdate: (dishes: Dish[]) => void
}

export default function MenuManager({ dishes, onUpdate }: MenuManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Dish>>({})
  const [localDishes, setLocalDishes] = useState<Dish[]>(dishes)

  useEffect(() => {
    setLocalDishes(dishes)
  }, [dishes])

  const handleEdit = (dish: Dish) => {
    setEditingId(dish.id)
    setEditForm(dish)
  }

  const handleSave = async (id: string) => {
    try {
      const updatedDishes = localDishes.map(dish =>
        dish.id === id ? { ...dish, ...editForm } : dish
      )
      
      setLocalDishes(updatedDishes)
      onUpdate(updatedDishes)
      
      // Trigger live update for open menu clients
      window.dispatchEvent(new CustomEvent('admin-update'))
      
      setEditingId(null)
      setEditForm({})
    } catch (error) {
      console.error('Error saving dish:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this dish?')) {
      try {
        const updatedDishes = localDishes.filter(dish => dish.id !== id)
        setLocalDishes(updatedDishes)
        onUpdate(updatedDishes)
        
        // Trigger live update for open menu clients
        window.dispatchEvent(new CustomEvent('admin-update'))
      } catch (error) {
        console.error('Error deleting dish:', error)
      }
    }
  }

  const toggleAvailability = async (id: string) => {
    try {
      const updatedDishes = localDishes.map(dish =>
        dish.id === id ? { ...dish, available: !dish.available } : dish
      )
      
      setLocalDishes(updatedDishes)
      onUpdate(updatedDishes)
      
      // Trigger live update for open menu clients
      window.dispatchEvent(new CustomEvent('admin-update'))
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const handleInputChange = (field: keyof Dish, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
        <div className="text-sm text-gray-600">
          {localDishes.length} dishes total
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dish
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {localDishes.map((dish) => (
                <motion.tr
                  key={dish.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === dish.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Dish name"
                        />
                        <input
                          type="text"
                          value={editForm.shortDesc || ''}
                          onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Short description"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dish.name}</div>
                        <div className="text-sm text-gray-500">{dish.shortDesc}</div>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === dish.id ? (
                      <input
                        type="text"
                        value={editForm.categoryId || ''}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Category ID"
                      />
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dish.categoryId}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === dish.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Price"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {dish.variants ? (
                          <span className="text-xs text-gray-500">Multiple variants</span>
                        ) : (
                          `$${dish.price}`
                        )}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(dish.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dish.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors duration-200`}
                    >
                      {dish.available ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Unavailable
                        </>
                      )}
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === dish.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(dish.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(dish)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dish.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
