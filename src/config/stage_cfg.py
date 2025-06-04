import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST_STAGE')
DB_PORT = os.getenv('DB_PORT_STAGE')
DB_USER = os.getenv('DB_USER_STAGE')
DB_PASS = os.getenv('DB_PASS_STAGE')
DB_NAME = os.getenv('DB_NAME_STAGE')
DSN = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


class SMTPConfig:
    SMTP_SERVER_DOMAIN = os.getenv('SMTP_SERVER_DOMAIN')
    SMTP_SERVER_PORT = os.getenv('SMTP_SERVER_PORT')
    SMTP_USERNAME = os.getenv('SMTP_USERNAME')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

