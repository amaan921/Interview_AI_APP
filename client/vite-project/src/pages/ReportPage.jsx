import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { LuLogOut } from 'react-icons/lu'
import { PiCoin } from 'react-icons/pi'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCurrentUser } from '../redux/userSlice'
import { ServerURL } from '../App'
import Step3Report from '../components/step3Report'

function ReportPage() {
  const currentUser = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const [interview, setInterview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await fetch(ServerURL + `/api/interview/${id}`, { credentials: 'include' })
        const data = await res.json()
        if (res.ok) {
          setInterview(data.interview)
        } else {
          setError(data.message || 'Failed to load report')
        }
      } catch (err) {
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchInterview()
  }, [id])

  const handleLogout = async () => {
    try {
      await fetch(ServerURL + '/api/auth/logout', { credentials: 'include' })
      dispatch(clearCurrentUser())
      navigate('/auth')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (!currentUser) {
    return (
      <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600 text-lg mb-4'>Please log in to continue</p>
          <button
            onClick={() => navigate('/auth')}
            className='bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition'
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const Navbar = (
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
  )

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-white'>
        {Navbar}
        <div className='flex flex-col items-center justify-center h-[70vh] gap-6'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className='w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full'
          />
          <p className='text-gray-500'>Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !interview || interview.status !== 'complete') {
    return (
      <div className='w-full min-h-screen bg-white'>
        {Navbar}
        <div className='max-w-3xl mx-auto px-6 py-12'>
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl'>
            {error || 'Report not available'}
          </div>
          <button
            onClick={() => navigate('/history')}
            className='mt-6 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition'
          >
            Back to History
          </button>
        </div>
      </div>
    )
  }

  const duration = interview.report?.duration || 'N/A'

  return (
    <div className='w-full min-h-screen bg-white'>
      {Navbar}
      <Step3Report
        report={interview.report}
        questions={interview.questions}
        answers={interview.answers || []}
        role={interview.role}
        experience={interview.experience}
        interviewType={interview.interviewType}
        duration={duration}
        onRestart={() => navigate('/interview')}
      />
      <div className='max-w-3xl mx-auto px-6 pb-8 -mt-4'>
        <button
          onClick={() => navigate('/history')}
          className='text-gray-600 hover:text-gray-900 text-sm font-medium'
        >
          ← Back to History
        </button>
      </div>
    </div>
  )
}

export default ReportPage
