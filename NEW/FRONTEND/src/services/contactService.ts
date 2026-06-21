import { api } from '@/lib/api';

export interface ContactFormData {
  name: string;
  contactNumber: string;
  email: string;
  purpose: string;
  city: string;
  description: string;
}

export const contactService = {
  async sendContactEmail(data: ContactFormData) {
    try {
      const response = await api.post('/contact/send-email', {
        to: 'tieupindia.payments@gmail.com',
        subject: `Contact Form Submission from ${data.name}`,
        data: {
          name: data.name,
          contactNumber: data.contactNumber,
          email: data.email,
          purpose: data.purpose,
          city: data.city,
          description: data.description
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send contact email');
    }
  }
};



