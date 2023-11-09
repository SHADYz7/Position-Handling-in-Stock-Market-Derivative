from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from SmartApi import SmartConnect
from SmartApi.smartWebSocketV2 import SmartWebSocketV2
import threading
import datetime as datetime
import time
import pandas as pd
from Config import *
from flask_socketio import SocketIO

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app)

app.config['CORS_HEADERS'] = 'Content-Type'



def login():

    global smartApi
    global Session_Obj

    smartApi = SmartConnect(api_key)
    Session_Obj = smartApi.generateSession(clientId, pwd, totp)

def GetToken(tradingSymbol):
    try:
        df1 = pd.read_excel("Book2.xlsx",sheet_name=0)
        df1 = df1[(df1['symbol'] == tradingSymbol)]
        # print(df1)

        if not df1.empty:
            token = df1.iloc[0]['token']
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

def Process_Order(data):

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

            print("Current Price: ",CurrentPrice, " Realized Gain: ",Realized_Gain, " Total Gain: ", Total_Gain)

            if( (CurrentReEntry == MaxReEntry) & (Exit)):
                break

            Current_Time = datetime.datetime.now().hour * 60 + datetime.datetime.now().minute
            if Current_Time >= 960: # Stop execution after 3:30 PM
                break


@app.route("/RealTimeData", methods=["POST"])
@socketio.on('real-time-data')
def send_real_time_data(data):
    # Process data (replace this with your actual logic)
    current_price = 100  # Example value
    unrealized_gain = 50  # Example value
    total_gain = 150  # Example value

    # Send data to connected clients
    socketio.emit('real-time-data', {
        'current_price': current_price,
        'unrealized_gain': unrealized_gain,
        'total_gain': total_gain
    })


@app.route("/test", methods=["POST"])
def Test():

    data = request.get_json()
    socketio.emit('order-placed', data)
    threading.Thread(target=Process_Order,args=(data,)).start()

    response_data = {"Status": True, "message": "Order Placed Successfully"}
    return jsonify(response_data)

if __name__ == "__main__":
    login()
    app.run(debug=True)
    socketio.run(app, debug=True)




