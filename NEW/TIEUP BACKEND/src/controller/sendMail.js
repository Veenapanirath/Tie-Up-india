// controllers/contactController.js
import  { body, validationResult } from 'express-validator'
import {sendContactEmail}  from '../utils/emailService.js'

const sendContactFormEmail = async (req, res) => {
  try {
    // Validate request
    console.log("Request Body:", req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, subject, data } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'contactNumber', 'email', 'purpose', 'city', 'description'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.contactNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Send email
    await sendContactEmail(to, subject, data);

    // Log successful email
    console.log(`Contact email sent successfully to ${to} from ${data.name} (${data.email})`);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: {
        recipient: to,
        sender: data.email,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error sending contact email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Validation middleware
const validateContactForm = [
  body('to').isEmail().withMessage('Valid recipient email is required'),
  body('data.contactNumber').notEmpty().withMessage('Contact number is required'),
  body('data.email').isEmail().withMessage('Valid email is required'),
 
];

export { sendContactFormEmail, validateContactForm };