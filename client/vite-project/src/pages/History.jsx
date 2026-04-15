import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { LuLogOut } from 'react-icons/lu'
import { PiCoin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCurrentUser } from '../redux/userSlice'
import { ServerURL } from '../App'
import { FiCalendar, FiAward, FiEye, FiClock } from 'react-icons/fi'

function History() {
  const currentUser = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(ServerURL + '/api/interview/history', { credentials: 'include' })
        const data = await res.json()
        if (res.ok) {
          setInterviews(data.interviews || [])
        } else {
          setError(data.message || 'Failed to load history')
        }
      } catch (err) {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch(ServerURL + '/api/auth/logout', { credentials: 'include' })
      dispatch(clearCurrentUser())
      navigate('/auth')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!currentUser) {
    return (
      <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center'
        >
          <p className='text-gray-600 text-lg mb-4'>Please log in to continue</p>
          <button
            onClick={() => navigate('/auth')}
            className='bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition'
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white shadow-sm border-b border-gray-200'
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
            <div className='bg-black text-white p-2 rounded-lg'>
              <RiRobot2Fill size={20} />
            </div>
            <h1 className='text-xl font-bold'>InterviewIQ.AI</h1>
          </div>
          <div className='flex items-center gap-6'>
            <div className='text-right'>
              <p className='text-gray-900 font-semibold'>{currentUser.name}</p>
              <p className='text-sm text-gray-500 flex items-center gap-1'>
                <PiCoin size={16} />{currentUser.credits} Credits
              </p>
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition'
            >
              <LuLogOut size={15} />Logout
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className='max-w-4xl mx-auto px-6 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Interview History</h2>
          <p className='text-gray-600 mb-8'>Track all your past interviews and view reports</p>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6'>
              {error}
            </div>
          )}

          {loading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-4'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full'
              />
              <p className='text-gray-500'>Loading your interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div className='text-center py-16 bg-gray-50 rounded-2xl border border-gray-200'>
              <FiCalendar size={48} className='mx-auto text-gray-400 mb-4' />
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>No interviews yet</h3>
              <p className='text-gray-600 mb-6'>Start your first interview to see your history here</p>
              <button
                onClick={() => navigate('/interview')}
                className='bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition'
              >
                Start Interview
              </button>
            </div>
          ) : (
            <div className='space-y-4'>
              {interviews.map((interview, index) => (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className='bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium'>
                          {interview.role}
                        </span>
                        <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
                          {interview.experience}
                        </span>
                        <span className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium'>
                          {interview.interviewType}
                        </span>
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span className='flex items-center gap-1'>
                          <FiCalendar size={14} />{formatDate(interview.createdAt)}
                        </span>
                        <span className='flex items-center gap-1'>
                          <FiAward size={14} />{interview.questionCount} questions
                        </span>
                      </div>
                      <div className='mt-2 flex items-center gap-2'>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            interview.status === 'complete'
                              ? 'bg-green-100 text-green-700'
                              : interview.status === 'active'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <FiClock size={12} />
                          {interview.status}
                        </span>
                      </div>
                    </div>
                    {interview.status === 'complete' && (
                      <button
                        onClick={() => navigate(`/report/${interview._id}`)}
                        className='flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition shrink-0'
                      >
                        <FiEye size={18} />
                        View Report
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default History
