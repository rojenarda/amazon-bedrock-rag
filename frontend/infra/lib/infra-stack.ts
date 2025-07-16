import {
  Stack,
  StackProps,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_wafv2 as wafv2,
  RemovalPolicy,
  CfnOutput,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create S3 bucket for static hosting
    const websiteBucket = new s3.Bucket(this, 'FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 2. Deploy static files to S3
    new s3deploy.BucketDeployment(this, 'DeployReactApp', {
      destinationBucket: websiteBucket,
      sources: [s3deploy.Source.asset('../build')],
    });

    // 3. Create WAF IP allow-list
    const ipSet = new wafv2.CfnIPSet(this, 'AllowedIPs', {
      name: 'AllowedIPs',
      scope: 'CLOUDFRONT',
      ipAddressVersion: 'IPV4',
      addresses: [
        '193.192.105.50/32',
        '104.247.178.170/32',
        '92.45.117.178/32',
        '91.93.113.79/32',
      ],
    });
    
    const waf = new wafv2.CfnWebACL(this, 'IPAllowList', {
      scope: 'CLOUDFRONT',
      defaultAction: { block: {} },
      rules: [{
        name: 'AllowCertainIPs',
        priority: 0,
        action: { allow: {} },
        statement: {
          ipSetReferenceStatement: {
            arn: ipSet.attrArn,
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: 'AllowCertainIPs',
          sampledRequestsEnabled: true,
        },
      }],
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'WAFWebACL',
        sampledRequestsEnabled: true,
      },
    });
    
    const oac = new cloudfront.CfnOriginAccessControl(this, 'OAC', {
      originAccessControlConfig: {
        name: 'FrontendOAC',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
        description: 'Access control for CloudFront to S3',
      },
    });
    
    // 4. Create CloudFront distribution
    const distribution = new cloudfront.CfnDistribution(this, 'CloudFrontDist', {
      distributionConfig: {
        enabled: true,
        defaultRootObject: 'index.html',
        origins: [{
          id: 'S3Origin',
          domainName: websiteBucket.bucketRegionalDomainName,
          s3OriginConfig: {
            originAccessIdentity: '', // leave empty for OAC
          },
          originAccessControlId: oac.attrId, // <--- attach the OAC
        }],
        defaultCacheBehavior: {
          targetOriginId: 'S3Origin',
          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: ['GET', 'HEAD'],
          cachedMethods: ['GET', 'HEAD'],
          forwardedValues: {
            queryString: false,
            cookies: { forward: 'none' },
          },
        },
        webAclId: waf.attrArn, // optional
      }
    });

    websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${websiteBucket.bucketArn}/*`],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.ref}`,
        },
      },
    }));
    

    // 5. Output URL
    new CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.attrDomainName}`,
    });
  }
}
