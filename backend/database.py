import os
from motor.motor_asyncio import AsyncIOMotorClient

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ.get('DB_NAME', 'hrdashboard')
        _client = AsyncIOMotorClient(mongo_url)
        _db = _client[db_name]
    return _db

async def close_db():
    global _client
    if _client:
        _client.close()
