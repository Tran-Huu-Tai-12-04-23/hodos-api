from pydantic import BaseModel, HttpUrl

class ImageClassificationRequest(BaseModel):
    image_url: HttpUrl

class TranslationRequest(BaseModel):
    text: str
    option: str

class ImageClassificationResponse(BaseModel):
    result: list[str]

class TranslationResponse(BaseModel):
    result: str