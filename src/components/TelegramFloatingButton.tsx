"use client";

import React from "react";

export default function TelegramFloatingButton() {
  return (
    <a
      href="https://t.me/viewverseofficial"
      target="_blank"
      rel="noopener noreferrer"
      className="telegram-floating-btn"
      aria-label="Join our Telegram group"
    >
      <div className="telegram-icon-wrapper">
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
          className="telegram-svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.96 1.25-5.54 3.67-.52.36-.99.53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.89 8.01-3.46 3.81-1.6 4.6-1.88 5.12-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.16-.04.26z" />
        </svg>
      </div>
      <span className="telegram-btn-text">Join</span>
      <span className="telegram-btn-subtext">Telegram</span>
    </a>
  );
}
