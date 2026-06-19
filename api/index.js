const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Paystack Secret Key
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_live_8c4dc29601e600f6ce410f2a2495bc3ba6c0f9c0';

// In-memory storage (replace with database for production)
const verifiedTransactions = new Map();
const userUnlocks = new Map();

/**
 * Verify Paystack payment
 * POST /api/verify-payment
 * Body: { reference: string, phone: string }
 */
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { reference, phone } = req.body;

        if (!reference || !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing reference or phone number' 
            });
        }

        // Verify with Paystack using secret key
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.status) {
            return res.status(400).json({ 
                success: false, 
                message: 'Failed to verify payment with Paystack' 
            });
        }

        const transaction = data.data;

        // Check if payment was successful
        if (transaction.status !== 'success') {
            return res.status(400).json({ 
                success: false, 
                message: 'Payment was not successful',
                status: transaction.status
            });
        }

        // Verify amount (KSh 300 = 30000 kobo)
        if (transaction.amount !== 30000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Payment amount mismatch',
                expected: 30000,
                received: transaction.amount
            });
        }

        // Verify currency
        if (transaction.currency !== 'KES') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid currency',
                expected: 'KES',
                received: transaction.currency
            });
        }

        // Store verified transaction
        const unlockData = {
            phone,
            reference,
            amount: transaction.amount,
            currency: transaction.currency,
            startTime: Date.now(),
            endTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
            verifiedAt: new Date().toISOString(),
            transactionId: transaction.id,
            customerEmail: transaction.customer?.email
        };

        verifiedTransactions.set(reference, unlockData);
        userUnlocks.set(phone, unlockData);

        console.log(`✅ Payment verified for ${phone} - Reference: ${reference}`);

        return res.status(200).json({ 
            success: true, 
            message: 'Payment verified successfully',
            unlock: {
                phone,
                startTime: unlockData.startTime,
                endTime: unlockData.endTime,
                validFor: '24 hours'
            }
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during payment verification',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * Check if user has active unlock
 * GET /api/check-unlock?phone=254712345678
 */
app.get('/api/check-unlock', (req, res) => {
    try {
        const { phone } = req.query;

        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number required' 
            });
        }

        const unlock = userUnlocks.get(phone);

        if (!unlock) {
            return res.status(200).json({ 
                success: true, 
                hasUnlock: false,
                message: 'No active unlock found'
            });
        }

        // Check if unlock has expired
        if (unlock.endTime <= Date.now()) {
            userUnlocks.delete(phone);
            return res.status(200).json({ 
                success: true, 
                hasUnlock: false,
                message: 'Unlock has expired'
            });
        }

        return res.status(200).json({ 
            success: true, 
            hasUnlock: true,
            unlock: {
                startTime: unlock.startTime,
                endTime: unlock.endTime,
                remainingTime: unlock.endTime - Date.now(),
                verifiedAt: unlock.verifiedAt
            }
        });

    } catch (error) {
        console.error('Check unlock error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error checking unlock status'
        });
    }
});

/**
 * Paystack Webhook for payment confirmation
 * POST /api/webhook/paystack
 */
app.post('/api/webhook/paystack', (req, res) => {
    try {
        const hash = req.headers['x-paystack-signature'];
        const body = req.rawBody || JSON.stringify(req.body);

        // Verify webhook signature
        const crypto = require('crypto');
        const computedHash = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(body)
            .digest('hex');

        if (hash !== computedHash) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid webhook signature' 
            });
        }

        const event = req.body;

        if (event.event === 'charge.success') {
            const transaction = event.data;
            console.log(`✅ Webhook: Payment confirmed - Ref: ${transaction.reference}`);

            // You can add additional processing here
            // e.g., send email confirmation, update database, etc.
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Webhook processed'
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Webhook processing error'
        });
    }
});

/**
 * Health check
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
