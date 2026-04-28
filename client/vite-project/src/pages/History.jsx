import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { LuLogOut } from 'react-icons/lu'
import { PiCoin } from 'react-icons/pi'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCurrentUser } from '../redux/userSlice'
import { ServerURL } from '../App'
import { FiCalendar, FiAward, FiEye, FiClock } from 'react-icons/fi'
import HexagonBackground from '../components/HexagonBackground'

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
    return <Navigate to="/auth" replace />
  }

  return (
    <HexagonBackground>
      <div className='w-full min-h-screen overflow-y-auto'>
        {/* Header */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='sticky top-0 z-50 px-6 py-4'
          style={{
            background: 'rgba(10, 10, 10, 0.6)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className='max-w-7xl mx-auto flex justify-between items-center'>
            <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
              <div className='bg-white text-black p-2 rounded-lg'>
                <RiRobot2Fill size={20} />
              </div>
              <h1 className='text-xl font-bold text-white tracking-tight'>
                InterviewIQ<span className='text-cyan-400'>.AI</span>
              </h1>
            </div>
            <div className='flex items-center gap-6'>
              <div className='text-right'>
                <p className='text-white font-semibold'>{currentUser.name}</p>
                <p className='text-sm text-gray-400 flex items-center gap-1'>
                  <PiCoin size={16} />{currentUser.credits} Credits
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition'
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
            <h2 className='text-3xl font-bold text-white mb-2'>Interview History</h2>
            <p className='text-gray-400 mb-8'>Track all your past interviews and view reports</p>

            {error && (
              <div className='bg-red-900/40 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6'>
                {error}
              </div>
            )}

            {loading ? (
              <div className='flex flex-col items-center justify-center py-20 gap-4'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className='w-12 h-12 border-4 border-cyan-800 border-t-cyan-400 rounded-full'
                />
                <p className='text-gray-400'>Loading your interviews...</p>
              </div>
            ) : interviews.length === 0 ? (
              <div
                className='text-center py-16 rounded-2xl border border-gray-800'
                style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <FiCalendar size={48} className='mx-auto text-gray-600 mb-4' />
                <h3 className='text-xl font-semibold text-white mb-2'>No interviews yet</h3>
                <p className='text-gray-400 mb-6'>Start your first interview to see your history here</p>
                <button
                  onClick={() => navigate('/interview')}
                  className='bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg shadow-white/10'
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
                    className='rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300'
                    style={{
                      background: 'rgba(20, 20, 20, 0.6)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex flex-wrap gap-2 mb-2'>
                          <span className='bg-cyan-500/15 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium border border-cyan-500/20'>
                            {interview.role}
                          </span>
                          <span className='bg-violet-500/15 text-violet-400 px-3 py-1 rounded-full text-sm font-medium border border-violet-500/20'>
                            {interview.experience}
                          </span>
                          <span className='bg-purple-500/15 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/20'>
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
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : interview.status === 'active'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'
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
                          className='flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 transition shrink-0 shadow-lg shadow-white/5'
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
    </HexagonBackground>
  )
}

export default History
