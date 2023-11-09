from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import Config
import datetime as datetime
import time
import pandas as pd
import pymongo


app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


client = pymongo.MongoClient('mongodb://localhost:27017/')
mydb = client['Options']
Details = mydb.UserInfo


@app.route("/CreateUser", methods=["POST"])
def CreateUser():
    data = request.get_json()

    records = {
    'Full Name':data['name'],
    'Email':data['email'],
    'Password': data['password'],
    'ClientID' : data['ClientID'],
    'MPin' : data['pwd'],
    'API KEY':data['ApiKey'],
    'Token': data['token']
    }
    
    
    flag = True
    for record in Details.find({'Email':data['email']}):
        print(record)
        flag = False
        break
    
    if flag == True:
        result = Details.insert_one(records)
        response_data = {"Status": True, "message": "account Created Successfully"}
    else:
        response_data = {"Status": False, "message": "an account already exist with this email.try with Different email"}



    return jsonify(response_data)

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print(data)

    flag = False
    for record in Details.find({'Email':data['email'],'Password': data['password'] }):
        print(record)
        flag = True
        break
    

    if flag == True:
        response_data = {"Status": True, "message": "Successfully  Logged in"}
    else:
        response_data = {"Status": False, "message": "Wrong Email/Password!!!"}


    return jsonify(response_data)


if __name__ == "__main__":
    app.run(debug=True,port=5001)