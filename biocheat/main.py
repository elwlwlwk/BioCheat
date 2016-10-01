from flask import Flask, render_template, redirect
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
def codon_translation():
	return render_template('codon_analyzer.html')

if __name__ == '__main__':
	app.debug= True
	app.run(host='0.0.0.0', port=80)
