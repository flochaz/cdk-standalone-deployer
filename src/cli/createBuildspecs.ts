import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';

export async function createBuildspecs(
  cdkProjectPath: string,
  buildCommand: string,
  installCommand: string,
  deployCommand: string,
  destroyCommand: string,
) {
  const deployBuildspec = YAML.stringify({
    version: 0.2,
    env: {
      variables: {
        CFN_RESPONSE_URL: 'CFN_RESPONSE_URL_NOT_SET',
        CFN_STACK_ID: 'CFN_STACK_ID_NOT_SET',
        CFN_REQUEST_ID: 'CFN_REQUEST_ID_NOT_SET',
        CFN_LOGICAL_RESOURCE_ID: 'CFN_LOGICAL_RESOURCE_ID_NOT_SET',
      },
    },
    phases: {
      install: {
        'on-failure': 'ABORT',
        'runtime-versions': {
          nodejs: 14,
        },
        'commands': [installCommand],
      },
      pre_build: {
        'on-failure': 'ABORT',
        'commands': [
          'cd $CODEBUILD_SRC_DIR',
          buildCommand,
          'export AWS_ACCOUNT_ID=$(echo $CODEBUILD_BUILD_ARN | cut -d: -f5)',
          'echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"',
          'npx cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION',
        ],
      },
      build: {
        'on-failure': 'ABORT',
        'commands': [
          'export AWS_ACCOUNT_ID=$(echo $CODEBUILD_BUILD_ARN | cut -d: -f5)',
          'echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"',
          'echo "VPC ID: $VPC_ID"',
          'echo "CLOUD9_ENVIRONMENT_ID: $CLOUD9_ENVIRONMENT_ID"',
          deployCommand,
        ],
      },
    },
  });

  const destroyBuildspec = YAML.stringify({
    version: 0.2,
    env: {
      variables: {
        CFN_RESPONSE_URL: 'CFN_RESPONSE_URL_NOT_SET',
        CFN_STACK_ID: 'CFN_STACK_ID_NOT_SET',
        CFN_REQUEST_ID: 'CFN_REQUEST_ID_NOT_SET',
        CFN_LOGICAL_RESOURCE_ID: 'CFN_LOGICAL_RESOURCE_ID_NOT_SET',
      },
    },
    phases: {
      install: {
        'on-failure': 'ABORT',
        'runtime-versions': {
          nodejs: 14,
        },
        'commands': [installCommand],
      },
      pre_build: {
        'on-failure': 'ABORT',
        'commands': [
          'cd $CODEBUILD_SRC_DIR',
          buildCommand,
          'export AWS_ACCOUNT_ID=$(echo $CODEBUILD_BUILD_ARN | cut -d: -f5)',
          'echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"',
          'npx cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION',
        ],
      },
      build: {
        'on-failure': 'ABORT',
        'commands': [
          'export AWS_ACCOUNT_ID=$(echo $CODEBUILD_BUILD_ARN | cut -d: -f5)',
          'echo "AWS_ACCOUNT_ID: $AWS_ACCOUNT_ID"',
          'echo "VPC ID: $VPC_ID"',
          'echo "CLOUD9_ENVIRONMENT_ID: $CLOUD9_ENVIRONMENT_ID"',
          destroyCommand,
        ],
      },
    },
  });
  await fs.writeFileSync(path.join(cdkProjectPath, 'buildspec-deploy.yml'), deployBuildspec);
  await fs.writeFileSync(path.join(cdkProjectPath, 'buildspec-destroy.yml'), destroyBuildspec);
}