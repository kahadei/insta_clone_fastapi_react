from fastapi import APIRouter, Depends
from sqlalchemy.orm.session import Session
from auth.oauth2 import get_current_user
from .schemas import CommentBase, UserAuth
from db.database import get_db
from db.db_comment import create_comment_db, get_comments_db


router = APIRouter(
    prefix='/comment',
    tags=['comment']
)

@router.post('', response_model=CommentBase)
def create_comment(requset: CommentBase, db: Session = Depends(get_db), current_user:UserAuth = Depends(get_current_user)):
    return create_comment_db(db, requset)


@router.get('/all-comments/{post_id}')
def get_post_comments(post_id:int, db: Session = Depends(get_db)):
    return get_comments_db(db, post_id)
    