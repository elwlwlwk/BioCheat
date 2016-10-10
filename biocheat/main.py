from flask import Flask, render_template, redirect, request
from dao import DB_CONN
import json
app = Flask(__name__)

@app.route('/')
def hello():
	return render_template('main.html')

@app.route('/base_len')
def base_len():
	return render_template('base_len.html')

@app.route('/restrict_map')
def restrict_map():
	return render_template('restrict_map.html')

@app.route('/random_base_generator')
def random_base_gen():
	return render_template('random_base_gen.html')

@app.route('/codon_analyzer')
def codon_analyzer():
	return render_template('codon_analyzer.html')

@app.route('/spsum_list')
def spsum_list():
	cursor= DB_CONN.cursor()
	cursor.execute('select organism from spsum where organism like %s order by organism', (request.args.get('organism')+'%'))
	return json.dumps(list(map(lambda x: x['organism'], cursor.fetchall())))

@app.route('/spsum')
def spsum():
	cursor= DB_CONN.cursor()
	cursor.execute('select organism, spsum from spsum where organism= %s', (request.args.get('organism')))
	return json.dumps(cursor.fetchone())

@app.route('/codon_translation_list')
def codon_translation_list():
	cursor= DB_CONN.cursor()
	cursor.execute('select organism from codon_translation')
	return json.dumps(list(map(lambda x: x['organism'], cursor.fetchall())))

@app.route('/codon_translation')
def codon_translation():
	cursor= DB_CONN.cursor()
	cursor.execute('select translation_map from codon_translation where organism=%s', (request.args.get('organism')))
	return cursor.fetchone()['translation_map']

if __name__ == '__main__':
	app.debug= True
	app.run(host='0.0.0.0', port=80)
