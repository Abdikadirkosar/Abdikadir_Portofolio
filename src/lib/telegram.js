/**
 * telegram.js
 * ───────────
 * Sends instant notifications to a Telegram Chat/Group when:
 *  1. A new message / quote request is submitted.
 *  2. A new visitor enters the portfolio site (Live Visitor Alert).
 */

const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const chatId   = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export async function sendTelegramNotification({ name, email, subject, message, page = "Contact Form" }) {
  if (!botToken || !chatId) {
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

export async function sendTelegramCVAlert({ country = "Unknown", device = "Desktop", browser = "Chrome" } = {}) {
  if (!botToken || !chatId) return { success: false };
  const text = `📥 *CV Downloaded!*

🌍 *Country:* ${escapeMarkdown(country)}
💻 *Device:* ${escapeMarkdown(device)}
🌐 *Browser:* ${escapeMarkdown(browser)}
⏰ *Time:* ${new Date().toLocaleString()}`;
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true }),
    });
    const json = await res.json();
    return { success: json.ok };
  } catch { return { success: false }; }
}

export async function sendTelegramVisitorAlert({ country, device, browser, page = "Home", referrer = "Direct" }) {
  if (!botToken || !chatId) {
    return { success: false, reason: "Telegram credentials missing" };
  }

  const deviceIcon = device === "mobile" ? "📱" : device === "tablet" ? "📱" : "💻";
  
  const text = `👁️ *New Portfolio Visitor Alert!*

🌍 *Country:* ${escapeMarkdown(country || "Global")}
${deviceIcon} *Device:* ${escapeMarkdown(device || "desktop")}
🌐 *Browser:* ${escapeMarkdown(browser || "Chrome")}
📄 *Page:* ${escapeMarkdown(page)}
🔗 *Referrer:* ${escapeMarkdown(referrer || "Direct")}

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
    // Silent catch for visitor ping
    return { success: false, error: err };
  }
}

function escapeMarkdown(str = "") {
  return String(str).replace(/[_*`\[\]]/g, "\\$&");
}
