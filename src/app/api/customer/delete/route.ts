import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email || body.contactEmail;
    const customerId = body.id || body.customerId || body.operativeId || 'UNKNOWN_ID';
    const reason = body.reason || 'User initiated dossier purge / GDPR erasure';

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Bad Request: Valid customer email is required for decommissioning protocol.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const alertSubject = `[ ALERT: GDPR DELETION REQUEST - PURGE DOSSIER FOR ${email} ]`;

    // 1. Dispatch high-priority notification to admin via Discord Webhook if configured
    const discordWebhookUrl = process.env.DISCORD_ADMIN_WEBHOOK_URL || process.env.ADMIN_WEBHOOK_URL;

    if (discordWebhookUrl) {
      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Command HQ - GDPR Sentinel',
            avatar_url: 'https://aviationgreeks.com/favicon.ico',
            content: `🚨 **${alertSubject}**`,
            embeds: [
              {
                title: '⚡ DECOMMISSION PROTOCOL INITIATED',
                description: `A permanent data purge request has been logged by the operative terminal. Action required within 24 hours under GDPR / privacy compliance guidelines.`,
                color: 0xef4444, // Bright Red
                fields: [
                  {
                    name: 'Target Email',
                    value: `\`${email}\``,
                    inline: true
                  },
                  {
                    name: 'Shopify Customer ID',
                    value: `\`${customerId}\``,
                    inline: true
                  },
                  {
                    name: 'Timestamp (UTC)',
                    value: `\`${timestamp}\``,
                    inline: false
                  },
                  {
                    name: 'Purge Reason',
                    value: reason,
                    inline: false
                  }
                ],
                footer: {
                  text: 'AviationGreeks Pilot Dossier Security Protocol'
                },
                timestamp: timestamp
              }
            ]
          })
        });
      } catch (webhookError) {
        console.error('[Admin Webhook Notification Error]:', webhookError);
      }
    } else {
      // Log high priority alert to server output for monitoring when webhook is not bound
      console.warn(`\n======================================================\n🚨 ${alertSubject}\nOperative ID: ${customerId}\nTimestamp: ${timestamp}\n======================================================\n`);
    }

    // 2. Return confirmation message to frontend
    return NextResponse.json({
      success: true,
      status: 'PROTOCOL_ACKNOWLEDGED',
      message: '[ DECOMMISSION REQUEST RECEIVED. PROFILE WILL BE PURGED WITHIN 24 HOURS. ]',
      details: {
        target: email,
        receivedAt: timestamp
      }
    });
  } catch (error: any) {
    console.error('[API /api/customer/delete Exception]:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error?.message || 'Failed to process decommission request.'
      },
      { status: 500 }
    );
  }
}
