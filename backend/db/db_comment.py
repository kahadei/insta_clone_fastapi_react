from fastapi import HTTPException, status
from datetime import datetime
from routers.schemas import CommentBase
from sqlalchemy.orm.session import Session
from .models import DBComment


def create_comment_db(db:Session, request:CommentBase):
    new_comment = DBComment(
        text=request.text,
        username=request.username,
        post_id = request.post_id,
        timestamp = datetime.now()
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment) 
    return new_comment

def get_comments_db(db:Session, post_id:int):
    return db.query(DBComment).filter(DBComment.post_id==post_id).all()