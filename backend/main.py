from flask import Flask, request, jsonify
import time
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

# create a connection to the SQLite database
def opendb():
    conn = sqlite3.connect('instance/users.db')
    c = conn.cursor()
    return c, conn
c,conn = opendb()
c.execute('''CREATE TABLE IF NOT EXISTS users
            (username TEXT PRIMARY KEY, password TEXT, currentphash TEXT)''')
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
    c,conn = opendb()
    c.execute("select currentphash from users where username = ?",(username,))
    row = c.fetchone()
    c.close()
    conn.close()
    print(row)
    print(hash)
    if row[0] == hash:
        return True
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
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug = True)