from pydantic import BaseModel


class StateResponse(BaseModel):
    state_id: int
    name: str