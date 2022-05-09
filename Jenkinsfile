pipeline {
    agent any

    stages {
        stage('1: Git') {
            steps {
                // Get some code from a GitHub repository
                git branch: 'main', url: 'https://github.com/Nachiappan14/flashy_backend.git'
            }
        }

        stage('2: Node Test') {
            steps {
                sh "npm install"
                sh "npm test"
            }
        }

        stage('3: Docker Image') {
            steps {
                script {
                    docker_image = docker.build("khaveesh/flashy_backend:latest")
                }
            }
        }

        stage('4: Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "docker-cred") {
                        docker_image.push()
                    }
                }
            }
        }

        stage('5: Ansible') {
            steps {
                script {
                    ansiblePlaybook(
                        credentialsId: "aws",
                        installation: 'ansible',
                        inventory: './deploy/inventory',
                        playbook: './deploy/playbook.yml'
                    )
                }
            }
        }
    }
}
