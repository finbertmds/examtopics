# python -m pip install -r requirements.txt

python retry_failed_questions.py --input failed_urls.txt --output aws-scs-c03-retried.json
python retry_failed_questions.py "https://www.examtopics.com/discussions/amazon/view/110918-exam-aws-certified-security-specialty-topic-1-question-493-discussion/" -o retried.json