const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

exports.handler = async (event) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = event.headers['stripe-signature']

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return { statusCode: 400, body: `Webhook Error: ${err.message}` }
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) }
  }

  const session = stripeEvent.data.object
  const eventId = session.metadata?.event_id
  const quantity = parseInt(session.metadata?.quantity || '1')
  const customerEmail = session.customer_details?.email
  const customerName = session.customer_details?.name

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  // Load event details
  const { data: ev } = await supabase.from('events').select('*').eq('id', eventId).single()

  // Record ticket
  const totalAmount = (session.amount_total / 100).toFixed(2)
  await supabase.from('tickets').upsert({
    event_id: eventId,
    customer_name: customerName,
    customer_email: customerEmail,
    quantity,
    total_amount: totalAmount,
    stripe_session_id: session.id,
    status: 'confirmed'
  }, { onConflict: 'stripe_session_id' })

  // Update tickets_sold count
  if (ev) {
    await supabase
      .from('events')
      .update({ tickets_sold: (ev.tickets_sold || 0) + quantity })
      .eq('id', eventId)
  }

  // Send emails via Resend
  if (customerEmail && ev) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'tickets@kovaevents.co'
    const adminEmail = process.env.ADMIN_EMAIL

    const eventDate = new Date(ev.date).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    const eventTime = new Date(ev.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    // Customer confirmation
    await resend.emails.send({
      from: `KOVA Events <${fromEmail}>`,
      to: [customerEmail],
      subject: `Your tickets for KOVA: ${ev.title} — Booking Confirmed`,
      html: customerEmailTemplate({
        customerName: customerName || 'Guest',
        eventTitle: ev.title,
        eventDate,
        eventTime,
        venue: ev.venue,
        quantity,
        totalAmount,
        sessionId: session.id
      })
    })

    // Admin notification
    if (adminEmail) {
      await resend.emails.send({
        from: `KOVA Notifications <${fromEmail}>`,
        to: [adminEmail],
        subject: `🎟️ New booking — KOVA: ${ev.title} (${quantity} ticket${quantity > 1 ? 's' : ''})`,
        html: adminEmailTemplate({
          customerName: customerName || 'Unknown',
          customerEmail,
          eventTitle: ev.title,
          eventDate,
          quantity,
          totalAmount,
          ticketsSold: (ev.tickets_sold || 0) + quantity,
          capacity: ev.tickets_available
        })
      })
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}

function customerEmailTemplate({ customerName, eventTitle, eventDate, eventTime, venue, quantity, totalAmount, sessionId }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#070707;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070707;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:28px;letter-spacing:0.3em;color:#C8A96E;font-weight:300;">KOVA</span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#0F0F0F;border:1px solid #1E1E1E;border-radius:8px;overflow:hidden;">

          <!-- Top bar -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0D0D1E,#150E2E);">
            <tr><td style="padding:32px 32px 28px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(200,169,110,0.8);">Booking Confirmed</p>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:36px;font-weight:300;color:#EFEFEF;letter-spacing:0.05em;">KOVA: ${eventTitle}</h1>
            </td></tr>
          </table>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 32px;">
            <tr><td>
              <p style="margin:0 0 24px;font-size:14px;color:#888;font-weight:300;line-height:1.6;">
                Hi ${customerName}, your tickets are confirmed. See you there.
              </p>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #1A1A1A;border-radius:6px;margin-bottom:24px;">
                <tr><td style="padding:16px 20px;border-bottom:1px solid #1A1A1A;">
                  <table width="100%"><tr>
                    <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Date</td>
                    <td align="right" style="font-size:13px;color:#EFEFEF;font-weight:300;">${eventDate}</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:16px 20px;border-bottom:1px solid #1A1A1A;">
                  <table width="100%"><tr>
                    <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Doors</td>
                    <td align="right" style="font-size:13px;color:#EFEFEF;font-weight:300;">${eventTime}</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:16px 20px;border-bottom:1px solid #1A1A1A;">
                  <table width="100%"><tr>
                    <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Venue</td>
                    <td align="right" style="font-size:13px;color:#EFEFEF;font-weight:300;">${venue}</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:16px 20px;border-bottom:1px solid #1A1A1A;">
                  <table width="100%"><tr>
                    <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Tickets</td>
                    <td align="right" style="font-size:13px;color:#EFEFEF;font-weight:300;">${quantity} × General Admission</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:16px 20px;">
                  <table width="100%"><tr>
                    <td style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#555;">Total Paid</td>
                    <td align="right" style="font-family:Georgia,serif;font-size:22px;color:#C8A96E;font-weight:300;">£${totalAmount}</td>
                  </tr></table>
                </td></tr>
              </table>

              <p style="margin:0 0 8px;font-size:12px;color:#444;line-height:1.6;">
                Reference: <span style="font-family:monospace;color:#666;">${sessionId.slice(0,20).toUpperCase()}</span>
              </p>
              <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">
                Please bring a valid photo ID. Tickets are non-refundable but transferable up to 48 hours before the event.
              </p>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#333;letter-spacing:0.05em;">KOVA Events Ltd · London · kovaevents.co</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function adminEmailTemplate({ customerName, customerEmail, eventTitle, eventDate, quantity, totalAmount, ticketsSold, capacity }) {
  const pct = Math.round((ticketsSold / capacity) * 100)
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px 20px;background:#070707;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;">
    <tr><td style="text-align:center;padding-bottom:24px;">
      <span style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.3em;color:#C8A96E;">KOVA</span><br>
      <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#333;">Admin Notification</span>
    </td></tr>
    <tr><td style="background:#0F0F0F;border:1px solid #1E1E1E;border-radius:8px;padding:28px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8A96E;">New Booking</p>
      <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:300;color:#EFEFEF;">KOVA: ${eventTitle}</h2>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:12px;color:#555;">Customer</td><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:13px;color:#EFEFEF;text-align:right;">${customerName}<br><span style="font-size:11px;color:#555;">${customerEmail}</span></td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:12px;color:#555;">Date</td><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:12px;color:#EFEFEF;text-align:right;">${eventDate}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:12px;color:#555;">Tickets</td><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:12px;color:#EFEFEF;text-align:right;">${quantity}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #161616;font-size:12px;color:#555;">Revenue</td><td style="padding:8px 0;border-bottom:1px solid #161616;font-family:Georgia,serif;font-size:20px;color:#4ADE80;text-align:right;">£${totalAmount}</td></tr>
        <tr><td style="padding:8px 0;font-size:12px;color:#555;">Capacity</td><td style="padding:8px 0;font-size:12px;color:#EFEFEF;text-align:right;">${ticketsSold} / ${capacity} sold (${pct}%)</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
