import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv('DB_HOST_STAGE')
DB_PORT = os.getenv('DB_PORT_STAGE')
DB_USER = os.getenv('DB_USER_STAGE')
DB_PASS = os.getenv('DB_PASS_STAGE')
DB_NAME = os.getenv('DB_NAME_STAGE')

DSN = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

