from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import Config
from SmartApi import SmartConnect
from SmartApi.smartWebSocketV2 import SmartWebSocketV2
import threading
import datetime as datetime
import time
import pandas as pd


app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

Thread_ID = 0

dict = {}
global tokens
tokens = ["59288"]
def login():
    
    api_key = Config.api_key
    clientId = Config.clientId
    pwd = Config.pwd
    totp = Config.totp

    global smartApi
    global Session_Obj
    
    smartApi = SmartConnect(api_key)
    Session_Obj = smartApi.generateSession(clientId, pwd, totp)
    # print(api_key," ",clientId," ",pwd," ",totp," ",smartApi.getProfile(Session_Obj['data']['refreshToken']))
    
def WEBSOCKET():

    global correlation_id
    global mode
    correlation_id = "abc123"
    action = 1
    
    mode = 1
    global token_list
    token_list = [
        {
            "exchangeType": 2,
            "tokens": tokens
        }
    ]
    
    AUTH_TOKEN = Session_Obj['data']['jwtToken']
    FEED_TOKEN = smartApi.getfeedToken()

    global sws
    sws = SmartWebSocketV2(AUTH_TOKEN, Config.api_key, Config.clientId, FEED_TOKEN)

    def on_data(wsapp, message):
        print("Ticks: {}:{}".format(message['token'],message['last_traded_price']))
        dict[message['token']] = message['last_traded_price']
        print(dict)
        # close_connection()

    def on_open(wsapp):
        print("on open")
        sws.subscribe(correlation_id, mode, token_list)
        # sws.unsubscribe(correlation_id, mode, token_list1)


    def on_error(wsapp, error):
        print(error)


    def on_close(wsapp):
        print("Close")



    def close_connection():
        sws.close_connection()


    # Assign the callbacks.
    sws.on_open = on_open
    sws.on_data = on_data
    sws.on_error = on_error
    sws.on_close = on_close

    sws.connect()


    

def GetToken(tradingSymbol):
    try:
        df = pd.read_excel("Book2.xlsx",sheet_name=0)
        df = df[(df['symbol'] == tradingSymbol)]
        # print(df)

        if not df.empty:
            token = df.iloc[0]['token']
            return int(token)
        else:
            print(f"Symbol '{tradingSymbol}' not found in the Excel file.")
            return None

    except FileNotFoundError:
        print(f"File  not found.")
        return None

    except Exception as e:
        print(f"Error occurred: {e}")
        return None



def getCurrentPrice(TradingSymbol,SymbolToken):
    return smartApi.ltpData("NFO" ,TradingSymbol,SymbolToken)['data']['ltp']


def Process_Order(data,):
    
    print(data)
    Expiry = data['expiry'][0:5] + data['expiry'][-2:]
    Index = data['index']
    Strike = data['strikePrice']
    MaxReEntry = data['reEntry']
    OrderTime = data['orderTime']

    TradingSymbol = Index + Expiry + Strike + data['optionType']
    SymbolToken = GetToken(TradingSymbol)

    print(TradingSymbol," ",SymbolToken)
    
    
    hour = OrderTime[:2]
    minute = OrderTime[-2:]

    OrderTimeinMinutes = int(hour) * 60 + int(minute)
    CurrentTime = datetime.datetime.now().hour * 60 + datetime.datetime.now().minute
    

    if OrderTimeinMinutes > CurrentTime:
        seconds = (OrderTimeinMinutes - CurrentTime ) * 60
        print(" Sleeping For ",seconds)
        time.sleep(seconds)
    
    
    
# {'index': 'BANKNIFTY', 'expiry': '13SEP2023', 'transactionType': '', 'optionType': '', 'strikePrice': '', 'orderTime': '21:27', 'stopLoss': '', 'reEntry': '', 'priceType': 'MARKET', 'limitPrice': '', 'lotSize': 1}
    SellPrice = 0
    CurrentReEntry = 0
    Exit = False
    Realized_Gain = 0
    UnRealized_Gain = 0
    Total_Gain = 0

    # print(smartApi.getProfile(Session_Obj['data']['refreshToken']))

    # print("Price inside Thread: ",smartApi.ltpD/ata(Index ,TradingSymbol,SymbolToken)['data']['ltp'])
    if data['transactionType'] == "SELL":
        
        if data['priceType'] == 'MARKET':
            SellPrice = getCurrentPrice(TradingSymbol,SymbolToken) # Get Price From Live Market
        
        elif data['priceType'] == 'LIMIT':
            SellPrice = int(data['limitPrice'])

            
        StopLossPrice = SellPrice * (int(data['stopLoss']) + 100)/100
        print(SellPrice," ",StopLossPrice)

        while 1:

            CurrentPrice = getCurrentPrice(TradingSymbol,SymbolToken) # Get Price From Live Market

            if( (CurrentPrice >= StopLossPrice) & (not Exit) ):
                Exit = True
                Realized_Gain = Realized_Gain + ( SellPrice - StopLossPrice ) * 25
                
            elif ((CurrentPrice <= SellPrice) & (Exit)):
                Exit = False
                CurrentReEntry+=1

            if (not Exit):
                UnRealized_Gain = (SellPrice - CurrentPrice) * 25
                Total_Gain = Realized_Gain + UnRealized_Gain

            # print("Current Price: ",CurrentPrice, " StopLoss Price: ",StopLossPrice," Realized Gain: ",Realized_Gain, " Total Gain: ", Total_Gain)


            if( (CurrentReEntry == MaxReEntry) & (Exit)):
                break
    
            Current_Time = datetime.datetime.now().hour * 60 + datetime.datetime.now().minute
            if Current_Time >= 960: # Stop execution after 3:30 PM
                break



    elif data['transactionType'] == "BUY":


        if data['priceType'] == 'MARKET':
            BuyPrice = getCurrentPrice(TradingSymbol,SymbolToken) # Get Price From Live Market
        
        elif data['priceType'] == 'LIMIT':
            BuyPrice = int(data['limitPrice'])

            
        StopLossPrice = BuyPrice * ( 100 - int(data['stopLoss']) )
        print(BuyPrice," ",StopLossPrice)

        while 1:

            CurrentPrice = getCurrentPrice(TradingSymbol,SymbolToken) # Get Price From Live Market

            if( (CurrentPrice <= StopLossPrice) & (not Exit) ):
                Exit = True
                Realized_Gain = Realized_Gain + ( StopLossPrice - BuyPrice) * 25
                
            elif ((CurrentPrice >= BuyPrice) & (Exit)):
                Exit = False
                CurrentReEntry+=1

            if (not Exit):
                UnRealized_Gain = (CurrentPrice - BuyPrice) * 25
                Total_Gain = Realized_Gain + UnRealized_Gain

            # print("Current Price: ",CurrentPrice, " Realized Gain: ",Realized_Gain, " Total Gain: ", Total_Gain)


            if( (CurrentReEntry == MaxReEntry) & (Exit)):
                break
    
            Current_Time = datetime.datetime.now().hour * 60 + datetime.datetime.now().minute
            if Current_Time >= 960: # Stop execution after 3:30 PM
                break


@app.route("/test", methods=["POST"])
def Test():
    data = request.get_json()
    print("Data Received in /test")
    threading.Thread(target=Process_Order,args=(data,)).start()

    response_data = {"Status": True, "message": "Order Placed Successfully"}
    return jsonify(response_data)



if __name__ == "__main__":
    login()
    threading.Thread(target=WEBSOCKET).start()
    app.run(debug=True)