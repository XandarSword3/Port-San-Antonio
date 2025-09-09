'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Briefcase, Plus, Edit, Trash2, Save, X, DollarSign, Clock, MapPin, Settings, Globe, Shield } from 'lucide-react'
import { JobPosition, PageContent, FooterSettings, LegalPageContent } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { AutoCommitService } from '@/lib/autoCommit'

interface ContentManagerProps {
  jobPositions: JobPosition[]
  pageContent: PageContent[]
  footerSettings: FooterSettings
  legalPages: LegalPageContent[]
  onUpdateJobPositions: (positions: JobPosition[]) => void
  onUpdatePageContent: (content: PageContent[]) => void
  onUpdateFooterSettings: (settings: FooterSettings) => void
  onUpdateLegalPages: (pages: LegalPageContent[]) => void
}

export default function ContentManager({
  jobPositions,
  pageContent,
  footerSettings,
  legalPages,
  onUpdateJobPositions,
  onUpdatePageContent,
  onUpdateFooterSettings,
  onUpdateLegalPages
}: ContentManagerProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'jobs' | 'content' | 'footer' | 'legal'>('jobs')
  const [showAddJob, setShowAddJob] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null)
  const [editingContent, setEditingContent] = useState<PageContent | null>(null)
  const [editingFooter, setEditingFooter] = useState(false)
  const [editingLegal, setEditingLegal] = useState<LegalPageContent | null>(null)
  const [saving, setSaving] = useState(false)

  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'internship',
    location: '',
    description: '',
    requirements: '',
    benefits: '',
    salary: '',
    active: true
  })

  const [footerFormData, setFooterFormData] = useState({
    companyName: footerSettings.companyName,
    description: footerSettings.description,
    address: footerSettings.address,
    phone: footerSettings.phone,
    email: footerSettings.email,
    diningHours: footerSettings.diningHours,
    diningLocation: footerSettings.diningLocation,
    socialLinks: { ...footerSettings.socialLinks }
  })

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const jobData: JobPosition = {
        id: editingJob?.id || Date.now().toString(),
        ...jobFormData,
        requirements: jobFormData.requirements.split('\n').filter(r => r.trim()),
        benefits: jobFormData.benefits.split('\n').filter(b => b.trim()),
        createdAt: editingJob?.createdAt || new Date(),
        updatedAt: new Date()
      }

      let updatedJobs: JobPosition[]
      if (editingJob) {
        updatedJobs = jobPositions.map(job => 
          job.id === editingJob.id ? jobData : job
        )
        setEditingJob(null)
      } else {
        updatedJobs = [...jobPositions, jobData]
        setShowAddJob(false)
      }

      // Save to localStorage immediately for persistence
      try {
        localStorage.setItem('jobPositions', JSON.stringify(updatedJobs))
      } catch (error) {
        console.error('Error saving job positions to localStorage:', error)
      }

      onUpdateJobPositions(updatedJobs)
      resetJobForm()
      
      // Auto-commit to GitHub
      try {
        const result = await AutoCommitService.commitJobPositions(updatedJobs)
        AutoCommitService.showSuccessNotification(result, 'Job positions')
      } catch (error: any) {
        AutoCommitService.showErrorNotification(error, 'Job positions')
      }
    } catch (error) {
      console.error('Error saving job position:', error)
      alert('Error saving job position. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const resetJobForm = () => {
    setJobFormData({
      title: '',
      department: '',
      type: 'full-time',
      location: '',
      description: '',
      requirements: '',
      benefits: '',
      salary: '',
      active: true
    })
  }

  const handleEditJob = (job: JobPosition) => {
    setJobFormData({
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      description: job.description,
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
      salary: job.salary || '',
      active: job.active
    })
    setEditingJob(job)
    setShowAddJob(true)
  }

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job position?')) {
      return
    }

    const updatedJobs = jobPositions.filter(job => job.id !== id)
    
    // Save to localStorage immediately for persistence
    try {
      localStorage.setItem('jobPositions', JSON.stringify(updatedJobs))
    } catch (error) {
      console.error('Error saving job positions to localStorage:', error)
    }

    onUpdateJobPositions(updatedJobs)
    
    // Auto-commit to GitHub
    try {
      const result = await AutoCommitService.commitJobPositions(updatedJobs)
      AutoCommitService.showSuccessNotification(result, 'Job positions')
    } catch (error: any) {
      AutoCommitService.showErrorNotification(error, 'Job positions')
    }
  }

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const updatedFooter: FooterSettings = {
        ...footerSettings,
        ...footerFormData,
        lastUpdated: new Date(),
        updatedBy: 'admin' // TODO: Get from auth context
      }

      // Save to localStorage immediately for persistence
      try {
        localStorage.setItem('footerSettings', JSON.stringify(updatedFooter))
      } catch (error) {
        console.error('Error saving footer settings to localStorage:', error)
      }

      onUpdateFooterSettings(updatedFooter)
      setEditingFooter(false)
      
      // Auto-commit to GitHub
      try {
        const result = await AutoCommitService.commitFooterSettings(updatedFooter)
        AutoCommitService.showSuccessNotification(result, 'Footer settings')
      } catch (error: any) {
        AutoCommitService.showErrorNotification(error, 'Footer settings')
      }
    } catch (error) {
      console.error('Error updating footer settings:', error)
      alert('Error updating footer settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditFooter = () => {
    setFooterFormData({
      companyName: footerSettings.companyName,
      description: footerSettings.description,
      address: footerSettings.address,
      phone: footerSettings.phone,
      email: footerSettings.email,
      diningHours: footerSettings.diningHours,
      diningLocation: footerSettings.diningLocation,
      socialLinks: { ...footerSettings.socialLinks }
    })
    setEditingFooter(true)
  }

  const handleUpdateContent = (content: PageContent) => {
    const updated = pageContent.map(c => 
      c.id === content.id ? { ...content, updatedAt: new Date() } : c
    )
    onUpdatePageContent(updated)
    setEditingContent(null)
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'part-time': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'contract': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'internship': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Content Manager
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Positions ({jobPositions.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Page Content ({pageContent.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'footer'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Footer Settings
            </div>
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'legal'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Legal Pages ({legalPages.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Add Job Button */}
          <button
            onClick={() => {
              setShowAddJob(true)
              setEditingJob(null)
              resetJobForm()
            }}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Job Position
          </button>

          {/* Add/Edit Job Form */}
          {showAddJob && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingJob ? 'Edit Job Position' : 'Add New Job Position'}
              </h3>
              
              <form onSubmit={handleJobSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.title}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.department}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Employment Type *
                    </label>
                    <select
                      value={jobFormData.type}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={jobFormData.location}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Salary (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., $50,000 - $60,000"
                      value={jobFormData.salary}
                      onChange={(e) => setJobFormData(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    required
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requirements (one per line) *
                  </label>
                  <textarea
                    required
                    value={jobFormData.requirements}
                    onChange={(e) => setJobFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    rows={4}
                    placeholder="Bachelor's degree in relevant field&#10;2+ years of experience&#10;Strong communication skills"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Benefits (one per line) *
                  </label>
                  <textarea
                    required
                    value={jobFormData.benefits}
                    onChange={(e) => setJobFormData(prev => ({ ...prev, benefits: e.target.value }))}
                    rows={4}
                    placeholder="Health insurance&#10;Paid vacation&#10;401k matching"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={jobFormData.active}
                    onChange={(e) => setJobFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active (visible to applicants)
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      editingJob ? 'Update Position' : 'Add Position'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddJob(false)
                      setEditingJob(null)
                      resetJobForm()
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Jobs List */}
          <div className="space-y-4">
            {jobPositions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No job positions yet. Add one to get started!
              </div>
            ) : (
              jobPositions.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        {!job.active && (
                          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getJobTypeColor(job.type)}`}>
                          {job.type.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {job.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Benefits:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            {job.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Page Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Page Content Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Advanced content management for static pages coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Footer Settings Tab */}
      {activeTab === 'footer' && (
        <div className="space-y-6">
          {!editingFooter ? (
            // Display Footer Settings
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Footer Settings
                </h3>
                <button
                  onClick={handleEditFooter}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Footer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Company Information</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Name:</strong> {footerSettings.companyName}</p>
                    <p><strong>Description:</strong> {footerSettings.description}</p>
                    <p><strong>Address:</strong> {footerSettings.address}</p>
                    <p><strong>Phone:</strong> {footerSettings.phone}</p>
                    <p><strong>Email:</strong> {footerSettings.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dining Information</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Hours:</strong> {footerSettings.diningHours}</p>
                    <p><strong>Location:</strong> {footerSettings.diningLocation}</p>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 mt-4">Social Links</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {footerSettings.socialLinks.facebook && <p><strong>Facebook:</strong> {footerSettings.socialLinks.facebook}</p>}
                    {footerSettings.socialLinks.instagram && <p><strong>Instagram:</strong> {footerSettings.socialLinks.instagram}</p>}
                    {footerSettings.socialLinks.twitter && <p><strong>Twitter:</strong> {footerSettings.socialLinks.twitter}</p>}
                    {footerSettings.socialLinks.linkedin && <p><strong>LinkedIn:</strong> {footerSettings.socialLinks.linkedin}</p>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Footer Form
            <form onSubmit={handleFooterSubmit} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Footer Settings
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingFooter(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={footerFormData.companyName}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={footerFormData.description}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={footerFormData.address}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={footerFormData.phone}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={footerFormData.email}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dining Hours *
                    </label>
                    <input
                      type="text"
                      value={footerFormData.diningHours}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, diningHours: e.target.value }))}
                      placeholder="e.g., 24/7 or Mon-Sun 6AM-12AM"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dining Location
                    </label>
                    <input
                      type="text"
                      value={footerFormData.diningLocation}
                      onChange={(e) => setFooterFormData(prev => ({ ...prev, diningLocation: e.target.value }))}
                      placeholder="e.g., Main Restaurant, Beachside"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={footerFormData.socialLinks.facebook || ''}
                      onChange={(e) => setFooterFormData(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={footerFormData.socialLinks.instagram || ''}
                      onChange={(e) => setFooterFormData(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={footerFormData.socialLinks.twitter || ''}
                      onChange={(e) => setFooterFormData(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Footer Settings
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFooter(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Legal Pages Tab */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Legal Page Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Full legal page editing system coming soon. For now, pages are managed via static files.
            </p>
            
            <div className="mt-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Current legal pages available:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Privacy Policy</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Terms of Service</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Accessibility</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
