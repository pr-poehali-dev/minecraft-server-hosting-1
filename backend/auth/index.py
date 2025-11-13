import json
import os
import hashlib
import secrets
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    '''Hash password using SHA-256 with salt'''
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"

def verify_password(password: str, stored_hash: str) -> bool:
    '''Verify password against stored hash'''
    salt, pwd_hash = stored_hash.split('$')
    return hashlib.sha256((password + salt).encode()).hexdigest() == pwd_hash

def get_db_connection():
    '''Get database connection'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication - register and login
    Args: event with httpMethod, body (email, password, full_name for register)
    Returns: HTTP response with user data or error
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = json.loads(event.get('body', '{}'))
    action = body.get('action')
    email = body.get('email')
    password = body.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email и password обязательны'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if action == 'register':
        full_name = body.get('full_name', '')
        
        cur.execute("SELECT id FROM t_p38080872_minecraft_server_hos.users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пользователь с таким email уже существует'}),
                'isBase64Encoded': False
            }
        
        password_hash = hash_password(password)
        cur.execute(
            "INSERT INTO t_p38080872_minecraft_server_hos.users (email, password_hash, full_name) VALUES (%s, %s, %s) RETURNING id, email, full_name, created_at",
            (email, password_hash, full_name)
        )
        user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'user': dict(user),
                'message': 'Регистрация успешна'
            }, default=str),
            'isBase64Encoded': False
        }
    
    elif action == 'login':
        cur.execute(
            "SELECT id, email, password_hash, full_name, created_at FROM t_p38080872_minecraft_server_hos.users WHERE email = %s",
            (email,)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user or not verify_password(password, user['password_hash']):
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный email или password'}),
                'isBase64Encoded': False
            }
        
        user_data = dict(user)
        del user_data['password_hash']
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'user': user_data,
                'message': 'Вход выполнен'
            }, default=str),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Неизвестное действие'}),
        'isBase64Encoded': False
    }
