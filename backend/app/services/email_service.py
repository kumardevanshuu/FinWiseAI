# app/services/email_service.py
import smtplib
from email.mime.text import MIMEText
from typing import Optional
import os

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT") or 587)
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

def send_email(to: str, subject: str, body: str, html: bool = False) -> bool:
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        # SMTP not configured
        return False
    msg = MIMEText(body, "html" if html else "plain")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
    return True
