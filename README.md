# CDK App deployer

This Command Line Interface (CLI) enables to easily create click to deploy link of an AWS CDK app code hosted on Github such as:  [![click-to-deploy](https://img.shields.io/badge/Click%20to-CDK%20Deploy-blue)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=cdkDeployer&templateURL=https://cdk-depl-aws-samples-aws-cdk-examples-master-9xf.s3.amazonaws.com/cdk-standalone-deployer-cfn-template.json)

If you follow this link, it will deploy the example contains in the [aws-samples/aws-cdk-examples](https://github.com/aws-samples/aws-cdk-examples/tree/master/python/lambda-layer) repo `typescript/lambda-layer` folder (which consist of a simple Lambda layer CDK app) into your AWS account.

The CLI will take your CDK app repository name and public S3 bucket to publish the Deployer stack to. It will then synthesize and publish the template with the right configuration without any modification of your code.

This tool is leveraging the [CDKStandaloneDeployer construct](https://constructs.dev/packages/cdk-standalone-deployer/v/0.0.9/api/CdkStandaloneDeployer) which will create a Cloud Formation template starting an AWS Code Build project which will run a `cdk bootstrap` and `cdk deploy` from the given source (being either a zip in an S3 bucket or a github repository). For details about the available properties, please refer to the [CDKStandaloneDeployer construct API documentation](API.md).

### Getting started example

Assuming you are the owner of the [aws-samples/aws-cdk-examples](https://github.com/aws-samples/aws-cdk-examples) and you want to create a click to deploy link, you just have to run the following command:
```bash
npx cdk-standalone-deployer -github-repo-name aws-samples/aws-cdk-examples --cdk-project-path typescript/lambda-layer --github-repo-branch master --public-read --install-command "npm install" --build-command "npm run build"

Check access permissions ...
Access granted !
Generating the deployer stack ...
Generating deployer for https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/lambda-layer CDK app ...
CDK Deployer CloudFormation template generated. Uploading it to S3 ...
Uploading CDK Deployer CloudFormation template to S3 bucket cdk-depl-aws-samples-aws-cdk-examples-master-9xf/cdk-standalone-deployer-cfn-template.json ...
You can now add the following markdown to your README.md : [![click-to-deploy](https://img.shields.io/badge/Click%20to-CDK%20Deploy-blue)](https://console.aws.amazon.com/cloudformation/home#/stacks/new?stackName=cdkDeployer&templateURL=https://cdk-depl-aws-samples-aws-cdk-examples-master-9xf.s3.amazonaws.com/cdk-standalone-deployer-cfn-template.json)
```

The CLI will
1. Check your AWS credentials
1. Generate the CDK Deployer CloudFormation template
1. Upload it to the S3 bucket `cdk-depl-aws-samples-aws-cdk-examples-master-9xf`
1. Print the markdown to add to your README.md

Your customer can then just click on the link and deploy your CDK app in their AWS account.


### Usage

#### Prerequisite

You need to have AWS credentials exported in your environment. You can do so by running `aws configure` or by exporting the following environment variables:

```bash
export AWS_ACCESS_KEY_ID=XXXX
export AWS_SECRET_ACCESS_KEY=XXXX
export AWS_SESSION_TOKEN=XXXX
```

A minimal set of permissions has to be associated with your credentials to be able to:
* Create an S3 bucket (if bucket not provided)
* Put an object to the S3 bucket
* Get caller identity (to check crendentials validity)

The following policy will do the trick:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CDKDeployerCLIPermissions",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:CreateBucket",
                "sts:GetCallerIdentity",
            ],
            "Resource": "*"
        }
    ]
}
```


#### All options

```
npx cdk-standalone-deployer --help

Usage: cli [options]

A simple tool to make your CDK app deployable through a click to deploy button. 
 
 Prerequisite : Export AWS credentials !

Options:
  --github-repo-name <string>        Name of the repo example: "aws-samples/aws-cdk-examples"
  --s3-bucket-name <string>          S3 bucket to use to upload the CDK Deployer stack and potentially the
                                     zip file. If not provided, one will be created for you after approval.
  --s3-key-prefix <string>           S3 key prefix to use to upload the CDK Deployer stack and potentially
                                     the zip file
  --s3-bucket-region <string>        S3 bucket region to use to upload the CDK Deployer stack and
                                     potentially the zip file (default: "us-east-1")
  --public-read                      Make the S3 bucket public read (default: false)
  --github-repo-branch <string>      Branch to use (default: "main")
  --cdk-project-path <string>        Path to the cdk app (default: "./")
  --stack-name <string>              Name of the stack to deploy
  --deploy-buildspec-name <string>   Name of the buildspec available in the cdk app to deploy the stack.
                                     (Required if --destroy-buildspec-name is provided)
  --destroy-buildspec-name <string>  Name of the buildspec available in the cdk app to destroy the stack.
                                     (Required if --deploy-buildspec-name is provided)
  --install-command <string>         Command to run to install dependencies
  --build-command <string>           Command to run to build the cdk app
  --bootstrap-command <string>       Command to run to build the cdk app (default: "npx cdk bootstrap
                                     --qualifier $CDK_QUALIFIER --toolkit-stack-name
                                     CDKToolkit-$CDK_QUALIFIER")
  --deploy-command <string>          Command to run to deploy the cdk app (default: "npx cdk deploy
                                     $PARAMETERS --all --require-approval never -c
                                     @aws-cdk/core:bootstrapQualifier=$CDK_QUALIFIER")
  --destroy-command <string>         Command to run to destroy the cdk app (default: "npx cdk destroy --all
                                     --force -c @aws-cdk/core:bootstrapQualifier=$CDK_QUALIFIER")
  --cdk-qualifier <string>           CDK qualifier to use (default: "deployer")
  --cdk-parameters [pair...]         add an entry (or several separated by a space) key=value that will be
                                     passed to the cdk app through context (--context)
  -h, --help                         display help for command
```

#### BuildSpec focus

As mentionned before the CDKStandaloneDeployer construct rely on [AWS CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html). It provides default install/build/bootstrap/deploy/destroy command but you can as well specify your own.

To do so, you have 2 options: 
* if you have a deploy and destroy buildspec yaml file already existing in your CDK app repository, you can use them by specify `--deploy-buildspec-name` and `--destroy-buildspec-name` options.
* Or you an specify the install/build/bootstrap/deploy/destroy command using `--install-command`, `--build-command`, `--bootstrap-command`, `--deploy-command` and `--destroy-command`. Only `--install-command` is required then.


#### CDK parameters

You can also pass parameters to your CDK app through context using the `--cdk-parameters` option. It takes a list of key=value pair separated by a space. Those parameters will be then customizable by the user when deploying the stack through the AWS CloudFormation Console.

## TODO

- [ ] Add integ test for S3 source
- [ ] Add integ test for custom buildspec
- [ ] add CLI option for auto publish of s3 source

## Credits

This package is largely inspired by @pahud work (https://github.com/pahud/lambda-url-demo)