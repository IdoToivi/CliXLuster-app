from pydantic import BaseModel, Field
from typing import List

class ClusterDeployRequest(BaseModel):
    cluster_name: str = Field(..., min_length=3)
    node_count: int = Field(default=3)

class ClusterDeployResponse(BaseModel):
    job_id: str
    status: str
    message: str

class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    logs: List[str]