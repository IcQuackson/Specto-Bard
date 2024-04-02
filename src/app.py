from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def generate_test_cases():
    #user_story = request.json.get('user_story')
    # Your code to generate test cases from user story using Azure OpenAI API
    # Replace this with your actual implementation
    test_cases = {'test_cases': ['Test case 1', 'Test case 2']}
    return jsonify(test_cases)

if __name__ == '__main__':
    app.run(debug=True)
