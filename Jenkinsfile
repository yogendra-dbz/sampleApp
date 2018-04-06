#!/usr/bin/env groovy

node {
    stage('Preparation') {
	  tool name: 'jdk8', type: 'jdk'
	  tool name: 'maven', type: 'maven'
	  def mvnHome = tool 'maven'
	  env.PATH = "${mvnHome}/bin:${env.PATH}"
	}
   
    stage('Pull') {
        checkout scm
    }

    stage('Build') {
        sh "chmod +x mvnw"
        sh "mvn clean"
    }

    stage('Junit') {
	    try {
            sh "mvn test"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/surefire-reports/TEST-*.xml'
        }
	}
	
	stage('Static Code analysis'){
       withSonarQubeEnv {
        sh "mvn sonar:sonar"
       }
    }

    stage('Frontend test') {
		try {
			sh "mvn com.github.eirslett:frontend-maven-plugin:install-node-and-yarn -DnodeVersion=v6.11.1 -DyarnVersion=v0.27.5"
			sh "mvn com.github.eirslett:frontend-maven-plugin:yarn"
			sh "mvn com.github.eirslett:frontend-maven-plugin:bower"
			sh "mvn com.github.eirslett:frontend-maven-plugin:gulp -Dfrontend.gulp.arguments=test"
		} catch(err) {
			throw err
		} finally {
			junit '**/target/test-results/karma/TESTS-*.xml'
		}
		
    }

   stage('package') {
		 sh "mvn package -Pprod -DskipTests docker:build -DpushImage -DdockerImageTags=${params.ReleaseVersion}"
		 archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
	}
	
	
    stage('publish'){
	nexusArtifactUploader artifacts: [[artifactId: 'app', classifier: '', file: 'target/shopping-app-1.0.0.war', type: 'war']], credentialsId: 'nexus3', groupId: 'shopping', nexusUrl: 'cape-test.southeastasia.cloudapp.azure.com:8081', nexusVersion: 'nexus3', protocol: 'http', repository: 'Nexus', version: "${params.ReleaseVersion}"
    }
	
    stage ('deploy'){
        try {
		input message: 'New deployment?', ok: 'Deploy'
		Deploy = true
	} catch (err) {
		slackSend channel: '#ci', color: 'warning', message: "Deployment Discarded: ${env.JOB_NAME} - ${env.BUILD_NUMBER} ()"
		Deploy = false
		currentBuild.result = 'UNSTABLE'
	}
	
	if (Deploy){
		// Output Ansible-playbook version
		sh "ansible-playbook --version"
		
		// Run Ansible play book			
		sh "set +e;ansible-playbook -i hosts /opt/ansible/shoppingcart/update_swarm_cluster.yml --extra-vars 'release=${params.ReleaseVersion}'; echo \$? > swarmRollingUpdateStatus"
	
		def swarmRollingUpdateExitCode = readFile('swarmRollingUpdateStatus').trim()
		echo "Ansible Exit Code: ${swarmRollingUpdateExitCode}"
		
		if (swarmRollingUpdateExitCode == "0") {
			currentBuild.result = 'SUCCESS'
		}else{
			slackSend channel: '#ci', color: '#0080ff', message: "Docker Swarm Rolling update failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} ()"
			currentBuild.result = 'FAILURE'
		}
	    }

   }
	
   stage('Performance Testing'){
     try {
		input message: 'Perf Test?', ok: 'Run'
		Run = true
	} catch (err) {
		slackSend channel: '#ci', color: 'warning', message: "Perf Test Discarded: ${env.JOB_NAME} - ${env.BUILD_NUMBER} ()"
		Run = false
		currentBuild.result = 'SUCCESS'
	}
	
	if(Run){
	   try {
	   sh "mvn gatling:execute"
	   gatlingArchive()
	   currentBuild.result = 'SUCCESS'
	   } catch (err) {
		slackSend channel: '#ci', color: 'warning', message: "Deployment Discarded: ${env.JOB_NAME} - ${env.BUILD_NUMBER} ()"
		Deploy = false
		currentBuild.result = 'UNSTABLE'
	  }
	}   
     }
		
 }
