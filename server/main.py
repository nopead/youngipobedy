import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.routes import public_router, protected_router

app = FastAPI(
    title="youngipobedy",
    docs_url="/swagger",
    max_upload_size=100 * 1024 * 5
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000", "http://51.250.27.60"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(public_router)
app.include_router(protected_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
