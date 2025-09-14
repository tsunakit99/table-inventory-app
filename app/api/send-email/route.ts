import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html } = await request.json()

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, and text/html' },
        { status: 400 }
      )
    }

    // Gmail SMTP設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER, // tableinventoryapp@gmail.com
        pass: process.env.SMTP_PASS, // アプリパスワード
      },
    })

    // メール送信
    await transporter.sendMail({
      from: `たーぷる在庫管理 <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })

    console.log(`Email sent successfully to: ${to}`)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}