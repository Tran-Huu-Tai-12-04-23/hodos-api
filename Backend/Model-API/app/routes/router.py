from app.models.pydantic import ImageClassificationResponse
from app.utility.utility import download_and_process_image
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.helper.helper import location_model,food_model

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    try:
        return templates.TemplateResponse("index.html", {"request": request})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/classifyLocation')
async def classify_location(request: Request):
    try:
        data = await request.json()
        img_array = download_and_process_image(data['image_url'])
        result = location_model.predict(img_array)
        return ImageClassificationResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/classifyFood')
async def classify_location(request: Request):
    try:
        data = await request.json()
        img_array = download_and_process_image(data['image_url'])
        result = food_model.predict(img_array)
        return ImageClassificationResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))