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
                <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                    Configure Your <span className='text-cyan-400'>Interview</span>
                </h2>
                <p className='text-gray-400 text-lg max-w-xl mx-auto'>
                    Upload your resume for AI-tailored questions, or fill in details manually.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className='rounded-2xl p-8 border border-gray-700'
                style={{
                    background: 'rgba(15, 15, 15, 0.7)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                {/* Resume Upload — always shown at top */}
                <div className='mb-6'>
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                        <FiUpload className='inline mr-2' />
                        Upload Resume <span className='text-gray-500 font-normal'>(PDF only)</span>
                    </label>

                    {!resumeFile ? (
                        <label className='flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-600 rounded-xl px-4 py-8 text-gray-400 bg-gray-900/40 hover:bg-gray-800/60 hover:border-cyan-500/50 cursor-pointer transition'>
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
                        <div className='flex items-center justify-between bg-cyan-900/30 border border-cyan-500/30 rounded-xl px-4 py-4'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-cyan-500/20 p-2 rounded-lg'>
                                    <FiUpload size={18} className='text-cyan-400' />
                                </div>
                                <div>
                                    <p className='text-sm font-semibold text-white'>{resumeFile.name}</p>
                                    <p className='text-xs text-gray-400'>{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setResumeFile(null)}
                                className='text-red-400 hover:bg-red-900/30 p-2 rounded-lg transition'
                            >
                                <FiX size={18} />
                            </button>
                        </div>
                    )}

                    {resumeFile && (
                        <p className='text-sm text-cyan-400 mt-2 font-medium'>
                            ✓ AI will extract your skills, experience, and projects to generate tailored interview questions.
                        </p>
                    )}
                </div>

                {/* Divider with OR */}
                {!resumeFile && (
                    <div className='flex items-center gap-4 mb-6'>
                        <div className='flex-1 h-px bg-gray-700'></div>
                        <span className='text-sm text-gray-500 font-medium'>OR FILL MANUALLY</span>
                        <div className='flex-1 h-px bg-gray-700'></div>
                    </div>
                )}

                {/* Manual form fields — only show when NO resume is uploaded */}
                {!resumeFile && (
                    <>
                        {/* Role */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-300 mb-2'>
                                <HiOutlineBriefcase className='inline mr-2' />
                                Job Role
                            </label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className='w-full border border-gray-600 rounded-xl px-4 py-3 text-white bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition'
                            >
                                {roles.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Experience */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-300 mb-2'>
                                <BsLightningCharge className='inline mr-2' />
                                Experience Level
                            </label>
                            <div className='flex gap-3'>
                                {experiences.map(exp => (
                                    <button
                                        key={exp}
                                        onClick={() => setExperience(exp)}
                                        className={`flex-1 py-3 rounded-xl font-medium text-sm transition border ${experience === exp
                                                ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                                                : 'bg-gray-900/40 text-gray-300 border-gray-600 hover:bg-gray-800/60 hover:border-gray-500'
                                            }`}
                                    >
                                        {exp}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interview Type */}
                        <div className='mb-6'>
                            <label className='block text-sm font-semibold text-gray-300 mb-2'>
                                <IoSparkles className='inline mr-2' />
                                Interview Type
                            </label>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                {types.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setInterviewType(t)}
                                        className={`py-3 rounded-xl font-medium text-sm transition border ${interviewType === t
                                                ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                                                : 'bg-gray-900/40 text-gray-300 border-gray-600 hover:bg-gray-800/60 hover:border-gray-500'
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
                    <label className='block text-sm font-semibold text-gray-300 mb-2'>
                        Number of Questions
                    </label>
                    <div className='flex gap-3'>
                        {counts.map(c => (
                            <button
                                key={c}
                                onClick={() => setQuestionCount(c)}
                                className={`flex-1 py-3 rounded-xl font-medium text-sm transition border ${questionCount === c
                                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                                        : 'bg-gray-900/40 text-gray-300 border-gray-600 hover:bg-gray-800/60 hover:border-gray-500'
                                    }`}
                            >
                                {c} Questions
                            </button>
                        ))}
                    </div>
                </div>

                {insufficientCredits && (
                    <div className='mb-6 bg-amber-900/30 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl text-sm'>
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
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10'
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
                    <span className='bg-cyan-500/15 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium border border-cyan-500/20'>
                        📄 Resume: {resumeFile.name}
                    </span>
                ) : (
                    <>
                        <span className='bg-cyan-500/15 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium border border-cyan-500/20'>{role}</span>
                        <span className='bg-violet-500/15 text-violet-400 px-4 py-1.5 rounded-full text-sm font-medium border border-violet-500/20'>{experience}</span>
                        <span className='bg-purple-500/15 text-purple-400 px-4 py-1.5 rounded-full text-sm font-medium border border-purple-500/20'>{interviewType}</span>
                    </>
                )}
                <span className='bg-amber-500/15 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium border border-amber-500/20'>{questionCount} Qs</span>
            </motion.div>
        </div>
    )
}

export default Step1Setup
