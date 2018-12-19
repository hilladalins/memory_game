#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from sys import argv

import bottle
from bottle import run, route, static_file

DEBUG = os.environ.get("DEBUG")

bottle.debug(True)


@route('/')
def index():
    return static_file('index.html', root='')


@route('/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='static/css')


@route('/js/<filename:re:.*\.js>')
def javascript(filename):
    return static_file(filename, root='static/js')


@route('/img/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='static/img')


@route('/audio/<filename:re:.*\.mp3>')
def audio(filename):
    return static_file(filename, root='static/audio')


if DEBUG:
    run(host='localhost', port=7000)
else:
    bottle.run(host='0.0.0.0', port=argv[1])
