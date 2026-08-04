pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
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

        stage('Check Docker') {
            steps {
                container('node') {
                    sh '''
                        echo "=== Docker ==="
                        docker --version || true

                        echo "=== Which Docker ==="
                        which docker || true
                    '''
                }
            }
        }
    }
}