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

    // 環境変数の検証
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpUser || !smtpPass) {
      console.error('SMTP credentials not configured')
      return NextResponse.json(
        { error: 'Email service not configured properly' },
        { status: 500 }
      )
    }

    // Gmail SMTP設定
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // メール送信
    await transporter.sendMail({
      from: `たーぷる在庫管理 <${smtpUser}>`,
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