module.exports = {
	AWSTemplateFormatVersion: '2010-09-09',
	Description: 'Create Cloud API Stack',
	Parameters: {},
	Conditions: {},
	Resources: {
		lambdaRestApiRole: {
			Type: 'AWS::IAM::Role',
			Properties: {
				AssumeRolePolicyDocument: {
					Version: '2012-10-17',
					Statement: [
						{
							Effect: 'Allow',
							Principal: { Service: ['lambda.amazonaws.com'] },
							Action: ['sts:AssumeRole']
						}
					]
				},
				ManagedPolicyArns: [
					'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
				]
			}
		},
		apiDistribution: {
			Type: 'AWS::CloudFront::Distribution',
			Properties: {
				DistributionConfig: {
					Origins: [
						{
							DomainName: {
								'Fn::Join': [
									{Ref: 'apiId'},
									'.execute-api.',
									{Ref: 'AWS::Region'},
									'.amazonaws.com'
								]
							},
							Id: {
								'Fn::Join': [
									{Ref: 'apiId'},
									'-',
									{Ref: 'AWS::Region'},
								]
							},
							CustomOriginConfig: {
								OriginProtocolPolicy: 'https-only',
								OriginSSLProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2']
							},
							Enabled: true,
							HttpVersion: 'http2',
							DefaultCacheBehavior: {
								TargetOriginId: {
									'Fn::Join': [
										{Ref: 'apiId'},
										'-',
										{Ref: 'AWS::Region'},
									]
								},
								ForwardedValues: {
									QueryString: true,
									Cookies: {
										Forward: 'none'
									},
									Headers: ['Origin', 'Authorization', 'Content-Type'],
									
								},
								ViewerProtocolPolicy: 'allow-all',
								AllowedMethods: ['GET'],
								Compress: true,
								DefaultTTL: 10,

							},
							PriceClass: 'PriceClass_200'
						}
					]
				}		
			}
		}
	},
	Outputs: {}
};