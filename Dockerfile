# Use Python 3.12 slim image for smaller size
FROM python:3.12-slim

# Install git and other system dependencies
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create a non-root user for security
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Expose port 8000
EXPOSE 8080

# Command to run the application
CMD ["python", "start_mcp.py"]
# Or you can use uvicorn instead
# CMD ["uvicorn", "start_mcp:app", "--host", "0.0.0.0", "--port", "8000"]
