'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Users, Star, MapPin, Clock, DollarSign, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import PageTransition from '@/components/PageTransition'
import { JobPosition } from '@/types'

export default function CareersPage() {
  const { t, language } = useLanguage()
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([])

  useEffect(() => {
    // Try to load job positions from localStorage (admin updates)
    try {
      const adminData = localStorage.getItem('adminData')
      if (adminData) {
        const data = JSON.parse(adminData)
        if (data.jobPositions && data.jobPositions.length > 0) {
          // Only show active positions
          setJobPositions(data.jobPositions.filter((job: JobPosition) => job.active))
          return
        }
      }
    } catch (error) {
      console.log('No admin job data found, using default positions')
    }

    // Fallback to default positions if no admin data
    const defaultPositions: JobPosition[] = [
    {
      id: "1",
      title: "Head Chef",
      department: "Kitchen",
      type: "Full-time",
      location: "Port Antonio, Lebanon",
      description: "Lead our culinary team in creating exceptional Mediterranean and international cuisine. Oversee kitchen operations, menu development, and staff management.",
      requirements: [
        "5+ years of experience as a head chef or sous chef",
        "Culinary degree or equivalent experience", 
        "Experience with Mediterranean cuisine",
        "Strong leadership and communication skills",
        "Food safety certification"
      ],
      benefits: [
        "Competitive salary package",
        "Health and dental insurance",
        "Staff meals and accommodation",
        "Professional development opportunities",
        "Performance bonuses"
      ]
    },
    {
      id: "2", 
      title: "Server",
      department: "Front of House",
      type: "Full-time / Part-time",
      location: "Port Antonio, Lebanon",
      description: "Provide exceptional dining service to our guests. Take orders, serve food and beverages, and ensure customer satisfaction in our beautiful beachfront setting.",
      requirements: [
        "Previous serving experience preferred",
        "Excellent communication skills",
        "Ability to work in a fast-paced environment",
        "Knowledge of food and wine pairings",
        "Multilingual skills (Arabic, French, English) preferred"
      ],
      benefits: [
        "Hourly wages plus tips",
        "Flexible scheduling",
        "Staff meal benefits",
        "Training and development",
        "Friendly work environment"
      ]
    },
    {
      id: "3",
      title: "Sous Chef",
      department: "Kitchen", 
      type: "Full-time",
      location: "Port Antonio, Lebanon",
      description: "Support the head chef in daily kitchen operations, food preparation, and staff supervision. Help maintain our high culinary standards.",
      requirements: [
        "3+ years of professional kitchen experience",
        "Culinary training or apprenticeship",
        "Knowledge of food safety standards",
        "Ability to work under pressure",
        "Team player with leadership potential"
      ],
      benefits: [
        "Competitive salary",
        "Career advancement opportunities",
        "Health benefits",
        "Staff accommodation available",
        "Continuing education support"
      ]
    }
  ]

    setJobPositions(defaultPositions.map(job => ({ 
      ...job, 
      active: true, 
      createdAt: new Date(),
      salary: job.benefits[0] // Map first benefit as salary placeholder
    })))
  }, [])

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  {t('careers')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Join our team at Port Antonio Resort
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Why Work With Us */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Why Work With Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Beautiful Location</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Work in a stunning beachfront resort with breathtaking Mediterranean views
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Great Team</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Join a passionate team dedicated to providing exceptional hospitality experiences
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Career Growth</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Opportunities for professional development and advancement within our organization
                  </p>
                </div>
              </div>
            </div>

            {/* Current Openings */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Current Openings
              </h2>
              <div className="space-y-6">
                {jobPositions.map((job, index) => (
                  <motion.div  
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.type.replace('-', ' ')}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                            <Send className="w-4 h-4" />
                            Apply Now
                          </button>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {job.description}
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Requirements
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {job.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-blue-600 mt-1.5">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Benefits
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {job.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1.5">•</span>
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                How to Apply
              </h2>
              <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>
                  Ready to join our team? We'd love to hear from you! Here's how to apply:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Application</h3>
                    <p className="text-sm mb-2">Send your resume and cover letter to:</p>
                    <p className="font-semibold">careers@portantonio.com</p>
                    <p className="text-sm">Include the position title in the subject line</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">In-Person Application</h3>
                    <p className="text-sm mb-2">Visit us during business hours:</p>
                    <p className="font-semibold">Port Antonio, Mastita, Lebanon</p>
                    <p className="text-sm">Monday - Friday, 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Equal Opportunity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Equal Opportunity Employer
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Port Antonio Resort is committed to creating a diverse and inclusive workplace. We are an equal opportunity employer and welcome applications from all qualified candidates regardless of race, color, religion, sex, sexual orientation, gender identity, national origin, age, or disability status.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
