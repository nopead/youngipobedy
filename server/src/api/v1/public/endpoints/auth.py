from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasicCredentials
from src.services.auth import AuthService
from src.security.security import security
from authx import RequestToken

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(
        credentials: HTTPBasicCredentials,
):
    return await AuthService.validate_login(
        credentials=credentials,
        security=security
    )


@router.get("/validate_access_token")
async def validate_access_token(
    token: RequestToken = Depends(security.get_access_token_from_request),
):
    try:
        return await AuthService.validate_access_token(
            token=token,
            security=security
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid access token: {str(e)}")