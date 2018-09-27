# Overview

This is a CLI tool to simplify the AWS SAM CLI with Javascript. One line command to make a bucket if not exist, merge multiple cloudformation template files, packaging, deploy and create the cloudformation stack.

# Why necessary 

The [SAM CLI](https://github.com/awslabs/aws-sam-cli) is a great tool especially for packaging and deploying multiple lambda functions simultaneously. 
The SAM CLI could be much better because this simple-sam-cli...

- Merges multiple cloudformation template files to one file for the SAM CLI to make a package. 
- Deploys with the smaller size of package by deleting the dev dependencies and aws-sdk dependency. After deployment, the dependencies are recovered automatically.
- Records the user configuration in the package.json so you don't have to provide the configuration over and over again.
- Provides all-in-one command.

# Installation

## Prerequisite

Make sure the [SAM CLI](https://github.com/awslabs/aws-sam-cli) is installed.

## installation

```
npm install -g simple-sam-cli
```

# How to use

In the Javascript SAM project, use the following commands.

## simple-sam-cli prepare

This command creates an S3 bucket for deployment if it doesn't exist. If exists, it doesn't create but the configuration is recorded in the package.json

```
$ simple-sam-cli prepare -b <bucket-name> -r <region>
```

The example is

```
$ simple-sam-cli prepare -b my-unique-bucket-1234 -r us-east-1
```

## simple-sam-cli build

This is to minimize the package and merge multiple template files. It creates the ./build folder and assets are copied there.

```
$ simple-sam-cli build -cf <cloudformation-templates-folder> -sf <source-folder> 
```

The example is

```
$ simple-sam-cli build -cf cloudformation -sf src
```

for the project which has the following folder structure.

```
Project Root
|- cloudformation - master.yml
|              |- resources - resource1.yml, resource2.yml
|              |- parameters - parameters.yml
|- src -  api - api.js
|    |- utils - utils.js
|- tst - api - api-test.js
|    |- utils - utils.js
|- package.json
```

The result of this command is

```
Project Root
|- cloudformation - master.yml
|              |- resources - resource1.yml, resource2.yml
|              |- parameters - parameters.yml
|- lambda - src -  api - api.js
|      |      |- utils - utils.js
|      |__ tst - api - api-test.js
|             |- utils - utils.js
|- package.json
|- build - merged.yml
         |- src - api - api.js
                  |- utils - utils.js
```

Once you calls this command with the -cf and -sf, you don't have to provide the configuration over and over again. Just call it without the configurations.

```
$ simple-sam-cli build
```

## simple-sam-cli deploy

This is to upload the package and create the cloudformation stack.

```
$ simple-sam-cli deploy -b <bucket-name> -s <cloud-foramtion-stack-name>
```

If you created the bucket via `simple-sam-cli prepare`, you don't need to provide the bucket name here because it reads the configuration from the package.json.

## simple-sam-cli clean

This is to get rid of the build folder.

```
$ simple-sam-cli clean
```
