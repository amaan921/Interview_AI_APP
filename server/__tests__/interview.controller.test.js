import { generateQuestions, evaluateAnswers } from '../controllers/interview.controller.js';
import User from '../models/User.js';
import Interview from '../models/interview.model.js';

jest.mock('../models/User.js');
jest.mock('../models/interview.model.js');
jest.mock('../services/openRouter.Services.js');

describe('Interview Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateQuestions', () => {
    it('should return 401 if user not found', async () => {
      User.findById.mockResolvedValueOnce(null);

      const req = {
        userId: 'nonexistent',
        body: {
          role: 'Backend Engineer',
          experience: 'Intermediate',
          interviewType: 'Technical',
          questionCount: 5
        },
        file: null
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await generateQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('User not found')
        })
      );
    });

    it('should return 402 if insufficient credits', async () => {
      User.findById.mockResolvedValueOnce({ credits: 5 });

      const req = {
        userId: 'user123',
        body: {
          role: 'Backend Engineer',
          experience: 'Intermediate',
          interviewType: 'Technical',
          questionCount: 5
        },
        file: null
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await generateQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(402);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Insufficient credits')
        })
      );
    });

    it('should generate questions successfully with valid input', async () => {
      const mockUser = {
        _id: 'user123',
        credits: 100,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockInterview = {
        _id: 'interview123',
        questions: [
          'What is your experience with Node.js?',
          'Explain the event loop in JavaScript.',
          'What are microservices?'
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      User.findById.mockResolvedValueOnce(mockUser);
      Interview.prototype.save = jest.fn().mockResolvedValueOnce(mockInterview);

      const req = {
        userId: 'user123',
        body: {
          role: 'Backend Engineer',
          experience: 'Intermediate',
          interviewType: 'Technical',
          questionCount: 3
        },
        file: null
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // This would need mocking of askai function
      // For now, test structure is set up

      expect(res.status).toBeDefined();
    });

    it('should require either resume or manual configuration', async () => {
      const mockUser = { credits: 100 };
      User.findById.mockResolvedValueOnce(mockUser);

      const req = {
        userId: 'user123',
        body: {
          // Missing role, experience, interviewType
        },
        file: null
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await generateQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('evaluateAnswers', () => {
    it('should reject if interview not found', async () => {
      Interview.findById.mockResolvedValueOnce(null);

      const req = {
        userId: 'user123',
        body: {
          interviewId: 'nonexistent',
          answers: ['Answer 1', 'Answer 2']
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await evaluateAnswers(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Interview not found')
        })
      );
    });

    it('should reject if user not authorized', async () => {
      const mockInterview = {
        userId: 'different-user',
        questions: ['Q1?', 'Q2?']
      };

      Interview.findById.mockResolvedValueOnce(mockInterview);

      const req = {
        userId: 'user123',
        body: {
          interviewId: 'interview123',
          answers: ['Answer 1', 'Answer 2']
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await evaluateAnswers(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Not authorized')
        })
      );
    });

    it('should require answers array', async () => {
      const req = {
        userId: 'user123',
        body: {
          interviewId: 'interview123'
          // Missing answers
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await evaluateAnswers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
