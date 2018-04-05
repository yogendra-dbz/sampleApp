#!/usr/bin/env groovy

node {
    stage('Preparation') {
	  step{
		tool name: 'jdk8', type: 'jdk'
	  }
      step {
		tool name: 'maven', type: 'maven'
	  }
	  step {
		def mvnHome = tool 'maven'
		env.PATH = "${mvnHome}/bin:${env.PATH}"
	  }
    }
   
    stage('Pull') {
        checkout scm
    }

    stage('Build') {
        sh "chmod +x mvnw"
        sh "mvn clean"
    }

    stage('Junit') {
	  step{
        try {
            sh "mvn test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
	  }	
    }
	
	stage('Static Code analysis'){
       withSonarQubeEnv {
        sh "mvn sonar:sonar"
       }
    }

    stage('Frontend test') {
	    step {
            sh "mvn com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v6.11.1 -DyarnVersion=v0.27.5"
            sh "mvn com.github.eirslett:frontend-maven-plugin:yarn"
            sh "mvn com.github.eirslett:frontend-maven-plugin:bower"
		}
		step{
			try {
				sh "mvn com.github.eirslett:frontend-maven-plugin:gulp -Dfrontend.gulp.arguments=test"
			} catch(err) {
				throw err
			} finally {
				junit '**/target/test-results/karma/TESTS-*.xml'
			}
		}
    }

   stage('package') {
		 sh "mvn package -Pprod -DskipTests docker:build -DpushImage -DdockerImageTags=${params.ReleaseVersion}"
		 archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
	}
	
	
	stage('publish'){
	nexusArtifactUploader artifacts: [[artifactId: 'app', classifier: '', file: 'target/shopping-app-1.0.0.war', type: 'war']], credentialsId: 'nexus3', groupId: 'shopping', nexusUrl: 'cape-test.southeastasia.cloudapp.azure.com:8081', nexusVersion: 'nexus3', protocol: 'http', repository: 'Nexus', version: "${params.ReleaseVersion}"
	} 
   

}
