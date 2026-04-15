import React from 'react'
import { motion } from 'motion/react'
import { IoSparkles, IoCheckmarkCircle } from 'react-icons/io5'
import { FiAward, FiTarget, FiClock, FiTrendingUp, FiArrowLeft } from 'react-icons/fi'
import { BsLightningCharge } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function Step3Report({ report, questions, answers, role, experience, interviewType, duration, onRestart }) {
    const navigate = useNavigate()

    const score = report?.score ?? 0
    const summary = report?.summary ?? ''
    const strengths = report?.strengths ?? []
    const improvements = report?.improvements ?? []
    const questionFeedback = report?.questionFeedback ?? []

    const scoreColor = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'
    const scoreRingColor = score >= 80 ? 'border-green-500' : score >= 50 ? 'border-yellow-500' : 'border-red-500'

    const answeredCount = answers.filter(a => a && a.trim()).length

    const getRatingColor = (rating) => {
        if (rating === 'good') return 'bg-green-100 text-green-700'
        if (rating === 'average') return 'bg-yellow-100 text-yellow-700'
        return 'bg-red-100 text-red-700'
    }

    return (
        <div className='max-w-3xl mx-auto px-6 py-12'>
            {/* Score Hero */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className='text-center mb-10'
            >
                <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${scoreRingColor} mb-6`}>
                    <span className={`text-4xl font-bold ${scoreColor}`}>{score}%</span>
                </div>
                <h2 className='text-4xl font-bold text-gray-900 mb-2'>
                    Interview <span className='text-green-500'>Complete!</span>
                </h2>
                <p className='text-gray-600 text-lg'>
                    You answered {answeredCount} of {questions.length} questions in {duration}
                </p>
                {summary && (
                    <p className='text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed'>{summary}</p>
                )}
            </motion.div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className='grid grid-cols-3 gap-4 mb-8'
            >
                {[
                    { icon: <FiAward size={22} className='text-green-500' />, label: 'Score', value: `${score}%` },
                    { icon: <FiTarget size={22} className='text-blue-500' />, label: 'Questions', value: `${answeredCount}/${questions.length}` },
                    { icon: <FiClock size={22} className='text-purple-500' />, label: 'Duration', value: duration },
                ].map((stat, i) => (
                    <div key={i} className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center'>
                        <div className='flex items-center justify-center mb-2'>{stat.icon}</div>
                        <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
                        <p className='text-sm text-gray-500'>{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Strengths & Improvements */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'
                >
                    <div className='flex items-center gap-2 mb-4'>
                        <FiTrendingUp size={20} className='text-green-500' />
                        <h3 className='text-lg font-bold text-gray-800'>Strengths</h3>
                    </div>
                    <ul className='space-y-3'>
                        {strengths.map((s, i) => (
                            <li key={i} className='flex items-start gap-2'>
                                <IoCheckmarkCircle size={20} className='text-green-500 mt-0.5 shrink-0' />
                                <span className='text-gray-700 text-sm'>{s}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6'
                >
                    <div className='flex items-center gap-2 mb-4'>
                        <FiTarget size={20} className='text-orange-500' />
                        <h3 className='text-lg font-bold text-gray-800'>Areas to Improve</h3>
                    </div>
                    <ul className='space-y-3'>
                        {improvements.map((s, i) => (
                            <li key={i} className='flex items-start gap-2'>
                                <BsLightningCharge size={18} className='text-orange-500 mt-0.5 shrink-0' />
                                <span className='text-gray-700 text-sm'>{s}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Per-Question Feedback */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8'
            >
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Detailed Question Feedback</h3>
                <div className='flex flex-wrap gap-3 mb-4'>
                    {[
                        { label: role, color: 'bg-green-100 text-green-700' },
                        { label: experience, color: 'bg-blue-100 text-blue-700' },
                        { label: interviewType, color: 'bg-purple-100 text-purple-700' },
                    ].map((tag, i) => (
                        <span key={i} className={`${tag.color} px-4 py-1.5 rounded-full text-sm font-medium`}>
                            {tag.label}
                        </span>
                    ))}
                </div>
                <div className='space-y-6 max-h-[500px] overflow-y-auto pr-2'>
                    {questions.map((q, i) => {
                        const fb = questionFeedback.find(f => f.questionIndex === i) || {}
                        return (
                            <div key={i} className='border-l-4 border-green-400 pl-4'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <p className='text-sm font-semibold text-gray-800'>Q{i + 1}: {q}</p>
                                    {fb.rating && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRatingColor(fb.rating)}`}>
                                            {fb.rating}
                                        </span>
                                    )}
                                </div>
                                <p className='text-sm text-gray-600 mb-1'>
                                    <span className='font-medium text-gray-700'>Your answer: </span>
                                    {answers[i]?.trim() ? answers[i] : <span className='italic text-gray-400'>No answer provided</span>}
                                </p>
                                {fb.feedback && (
                                    <p className='text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 mt-1'>
                                        💡 {fb.feedback}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className='flex flex-col sm:flex-row gap-4 justify-center'
            >
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onRestart}
                    className='bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2'
                >
                    <IoSparkles size={18} />
                    New Interview
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/')}
                    className='bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2'
                >
                    <FiArrowLeft size={18} />
                    Back to Home
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Step3Report
