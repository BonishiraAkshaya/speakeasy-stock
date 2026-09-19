from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Product, Transaction
from schemas import ProductCreate, ProductResponse


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = Product(
        name=product.name,
        unit=product.unit,
        current_stock=product.current_stock,
        minimum_stock=product.minimum_stock
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).all()


@router.post("/{product_id}/stock")
def update_stock(
    product_id: int,
    action: str,
    quantity: float,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    action = action.upper()

    if action not in ["IN", "OUT"]:
        raise HTTPException(
            status_code=400,
            detail="Action must be IN or OUT"
        )

    if action == "OUT" and quantity > product.current_stock:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    if action == "IN":
        product.current_stock += quantity
    else:
        product.current_stock -= quantity

    transaction = Transaction(
        product_id=product.id,
        action=action,
        quantity=quantity,
        unit=product.unit
    )

    db.add(transaction)
    db.commit()
    db.refresh(product)

    return {
        "message": f"Stock {action.lower()} successful",
        "product_id": product.id,
        "product_name": product.name,
        "current_stock": product.current_stock,
        "unit": product.unit
    }


@router.get("/transactions/all")
def get_transactions(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).order_by(
        Transaction.created_at.desc()
    ).all()

    return [
        {
            "id": t.id,
            "product_id": t.product_id,
            "action": t.action,
            "quantity": t.quantity,
            "unit": t.unit,
            "created_at": t.created_at
        }
        for t in transactions
    ]
@router.get("/insights/summary")
def get_inventory_summary(
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()

    low_stock = [
        product for product in products
        if product.current_stock <= product.minimum_stock
    ]

    healthy_stock = [
        product for product in products
        if product.current_stock > product.minimum_stock
    ]

    return {
        "total_products": len(products),
        "low_stock": len(low_stock),
        "healthy_stock": len(healthy_stock)
    }