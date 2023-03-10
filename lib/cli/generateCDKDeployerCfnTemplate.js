"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCDKStandaloneDeployerCfnTemplate = void 0;
const cdk = require("aws-cdk-lib");
const cdk_standalone_deployer_1 = require("../construct/cdk-standalone-deployer");
const createBuildspecs_1 = require("./createBuildspecs");
async function generateCDKStandaloneDeployerCfnTemplate(options) {
    const deployer = new cdk.App();
    const buildspecs = createBuildspecs_1.createBuildspecs(options);
    const deployerStack = new cdk_standalone_deployer_1.CdkStandaloneDeployer(deployer, {
        githubRepository: options.githubRepoName,
        gitBranch: options.githubRepoBranch,
        cdkAppLocation: options.cdkAppSourceCodeZipName ? '' : options.cdkProjectPath,
        stackName: options.stackName,
        deployBuildSpec: buildspecs.deployBuildspec,
        destroyBuildSpec: buildspecs.destroyBuildspec,
        cdkQualifier: options.cdkQualifier,
        cdkAppSourceCodeZipName: options.cdkAppSourceCodeZipName,
        cdkParameters: options.cdkParameters ? parseCDKParameters(options.cdkParameters) : undefined,
        enableDocker: options.enableDocker,
    });
    const synth = deployer.synth();
    return JSON.stringify(synth.getStackArtifact(deployerStack.artifactId).template);
}
exports.generateCDKStandaloneDeployerCfnTemplate = generateCDKStandaloneDeployerCfnTemplate;
function parseCDKParameters(cdkParameters) {
    const result = {};
    for (const cdkParameter of cdkParameters) {
        if (!cdkParameter.includes('=')) {
            throw new Error(`Invalid CDK parameter ${cdkParameter}. It should be in the form of name=value`);
        }
        const [name, value] = cdkParameter.split('=');
        if (!name || !value) {
            throw new Error(`Invalid CDK parameter ${cdkParameter}. It should be in the form of name=value`);
        }
        result[name] = {
            type: 'String',
            default: value,
        };
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVDREtEZXBsb3llckNmblRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaS9nZW5lcmF0ZUNES0RlcGxveWVyQ2ZuVGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLGtGQUE2RTtBQUM3RSx5REFBc0Q7QUFFL0MsS0FBSyxVQUFVLHdDQUF3QyxDQUFDLE9BQVk7SUFDekUsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFFL0IsTUFBTSxVQUFVLEdBQUcsbUNBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0MsTUFBTSxhQUFhLEdBQUcsSUFBSSwrQ0FBcUIsQ0FBQyxRQUFRLEVBQUU7UUFDeEQsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGNBQWM7UUFDeEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0I7UUFDbkMsY0FBYyxFQUFFLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYztRQUM3RSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7UUFDNUIsZUFBZSxFQUFFLFVBQVUsQ0FBQyxlQUFlO1FBQzNDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0I7UUFDN0MsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZO1FBQ2xDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyx1QkFBdUI7UUFDeEQsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztRQUM1RixZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVk7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRS9CLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFwQkQsNEZBb0JDO0FBQ0QsU0FBUyxrQkFBa0IsQ0FBQyxhQUF1QjtJQUNqRCxNQUFNLE1BQU0sR0FBOEMsRUFBRSxDQUFDO0lBQzdELEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxFQUFFO1FBQ3hDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLFlBQVksMENBQTBDLENBQUMsQ0FBQztTQUNsRztRQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLFlBQVksMENBQTBDLENBQUMsQ0FBQztTQUNsRztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRztZQUNiLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLEtBQUs7U0FDZixDQUFDO0tBQ0g7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENka1N0YW5kYWxvbmVEZXBsb3llciB9IGZyb20gJy4uL2NvbnN0cnVjdC9jZGstc3RhbmRhbG9uZS1kZXBsb3llcic7XG5pbXBvcnQgeyBjcmVhdGVCdWlsZHNwZWNzIH0gZnJvbSAnLi9jcmVhdGVCdWlsZHNwZWNzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlQ0RLU3RhbmRhbG9uZURlcGxveWVyQ2ZuVGVtcGxhdGUob3B0aW9uczogYW55KSB7XG4gIGNvbnN0IGRlcGxveWVyID0gbmV3IGNkay5BcHAoKTtcblxuICBjb25zdCBidWlsZHNwZWNzID0gY3JlYXRlQnVpbGRzcGVjcyhvcHRpb25zKTtcbiAgY29uc3QgZGVwbG95ZXJTdGFjayA9IG5ldyBDZGtTdGFuZGFsb25lRGVwbG95ZXIoZGVwbG95ZXIsIHtcbiAgICBnaXRodWJSZXBvc2l0b3J5OiBvcHRpb25zLmdpdGh1YlJlcG9OYW1lLFxuICAgIGdpdEJyYW5jaDogb3B0aW9ucy5naXRodWJSZXBvQnJhbmNoLFxuICAgIGNka0FwcExvY2F0aW9uOiBvcHRpb25zLmNka0FwcFNvdXJjZUNvZGVaaXBOYW1lID8gJycgOiBvcHRpb25zLmNka1Byb2plY3RQYXRoLFxuICAgIHN0YWNrTmFtZTogb3B0aW9ucy5zdGFja05hbWUsXG4gICAgZGVwbG95QnVpbGRTcGVjOiBidWlsZHNwZWNzLmRlcGxveUJ1aWxkc3BlYyxcbiAgICBkZXN0cm95QnVpbGRTcGVjOiBidWlsZHNwZWNzLmRlc3Ryb3lCdWlsZHNwZWMsXG4gICAgY2RrUXVhbGlmaWVyOiBvcHRpb25zLmNka1F1YWxpZmllcixcbiAgICBjZGtBcHBTb3VyY2VDb2RlWmlwTmFtZTogb3B0aW9ucy5jZGtBcHBTb3VyY2VDb2RlWmlwTmFtZSxcbiAgICBjZGtQYXJhbWV0ZXJzOiBvcHRpb25zLmNka1BhcmFtZXRlcnMgPyBwYXJzZUNES1BhcmFtZXRlcnMob3B0aW9ucy5jZGtQYXJhbWV0ZXJzKSA6IHVuZGVmaW5lZCxcbiAgICBlbmFibGVEb2NrZXI6IG9wdGlvbnMuZW5hYmxlRG9ja2VyLFxuICB9KTtcblxuICBjb25zdCBzeW50aCA9IGRlcGxveWVyLnN5bnRoKCk7XG5cbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN5bnRoLmdldFN0YWNrQXJ0aWZhY3QoZGVwbG95ZXJTdGFjay5hcnRpZmFjdElkKS50ZW1wbGF0ZSk7XG59XG5mdW5jdGlvbiBwYXJzZUNES1BhcmFtZXRlcnMoY2RrUGFyYW1ldGVyczogW3N0cmluZ10pOiB7IFtuYW1lOiBzdHJpbmddOiBjZGsuQ2ZuUGFyYW1ldGVyUHJvcHMgfSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHJlc3VsdDogeyBbbmFtZTogc3RyaW5nXTogY2RrLkNmblBhcmFtZXRlclByb3BzIH0gPSB7fTtcbiAgZm9yIChjb25zdCBjZGtQYXJhbWV0ZXIgb2YgY2RrUGFyYW1ldGVycykge1xuICAgIGlmICghY2RrUGFyYW1ldGVyLmluY2x1ZGVzKCc9JykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBDREsgcGFyYW1ldGVyICR7Y2RrUGFyYW1ldGVyfS4gSXQgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIG5hbWU9dmFsdWVgKTtcbiAgICB9XG4gICAgY29uc3QgW25hbWUsIHZhbHVlXSA9IGNka1BhcmFtZXRlci5zcGxpdCgnPScpO1xuICAgIGlmICghbmFtZSB8fCAhdmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBDREsgcGFyYW1ldGVyICR7Y2RrUGFyYW1ldGVyfS4gSXQgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIG5hbWU9dmFsdWVgKTtcbiAgICB9XG4gICAgcmVzdWx0W25hbWVdID0ge1xuICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICBkZWZhdWx0OiB2YWx1ZSxcbiAgICB9O1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbiJdfQ==