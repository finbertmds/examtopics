docker run -it \
  --name examtopics-downloader \
  ghcr.io/thatonecodes/examtopics-downloader:latest \
  -p amazon -s scs-c02 \
  -save-links -type json -o output.md

docker cp examtopics-downloader:/app/output.json ./py_pcap_31_03_2.json
docker cp examtopics-downloader:/app/output.json ./json/py_pcap_31_03.json
docker rm examtopics-downloader

# https://www.examtopics.com/exams/amazon/ans-c00/
# https://www.examtopics.com/exams/amazon/aws-certified-advanced-networking-specialty-ans-c01/
# https://www.examtopics.com/exams/amazon/aws-certified-ai-practitioner-aif-c01/
# https://www.examtopics.com/exams/amazon/aws-certified-alexa-skill-builder-specialty/
# https://www.examtopics.com/exams/amazon/aws-certified-big-data-specialty/
# https://www.examtopics.com/exams/amazon/aws-certified-cloud-practitioner/
# https://www.examtopics.com/exams/amazon/aws-certified-cloud-practitioner-clf-c02/
# https://www.examtopics.com/exams/amazon/aws-certified-data-analytics-specialty/
# https://www.examtopics.com/exams/amazon/aws-certified-database-specialty/
# https://www.examtopics.com/exams/amazon/aws-certified-data-engineer-associate-dea-c01/
# https://www.examtopics.com/exams/amazon/aws-certified-developer-associate/
# https://www.examtopics.com/exams/amazon/aws-certified-developer-associate-dva-c02/
# https://www.examtopics.com/exams/amazon/aws-certified-devops-engineer-professional-dop-c02/
# https://www.examtopics.com/exams/amazon/aws-certified-machine-learning-engineer-associate-mla-c01/
# https://www.examtopics.com/exams/amazon/aws-certified-machine-learning-specialty/
# https://www.examtopics.com/exams/amazon/aws-certified-sap-on-aws-specialty-pas-c01/
# https://www.examtopics.com/exams/amazon/aws-certified-security-specialty/
# https://www.examtopics.com/exams/amazon/aws-certified-security-specialty-scs-c02/
# https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-associate-saa-c02/
# https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-associate-saa-c03/
# https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-professional/
# https://www.examtopics.com/exams/amazon/aws-certified-solutions-architect-professional-sap-c02/
# https://www.examtopics.com/exams/amazon/aws-certified-sysops-administrator-associate/
# https://www.examtopics.com/exams/amazon/aws-devops-engineer-professional/
# https://www.examtopics.com/exams/amazon/aws-sysops/

../examtopics-downloader/examtopicsdl -t xxx -p amazon -s aws-sysops -save-links -o aws_sys_c00.md -json -save-all-pages -push-github && \
mv aws_sys_c00.md ./md/aws_sys_c00.md && \
mv aws_sys_c00.json ./json/aws_sys_c00.json



