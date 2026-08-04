pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
        }
    }

    environment {
        AWS_REGION   = 'eu-west-3'
        ECR_REGISTRY = '566167302576.dkr.ecr.eu-west-3.amazonaws.com'
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

        stage('Build & Push user-service Image') {
            steps {
                container('kaniko') {
                    sh '''
                        /kaniko/executor \
                          --context=`pwd`/backend \
                          --dockerfile=`pwd`/backend/user-service/Dockerfile \
                          --destination=${ECR_REGISTRY}/artevier-user_service:${BUILD_NUMBER} \
                          --destination=${ECR_REGISTRY}/artevier-user_service:latest
                    '''
                }
            }
        }
    }
}