# Use an official Python runtime as a parent image
FROM python:3.9-buster

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

RUN curl -L -o embeddings/scotus_opinions.parquet https://github.com/macrocosmcorp/casearch/raw/main/embeddings/scotus_opinions.parquet

# Install any needed packages specified in requirements.txt
RUN pip install -r /app/requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "main:app"]