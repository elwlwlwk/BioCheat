from flask import Flask, request
from dao import get_cursor
import json

app = Flask(__name__)

@app.route('/spsum_list')
def spsum_list():
	cursor= get_cursor()
	cursor.execute('select organism from spsum where organism like %s order by organism', (request.args.get('organism')+'%'))
	return json.dumps(list(map(lambda x: x['organism'], cursor.fetchall())))

@app.route('/spsum')
def spsum():
	cursor= get_cursor()
	cursor.execute('select organism, spsum from spsum where organism= %s', (request.args.get('organism')))
	return json.dumps(cursor.fetchone())

@app.route('/codon_translation_list')
def codon_translation_list():
	cursor= get_cursor()
	cursor.execute('select organism from codon_translation')
	return json.dumps(list(map(lambda x: x['organism'], cursor.fetchall())))

@app.route('/codon_translation')
def codon_translation():
	cursor= get_cursor()
	cursor.execute('select translation_map from codon_translation where organism=%s', (request.args.get('organism')))
	return cursor.fetchone()['translation_map']


if __name__ == '__main__':
	app.debug= True
	app.run(host='0.0.0.0', port=8081)
