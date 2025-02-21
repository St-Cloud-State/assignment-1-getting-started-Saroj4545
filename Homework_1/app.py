from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

loanApplications = {}
application_counter = 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/apply', methods=['POST'])
def apply():
    global application_counter
    data = request.json
    if not data.get('name') or not data.get('zipcode'):
        return jsonify({'error: Name and Zipcode are required'}), 400
    
    app_id = application_counter
    loanApplications[app_id] = {
        'name': data['name'],
        'zipcode': data['zipcode'],
        'status': 'received'
    }
    application_counter +=1
    return jsonify({'application_number': app_id})

@app.route('/api/status/<int:app_id>', methods=['GET'])
def check_status(app_id):
    application = loanApplications.get(app_id)
    if not application:
        return jsonify({'status':'not found'}), 404
    return jsonify({'status': application['status']}) 

@app.route('/api/status/<int:app_id>', methods=['PUT'])
def change_status(app_id):
    data = request.json
    new_status = data.get('status')
    if app_id not in loanApplications:
        return jsonify({'error': 'Application not found'}), 404
    
    if new_status not in ['received','processing', 'accepted', 'rejected']:
        return jsonify({'error': 'Invalid status'}), 400
    
    loanApplications[app_id]['status'] = new_status;
    return jsonify({'message': 'Status updated successfully.'})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0",port=5000)