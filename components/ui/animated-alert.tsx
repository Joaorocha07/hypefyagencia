'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'

export interface AlertProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
  showCloseButton?: boolean
  autoClose?: boolean
  autoCloseDelay?: number
}

const alertVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
}

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
}

export default function AnimatedAlert({
  isOpen,
  onClose,
  type,
  title,
  message,
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000
}: AlertProps) {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, isOpen, onClose])

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950/20',
          border: 'border-green-200 dark:border-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600 dark:text-green-400',
          titleColor: 'text-green-800 dark:text-green-200',
          messageColor: 'text-green-700 dark:text-green-300'
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-800',
          icon: XCircle,
          iconColor: 'text-red-600 dark:text-red-400',
          titleColor: 'text-red-800 dark:text-red-200',
          messageColor: 'text-red-700 dark:text-red-300'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          titleColor: 'text-yellow-800 dark:text-yellow-200',
          messageColor: 'text-yellow-700 dark:text-yellow-300'
        }
    }
  }

  const styles = getAlertStyles()
  const Icon = styles.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative w-full max-w-md p-6 rounded-xl border shadow-2xl ${styles.bg} ${styles.border}`}
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="flex items-start space-x-4">
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className={`flex-shrink-0 ${styles.iconColor}`}
              >
                <Icon className="h-8 w-8" />
              </motion.div>

              <div className="flex-1 space-y-2">
                <motion.h3
                  className={`text-lg font-semibold ${styles.titleColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {title}
                </motion.h3>
                <motion.p
                  className={`text-sm ${styles.messageColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {message}
                </motion.p>
              </div>
            </div>

            <motion.div
              className="mt-6 flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={onClose}
                className="px-6"
                variant={type === 'error' ? 'destructive' : 'default'}
              >
                OK
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}