from flask import Flask, render_template, redirect, request
from dao import get_cursor
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

@app.route('/amino_seq_to_codon')
def amino_seq_to_codon():
	return render_template('amino_seq_to_codon.html')

@app.route('/CpG_island')
def CpG_island():
	return render_template('CpG_island.html')

@app.route('/ori_finder')
def ori_finder():
	return render_template('ori_finder.html')

@app.route('/base_skew')
def base_skew():
	return render_template('base_skew.html')

@app.route('/z_curve')
def z_curve():
	return render_template('z_curve.html')

if __name__ == '__main__':
	app.debug= True
	app.run(host='0.0.0.0', port=80)
