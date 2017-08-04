#!/usr/bin/env groovy

node {
    stage('configure Java') {
      tool name: 'jdk8', type: 'jdk'
    }
    stage('configure Maven') {
     tool name: 'maven', type: 'maven'
    }
    stage('Initialize') {
      sh 'export M2_HOME=/home/apache-maven-3.5.0'
      sh 'export PATH=$PATH:$M2_HOME/bin'
    }
    stage('checkout') {
        checkout scm
    }

    stage('check java') {
        sh "java -version"
    }

    stage('clean') {
        sh "chmod +x mvnw"
        sh "./mvnw clean"
    }

    stage('install tools') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v6.11.1 -DyarnVersion=v0.27.5"
    }

    stage('yarn install') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:yarn"
    }

    stage('backend tests') {
        try {
            sh "./mvnw test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
    }

    stage('frontend tests') {
        try {
            sh "./mvnw com.github.eirslett:frontend-maven-plugin:gulp -Dfrontend.gulp.arguments=test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/test-results/karma/TESTS-*.xml'
        }
    }

    stage('package and deploy') {
        sh "./mvnw com.heroku.sdk:heroku-maven-plugin:1.1.1:deploy -DskipTests -Pprod -Dheroku.appName="
        archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
    }

    stage('quality analysis') {
        withSonarQubeEnv('sonar') {
            sh "./mvnw sonar:sonar"
        }
    }
}
