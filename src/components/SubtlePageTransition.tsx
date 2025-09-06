'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const SubtlePageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut'
      }}
      className="relative"
    >
      {children}
    </motion.div>
  )
}

export default SubtlePageTransition
