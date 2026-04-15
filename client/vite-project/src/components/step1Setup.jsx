import React, { useState } from 'react'
import { motion } from 'motion/react'
import { IoSparkles } from 'react-icons/io5'
import { FiChevronRight, FiUpload, FiX } from 'react-icons/fi'
import { HiOutlineBriefcase } from 'react-icons/hi'
import { BsLightningCharge } from 'react-icons/bs'

const roles = ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'DevOps Engineer', 'Data Scientist', 'ML Engineer']
const experiences = ['Junior', 'Mid', 'Senior']
const types = ['Technical', 'Behavioral', 'System Design', 'Mixed']
const counts = [5, 10, 15]
const CREDITS_PER_INTERVIEW = 10

function Step1Setup({ onStart, loading, credits = 100 }) {
    const insufficientCredits = credits < CREDITS_PER_INTERVIEW
    const [role, setRole] = useState('Frontend Developer')
    const [experience, setExperience] = useState('Junior')
    const [interviewType, setInterviewType] = useState('Technical')
    const [questionCount, setQuestionCount] = useState(5)
    const [resumeFile, setResumeFile] = useState(null)

    const handleSubmit = () => {
        if (resumeFile) {
            // Resume mode — only send resume + question count
            onStart({ role: '', experience: '', interviewType: '', questionCount, resumeFile })
        } else {
            // Manual mode — send form data
            onStart({ role, experience, interviewType, questionCount, resumeFile: null })
        }
    }

    return (
        <div className='max-w-3xl mx-auto px-6 py-12'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='text-center mb-10'
            >
                <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                    Configure Your <span className='text-green-500'>Interview</span>
                </h2>
                <p className='text-gray-600 text-lg max-w-xl mx-auto'>
                    Upload your resume for AI-tailored questions, or fill in details manually.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8'
            >
                {/* Resume Upload — always shown at top */}
                <div className='mb-6'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        <FiUpload className='inline mr-2' />
                        Upload Resume <span className='text-gray-400 font-normal'>(PDF only)</span>
                    </label>

                    {!resumeFile ? (
                        <label className='flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-8 text-gray-500 bg-gray-50 hover:bg-gray-100 hover:border-green-400 cursor-pointer transition'>
                            <FiUpload size={22} />
                            <span>Click to upload your resume PDF</span>
                            <input
                                type='file'
                                accept='.pdf'
                                className='hidden'
                                onChange={e => setResumeFile(e.target.files?.[0] || null)}
                            />
                        </label>
                    ) : (
                        <div className='flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-4'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-green-100 p-2 rounded-lg'>
                                    <FiUpload size={18} className='text-green-600' />
                                </div>
                                <div>
                                    <p className='text-sm font-semibold text-gray-800'>{resumeFile.name}</p>
                                    <p className='text-xs text-gray-500'>{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setResumeFile(null)}
                                className='text-red-500 hover:bg-red-50 p-2 rounded-lg transition'
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    )}

                    {resumeFile && (
                        <p className='text-sm text-green-600 mt-2 font-medium'>
                            ✓ AI will extract your skills, experience, and projects to generate tailored interview questions.
                        </p>
                    )}
                </div>

                {/* Divider with OR */}
                {!resumeFile && (
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='flex-1 h-px bg-gray-200'></div>
                        <span className='text-sm text-gray-400 font-medium'>OR FILL MANUALLY</span>
                        <div className='flex-1 h-px bg-gray-200'></div>
                    </div>
                )}

                {/* Manual form fields — only show when NO resume is uploaded */}
                {!resumeFile && (
                    <>
                        {/* Role */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                <HiOutlineBriefcase className='inline mr-2' />
                                Job Role
                            </label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className='w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition'
                            >
                                {roles.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Experience */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                <BsLightningCharge className='inline mr-2' />
                                Experience Level
                            </label>
                            <div className='flex gap-3'>
                                {experiences.map(exp => (
                                    <button
                                        key={exp}
                                        onClick={() => setExperience(exp)}
                                        className={`flex-1 py-3 rounded-xl font-medium text-sm transition border ${experience === exp
                                                ? 'bg-green-500 text-white border-green-500 shadow-md'
                                                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                    >
                                        {exp}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interview Type */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                <IoSparkles className='inline mr-2' />
                                Interview Type
                            </label>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                {types.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setInterviewType(t)}
                                        className={`py-3 rounded-xl font-medium text-sm transition border ${interviewType === t
                                                ? 'bg-green-500 text-white border-green-500 shadow-md'
                                                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Number of Questions — always shown */}
                <div className='mb-8'>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                        Number of Questions
                    </label>
                    <div className='flex gap-3'>
                        {counts.map(c => (
                            <button
                                key={c}
                                onClick={() => setQuestionCount(c)}
                                className={`flex-1 py-3 rounded-xl font-medium text-sm transition border ${questionCount === c
                                        ? 'bg-green-500 text-white border-green-500 shadow-md'
                                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                {c} Questions
                            </button>
                        ))}
                    </div>
                </div>

                {insufficientCredits && (
                    <div className='mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm'>
                        You need {CREDITS_PER_INTERVIEW} credits to start an interview. You have {credits} credits.
                    </div>
                )}
                {/* Start Button */}
                <motion.button
                    whileHover={!loading && !insufficientCredits ? { scale: 1.03 } : {}}
                    whileTap={!loading && !insufficientCredits ? { scale: 0.97 } : {}}
                    onClick={handleSubmit}
                    disabled={loading || insufficientCredits}
                    className={`w-full py-4 rounded-full font-semibold text-lg transition flex items-center justify-center gap-2 ${loading || insufficientCredits
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                            </svg>
                            AI is generating questions...
                        </>
                    ) : (
                        <>
                            Generate Questions
                            <FiChevronRight size={20} />
                        </>
                    )}
                </motion.button>
            </motion.div>

            {/* Quick Summary Tags */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className='mt-6 flex flex-wrap gap-3 justify-center'
            >
                {resumeFile ? (
                    <span className='bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium'>
                        📄 Resume: {resumeFile.name}
                    </span>
                ) : (
                    <>
                        <span className='bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium'>{role}</span>
                        <span className='bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium'>{experience}</span>
                        <span className='bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium'>{interviewType}</span>
                    </>
                )}
                <span className='bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium'>{questionCount} Qs</span>
            </motion.div>
        </div>
    )
}

export default Step1Setup
