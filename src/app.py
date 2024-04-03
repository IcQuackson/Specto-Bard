from flask import Flask, request, jsonify, render_template
from flask import send_from_directory
#from openai_functions import call_openai
import re
import requests
import sys
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()



client = AzureOpenAI(
  azure_endpoint = "https://escola42.openai.azure.com/", 
  api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
  api_version="2024-02-15-preview"
)

# https://escola42.openai.azure.com/openai/deployments/london_is_best/completions?api-version=2024-02-15-preview

CHAT_COMPLETIONS_MODEL = os.getenv('CHAT_COMPLETION_NAME')
SEED=123

print(os.getenv('AZURE_OPENAI_API_KEY'))



app = Flask(__name__)

#curl -X POST -H "Content-Type: application/json" -d "{"user_story": "USER STORY A\n\nPre-condition(s)\n\nThe user has accessed an FO form.\n\nActor(s)\n\nUser.\n\nPost-condition(s)\n\n· The system records the explicit consent of the user together with the date and time stamp of the user’s consent\n\n· The user can start or resume the current application form\n\nRequirements\n\nREQ-UCC06-010 Privacy policy consent\n\nOn applications start or resume, the system displays an overlay or a modal window that lists the\n\ncontent of the Privacy Policy, with options to review and accept.\n\nIf the user accepts, the user can proceed with the current application.\n\nIf the user does not accept, the user cannot proceed with the current application and remains on\n\nthe initial step of the application.\n\nREQ-UCC06-020 Cookies policy\n\nOn applications start or resume, the system displays a header/footer overlay with the content of\n\nthe Cookies policy, with options to review and accept.\n\nThe user only has the option to allow system cookies. There's no option to block the system\n\ncookies.\n\nIf the user does not allow, the user cannot proceed with the current application and remains on\n\nthe initial step of the application.\n\nInformation model\n\n# Field label Description Type M/O/System Rules Visibility\n\n1 Privacy Policy message Content of the Privacy Policy text. Text System The content of the Privacy Policy modal is specific for each IPO. On applications start or resume.\n\n2 Accept and Close Button on privacy policy pop up to 'Accept and close' the pop up. Option M The user can only proceed with the current application in case the Privacy policy has been accepted. On applications start or resume.\n\n3 Cookie Policy Cookies header or footer that overlays the website in order to grant permission. Text O Displayed cookie policy UCC06_MSG_01. The cookie policy link brings you to the relevant cookie policy in a new modal window. On applications start or resume.\n\n4 Cookies acceptance Option to black or allow the cookies. Options M Possible options: · Allow cookies: Clicking on this option allows the website to save cookies on the computer. The user can only proceed with the current application when On applications start.\n\n# Field label Description Type M/O/System Rules Visibility the cookies are allowed.\n\nMessages\n\nCode Type Message\n\nUCC06_MSG_01 Informative This website uses cookies to remember your settings and gather web statistics. You will have to grant permission for the installation of these cookies. More information on our cookie policy.\n\n"}" http://localhost:5000/


@app.route('/', methods=['GET'])
def generate_test_cases():

  # Read system_message from file
  with open('system_message.txt', 'r') as file:
    system_message = file.read()

  user_story = "USER STORY A\n\nPre-condition(s)\n\nThe user has accessed an FO form.\n\nActor(s)\n\nUser.\n\nPost-condition(s)\n\n· The system records the explicit consent of the user together with the date and time stamp of the user’s consent\n\n· The user can start or resume the current application form\n\nRequirements\n\nREQ-UCC06-010 Privacy policy consent\n\nOn applications start or resume, the system displays an overlay or a modal window that lists the\n\ncontent of the Privacy Policy, with options to review and accept.\n\nIf the user accepts, the user can proceed with the current application.\n\nIf the user does not accept, the user cannot proceed with the current application and remains on\n\nthe initial step of the application.\n\nREQ-UCC06-020 Cookies policy\n\nOn applications start or resume, the system displays a header/footer overlay with the content of\n\nthe Cookies policy, with options to review and accept.\n\nThe user only has the option to allow system cookies. There's no option to block the system\n\ncookies.\n\nIf the user does not allow, the user cannot proceed with the current application and remains on\n\nthe initial step of the application.\n\nInformation model\n\n# Field label Description Type M/O/System Rules Visibility\n\n1 Privacy Policy message Content of the Privacy Policy text. Text System The content of the Privacy Policy modal is specific for each IPO. On applications start or resume.\n\n2 Accept and Close Button on privacy policy pop up to 'Accept and close' the pop up. Option M The user can only proceed with the current application in case the Privacy policy has been accepted. On applications start or resume.\n\n3 Cookie Policy Cookies header or footer that overlays the website in order to grant permission. Text O Displayed cookie policy UCC06_MSG_01. The cookie policy link brings you to the relevant cookie policy in a new modal window. On applications start or resume.\n\n4 Cookies acceptance Option to black or allow the cookies. Options M Possible options: · Allow cookies: Clicking on this option allows the website to save cookies on the computer. The user can only proceed with the current application when On applications start.\n\n# Field label Description Type M/O/System Rules Visibility the cookies are allowed.\n\nMessages\n\nCode Type Message\n\nUCC06_MSG_01 Informative This website uses cookies to remember your settings and gather web statistics. You will have to grant permission for the installation of these cookies. More information on our cookie policy.\n\n"

  #system_message = "hello"
  #user_story = "hello"

  message_text = [{"role":"system","content": system_message}, {"role":"user","content": user_story}]

  #user_story = request.json.get('user_story')

  response = client.chat.completions.create(
    model="london_is_best", # model = "deployment_name"
    messages = message_text,
    temperature=0.7,
    max_tokens=4096,
    top_p=0.95,
    frequency_penalty=0,
    presence_penalty=0,
    stop=None
  )

  # Extracting generated test cases from the completion
  print(response)
  test_cases = response.choices[0].message.content

  # write test_cases in a file
  with open('test_cases.txt', 'w') as file:
    file.write(test_cases)

  # Returns the test cases generated by the model
  return jsonify({"test_cases": test_cases})

@app.route('/index.html', methods=['GET'])
def get_index():
  # print current directory
  print(os.getcwd())
  return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
