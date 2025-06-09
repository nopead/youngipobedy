import os
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

load_dotenv()

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

DB_HOST = os.getenv('DB_HOST_STAGE')
DB_PORT = os.getenv('DB_PORT_STAGE')
DB_USER = os.getenv('DB_USER_STAGE')
DB_PASS = os.getenv('DB_PASS_STAGE')
DB_NAME = os.getenv('DB_NAME_STAGE')
DSN = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')


class SMTPConfig:
    SMTP_SERVER_DOMAIN = os.getenv('SMTP_SERVER_DOMAIN')
    SMTP_SERVER_PORT = os.getenv('SMTP_SERVER_PORT')
    SMTP_USERNAME = os.getenv('SMTP_USERNAME')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

