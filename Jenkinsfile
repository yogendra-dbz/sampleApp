#!/usr/bin/env groovy

node {
    stage('configure Java') {
      tool name: 'jdk8', type: 'jdk'
    }
    stage('configure Maven') {
     tool name: 'maven', type: 'maven'
    }
    stage('checkout') {
        checkout scm
    }

    stage('check java') {
        sh "java -version"
    }
     stage('check maven') {
     	def mvnHome = tool 'maven'
  	env.PATH = "${mvnHome}/bin:${env.PATH}"
    }

    stage('clean') {
        sh "chmod +x mvnw"
        sh "mvn clean"
    }

    stage('install tools') {
        sh "mvn com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v6.11.1 -DyarnVersion=v0.27.5"
    }

    stage('yarn install') {
        sh "mvn com.github.eirslett:frontend-maven-plugin:yarn"
    }
    stage('bower install') {
        sh "mvn com.github.eirslett:frontend-maven-plugin:bower"
    } 
    stage('backend tests') {
        try {
            sh "mvn test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
    }

    stage('frontend tests') {
        try {
            sh "mvn com.github.eirslett:frontend-maven-plugin:gulp -Dfrontend.gulp.arguments=test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/test-results/karma/TESTS-*.xml'
        }
    }



    stage('package and deploy') {
        sh "mvn -Pprod -DskipTests package"
        sh "boxfuse run -env=prod"
        archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
    }

}
