import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion as Motion, AnimatePresence } from 'motion/react'
import { RiRobot2Fill } from 'react-icons/ri'
import { FiClock, FiChevronRight, FiMic, FiMicOff, FiAlertCircle } from 'react-icons/fi'

// Timer hook
function useTimer() {
    const [seconds, setSeconds] = useState(0)
    const intervalRef = useRef(null)

    const start = useCallback(() => {
        if (intervalRef.current) return
        intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    }, [])

    const stop = useCallback(() => {
        clearInterval(intervalRef.current)
        intervalRef.current = null
    }, [])

    const reset = useCallback(() => {
        stop()
        setSeconds(0)
    }, [stop])

    useEffect(() => () => clearInterval(intervalRef.current), [])

    const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

    return { seconds, formatted, start, stop, reset }
}

function Step2Interview({ questions, role, interviewType, onComplete, onEndEarly }) {
    const timer = useTimer()
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState([])
    const [currentAnswer, setCurrentAnswer] = useState('')
    const [showEndConfirm, setShowEndConfirm] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [micSupported] = useState(() =>
        typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    )
    const [micError, setMicError] = useState(null)

    const recognitionRef = useRef(null)
    const finalTranscriptRef = useRef('')
    const shouldRestartRef = useRef(false)

    // Init recognition ONCE — not per question
    useEffect(() => {
        if (!micSupported) return
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SR()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
            let interim = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscriptRef.current += result[0].transcript + ' '
                } else {
                    interim += result[0].transcript
                }
            }
            setCurrentAnswer(finalTranscriptRef.current + interim)
        }

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed') {
                setMicError('Microphone access denied. Check browser permissions.')
            } else if (event.error !== 'aborted') {
                setMicError(`Mic error: ${event.error}`)
            }
            shouldRestartRef.current = false
            setIsListening(false)
        }

        recognition.onend = () => {
            if (shouldRestartRef.current) {
                try { recognition.start() } catch { /* restart failed */ }
            } else {
                setIsListening(false)
            }
        }

        recognitionRef.current = recognition
        return () => { recognition.abort() }
    }, [micSupported])

    // Reset final transcript when question changes
    useEffect(() => {
        finalTranscriptRef.current = ''
    }, [currentQ])

    useEffect(() => {
        timer.start()
        return () => timer.stop()
    }, [timer])

    const stopMic = useCallback(() => {
        if (!recognitionRef.current || !isListening) return
        shouldRestartRef.current = false
        recognitionRef.current.stop()
        setIsListening(false)
    }, [isListening])

    const toggleMic = useCallback(() => {
        if (!recognitionRef.current) return
        setMicError(null)

        if (isListening) {
            stopMic()
        } else {
            finalTranscriptRef.current = currentAnswer.trimEnd()
                ? currentAnswer.trimEnd() + ' '
                : ''
            shouldRestartRef.current = true
            try {
                recognitionRef.current.start()
                setIsListening(true)
            } catch (err) {
                console.warn('Recognition start:', err)
            }
        }
    }, [isListening, currentAnswer, stopMic])

    const handleSubmitAnswer = useCallback(() => {
        stopMic()
        const updatedAnswers = [...answers, currentAnswer]
        setAnswers(updatedAnswers)
        setCurrentAnswer('')
        finalTranscriptRef.current = ''

        if (currentQ + 1 < questions.length) {
            setCurrentQ(q => q + 1)
        } else {
            timer.stop()
            onComplete(updatedAnswers, timer.formatted)
        }
    }, [answers, currentAnswer, currentQ, questions.length, timer, onComplete, stopMic])

    const handleEndClick = useCallback(() => {
        stopMic()
        timer.stop()
        setShowEndConfirm(true)
    }, [timer, stopMic])

    const handleCancelEnd = useCallback(() => {
        setShowEndConfirm(false)
        timer.start()
    }, [timer])

    const handleConfirmEnd = useCallback(() => {
        setShowEndConfirm(false)
        const allAnswers = [...answers]
        if (currentAnswer.trim()) allAnswers.push(currentAnswer.trim())
        while (allAnswers.length < questions.length) allAnswers.push('')
        onEndEarly(allAnswers, timer.formatted)
    }, [answers, currentAnswer, questions.length, timer, onEndEarly])

    const handleTextareaChange = useCallback((e) => {
        const val = e.target.value
        setCurrentAnswer(val)
        finalTranscriptRef.current = val ? val.trimEnd() + ' ' : ''
    }, [])

    const progress = (currentQ / questions.length) * 100

    return (
        <div className='w-full min-h-screen bg-[#f3f3f3]'>
            {/* End Interview Confirmation Modal */}
            <AnimatePresence>
                {showEndConfirm && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
                    >
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25 }}
                            className='bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center'
                        >
                            <div className='w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className='w-7 h-7 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z' />
                                </svg>
                            </div>
                            <h3 className='text-xl font-bold text-gray-900 mb-2'>End Interview?</h3>
                            <p className='text-gray-500 mb-6'>
                                Are you sure you want to end the interview early? Unanswered questions will be submitted as blank.
                            </p>
                            <div className='flex gap-3'>
                                <button
                                    onClick={handleCancelEnd}
                                    className='flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition'
                                >
                                    Continue
                                </button>
                                <button
                                    onClick={handleConfirmEnd}
                                    className='flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition'
                                >
                                    End Now
                                </button>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Top bar */}
            <Motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white shadow-sm border-b border-gray-200'
            >
                <div className='max-w-5xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-black text-white p-2 rounded-lg'>
                            <RiRobot2Fill size={20} />
                        </div>
                        <div>
                            <p className='font-bold text-gray-900'>Question {currentQ + 1} of {questions.length}</p>
                            <p className='text-xs text-gray-500'>{role} • {interviewType}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full'>
                            <FiClock size={16} className='text-green-600' />
                            <span className='font-mono font-semibold text-gray-800'>{timer.formatted}</span>
                        </div>
                        <button
                            onClick={handleEndClick}
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition'
                        >
                            End Interview
                        </button>
                    </div>
                </div>
                {/* Progress bar */}
                <div className='h-1 bg-gray-200'>
                    <Motion.div
                        className='h-full bg-green-500'
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </Motion.div>

            {/* Question & Answer area */}
            <div className='max-w-3xl mx-auto px-6 py-12'>
                <AnimatePresence mode='wait'>
                    <Motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Question Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6'>
                            <div className='flex items-start gap-4'>
                                <div className='bg-green-100 p-3 rounded-full shrink-0'>
                                    <RiRobot2Fill size={24} className='text-green-600' />
                                </div>
                                <div>
                                    <p className='text-sm text-green-600 font-semibold mb-1'>AI Interviewer</p>
                                    <p className='text-lg text-gray-800 leading-relaxed'>{questions[currentQ]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Answer Area */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
                            <label className='block text-sm font-semibold text-gray-700 mb-3'>Your Answer</label>
                            {micError && (
                                <div className='flex items-center gap-1.5 text-sm text-red-500 mb-3'>
                                    <FiAlertCircle size={14} />
                                    {micError}
                                </div>
                            )}
                            <textarea
                                value={currentAnswer}
                                onChange={handleTextareaChange}
                                placeholder='Type or speak your answer here. Be detailed and structured...'
                                rows={8}
                                className={`w-full border rounded-xl px-4 py-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 transition resize-none ${isListening
                                    ? 'border-red-300 focus:ring-red-200 bg-red-50/30'
                                    : 'border-gray-300 focus:ring-green-400'
                                    }`}
                            />
                            <div className='flex items-center justify-between mt-4'>
                                <div className='flex items-center gap-3'>
                                    {micSupported ? (
                                        <Motion.button
                                            type='button'
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={toggleMic}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition ${isListening
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                                }`}
                                            title={isListening ? 'Stop recording' : 'Speak your answer'}
                                        >
                                            {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
                                            {isListening ? 'Stop' : 'Speak'}
                                        </Motion.button>
                                    ) : null}
                                    <p className='text-sm text-gray-400'>
                                        {currentAnswer.length} characters
                                        {isListening && <span className='ml-2 text-red-500 animate-pulse'>● recording</span>}
                                    </p>
                                </div>
                                <Motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSubmitAnswer}
                                    disabled={!currentAnswer.trim()}
                                    className={`px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 ${currentAnswer.trim()
                                        ? 'bg-black text-white hover:bg-gray-800'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {currentQ + 1 < questions.length ? 'Next Question' : 'Finish Interview'}
                                    <FiChevronRight size={18} />
                                </Motion.button>
                            </div>
                        </div>
                    </Motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Step2Interview
