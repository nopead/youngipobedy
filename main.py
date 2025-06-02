import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from src.api.v1.routes import public_router, protected_router

app = FastAPI(
    title="youngipobedy",
    servers=[
        {"url": "http://127.0.0.1:1111", "description": "Staging environment"},
        {"url": "https://youngi.pobedy.com", "description": "Production environment"},
    ],
    docs_url="/swagger"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(public_router)
app.include_router(protected_router)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=1111
    )
