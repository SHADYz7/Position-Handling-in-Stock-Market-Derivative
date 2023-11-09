from SmartApi.smartWebSocketV2 import SmartWebSocketV2
from logzero import logger
from Config import *
from SmartApi import SmartConnect


smartApi = SmartConnect(api_key)
Session_Obj = smartApi.generateSession(clientId, pwd, totp)

AUTH_TOKEN = Session_Obj['data']['jwtToken']

API_KEY = api_key
CLIENT_CODE = clientId
FEED_TOKEN = smartApi.getfeedToken()

correlation_id = "abc123"
action = 1
mode = 1
token_list = [
    {
        "exchangeType": 2,
        "tokens": ["56148","56149","56132","56133"]
    }
]
sws = SmartWebSocketV2(AUTH_TOKEN, API_KEY, CLIENT_CODE, FEED_TOKEN)

def on_data(wsapp, message):
    logger.info("Token: {} Price :{}".format(message['token'],message['last_traded_price']))

def on_open(wsapp):
    logger.info("on open")
    sws.subscribe(correlation_id, mode, token_list)

def on_error(wsapp, error):
    logger.error(error)

def on_close(wsapp):
    logger.info("Close")

def close_connection():
    sws.close_connection()


# Assign the callbacks.
sws.on_open = on_open
sws.on_data = on_data
sws.on_error = on_error
sws.on_close = on_close

sws.connect()