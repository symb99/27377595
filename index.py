import os
import json
import sys
from urllib.parse import parse_qs

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def application(environ, start_response):
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    
    lang = params.get('lang', ['ES'])[0].upper()
    action = params.get('action', [''])[0]
    ci = params.get('ci', [''])[0]

    if action == 'get_config':
        start_response('200 OK', [('Content-Type', 'application/json; charset=utf-8'), ('Set-Cookie', f'lang={lang}; Path=/ATI')])
        try:
            ruta_config = os.path.join(BASE_DIR, 'conf', f'config{lang}.json')
            with open(ruta_config, "r", encoding="utf-8") as f:
                return [f.read().encode('utf-8')]
        except:
            ruta_fallback = os.path.join(BASE_DIR, 'conf', 'configES.json')
            with open(ruta_fallback, "r", encoding="utf-8") as f:
                return [f.read().encode('utf-8')]

    if action == 'get_index':
        start_response('200 OK', [('Content-Type', 'application/json; charset=utf-8')])
        try:
            ruta_index = os.path.join(BASE_DIR, 'data', 'index.json')
            with open(ruta_index, "r", encoding="utf-8") as f:
                return [f.read().encode('utf-8')]
        except:
            return [b'[]']

    if action == 'get_profile' and ci:
        start_response('200 OK', [('Content-Type', 'application/json; charset=utf-8')])
        try:
            ruta_perfil = os.path.join(BASE_DIR, ci, 'profile.json')
            with open(ruta_perfil, "r", encoding="utf-8") as f:
                return [f.read().encode('utf-8')]
        except:
            return [b'{}']

    start_response('200 OK', [('Content-Type', 'text/html; charset=utf-8')])
    try:
        ruta_html = os.path.join(BASE_DIR, 'index.html')
        with open(ruta_html, "r", encoding="utf-8") as f:
            html_content = f.read()
        return [html_content.encode('utf-8')]
    except Exception as e:
        return [f"<h1>Error cargando el sitio: {str(e)}</h1>".encode('utf-8')]