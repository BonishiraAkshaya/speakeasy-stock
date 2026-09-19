from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1)
    unit: str = Field(..., min_length=1)
    current_stock: float = Field(default=0, ge=0)
    minimum_stock: float = Field(default=0, ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    unit: str
    current_stock: float
    minimum_stock: float

    class Config:
        from_attributes = True

class StockMovementCreate(BaseModel):
    quantity: float = Field(gt=0)
    action: str        
