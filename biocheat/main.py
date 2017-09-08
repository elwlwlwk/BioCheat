from flask import Flask, render_template, redirect, request
import json
import sys
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

@app.route('/exon_intron')
def exon_intron():
	return render_template('exon_intron.html')

@app.route('/z_curve')
def z_curve():
	return render_template('z_curve.html')

if __name__ == '__main__':
	if len(sys.argv)>1:
		port= int(sys.argv[1])
	else:
		port=80
	app.debug= True
	app.run(host='0.0.0.0', port=port)
