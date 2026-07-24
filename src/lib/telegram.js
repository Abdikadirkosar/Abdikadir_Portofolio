/**
 * telegram.js
 * ───────────
 * Sends instant notifications to a Telegram Chat/Group when a new message
 * or quote request is submitted on the portfolio.
 */

const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const chatId   = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export async function sendTelegramNotification({ name, email, subject, message, page = "Contact Form" }) {
  if (!botToken || !chatId) {
    // If not configured in env, log silently and skip
    return { success: false, reason: "Telegram credentials missing" };
  }

  const text = `📬 *New Portfolio Message!*

👤 *Name:* ${escapeMarkdown(name)}
✉️ *Email:* ${escapeMarkdown(email)}
📌 *Subject:* ${escapeMarkdown(subject || "No Subject")}
📍 *Source:* ${escapeMarkdown(page)}

💬 *Message:*
${escapeMarkdown(message)}

⏰ *Time:* ${new Date().toLocaleString()}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
    const json = await res.json();
    return { success: json.ok, data: json };
  } catch (err) {
    console.error("Telegram bot error:", err);
    return { success: false, error: err };
  }
}

function escapeMarkdown(str = "") {
  return String(str).replace(/[_*`\[\]]/g, "\\$&");
}
