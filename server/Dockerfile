FROM python:3.10-slim

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

RUN chmod +x prestart.sh

ENTRYPOINT ["./prestart.sh"]
CMD ["python", "main.py"]
