pipeline {
    agent any

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
                container('node') {
                    dir('backend/user-service') {
                        sh 'npm ci || npm install'
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                container('aws') {
                    sh '''
                aws ecr get-login-password --region eu-west-3
            '''
                }
            }
        }
    }
}
