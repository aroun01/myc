from uuid import UUID, uuid1
import uvicorn
import os

from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


class Task(BaseModel):
    userId: int
    url: str
    method: str
    id: Optional[UUID] = None
    status: str = "CREATED"


class RmTaskRequest(BaseModel):
    id: UUID


app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None)
tasks: Dict[UUID, Task] = {}


@app.post("/api/download")
@app.post("/api/tasks/set_task")
async def download(task: Task):
    if task.id is None:
        task.id = uuid1()
    is_exist = task.id in tasks
    tasks[task.id] = task
    return {
        "message": (
            "Download task updated"
            if is_exist else
            "Download task created"
        ),
        "task": task
    }


@app.get("/api/tasks/get_list")
async def get_list():
    return list(sorted(
        tasks.values(),
        key=lambda x: str(x.id)
    ))


@app.post("/api/tasks/rm_task")
async def rm_task(req: RmTaskRequest):
    if req.id in tasks:
        del tasks[req.id]
        return {"message": "Task deleted"}
    raise HTTPException(
        status_code=404,
        detail=f'Task "{req.id}" not found'
    )


if __name__ == "__main__":
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 4001))
    uvicorn.run(app, host=HOST, port=PORT)
