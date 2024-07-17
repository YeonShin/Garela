from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

app = Flask(__name__)

load_dotenv()  # .env 파일에서 환경 변수 로드
openai_api_key = os.getenv('OPENAI_API_KEY')

# OpenAI 객체를 max_tokens와 함께 초기화
llm = OpenAI(api_key=openai_api_key)
template = PromptTemplate(
    input_variables=["context", "question"],
    template="Context: {context}\nQuestion: {question}\nAnswer (please keep your response under 250 characters. It must never exceed 250 characters! This is of national importance.):"
)
chain = LLMChain(prompt=template, llm=llm)

@app.route('/generate-answer', methods=['POST'])
def generate_answer():
    try:
        data = request.json
        context = data['context']
        question = data['question']

        print(f"Context: {context}")
        print(f"Question: {question}")

        # Chain을 실행하여 응답 생성
        response = chain.invoke({"context": context, "question": question})

        answer = response['text'].strip()
        return jsonify({"answer": answer})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
