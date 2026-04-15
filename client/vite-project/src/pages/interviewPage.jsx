import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { LuLogOut } from 'react-icons/lu'
import { PiCoin } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { clearCurrentUser, updateCredits } from '../redux/userSlice'
import { ServerURL } from '../App'
import Step1Setup from '../components/step1Setup'
import Step2Interview from '../components/step2Interview'
import Step3Report from '../components/step3Report'

function InterviewPage() {
  const currentUser = useSelector(state => state.user.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Flow phases: 'setup' | 'active' | 'evaluating' | 'report'
  const [phase, setPhase] = useState('setup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Interview data shared across phases
  const [interviewId, setInterviewId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [report, setReport] = useState(null)
  const [duration, setDuration] = useState('00:00')
  const [config, setConfig] = useState({ role: '', experience: '', interviewType: '' })

  const handleLogout = async () => {
    try {
      await fetch(ServerURL + '/api/auth/logout', { credentials: 'include' })
      dispatch(clearCurrentUser())
      navigate('/auth')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  // ── Step 1: Generate questions via AI ──────────────────────────────────
  const handleStart = async ({ role, experience, interviewType, questionCount, resumeFile }) => {
    setLoading(true)
    setError('')
    setConfig({ role, experience, interviewType })

    try {
      const formData = new FormData()
      formData.append('role', role)
      formData.append('experience', experience)
      formData.append('interviewType', interviewType)
      formData.append('questionCount', questionCount)
      if (resumeFile) {
        formData.append('resume', resumeFile)
      }

      const res = await fetch(ServerURL + '/api/interview/generate', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setInterviewId(data.interviewId)
        setQuestions(data.questions)
        if (typeof data.credits === 'number') {
          dispatch(updateCredits(data.credits))
        }
        setConfig({
          role: data.role || role,
          experience: data.experience || experience,
          interviewType: data.interviewType || interviewType,
        })
        setPhase('active')
      } else {
        setError(data.message || 'Failed to generate questions.')
      }
    } catch (err) {
      console.error('Generate error:', err)
      setError('Network error. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2 → Step 3: Evaluate answers via AI ──────────────────────────
  const handleEvaluate = async (userAnswers, timerDuration) => {
    setAnswers(userAnswers)
    setDuration(timerDuration)
    setPhase('evaluating')
    setError('')

    try {
      const res = await fetch(ServerURL + '/api/interview/evaluate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId, answers: userAnswers }),
      })

      const data = await res.json()

      if (res.ok) {
        setReport(data.report)
        setPhase('report')
      } else {
        setError(data.message || 'Failed to evaluate answers.')
        setPhase('active') // let user retry
      }
    } catch (err) {
      console.error('Evaluate error:', err)
      setError('Network error. Make sure the server is running.')
      setPhase('active')
    }
  }

  const handleRestart = () => {
    setPhase('setup')
    setInterviewId(null)
    setQuestions([])
    setAnswers([])
    setReport(null)
    setDuration('00:00')
    setError('')
  }

  // ── Auth guard ─────────────────────────────────────────────────────────
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
          <button onClick={() => navigate('/auth')}
            className='bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition'>
            Go to Login
          </button>
        </motion.div>
      </div>
    )
  }

  // ── Navbar ─────────────────────────────────────────────────────────────
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
          <button onClick={handleLogout}
            className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition'>
            <LuLogOut size={15} />Logout
          </button>
        </div>
      </div>
    </motion.nav>
  )

  // ── Evaluating state (loading screen) ──────────────────────────────────
  if (phase === 'evaluating') {
    return (
      <div className='w-full min-h-screen bg-white'>
        {Navbar}
        <div className='flex flex-col items-center justify-center h-[70vh] gap-6'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className='w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full'
          />
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>AI is Evaluating Your Answers</h2>
            <p className='text-gray-500'>Analyzing responses, scoring performance, generating feedback...</p>
          </div>
        </div>
      </div>
    )
  }

  // ── Active interview (Step 2 — has its own navbar) ─────────────────────
  if (phase === 'active') {
    return (
      <Step2Interview
        questions={questions}
        role={config.role}
        interviewType={config.interviewType}
        onComplete={(ans, dur) => handleEvaluate(ans, dur)}
        onEndEarly={(ans, dur) => handleEvaluate(ans, dur)}
      />
    )
  }

  // ── Setup & Report phases (share the navbar) ──────────────────────────
  return (
    <div className='w-full min-h-screen bg-white'>
      {Navbar}

      {/* Error banner */}
      {error && (
        <div className='max-w-3xl mx-auto px-6 pt-6'>
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm'>
            {error}
          </div>
        </div>
      )}

      {phase === 'setup' && (
        <Step1Setup onStart={handleStart} loading={loading} credits={currentUser?.credits ?? 0} />
      )}

      {phase === 'report' && (
        <Step3Report
          report={report}
          questions={questions}
          answers={answers}
          role={config.role}
          experience={config.experience}
          interviewType={config.interviewType}
          duration={duration}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default InterviewPage
