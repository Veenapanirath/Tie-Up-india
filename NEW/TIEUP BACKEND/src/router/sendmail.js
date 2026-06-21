import express from 'express';
import {sendContactFormEmail ,validateContactForm} from '../controller/sendMail.js'

const router = express.Router();

router.post('/send-email', validateContactForm, sendContactFormEmail);

export default router;