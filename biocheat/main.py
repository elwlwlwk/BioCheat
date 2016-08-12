from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello():
	return render_template('test.html')

@app.route('/base_len')
def base_len():
	return render_template('base_len.html')

@app.route('/restrict_map')
def restrict_map():
	return render_template('restrict_map.html')

if __name__ == '__main__':
	app.debug= True
	app.run(host='0.0.0.0')
