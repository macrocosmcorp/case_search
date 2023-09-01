# Use an official Python runtime as a parent image
FROM python:3.9-buster

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD main.py main.py
ADD requirements.txt requirements.txt

RUN mkdir embeddings
RUN curl -o embeddings/scotus_opinions.parquet -L https://www.dropbox.com/s/62cisdg8n71gljp/scotus_opinions.parquet?dl=1

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:8000", "main:app"]