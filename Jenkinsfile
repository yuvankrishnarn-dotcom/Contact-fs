pipeline {
  agent any

  options {
    timestamps()
  }

  stages {

    // -----------------------------
    // CHECKOUT FROM PRIVATE GITHUB
    // -----------------------------
    stage("Checkout") {
      steps {
        git branch: 'main',
            credentialsId: 'github-creds',
            url: 'https://github.com/yuvankrishnarn-dotcom/Contact-fs.git'
      }
    }

    // -----------------------------
    // BUILD BACKEND IMAGE
    // -----------------------------
    stage("Build Backend") {
      steps {
        dir("backend") {
          sh """
          docker build -t contact-backend .
          """
        }
      }
    }

    // -----------------------------
    // BUILD FRONTEND IMAGE
    // -----------------------------
    stage("Build Frontend") {
      steps {
        dir("frontend") {
          sh """
          docker build -t contact-frontend .
          """
        }
      }
    }

    // -----------------------------
    // DEPLOY CONTAINERS
    // -----------------------------
    stage("Deploy") {
      steps {
        sh """
        echo "Stopping old containers (if any)"
        docker rm -f backend frontend || true

        echo "Starting backend (localhost only)"
        docker run -d \
          --name backend \
          --network host \
          --restart unless-stopped \
          contact-backend

        echo "Starting frontend (public on port 80)"
        docker run -d \
          --name frontend \
          -p 80:80 \
          --restart unless-stopped \
          contact-frontend
        """
      }
    }
  }

  post {
    success {
      echo "Deployment successful. App should be live on port 80."
    }
    failure {
      echo "Pipeline failed. Read the logs instead of guessing."
    }
  }
}
