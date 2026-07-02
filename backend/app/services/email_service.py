import os
import smtplib

from dotenv import load_dotenv

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


load_dotenv()


EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


# ==========================================
# SEND EMAIL HELPER
# ==========================================

def send_email(message):

    with smtplib.SMTP("smtp.gmail.com", 587) as server:

        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.send_message(message)


# ==========================================
# ADMIN EMAIL
# ==========================================

def send_admin_email(inquiry, products, inquiry_code):

    subject = f"🔔 New Inquiry Received | {inquiry_code}"

    products_html = "".join([
        f"<li>{p['name']} × {p['quantity']}</li>"
        for p in products
    ])

    html_body = f"""
    <html>

    <body style="
        margin:0;
        padding:30px;
        background:#f4f7fc;
        font-family:Arial,sans-serif;
    ">

    <div style="
        max-width:700px;
        margin:auto;
        background:#ffffff;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,.08);
    ">

        <div style="
            background:linear-gradient(135deg,#ff4d5a,#ff6a5c);
            color:white;
            text-align:center;
            padding:30px;
        ">

            <h1 style="margin:0;">
                Accurate Industries
            </h1>

            <p style="margin-top:10px;">
                New Customer Inquiry
            </p>

        </div>


        <div style="padding:40px;">

            <h2>
                🔔 New Inquiry Received
            </h2>

            <p>
                <b>Inquiry ID:</b>
                {inquiry_code}
            </p>

            <hr>

            <p>
                <b>Customer Name:</b>
                {inquiry.name}
            </p>

            <p>
                <b>Email:</b>
                {inquiry.email}
            </p>

            <p>
                <b>Phone:</b>
                {inquiry.phone}
            </p>


            <h3>
                Selected Products
            </h3>

            <ul>
                {products_html}
            </ul>


            <h3>
                Customer Message
            </h3>

            <p>
                {inquiry.message}
            </p>


            <hr>

            <p style="
                color:#666;
                font-size:14px;
            ">

            Replying to this email will automatically send your response to the customer.

            </p>

        </div>

    </div>

    </body>

    </html>
    """

    msg = MIMEMultipart()

    msg["From"] = f"Accurate Industries <{EMAIL_ADDRESS}>"
    msg["To"] = ADMIN_EMAIL
    msg["Subject"] = subject
    msg["Reply-To"] = inquiry.email

    msg.attach(MIMEText(html_body, "html"))

    send_email(msg)


# ==========================================
# CUSTOMER EMAIL
# ==========================================

def send_customer_email(inquiry, products, inquiry_code):

    subject = f"✅ Inquiry Received | {inquiry_code}"

    products_html = "".join([
        f"<li>{p['name']} × {p['quantity']}</li>"
        for p in products
    ])

    html_body = f"""
    <html>

    <body style="
        margin:0;
        padding:30px;
        background:#f4f7fc;
        font-family:Arial,sans-serif;
    ">

    <div style="
        max-width:700px;
        margin:auto;
        background:white;
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,.1);
    ">

        <!-- HEADER -->

        <div style="
            background:linear-gradient(135deg,#ff4d5a,#ff6a5c);
            padding:40px 30px;
            text-align:center;
            color:white;
        ">

            <!-- ADD LOGO HERE LATER -->

            <h1 style="
                margin:0;
                font-size:36px;
            ">
                Accurate Industries
            </h1>

            <p style="
                margin-top:12px;
                font-size:16px;
                opacity:.95;
            ">
                Precision Manufacturing Solutions
            </p>

        </div>


        <!-- CONTENT -->

        <div style="padding:40px;">

            <h2 style="
                color:#222;
            ">
                Thank you, {inquiry.name}! 👋
            </h2>

            <p>
                We have successfully received your inquiry.
            </p>

            <p>
                <b>Inquiry ID:</b>
                {inquiry_code}
            </p>

            <p>
                Expected response time:
                <b>Within 24 hours</b>
            </p>


            <h3>
                Selected Products
            </h3>

            <ul>
                {products_html}
            </ul>


            <h3>
                Your Message
            </h3>

            <p>
                {inquiry.message}
            </p>


            <hr style="
                margin:30px 0;
                border:none;
                border-top:1px solid #ddd;
            ">


            <p style="
                line-height:2;
                color:#444;
            ">

                📍 Ranjangaon MIDC, Pune

                <br>

                📞 +91 9890526297

                <br>

                📧 accurateindustriesltd123@gmail.com

            </p>


            <p style="
                margin-top:30px;
                color:#777;
                font-size:14px;
            ">

                Thank you for choosing Accurate Industries.

            </p>

        </div>

    </div>

    </body>

    </html>
    """

    msg = MIMEMultipart()

    msg["From"] = f"Accurate Industries <{EMAIL_ADDRESS}>"
    msg["To"] = inquiry.email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_body, "html"))

    send_email(msg)