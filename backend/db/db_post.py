from fastapi import HTTPException, status
from datetime import datetime
from routers.schemas import PostBase
from sqlalchemy.orm.session import Session
from .models import DBPost
from db.hashing import Hash



def create_post_db(db: Session, request:PostBase):
    new_post = DBPost(
        image_url=request.image_url,
        image_url_type=request.image_url_type,
        caption=request.caption,
        timestamp=datetime.now(),
        user_id=request.creator_id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

def get_all_posts_db(db:Session):
    return db.query(DBPost).all()

def delete_post_db(db:Session, id:int, user_id:int):
    post = db.query(DBPost).filter(DBPost.id==id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail=f'{id} post not found')
        
    if post.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, 
                            detail='Forbidden!')
    db.delete(post)
    db.commit()
    return True