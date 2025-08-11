docker run -it \
  --name examtopics-downloader \
  ghcr.io/finbertmds/examtopics:latest \
  -p amazon -s aws-certified-machine-learning-engineer-associate-mla-c01 \
  -save-links -o output.md
docker cp examtopics-downloader:/app/output.md ./md/aws_mla_c01.md
docker rm examtopics-downloader
