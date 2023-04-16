from flask import Flask, request, jsonify
import time
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json

# create a connection to the SQLite database
def opendb():
    conn = sqlite3.connect('instance/users.db')
    c = conn.cursor()
    return c, conn
c,conn = opendb()
c.execute('''CREATE TABLE IF NOT EXISTS users
            (userid INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, currentphash TEXT)''')
# close the cursor and the connection
c.close()
conn.close()
app = Flask(__name__)
def get_one_result(data, table, column, value):
    c,conn = opendb()
    c.execute(f"select {data} from {table} where {column} = ? limit 1",(value,))
    row = c.fetchone()
    c.close()
    conn.close()
    return row
def get_user_from_db(username):
    row = get_one_result("*","users","username",username)
    print(row)
    if row == None:
        return False
    else:
        return True
def setphash(username,phash):
    c,conn = opendb()
    c.execute("UPDATE users SET currentphash = ? WHERE username = ?;",(phash,username))
    conn.commit()
    row = c.fetchone()
    c.close()
    conn.close()
def login_user(username,password):
    row = get_one_result("password","users","username",username)
    print(row)
    if row == None:
        return False
    else:
        if row[0] == password:
            phash = generate_password_hash(row[0])
            setphash(username,phash)
            return phash
        else:
            return False
def check_hash(username,hash):
    row = get_one_result("currentphash","users","username",username)
    print(row)
    print(hash)
    if row[0] == hash:
        return True
    else:
        return False
def get_userid(username,hash):
    row = get_one_result("currentphash,userid","users","username",username)
    print(row[0])
    print(hash)
    if row[0] == hash:
        return row[1]
    else:
        return False
def create_user_in_db(username,password):
    try:
        c,conn = opendb()
        c.execute("insert into users (username, password) VALUES(?, ?)",(username,password))
        conn.commit()
        row = c.fetchone()
        print(row)
        c.close()
        conn.close()
        return True
    except:
        return False
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    if "pbkdf2:sha256" in password:
        if check_hash(username,password):
            return jsonify({'success': True})
    user = login_user(username,password)

    if user:
        return jsonify({'success': True,'phash': user})
    else:
        return jsonify({'success': False})

@app.route('/api/signup', methods=['POST'])
def signup():
    username = request.json['username']
    password = request.json['password']
    user = get_user_from_db(username)

    if user:
        return jsonify({'success': False, 'message': 'Username already taken'})

    new_user = create_user_in_db(username,password)
    if new_user:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Internal error'})

@app.route('/api/getuserdata', methods=['POST'])
def getuserdata():
    username = request.json['username']
    uhash = request.json['uhash']

    if "pbkdf2:sha256" not in uhash:
        return jsonify({'success': False, 'message': 'Password not a hash'})
    if not check_hash(username,uhash):
        return jsonify({'success': False, 'message': 'Hash does not match'})

    userid = get_userid(username,uhash)
    if not userid:
        return jsonify({'success': False, 'message': 'Hash does not match'})

    userdatapath = f"instance/userdata/{userid}.json"
    if os.path.isfile(userdatapath):
        f = open(userdatapath)
        userdata = json.load(f)
        f.close()
        return jsonify({'success': True, 'data': userdata})
    else:
        return jsonify({'success': False, 'message': 'User data does not exist'})

@app.route('/api/submituserdata', methods=['POST'])
def submituserdata():
    username = request.json['username']
    uhash = request.json['uhash']
    if "pbkdf2:sha256" not in uhash:
        return jsonify({'success': False, 'message': 'Password not a hash'})
    if not check_hash(username,uhash):
        return jsonify({'success': False, 'message': 'Hash does not match'})

    userid = get_userid(username,uhash)
    if not userid:
        return jsonify({'success': False, 'message': 'Hash does not match'})
    
    userdatapath = f"instance/userdata/{userid}.json"
    with open(userdatapath, 'w') as f:
        json.dump(request.json["data"], f)

    return jsonify({'success': True})
@app.route('/api/dev/getuserid', methods=['POST'])
def devgetuserid():
    username = request.json['username']
    uhash = request.json['uhash']

    if "pbkdf2:sha256" not in uhash:
        return jsonify({'success': False, 'message': 'Password not a hash'})
    if check_hash(username,uhash):
        userid = get_userid(username,uhash)
        if not userid:
            return jsonify({'success': False, 'message': 'Hash does not match'})
        else:
            return jsonify({'success': True, 'userid': userid})
    else:
        return jsonify({'success': False, 'message': 'Hash does not match'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug = True)