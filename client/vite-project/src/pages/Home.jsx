import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { IoSparkles } from 'react-icons/io5'
import { LuLogOut } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCurrentUser } from '../redux/userSlice'
import { ServerURL } from '../App'
import { PiCoin } from "react-icons/pi";
import { TbRobotFace } from "react-icons/tb";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";


function Home() {
  const currentUser = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
      icon: <TbRobotFace />
    },
    {
      number: 2,
      title: 'Smart Voice Interview',
      description: 'Dynamic follow-up questions based on your answers.',
      icon: <CiMicrophoneOn />
    },
    {
      number: 3,
      title: 'Timer Based Simulation',
      description: 'Real interview pressure with time tracking.',
      icon: <CiClock1 />

    }
  ]

  const capabilities = [
    {
      title: 'AI Answer Evaluation',
      description: 'Scores communication, technical accuracy and confidence.',
      image: '/content/ai-ans.png'
    },
    {
      title: 'Resume Based Interview',
      description: 'Project-specific questions based on uploaded resume.',
      image: '/content/resume.png'
    },
    {
      title: 'Downloadable PDF Report',
      description: 'Detailed strengths, weaknesses and improvement insights.',
      image: '/content/pdf.png'
    },
    {
      title: 'History & Analytics',
      description: 'Track progress with performance graphs and statistics.',
      image: '/content/history.png'
    }
  ]

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
      {/* Header Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white shadow-sm border-b border-gray-200'
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='bg-black text-white p-2 rounded-lg'>
              <RiRobot2Fill size={20} />
            </div>
            <h1 className='text-xl font-bold'>InterviewIQ.AI</h1>
          </div>
          <div className='flex items-center gap-6'>
            <div className='text-right'>
              <p className='text-gray-900 font-semibold'>{currentUser.name} </p>
              <p className='text-sm text-gray-500 flex items-center gap-1'><PiCoin size={16} />{currentUser.credits} Credits</p>

            </div>

            <button
              onClick={handleLogout}
              className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition'
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
          <h2 className='text-5xl md:text-6xl font-bold text-gray-900 mb-6'>
            Practice Interviews with{' '}
            <span className='text-green-500'>AI Intelligence</span>
          </h2>
          <p className='text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
            Role-based mock interviews with smart follow-ups, adaptive difficulty and real-time
            performance evaluation.
          </p>
          <div className='flex gap-4 justify-center flex-wrap'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/interview')}
              className='bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition'
            >
              Start Interview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/history')}
              className='bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition'
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
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, rotateZ: 0 }}
                style={{ rotate: index === 0 ? '-2deg' : index === 1 ? '0deg' : '2deg' }}
                className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center hover:shadow-2xl transition-shadow'
              >
                <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
                  <span className='text-3xl'>{step.icon}</span>
                </div>
                <p className='text-green-600 font-semibold text-sm mb-2'>STEP {step.number}</p>
                <h3 className='text-xl font-bold text-gray-800 mb-3'>{step.title}</h3>
                <p className='text-gray-600'>{step.description}</p>
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
          <h3 className='text-4xl font-bold text-center mb-4 text-gray-900'>
            Advanced AI <span className='text-green-500'>Capabilities</span>
          </h3>
          <p className='text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
            Powered by cutting-edge machine learning and natural language processing
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, rotateZ: 0 }}
                style={{ rotate: index % 2 === 0 ? '-2deg' : '2deg' }}
                className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow'
              >
                <div className='h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center'>
                  <img
                    src={capability.image}
                    alt={capability.title}
                    className='w-full h-full object-contain'
                  />
                </div>
                <h4 className='text-lg font-bold text-gray-800 mb-2'>{capability.title}</h4>
                <p className='text-gray-600 text-sm'>{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
