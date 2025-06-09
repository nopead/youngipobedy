import os
from fastapi import HTTPException
from fastapi.security import HTTPBasicCredentials
from fastapi.responses import JSONResponse
from authx import AuthX, RequestToken
from src.config import stage_cfg


class AuthService:
    @staticmethod
    async def validate_login(
            credentials: HTTPBasicCredentials,
            security: AuthX
    ):
        try:
            admin_username = stage_cfg.ADMIN_USERNAME
            admin_password = stage_cfg.ADMIN_PASSWORD
            if credentials.username == admin_username or credentials.password == admin_password:
                access_token = security.create_access_token(uid=credentials.username)
                return JSONResponse(status_code=200,
                    content={
                        "access_token": access_token,
                        "message": "login successful",
                        "username": credentials.username
                    }
                )

            else:
                return JSONResponse(status_code=401,
                    content={
                        "message": "invalid login or password"
                    }
                )

        except Exception as e:
            raise HTTPException(status_code=409,
                detail=str(e)
            ) from e

    @staticmethod
    async def validate_access_token(
            token: RequestToken,
            security: AuthX
    ):
        try:
            payload = security.verify_token(token)
            if not payload:
                return JSONResponse(status_code=401, content={"message": "Invalid or expired access token"})

            return JSONResponse(status_code=200,
                content={
                    "message": "Access token is valid",
                    "user_id": payload.sub
                }
            )

        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Access token validation failed: {str(e)}") from e
