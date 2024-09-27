```md
# Hodos Hackathon

## Backend API

### Installation

First, install the dependencies:

```bash
cd Backend/API
yarn install
```

### Running the App

#### Development Mode

To run the app in development mode with hot-reloading:

```bash
yarn run start:dev
```

#### Production Mode

To run the app in production mode:

```bash
yarn run start:prod
```

#### Debug Mode

To run the app in debug mode:

```bash
yarn run start:debug
```

### Environment Variables

Make sure to set up your `.env` file with the necessary environment variables. Here is an example:

```properties
APP_NAME='hodoshackathon'
PORT='3000'
ENV='development'
NODE_ENV='development'
DB_HOST='103.216.117.115'
DB_PORT='3306'
DB_USERNAME='root'
DB_PASSWORD='gennydev@123'
DB_DATABASE='hodoshackathon'
DB_LOGGING='false'
JWT_SECRET='hello'
JWT_EXPIRY='24h'
MODEL_API_LINK='http://103.216.117.115:3005'
GEMINI_API_KEY='AIzaSyCZBg2Jr7v0EMkugfmEoA9ujyU52S_nVKA'
```

### Building the App

To build the app:

```bash
yarn run build
```

### Testing

#### Unit Tests

To run unit tests:

```bash
yarn run test
```

#### End-to-End Tests

To run end-to-end tests:

```bash
yarn run test:e2e
```

#### Test Coverage

To generate test coverage reports:

```bash
yarn run test:cov
```

### Docker

To run the app using Docker, you can use the provided Dockerfile.

#### Build Docker Image

```bash
docker build -t hodos-hackathon-api .
```

#### Run Docker Container

```bash
docker run -p 3000:3000 hodos-hackathon-api
```

## Front End Mobile App

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher) or yarn (version 1.x or higher)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Setup

1. **Clone the repository:**

    ```sh
    git clone git@github.com:Tran-Huu-Tai-12-04-23/hodos-hackathon.git
    cd Front-end
    ```

2. **Install dependencies:**

    Using npm:
    ```sh
    npm install
    ```

    Using yarn:
    ```sh
    yarn install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a reference.

### Running the Project

#### Running on iOS

1. **Start the Expo development server:**

    ```sh
    npm run start
    ```

2. **Run the iOS app:**

    For development:
    ```sh
    npm run local:ios
    ```

    For production:
    ```sh
    npm run ios
    ```

#### Running on Android

1. **Start the Expo development server:**

    ```sh
    npm run start
    ```

2. **Run the Android app:**

    For development:
    ```sh
    npm run local:android
    ```

    For production:
    ```sh
    npm run android
    ```

### Building for Distribution

#### iOS

To build the iOS app for distribution, run:

```sh
npm run distribution:ios
```

#### Android

To build the Android app for distribution, run:

```sh
npm run distribution:android
```

## Model_API_Swim

### Prerequisites
- Docker installed on your system. If you don't have Docker installed, please follow the official Docker installation guide for your operating system: [Get Docker](https://docs.docker.com/get-docker/)

### Building and Running the Docker Image

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/Model_API_Swim.git
   cd Backend/Model-API
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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
```