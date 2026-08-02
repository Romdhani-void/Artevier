pipeline {
    agent {
        docker {
            image 'node:22'
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Repository') {
            steps {
                sh 'pwd'
                sh 'ls -la'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend/user-service') {
                    sh 'npm install'
                }
            }
        }
    }
}
