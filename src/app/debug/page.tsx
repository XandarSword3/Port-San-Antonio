import BackButton from '@/components/BackButton'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center mb-4">
          <BackButton />
          <h1 className="text-2xl font-bold ml-2 dark:text-white">Debug Overlay</h1>
        </div>
        
        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white" data-testid="debug-title">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</p>
              <p className="text-lg font-semibold dark:text-white">light</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</p>
              <p className="text-lg font-semibold dark:text-white">en</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}