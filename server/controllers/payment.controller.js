import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

// Coin plans
const PLANS = {
    plan_100: { amount: 100, coins: 300 },
    plan_200: { amount: 200, coins: 700 },
};

// Helper: get a fresh Razorpay instance (reads env at call-time, not module-load-time)
const getRazorpay = () => new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// Create Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = PLANS[planId];

        if (!plan) {
            return res.status(400).json({ message: 'Invalid plan selected' });
        }

        const options = {
            amount: plan.amount * 100, // Razorpay expects paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                planId,
                userId: req.userId,
                coins: plan.coins,
            },
        };

        const order = await getRazorpay().orders.create(options);
        return res.status(200).json({ order, plan });
    } catch (error) {
        console.error('Create Order Error:', error);
        return res.status(500).json({ message: 'Failed to create payment order' });
    }
};

// Verify payment signature and credit coins
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
        }

        const plan = PLANS[planId];
        if (!plan) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        // Credit coins to user
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $inc: { credits: plan.coins } },
            { new: true }
        ).select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: `Payment successful! ${plan.coins} coins added to your account.`,
            user,
        });
    } catch (error) {
        console.error('Verify Payment Error:', error);
        return res.status(500).json({ message: 'Payment verification failed' });
    }
};
