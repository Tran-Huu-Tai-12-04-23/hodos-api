# Model_API_Swim

## Installation and Setup

### Prerequisites
- Docker installed on your system. If you don't have Docker installed, please follow the official Docker installation guide for your operating system: [Get Docker](https://docs.docker.com/get-docker/)

### Building and Running the Docker Image

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/Model_API_Swim.git
   cd Model_API_Swim
   ```

2. Build the Docker image:
   ```bash
   docker build -t model-api-swim .
   ```

3. Run the Docker container:
   ```bash
   docker run -p 8000:8000 model-api-swim
   ```

   This command will start the container and map port 8000 from the container to port 8000 on your host machine.

4. Access the application by opening a web browser and navigating to:
   ```bash
   http://localhost:8000
   ```