from flask import Flask, render_template, jsonify
import requests
from datetime import datetime
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_scores', methods=['GET'])
def get_scores():

    url = 'https://api.football-data.org/v4/matches'
    headers = {'X-Auth-Token': '1b20f5f102d14320b82f892574c1bcbc'}
    response = requests.get(url, headers=headers)


    if response.status_code == 200:
        matches_data = response.json()
        return jsonify(matches_data)
    else:
        return jsonify({'error': 'Unable to fetch data'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
