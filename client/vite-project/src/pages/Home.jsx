import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { LuLogOut } from 'react-icons/lu'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCurrentUser } from '../redux/userSlice'
import { ServerURL } from '../App'
import { PiCoin } from 'react-icons/pi'
import { TbRobotFace } from 'react-icons/tb'
import { CiMicrophoneOn } from 'react-icons/ci'
import { CiClock1 } from 'react-icons/ci'
import BuyCoinsModal from '../components/BuyCoinsModal'
import HexagonBackground from '../components/HexagonBackground'

function Home() {
  const currentUser = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showBuyCoins, setShowBuyCoins] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch(ServerURL + '/api/auth/logout', { credentials: 'include' })
      dispatch(clearCurrentUser())
      navigate('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const steps = [
    {
      number: 1,
      title: 'Role & Experience Selection',
      description: 'AI adjusts difficulty based on selected job role.',
      icon: <TbRobotFace />,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      number: 2,
      title: 'Smart Voice Interview',
      description: 'Dynamic follow-up questions based on your answers.',
      icon: <CiMicrophoneOn />,
      color: 'from-violet-400 to-purple-500',
    },
    {
      number: 3,
      title: 'Timer Based Simulation',
      description: 'Real interview pressure with time tracking.',
      icon: <CiClock1 />,
      color: 'from-emerald-400 to-green-500',
    },
  ]

  const capabilities = [
    {
      title: 'AI Answer Evaluation',
      description: 'Scores communication, technical accuracy and confidence.',
      image: '/content/ai-ans.png',
    },
    {
      title: 'Resume Based Interview',
      description: 'Project-specific questions based on uploaded resume.',
      image: '/content/resume.png',
    },
    {
      title: 'Downloadable PDF Report',
      description: 'Detailed strengths, weaknesses and improvement insights.',
      image: '/content/pdf.png',
    },
    {
      title: 'History & Analytics',
      description: 'Track progress with performance graphs and statistics.',
      image: '/content/history.png',
    },
  ]

  if (!currentUser) {
    return <Navigate to="/auth" replace />
  }

  return (
    <HexagonBackground>
      <div className='w-full min-h-screen overflow-y-auto'>
        {/* Header Navigation */}
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
            <div className='flex items-center gap-3'>
              <div className='bg-white text-black p-2 rounded-lg'>
                <RiRobot2Fill size={20} />
              </div>
              <h1 className='text-xl font-bold text-white tracking-tight'>
                InterviewIQ<span className='text-cyan-400'>.AI</span>
              </h1>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-white font-semibold'>{currentUser.name}</p>
                <p className='text-sm text-gray-400 flex items-center gap-1 justify-end'>
                  <PiCoin size={16} />
                  {currentUser.credits} Credits
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBuyCoins(true)}
                className='flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition font-semibold shadow-md shadow-orange-500/20'
              >
                <PiCoin size={16} />
                Buy Coins
              </motion.button>

              <button
                onClick={handleLogout}
                className='flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition'
              >
                <LuLogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-6 py-16'>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-20'
          >
            <h2 className='text-5xl md:text-6xl font-bold text-white mb-6'>
              Practice Interviews with{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a78bfa, #34d399)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AI Intelligence
              </span>
            </h2>
            <p className='text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed'>
              Role-based mock interviews with smart follow-ups, adaptive difficulty and real-time
              performance evaluation.
            </p>
            <div className='flex gap-4 justify-center flex-wrap'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/interview')}
                className='bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg shadow-white/10'
              >
                Start Interview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/history')}
                className='border border-gray-600 text-gray-300 px-8 py-3 rounded-full font-semibold hover:border-gray-400 hover:text-white transition'
              >
                View History
              </motion.button>
            </div>
          </motion.div>

          {/* Steps Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='mb-20'
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className='rounded-2xl p-8 text-center border border-gray-800 hover:border-gray-600 transition-all duration-300'
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} mb-4`}>
                    <span className='text-2xl text-white'>{step.icon}</span>
                  </div>
                  <p className='text-cyan-400 font-semibold text-sm mb-2'>STEP {step.number}</p>
                  <h3 className='text-xl font-bold text-white mb-3'>{step.title}</h3>
                  <p className='text-gray-400'>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Advanced AI Capabilities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='mb-20'
          >
            <h3 className='text-4xl font-bold text-center mb-4 text-white'>
              Advanced AI <span className='text-cyan-400'>Capabilities</span>
            </h3>
            <p className='text-center text-gray-400 mb-12 max-w-2xl mx-auto'>
              Powered by cutting-edge machine learning and natural language processing
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className='rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300'
                  style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className='h-32 bg-gray-900/60 border border-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center'>
                    <img
                      src={capability.image}
                      alt={capability.title}
                      className='w-full h-full object-contain'
                    />
                  </div>
                  <h4 className='text-lg font-bold text-white mb-2'>{capability.title}</h4>
                  <p className='text-gray-400 text-sm'>{capability.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Buy Coins Modal */}
      {showBuyCoins && <BuyCoinsModal onClose={() => setShowBuyCoins(false)} />}
    </HexagonBackground>
  )
}

export default Home
