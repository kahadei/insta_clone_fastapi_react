import random
import shutil
import string
from fastapi import APIRouter, Depends, HTTPException, UploadFile, status, File
from sqlalchemy.orm.session import Session
from auth.oauth2 import get_current_user
from db.db_post import create_post_db, get_all_posts_db, delete_post_db
from .schemas import PostBase, PostDisplay
from db.database import get_db
from typing import List
from routers.schemas import UserAuth

router = APIRouter(
    prefix='/post',
    tags=['post']
)

image_urls_types = ['absolute', 'relative']

@router.post('', response_model=PostDisplay)
def create_post(requset: PostBase, db: Session = Depends(get_db), current_user:UserAuth = Depends(get_current_user)):
    if not requset.image_url_type in image_urls_types:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail='absolute or relative only')
    return create_post_db(db, requset)


@router.get('/posts', response_model=List[PostDisplay])
def get_all_posts(db: Session = Depends(get_db)):
    return get_all_posts_db(db)


@router.post('/image')
def upload_image(image:UploadFile = File(...), current_user:UserAuth = Depends(get_current_user)):
    letters = string.ascii_letters
    rand_str = ''.join(random.sample(letters, k=5))
    new = f'_{rand_str}.'
    filename = new.join(image.filename.rsplit('.', 1))
    path = f'images/{filename}'
    with open(path, 'wb+') as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    return {'filename': path}


@router.get('/delete/{id}')
def delete_post(id:int, db:Session = Depends(get_db), current_user:UserAuth = Depends(get_current_user)):
    return delete_post_db(db, id, current_user.id)