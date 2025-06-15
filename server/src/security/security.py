from authx import AuthXConfig, AuthX
from src.config.stage_cfg import JWT_SECRET_KEY

from slowapi import Limiter
from slowapi.util import get_remote_address


auth_config = AuthXConfig(
    JWT_SECRET_KEY=JWT_SECRET_KEY,
    JWT_ALGORITHM="HS256",
    JWT_TOKEN_LOCATION=["headers"],
    JWT_HEADER_NAME="Authorization",
    JWT_HEADER_TYPE="Bearer",
    JWT_ACCESS_TOKEN_EXPIRES=60 * 60 * 2,
    JWT_REFRESH_TOKEN_EXPIRES=60 * 60 * 24 * 30,
    JWT_COOKIE_SECURE=False,
    JWT_COOKIE_CSRF_PROTECT=False,
)

security = AuthX(config=auth_config)

limiter = Limiter(key_func=get_remote_address, strategy="fixed-window")


