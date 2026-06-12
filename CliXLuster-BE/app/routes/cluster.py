from fastapi import APIRouter
from app.models.schemas import ClusterDeployRequest, ClusterDeployResponse, JobStatusResponse
from app.workers.tasks import provision_cluster_task
from app.core.celery_app import celery_app
from celery.result import AsyncResult

router = APIRouter()

@router.post("/deploy", response_model=ClusterDeployResponse)
async def deploy_cluster(request: ClusterDeployRequest):
    # כאן הקסם קורה: אנחנו דוחפים את המשימה ל-Celery
    task = provision_cluster_task.delay(request.cluster_name, request.node_count)
    
    return ClusterDeployResponse(
        job_id=task.id,
        status="STARTING",
        message=f"Deployment job queued for '{request.cluster_name}'"
    )

@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    # שולפים את המצב הנוכחי של המשימה מ-Redis
    task_result = AsyncResult(job_id, app=celery_app)
    
    logs = []
    status = task_result.status
    
    # אם ה-Worker עדכן סטטוס ולוגים
    if task_result.info and isinstance(task_result.info, dict):
        logs = task_result.info.get("logs", [])
        status = task_result.info.get("status", status)
        
    return JobStatusResponse(
        job_id=job_id,
        status=status,
        logs=logs
    )