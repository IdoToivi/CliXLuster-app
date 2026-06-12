from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import cluster

app = FastAPI(title="CliXLuster API")

# מאפשר ל-React (שעובד על פורט אחר) לפנות אלינו
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# מוסיף את הראוטר שיצרנו
app.include_router(cluster.router, prefix="/api/v1/cluster")

@app.get("/")
async def root():
    return {"message": "CliXLuster Engine is up and running!"}