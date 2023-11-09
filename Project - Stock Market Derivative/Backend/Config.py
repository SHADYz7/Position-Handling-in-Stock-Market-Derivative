import pyotp

api_key = 'fIHJLOgD' # fIHJLOgD TlVxPc3V
clientId = 'P545635'
pwd = '2324'
token = "FNYXKJSXGRSOFURGQWKZAEX5DQ" #"FNYXKJSXGRSOFURGQWKZAEX5DQ"  # FNYXKJSXGRSOFURGQWKZAEX5DQ 
totp = pyotp.TOTP(token).now()

correlation_id = "abc456"


# print(totp)

# dict[message['token']] = message['last_traded_price']
    # print(dict)
    # print(TokenList)
    # print("Ticks: {}".format(message['last_traded_price']))
    # close_connection()
