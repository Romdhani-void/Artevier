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
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'npm install'
                    }
                }
            }
        }
        stage('Verify Tools') {
            steps {
                container('aws') {
                    sh 'aws --version'
                }
            }
        }
    }
}
