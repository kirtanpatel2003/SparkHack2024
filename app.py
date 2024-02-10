#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Feb  9 19:18:36 2024

@author: kirtanpatel13
"""
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

OSM_NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'


def get_location_coordinates(address):
    params = {
        'q': address,
        'format': 'json',
        'limit': 1
    }
    response = requests.get(OSM_NOMINATIM_URL, params=params)
    data = response.json()
    if data:
        return {
            'lat': data[0]['lat'],
            'lon': data[0]['lon']
        }
    return None



@app.route('/')
def home():
    return render_template('indexcopy.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/howtouse')
def contact():
    return render_template('howItWorks.html')

@app.route('/location', methods=['POST'])
def location():
    data = request.get_json()
    address = data['address']
    location = get_location_coordinates(address)
    if location:
        location['lat'] = float(location['lat'])
        location['lon'] = float(location['lon'])
        return jsonify(location)
    else:
        return jsonify({'error': 'Location not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
