docker run -it \
  --name examtopics-downloader \
  ghcr.io/thatonecodes/examtopics-downloader:latest \
  -p amazon -s aws-certified-solutions-architect-professional-sap-c02 \
  -save-links -o output.md
docker cp examtopics-downloader:/app/output.md .
docker cp examtopics-downloader:/app/saved-links.txt .
docker rm examtopics-downloader
