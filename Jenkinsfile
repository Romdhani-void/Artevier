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

        stage('Install Backend Dependencies') {
            steps {
                container('node') {
                    script {
                        def services = ['user-service', 'product-service', 'order-service', 'notification-service', 'api-gateway']
                        for (svc in services) {
                            dir("backend/${svc}") {
                                sh 'npm ci || npm install'
                            }
                        }
                    }
                }
            }
        }

        stage('Build & Push Images') {
            steps {
                container('kaniko') {
                    script {
                        def services = ['user-service', 'product-service', 'order-service', 'notification-service', 'api-gateway']
                        for (svc in services) {
                            def imageName = svc.replace('-', '_')
                            sh """
                                /kaniko/executor \\
                                  --context=`pwd`/backend \\
                                  --dockerfile=`pwd`/backend/${svc}/Dockerfile \\
                                  --destination=${ECR_REGISTRY}/artevier-${imageName}:${BUILD_NUMBER}
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                container('tools') {
                    sh """
                        helm upgrade --install artevier ./helm/artevier \\
                          -f ./helm/artevier/values.yaml \\
                          --namespace artevier \\
                          --set image.tag=${BUILD_NUMBER} \\
                          --wait --timeout 5m
                    """
                }
            }
        }
    }
}