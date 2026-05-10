'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// The default sender address for Resend onboarding is onboarding@resend.dev
// It can only send to the verified email address.
// Use the verified domain for production
const FROM_EMAIL = 'orders@buddyengineerz.in'

export async function sendOrderConfirmationEmail(orderNumber: string, total: number, customerName: string, customerEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation - Buddy Engineerz (#${orderNumber})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your order, ${customerName}!</h2>
          <p>We've successfully received your order <strong>#${orderNumber}</strong>.</p>
          <p>Total amount: <strong>₹${total}</strong></p>
          <p>We will notify you once your order has shipped.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">
            This is an automated message from Buddy Engineerz Store.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend API Error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email sending exception:', err)
    return { success: false, error: err }
  }
}

export async function sendWelcomeEmail(customerName: string, customerEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Welcome to Buddy Engineerz!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome, ${customerName}!</h2>
          <p>We are thrilled to have you join the Buddy Engineerz community.</p>
          <p>Explore our latest collection of premium fashion for modern engineers.</p>
          <a href="https://buddyengineerz.com/products" style="display: inline-block; padding: 10px 20px; background-color: #7e22ce; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Shop Now</a>
        </div>
      `,
    })

    if (error) {
      console.error('Resend API Error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email sending exception:', err)
    return { success: false, error: err }
  }
}
