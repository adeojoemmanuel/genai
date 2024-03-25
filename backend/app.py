import os
from dotenv import load_dotenv
from langchain.agents import create_csv_agent
from langchain.llms import OpenAI
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from pandasql import sqldf
from prompts import promptStructure


from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate 
from langchain.memory import ConversationBufferWindowMemory
from langchain.document_loaders.csv_loader import CSVLoader
from langchain.chat_models import AzureChatOpenAI

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Read OpenAI API key from environment variable
openai_key = os.getenv("OPENAI_API_KEY")
openai_base = os.getenv("OPENAI_API_BASE")
openai_version = os.getenv("OPENAI_API_VERSION")
deploy_name = os.getenv("DEPLOYMENT_NAME")

@app.route('/predict', methods=['POST'])
def predict():
    
    file = "./data/ml_project1_data.csv"

    llm = AzureChatOpenAI(openai_api_key=openai_key, deployment_name=deploy_name, model_name="gpt-4", verbose=False, cache=False, temperature=0.2, openai_api_base=openai_base, openai_api_version= openai_version)

    #agent = create_csv_agent(llm, file, verbose=True)

    #print(agent.agent.llm_chain.prompt.template)

    df = pd.read_csv(file)

    query = request.form['question']

    result = llm.predict(promptStructure.format(question=query))

    #result = agent.run(question)
    print(result)

    output = sqldf(result, locals())
    
    json_data = output.to_json(orient='records')

    print(json_data)

    return jsonify({'result': json_data})

if __name__ == '__main__':
  app.run(debug=True)
