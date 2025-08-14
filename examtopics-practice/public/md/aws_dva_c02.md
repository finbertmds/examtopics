# Exam Topics Questions

@thatonecodes

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 99 discussion

A company has an AWS Lambda function that processes incoming requests from an Amazon API Gateway API. The API calls the Lambda function by using a Lambda alias. A developer updated the Lambda function code to handle more details related to the incoming requests. The developer wants to deploy the new Lambda function for more testing by other developers with no impact to customers that use the API.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create a new version of the Lambda function. Create a new stage on API Gateway with integration to the new Lambda version. Use the new API Gateway stage to test the Lambda function.

**B:** Update the existing Lambda alias used by API Gateway to a weighted alias. Add the new Lambda version as an additional Lambda function with a weight of 10%. Use the existing API Gateway stage for testing.

**C:** Create a new version of the Lambda function. Create and deploy a second Lambda function to filter incoming requests from API Gateway. If the filtering Lambda function detects a test request, the filtering Lambda function will invoke the new Lambda version of the code. For other requests, the filtering Lambda function will invoke the old Lambda version. Update the API Gateway API to use the filtering Lambda function.

**D:** Create a new version of the Lambda function. Create a new API Gateway API for testing purposes. Update the integration of the new API with the new Lambda version. Use the new API for testing.



**Answer: A**

**Timestamp: 2023-05-14 13:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109229-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 480 discussion

A company runs a new application on AWS Elastic Beanstalk. The company needs to deploy updates to the application. The updates must not cause any downtime for application users.

The deployment must forward a specified percentage of incoming client traffic to a new application version during an evaluation period.

Which deployment type will meet these requirements?

**A:** rolling

**B:** traffic-splitting

**C:** in-place

**D:** immutable



**Answer: B**

**Timestamp: 2024-12-13 03:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152955-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 481 discussion

A developer is making changes to a custom application that uses AWS Elastic Beanstalk.

Which solutions will update the Elastic Beanstalk environment with the new application version after the developer completes the changes? (Choose two.)

**A:** Package the application code into a zip file. Use the AWS Management Console to upload the .zip file and deploy the packaged application.

**B:** Package the application code into a .tar file. Use the AWS Management Console to create a new application version from the .tar file. Update the environment by using the AWS CLI.

**C:** Package the application code into a .tar file. Use the AWS Management Console to upload the .tar file and deploy the packaged application.

**D:** Package the application code into a .zip file. Use the AWS CL to create a new application version from the .zip file and to update the environment.

**E:** Package the application code into a .zip file. Use the AWS Management Console to create a new application version from the .zip file. Rebuild the environment by using the AWS CLI.



**Answer: AD**

**Timestamp: 2025-02-17 09:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156652-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 482 discussion

A developer needs to write an AWS CloudFormation template on a local machine and deploy a CloudFormation stack to AWS.

What must the developer do to complete these tasks?

**A:** Install the AWS CLI. Configure the AWS CLI by using an IAM user name and password.

**B:** Install the AWS CLI. Configure the AWS CLI by using an SSH key.

**C:** Install the AWS CLI, Configure the AWS CLI by using an IAM user access key and secret key.

**D:** Install an AWS software development kit (SDK). Configure the SDK by using an X.509 certificate.



**Answer: C**

**Timestamp: 2025-02-17 09:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156653-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 483 discussion

A developer is updating an Amazon API Gateway REST API to have a mock endpoint. The developer wants to update the integration request mapping template so the endpoint will respond to mock integration requests with specific HTTP status codes based on various conditions.

Which statement will meet these requirements?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: C**

**Timestamp: 2025-02-17 10:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156656-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 484 discussion

A large company has its application components distributed across multiple AWS accounts. The company needs to collect and visualize trace data across these accounts.

What should be used to meet these requirements?

**A:** AWS X-Ray

**B:** Amazon CloudWatch

**C:** Amazon VPC flow logs

**D:** Amazon OpenSearch Service



**Answer: A**

**Timestamp: 2025-02-17 09:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156654-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 511 discussion

A company is building a social media application. A developer is modifying an AWS Lambda function that updates a database with data that tracks each user's online activity. A web application server uses the AWS SDK to invoke the Lambda function.

The developer has tested the new Lambda code and is ready to deploy the code into production. However, the developer wants to allow only a small percentage of the invocations from the AWS SDK to call the new code.

Which solution will meet these requirements?

**A:** Configure a Lambda version that has a specific weight value for the updated Lambda function.

**B:** Create an alias for the Lambda function. Configure a specific weight value for the updated version.

**C:** Create an Application Load Balancer. Specify weighted target groups for the original Lambda function and the updated Lambda function.

**D:** Create a Network Load Balancer. Specify weighted target groups for the original Lambda function and the updated Lambda function.



**Answer: B**

**Timestamp: 2025-02-17 10:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156672-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 512 discussion

An Amazon Data Firehose delivery stream is receiving customer data that contains personally identifiable information. A developer needs to remove pattern-based customer identifiers from the data and store the modified data in an Amazon S3 bucket.

What should the developer do to meet these requirements?

**A:** Implement Firehose data transformation as an AWS Lambda function. Configure the function to remove the customer identifiers. Set an Amazon S3 bucket as the destination of the delivery stream.

**B:** Launch an Amazon EC2 instance. Set the EC2 instance as the destination of the delivery stream. Run an application on the EC2 instance to remove the customer identifiers. Store the transformed data in an Amazon S3 bucket.

**C:** Create an Amazon OpenSearch Service instance. Set the OpenSearch Service instance as the destination of the delivery stream. Use search and replace to remove the customer identifiers. Export the data to an Amazon S3 bucket.

**D:** Create an AWS Step Functions workflow to remove the customer identifiers. As the last step in the workflow, store the transformed data in an Amazon S3 bucket. Set the workflow as the destination of the delivery stream.



**Answer: A**

**Timestamp: 2024-12-18 04:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153149-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 513 discussion

A developer is building a three-tier web application that should be able to handle a minimum of 5000 requests per minute. Requirements state that the web tier should be completely stateless while the application maintains session state for the users.

How can session data be externalized, keeping latency at the LOWEST possible value?

**A:** Create an Amazon RDS instance, then implement session handling at the application level to leverage a database inside the RDS database instance for session data storage.

**B:** Implement a shared file system solution across the underlying Amazon EC2 instances, then implement session handling at the application level to leverage the shared file system for session data storage.

**C:** Create an Amazon ElastiCache (Memcached) cluster, then implement session handling at the application level to leverage the cluster for session data storage.

**D:** Create an Amazon DynamoDB table, then implement session handling at the application level to leverage the table for session data storage.



**Answer: C**

**Timestamp: 2025-02-17 10:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156673-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 514 discussion

A developer has deployed an AWS Lambda function that is subscribed to an Amazon Simple Notification Service (Amazon SNS) topic. The developer must implement a solution to add a record of each Lambda function invocation to an Amazon Simple Queue Service (Amazon SQS) queue.

Which solution will meet this requirement?

**A:** Configure the SQS queue as a dead-letter queue for the Lambda function.

**B:** Create code that uses the AWS SDK to call the SQS SendMessage operation to add the invocation details to the SQS queue. Add the code to the end of the Lambda function.

**C:** Add two asynchronous invocation destinations to the Lambda function: one destination for successful invocations and one destination for failed invocations. Configure the SQS queue as the destination for each type. Create an Amazon CloudWatch alarm based on the DestinationDeliveryFailures metric to catch any message that cannot be delivered.

**D:** Add a single asynchronous invocation destination to the Lambda function to capture successful invocations. Configure the SQS queue as the destination. Create an Amazon CloudWatch alarm based on the DestinationDeliveryFailures metric to catch any message that cannot be delivered.



**Answer: B**

**Timestamp: 2024-12-10 05:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152781-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 515 discussion

An AWS Lambda function that handles application requests uses the default Lambda logging mechanism to log the timestamp, processing time, and status of requests.

A developer needs to create Amazon CloudWatch metrics based on the logs. The developer needs to write the metrics to a custom CloudWatch metrics namespace.

Which solution will meet these requirements?

**A:** Use Amazon CloudWatch Logs Insights to generate custom metrics from the logs by using CloudWatch embedded metric format (EMF).

**B:** Use Amazon CloudWatch RUM to generate custom metrics from the logs by using CloudWatch embedded metric format (EMF).

**C:** Use Amazon CloudWatch Logs Insights to generate custom metrics from the logs by using JSON format.

**D:** Use the CloudWatch embedded metric format (EMF) for the structure of the log statements to generate custom CloudWatch metrics.



**Answer: D**

**Timestamp: 2025-02-17 10:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156674-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 405 discussion

A developer uses an AWS Lambda function in an application to edit users' uploaded photos. The developer needs to update the Lambda function code and needs to test the updates.

For testing, the developer must divide the user traffic between the original version of the Lambda function and the new version of the Lambda function.

Which combination of steps will meet these requirements? (Choose two.)

**A:** Publish a version of the original Lambda function. Make the necessary changes to the Lambda code. Publish a new version of the Lambda function.

**B:** Use AWS CodeBuild to detect updates to the Lambda function. Configure CodeBuild to incrementally shift traffic from the original version of the Lambda function to the new version of the Lambda function.

**C:** Update the original version of the Lambda function to add a function URL. Make the necessary changes to the Lambda code. Publish another function URL for the updated Lambda code.

**D:** Create an alias that points to the original version of the Lambda function. Configure the alias to be a weighted alias that also includes the new version of the Lambda function. Divide traffic between the two versions.

**E:** Create an alias that points to the original function URL. Configure the alias to be a weighted alias that also includes the additional function URL. Divide traffic between the two function URLs.



**Answer: AD**

**Timestamp: 2024-07-29 08:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144673-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 406 discussion

A company had an Amazon RDS for MySQL DB instance that was named mysql-db. The DB instance was deleted within the past 90 days.

A developer needs to find which IAM user or role deleted the DB instance in the AWS environment.

Which solution will provide this information?

**A:** Retrieve the AWS CloudTrail events for the resource mysql-db where the event name is DeleteDBInstance. Inspect each event.

**B:** Retrieve the Amazon CloudWatch log events from the most recent log stream within the rds/mysql-db log group. Inspect the log events.

**C:** Retrieve the AWS X-Ray trace summaries. Filter by services with the name mysql-db. Inspect the ErrorRootCauses values within each summary.

**D:** Retrieve the AWS Systems Manager deletions inventory. Filter the inventory by deletions that have a TypeName value of RDS. Inspect the deletion details.



**Answer: A**

**Timestamp: 2024-07-23 20:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144456-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 407 discussion

A company has an ecommerce web application that uses an on-premises MySQL database as a data store. The company migrates the on-premises MySQL database to Amazon RDS for MySQL.

A developer needs to configure the application's access to the RDS for MySQL database. The developer's solution must not use long term credentials.

Which solution will meet these requirements?

**A:** Enable IAM database authentication on the RDS for MySQL DB instance. Create an IAM role that has the minimum required permissions. Assign the role to the application.

**B:** Store the MySQL credentials as secrets in AWS Secrets Manager. Create an IAM role that has the minimum required permissions to retrieve the secrets. Assign the role to the application.

**C:** Configure the MySQL credentials as environment variables that are available at runtime for the application.

**D:** Store the MySQL credentials as SecureString parameters in AWS Systems Manager Parameter Store. Create an IAM role that has the minimum required permissions to retrieve the parameters. Assign the role to the application.



**Answer: A**

**Timestamp: 2024-07-21 03:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144295-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 408 discussion

A developer is creating an application that must transfer expired items from Amazon DynamoDB to Amazon S3. The developer sets up the DynamoDB table to automatically delete items after a specific TTL. The application must process the items in DynamoDB and then must store the expired items in Amazon S3. The entire process, including item processing and storage in Amazon S3, will take 5 minutes.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Configure DynamoDB Accelerator (DAX) to query for expired items based on the TTL. Save the results to Amazon S3.

**B:** Configure DynamoDB Streams to invoke an AWS Lambda function. Program the Lambda function to process the items and to store the expired items in Amazon S3.

**C:** Deploy a custom application on an Amazon Elastic Container Service (Amazon ECS) cluster on Amazon EC2 instances. Program the custom application to process the items and to store the expired items in Amazon S3.

**D:** Create an Amazon EventBridge rule to invoke an AWS Lambda function. Program the Lambda function to process the items and to store the expired items in Amazon S3.



**Answer: B**

**Timestamp: 2024-07-16 03:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143936-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 409 discussion

A developer has an application that uses WebSocket APIs in Amazon API Gateway. The developer wants to use an API Gateway Lambda authorizer to control access to the application.

The developer needs to add credential caching and reduce repeated usage of secret keys and authorization tokens on every request.

Which combination of steps should the developer take to meet these requirements? (Choose two.)

**A:** Use a token-based Lambda authorizer.

**B:** Use a request parameter-based Lambda authorizer.

**C:** Configure an integration request mapping template to reference the context map from the APIGateway Lambda authorizer.

**D:** Configure an integration request mapping template to reference the identity API key value from the API Gateway Lambda authorizer.

**E:** Use VPC endpoint policies for the WebSocket APIs.



**Answer: AC**

**Timestamp: 2024-07-21 03:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144297-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 270 discussion

A company notices that credentials that the company uses to connect to an external software as a service (SaaS) vendor are stored in a configuration file as plaintext.

The developer needs to secure the API credentials and enforce automatic credentials rotation on a quarterly basis.

Which solution will meet these requirements MOST securely?

**A:** Use AWS Key Management Service (AWS KMS) to encrypt the configuration file. Decrypt the configuration file when users make API calls to the SaaS vendor. Enable rotation.

**B:** Retrieve temporary credentials from AWS Security Token Service (AWS STS) every 15 minutes. Use the temporary credentials when users make API calls to the SaaS vendor.

**C:** Store the credentials in AWS Secrets Manager and enable rotation. Configure the API to have Secrets Manager access.

**D:** Store the credentials in AWS Systems Manager Parameter Store and enable rotation. Retrieve the credentials when users make API calls to the SaaS vendor.



**Answer: C**

**Timestamp: 2024-02-21 04:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134270-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 271 discussion

A company has an application that is hosted on Amazon EC2 instances. The application stores objects in an Amazon S3 bucket and allows users to download objects from the S3 bucket. A developer turns on S3 Block Public Access for the S3 bucket. After this change, users report errors when they attempt to download objects. The developer needs to implement a solution so that only users who are signed in to the application can access objects in the S3 bucket.

Which combination of steps will meet these requirements in the MOST secure way? (Choose two.)

**A:** Create an EC2 instance profile and role with an appropriate policy. Associate the role with the EC2 instances.

**B:** Create an IAM user with an appropriate policy. Store the access key ID and secret access key on the EC2 instances.

**C:** Modify the application to use the S3 GeneratePresignedUrl API call.

**D:** Modify the application to use the S3 GetObject API call and to return the object handle to the user.

**E:** Modify the application to delegate requests to the S3 bucket.



**Answer: AC**

**Timestamp: 2024-02-21 05:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134271-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 272 discussion

An Amazon Simple Queue Service (Amazon SQS) queue serves as an event source for an AWS Lambda function. In the SQS queue, each item corresponds to a video file that the Lambda function must convert to a smaller resolution. The Lambda function is timing out on longer video files, but the Lambda function's timeout is already configured to its maximum value.

What should a developer do to avoid the timeouts without additional code changes?

**A:** Increase the memory configuration of the Lambda function.

**B:** Increase the visibility timeout on the SQS queue.

**C:** Increase the instance size of the host that runs the Lambda function.

**D:** Use multi-threading for the conversion.



**Answer: A**

**Timestamp: 2024-02-21 05:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134272-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 273 discussion

A company is building an application on AWS. The application's backend includes an Amazon API Gateway REST API. The company's frontend application developers cannot continue work until the backend API is ready for integration. The company needs a solution that will allow the frontend application developers to continue their work.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Configure mock integrations for API Gateway API methods.

**B:** Integrate a Lambda function with API Gateway and return a mocked response.

**C:** Add new API endpoints to the API Gateway stage and returns a mocked response.

**D:** Configure a proxy resource for API Gateway API methods.



**Answer: A**

**Timestamp: 2024-02-21 05:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134273-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 274 discussion

A company is preparing to migrate an application to the company's first AWS environment. Before this migration, a developer is creating a proof-of-concept application to validate a model for building and deploying container-based applications on AWS.

Which combination of steps should the developer take to deploy the containerized proof-of-concept application with the LEAST operational effort? (Choose two.)

**A:** Package the application into a .zip file by using a command line tool. Upload the package to Amazon S3.

**B:** Package the application into a container image by using the Docker CLI. Upload the image to Amazon Elastic Container Registry (Amazon ECR).

**C:** Deploy the application to an Amazon EC2 instance by using AWS CodeDeploy.

**D:** Deploy the application to Amazon Elastic Kubernetes Service (Amazon EKS) on AWS Fargate.

**E:** Deploy the application to Amazon Elastic Container Service (Amazon ECS) on AWS Fargate.



**Answer: BE**

**Timestamp: 2024-02-21 05:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134274-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 388 discussion

A company has an application that receives batches of orders from partners every day. The application uses an AWS Lambda function to process the batches.

If a batch contains no orders, the Lambda function must publish to an Amazon Simple Notification Service (Amazon SNS) topic as soon as possible.

Which combination of steps will meet this requirement with the LEAST implementation effort? (Choose two.)

**A:** Update the existing Lambda function's code to send an Amazon CloudWatch custom metric for the number of orders in a batch for each partner.

**B:** Create a new Lambda function as an Amazon Kinesis data stream consumer. Configure the new Lambda function to track orders and to publish to the SNS topic when a batch contains no orders.

**C:** Set up an Amazon CloudWatch alarm that will send a notification to the SNS topic when the value of the custom metric is 0.

**D:** Schedule a new Lambda function to analyze Amazon CloudWatch metrics every 24 hours to identify batches that contain no orders. Configure the Lambda function to publish to the SNS topic.

**E:** Modify the existing Lambda function to log orders to an Amazon Kinesis data stream.



**Answer: AC**

**Timestamp: 2024-07-12 15:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143799-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 423 discussion

A development team wants to immediately build and deploy an application whenever there is a change to the source code.

Which approaches could be used to trigger the deployment? (Choose two.)

**A:** Store the source code in an Amazon S3 bucket. Configure AWS CodePipeline to start whenever a file in the bucket changes.

**B:** Store the source code in an encrypted Amazon EBS volume. Configure AWS CodePipeline to start whenever a file in the volume changes.

**C:** Store the source code in an AWS CodeCommit repository. Configure AWS CodePipeline to start whenever a change is committed to the repository.

**D:** Store the source code in an Amazon S3 bucket. Configure AWS CodePipeline to start every 15 minutes.

**E:** Store the source code in an Amazon EC2 instance’s ephemeral storage. Configure the instance to start AWS CodePipeline whenever there are changes to the source code.



**Answer: AC**

**Timestamp: 2024-09-03 18:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146861-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 389 discussion

A developer has an application that uses an Amazon DynamoDB table with a configured local secondary index (LSI). During application testing, the DynamoDB table metrics report a ProvisionedThroughputExceededException error message. The number of requests made by the test suite did not exceed the table's provisioned capacity limits.

What is the cause of this issue?

**A:** The data in the table's partition key column is not evenly distributed.

**B:** The LSI's capacity is different from the table's capacity.

**C:** The application is not implementing exponential backoff retry logic while interacting with the DynamoDB API.

**D:** The application has the IAM permission to query the DynamoDB table but not to query the LSI.



**Answer: A**

**Timestamp: 2024-06-29 14:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143067-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 39 discussion

A company is planning to securely manage one-time fixed license keys in AWS. The company's development team needs to access the license keys in automaton scripts that run in Amazon EC2 instances and in AWS CloudFormation stacks.
Which solution will meet these requirements MOST cost-effectively?

**A:** Amazon S3 with encrypted files prefixed with “config”

**B:** AWS Secrets Manager secrets with a tag that is named SecretString

**C:** AWS Systems Manager Parameter Store SecureString parameters

**D:** CloudFormation NoEcho parameters



**Answer: C**

**Timestamp: 2023-03-26 01:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103913-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 390 discussion

A developer manages a website that distributes its content by using Amazon CloudFront. The website's static artifacts are stored in an Amazon S3 bucket.

The developer deploys some changes and can see the new artifacts in the S3 bucket. However, the changes do not appear on the webpage that the CloudFront distribution delivers.

How should the developer resolve this issue?

**A:** Configure S3 Object Lock to update to the latest version of the files every time an S3 object is updated.

**B:** Configure the S3 bucket to clear all old objects from the bucket before new artifacts are uploaded.

**C:** Set CloudFront to invalidate the cache after the artifacts have been deployed to Amazon S3.

**D:** Set CloudFront to modify the distribution origin after the artifacts have been deployed to Amazon S3.



**Answer: C**

**Timestamp: 2024-07-12 15:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143800-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 391 discussion

A company has a development team that uses AWS CodeCommit for version control. The development team has CodeCommit repositories in multiple AWS accounts. The team is expanding to include developers who work in various locations.

The company must ensure that the developers have secure access to the repositories.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Configure IAM roles for each developer and grant access individually.

**B:** Configure permission sets in AWS IAM Identity Center to grant access to the accounts.

**C:** Share AWS access keys with the development team for direct repository access.

**D:** Use public SSH keys for authentication to the CodeCommit repositories.



**Answer: B**

**Timestamp: 2024-06-29 22:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143081-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 424 discussion

A developer is building an application integrating an Amazon API Gateway with an AWS Lambda function. When calling the API, the developer receives the following error:

Wed Nov 08 01:13:00 UTC 2017 : Method completed with status: 502

What should the developer do to resolve the error?

**A:** Change the HTTP endpoint of the API to an HTTPS endpoint.

**B:** Change the format of the payload sent to the API Gateway.

**C:** Change the format of the Lambda function response to the API call.

**D:** Change the authorization header in the API call to access the Lambda function.



**Answer: C**

**Timestamp: 2024-10-09 15:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148937-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 425 discussion

A developer is building various microservices for an application that will run on Amazon EC2 instances. The developer needs to monitor the end-to-end view of the requests between the microservices and debug any issues in the various microservices.

What should the developer do to accomplish these tasks?

**A:** Use Amazon CloudWatch to aggregate the microservices' logs and metrics, and build the monitoring dashboard.

**B:** Use AWS CloudTrail to aggregate the microservices' logs and metrics, and build the monitoring dashboard.

**C:** Use the AWS X-Ray SDK to add instrumentation in all the microservices, and monitor using the X-Ray service map.

**D:** Use AWS Health to monitor the health of all the microservices.



**Answer: C**

**Timestamp: 2024-10-09 15:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148938-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 426 discussion

A developer is building a microservice that uses AWS Lambda to process messages from an Amazon Simple Queue Service (Amazon SQS) standard queue. The Lambda function calls external APIs to enrich the SQS message data before loading the data into an Amazon Redshift data warehouse. The SQS queue must handle a maximum of 1,000 messages per second.

During initial testing, the Lambda function repeatedly inserted duplicate data into the Amazon Redshift table. The duplicate data led to a problem with data analysis. All duplicate messages were submitted to the queue within 1 minute of each other.

How should the developer resolve this issue?

**A:** Create an SQS FIFO queue. Enable message deduplication on the SQS FIFO queue.

**B:** Reduce the maximum Lambda concurrency that the SQS queue can invoke.

**C:** Use Lambda's temporary storage to keep track of processed message identifiers

**D:** Configure a message group ID for every sent message. Enable message deduplication on the SQS standard queue.



**Answer: A**

**Timestamp: 2024-10-10 07:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148955-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 427 discussion

A company has an application that uses an Amazon API Gateway API to invoke an AWS Lambda function. The application is latency sensitive.

A developer needs to configure the Lambda function to reduce the cold start time that is associated with default scaling.

What should the developer do to meet these requirements?

**A:** Publish a new version of the Lambda function. Configure provisioned concurrency. Set the provisioned concurrency limit to meet the company requirements.

**B:** Increase the Lambda function's memory to the maximum amount. Increase the Lambda function's reserved concurrency limit.

**C:** Increase the reserved concurrency of the Lambda function to a number that matches the current production load.

**D:** Use Service Quotas to request an increase in the Lambda function's concurrency limit for the AWS account where the function is deployed.



**Answer: A**

**Timestamp: 2024-11-04 01:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150694-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 351 discussion

A company has an internal website that contains sensitive data. The company wants to make the website public. The company must ensure that only employees who authenticate through the company's OpenID Connect (OIDC) identity provider (IdP) can access the website. A developer needs to implement authentication without editing the website.

Which combination of steps will meet these requirements? (Choose two.)

**A:** Create a public Network Load Balancer.

**B:** Create a public Application Load Balancer.

**C:** Configure a listener for the load balancer that listens on HTTPS port 443. Add a default authenticate action providing the OIDC IdP configuration.

**D:** Configure a listener for the load balancer that listens on HTTP port 80. Add a default authenticate action providing the OIDC IdP configuration.

**E:** Configure a listener for the load balancer that listens on HTTPS port 443. Add a default AWS Lambda action providing an Amazon Resource Name (ARN) to a Lambda authentication function.



**Answer: BC**

**Timestamp: 2024-03-23 04:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136972-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 352 discussion

A developer is working on a web application that requires selective activation of specific features. The developer wants to keep the features hidden from end users until the features are ready for public access.

Which solution will meet these requirements?

**A:** Create a feature flag configuration profile in AWS AppSync. Store the feature flag values in the configuration profile. Activate and deactivate feature flags as needed.

**B:** Store prerelease data in an Amazon DynamoDB table. Enable Amazon DynamoDB Streams in the table. Toggle between hidden and visible states by using DynamoDB Streams.

**C:** Create a feature flag configuration profile in AWS AppConfig. Store the feature flag values in the configuration profile. Activate and deactivate feature flags as needed.

**D:** Store prerelease data in AWS Amplify DataStore. Toggle between hidden and visible states by using Amplify DataStore cloud synchronization.



**Answer: C**

**Timestamp: 2024-03-23 04:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136973-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 353 discussion

A developer at a company writes an AWS CloudFormation template. The template refers to subnets that were created by a separate AWS CloudFormation template that the company's network team wrote. When the developer attempts to launch the stack for the first time, the launch fails.

Which template coding mistakes could have caused this failure? (Choose two.)

**A:** The developer's template does not use the Ref intrinsic function to refer to the subnets.

**B:** The developer's template does not use the ImportValue intrinsic function to refer to the subnets.

**C:** The Mappings section of the developer's template does not refer to the subnets.

**D:** The network team's template does not export the subnets in the Outputs section.

**E:** The network team's template does not export the subnets in the Mappings section.



**Answer: BD**

**Timestamp: 2024-05-05 08:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/140014-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 354 discussion

A developer is running an application on an Amazon EC2 instance. When the application tries to read an Amazon S3 bucket, the application fails. The developer notices that the associated IAM role is missing the S3 read permission. The developer needs to give the application the ability to read the S3 bucket.

Which solution will meet this requirement with the LEAST application disruption?

**A:** Add the permission to the role. Terminate the existing EC2 instance. Launch a new EC2 instance.

**B:** Add the permission to the role so that the change will take effect automatically.

**C:** Add the permission to the role. Hibernate and restart the existing EC2 instance.

**D:** Add the permission to the S3 bucket. Restart the EC2 instance.



**Answer: B**

**Timestamp: 2024-05-05 08:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/140015-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 355 discussion

A developer is writing a web application that is deployed on Amazon EC2 instances behind an internet-facing Application Load Balancer (ALB). The developer must add an Amazon CloudFront distribution in front of the ALB. The developer also must ensure that customer data from outside the VPC is encrypted in transit.

Which combination of CloudFront configuration settings should the developer use to meet these requirements? (Choose two.)

**A:** Restrict viewer access by using signed URLs.

**B:** Set the Origin Protocol Policy setting to Match Viewer.

**C:** Enable field-level encryption.

**D:** Enable automatic object compression.

**E:** Set the Viewer Protocol Policy setting to Redirect HTTP to HTTPS.



**Answer: BE**

**Timestamp: 2024-03-23 05:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136974-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 49 discussion

A developer has written the following IAM policy to provide access to an Amazon S3 bucket:
//IMG//

Which access does the policy allow regarding the s3:GetObject and s3:PutObject actions?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image3.png

**A:** Access on all buckets except the “DOC-EXAMPLE-BUCKET” bucket

**B:** Access on all buckets that start with “DOC-EXAMPLE-BUCKET” except the “DOC-EXAMPLE-BUCKET/secrets” bucket

**C:** Access on all objects in the “DOC-EXAMPLE-BUCKET” bucket along with access to all S3 actions for objects in the “DOC-EXAMPLE-BUCKET” bucket that start with “secrets”

**D:** Access on all objects in the “DOC-EXAMPLE-BUCKET” bucket except on objects that start with “secrets”



**Answer: D**

**Timestamp: 2023-03-26 02:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103919-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 490 discussion

A company hosts applications on premises. The on-premises servers generate audit logs that are available through an HTTP endpoint.

The company needs an automated solution to regularly ingest and store large volumes of audit data from the on-premises servers. The company also needs to perform queries on the audit data.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Export the audit logs. Upload the logs to Amazon S3. Import the logs to an Amazon RDS DB instance.

**B:** Create an AWS Lambda function to call the HTTP endpoint to fetch audit logs. Configure an Amazon EventBridge scheduled rule to invoke the Lambda function. Configure the Lambda function to push the logs to AWS CloudTrail Lake.

**C:** Use AWS DataSync to transfer audit logs to an Amazon S3 bucket. Load the logs into an Amazon S3 bucket. Use Amazon Athena to query the bucket.

**D:** Install the Amazon CloudWatch agent on the on-premises servers. Give the agent the ability to push audit logs to CloudWatch. Use CloudWatch Insights to query the logs.



**Answer: B**

**Timestamp: 2024-12-18 03:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153147-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 491 discussion

A developer is building an application that includes an AWS Lambda function that is written in .NET Core. The Lambda function’s code needs to interact with Amazon DynamoDB tables and Amazon S3 buckets. The developer must minimize the Lambda function’s deployment time and invocation duration.

Which solution will meet these requirements?

**A:** Increase the Lambda function’s memory.

**B:** Include the entire AWS SDK for .NET in the Lambda function’s deployment package.

**C:** Include only the AWS SDK for .NET modules for DynamoDB and Amazon S3 in the Lambda function’s deployment package.

**D:** Configure the Lambda function to download the AWS SDK for .NET from an S3 bucket at runtime.



**Answer: C**

**Timestamp: 2025-02-17 10:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156660-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 492 discussion

A development team has an Amazon API Gateway REST API that is backed by an AWS Lambda function.

Users have reported performance issues for the Lambda function. The development team identified the source of the issues as a cold start of the Lambda function. The development team needs to reduce the time needed for the Lambda function to initialize.

Which solution will meet this requirement?

**A:** Change the Lambda concurrency to reserved concurrency.

**B:** Increase the timeout of the Lambda function.

**C:** Increase the memory allocation of the Lambda function.

**D:** Configure provisioned concurrency for the Lambda function.



**Answer: D**

**Timestamp: 2025-02-17 10:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156661-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 493 discussion

A video streaming company has a pipe in Amazon EventBridge Pipes that uses an Amazon Simple Queue Service (Amazon SQS) queue as an event source. The pipe publishes all source events to a target EventBridge event bus. Before events are published, the pipe uses an AWS Lambda function to retrieve the stream status of each event from a database and adds the stream status to each source event.

The company wants the pipe to publish events to the event bus only if the video stream has a status of ready.

Which solution will meet these requirements?

**A:** Add a filter step to the pipe that will match on a stream status of ready.

**B:** Update the Lambda function to return only video streams that have a status of ready.

**C:** Include a filter for a status of ready in all EventBridge rules that subscribe to the event bus.

**D:** Add an input transformer to the pipe output that filters streams that have a status of ready.



**Answer: A**

**Timestamp: 2025-02-17 10:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156662-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 185 discussion

A developer has been asked to create an AWS Lambda function that is invoked any time updates are made to items in an Amazon DynamoDB table. The function has been created, and appropriate permissions have been added to the Lambda execution role. Amazon DynamoDB streams have been enabled for the table, but the function is still not being invoked.

Which option would enable DynamoDB table updates to invoke the Lambda function?

**A:** Change the StreamViewType parameter value to NEW_AND_OLD_IMAGES for the DynamoDB table.

**B:** Configure event source mapping for the Lambda function.

**C:** Map an Amazon Simple Notification Service (Amazon SNS) topic to the DynamoDB streams.

**D:** Increase the maximum runtime (timeout) setting of the Lambda function.



**Answer: B**

**Timestamp: 2023-10-06 02:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122607-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 186 discussion

A developer needs to deploy an application running on AWS Fargate using Amazon ECS. The application has environment variables that must be passed to a container for the application to initialize.

How should the environment variables be passed to the container?

**A:** Define an array that includes the environment variables under the environment parameter within the service definition.

**B:** Define an array that includes the environment variables under the environment parameter within the task definition.

**C:** Define an array that includes the environment variables under the entryPoint parameter within the task definition.

**D:** Define an array that includes the environment variables under the entryPoint parameter within the service definition.



**Answer: B**

**Timestamp: 2023-10-06 02:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122608-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 187 discussion

A development team maintains a web application by using a single AWS RDS, template. The template defines web servers and an Amazon RDS database. The team uses the CloudFormation template to deploy the CloudFormation stack to different environments.

During a recent application deployment, a developer caused the primary development database to be dropped and recreated. The result of this incident was a loss of data. The team needs to avoid accidental database deletion in the future.

Which solutions will meet these requirements? (Choose two.)

**A:** Add a CloudFormation DeletionPolicy attribute with the Retain value to the database resource.

**B:** Update the CloudFormation stack policy to prevent updates to the database.

**C:** Modify the database to use a Multi-AZ deployment.

**D:** Create a CloudFormation stack set for the web application and database deployments.

**E:** Add a CloudFormation DeletionPolicy attribute with the Retain value to the stack.



**Answer: AB**

**Timestamp: 2023-10-06 02:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122609-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 188 discussion

A developer is storing sensitive data generated by an application in Amazon S3. The developer wants to encrypt the data at rest. A company policy requires an audit trail of when the AWS Key Management Service (AWS KMS) key was used and by whom.

Which encryption option will meet these requirements?

**A:** Server-side encryption with Amazon S3 managed keys (SSE-S3)

**B:** Server-side encryption with AWS KMS managed keys (SSE-KMS)

**C:** Server-side encryption with customer-provided keys (SSE-C)

**D:** Server-side encryption with self-managed keys



**Answer: B**

**Timestamp: 2023-10-06 02:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122610-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 189 discussion

A company has an ecommerce application. To track product reviews, the company’s development team uses an Amazon DynamoDB table.

Every record includes the following:

• A Review ID, a 16-digit universally unique identifier (UUID)
• A Product ID and User ID, 16-digit UUIDs that reference other tables
• A Product Rating on a scale of 1-5
• An optional comment from the user

The table partition key is the Review ID. The most performed query against the table is to find the 10 reviews with the highest rating for a given product.

Which index will provide the FASTEST response for this query?

**A:** A global secondary index (GSI) with Product ID as the partition key and Product Rating as the sort key

**B:** A global secondary index (GSI) with Product ID as the partition key and Review ID as the sort key

**C:** A local secondary index (LSI) with Product ID as the partition key and Product Rating as the sort key

**D:** A local secondary index (LSI) with Review ID as the partition key and Product ID as the sort key



**Answer: A**

**Timestamp: 2023-10-06 02:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122611-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 28 discussion

A company hosts a client-side web application for one of its subsidiaries on Amazon S3. The web application can be accessed through Amazon CloudFront from https://www.example.com. After a successful rollout, the company wants to host three more client-side web applications for its remaining subsidiaries on three separate S3 buckets.
To achieve this goal, a developer moves all the common JavaScript files and web fonts to a central S3 bucket that serves the web applications. However, during testing, the developer notices that the browser blocks the JavaScript files and web fonts.
What should the developer do to prevent the browser from blocking the JavaScript files and web fonts?

**A:** Create four access points that allow access to the central S3 bucket. Assign an access point to each web application bucket.

**B:** Create a bucket policy that allows access to the central S3 bucket. Attach the bucket policy to the central S3 bucket

**C:** Create a cross-origin resource sharing (CORS) configuration that allows access to the central S3 bucket. Add the CORS configuration to the central S3 bucket.

**D:** Create a Content-MD5 header that provides a message integrity check for the central S3 bucket. Insert the Content-MD5 header for each web application request.



**Answer: C**

**Timestamp: 2023-03-17 09:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102902-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 280 discussion

A company has built an AWS Lambda function to convert large image files into output files that can be used in a third-party viewer application. The company recently added a new module to the function to improve the output of the generated files. However, the new module has increased the bundle size and has increased the time that is needed to deploy changes to the function code.

How can a developer increase the speed of the Lambda function deployment?

**A:** Use AWS CodeDeploy to deploy the function code.

**B:** Use Lambda layers to package and load dependencies.

**C:** Increase the memory size of the function.

**D:** Use Amazon S3 to host the function dependencies.



**Answer: B**

**Timestamp: 2024-02-21 05:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134279-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 281 discussion

A developer creates a static website for their department. The developer deploys the static assets for the website to an Amazon S3 bucket and serves the assets with Amazon CloudFront. The developer uses origin access control (OAC) on the CloudFront distribution to access the S3 bucket.

The developer notices users can access the root URL and specific pages but cannot access directories without specifying a file name. For example, /products/index.html works, but /products/ returns an error. The developer needs to enable accessing directories without specifying a file name without exposing the S3 bucket publicly.

Which solution will meet these requirements?

**A:** Update the CloudFront distribution's settings to index.html as the default root object is set.

**B:** Update the Amazon S3 bucket settings and enable static website hosting. Specify index.html as the Index document. Update the S3 bucket policy to enable access. Update the CloudFront distribution's origin to use the S3 website endpoint.

**C:** Create a CloudFront function that examines the request URL and appends index.html when directories are being accessed. Add the function as a viewer request CloudFront function to the CloudFront distribution's behavior.

**D:** Create a custom error response on the CloudFront distribution with the HTTP error code set to the HTTP 404 Not Found response code and the response page path to /index.html. Set the HTTP response code to the HTTP 200 OK response code.



**Answer: C**

**Timestamp: 2024-02-21 05:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134280-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 282 discussion

A developer is testing a RESTful application that is deployed by using Amazon API Gateway and AWS Lambda. When the developer tests the user login by using credentials that are not valid, the developer receives an HTTP 405: METHOD_NOT_ALLOWED error. The developer has verified that the test is sending the correct request for the resource.

Which HTTP error should the application return in response to the request?

**A:** HTTP 401

**B:** HTTP 404

**C:** HTTP 503

**D:** HTTP 505



**Answer: A**

**Timestamp: 2024-02-21 05:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134281-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 283 discussion

A developer must use multi-factor authentication (MFA) to access data in an Amazon S3 bucket that is in another AWS account.

Which AWS Security Token Service (AWS STS) API operation should the developer use with the MFA information to meet this requirement?

**A:** AssumeRoleWithWebIdentity

**B:** GetFederationToken

**C:** AssumeRoleWithSAML

**D:** AssumeRole



**Answer: D**

**Timestamp: 2024-02-21 05:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134282-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 347 discussion

A developer is writing an application to analyze the traffic to a fleet of Amazon EC2 instances. The EC2 instances run behind a public Application Load Balancer (ALB). An HTTP server runs on each of the EC2 instances, logging all requests to a log file.

The developer wants to capture the client public IP addresses. The developer analyzes the log files and notices only the IP address of the ALB.

What must the developer do to capture the client public IP addresses in the log file?

**A:** Add a Host header to the HTTP server log configuration file.

**B:** Install the Amazon CloudWatch Logs agent on each EC2 instance. Configure the agent to write to the log file.

**C:** Install the AWS X-Ray daemon on each EC2 instance. Configure the daemon to write to the log file.

**D:** Add an X-Forwarded-For header to the HTTP server log configuration file.



**Answer: D**

**Timestamp: 2024-03-23 04:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136971-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 348 discussion

A company is developing a serverless application by using AWS Lambda functions. One of the Lambda functions needs to access an Amazon RDS DB instance. The DB instance is in a private subnet inside a VPC.

The company creates a role that includes the necessary permissions to access the DB instance. The company then assigns the role to the Lambda function. A developer must take additional action to give the Lambda function access to the DB instance.

What should the developer do to meet these requirements?

**A:** Assign a public IP address to the DB instance. Modify the security group of the DB instance to allow inbound traffic from the IP address of the Lambda function.

**B:** Set up an AWS Direct Connect connection between the Lambda function and the DB instance.

**C:** Configure an Amazon CloudFront distribution to create a secure connection between the Lambda function and the DB instance.

**D:** Configure the Lambda function to connect to the private subnets in the VPC. Add security group rules to allow traffic to the DB instance from the Lambda function.



**Answer: D**

**Timestamp: 2024-05-25 05:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/141193-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 349 discussion

A developer needs temporary access to resources in a second account.

What is the MOST secure way to achieve this?

**A:** Use the Amazon Cognito user pools to get short-lived credentials for the second account.

**B:** Create a dedicated IAM access key for the second account, and send it by mail.

**C:** Create a cross-account access role, and use sts:AssumeRole API to get short-lived credentials.

**D:** Establish trust, and add an SSH key for the second account to the IAM user.



**Answer: C**

**Timestamp: 2024-04-05 08:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/137947-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 35 discussion

A developer wants to insert a record into an Amazon DynamoDB table as soon as a new file is added to an Amazon S3 bucket.
Which set of steps would be necessary to achieve this?

**A:** Create an event with Amazon EventBridge that will monitor the S3 bucket and then insert the records into DynamoDB.

**B:** Configure an S3 event to invoke an AWS Lambda function that inserts records into DynamoDB.

**C:** Create an AWS Lambda function that will poll the S3 bucket and then insert the records into DynamoDB.

**D:** Create a cron job that will run at a scheduled time and insert the records into DynamoDB.



**Answer: B**

**Timestamp: 2023-03-21 22:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103519-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 350 discussion

A company wants to migrate applications from its on-premises servers to AWS. As a first step, the company is modifying and migrating a non-critical application to a single Amazon EC2 instance. The application will store information in an Amazon S3 bucket. The company needs to follow security best practices when deploying the application on AWS.

Which approach should the company take to allow the application to interact with Amazon S3?

**A:** Create an IAM role that has administrative access to AWS. Attach the role to the EC2 instance.

**B:** Create an IAM user. Attach the AdministratorAccess policy. Copy the generated access key and secret key. Within the application code, use the access key and secret key along with the AWS SDK to communicate with Amazon S3.

**C:** Create an IAM role that has the necessary access to Amazon S3. Attach the role to the EC2 instance.

**D:** Create an IAM user. Attach a policy that provides the necessary access to Amazon S3. Copy the generated access key and secret key. Within the application code, use the access key and secret key along with the AWS SDK to communicate with Amazon S3.



**Answer: C**

**Timestamp: 2024-05-25 05:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/141194-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 234 discussion

A developer is troubleshooting an application in an integration environment. In the application, an Amazon Simple Queue Service (Amazon SQS) queue consumes messages and then an AWS Lambda function processes the messages. The Lambda function transforms the messages and makes an API call to a third-party service.

There has been an increase in application usage. The third-party API frequently returns an HTTP 429 Too Many Requests error message. The error message prevents a significant number of messages from being processed successfully.

How can the developer resolve this issue?

**A:** Increase the SQS event source’s batch size setting.

**B:** Configure provisioned concurrency for the Lambda function based on the third-party API’s documented rate limits.

**C:** Increase the retry attempts and maximum event age in the Lambda function’s asynchronous configuration.

**D:** Configure maximum concurrency on the SQS event source based on the third-party service’s documented rate limits.



**Answer: D**

**Timestamp: 2023-10-28 14:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124821-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 235 discussion

A company has a three-tier application that is deployed in Amazon Elastic Container Service (Amazon ECS). The application is using an Amazon RDS for MySQL DB instance. The application performs more database reads than writes.

During times of peak usage, the application’s performance degrades. When this performance degradation occurs, the DB instance’s ReadLatency metric in Amazon CloudWatch increases suddenly.

How should a developer modify the application to improve performance?

**A:** Use Amazon ElastiCache to cache query results.

**B:** Scale the ECS cluster to contain more ECS instances.

**C:** Add read capacity units (RCUs) to the DB instance.

**D:** Modify the ECS task definition to increase the task memory.



**Answer: A**

**Timestamp: 2023-10-28 14:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124822-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 236 discussion

A company has an online web application that includes a product catalog. The catalog is stored in an Amazon S3 bucket that is named DOC-EXAMPLE-BUCKET. The application must be able to list the objects in the S3 bucket and must be able to download objects through an IAM policy.

Which policy allows MINIMUM access to meet these requirements?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: A**

**Timestamp: 2023-10-28 14:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124825-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 237 discussion

A developer is writing an application to encrypt files outside of AWS before uploading the files to an Amazon S3 bucket. The encryption must be symmetric and must be performed inside the application.

How can the developer implement the encryption in the application to meet these requirements?

**A:** Create a data key in AWS Key Management Service (AWS KMS). Use the AWS Encryption SDK to encrypt the files.

**B:** Create a Hash-Based Message Authentication Code (HMAC) key in AWS Key Management Service (AWS KMS). Use the AWS Encryption SDK to encrypt the files.

**C:** Create a data key pair in AWS Key Management Service (AWS KMS). Use the AWS CLI to encrypt the files.

**D:** Create a data key in AWS Key Management Service (AWS KMS). Use the AWS CLI to encrypt the files.



**Answer: A**

**Timestamp: 2023-10-28 14:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124824-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 238 discussion

A developer is working on an application that is deployed on an Amazon EC2 instance. The developer needs a solution that will securely transfer files from the application to an Amazon S3 bucket.

What should the developer do to meet these requirements in the MOST secure way?

**A:** Create an IAM user. Create an access key for the IAM user. Store the access key in the application’s environment variables.

**B:** Create an IAM role. Create an access key for the IAM role. Store the access key in the application’s environment variables.

**C:** Create an IAM role. Configure the IAM role to access the specific Amazon S3 API calls the application requires. Associate the IAM role with the EC2 instance.

**D:** Configure an S3 bucket policy for the S3 bucket. Configure the S3 bucket policy to allow access for the EC2 instance ID.



**Answer: C**

**Timestamp: 2023-10-28 09:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124783-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 14 discussion

A financial company must store original customer records for 10 years for legal reasons. A complete record contains personally identifiable information (PII). According to local regulations, PII is available to only certain people in the company and must not be shared with third parties. The company needs to make the records available to third-party organizations for statistical analysis without sharing the PII.
A developer wants to store the original immutable record in Amazon S3. Depending on who accesses the S3 document, the document should be returned as is or with all the PII removed. The developer has written an AWS Lambda function to remove the PII from the document. The function is named removePii.
What should the developer do so that the company can meet the PII requirements while maintaining only one copy of the document?

**A:** Set up an S3 event notification that invokes the removePii function when an S3 GET request is made. Call Amazon S3 by using a GET request to access the object without PII.

**B:** Set up an S3 event notification that invokes the removePii function when an S3 PUT request is made. Call Amazon S3 by using a PUT request to access the object without PII.

**C:** Create an S3 Object Lambda access point from the S3 console. Select the removePii function. Use S3 Access Points to access the object without PII.

**D:** Create an S3 access point from the S3 console. Use the access point name to call the GetObjectLegalHold S3 API function. Pass in the removePii function name to access the object without PII.



**Answer: C**

**Timestamp: 2023-03-15 23:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102741-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 140 discussion

A company has an application that uses AWS CodePipeline to automate its continuous integration and continuous delivery (CI/CD) workflow. The application uses AWS CodeCommit for version control. A developer who was working on one of the tasks did not pull the most recent changes from the main branch. A week later, the developer noticed merge conflicts.

How can the developer resolve the merge conflicts in the developer's branch with the LEAST development effort?

**A:** Clone the repository. Create a new branch. Update the branch with the changes.

**B:** Create a new branch. Apply the changes from the previous branch.

**C:** Use the Commit Visualizer view to compare the commits when a feature was added. Fix the merge conflicts.

**D:** Stop the pull from the main branch to the feature branch. Rebase the feature branch from the main branch.



**Answer: D**

**Timestamp: 2023-08-08 06:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117574-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 141 discussion

A developer wants to add request validation to a production environment Amazon API Gateway API. The developer needs to test the changes before the API is deployed to the production environment. For the test, the developer will send test requests to the API through a testing tool.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Export the existing API to an OpenAPI file. Create a new API. Import the OpenAPI file. Modify the new API to add request validation. Perform the tests. Modify the existing API to add request validation. Deploy the existing API to production.

**B:** Modify the existing API to add request validation. Deploy the updated API to a new API Gateway stage. Perform the tests. Deploy the updated API to the API Gateway production stage.

**C:** Create a new API. Add the necessary resources and methods, including new request validation. Perform the tests. Modify the existing API to add request validation. Deploy the existing API to production

**D:** Clone the existing API. Modify the new API to add request validation. Perform the tests. Modify the existing API to add request validation. Deploy the existing API to production.



**Answer: B**

**Timestamp: 2023-08-10 14:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117797-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 142 discussion

An online food company provides an Amazon API Gateway HTTP API to receive orders for partners. The API is integrated with an AWS Lambda function. The Lambda function stores the orders in an Amazon DynamoDB table.

The company expects to onboard additional partners. Some of the partners require additional Lambda functions to receive orders. The company has created an Amazon S3 bucket. The company needs to store all orders and updates in the S3 bucket for future analysis.

How can the developer ensure that all orders and updates are stored to Amazon S3 with the LEAST development effort?

**A:** Create a new Lambda function and a new API Gateway API endpoint. Configure the new Lambda function to write to the S3 bucket. Modify the original Lambda function to post updates to the new API endpoint.

**B:** Use Amazon Kinesis Data Streams to create a new data stream. Modify the Lambda function to publish orders to the data stream. Configure the data stream to write to the S3 bucket.

**C:** Enable DynamoDB Streams on the DynamoDB table. Create a new Lambda function. Associate the stream’s Amazon Resource Name (ARN) with the Lambda function. Configure the Lambda function to write to the S3 bucket as records appear in the table's stream.

**D:** Modify the Lambda function to publish to a new Amazon Simple Notification Service (Amazon SNS) topic as the Lambda function receives orders. Subscribe a new Lambda function to the topic. Configure the new Lambda function to write to the S3 bucket as updates come through the topic.



**Answer: C**

**Timestamp: 2023-08-10 14:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117798-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 143 discussion

A company’s website runs on an Amazon EC2 instance and uses Auto Scaling to scale the environment during peak times. Website users across the world are experiencing high latency due to static content on the EC2 instance, even during non-peak hours.

Which combination of steps will resolve the latency issue? (Choose two.)

**A:** Double the Auto Scaling group’s maximum number of servers.

**B:** Host the application code on AWS Lambda.

**C:** Scale vertically by resizing the EC2 instances.

**D:** Create an Amazon CloudFront distribution to cache the static content.

**E:** Store the application’s static content in Amazon S3.



**Answer: DE**

**Timestamp: 2023-10-06 12:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122655-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 239 discussion

A developer created a web API that receives requests by using an internet-facing Application Load Balancer (ALB) with an HTTPS listener. The developer configures an Amazon Cognito user pool and wants to ensure that every request to the API is authenticated through Amazon Cognito.

What should the developer do to meet this requirement?

**A:** Add a listener rule to the listener to return a fixed response if the Authorization header is missing. Set the fixed response to 401 Unauthorized.

**B:** Create an authentication action for the listener rules of the ALSet the rule action type to authenticate-cognito. Set the OnUnauthenticatedRequest field to “deny.”

**C:** Create an Amazon API Gateway API. Configure all API methods to be forwarded to the ALB endpoint. Create an authorizer of the COGNITO_USER_POOLS type. Configure every API method to use that authorizer.

**D:** Create a new target group that includes an AWS Lambda function target that validates the Authorization header by using Amazon Cognito. Associate the target group with the listener.



**Answer: B**

**Timestamp: 2023-10-28 14:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124826-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 24 discussion

A company wants to deploy and maintain static websites on AWS. Each website's source code is hosted in one of several version control systems, including AWS CodeCommit, Bitbucket, and GitHub.
The company wants to implement phased releases by using development, staging, user acceptance testing, and production environments in the AWS Cloud. Deployments to each environment must be started by code merges on the relevant Git branch. The company wants to use HTTPS for all data exchange. The company needs a solution that does not require servers to run continuously.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Host each website by using AWS Amplify with a serverless backend. Conned the repository branches that correspond to each of the desired environments. Start deployments by merging code changes to a desired branch.

**B:** Host each website in AWS Elastic Beanstalk with multiple environments. Use the EB CLI to link each repository branch. Integrate AWS CodePipeline to automate deployments from version control code merges.

**C:** Host each website in different Amazon S3 buckets for each environment. Configure AWS CodePipeline to pull source code from version control. Add an AWS CodeBuild stage to copy source code to Amazon S3.

**D:** Host each website on its own Amazon EC2 instance. Write a custom deployment script to bundle each website's static assets. Copy the assets to Amazon EC2. Set up a workflow to run the script when code is merged.



**Answer: A**

**Timestamp: 2023-03-23 08:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103646-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 240 discussion

A company recently deployed an AWS Lambda function. A developer notices an increase in the function throttle metrics in Amazon CloudWatch.

What are the MOST operationally efficient solutions to reduce the function throttling? (Choose two.)

**A:** Migrate the function to Amazon Elastic Kubernetes Service (Amazon EKS).

**B:** Increase the maximum age of events in Lambda.

**C:** Increase the function’s reserved concurrency.

**D:** Add the lambda:GetFunctionConcurrency action to the execution role.

**E:** Request a service quota change for increased concurrency.



**Answer: CE**

**Timestamp: 2023-10-28 14:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124827-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 241 discussion

A company is creating a REST service using an Amazon API Gateway with AWS Lambda integration. The service must run different versions for testing purposes.

What would be the BEST way to accomplish this?

**A:** Use an X-Version header to denote which version is being called and pass that header to the Lambda function(s).

**B:** Create an API Gateway Lambda authorizer to route API clients to the correct API version.

**C:** Create an API Gateway resource policy to isolate versions and provide context to the Lambda function(s).

**D:** Deploy the API versions as unique stages with unique endpoints and use stage variables to provide further context.



**Answer: D**

**Timestamp: 2023-10-28 14:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124828-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 242 discussion

A company is using AWS CodePipeline to deliver one of its applications. The delivery pipeline is triggered by changes to the main branch of an AWS CodeCommit repository and uses AWS CodeBuild to implement the test and build stages of the process and AWS CodeDeploy to deploy the application.

The pipeline has been operating successfully for several months and there have been no modifications. Following a recent change to the application’s source code, AWS CodeDeploy has not deployed the updated application as expected.

What are the possible causes? (Choose two.)

**A:** The change was not made in the main branch of the AWS CodeCommit repository.

**B:** One of the earlier stages in the pipeline failed and the pipeline has terminated.

**C:** One of the Amazon EC2 instances in the company’s AWS CodePipeline cluster is inactive.

**D:** The AWS CodePipeline is incorrectly configured and is not invoking AWS CodeDeploy.

**E:** AWS CodePipeline does not have permissions to access AWS CodeCommit.



**Answer: AB**

**Timestamp: 2023-10-28 14:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124830-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 298 discussion

A company has an analytics application that uses an AWS Lambda function to process transaction data asynchronously. A developer notices that asynchronous invocations of the Lambda function sometimes fail. When failed Lambda function invocations occur, the developer wants to invoke a second Lambda function to handle errors and log details.

Which solution will meet these requirements?

**A:** Configure a Lambda function destination with a failure condition. Specify Lambda function as the destination type. Specify the error-handling Lambda function's Amazon Resource Name (ARN) as the resource.

**B:** Enable AWS X-Ray active tracing on the initial Lambda function. Configure X-Ray to capture stack traces of the failed invocations. Invoke the error-handling Lambda function by including the stack traces in the event object.

**C:** Configure a Lambda function trigger with a failure condition. Specify Lambda function as the destination type. Specify the error-handling Lambda function's Amazon Resource Name (ARN) as the resource.

**D:** Create a status check alarm on the initial Lambda function. Configure the alarm to invoke the error-handling Lambda function when the alarm is initiated. Ensure that the alarm passes the stack trace in the event object.



**Answer: A**

**Timestamp: 2024-02-21 07:19:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134297-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 299 discussion

A company introduced a new feature that should be accessible to only a specific group of premium customers. A developer needs the ability to turn the feature on and off in response to performance and feedback. The developer needs a solution to validate and deploy these configurations quickly without causing any disruptions.

What should the developer do to meet these requirements?

**A:** Use AWS AppConfig to manage the feature configuration and to validate and deploy changes. Use feature flags to turn the feature on and off.

**B:** Use AWS Secrets Manager to securely manage and validate the feature configurations. Enable lifecycle rules to turn the feature on and off.

**C:** Use AWS Config to manage the feature configuration and validation. Set up AWS Config rules to turn the feature on and off based on predefined conditions.

**D:** Use AWS Systems Manager Parameter Store to store and validate the configuration settings for the feature. Enable lifecycle rules to turn the feature on and off.



**Answer: A**

**Timestamp: 2024-02-21 07:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134298-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 3 discussion

An application is using Amazon Cognito user pools and identity pools for secure access. A developer wants to integrate the user-specific file upload and download features in the application with Amazon S3. The developer must ensure that the files are saved and retrieved in a secure manner and that users can access only their own files. The file sizes range from 3 KB to 300 MB.
Which option will meet these requirements with the HIGHEST level of security?

**A:** Use S3 Event Notifications to validate the file upload and download requests and update the user interface (UI).

**B:** Save the details of the uploaded files in a separate Amazon DynamoDB table. Filter the list of files in the user interface (UI) by comparing the current user ID with the user ID associated with the file in the table.

**C:** Use Amazon API Gateway and an AWS Lambda function to upload and download files. Validate each request in the Lambda function before performing the requested operation.

**D:** Use an IAM policy within the Amazon Cognito identity prefix to restrict users to use their own folders in Amazon S3.



**Answer: D**

**Timestamp: 2023-03-16 10:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102788-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 30 discussion

A company has an application that uses Amazon Cognito user pools as an identity provider. The company must secure access to user records. The company has set up multi-factor authentication (MFA). The company also wants to send a login activity notification by email every time a user logs in.
What is the MOST operationally efficient solution that meets this requirement?

**A:** Create an AWS Lambda function that uses Amazon Simple Email Service (Amazon SES) to send the email notification. Add an Amazon API Gateway API to invoke the function. Call the API from the client side when login confirmation is received.

**B:** Create an AWS Lambda function that uses Amazon Simple Email Service (Amazon SES) to send the email notification. Add an Amazon Cognito post authentication Lambda trigger for the function.

**C:** Create an AWS Lambda function that uses Amazon Simple Email Service (Amazon SES) to send the email notification. Create an Amazon CloudWatch Logs log subscription filter to invoke the function based on the login status.

**D:** Configure Amazon Cognito to stream all logs to Amazon Kinesis Data Firehose. Create an AWS Lambda function to process the streamed logs and to send the email notification based on the login status of each user.



**Answer: B**

**Timestamp: 2023-03-17 09:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102904-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 300 discussion

A developer needs approval from a product owner before the developer can deploy code for an application to production. The developer uses AWS CodePipeline to deploy the application. The developer configures an Amazon Simple Notification Service (Amazon SNS) topic to send notifications to the product owner.

Which solution is the MOST operationally efficient way for the developer to receive approval from the product owner?

**A:** Add a new stage to CodePipeline before the production deployment. Add a manual approval action to the new stage. Add a new notification rule in the pipeline settings. Specify manual approval as the event that initiates the notification. Specify the SNS topic's Amazon Resource Name (ARN) to notify the product owner.

**B:** Develop an AWS Step Functions state machine that sends a notification to the product owner and accepts an approval. Add a new stage to CodePipeline before the production deployment. Add the state machine as a Step Functions action to the new stage.

**C:** Add a manual approval action to the existing production deployment stage in CodePipeline. Specify the SNS topic's Amazon Resource Name (ARN) while configuring the new manual approval action.

**D:** Edit the settings in CodePipeline. Create a new notification rule. Specify manual approval as the event that initiates the notification. Create a new notification target. Specify the SNS topic to notify the product owner. Save the notification rule.



**Answer: A**

**Timestamp: 2024-02-22 06:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134336-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 306 discussion

A developer is building an application on AWS. The application includes an AWS Lambda function that processes messages from an Amazon Simple Queue Service (Amazon SQS) queue.

The Lambda function sometimes fails or times out. The developer needs to figure out why the Lambda function fails to process some messages.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Increase the maximum timeout of the Lambda function to 15 minutes. Check the AWS CloudTrail event history for error details.

**B:** Increase the visibility timeout of the SQS queue. Check logs in Amazon CloudWatch Logs for error details.

**C:** Create a dead-letter queue. Configure the Lambda function to send the failed messages to the dead-letter queue.

**D:** Create an Amazon DynamoDB table. Update the Lambda function to send the failed messages to the DynamoDB table.



**Answer: C**

**Timestamp: 2024-02-18 10:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134125-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 307 discussion

A developer needs to deploy an application in three AWS Regions by using AWS CloudFormation. Each Region will use an AWS Elastic Beanstalk environment with an Application Load Balancer (ALB). The developer wants to use AWS Certificate Manager (ACM) to deploy SSL certificates to each ALB.

Which solution will meet these requirements?

**A:** Create a certificate in ACM in any one of the Regions. Import the certificate into the ALB that is in each Region.

**B:** Create a global certificate in ACM. Update the CloudFormation template to deploy the global certificate to each ALB.

**C:** Create a certificate in ACM in each Region. Import the certificate into the ALB for each Region.

**D:** Create a certificate in ACM in the us-east-1 Region. Update the CloudFormation template to deploy the certificate to each ALB.



**Answer: C**

**Timestamp: 2024-02-18 10:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134126-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 308 discussion

A company needs to deploy all its cloud resources by using AWS CloudFormation templates. A developer must create an Amazon Simple Notification Service (Amazon SNS) automatic notification to help enforce this rule. The developer creates an SNS topic and subscribes the email address of the company's security team to the SNS topic.

The security team must receive a notification immediately if an IAM role is created without the use of CloudFormation.

Which solution will meet this requirement?

**A:** Create an AWS Lambda function to filter events from CloudTrail if a role was created without CloudFormation. Configure the Lambda function to publish to the SNS topic. Create an Amazon EventBridge schedule to invoke the Lambda function every 15 minutes.

**B:** Create an AWS Fargate task in Amazon Elastic Container Service (Amazon ECS) to filter events from CloudTrail if a role was created without CloudFormation. Configure the Fargate task to publish to the SNS topic. Create an Amazon EventBridge schedule to run the Fargate task every 15 minutes.

**C:** Launch an Amazon EC2 instance that includes a script to filter events from CloudTrail if a role was created without CloudFormation. Configure the script to publish to the SNS topic. Create a cron job to run the script on tile EC2 instance every 15 minutes.

**D:** Create an Amazon EventBridge rule to filter events from CloudTrail if a role was created without CloudFormation. Specify the SNS topic as the target of the EventBridge rule.



**Answer: D**

**Timestamp: 2024-02-22 07:19:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134342-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 309 discussion

A company is adopting serverless computing for some of its new services. A development team needs to create a serverless infrastructure by using AWS Serverless Application Model (AWS SAM). All infrastructure must be deployed by using AWS CloudFormation templates.

What should the development team do to meet these requirements?

**A:** Add a Resources section to the CloudFormation templates that contains AWS::Lambda::Function resources.

**B:** Add a Mappings section to the CloudFormation templates that contains AWS::Serverless::Function and AWS::Serverless::API.

**C:** Add a Transform section to the CloudFormation templates. Use the AWS SAM syntax to define the resources.

**D:** Add a Parameters section to the CloudFormation templates that specifies the relevant AWS SAM Globals section.



**Answer: C**

**Timestamp: 2024-02-12 13:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133607-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 31 discussion

A developer has an application that stores data in an Amazon S3 bucket. The application uses an HTTP API to store and retrieve objects. When the PutObject API operation adds objects to the S3 bucket the developer must encrypt these objects at rest by using server-side encryption with Amazon S3 managed keys (SSE-S3).
Which solution will meet this requirement?

**A:** Create an AWS Key Management Service (AWS KMS) key. Assign the KMS key to the S3 bucket.

**B:** Set the x-amz-server-side-encryption header when invoking the PutObject API operation.

**C:** Provide the encryption key in the HTTP header of every request.

**D:** Apply TLS to encrypt the traffic to the S3 bucket.



**Answer: B**

**Timestamp: 2023-03-21 22:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103513-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 158 discussion

An ecommerce application is running behind an Application Load Balancer. A developer observes some unexpected load on the application during non-peak hours. The developer wants to analyze patterns for the client IP addresses that use the application.

Which HTTP header should the developer use for this analysis?

**A:** The X-Forwarded-Proto header

**B:** The X-Forwarded-Host header

**C:** The X-Forwarded-For header

**D:** The X-Forwarded-Port header



**Answer: C**

**Timestamp: 2023-10-06 02:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122577-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 159 discussion

A developer migrated a legacy application to an AWS Lambda function. The function uses a third-party service to pull data with a series of API calls at the end of each month. The function then processes the data to generate the monthly reports. The function has been working with no issues so far.

The third-party service recently issued a restriction to allow a fixed number of API calls each minute and each day. If the API calls exceed the limit for each minute or each day, then the service will produce errors. The API also provides the minute limit and daily limit in the response header. This restriction might extend the overall process to multiple days because the process is consuming more API calls than the available limit.

What is the MOST operationally efficient way to refactor the serverless application to accommodate this change?

**A:** Use an AWS Step Functions state machine to monitor API failures. Use the Wait state to delay calling the Lambda function.

**B:** Use an Amazon Simple Queue Service (Amazon SQS) queue to hold the API calls. Configure the Lambda function to poll the queue within the API threshold limits.

**C:** Use an Amazon CloudWatch Logs metric to count the number of API calls. Configure an Amazon CloudWatch alarm that stops the currently running instance of the Lambda function when the metric exceeds the API threshold limits.

**D:** Use Amazon Kinesis Data Firehose to batch the API calls and deliver them to an Amazon S3 bucket with an event notification to invoke the Lambda function.



**Answer: A**

**Timestamp: 2023-10-06 02:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122578-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 16 discussion

A developer has written an AWS Lambda function. The function is CPU-bound. The developer wants to ensure that the function returns responses quickly.
How can the developer improve the function's performance?

**A:** Increase the function's CPU core count.

**B:** Increase the function's memory.

**C:** Increase the function's reserved concurrency.

**D:** Increase the function's timeout.



**Answer: B**

**Timestamp: 2023-03-21 07:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103444-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 160 discussion

A developer must analyze performance issues with production-distributed applications written as AWS Lambda functions. These distributed Lambda applications invoke other components that make up the applications.

How should the developer identify and troubleshoot the root cause of the performance issues in production?

**A:** Add logging statements to the Lambda functions, then use Amazon CloudWatch to view the logs.

**B:** Use AWS CloudTrail and then examine the logs.

**C:** Use AWS X-Ray, then examine the segments and errors.

**D:** Run Amazon Inspector agents and then analyze performance.



**Answer: C**

**Timestamp: 2023-10-06 02:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122579-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 161 discussion

A developer wants to deploy a new version of an AWS Elastic Beanstalk application. During deployment, the application must maintain full capacity and avoid service interruption. Additionally, the developer must minimize the cost of additional resources that support the deployment.

Which deployment method should the developer use to meet these requirements?

**A:** All at once

**B:** Rolling with additional batch

**C:** Blue/green

**D:** Immutable



**Answer: B**

**Timestamp: 2023-10-06 02:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122580-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 374 discussion

A developer creates an AWS Lambda function that is written in Java. During testing, the Lambda function does not work how the developer expected. The developer wants to use tracing capabilities to troubleshoot the problem.

Which AWS service should the developer use to accomplish this goal?

**A:** AWS Trusted Advisor

**B:** Amazon CloudWatch

**C:** AWS X-Ray

**D:** AWS CloudTrail



**Answer: C**

**Timestamp: 2024-07-12 05:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143756-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 375 discussion

A company is developing an application that will be accessed through the Amazon API Gateway REST API. Registered users should be the only ones who can access certain resources of this API. The token being used should expire automatically and needs to be refreshed periodically.

How can a developer meet these requirements?

**A:** Create an Amazon Cognito identity pool, configure the Amazon Cognito Authorizer in API Gateway, and use the temporary credentials generated by the identity pool.

**B:** Create and maintain a database record for each user with a corresponding token and use an AWS Lambda authorizer in API Gateway.

**C:** Create an Amazon Cognito user pool, configure the Cognito Authorizer in API Gateway, and use the identity or access token.

**D:** Create an IAM user for each API user, attach an invoke permissions policy to the API, and use an IAM authorizer in API Gateway.



**Answer: C**

**Timestamp: 2024-07-12 05:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143757-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 376 discussion

A company used AWS to develop an application for customers. The application includes an Amazon API Gateway API that invokes AWS Lambda functions. The Lambda functions process data and store the data in Amazon DynamoDB tables.

The company must monitor the entire application to identify potential bottlenecks in the architecture that can negatively affect customers.

Which solution will meet this requirement with the LEAST development effort?

**A:** Instrument the application with AWS X-Ray. Inspect the service map to identify errors and issues.

**B:** Configure Lambda exceptions and additional logging to Amazon CloudWatch. Use CloudWatch Logs Insights to query the logs.

**C:** Configure API Gateway to log responses to Amazon CloudWatch. Create a metric filter for the TooManyRequestsException error message.

**D:** Use Amazon CloudWatch metrics for the DynamoDB tables to identify all the ProvisionedThroughputExceededException error messages.



**Answer: A**

**Timestamp: 2024-07-12 05:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143758-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 377 discussion

A company launched an online portal to announce a new product that the company will release in 6 months. The portal requests that users enter an email address to receive communications about the product. The company needs to create a REST API that will store the email addresses in Amazon DynamoDB.

A developer has created an AWS Lambda function that can store the email addresses. The developer will deploy the Lambda function by using the AWS Serverless Application Model (AWS SAM). The developer must provide access to the Lambda function over HTTP.

Which solutions will meet these requirements with the LEAST additional configuration? (Choose two.)

**A:** Expose the Lambda function by using function URLs.

**B:** Expose the Lambda function by using a Gateway Load Balancer.

**C:** Expose the Lambda function by using a Network Load Balancer.

**D:** Expose the Lambda function by using AWS Global Accelerator.

**E:** Expose the Lambda function by using Amazon API Gateway.



**Answer: AE**

**Timestamp: 2024-07-12 05:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143759-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 378 discussion

A company has a website that displays a daily newsletter. When a user visits the website, an AWS Lambda function processes the browser's request and queries the company's on-premises database to obtain the current newsletter. The newsletters are stored in English. The Lambda function uses the Amazon Translate TranslateText API operation to translate the newsletters, and the translation is displayed to the user.

Due to an increase in popularity, the website's response time has slowed. The database is overloaded. The company cannot change the database and needs a solution that improves the response time of the Lambda function.

Which solution meets these requirements?

**A:** Change to asynchronous Lambda function invocation.

**B:** Cache the translated newsletters in the Lambda/tmp directory.

**C:** Enable TranslateText API caching.

**D:** Change the Lambda function to use parallel processing.



**Answer: B**

**Timestamp: 2024-07-12 06:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143767-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 462 discussion

A developer is building an application that processes a stream of user-supplied data. The data stream must be consumed by multiple Amazon EC2 based processing applications in parallel and in real time. Each processor must be able to resume without losing data if there is a service interruption. The application architect plans to add other processors in the near future, and wants to minimize the amount of data duplication involved.

Which solution will satisfy these requirements?

**A:** Publish the data to Amazon Simple Queue Service (Amazon SQS).

**B:** Publish the data to Amazon Data Firehose.

**C:** Publish the data to Amazon EventBridge.

**D:** Publish the data to Amazon Kinesis Data Streams.



**Answer: D**

**Timestamp: 2024-12-12 19:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152918-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 463 discussion

An application is experiencing performance issues based on increased demand. This increased demand is on read-only historical records pulled from an Amazon RDS-hosted database with custom views and queries. A developer must improve performance without changing the database structure.

Which approach will improve performance and MINIMIZE management overhead?

**A:** Deploy Amazon DynamoDB, move all the data, and point to DynamoDB.

**B:** Deploy Amazon ElastiCache (Redis OSS) and cache the data for the application.

**C:** Deploy Memcached on Amazon EC2 and cache the data for the application.

**D:** Deploy Amazon DynamoDB Accelerator (DAX) on Amazon RDS to improve cache performance.



**Answer: C**

**Timestamp: 2025-02-17 10:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156670-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 464 discussion

A developer is using AWS CloudFormation to deploy an AWS Lambda function. The developer needs to set the Lambda function's timeout value based on the environment parameter of the template. The template contains mappings of EnvironmentData for each environment's timeout value. The environment parameter and EnvironmentData mappings are as follows:

Environment parameter:

//IMG//


EnvironmentData mappings:

//IMG//


Which statement will meet these requirements?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image27.png
https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image28.png

**A:** Timeout: !GetAtt [EnvironmentData, !Ref Environment, Timeout]

**B:** Timeout: !FindInMap [EnvironmentData, !Ref Environment, Timeout]

**C:** Timeout: !Select [EnvironmentData, !Ref Environment, Timeout]

**D:** Timeout: !ForEach[EnvironmentData, !Ref Environment, Timeout]



**Answer: B**

**Timestamp: 2024-12-12 19:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152922-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 465 discussion

A company’s AWS accounts are in an organization in AWS Organizations. An application in Account A uses environment variables that are stored as parameters in AWS Systems Manager Parameter Store. A developer is creating a new application in Account B that needs to use the same environment variables.

The application in Account B needs access to the parameters in Account A without duplicating the parameters into Account B.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Configure the application in Account B to use credentials for an IAM user in AccountA that has access to the parameters.

**B:** Create an assumable IAM role in Account A. Grant the role the permission to access the parameters.

**C:** Configure cross-account resource sharing for the parameters by using AWS Resource Access Manager (AWS RAM).

**D:** Write a script that stores the parameter values in a private Amazon S3 bucket that both accounts can access.



**Answer: C**

**Timestamp: 2024-12-12 19:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152923-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 466 discussion

In a move toward using microservices, a company’s management team has asked all development teams to build their services so that API requests depend only on that service’s data store. One team is building a Payments service which has its own database; the service needs data that originates in the Accounts database. Both are using Amazon DynamoDB.

What approach will result in the simplest, decoupled, and reliable method to get near-real time updates from the Accounts database?

**A:** Use AWS Glue to perform frequent ETL updates from the Accounts database to the Payments database.

**B:** Use Amazon ElastiCache in Payments, with the cache updated by triggers in the Accounts database.

**C:** Use Amazon Data Firehose to deliver all changes from the Accounts database to the Payments database.

**D:** Use Amazon DynamoDB Streams to deliver all changes from the Accounts database to the Payments database.



**Answer: D**

**Timestamp: 2025-02-17 09:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156644-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 507 discussion

A developer has implemented an AWS Lambda function that inserts new customers into an Amazon RDS database. The function is expected to run hundreds of times each hour. The function and RDS database are in the same VPC. The function is configured to use 512 MB of RAM and is based on the following pseudo code:

//IMG//


After successfully testing the function multiple times, the developer notices that the execution time is longer than expected.

What should the developer do to improve performance?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image38.png

**A:** Increase the reserved concurrency of the Lambda function.

**B:** Increase the size of the RDS database to facilitate an increased number of database connections each hour.

**C:** Move the database connection and close statement out of the handler. Place the connection in the global space.

**D:** Replace Amazon RDS with Amazon DynamoDB to implement control over the number of writes per second.



**Answer: C**

**Timestamp: 2025-02-06 09:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156018-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 508 discussion

A developer is troubleshooting the permissions of an application that needs to make changes to an Amazon RDS database. The developer has access to the IAM role that the application is using.

Which command structure should the developer use to test the role permissions?

**A:** aws sts assume-role

**B:** aws iam attach-role-policy

**C:** aws ssm resume-session

**D:** aws rds add-role-to-db-cluster



**Answer: A**

**Timestamp: 2025-02-06 09:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156019-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 509 discussion

A gaming company has deployed a web portal on AWS Elastic Beanstalk. The company sometimes needs to deploy new versions three or four times in a day. The company needs to deploy new features for all users as quickly as possible. The solution must minimize performance impact and must maximize availability.

What solution will meet these requirements?

**A:** Use a rolling deployment policy to deploy to Amazon EC2 instances.

**B:** Use an immutable deployment policy to deploy to Amazon EC2 instances.

**C:** Use an all-at-once deployment policy to deploy to Amazon EC2 instances.

**D:** Use a-canary deployment strategy to deploy changes to Amazon EC2 instances.



**Answer: B**

**Timestamp: 2024-12-20 00:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153213-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 51 discussion

A developer has a legacy application that is hosted on-premises. Other applications hosted on AWS depend on the on-premises application for proper functioning. In case of any application errors, the developer wants to be able to use Amazon CloudWatch to monitor and troubleshoot all applications from one place.
How can the developer accomplish this?

**A:** Install an AWS SDK on the on-premises server to automatically send logs to CloudWatch.

**B:** Download the CloudWatch agent to the on-premises server. Configure the agent to use IAM user credentials with permissions for CloudWatch.

**C:** Upload log files from the on-premises server to Amazon S3 and have CloudWatch read the files.

**D:** Upload log files from the on-premises server to an Amazon EC2 instance and have the instance forward the logs to CloudWatch.



**Answer: B**

**Timestamp: 2023-03-24 12:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103772-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 510 discussion

An AWS Lambda function generates a 3 MB JSON file and then uploads it to an Amazon S3 bucket daily. The file contains sensitive information, so the developer must ensure that it is encrypted before uploading to the bucket.

Which of the following modifications should the developer make to ensure that the data is encrypted before uploading it to the bucket?

**A:** Use the default AWS Key Management Service (AWS KMS) key for Amazon S3 in the Lambda function code.

**B:** Use the S3 managed key and call the GenerateDataKey API to encrypt the file.

**C:** Use the GenerateDataKey API, then use that data key to encrypt the file in the Lambda function code.

**D:** Use an AWS Key Management Service (AWS KMS) customer managed key for Amazon S3 in the Lambda function code.



**Answer: C**

**Timestamp: 2024-12-10 05:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152782-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 471 discussion

A company has an application that uses an Amazon Cognito user pool for authentication. A developer needs to add a new REST API that will use the user pool to authenticate requests.

Which solution will meet this requirement with the LEAST development effort?

**A:** Create a new API key and a new usage plan. Associate the API key and the REST API with the usage plan.

**B:** Create a Cognito authorizer for the correct user pool. Reference the header that contains the Cognito token.

**C:** Create an AWS Lambda token authorizer. Reference the authorization token in the event payload. Authenticate requests based on the token value.

**D:** Create an AWS Lambda request authorizer. Reference the authorization header in the event payload. Authenticate requests by using the header value in a request to the Cognito API.



**Answer: B**

**Timestamp: 2024-12-13 02:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152946-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 472 discussion

A developer is testing an AWS Lambda function that has an event source of an Amazon Simple Queue Service (Amazon SQS) queue. The developer notices that some of the messages the Lambda function processes re-appear in the queue while the messages are being processed.

The developer must correct this behavior.

Which solution will meet this requirement?

**A:** Increase the timeout of the Lambda function.

**B:** Increase the visibility timeout of the SQS queue.

**C:** Increase the memory allocation of the Lambda function.

**D:** Increase the batch size in the event source mapping.



**Answer: B**

**Timestamp: 2025-02-17 09:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156648-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 473 discussion

A developer created reusable code that several AWS Lambda functions need to use. The developer bundled the code into a zip archive. The developer needs to deploy the code to AWS and update the Lambda functions to use the code.

Which solution will meet this requirement in the MOST operationally efficient way?

**A:** Upload the zip archive to Amazon S3. Configure an import path on the Lambda functions to point to the zip archive.

**B:** Create a new Lambda function that contains and runs the shared code. Update the existing Lambda functions to invoke the new Lambda function synchronously.

**C:** Create a Lambda layer that contains the zip archive. Attach the Lambda layer to the Lambda functions.

**D:** Create a Lambda container image that includes the shared code. Use the container image as a Lambda base image for all the functions.



**Answer: C**

**Timestamp: 2024-12-13 02:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152947-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 474 discussion

A team has an Amazon API Gateway REST API that consists of a single resource and a GET method that is backed by an AWS Lambda integration.

A developer makes a change to the Lambda function and deploys the function as a new version. The developer needs to set up a process to test the new version of the function before using the new version in production. The tests must not affect the production REST API.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create a new resource in the REST API. Add a GET method to the new resource, and add a Lambda integration to the updated version of the Lambda function. Deploy the new version.

**B:** Create a new stage for the REST API. Create a stage variable. Assign the stage variable to the Lambda function. Set the API Gateway integrated Lambda function name to the stage variable. Deploy the new version.

**C:** Create a new REST API. Add a resource that has a single GET method that is integrated with the updated version of the Lambda function.

**D:** Update the Lambda integration of the existing GET method to point to the updated version of the Lambda function. Deploy the new version.



**Answer: B**

**Timestamp: 2025-02-17 09:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156649-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 475 discussion

A developer manages encryption keys in AWS Key Management Service (AWS KMS). The developer must ensure that all encryption keys can be deleted immediately when the keys are no longer required. The developer wants a solution that is highly available and does not require manual management for compute infrastructure.

Which solution will meet these requirements?

**A:** Use AWS KMS managed keys. When the keys are no longer required, schedule the keys for immediate deletion.

**B:** Use customer managed keys with imported key material. When the keys are no longer required, delete the imported key material.

**C:** Use customer managed keys. When the keys are no longer required, delete the key material.

**D:** Use customer managed keys and an AWS CloudHSM key store. When the keys are no longer required, schedule the keys for immediate deletion.



**Answer: B**

**Timestamp: 2024-12-13 03:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152950-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 432 discussion

A company processes incoming documents from an Amazon S3 bucket. Users upload documents to an S3 bucket using a web user interface. Upon receiving files in S3, an AWS Lambda function is invoked to process the files, but the Lambda function times out intermittently.

If the Lambda function is configured with the default settings, what will happen to the S3 event when there is a timeout exception?

**A:** Notification of a failed S3 event is sent as an email through Amazon SNS.

**B:** The S3 event is sent to the default Dead Letter Queue.

**C:** The S3 event is processed until it is successful.

**D:** The S3 event is discarded after the event is retried twice.



**Answer: D**

**Timestamp: 2024-09-06 00:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/147042-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 433 discussion

A developer uses Amazon S3 Event Notifications to invoke AWS Lambda functions. The Lambda functions process images after the images are uploaded to S3 buckets. The developer has set up a development S3 bucket, a production S3 bucket, a development Lambda function, and a production Lambda function in the same AWS account.

The developer notices that uploads to the development S3 bucket wrongly invoke the production Lambda function. The developer must prevent development data from affecting the production Lambda function.

What should the developer do to meet these requirements?

**A:** Update the execution role for the production Lambda function. Add a policy that allows the execution role to read from only the production S3 bucket.

**B:** Update the S3 bucket policy for the production S3 bucket to invoke the production Lambda function. Update the S3 bucket policy for the development S3 bucket to invoke the development Lambda function.

**C:** Separate the development environment and the production environment into their own AWS accounts. Update the execution role for each Lambda function. Add a policy that allows the execution role to read from only the S3 bucket that is in the same account.

**D:** Separate the development environment and the production environment into their own AWS accounts. Add a resource policy to the Lambda functions to allow only S3 bucket events in the same account to invoke the functions.



**Answer: D**

**Timestamp: 2024-10-10 07:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148956-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 434 discussion

A developer is writing an application that will run on Amazon EC2 instances in an Auto Scaling group. The developer wants to externalize the session state to support the application.

Which AWS services or resources can the developer use to meet these requirements? (Choose two.)

**A:** Amazon DynamoDB

**B:** Amazon Cognito

**C:** Amazon ElastiCache

**D:** Application Load Balancer

**E:** Amazon Simple Queue Service (Amazon SQS)



**Answer: AC**

**Timestamp: 2025-02-17 12:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156702-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 435 discussion

A company has a serverless application that uses an Amazon API Gateway API to invoke an AWS Lambda function. A developer creates a fix for a defect in the Lambda function code. The developer wants to deploy this fix to the production environment.

To test the changes, the developer needs to send 10% of the live production traffic to the updated Lambda function version.

Which combination of steps will meet these requirements? (Choose two.)

**A:** Publish a new version of the Lambda function that contains the updated code.

**B:** Set up a new stage in API Gateway with a new Lambda function version. Enable weighted routing in API Gateway stages.

**C:** Create an alias for the Lambda function. Configure weighted routing on the alias. Specify a 10% weight for the new Lambda function version.

**D:** Set up a routing policy on a Network Load Balancer. Configure 10% of the traffic to go to the new Lambda function version.

**E:** Set up a weighted routing policy by using Amazon Route 53. Configure 10% of the traffic to go to the new Lambda function version.



**Answer: AC**

**Timestamp: 2024-11-07 14:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150942-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 436 discussion

A developer is creating a video search application for a global company. The video files have an average size of 2.5 TB. The video storage system must provide instant access to the video files for the first 90 days. After the first 90 days, the video files can take more than 10 minutes to load.

Which solution will meet these requirements MOST cost-effectively?

**A:** Upload the video files to the Amazon Elastic File System (Amazon EFS) Standard storage class for the first 90 days. After 90 days, transition the video files to the EFS Standard-Infrequent Access (Standard-IA) storage class.

**B:** Upload the video files to Amazon S3. Use the S3 Glacier Deep Archive storage class for the first 90 days. After 90 days, transition the video file to the S3 Glacier Flexible Retrieval storage class.

**C:** Use Amazon Elastic Block Store (Amazon EBS) to store the video files for the first 90 days. After 90 days, transition the video files to the Amazon S3 Glacier Deep Archive storage class.

**D:** Upload the video files to Amazon S3. Use the S3 Glacier Instant Retrieval storage class for the first 90 days. After 90 days, transition the video files to the S3 Glacier Flexible Retrieval storage class.



**Answer: D**

**Timestamp: 2024-11-18 12:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/151546-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 419 discussion

A developer needs to deploy the code for a new application on an AWS Lambda function. The application needs a dependency file that is 500 MB to run the business logic.

Which solution will meet these requirements?

**A:** Compress the application code and dependencies into a .zip file. Directly upload the .zip file as a deployment package for the Lambda function instead of copying the code.

**B:** Compress the application code and dependencies into a .zip file. Upload the .zip file to an Amazon S3 bucket. Configure the Lambda function to run the code from the .zip file in the S3 bucket.

**C:** Package the application code and dependencies into a container image. Upload the image to an Amazon S3 bucket. Configure the Lambda function to run the code in the image.

**D:** Package the application code and dependencies into a container image. Push the image to an Amazon Elastic Container Registry (Amazon ECR) repository. Deploy the image to the Lambda function.



**Answer: D**

**Timestamp: 2024-10-09 15:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148936-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 42 discussion

A development team wants to build a continuous integration/continuous delivery (CI/CD) pipeline. The team is using AWS CodePipeline to automate the code build and deployment. The team wants to store the program code to prepare for the CI/CD pipeline.
Which AWS service should the team use to store the program code?

**A:** AWS CodeDeploy

**B:** AWS CodeArtifact

**C:** AWS CodeCommit

**D:** Amazon CodeGuru



**Answer: C**

**Timestamp: 2023-03-26 02:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103914-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 420 discussion

A company is developing a publicly accessible single-page application. The application makes calls from a client web browser to backend services to provide a user interface to customers. The application depends on a third-party web service exposed as an HTTP API. The web client must provide an API key to the third-party web service by using the HTTP header as part of the HTTP request. The company's API key must not be exposed to the users of the web application.

Which solution will meet these requirements MOST cost-effectively?

**A:** Use Amazon API Gateway to create a private REST API. Create an HTTP integration to integrate with the third-party HTTP API. Add the company’s API key to the HTTP headers list of the integration request configuration.

**B:** Use Amazon API Gateway to create a private REST API. Create an AWS Lambda proxy integration. Make calls to the third-party HTTP API from the Lambda function. Pass the company's API key as an HTTP request header.

**C:** Use Amazon API Gateway to create a REST API. Create an HTTP integration to integrate with the third-party HTTP API. Add the company's API key to the HTTP headers list of the integration request configuration.

**D:** Use Amazon API Gateway to create a REST API. Create an AWS Lambda proxy integration. Make calls to the third-party HTTP API from the Lambda function. Pass the company's API key as an HTTP request header.



**Answer: C**

**Timestamp: 2024-09-03 17:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146857-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 421 discussion

A developer is setting up the deployment of application stacks to new test environments by using the AWS Cloud Development Kit (AWS CDK). The application contains the code for several AWS Lambda functions that will be deployed as assets. Each Lambda function is defined by using the AWS CDK Lambda construct library.

The developer has already successfully deployed the application stacks to the alpha environment in the first account by using the AWS CDK CLI's cdk deploy command. The developer is preparing to deploy to the beta environment in a second account for the first time. The developer makes no significant changes to the CDK code between deployments, but the initial deployment in the second account is unsuccessful and returns a NoSuchBucket error.

Which command should the developer run before redeployment to resolve this error?

**A:** cdk synth

**B:** cdk bootstrap

**C:** cdk init

**D:** cdk destroy



**Answer: B**

**Timestamp: 2024-09-03 17:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146859-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 422 discussion

A developer is automating a new application deployment with AWS Serverless Application Model (AWS SAM). The new application has one AWS Lambda function and one Amazon S3 bucket. The Lambda function must access the S3 bucket to only read objects.

How should the developer configure AWS SAM to grant the necessary read privilege to the S3 bucket?

**A:** Reference a second Lambda authorizer function.

**B:** Add a custom S3 bucket policy to the Lambda function.

**C:** Create an Amazon Simple Queue Service (SQS) topic for only S3 object reads. Reference the topic in the template.

**D:** Add the S3ReadPolicy template to the Lambda function's execution role.



**Answer: D**

**Timestamp: 2024-11-07 15:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150944-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 342 discussion

A company uses an AWS Lambda function to call a third-party service. The third-party service has a limit of requests each minute. If the number of requests exceeds the limit, the third-party service returns rate-limiting errors.

A developer needs to configure the Lambda function to avoid receiving rate limiting errors from the third-party service.

Which solution will meet these requirements?

**A:** Set the reserved concurrency on the Lambda function to match the number of concurrent requests that the third-party service allows.

**B:** Decrease the memory that is allocated to the Lambda function.

**C:** Set the provisioned concurrency on the Lambda function to match the number of concurrent requests that the third-party service allows.

**D:** Increase the timeout value that is specified on the Lambda function.



**Answer: A**

**Timestamp: 2024-03-23 04:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136966-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 343 discussion

A developer is building a new containerized application by using AWS Copilot. The developer uses the AWS Copilot command line interface (CLI) to deploy the application during development. The developer committed the application code to a new AWS CodeCommit repository. The developer must create an automated deployment process before releasing the new application to production.

What should the developer do to meet these requirements in the MOST operationally efficient way?

**A:** Create a buildspec file that invokes the AWS Copilot CLI commands to build and deploy the application. Use the AWS Copilot CLI to create an AWS CodePipeline that uses the CodeCommit repository in the source stage and AWS CodeBuild in the build stage.

**B:** Use the AWS Serverless Application Model (AWS SAM) CLI to bootstrap and initialize an AWS CodePipeline configuration. Use the CodeCommit repository as the source. Invoke the AWS Copilot CLI to build and deploy the application.

**C:** Use the AWS Copilot CLI to define the AWS Copilot pipeline and to deploy the AWS CodePipeline. Select CodeCommit as the source for the AWS CodePipeline.

**D:** Define an AWS CloudFormation template for an AWS CodePipeline with CodeCommit as the source. Configure the template as an AWS Copilot CLI add-on. Use the AWS Copilot CLI to deploy the application.



**Answer: C**

**Timestamp: 2024-03-23 04:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136967-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 344 discussion

A developer is creating a new application for a pet store. The application will manage customer rewards points. The developer will use Amazon DynamoDB to store the data for the application. The developer needs to optimize query performance and limit partition overload before actual performance analysis.

Which option should the developer use for a partition key to meet these requirements?

**A:** A randomly generated universally unique identifier (UUID)

**B:** The customer's full name

**C:** The date when the customer signed up for the rewards program

**D:** The name of the customer's pet



**Answer: A**

**Timestamp: 2024-03-23 04:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136968-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 345 discussion

A developer uses AWS IAM Identity Center (AWS Single Sign-On) to interact with the AWS CLI and AWS SDKs on a local workstation. API calls to AWS services were working when the SSO access was first configured. However, the developer is now receiving Access Denied errors. The developer has not changed any configuration files or scripts that were previously working on the workstation.

What is the MOST likely cause of the developer's access issue?

**A:** The access permissions to the developer's AWS CLI binary file have changed.

**B:** The permission set that is assumed by IAM Identity Center does not have the necessary permissions to complete the API call.

**C:** The credentials from the IAM Identity Center federated role have expired.

**D:** The developer is attempting to make API calls to the incorrect AWS account.



**Answer: C**

**Timestamp: 2024-03-23 04:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136969-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 346 discussion

A company is building a serverless application. The application uses an API key to authenticate with a third-party application. The company wants to store the external API key as a part of an AWS Lambda configuration. The company needs to have full control over the AWS Key Management Service (AWS KMS) keys that will encrypt the API key and should be visible only to authorized entities.

Which solution will meet these requirements?

**A:** Store the API key in AWS Systems Manager Parameter Store as a string parameter. Use the default AWS KMS key that AWS provides to encrypt the API key.

**B:** Store the API key in AWS Lambda environment variables. Create an AWS KMS customer managed key to encrypt the API key.

**C:** Store the API key in the code repository. Use an AWS managed key to encrypt the code repository.

**D:** Store the API key as an Amazon DynamoDB table record. Use an AWS managed key to encrypt the API key.



**Answer: B**

**Timestamp: 2024-03-23 04:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136970-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 502 discussion

A company generates SSL certificates from a third-party provider. The company imports the certificates into AWS Certificate Manager (ACM) to use with public web applications.

A developer must implement a solution to notify the company’s security team 90 days before an imported certificate expires. The company already has configured an Amazon Simple Queue Service (Amazon SQS) queue. The company also has configured an Amazon Simple Notification Service (Amazon SNS) topic that has the security team’s email address as a subscriber.

Which solution will provide the security team with the required notification about certificates?

**A:** Create an Amazon EventBridge rule that specifies the ACM Certificate Approaching Expiration event type. Set the SNS topic as the EventBridge rule’s target.

**B:** Create an AWS Lambda function to search for all certificates that are expiring within 90 days. Program the Lambda function to send each identified certificate’s Amazon Resource Name (ARN) in a message to the SQS queue.

**C:** Create an AWS Step Functions workflow that is invoked by each certificate’s expiration notification from AWS CloudTrail. Create an AWS Lambda function to send each certificate's Amazon Resource Name (ARN) in a message to the SQS queue.

**D:** Configure AWS Config with the acm-certificate-expiration-check managed rule to run every 24 hours. Create an Amazon EventBridge rule that includes an event pattern that specifies the Config Rules Compliance Change detail type and the configured rule. Set the SNS topic as the EventBridge rule’s target.



**Answer: A**

**Timestamp: 2024-12-10 04:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152774-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 503 discussion

A developer has an AWS Lambda function that needs to access an Amazon DynamoDB table named DailyOrders. The Lambda function must be able to perform read operations on the table. The Lambda function must not be able to perform write operations on the table.

The developer needs to create an IAM policy to associate with the Lambda function's execution role.

Which IAM policy statement will meet these requirements?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: D**

**Timestamp: 2024-12-10 04:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152775-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 504 discussion

A developer is working on a new authorization mechanism for an application. The developer must create an Amazon API Gateway API and must test JSON Web Token (JWT) authorization on the API.

The developer must use the built-in authorizer and must avoid managing the code with custom logic. The developer needs to define an API route that is available at /auth to test the authorizer configuration.

Which solution will meet these requirements?

**A:** Create a WebSocket API and the /auth route. Configure and attach the JWT authorizer to the API. Deploy the API.

**B:** Create a WebSocket API and the /auth route. Create and configure an AWS Lambda authorizer. Attach the Lambda authorizer to the API. Deploy the API.

**C:** Create an HTTP API and the /auth route. Create and configure an AWS Lambda authorizer. Attach the Lambda authorizer to the /auth route. Deploy the API.

**D:** Create an HTTP API and the /auth route. Configure the JWT authorizer. Attach the JWT authorizer to the /auth route. Deploy the API.



**Answer: D**

**Timestamp: 2024-12-10 04:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152776-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 505 discussion

A company is creating a new application that gives users the ability to upload and share short video files. The average size of the video files is 10 MB. After a user uploads a file, a message needs to be placed into an Amazon Simple Queue Service (Amazon SQS) queue so the file can be processed. The files need to be accessible for processing within 5 minutes.

Which solution will meet these requirements MOST cost-effectively?

**A:** Write the files to Amazon S3 Glacier Deep Archive. Add the S3 location of the files to the SQS queue.

**B:** Write the files to Amazon S3 Standard. Add the S3 location of the files to the SQS queue.

**C:** Write the files to an Amazon Elastic Block Store (Amazon EBS) General Purpose SSD volume. Add the EBS location of the files to the SQS queue.

**D:** Write messages that contain the contents of the uploaded files to the SQS queue.



**Answer: B**

**Timestamp: 2024-12-10 04:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152777-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 506 discussion

A developer is updating the code for an AWS Lambda function to add new capabilities. The Lambda function has version aliases for production and development environments that run separate versions of the function. The developer needs to configure a staging environment for the Lambda function to handle invocations to both the development version and the production version.

Which solution will meet these requirements?

**A:** Create a weighted alias that references the production version of the function and the updated version of the function.

**B:** Add a Network Load Balancer. Add the production version of the function and updated version of the function as targets.

**C:** Use AWS CodeDeploy to create a linear traffic shifting deployment

**D:** Create a tag for the Lambda function that contains the production version and updated version of the code.



**Answer: A**

**Timestamp: 2024-12-10 04:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152778-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 438 discussion

A company has a virtual reality (VR) game. The game has a serverless backend that consists of Amazon API Gateway, AWS Lambda, and Amazon DynamoDB. Recently, the company noticed a sudden increase of new users globally. The company also noticed delays in the retrieval of user data.

Which AWS service or feature can the company use to reduce the database response time to microseconds?

**A:** Amazon ElastiCache

**B:** DynamoDB Accelerator (DAX)

**C:** DynamoDB auto scaling

**D:** Amazon CloudFront



**Answer: B**

**Timestamp: 2024-11-07 12:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150938-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 439 discussion

A developer is creating a solution to track an account's Amazon S3 buckets over time. The developer has created an AWS Lambda function that will run on a schedule. The function will list the account's S3 buckets and will store the list in an Amazon DynamoDB table. The developer receives a permissions error when the developer runs the function with the AWSLambdaBasicExecutionRole AWS managed policy.

Which combination of permissions should the developer use to resolve this error? (Choose two.)

**A:** Cross-account IAM role

**B:** Permission for the Lambda function to list buckets in Amazon S3

**C:** Permission for the Lambda function to write in DynamoDB

**D:** Permission for Amazon S3 to invoke the Lambda function

**E:** Permission for DynamoDB to invoke the Lambda function



**Answer: BC**

**Timestamp: 2024-10-10 07:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148957-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 44 discussion

A developer is designing a serverless application with two AWS Lambda functions to process photos. One Lambda function stores objects in an Amazon S3 bucket and stores the associated metadata in an Amazon DynamoDB table. The other Lambda function fetches the objects from the S3 bucket by using the metadata from the DynamoDB table. Both Lambda functions use the same Python library to perform complex computations and are approaching the quota for the maximum size of zipped deployment packages.
What should the developer do to reduce the size of the Lambda deployment packages with the LEAST operational overhead?

**A:** Package each Python library in its own .zip file archive. Deploy each Lambda function with its own copy of the library.

**B:** Create a Lambda layer with the required Python library. Use the Lambda layer in both Lambda functions.

**C:** Combine the two Lambda functions into one Lambda function. Deploy the Lambda function as a single .zip file archive.

**D:** Download the Python library to an S3 bucket. Program the Lambda functions to reference the object URLs.



**Answer: B**

**Timestamp: 2023-03-26 02:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103916-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 440 discussion

A company uses AWS to run its learning management system (LMS) application. The application runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The application's domain name is managed in Amazon Route 53. The application is deployed in a single AWS Region, but the company wants to improve application performance for users all over the world.

Which solution will improve global performance with the LEAST operational overhead?

**A:** Set up an Amazon CloudFront distribution that uses the ALB as the origin server. Configure Route 53 to create a DNS alias record that points the application's domain name to the CloudFront distribution URL.

**B:** Launch more EC2 instances behind the ALConfigure the ALB to use session affinity (sticky sessions). Create a Route 53 alias record for the ALB by using a geolocation routing policy.

**C:** Create an AWS Client VPN endpoint in the VPInstruct users to connect to the VPN to access the application. Create a Route 53 alias record for the VPN endpoint. Configure Route 53 to use a geolocation routing policy.

**D:** Deploy the application to multiple Regions across the world. Create a Route 53 alias record for the ALB by using a latency-based routing policy.



**Answer: A**

**Timestamp: 2024-10-10 08:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148958-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 441 discussion

A developer hosts a static website on Amazon S3 and connects the website to an Amazon CloudFront distribution. The website uses a custom domain name that points to the CloudFront URL.

The developer has set up a continuous integration and continuous delivery (CI/CD) pipeline. The pipeline automatically runs when changes occur in an AWS CodeCommit repository. The pipeline has a source stage and then a build stage. The build stage invokes an AWS CodeBuild project that references a buildspec.yml file. The buildspec.yml file builds the code and deploys the static files to the S3 bucket.

The pipeline runs successfully, and the latest website files are visible in the S3 bucket and at the S3 website URL. However, when the developer accesses the website through the CloudFront domain, the updates are not reflected on the website.

What should the developer configure the buildspec.yml file to do to resolve this issue?

**A:** Properly synchronize the objects in the S3 bucket with new files from the source stage.

**B:** Delete the previous website files in the S3 bucket and redeploy the website files.

**C:** Invalidate the file caches for the primary CloudFront distribution.

**D:** Modify the cross-origin resource sharing (CORS) policy of the S3 bucket and redeploy the website files.



**Answer: C**

**Timestamp: 2024-10-10 08:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148959-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 211 discussion

A developer is creating an AWS Lambda function that will generate and export a file. The function requires 100 MB of temporary storage for temporary files while running. These files will not be needed after the function is complete.

How can the developer MOST efficiently handle the temporary files?

**A:** Store the files in Amazon Elastic Block Store (Amazon EBS) and delete the files at the end of the Lambda function.

**B:** Copy the files to Amazon Elastic File System (Amazon EFS) and delete the files at the end of the Lambda function.

**C:** Store the files in the /tmp directory and delete the files at the end of the Lambda function.

**D:** Copy the files to an Amazon S3 bucket with a lifecycle policy to delete the files.



**Answer: C**

**Timestamp: 2023-10-27 21:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124750-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 212 discussion

A company uses Amazon DynamoDB as a data store for its order management system. The company frontend application stores orders in a DynamoDB table. The DynamoDB table is configured to send change events to a DynamoDB stream. The company uses an AWS Lambda function to log and process the incoming orders based on data from the DynamoDB stream.

An operational review reveals that the order quantity of incoming orders is sometimes set to 0. A developer needs to create a dashboard that will show how many unique customers this problem affects each day.

What should the developer do to implement the dashboard?

**A:** Grant the Lambda function’s execution role permissions to upload logs to Amazon CloudWatch Logs. Implement a CloudWatch Logs Insights query that selects the number of unique customers for orders with order quantity equal to 0 and groups the results in 1-day periods. Add the CloudWatch Logs Insights query to a CloudWatch dashboard.

**B:** Use Amazon Athena to query AWS CloudTrail API logs for API calls. Implement an Athena query that selects the number of unique customers for orders with order quantity equal to 0 and groups the results in 1-day periods. Add the Athena query to an Amazon CloudWatch dashboard.

**C:** Configure the Lambda function to send events to Amazon EventBridge. Create an EventBridge rule that groups the number of unique customers for orders with order quantity equal to 0 in 1-day periods. Add a CloudWatch dashboard as the target of the rule.

**D:** Turn on custom Amazon CloudWatch metrics for the DynamoDB stream of the DynamoDB table. Create a CloudWatch alarm that groups the number of unique customers for orders with order quantity equal to 0 in 1-day periods. Add the CloudWatch alarm to a CloudWatch dashboard.



**Answer: A**

**Timestamp: 2023-10-28 03:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124765-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 213 discussion

A developer needs to troubleshoot an AWS Lambda function in a development environment. The Lambda function is configured in VPC mode and needs to connect to an existing Amazon RDS for SQL Server DB instance. The DB instance is deployed in a private subnet and accepts connections by using port 1433.

When the developer tests the function, the function reports an error when it tries to connect to the database.

Which combination of steps should the developer take to diagnose this issue? (Choose two.)

**A:** Check that the function’s security group has outbound access on port 1433 to the DB instance’s security group. Check that the DB instance’s security group has inbound access on port 1433 from the function’s security group.

**B:** Check that the function’s security group has inbound access on port 1433 from the DB instance’s security group. Check that the DB instance’s security group has outbound access on port 1433 to the function’s security group.

**C:** Check that the VPC is set up for a NAT gateway. Check that the DB instance has the public access option turned on.

**D:** Check that the function’s execution role permissions include rds:DescribeDBInstances, rds:ModifyDBInstance. and rds:DescribeDBSecurityGroups for the DB instance.

**E:** Check that the function’s execution role permissions include ec2:CreateNetworkInterface, ec2:DescribeNetworkInterfaces, and ec2:DeleteNetworkInterface.



**Answer: AE**

**Timestamp: 2023-10-28 08:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124780-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 214 discussion

A developer needs to launch a new Amazon EC2 instance by using the AWS CLI.

Which AWS CLI command should the developer use to meet this requirement?

**A:** aws ec2 bundle-instance

**B:** aws ec2 start-instances

**C:** aws ec2 confirm-product-instance

**D:** aws ec2 run-instances



**Answer: D**

**Timestamp: 2023-10-28 08:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124777-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 215 discussion

A developer needs to manage AWS infrastructure as code and must be able to deploy multiple identical copies of the infrastructure, stage changes, and revert to previous versions.

Which approach addresses these requirements?

**A:** Use cost allocation reports and AWS OpsWorks to deploy and manage the infrastructure.

**B:** Use Amazon CloudWatch metrics and alerts along with resource tagging to deploy and manage the infrastructure.

**C:** Use AWS Elastic Beanstalk and AWS CodeCommit to deploy and manage the infrastructure.

**D:** Use AWS CloudFormation and AWS CodeCommit to deploy and manage the infrastructure.



**Answer: D**

**Timestamp: 2023-10-28 08:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124776-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 476 discussion

A company has an ecommerce application. The application's API sends order data to an Amazon Simple Queue Service (Amazon SOS) queue. A developer needs to modify the application to enrich the order data before the application sends the order data to a fulfillment system.

Which solution will meet this requirement with the LEAST development effort?

**A:** Create an AWS Lambda function to poll the SOS queue. enrich the message data, and send the enriched data to the fulfilment system, Create an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the Lambda function to the SNS topic.

**B:** Create an AWS Step Functions state machine. Configure an Amazon EventBridge rule to run the state machine when an order is published to the SQS queue. Map the orders to an AWS Lambda function. Program the Lambda function to perform the data enrichment and to invoke the state machine. Configure the last step of the state machine to send the enriched data to the fulfilment system,

**C:** Create an Amazon EMR cluster to read messages from the SQS queue. Configure an EMR job to enrich the order data. Create and configure an Amazon S3 bucket as the output location. Adjust the order fulfilment system to retrieve the enriched files from the S3 bucket.

**D:** Create an Amazon EventBridge pipe that uses event enrichment. Configure the SQS queue as a source for the pipe. Set the fulfillment system as the target of the pipe.



**Answer: D**

**Timestamp: 2024-12-18 03:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153146-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 477 discussion

An application interacts with Amazon Aurora to store and track customer information. The primary database is set up with multiple read replicas for improving the performance of the read queries. However, one of the Aurora replicas is receiving most or all of the traffic, while the other Aurora replica remains idle.

How can this issue be resolved?

**A:** Disable application-level DNS caching.

**B:** Enable application-level DNS caching.

**C:** Enable application pooling

**D:** Disable application pooling



**Answer: A**

**Timestamp: 2024-12-13 03:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152952-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 478 discussion

A company runs continuous integration/continuous delivery (CI/CD) pipelines for its application on AWS CodePipeline. A developer must write unit tests and run them as part of the pipelines before staging the artifacts for testing.

How should the developer incorporate unit tests as part of CI/CD pipelines?

**A:** Create a separate CodePipeline pipeline to run unit tests.

**B:** Update the AWS CodeBuild build specification to include a phase for running unit tests.

**C:** Install the AWS CodeDeploy agent on an Amazon EC2 instance to run unit tests.

**D:** Create a testing branch in a git repository for the pipelines to run unit tests.



**Answer: B**

**Timestamp: 2025-02-17 09:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156650-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 479 discussion

A developer is troubleshooting a three-tier application, which is deployed on Amazon EC2 instances. There is a connectivity problem between the application servers and the database servers.

Which AWS services or tools should be used to identity the faulty component? (Choose two.)

**A:** AWS CloudTrail

**B:** AWS Trusted Advisor

**C:** Amazon VPC Flow Logs

**D:** Network access control lists

**E:** AWS Config rules



**Answer: CD**

**Timestamp: 2025-02-17 09:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156651-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 48 discussion

A developer is creating an AWS Lambda function that needs credentials to connect to an Amazon RDS for MySQL database. An Amazon S3 bucket currently stores the credentials. The developer needs to improve the existing solution by implementing credential rotation and secure storage. The developer also needs to provide integration with the Lambda function.
Which solution should the developer use to store and retrieve the credentials with the LEAST management overhead?

**A:** Store the credentials in AWS Systems Manager Parameter Store. Select the database that the parameter will access. Use the default AWS Key Management Service (AWS KMS) key to encrypt the parameter. Enable automatic rotation for the parameter. Use the parameter from Parameter Store on the Lambda function to connect to the database.

**B:** Encrypt the credentials with the default AWS Key Management Service (AWS KMS) key. Store the credentials as environment variables for the Lambda function. Create a second Lambda function to generate new credentials and to rotate the credentials by updating the environment variables of the first Lambda function. Invoke the second Lambda function by using an Amazon EventBridge rule that runs on a schedule. Update the database to use the new credentials. On the first Lambda function, retrieve the credentials from the environment variables. Decrypt the credentials by using AWS KMS, Connect to the database.

**C:** Store the credentials in AWS Secrets Manager. Set the secret type to Credentials for Amazon RDS database. Select the database that the secret will access. Use the default AWS Key Management Service (AWS KMS) key to encrypt the secret. Enable automatic rotation for the secret. Use the secret from Secrets Manager on the Lambda function to connect to the database.

**D:** Encrypt the credentials by using AWS Key Management Service (AWS KMS). Store the credentials in an Amazon DynamoDB table. Create a second Lambda function to rotate the credentials. Invoke the second Lambda function by using an Amazon EventBridge rule that runs on a schedule. Update the DynamoDB table. Update the database to use the generated credentials. Retrieve the credentials from DynamoDB with the first Lambda function. Connect to the database.



**Answer: C**

**Timestamp: 2023-03-26 02:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103918-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 329 discussion

A developer is storing many objects in a single Amazon S3 bucket. The developer needs to optimize the S3 bucket for high request rates.

How should the developer store the objects to meet this requirement?

**A:** Store the objects by using S3 Intelligent-Tiering.

**B:** Store the objects at the root of the S3 bucket.

**C:** Store the objects by using object key names distributed across multiple prefixes.

**D:** Store each object with an object tag named "prefix" that contains a unique value.



**Answer: C**

**Timestamp: 2024-03-19 14:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136628-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 33 discussion

A developer is creating an application that includes an Amazon API Gateway REST API in the us-east-2 Region. The developer wants to use Amazon CloudFront and a custom domain name for the API. The developer has acquired an SSL/TLS certificate for the domain from a third-party provider.
How should the developer configure the custom domain for the application?

**A:** Import the SSL/TLS certificate into AWS Certificate Manager (ACM) in the same Region as the API. Create a DNS A record for the custom domain.

**B:** Import the SSL/TLS certificate into CloudFront. Create a DNS CNAME record for the custom domain.

**C:** Import the SSL/TLS certificate into AWS Certificate Manager (ACM) in the same Region as the API. Create a DNS CNAME record for the custom domain.

**D:** Import the SSL/TLS certificate into AWS Certificate Manager (ACM) in the us-east-1 Region. Create a DNS CNAME record for the custom domain.



**Answer: D**

**Timestamp: 2023-03-23 13:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103664-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 330 discussion

A company deploys a new application to AWS. The company is streaming application logs to Amazon CloudWatch Logs. The company's development team must receive notification by email when the word "ERROR" appears in any log lines. A developer sets up an Amazon Simple Notification Service (Amazon SNS) topic and subscribes the development team to the topic.

What should the developer do next to meet the requirements?

**A:** Select the appropriate log group. Create a CloudWatch metric filter with "ERROR" as the search term. Create an alarm on this metric that notifies the SNS topic when the metric is 1 or higher.

**B:** In CloudWatch Logs Insights, select the appropriate log group. Create a metric query to search for the term "ERROR" in the logs. Create an alarm on this metric that notifies the SNS topic when the metric is 1 or higher.

**C:** Select the appropriate log group. Create an SNS subscription filter with "ERROR" as the filter pattern. Select the SNS topic as the destination.

**D:** Create a CloudWatch alarm that includes "ERROR" as a filter pattern, a log group dimension that defines the appropriate log group, and a destination that notifies the SNS topic.



**Answer: A**

**Timestamp: 2024-03-19 14:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136632-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 331 discussion

A company uses Amazon Simple Queue Service (Amazon SQS) to decouple its microservices architecture. Some messages in an SQS queue contain sensitive information. A developer must implement a solution that encrypts all the data at rest.

Which solution will meet this requirement?

**A:** Enable server-side encryption for the SQS queue by using an SQS managed encryption key (SSE-SQS).

**B:** Use the aws:SecureTransport condition in the queue policy to ensure that only HTTPS (TLS) is used for all requests to the SQS queue.

**C:** Use AWS Certificate Manager (ACM) to generate an SSL/TLS certificate. Reference the certificate when messages are sent to the queue.

**D:** Set a message attribute in the SQS SendMessage request for messages that are sent to the queue. Set the Name to ENCRYPT. Set the Value to TRUE.



**Answer: A**

**Timestamp: 2024-03-19 14:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136633-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 332 discussion

A company recently deployed a new serverless user portal. Users have reported that part of the portal is slow. The initial analysis found a single Amazon API Gateway endpoint that is responsible for the performance issues. The endpoint integrates with an AWS Lambda function. However, the Lambda function interacts with other APIs and AWS services.

How can a developer find the source of the increased response time by using operational best practices?

**A:** Update the Lambda function by adding logging statements with high-precision timestamps before and after each external request. Deploy the updated Lambda function. After accumulating enough usage data, examine the Amazon CloudWatch logs for the Lambda function to determine the likely sources for the increased response time.

**B:** Instrument the Lambda function with the AWS X-Ray SDK. Add HTTP and HTTPS interceptors and SDK client handlers. Deploy the updated Lambda function. Turn on X-Ray tracing. After accumulating enough usage data, use the X-Ray service map to examine the average response times to determine the likely sources.

**C:** Review the Lambda function's Amazon CloudWatch metrics by using the metrics explorer. Apply anomaly detection to the Duration metric and the Throttles metric. Review the anomalies to determine the likely sources.

**D:** Use Amazon CloudWatch Synthetics to create a new canary. Turn on AWS X-Ray tracing on the canary. Configure the canary to scan the user portal. After accumulating enough usage data, use the CloudWatch Synthetics canary dashboard to view the metrics from the canary.



**Answer: B**

**Timestamp: 2024-03-19 14:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136634-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 207 discussion

A developer is building a serverless application that connects to an Amazon Aurora PostgreSQL database. The serverless application consists of hundreds of AWS Lambda functions. During every Lambda function scale out, a new database connection is made that increases database resource consumption.

The developer needs to decrease the number of connections made to the database. The solution must not impact the scalability of the Lambda functions.

Which solution will meet these requirements?

**A:** Configure provisioned concurrency for each Lambda function by setting the ProvisionedConcurrentExecutions parameter to 10.

**B:** Enable cluster cache management for Aurora PostgreSQL. Change the connection string of each Lambda function to point to cluster cache management.

**C:** Use Amazon RDS Proxy to create a connection pool to manage the database connections. Change the connection string of each Lambda function to reference the proxy.

**D:** Configure reserved concurrency for each Lambda function by setting the ReservedConcurrentExecutions parameter to 10.



**Answer: C**

**Timestamp: 2023-10-06 03:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122629-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 208 discussion

A developer is preparing to begin development of a new version of an application. The previous version of the application is deployed in a production environment. The developer needs to deploy fixes and updates to the current version during the development of the new version of the application. The code for the new version of the application is stored in AWS CodeCommit.

Which solution will meet these requirements?

**A:** From the main branch, create a feature branch for production bug fixes. Create a second feature branch from the main branch for development of the new version.

**B:** Create a Git tag of the code that is currently deployed in production. Create a Git tag for the development of the new version. Push the two tags to the CodeCommit repository.

**C:** From the main branch, create a branch of the code that is currently deployed in production. Apply an IAM policy that ensures no other users can push or merge to the branch.

**D:** Create a new CodeCommit repository for development of the new version of the application. Create a Git tag for the development of the new version.



**Answer: A**

**Timestamp: 2023-10-06 03:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122630-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 209 discussion

A developer is creating an AWS CloudFormation stack. The stack contains IAM resources with custom names. When the developer tries to deploy the stack, they receive an InsufficientCapabilities error.

What should the developer do to resolve this issue?

**A:** Specify the CAPABILITY_AUTO_EXPAND capability in the CloudFormation stack.

**B:** Use an administrators role to deploy IAM resources with CloudFormation.

**C:** Specify the CAPABILITY_IAM capability in the CloudFormation stack.

**D:** Specify the CAPABILITY_NAMED_IAM capability in the CloudFormation stack.



**Answer: D**

**Timestamp: 2023-10-06 03:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122631-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 21 discussion

A developer maintains an Amazon API Gateway REST API. Customers use the API through a frontend UI and Amazon Cognito authentication.
The developer has a new version of the API that contains new endpoints and backward-incompatible interface changes. The developer needs to provide beta access to other developers on the team without affecting customers.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Define a development stage on the API Gateway API. Instruct the other developers to point the endpoints to the development stage.

**B:** Define a new API Gateway API that points to the new API application code. Instruct the other developers to point the endpoints to the new API.

**C:** Implement a query parameter in the API application code that determines which code version to call.

**D:** Specify new API Gateway endpoints for the API endpoints that the developer wants to add.



**Answer: A**

**Timestamp: 2023-03-17 09:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102899-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 210 discussion

A company uses Amazon API Gateway to expose a set of APIs to customers. The APIs have caching enabled in API Gateway. Customers need a way to invalidate the cache for each API when they test the API.

What should a developer do to give customers the ability to invalidate the API cache?

**A:** Ask the customers to use AWS credentials to call the InvalidateCache API operation.

**B:** Attach an InvalidateCache policy to the IAM execution role that the customers use to invoke the API. Ask the customers to send a request that contains the Cache-Control:max-age=0 HTTP header when they make an API call.

**C:** Ask the customers to use the AWS SDK API Gateway class to invoke the InvalidateCache API operation.

**D:** Attach an InvalidateCache policy to the IAM execution role that the customers use to invoke the API. Ask the customers to add the INVALIDATE_CACHE query string parameter when they make an API call.



**Answer: B**

**Timestamp: 2023-10-06 03:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122632-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 467 discussion

A developer compiles an AWS Lambda function and packages the result as a .zip file. The developer uses the Functions page on the Lambda console to attempt to upload the local packaged .zip file. When pushing the package ta Lambda, the console returns the following error:

//IMG//


Which solutions can the developer use to publish the code? (Choose two.)

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image29.png

**A:** Upload the package to Amazon 3. Use the Functions page on the Lambda console to upload the package from the S3 location.

**B:** Create an AWS Support ticket to increase the maximum package size.

**C:** Use the update-function-code AWS CLI command. Pass the --publish parameter.

**D:** Repackage the Lambda function as a Docker container image. Upload the image to Amazon Elastic Container Registry (Amazon ECR). Create a new Lambda function by using the Lambda console. Reference the image that is deployed to Amazon ECR.

**E:** Sign the .zip file digitally. Create a new Lambda function by using the Lambda console. Update the configuration of the new Lambda function to include the Amazon Resource Name (ARN) of the code signing configuration.



**Answer: AD**

**Timestamp: 2025-02-17 09:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156645-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 468 discussion

A company runs an application on Amazon EC2 instances in an Auto Scaling group. The application experiences variable loads throughout each day.

The company needs to collect detailed metrics from the EC2 instances to right-size the instances. The company also wants to monitor custom application metrics to ensure the application is performing efficiently.

Which solution will meet these requirements?

**A:** Install the AWS X-Ray agent on the instances. Configure the agent to collect the EC2 instance metrics and the custom application metrics.

**B:** Install the Amazon CloudWatch agent on the instances. Configure the agent to collect the EC2 instance metrics and the custom application metrics.

**C:** Install the AWS SDK in the application’s cade. Update the application to use the AWS SDK to collect and publish the EC2 instance metrics and the custom application metrics.

**D:** Configure AWS CloudTrail to capture and analyze the EC2 instance metrics and the custom application metrics.



**Answer: B**

**Timestamp: 2025-02-17 09:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156646-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 469 discussion

A developer is creating an application that uses an Amazon DynamoDB table. The developer needs to develop code that reads all records that were added to the table during the previous day, creates HTML reports, and pushes the reports into third-party storage. The item size varies from 1 KB to 4 KB, and the index structure is defined with the date. The developer needs to minimize the read capacity that the application requires from the DynamoDB table.

Which DynamoDB API operation should the developer use in the code to meet these requirements?

**A:** Query

**B:** Scan

**C:** BatchGetItem

**D:** GetItem



**Answer: A**

**Timestamp: 2024-12-18 03:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153145-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 47 discussion

An application uses an Amazon EC2 Auto Scaling group. A developer notices that EC2 instances are taking a long time to become available during scale-out events. The UserData script is taking a long time to run.
The developer must implement a solution to decrease the time that elapses before an EC2 instance becomes available. The solution must make the most recent version of the application available at all times and must apply all available security updates. The solution also must minimize the number of images that are created. The images must be validated.
Which combination of steps should the developer take to meet these requirements? (Choose two.)

**A:** Use EC2 Image Builder to create an Amazon Machine Image (AMI). Install all the patches and agents that are needed to manage and run the application. Update the Auto Scaling group launch configuration to use the AMI.

**B:** Use EC2 Image Builder to create an Amazon Machine Image (AMI). Install the latest version of the application and all the patches and agents that are needed to manage and run the application. Update the Auto Scaling group launch configuration to use the AMI.

**C:** Set up AWS CodeDeploy to deploy the most recent version of the application at runtime.

**D:** Set up AWS CodePipeline to deploy the most recent version of the application at runtime.

**E:** Remove any commands that perform operating system patching from the UserData script.



**Answer: AC**

**Timestamp: 2023-03-24 02:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103721-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 470 discussion

A company is launching a feature that uses an HTTP API built with Amazon API Gateway and AWS Lambda. An API Gateway endpoint performs several independent tasks that run in a Lambda function. The independent tasks can take up to 10 minutes in total to finish running.

Users report that the endpoint sometimes returns an HTTP 604 status code. The Lambda function invocations are successful.

Which solution will stop the endpoint from returning the HTTP 504 status cade?

**A:** Increase the Lambda function’s timeout value.

**B:** Increase the reserved concurrency of the Lambda function.

**C:** Increase the memory that is available to the Lambda function.

**D:** Refactor the Lambda function to start an AWS Step Functions state machine.



**Answer: D**

**Timestamp: 2025-02-17 09:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156647-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 135 discussion

A company created four AWS Lambda functions that connect to a relational database server that runs on an Amazon RDS instance. A security team requires the company to automatically change the database password every 30 days.

Which solution will meet these requirements MOST securely?

**A:** Store the database credentials in the environment variables of the Lambda function. Deploy the Lambda function with the new credentials every 30 days.

**B:** Store the database credentials in AWS Secrets Manager. Configure a 30-day rotation schedule for the credentials.

**C:** Store the database credentials in AWS Systems Manager Parameter Store secure strings. Configure a 30-day schedule for the secure strings.

**D:** Store the database credentials in an Amazon S3 bucket that uses server-side encryption with customer-provided encryption keys (SSE-C). Configure a 30-day key rotation schedule for the customer key.



**Answer: B**

**Timestamp: 2023-08-04 13:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117333-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 136 discussion

A developer is setting up a deployment pipeline. The pipeline includes an AWS CodeBuild build stage that requires access to a database to run integration tests. The developer is using a buildspec.yml file to configure the database connection. Company policy requires automatic rotation of all database credentials.

Which solution will handle the database credentials MOST securely?

**A:** Retrieve the credentials from variables that are hardcoded in the buildspec.yml file. Configure an AWS Lambda function to rotate the credentials.

**B:** Retrieve the credentials from an environment variable that is linked to a SecureString parameter in AWS Systems Manager Parameter Store. Configure Parameter Store for automatic rotation.

**C:** Retrieve the credentials from an environment variable that is linked to an AWS Secrets Manager secret. Configure Secrets Manager for automatic rotation.

**D:** Retrieve the credentials from an environment variable that contains the connection string in plaintext. Configure an Amazon EventBridge event to rotate the credentials.



**Answer: C**

**Timestamp: 2023-08-04 13:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117332-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 137 discussion

A company is developing a serverless multi-tier application on AWS. The company will build the serverless logic tier by using Amazon API Gateway and AWS Lambda.
While the company builds the logic tier, a developer who works on the frontend of the application must develop integration tests. The tests must cover both positive and negative scenarios, depending on success and error HTTP status codes.

Which solution will meet these requirements with the LEAST effort?

**A:** Set up a mock integration for API methods in API Gateway. In the integration request from Method Execution, add simple logic to return either a success or error based on HTTP status code. In the integration response, add messages that correspond to the HTTP status codes.

**B:** Create two mock integration resources for API methods in API Gateway. In the integration request, return a success HTTP status code for one resource and an error HTTP status code for the other resource. In the integration response, add messages that correspond to the HTTP status codes.

**C:** Create Lambda functions to perform tests. Add simple logic to return either success or error, based on the HTTP status codes. Build an API Gateway Lambda integration. Select appropriate Lambda functions that correspond to the HTTP status codes.

**D:** Create a Lambda function to perform tests. Add simple logic to return either success or error-based HTTP status codes. Create a mock integration in API Gateway. Select the Lambda function that corresponds to the HTTP status codes.



**Answer: A**

**Timestamp: 2023-08-04 13:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117331-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 138 discussion

Users are reporting errors in an application. The application consists of several microservices that are deployed on Amazon Elastic Container Service (Amazon ECS) with AWS Fargate.

Which combination of steps should a developer take to fix the errors? (Choose two.)

**A:** Deploy AWS X-Ray as a sidecar container to the microservices. Update the task role policy to allow access to the X-Ray API.

**B:** Deploy AWS X-Ray as a daemonset to the Fargate cluster. Update the service role policy to allow access to the X-Ray API.

**C:** Instrument the application by using the AWS X-Ray SDK. Update the application to use the PutXrayTrace API call to communicate with the X-Ray API.

**D:** Instrument the application by using the AWS X-Ray SDK. Update the application to communicate with the X-Ray daemon.

**E:** Instrument the ECS task to send the stdout and stderr output to Amazon CloudWatch Logs. Update the task role policy to allow the cloudwatch:PullLogs action.



**Answer: A**

**Timestamp: 2023-08-10 14:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117795-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 139 discussion

A developer is creating an application for a company. The application needs to read the file doc.txt that is placed in the root folder of an Amazon S3 bucket that is named DOC-EXAMPLE-BUCKET. The company’s security team requires the principle of least privilege to be applied to the application’s IAM policy.

Which IAM policy statement will meet these security requirements?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: A**

**Timestamp: 2023-08-06 15:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117476-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 94 discussion

A developer has written an application that runs on Amazon EC2 instances. The developer is adding functionality for the application to write objects to an Amazon S3 bucket.

Which policy must the developer modify to allow the instances to write these objects?

**A:** The IAM policy that is attached to the EC2 instance profile role

**B:** The session policy that is applied to the EC2 instance role session

**C:** The AWS Key Management Service (AWS KMS) key policy that is attached to the EC2 instance profile role

**D:** The Amazon VPC endpoint policy



**Answer: A**

**Timestamp: 2023-05-14 19:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109241-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 95 discussion

A developer is leveraging a Border Gateway Protocol (BGP)-based AWS VPN connection to connect from on-premises to Amazon EC2 instances in the developer's account. The developer is able to access an EC2 instance in subnet A, but is unable to access an EC2 instance in subnet B in the same VPC.

Which logs can the developer use to verify whether the traffic is reaching subnet B?

**A:** VPN logs

**B:** BGP logs

**C:** VPC Flow Logs

**D:** AWS CloudTrail logs



**Answer: C**

**Timestamp: 2023-05-08 14:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108742-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 96 discussion

A developer is creating a service that uses an Amazon S3 bucket for image uploads. The service will use an AWS Lambda function to create a thumbnail of each image. Each time an image is uploaded, the service needs to send an email notification and create the thumbnail. The developer needs to configure the image processing and email notifications setup.

Which solution will meet these requirements?

**A:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Configure S3 event notifications with a destination of the SNS topic. Subscribe the Lambda function to the SNS topic. Create an email notification subscription to the SNS topic.

**B:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Configure S3 event notifications with a destination of the SNS topic. Subscribe the Lambda function to the SNS topic. Create an Amazon Simple Queue Service (Amazon SQS) queue. Subscribe the SQS queue to the SNS topic. Create an email notification subscription to the SQS queue.

**C:** Create an Amazon Simple Queue Service (Amazon SQS) queue. Configure S3 event notifications with a destination of the SQS queue. Subscribe the Lambda function to the SQS queue. Create an email notification subscription to the SQS queue.

**D:** Create an Amazon Simple Queue Service (Amazon SQS) queue. Send S3 event notifications to Amazon EventBridge. Create an EventBridge rule that runs the Lambda function when images are uploaded to the S3 bucket. Create an EventBridge rule that sends notifications to the SQS queue. Create an email notification subscription to the SQS queue.



**Answer: A**

**Timestamp: 2023-04-21 20:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106946-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 97 discussion

A developer has designed an application to store incoming data as JSON files in Amazon S3 objects. Custom business logic in an AWS Lambda function then transforms the objects, and the Lambda function loads the data into an Amazon DynamoDB table. Recently, the workload has experienced sudden and significant changes in traffic. The flow of data to the DynamoDB table is becoming throttled.

The developer needs to implement a solution to eliminate the throttling and load the data into the DynamoDB table more consistently.

Which solution will meet these requirements?

**A:** Refactor the Lambda function into two functions. Configure one function to transform the data and one function to load the data into the DynamoDB table. Create an Amazon Simple Queue Service (Amazon SQS) queue in between the functions to hold the items as messages and to invoke the second function.

**B:** Turn on auto scaling for the DynamoDB table. Use Amazon CloudWatch to monitor the table's read and write capacity metrics and to track consumed capacity.

**C:** Create an alias for the Lambda function. Configure provisioned concurrency for the application to use.

**D:** Refactor the Lambda function into two functions. Configure one function to store the data in the DynamoDB table. Configure the second function to process the data and update the items after the data is stored in DynamoDB. Create a DynamoDB stream to invoke the second function after the data is stored.



**Answer: A**

**Timestamp: 2023-04-21 21:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106947-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 98 discussion

A developer is creating an AWS Lambda function in VPC mode. An Amazon S3 event will invoke the Lambda function when an object is uploaded into an S3 bucket. The Lambda function will process the object and produce some analytic results that will be recorded into a file. Each processed object will also generate a log entry that will be recorded into a file.

Other Lambda functions, AWS services, and on-premises resources must have access to the result files and log file. Each log entry must also be appended to the same shared log file. The developer needs a solution that can share files and append results into an existing file.

Which solution should the developer use to meet these requirements?

**A:** Create an Amazon Elastic File System (Amazon EFS) file system. Mount the EFS file system in Lambda. Store the result files and log file in the mount point. Append the log entries to the log file.

**B:** Create an Amazon Elastic Block Store (Amazon EBS) Multi-Attach enabled volume. Attach the EBS volume to all Lambda functions. Update the Lambda function code to download the log file, append the log entries, and upload the modified log file to Amazon EBS.

**C:** Create a reference to the /tmp local directory. Store the result files and log file by using the directory reference. Append the log entry to the log file.

**D:** Create a reference to the /opt storage directory. Store the result files and log file by using the directory reference. Append the log entry to the log file.



**Answer: A**

**Timestamp: 2023-05-18 13:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109646-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 526 discussion

A developer is building an application that will process messages from an Amazon Simple Queue Service (Amazon SQS) standard queue. The application needs to process the messages in an Amazon Elastic Container Service (Amazon ECS) task.

Which actions will result in the MOST cost-effective processing of the messages? (Choose two.)

**A:** Use long polling to query the queue for new messages.

**B:** Use short polling to query the queue for new messages.

**C:** Use message batching to retrieve messages from the queue.

**D:** Use Amazon ElastiCache to cache messages in the queue.

**E:** Use an SQS FIFO queue to manage the messages.



**Answer: AC**

**Timestamp: 2024-12-29 18:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153619-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 527 discussion

A developer is writing an application in AWS Lambda. To simplify testing and deployments, the developer needs the database connection string to be easily changed without modifying the Lambda code.

How can this requirement be met?

**A:** Store the connection string as a secret in AWS Secrets Manager.

**B:** Store the connection string in an IAM user account.

**C:** Store the connection string in AWS KMS.

**D:** Store the connection string as a Lambda layer.



**Answer: A**

**Timestamp: 2025-02-17 10:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156678-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 528 discussion

A developer is building an ecommerce application that uses multiple AWS Lambda functions. Each function performs a specific step in a customer order workflow, such as order processing and inventory management.

The developer must ensure that the Lambda functions run in a specific order.

Which solution will meet this requirement with the LEAST operational overhead?

**A:** Configure an Amazon Simple Queue Service (Amazon SQS) queue to contain messages about each step a function must perform. Configure the Lambda functions to run sequentially based on the order of messages in the SQS queue.

**B:** Configure an Amazon Simple Notification Service (Amazon SNS) topic to contain notifications about each step a function must perform. Subscribe the Lambda functions to the SNS topic. Use subscription filters based on the step each function must perform.

**C:** Configure an AWS Step Functions state machine to invoke the Lambda functions in a specific order.

**D:** Configure Amazon EventBridge Scheduler schedules to invoke the Lambda functions in a specific order.



**Answer: C**

**Timestamp: 2024-12-10 05:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152779-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 53 discussion

A developer is using an AWS Lambda function to generate avatars for profile pictures that are uploaded to an Amazon S3 bucket. The Lambda function is automatically invoked for profile pictures that are saved under the /original/ S3 prefix. The developer notices that some pictures cause the Lambda function to time out. The developer wants to implement a fallback mechanism by using another Lambda function that resizes the profile picture.
Which solution will meet these requirements with the LEAST development effort?

**A:** Set the image resize Lambda function as a destination of the avatar generator Lambda function for the events that fail processing.

**B:** Create an Amazon Simple Queue Service (Amazon SQS) queue. Set the SQS queue as a destination with an on failure condition for the avatar generator Lambda function. Configure the image resize Lambda function to poll from the SQS queue.

**C:** Create an AWS Step Functions state machine that invokes the avatar generator Lambda function and uses the image resize Lambda function as a fallback. Create an Amazon EventBridge rule that matches events from the S3 bucket to invoke the state machine.

**D:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Set the SNS topic as a destination with an on failure condition for the avatar generator Lambda function. Subscribe the image resize Lambda function to the SNS topic.



**Answer: A**

**Timestamp: 2023-03-24 03:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103723-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 530 discussion

A developer has an application container, an AWS Lambda function, and an Amazon Simple Queue Service (Amazon SQS) queue. The Lambda function uses the SQS queue as an event source. The Lambda function makes a call to a third-party machine learning API when the function is invoked. The response from the third-party API can take up to 60 seconds to return.

The Lambda function's timeout value is currently 65 seconds. The developer has noticed that the Lambda function sometimes processes duplicate messages from the SQS queue.

What should the developer do to ensure that the Lambda function does not process duplicate messages?

**A:** Configure the Lambda function with a larger amount of memory.

**B:** Configure an increase in the Lambda function’s timeout value.

**C:** Configure the SQS queue’s delivery delay value to be greater than the maximum time it takes to call the third-party API.

**D:** Configure the SQS queue’s visibility timeout value to be greater than the maximum time it takes to call the third-party API.



**Answer: D**

**Timestamp: 2025-02-17 10:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156681-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 149 discussion

An organization is using Amazon CloudFront to ensure that its users experience low-latency access to its web application. The organization has identified a need to encrypt all traffic between users and CloudFront, and all traffic between CloudFront and the web application.

How can these requirements be met? (Choose two.)

**A:** Use AWS KMS to encrypt traffic between CloudFront and the web application.

**B:** Set the Origin Protocol Policy to “HTTPS Only”.

**C:** Set the Origin’s HTTP Port to 443.

**D:** Set the Viewer Protocol Policy to “HTTPS Only” or “Redirect HTTP to HTTPS”.

**E:** Enable the CloudFront option Restrict Viewer Access.



**Answer: BD**

**Timestamp: 2023-10-06 01:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122567-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 15 discussion

A developer is deploying an AWS Lambda function The developer wants the ability to return to older versions of the function quickly and seamlessly.
How can the developer achieve this goal with the LEAST operational overhead?

**A:** Use AWS OpsWorks to perform blue/green deployments.

**B:** Use a function alias with different versions.

**C:** Maintain deployment packages for older versions in Amazon S3.

**D:** Use AWS CodePipeline for deployments and rollbacks.



**Answer: B**

**Timestamp: 2023-03-15 23:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102742-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 150 discussion

A developer is planning to migrate on-premises company data to Amazon S3. The data must be encrypted, and the encryption keys must support automatic annual rotation. The company must use AWS Key Management Service (AWS KMS) to encrypt the data.

Which type of keys should the developer use to meet these requirements?

**A:** Amazon S3 managed keys

**B:** Symmetric customer managed keys with key material that is generated by AWS

**C:** Asymmetric customer managed keys with key material that is generated by AWS

**D:** Symmetric customer managed keys with imported key material



**Answer: B**

**Timestamp: 2023-10-06 01:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122571-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 151 discussion

A team of developers is using an AWS CodePipeline pipeline as a continuous integration and continuous delivery (CI/CD) mechanism for a web application. A developer has written unit tests to programmatically test the functionality of the application code. The unit tests produce a test report that shows the results of each individual check. The developer now wants to run these tests automatically during the CI/CD process.

Which solution will meet this requirement with the LEAST operational effort?

**A:** Write a Git pre-commit hook that runs the tests before every commit. Ensure that each developer who is working on the project has the pre-commit hook installed locally. Review the test report and resolve any issues before pushing changes to AWS CodeCommit.

**B:** Add a new stage to the pipeline. Use AWS CodeBuild as the provider. Add the new stage after the stage that deploys code revisions to the test environment. Write a buildspec that fails the CodeBuild stage if any test does not pass. Use the test reports feature of CodeBuild to integrate the report with the CodeBuild console. View the test results in CodeBuild. Resolve any issues.

**C:** Add a new stage to the pipeline. Use AWS CodeBuild as the provider. Add the new stage before the stage that deploys code revisions to the test environment. Write a buildspec that fails the CodeBuild stage if any test does not pass. Use the test reports feature of CodeBuild to integrate the report with the CodeBuild console. View the test results in CodeBuild. Resolve any issues.

**D:** Add a new stage to the pipeline. Use Jenkins as the provider. Configure CodePipeline to use Jenkins to run the unit tests. Write a Jenkinsfile that fails the stage if any test does not pass. Use the test report plugin for Jenkins to integrate the report with the Jenkins dashboard. View the test results in Jenkins. Resolve any issues.



**Answer: C**

**Timestamp: 2023-10-06 01:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122569-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 152 discussion

A company has multiple Amazon VPC endpoints in the same VPC. A developer needs to configure an Amazon S3 bucket policy so users can access an S3 bucket only by using these VPC endpoints.

Which solution will meet these requirements?

**A:** Create multiple S3 bucket polices by using each VPC endpoint ID that have the aws:SourceVpce value in the StringNotEquals condition.

**B:** Create a single S3 bucket policy that has the aws:SourceVpc value and in the StringNotEquals condition to use VPC ID.

**C:** Create a single S3 bucket policy that has the aws:SourceVpce value and in the StringNotEquals condition to use vpce*.

**D:** Create a single S3 bucket policy that has multiple aws:sourceVpce value in the StringNotEquals condition. Repeat for all the VPC endpoint IDs.



**Answer: D**

**Timestamp: 2023-10-06 01:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122572-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 516 discussion

A developer needs to configure an AWS Lambda function to make HTTP POST requests to an internal application. The application is in the same AWS account that hosts the function. The internal application runs on Amazon EC2 instances in a private subnet within a VPC.

Which solution will meet these requirements?

**A:** Configure a VPC endpoint to connect to the private subnet. Attach the endpoint to the Lambda function.

**B:** Attach the Lambda function to the VPC and to the private subnet.

**C:** Configure a VPN connection between the Lambda function and the private subnet. Attach the VPN to the Lambda function.

**D:** Configure the VPC route table to include the Lambda function’s IP address.



**Answer: B**

**Timestamp: 2024-12-16 06:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153024-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 518 discussion

Two containerized microservices are hosted on Amazon EC2 ECS. The first microservice reads an Amazon RDS Aurora database instance, and the second microservice reads an Amazon DynamoDB table.

How can each microservice be granted the minimum privileges?

**A:** Set ECS_ENABLE_TASK_IAM_ROLE to false on EC2 instance boot in ECS agent configuration file. Run the first microservice with an IAM role for ECS tasks with read-only access for the Aurora database. Run the second microservice with an IAM role for ECS tasks with read-only access to DynamoDB.

**B:** Set ECS_ENABLE_TASK_IAM ROLE to false on EC2 instance boot in the ECS agent configuration file. Grant the instance profile role read-only access to the Aurora database and DynamoDB.

**C:** Set ECS_ENABLE_TASK_IAM ROLE to true on EC2 instance boot in the ECS agent configuration file. Run the first microservice with an IAM role for ECS tasks with read-only access for the Aurora database. Run the second microservice with an IAM role for ECS tasks with read-only access to DynamoDB.

**D:** Set ECS_ENABLE_TASK_IAM_ROLE to true on EC2 instance boot in the ECS agent configuration file. Grant the instance profile role read-only access to the Aurora database and DynamoDB.



**Answer: C**

**Timestamp: 2025-02-17 10:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156675-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 519 discussion

A developer is writing a mobile application that allows users to view images from an S3 bucket. The users must be able to log in with their Amazon login, as well as supported social media accounts.

How can the developer provide this authentication functionality?

**A:** Use Amazon Cognito with web identity federation.

**B:** Use Amazon Cognito with SAML-based identity federation.

**C:** Use IAM access keys and secret keys in the application code to allow Get* on the S3 bucket.

**D:** Use AWS STS AssumeRole in the application code and assume a role with Get* permissions on the S3 bucket.



**Answer: A**

**Timestamp: 2024-12-10 05:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152780-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 52 discussion

An Amazon Kinesis Data Firehose delivery stream is receiving customer data that contains personally identifiable information. A developer needs to remove pattern-based customer identifiers from the data and store the modified data in an Amazon S3 bucket.
What should the developer do to meet these requirements?

**A:** Implement Kinesis Data Firehose data transformation as an AWS Lambda function. Configure the function to remove the customer identifiers. Set an Amazon S3 bucket as the destination of the delivery stream.

**B:** Launch an Amazon EC2 instance. Set the EC2 instance as the destination of the delivery stream. Run an application on the EC2 instance to remove the customer identifiers. Store the transformed data in an Amazon S3 bucket.

**C:** Create an Amazon OpenSearch Service instance. Set the OpenSearch Service instance as the destination of the delivery stream. Use search and replace to remove the customer identifiers. Export the data to an Amazon S3 bucket.

**D:** Create an AWS Step Functions workflow to remove the customer identifiers. As the last step in the workflow, store the transformed data in an Amazon S3 bucket. Set the workflow as the destination of the delivery stream.



**Answer: A**

**Timestamp: 2023-03-26 03:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103922-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 520 discussion

An application that is running on Amazon EC2 instances stores data in an Amazon S3 bucket. All the data must be encrypted in transit.

How can a developer ensure that all traffic to the S3 bucket is encrypted?

**A:** Install certificates on the EC2 instances.

**B:** Create a private VPC endpoint.

**C:** Configure the S3 bucket with server-side encryption with AWS KMS managed encryption keys (SSE-KMS).

**D:** Create an S3 bucket policy that denies traffic when the value for the aws:SecureTransport condition key is false.



**Answer: D**

**Timestamp: 2025-02-17 10:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156676-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 360 discussion

A developer is building an ecommerce application. When there is a sale event, the application needs to concurrently call three third-party systems to record the sale. The developer wrote three AWS Lambda functions. There is one Lambda function for each third-party system, which contains complex integration logic.

These Lambda functions are all independent. The developer needs to design the application so each Lambda function will run regardless of others' success or failure.

Which solution will meet these requirements?

**A:** Publish the sale event from the application to an Amazon Simple Queue Service (Amazon SQS) queue. Configure the three Lambda functions to poll the queue.

**B:** Publish the sale event from the application to an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the three Lambda functions to be triggered by the SNS topic.

**C:** Publish the sale event from the application to an Application Load Balancer (ALB). Add the three Lambda functions as ALB targets.

**D:** Publish the sale event from the application to an AWS Step Functions state machine. Move the logic from the three Lambda functions into the Step Functions state machine.



**Answer: B**

**Timestamp: 2024-07-05 16:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143366-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 361 discussion

A developer is writing an application, which stores data in an Amazon DynamoDB table. The developer wants to query the DynamoDB table by using the partition key and a different sort key value. The developer needs the latest data with all recent write operations.

How should the developer write the DynamoDB query?

**A:** Add a local secondary index (LSI) during table creation. Query the LSI by using eventually consistent reads.

**B:** Add a local secondary index (LSI) during table creation. Query the LSI by using strongly consistent reads.

**C:** Add a global secondary index (GSI) during table creation. Query the GSI by using eventually consistent reads.

**D:** Add a global secondary index (GSI) during table creation. Query the GSI by using strongly consistent reads.



**Answer: B**

**Timestamp: 2024-06-30 18:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143107-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 362 discussion

A developer manages an application that writes customer orders to an Amazon DynamoDB table. The orders use customer_id as the partition key, order_id as the sort key, and order_date as an attribute. A new access pattern requires accessing data by order_date and order_id. The developer needs to implement a new AWS Lambda function to support the new access pattern.

How should the developer support the new access pattern in the MOST operationally efficient way?

**A:** Add a new local secondary index (LSI) to the DynamoDB table that specifies order_date as the partition key and order_id as the sort key. Write the new Lambda function to query the new LSI index.

**B:** Write the new Lambda function to scan the DynamoDB table. In the Lambda function, write a method to retrieve and combine results by order_date and order_id.

**C:** Add a new global secondary index (GSI) to the DynamoDB table that specifies order_date as the partition key and order_id as the sort key. Write the new Lambda function to query the new GSI index.

**D:** Enable DynamoDB Streams on the table. Choose the new and old images information to write to the DynamoDB stream. Write the new Lambda function to query the DynamoDB stream



**Answer: C**

**Timestamp: 2024-07-05 16:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143367-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 363 discussion

A developer is creating a web application for a school that stores data in Amazon DynamoDB. The ExamScores table has the following attributes: student_id, subject_name, and top_score.

Each item in the ExamScores table is identified with student_id as the partition key and subject_name as the sort key. The web application needs to display the student _id for the top scores for each school subject. The developer needs to increase the speed of the queries to retrieve the student_id for the top scorer for each school subject.

Which solution will meet these requirements?

**A:** Create a local secondary index (LSI) with subject_name as the partition key and top_score as the sort key.

**B:** Create a local secondary index (LSI) with top_score as the partition key and student_id as the sort key.

**C:** Create a global secondary index (GSI) with subject_name as the partition key and top_score as the sort key.

**D:** Create a global secondary index (GSI) with subject_name as the partition key and student_id as the sort key.



**Answer: C**

**Timestamp: 2024-07-12 05:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143747-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 364 discussion

A developer wrote an application that uses an AWS Lambda function to asynchronously generate short videos based on requests from customers. This video generation can take up to 10 minutes. After the video is generated, a URL to download the video is pushed to the customer's web browser. The customer should be able to access these videos for at least 3 hours after generation.

Which solution will meet these requirements?

**A:** Store the video in the /tmp folder within the Lambda execution environment. Push a Lambda function URL to the customer.

**B:** Store the video in an Amazon Elastic File System (Amazon EFS) file system attached to the function. Generate a pre-signed URL for the video object and push the URL to the customer.

**C:** Store the video in Amazon S3. Generate a pre-signed URL for the video object and push the URL to the customer.

**D:** Store the video in an Amazon CloudFront distribution. Generate a pre-signed URL for the video object and push the URL to the customer.



**Answer: C**

**Timestamp: 2024-07-05 16:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143369-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 248 discussion

A company is using AWS Elastic Beanstalk to manage web applications that are running on Amazon EC2 instances. A developer needs to make configuration changes. The developer must deploy the changes to new instances only.

Which types of deployment can the developer use to meet this requirement? (Choose two.)

**A:** All at once

**B:** Immutable

**C:** Rolling

**D:** Blue/green

**E:** Rolling with additional batch



**Answer: BD**

**Timestamp: 2023-10-29 01:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124859-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 249 discussion

A developer needs to use Amazon DynamoDB to store customer orders. The developer’s company requires all customer data to be encrypted at rest with a key that the company generates.

What should the developer do to meet these requirements?

**A:** Create the DynamoDB table with encryption set to None. Code the application to use the key to decrypt the data when the application reads from the table. Code the application to use the key to encrypt the data when the application writes to the table.

**B:** Store the key by using AWS Key Management Service (AWS KMS). Choose an AWS KMS customer managed key during creation of the DynamoDB table. Provide the Amazon Resource Name (ARN) of the AWS KMS key.

**C:** Store the key by using AWS Key Management Service (AWS KMS). Create the DynamoDB table with default encryption. Include the kms:Encrypt parameter with the Amazon Resource Name (ARN) of the AWS KMS key when using the DynamoDB software development kit (SDK).

**D:** Store the key by using AWS Key Management Service (AWS KMS). Choose an AWS KMS AWS managed key during creation of the DynamoDB table. Provide the Amazon Resource Name (ARN) of the AWS KMS key.



**Answer: B**

**Timestamp: 2023-10-29 01:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124860-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 25 discussion

A company is migrating an on-premises database to Amazon RDS for MySQL. The company has read-heavy workloads. The company wants to refactor the code to achieve optimum read performance for queries.
Which solution will meet this requirement with LEAST current and future effort?

**A:** Use a multi-AZ Amazon RDS deployment. Increase the number of connections that the code makes to the database or increase the connection pool size if a connection pool is in use.

**B:** Use a multi-AZ Amazon RDS deployment. Modify the code so that queries access the secondary RDS instance.

**C:** Deploy Amazon RDS with one or more read replicas. Modify the application code so that queries use the URL for the read replicas.

**D:** Use open source replication software to create a copy of the MySQL database on an Amazon EC2 instance. Modify the application code so that queries use the IP address of the EC2 instance.



**Answer: C**

**Timestamp: 2023-03-21 22:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103510-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 250 discussion

A company uses AWS CloudFormation to deploy an application that uses an Amazon API Gateway REST API with AWS Lambda function integration. The application uses Amazon DynamoDB for data persistence. The application has three stages: development, testing, and production. Each stage uses its own DynamoDB table.

The company has encountered unexpected issues when promoting changes to the production stage. The changes were successful in the development and testing stages. A developer needs to route 20% of the traffic to the new production stage API with the next production release. The developer needs to route the remaining 80% of the traffic to the existing production stage. The solution must minimize the number of errors that any single customer experiences.

Which approach should the developer take to meet these requirements?

**A:** Update 20% of the planned changes to the production stage. Deploy the new production stage. Monitor the results. Repeat this process five times to test all planned changes.

**B:** Update the Amazon Route 53 DNS record entry for the production stage API to use a weighted routing policy. Set the weight to a value of 80. Add a second record for the production domain name. Change the second routing policy to a weighted routing policy. Set the weight of the second policy to a value of 20. Change the alias of the second policy to use the testing stage API.

**C:** Deploy an Application Load Balancer (ALB) in front of the REST API. Change the production API Amazon Route 53 record to point traffic to the ALB. Register the production and testing stages as targets of the ALB with weights of 80% and 20%, respectively.

**D:** Configure canary settings for the production stage API. Change the percentage of traffic directed to canary deployment to 20%. Make the planned updates to the production stage. Deploy the changes



**Answer: D**

**Timestamp: 2023-10-29 02:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124861-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 251 discussion

A developer has created a data collection application that uses Amazon API Gateway, AWS Lambda, and Amazon S3. The application’s users periodically upload data files and wait for the validation status to be reflected on a processing dashboard. The validation process is complex and time-consuming for large files.

Some users are uploading dozens of large files and have to wait and refresh the processing dashboard to see if the files have been validated. The developer must refactor the application to immediately update the validation result on the user’s dashboard without reloading the full dashboard.

What is the MOST operationally efficient solution that meets these requirements?

**A:** Integrate the client with an API Gateway WebSocket API. Save the user-uploaded files with the WebSocket connection ID. Push the validation status to the connection ID when the processing is complete to initiate an update of the user interface.

**B:** Launch an Amazon EC2 micro instance, and set up a WebSocket server. Send the user-uploaded file and user detail to the EC2 instance after the user uploads the file. Use the WebSocket server to send updates to the user interface when the uploaded file is processed.

**C:** Save the user’s email address along with the user-uploaded file. When the validation process is complete, send an email notification through Amazon Simple Notification Service (Amazon SNS) to the user who uploaded the file.

**D:** Save the user-uploaded file and user detail to Amazon DynamoDB. Use Amazon DynamoDB Streams with Amazon Simple Notification Service (Amazon SNS) push notifications to send updates to the browser to update the user interface.



**Answer: A**

**Timestamp: 2023-10-29 02:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124862-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 180 discussion

A company has an application that runs as a series of AWS Lambda functions. Each Lambda function receives data from an Amazon Simple Notification Service (Amazon SNS) topic and writes the data to an Amazon Aurora DB instance.

To comply with an information security policy, the company must ensure that the Lambda functions all use a single securely encrypted database connection string to access Aurora.

Which solution will meet these requirements?

**A:** Use IAM database authentication for Aurora to enable secure database connections for all the Lambda functions.

**B:** Store the credentials and read the credentials from an encrypted Amazon RDS DB instance.

**C:** Store the credentials in AWS Systems Manager Parameter Store as a secure string parameter.

**D:** Use Lambda environment variables with a shared AWS Key Management Service (AWS KMS) key for encryption.



**Answer: C**

**Timestamp: 2023-10-06 02:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122601-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 181 discussion

A developer is troubleshooting an Amazon API Gateway API. Clients are receiving HTTP 400 response errors when the clients try to access an endpoint of the API.

How can the developer determine the cause of these errors?

**A:** Create an Amazon Kinesis Data Firehose delivery stream to receive API call logs from API Gateway. Configure Amazon CloudWatch Logs as the delivery stream’s destination.

**B:** Turn on AWS CloudTrail Insights and create a trail. Specify the Amazon Resource Name (ARN) of the trail for the stage of the API.

**C:** Turn on AWS X-Ray for the API stage. Create an Amazon CloudWatch Logs log group. Specify the Amazon Resource Name (ARN) of the log group for the API stage.

**D:** Turn on execution logging and access logging in Amazon CloudWatch Logs for the API stage. Create a CloudWatch Logs log group. Specify the Amazon Resource Name (ARN) of the log group for the API stage.



**Answer: D**

**Timestamp: 2023-10-06 02:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122602-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 182 discussion

A company developed an API application on AWS by using Amazon CloudFront, Amazon API Gateway, and AWS Lambda. The API has a minimum of four requests every second. A developer notices that many API users run the same query by using the POST method. The developer wants to cache the POST request to optimize the API resources.

Which solution will meet these requirements?

**A:** Configure the CloudFront cache. Update the application to return cached content based upon the default request headers.

**B:** Override the cache method in the selected stage of API Gateway. Select the POST method.

**C:** Save the latest request response in Lambda /tmp directory. Update the Lambda function to check the /tmp directory.

**D:** Save the latest request in AWS Systems Manager Parameter Store. Modify the Lambda function to take the latest request response from Parameter Store.



**Answer: B**

**Timestamp: 2023-10-06 02:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122604-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 183 discussion

A company is building a microservices application that consists of many AWS Lambda functions. The development team wants to use AWS Serverless Application Model (AWS SAM) templates to automatically test the Lambda functions. The development team plans to test a small percentage of traffic that is directed to new updates before the team commits to a full deployment of the application.

Which combination of steps will meet these requirements in the MOST operationally efficient way? (Choose two.)

**A:** Use AWS SAM CLI commands in AWS CodeDeploy to invoke the Lambda functions to test the deployment.

**B:** Declare the EventInvokeConfig on the Lambda functions in the AWS SAM templates with OnSuccess and OnFailure configurations.

**C:** Enable gradual deployments through AWS SAM templates.

**D:** Set the deployment preference type to Canary10Percent30Minutes. Use hooks to test the deployment.

**E:** Set the deployment preference type to Linear10PercentEvery10Minutes. Use hooks to test the deployment.



**Answer: CD**

**Timestamp: 2023-10-06 02:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122606-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 184 discussion

A company is using AWS CloudFormation to deploy a two-tier application. The application will use Amazon RDS as its backend database. The company wants a solution that will randomly generate the database password during deployment. The solution also must automatically rotate the database password without requiring changes to the application.

What is the MOST operationally efficient solution that meets these requirements?

**A:** Use an AWS Lambda function as a CloudFormation custom resource to generate and rotate the password.

**B:** Use an AWS Systems Manager Parameter Store resource with the SecureString data type to generate and rotate the password.

**C:** Use a cron daemon on the application’s host to generate and rotate the password.

**D:** Use an AWS Secrets Manager resource to generate and rotate the password.



**Answer: D**

**Timestamp: 2023-10-06 02:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122605-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 220 discussion

A developer is receiving HTTP 400: ThrottlingException errors intermittently when calling the Amazon CloudWatch API. When a call fails, no data is retrieved.

What best practice should first be applied to address this issue?

**A:** Contact AWS Support for a limit increase.

**B:** Use the AWS CLI to get the metrics.

**C:** Analyze the applications and remove the API call.

**D:** Retry the call with exponential backoff.



**Answer: D**

**Timestamp: 2023-10-28 08:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124772-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 221 discussion

An application needs to use the IP address of the client in its processing. The application has been moved into AWS and has been placed behind an Application Load Balancer (ALB). However, all the client IP addresses now appear to be the same. The application must maintain the ability to scale horizontally.

Based on this scenario, what is the MOST cost-effective solution to this problem?

**A:** Remove the application from the ALB. Delete the ALB and change Amazon Route 53 to direct traffic to the instance running the application.

**B:** Remove the application from the ALCreate a Classic Load Balancer in its place. Direct traffic to the application using the HTTP protocol.

**C:** Alter the application code to inspect the X-Forwarded-For header. Ensure that the code can work properly if a list of IP addresses is passed in the header.

**D:** Alter the application code to inspect a custom header. Alter the client code to pass the IP address in the custom header.



**Answer: C**

**Timestamp: 2023-10-28 08:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124773-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 222 discussion

A developer is designing a serverless application that customers use to select seats for a concert venue. Customers send the ticket requests to an Amazon API Gateway API with an AWS Lambda function that acknowledges the order and generates an order ID. The application includes two additional Lambda functions: one for inventory management and one for payment processing. These two Lambda functions run in parallel and write the order to an Amazon Dynamo DB table.

The application must provide seats to customers according to the following requirements. If a seat is accidently sold more than once, the first order that the application received must get the seat. In these cases, the application must process the payment for only the first order. However, if the first order is rejected during payment processing, the second order must get the seat. In these cases, the application must process the payment for the second order.

Which solution will meet these requirements?

**A:** Send the order ID to an Amazon Simple Notification Service (Amazon SNS) FIFO topic that fans out to one Amazon Simple Queue Service (Amazon SQS) FIFO queue for inventory management and another SQS FIFO queue for payment processing.

**B:** Change the Lambda function that generates the order ID to initiate the Lambda function for inventory management. Then initiate the Lambda function for payment processing.

**C:** Send the order ID to an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the Lambda functions for inventory management and payment processing to the topic.

**D:** Deliver the order ID to an Amazon Simple Queue Service (Amazon SQS) queue. Configure the Lambda functions for inventory management and payment processing to poll the queue.



**Answer: A**

**Timestamp: 2023-10-28 12:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124805-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 223 discussion

An application uses AWS X-Ray to generate a large amount of trace data on an hourly basis. A developer wants to use filter expressions to limit the returned results through user-specified custom attributes.

How should the developer use filter expressions to filter the results in X-Ray?

**A:** Add custom attributes as annotations in the segment document.

**B:** Add custom attributes as metadata in the segment document.

**C:** Add custom attributes as new segment fields in the segment document.

**D:** Create new sampling rules that are based on custom attributes.



**Answer: A**

**Timestamp: 2023-10-28 12:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124806-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 224 discussion

A web application is using Amazon Kinesis Data Streams for clickstream data that may not be consumed for up to 12 hours.

How can the developer implement encryption at rest for data within the Kinesis Data Streams?

**A:** Enable SSL connections to Kinesis.

**B:** Use Amazon Kinesis Consumer Library.

**C:** Encrypt the data once it is at rest with a Lambda function.

**D:** Enable server-side encryption in Kinesis Data Streams.



**Answer: D**

**Timestamp: 2023-10-28 08:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124774-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 540 discussion

A developer is using AWS CodeDeploy to launch an application onto Amazon EC2 instances. The application deployment fails during testing. The developer notices an IAM_ROLE_PERMISSIONS error code in Amazon CloudWatch logs.

What should the developer do to resolve the error?

**A:** Ensure that the deployment group is using the correct role name for the CodeDeploy service role.

**B:** Attach the AWSCodeDeployRoleECS policy to the CodeDeploy service role.

**C:** Attach the AWSCodeDeployRole policy to the CodeDeploy service role.

**D:** Ensure the CodeDeploy agent is installed and running on all instances in the deployment group.



**Answer: C**

**Timestamp: 2025-02-17 11:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156698-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 541 discussion

A company wants to send notifications to customers to advertise a sale on the company’s products. The company needs to use Amazon Simple Notification Service (Amazon SNS) FIFO topics.

The company needs to examine the rate at which the topics send notifications and the latency with which the topics send notifications.

Which solution will meet these requirements with the MOST operational efficiency?

**A:** Use AWS X-Ray. Enable active tracing for Amazon SNS.

**B:** Use the Amazon CloudWatch NumberOfNotificationsFailed metric.

**C:** Use AWS CloudTrail to log all Amazon SNS API calls.

**D:** Use Amazon GuardDuty. Enable runtime monitoring.



**Answer: A**

**Timestamp: 2025-01-06 10:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153933-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 542 discussion

A cloud-based video surveillance company is developing an application that analyzes video files. After the application analyzes the files, the company can discard the files.

The company stores the files in an Amazon S3 bucket. The files are 1 GB in size on average. No file is larger than 2 GB. An AWS Lambda function will run one time for each video file that is processed. The processing is very I/O intensive, and the application must read each file multiple times.

Which solution will meet these requirements in the MOST performance-optimized way?

**A:** Attach an Amazon Elastic Block Store (Amazon EBS) volume that is larger than 1 GB to the Lambda function. Copy the files from the S3 bucket to the EBS volume.

**B:** Attach an Elastic Network Adapter (ENA) to the Lambda function. Use the ENA to read the video files from the S3 bucket.

**C:** Increase the ephemeral storage size to 2 GB. Copy the files from the S3 bucket to the /tmp directory of the Lambda function.

**D:** Configure the Lambda function code to read the video files directly from the S3 bucket.



**Answer: C**

**Timestamp: 2025-02-17 11:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156699-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 543 discussion

A company has an AWS Step Functions state machine named myStateMachine. The company configured a service role for Step Functions.

The developer must ensure that only the myStateMachine state machine can assume the service role.

Which statement should the developer add to the trust policy to meet this requirement?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: A**

**Timestamp: 2025-03-04 10:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157498-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 544 discussion

A company stores customer credit reports in an Amazon S3 bucket. An analytics service uses standard Amazon S3 GET requests to access the reports.

A developer must implement a solution to redact personally identifiable information (PII) from the reports before the reports reach the analytics service.

Which solution will meet this requirement with the MOST operational efficiency?

**A:** Load the S3 objects into Amazon Redshift by using a COPY command. Implement dynamic data masking. Refactor the analytics service to read from Amazon Redshift.

**B:** Set up an S3 Object Lambda function. Attach the function to an S3 Object Lambda Access Point. Program the function to call a PII redaction API.

**C:** Use AWS Key Management Service (AWS KMS) to implement encryption in the S3 bucket. Re-upload all the existing S3 objects. Give the kms:Decrypt permission to the analytics service.

**D:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Implement message data protection. Refactor the analytics service to publish data access requests to the SNS topic.



**Answer: B**

**Timestamp: 2025-02-17 11:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156700-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 252 discussion

A company’s developer is creating an application that uses Amazon API Gateway. The company wants to ensure that only users in the Sales department can use the application. The users authenticate to the application by using federated credentials from a third-party identity provider (IdP) through Amazon Cognito. The developer has set up an attribute mapping to map an attribute that is named Department and to pass the attribute to a custom AWS Lambda authorizer.

To test the access limitation, the developer sets their department to Engineering in the IdP and attempts to log in to the application. The developer is denied access. The developer then updates their department to Sales in the IdP and attempts to log in. Again, the developer is denied access. The developer checks the logs and discovers that access is being denied because the developer’s access token has a department value of Engineering.

Which of the following is a possible reason that the developer’s department is still being reported as Engineering instead of Sales?

**A:** Authorization caching is enabled in the custom Lambda authorizer.

**B:** Authorization caching is enabled on the Amazon Cognito user pool.

**C:** The IAM role for the custom Lambda authorizer does not have a Department tag.

**D:** The IAM role for the Amazon Cognito user pool does not have a Department tag.



**Answer: A**

**Timestamp: 2023-10-29 02:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124863-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 253 discussion

A company has migrated an application to Amazon EC2 instances. Automatic scaling is working well for the application user interface. However, the process to deliver shipping requests to the company’s warehouse staff is encountering issues. Duplicate shipping requests are arriving, and some requests are lost or arrive out of order.

The company must avoid duplicate shipping requests and must process the requests in the order that the requests arrive. Requests are never more than 250 KB in size and take 5-10 minutes to process. A developer needs to rearchitect the application to improve the reliability of the delivery and processing of the requests.

What should the developer do to meet these requirements?

**A:** Create an Amazon Kinesis Data Firehose delivery stream to process the requests. Create an Amazon Kinesis data stream. Modify the application to write the requests to the Kinesis data stream.

**B:** Create an AWS Lambda function to process the requests. Create an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the Lambda function to the SNS topic. Modify the application to write the requests to the SNS topic.

**C:** Create an AWS Lambda function to process the requests. Create an Amazon Simple Queue Service (Amazon SQS) standard queue. Set the SQS queue as an event source for the Lambda function. Modify the application to write the requests to the SQS queue.

**D:** Create an AWS Lambda function to process the requests. Create an Amazon Simple Queue Service (Amazon SQS) FIFO queue. Set the SQS queue as an event source for the Lambda function. Modify the application to write the requests to the SQS queue.



**Answer: D**

**Timestamp: 2023-10-29 02:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124864-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 254 discussion

A developer is creating a machine learning (ML) pipeline in AWS Step Functions that contains AWS Lambda functions. The developer has configured an Amazon Simple Queue Service (Amazon SQS) queue to deliver ML model parameters to the ML pipeline to train ML models. The developer uploads the trained models are uploaded to an Amazon S3 bucket.

The developer needs a solution that can locally test the ML pipeline without making service integration calls to Amazon SQS and Amazon S3.

Which solution will meet these requirements?

**A:** Use the Amazon CodeGuru Profiler to analyze the Lambda functions used in the AWS Step Functions pipeline.

**B:** Use the AWS Step Functions Local Docker Image to run and locally test the Lambda functions.

**C:** Use the AWS Serverless Application Model (AWS SAM) CLI to run and locally test the Lambda functions.

**D:** Use AWS Step Functions Local with mocked service integrations.



**Answer: D**

**Timestamp: 2023-10-29 02:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124865-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 255 discussion

A company runs a batch processing application by using AWS Lambda functions and Amazon API Gateway APIs with deployment stages for development, user acceptance testing, and production. A development team needs to configure the APIs in the deployment stages to connect to third-party service endpoints.

Which solution will meet this requirement?

**A:** Store the third-party service endpoints in Lambda layers that correspond to the stage.

**B:** Store the third-party service endpoints in API Gateway stage variables that correspond to the stage.

**C:** Encode the third-party service endpoints as query parameters in the API Gateway request URL.

**D:** Store the third-party service endpoint for each environment in AWS AppConfig.



**Answer: B**

**Timestamp: 2024-02-20 16:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134248-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 256 discussion

A developer is building a serverless application that runs on AWS. The developer wants to create an accelerated development workflow that deploys incremental changes to AWS for testing. The developer wants to deploy the incremental changes but does not want to fully deploy the entire application to AWS for every code commit.

What should the developer do to meet these requirements?

**A:** Use the AWS Serverless Application Model (AWS SAM) to build the application. Use the sam sync command to deploy the incremental changes.

**B:** Use the AWS Serverless Application Model (AWS SAM) to build the application. Use the sam init command to deploy the incremental changes.

**C:** Use the AWS Cloud Development Kit (AWS CDK) to build the application. Use the cdk synth command to deploy the incremental changes.

**D:** Use the AWS Cloud Development Kit (AWS CDK) to build the application. Use the cdk bootstrap command to deploy the incremental changes.



**Answer: A**

**Timestamp: 2024-02-17 17:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134067-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 121 discussion

A company's developer is building a static website to be deployed in Amazon S3 for a production environment. The website integrates with an Amazon Aurora PostgreSQL database by using an AWS Lambda function. The website that is deployed to production will use a Lambda alias that points to a specific version of the Lambda function.

The company must rotate the database credentials every 2 weeks. Lambda functions that the company deployed previously must be able to use the most recent credentials.

Which solution will meet these requirements?

**A:** Store the database credentials in AWS Secrets Manager. Turn on rotation. Write code in the Lambda function to retrieve the credentials from Secrets Manager.

**B:** Include the database credentials as part of the Lambda function code. Update the credentials periodically and deploy the new Lambda function.

**C:** Use Lambda environment variables. Update the environment variables when new credentials are available.

**D:** Store the database credentials in AWS Systems Manager Parameter Store. Turn on rotation. Write code in the Lambda function to retrieve the credentials from Systems Manager Parameter Store.



**Answer: A**

**Timestamp: 2023-04-22 23:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107055-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 122 discussion

A developer is developing an application that uses signed requests (Signature Version 4) to call other AWS services. The developer has created a canonical request, has created the string to sign, and has calculated signing information.

Which methods could the developer use to complete a signed request? (Choose two.)

**A:** Add the signature to an HTTP header that is named Authorization.

**B:** Add the signature to a session cookie.

**C:** Add the signature to an HTTP header that is named Authentication.

**D:** Add the signature to a query string parameter that is named X-Amz-Signature.

**E:** Add the signature to an HTTP header that is named WWW-Authenticate.



**Answer: AD**

**Timestamp: 2023-04-22 23:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107057-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 123 discussion

A company must deploy all its Amazon RDS DB instances by using AWS CloudFormation templates as part of AWS CodePipeline continuous integration and continuous delivery (CI/CD) automation. The primary password for the DB instance must be automatically generated as part of the deployment process.

Which solution will meet these requirements with the LEAST development effort?

**A:** Create an AWS Lambda-backed CloudFormation custom resource. Write Lambda code that generates a secure string. Return the value of the secure string as a data field of the custom resource response object. Use the CloudFormation Fn::GetAtt intrinsic function to get the value of the secure string. Use the value to create the DB instance.

**B:** Use the AWS CodeBuild action of CodePipeline to generate a secure string by using the following AWS CLI command: aws secretsmanager get-random-password. Pass the generated secure string as a CloudFormation parameter with the NoEcho attribute set to true. Use the parameter reference to create the DB instance.

**C:** Create an AWS Lambda-backed CloudFormation custom resource. Write Lambda code that generates a secure string. Return the value of the secure string as a data field of the custom resource response object. Use the CloudFormation Fn::GetAtt intrinsic function to get a value of the secure string. Create secrets in AWS Secrets Manager. Use the secretsmanager dynamic reference to use the value stored in the secret to create the DB instance.

**D:** Use the AWS::SecretsManager::Secret resource to generate a secure string. Store the secure string as a secret in AWS Secrets Manager. Use the secretsmanager dynamic reference to use the value stored in the secret to create the DB instance.



**Answer: D**

**Timestamp: 2023-04-22 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107059-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 124 discussion

An organization is storing large files in Amazon S3, and is writing a web application to display meta-data about the files to end-users. Based on the metadata a user selects an object to download. The organization needs a mechanism to index the files and provide single-digit millisecond latency retrieval for the metadata.

What AWS service should be used to accomplish this?

**A:** Amazon DynamoDB

**B:** Amazon EC2

**C:** AWS Lambda

**D:** Amazon RDS



**Answer: A**

**Timestamp: 2023-04-22 23:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107060-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 125 discussion

A developer is creating an AWS Serverless Application Model (AWS SAM) template. The AWS SAM template contains the definition of multiple AWS Lambda functions, an Amazon S3 bucket, and an Amazon CloudFront distribution. One of the Lambda functions runs on Lambda@Edge in the CloudFront distribution. The S3 bucket is configured as an origin for the CloudFront distribution.

When the developer deploys the AWS SAM template in the eu-west-1 Region, the creation of the stack fails.

Which of the following could be the reason for this issue?

**A:** CloudFront distributions can be created only in the us-east-1 Region.

**B:** Lambda@Edge functions can be created only in the us-east-1 Region.

**C:** A single AWS SAM template cannot contain multiple Lambda functions.

**D:** The CloudFront distribution and the S3 bucket cannot be created in the same Region.



**Answer: B**

**Timestamp: 2023-04-23 00:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107062-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 379 discussion

A developer is monitoring an application that runs on an Amazon EC2 instance. The developer has configured a custom Amazon CloudWatch metric with data granularity of 1 second. If any issues occur, the developer wants to be notified within 30 seconds by Amazon Simple Notification Service (Amazon SNS).

What should the developer do to meet this requirement?

**A:** Configure a high-resolution CloudWatch alarm.

**B:** Set up a custom CloudWatch dashboard.

**C:** Use Amazon CloudWatch Logs Insights.

**D:** Change to a default CloudWatch metric.



**Answer: A**

**Timestamp: 2024-07-12 05:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143760-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 38 discussion

An application that is hosted on an Amazon EC2 instance needs access to files that are stored in an Amazon S3 bucket. The application lists the objects that are stored in the S3 bucket and displays a table to the user. During testing, a developer discovers that the application does not show any objects in the list.
What is the MOST secure way to resolve this issue?

**A:** Update the IAM instance profile that is attached to the EC2 instance to include the S3:* permission for the S3 bucket.

**B:** Update the IAM instance profile that is attached to the EC2 instance to include the S3:ListBucket permission for the S3 bucket.

**C:** Update the developer's user permissions to include the S3:ListBucket permission for the S3 bucket.

**D:** Update the S3 bucket policy by including the S3:ListBucket permission and by setting the Principal element to specify the account number of the EC2 instance.



**Answer: B**

**Timestamp: 2023-03-21 22:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103522-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 380 discussion

A company has a web application that contains an Amazon API Gateway REST API. A developer has created an AWS CloudFormation template for the initial deployment of the application. The developer has deployed the application successfully as part of an AWS CodePipeline continuous integration and continuous delivery (CI/CD) process. All resources and methods are available through the deployed stage endpoint.

The CloudFormation template contains the following resource types:

• AWS::ApiGateway::RestApi
• AWS::ApiGateway::Resource
• AWS::ApiGateway::Method
• AWS::ApiGateway::Stage
• AWS::ApiGateway::Deployment

The developer adds a new resource to the REST API with additional methods and redeploys the template. CloudFormation reports that the deployment is successful and that the stack is in the UPDATE_COMPLETE state. However, calls to all new methods are returning 404 (Not Found) errors.

What should the developer do to make the new methods available?

**A:** Specify the disable-rollback option during the update-stack operation.

**B:** Unset the CloudFormation stack failure options.

**C:** Add an AWS CodeBuild stage to CodePipeline to run the aws apigateway create-deployment AWS CLI command.

**D:** Add an action to CodePipeline to run the aws cloudfront create-invalidation AWS CLI command.



**Answer: C**

**Timestamp: 2024-07-12 05:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143761-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 381 discussion

A developer updates an AWS Lambda function that an Amazon API Gateway API uses. The API is the backend for a web application.

The developer needs to test the updated Lambda function before deploying the Lambda function to production. The testing must not affect any production users of the web application.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Create a canary release deployment for the existing API stage. Deploy the API to the existing stage. Test the updated Lambda function by using the existing URL.

**B:** Update the API Gateway API endpoint type to private. Deploy the changes to the existing API stage. Test the API by using the existing URL.

**C:** Create a new test API stage in API Gateway. Add stage variables to deploy the updated Lambda function to only the test stage. Test the updated Lambda function by using the new stage URL.

**D:** Create a new AWS CloudFormation stack to deploy a copy of the entire production API and Lambda function. Use the stack's API URL to test the updated Lambda function.



**Answer: C**

**Timestamp: 2024-07-11 14:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143721-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 382 discussion

A developer wants the ability to roll back to a previous version of an AWS Lambda function in the event of errors caused by a new deployment.

How can the developer achieve this with MINIMAL impact on users?

**A:** Change the application to use an alias that points to the current version. Deploy the new version of the code. Update the alias to use the newly deployed version. If too many errors are encountered, point the alias back to the previous version.

**B:** Change the application to use an alias that points to the current version. Deploy the new version of the code. Update the alias to direct 10% of users to the newly deployed version. If too many errors are encountered, send 100% of traffic to the previous version.

**C:** Do not make any changes to the application. Deploy the new version of the code. If too many errors are encountered, point the application back to the previous version using the version number in the Amazon Resource Name (ARN).

**D:** Create three aliases: new, existing, and router. Point the existing alias to the current version. Have the router alias direct 100% of users to the existing alias. Update the application to use the router alias. Deploy the new version of the code. Point the new alias to this version. Update the router alias to direct 10% of users to the new alias. If too many errors are encountered, send 100% of traffic to the existing alias.



**Answer: B**

**Timestamp: 2024-07-11 14:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143722-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 167 discussion

A developer at a company needs to create a small application that makes the same API call once each day at a designated time. The company does not have infrastructure in the AWS Cloud yet, but the company wants to implement this functionality on AWS.

Which solution meets these requirements in the MOST operationally efficient manner?

**A:** Use a Kubernetes cron job that runs on Amazon Elastic Kubernetes Service (Amazon EKS).

**B:** Use an Amazon Linux crontab scheduled job that runs on Amazon EC2.

**C:** Use an AWS Lambda function that is invoked by an Amazon EventBridge scheduled event.

**D:** Use an AWS Batch job that is submitted to an AWS Batch job queue.



**Answer: C**

**Timestamp: 2023-10-06 02:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122587-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 168 discussion

A developer is building a serverless application that is based on AWS Lambda. The developer initializes the AWS software development kit (SDK) outside of the Lambda handler function.

What is the PRIMARY benefit of this action?

**A:** Improves legibility and stylistic convention

**B:** Takes advantage of runtime environment reuse

**C:** Provides better error handling

**D:** Creates a new SDK instance for each invocation



**Answer: B**

**Timestamp: 2023-10-06 02:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122588-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 169 discussion

A company is using Amazon RDS as the backend database for its application. After a recent marketing campaign, a surge of read requests to the database increased the latency of data retrieval from the database. The company has decided to implement a caching layer in front of the database. The cached content must be encrypted and must be highly available.

Which solution will meet these requirements?

**A:** Amazon CloudFront

**B:** Amazon ElastiCache for Memcached

**C:** Amazon ElastiCache for Redis in cluster mode

**D:** Amazon DynamoDB Accelerator (DAX)



**Answer: C**

**Timestamp: 2023-10-06 02:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122589-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 17 discussion

For a deployment using AWS Code Deploy, what is the run order of the hooks for in-place deployments?

**A:** BeforeInstall -> ApplicationStop -> ApplicationStart -> AfterInstall

**B:** ApplicationStop -> BeforeInstall -> AfterInstall -> ApplicationStart

**C:** BeforeInstall -> ApplicationStop -> ValidateService -> ApplicationStart

**D:** ApplicationStop -> BeforeInstall -> ValidateService -> ApplicationStart



**Answer: B**

**Timestamp: 2023-03-15 23:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102743-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 170 discussion

A developer at a company recently created a serverless application to process and show data from business reports. The application’s user interface (UI) allows users to select and start processing the files. The UI displays a message when the result is available to view. The application uses AWS Step Functions with AWS Lambda functions to process the files. The developer used Amazon API Gateway and Lambda functions to create an API to support the UI.

The company’s UI team reports that the request to process a file is often returning timeout errors because of the size or complexity of the files. The UI team wants the API to provide an immediate response so that the UI can display a message while the files are being processed. The backend process that is invoked by the API needs to send an email message when the report processing is complete.

What should the developer do to configure the API to meet these requirements?

**A:** Change the API Gateway route to add an X-Amz-Invocation-Type header with a static value of ‘Event’ in the integration request. Deploy the API Gateway stage to apply the changes.

**B:** Change the configuration of the Lambda function that implements the request to process a file. Configure the maximum age of the event so that the Lambda function will run asynchronously.

**C:** Change the API Gateway timeout value to match the Lambda function timeout value. Deploy the API Gateway stage to apply the changes.

**D:** Change the API Gateway route to add an X-Amz-Target header with a static value of ‘Async’ in the integration request. Deploy the API Gateway stage to apply the changes.



**Answer: A**

**Timestamp: 2023-10-06 02:19:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122590-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 315 discussion

A company built an online event platform. For each event, the company organizes quizzes and generates leaderboards that are based on the quiz scores. The company stores the leaderboard data in Amazon DynamoDB and retains the data for 30 days after an event is complete. The company then uses a scheduled job to delete the old leaderboard data.

The DynamoDB table is configured with a fixed write capacity. During the months when many events occur, the DynamoDB write API requests are throttled when the scheduled delete job runs.

A developer must create a long-term solution that deletes the old leaderboard data and optimizes write throughput.

Which solution meets these requirements?

**A:** Configure a TTL attribute for the leaderboard data.

**B:** Use DynamoDB Streams to schedule and delete the leaderboard data.

**C:** Use AWS Step Functions to schedule and delete the leaderboard data.

**D:** Set a higher write capacity when the scheduled delete job runs.



**Answer: A**

**Timestamp: 2024-02-18 12:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134133-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 316 discussion

A company uses an AWS Lambda function that reads messages from an Amazon Simple Queue Service (Amazon SQS) standard queue. The Lambda function makes an HTTP call to a third-party API for each message. The company wants to ensure that the Lambda function does not overwhelm the third-party API with more than two concurrent requests.

Which solution will meet these requirements?

**A:** Configure a provisioned concurrency of two on the Lambda function.

**B:** Configure a batch size of two on the Amazon SQS event source mapping for the Lambda function.

**C:** Configure Lambda event filtering to process two messages from Amazon SQS at every invocations.

**D:** Configure a maximum concurrency of two on the Amazon SQS event source mapping for the Lambda function.



**Answer: D**

**Timestamp: 2024-02-18 12:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134135-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 317 discussion

A company is using Amazon API Gateway to develop an API for its application on AWS. A developer needs to test and generate API responses. Other teams are required to test the API immediately.

What should the developer do to meet these requirements?

**A:** Set up a mock integration request in API Gateway. Configure the method's integration request and integration response to associate a response with a given status code.

**B:** Set up the request validators in the API's OpenAPI definition file. Import the OpenAPI definitions into API Gateway to test the API.

**C:** Set up a gateway response for the API in API Gateway. Configure response headers with hardcoded HTTP status codes and responses.

**D:** Set up a request parameter-based Lambda authorizer to control access to the API. Configure the Lambda function with the necessary mapping template.



**Answer: A**

**Timestamp: 2024-02-18 12:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134136-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 318 discussion

A company is releasing a new feature. Users can request early access to the new feature by using an application form. The company expects a surge of requests when the application form becomes available. Each request will be stored as an item in an Amazon DynamoDB table.

Each item will contain the user's username, the submission date, and a validation status of UNVALIDATED. VALID, or NOT VALID. Each item also will contain the user's rating of the process on a scale of 1 to 5.

Each user can submit one request. For the DynamoDB table, the developer must choose a partition key that will give the workload well-distributed records across partitions.

Which DynamoDB attribute will meet these requirements?

**A:** Username

**B:** Submission date

**C:** Validation status

**D:** Rating of the process on a scale of 1 to 5



**Answer: A**

**Timestamp: 2024-02-22 07:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134343-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 319 discussion

A developer is creating a publicly accessible enterprise website consisting of only static assets. The developer is hosting the website in Amazon S3 and serving the website to users through an Amazon CloudFront distribution. The users of this application must not be able to access the application content directly from an S3 bucket. All content must be served through the Amazon CloudFront distribution.

Which solution will meet these requirements?

**A:** Create a new origin access control (OAC) in CloudFront. Configure the CloudFront distribution's origin to use the new OAC. Update the S3 bucket policy to allow CloudFront OAC with read and write access to access Amazon S3 as the origin.

**B:** Update the S3 bucket settings. Enable the block all public access setting in Amazon S3. Configure the CloudFront distribution's with Amazon S3 as the origin. Update the S3 bucket policy to allow CloudFront write access.

**C:** Update the S3 bucket's static website settings. Enable static website hosting and specifying index and error documents. Update the CloudFront origin to use the S3 bucket's website endpoint.

**D:** Update the CloudFront distribution's origin to send a custom header. Update the S3 bucket policy with a condition by using the aws:RequestTag/tag-key key. Configure the tag-key as the custom header name, and the value being matched is the header's value.



**Answer: A**

**Timestamp: 2024-02-22 07:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134344-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 153 discussion

A company uses a custom root certificate authority certificate chain (Root CA Cert) that is 10 KB in size to generate SSL certificates for its on-premises HTTPS endpoints. One of the company’s cloud-based applications has hundreds of AWS Lambda functions that pull data from these endpoints. A developer updated the trust store of the Lambda execution environment to use the Root CA Cert when the Lambda execution environment is initialized. The developer bundled the Root CA Cert as a text file in the Lambda deployment bundle.

After 3 months of development, the Root CA Cert is no longer valid and must be updated. The developer needs a more efficient solution to update the Root CA Cert for all deployed Lambda functions. The solution must not include rebuilding or updating all Lambda functions that use the Root CA Cert. The solution must also work for all development, testing, and production environments. Each environment is managed in a separate AWS account.

Which combination of steps should the developer take to meet these requirements MOST cost-effectively? (Choose two.)

**A:** Store the Root CA Cert as a secret in AWS Secrets Manager. Create a resource-based policy. Add IAM users to allow access to the secret.

**B:** Store the Root CA Cert as a SecureString parameter in AWS Systems Manager Parameter Store. Create a resource-based policy. Add IAM users to allow access to the policy.

**C:** Store the Root CA Cert in an Amazon S3 bucket. Create a resource-based policy to allow access to the bucket.

**D:** Refactor the Lambda code to load the Root CA Cert from the Root CA Cert’s location. Modify the runtime trust store inside the Lambda function handler.

**E:** Refactor the Lambda code to load the Root CA Cert from the Root CA Cert’s location. Modify the runtime trust store outside the Lambda function handler.



**Answer: AE**

**Timestamp: 2023-10-06 01:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122570-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 154 discussion

A developer maintains applications that store several secrets in AWS Secrets Manager. The applications use secrets that have changed over time. The developer needs to identify required secrets that are still in use. The developer does not want to cause any application downtime.

What should the developer do to meet these requirements?

**A:** Configure an AWS CloudTrail log file delivery to an Amazon S3 bucket. Create an Amazon CloudWatch alarm for the GetSecretValue Secrets Manager API operation requests.

**B:** Create a secretsmanager-secret-unused AWS Config managed rule. Create an Amazon EventBridge rule to initiate notifications when the AWS Config managed rule is met.

**C:** Deactivate the applications secrets and monitor the applications error logs temporarily.

**D:** Configure AWS X-Ray for the applications. Create a sampling rule to match the GetSecretValue Secrets Manager API operation requests.



**Answer: B**

**Timestamp: 2023-10-06 01:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122573-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 155 discussion

A developer is writing a serverless application that requires an AWS Lambda function to be invoked every 10 minutes.

What is an automated and serverless way to invoke the function?

**A:** Deploy an Amazon EC2 instance based on Linux, and edit its /etc/crontab file by adding a command to periodically invoke the Lambda function.

**B:** Configure an environment variable named PERIOD for the Lambda function. Set the value to 600.

**C:** Create an Amazon EventBridge rule that runs on a regular schedule to invoke the Lambda function.

**D:** Create an Amazon Simple Notification Service (Amazon SNS) topic that has a subscription to the Lambda function with a 600-second timer.



**Answer: C**

**Timestamp: 2023-10-06 01:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122574-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 156 discussion

A company is using Amazon OpenSearch Service to implement an audit monitoring system. A developer needs to create an AWS CloudFormation custom resource that is associated with an AWS Lambda function to configure the OpenSearch Service domain. The Lambda function must access the OpenSearch Service domain by using OpenSearch Service internal master user credentials.

What is the MOST secure way to pass these credentials to the Lambda function?

**A:** Use a CloudFormation parameter to pass the master user credentials at deployment to the OpenSearch Service domain’s MasterUserOptions and the Lambda function’s environment variable. Set the NoEcho attribute to true.

**B:** Use a CloudFormation parameter to pass the master user credentials at deployment to the OpenSearch Service domain’s MasterUserOptions and to create a parameter in AWS Systems Manager Parameter Store. Set the NoEcho attribute to true. Create an IAM role that has the ssm:GetParameter permission. Assign the role to the Lambda function. Store the parameter name as the Lambda function’s environment variable. Resolve the parameter’s value at runtime.

**C:** Use a CloudFormation parameter to pass the master user credentials at deployment to the OpenSearch Service domain’s MasterUserOptions and the Lambda function’s environment variable. Encrypt the parameter’s value by using the AWS Key Management Service (AWS KMS) encrypt command.

**D:** Use CloudFormation to create an AWS Secrets Manager secret. Use a CloudFormation dynamic reference to retrieve the secret’s value for the OpenSearch Service domain’s MasterUserOptions. Create an IAM role that has the secretsmanager:GetSecretValue permission. Assign the role to the Lambda function. Store the secret’s name as the Lambda function’s environment variable. Resolve the secret’s value at runtime.



**Answer: D**

**Timestamp: 2023-10-06 01:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122575-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 157 discussion

An application runs on multiple EC2 instances behind an ELB.

Where is the session data best written so that it can be served reliably across multiple requests?

**A:** Write data to Amazon ElastiCache.

**B:** Write data to Amazon Elastic Block Store.

**C:** Write data to Amazon EC2 Instance Store.

**D:** Write data to the root filesystem.



**Answer: A**

**Timestamp: 2023-10-06 01:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122576-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 194 discussion

A company has developed a new serverless application using AWS Lambda functions that will be deployed using the AWS Serverless Application Model (AWS SAM) CLI.

Which step should the developer complete prior to deploying the application?

**A:** Compress the application to a .zip file and upload it into AWS Lambda.

**B:** Test the new AWS Lambda function by first tracing it in AWS X-Ray.

**C:** Bundle the serverless application using a SAM package.

**D:** Create the application environment using the eb create my-env command.



**Answer: C**

**Timestamp: 2023-10-06 02:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122616-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 195 discussion

A company wants to automate part of its deployment process. A developer needs to automate the process of checking for and deleting unused resources that supported previously deployed stacks but that are no longer used.

The company has a central application that uses the AWS Cloud Development Kit (AWS CDK) to manage all deployment stacks. The stacks are spread out across multiple accounts. The developer’s solution must integrate as seamlessly as possible within the current deployment process.

Which solution will meet these requirements with the LEAST amount of configuration?

**A:** In the central AWS CDK application, write a handler function in the code that uses AWS SDK calls to check for and delete unused resources. Create an AWS CloudFormation template from a JSON file. Use the template to attach the function code to an AWS Lambda function and to invoke the Lambda function when the deployment stack runs.

**B:** In the central AWS CDK application, write a handler function in the code that uses AWS SDK calls to check for and delete unused resources. Create an AWS CDK custom resource. Use the custom resource to attach the function code to an AWS Lambda function and to invoke the Lambda function when the deployment stack runs.

**C:** In the central AWS CDK, write a handler function in the code that uses AWS SDK calls to check for and delete unused resources. Create an API in AWS Amplify. Use the API to attach the function code to an AWS Lambda function and to invoke the Lambda function when the deployment stack runs.

**D:** In the AWS Lambda console, write a handler function in the code that uses AWS SDK calls to check for and delete unused resources. Create an AWS CDK custom resource. Use the custom resource to import the Lambda function into the stack and to invoke the Lambda function when the deployment stack runs.



**Answer: B**

**Timestamp: 2023-10-06 02:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122617-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 196 discussion

A company built a new application in the AWS Cloud. The company automated the bootstrapping of new resources with an Auto Scaling group by using AWS CloudFormation templates. The bootstrap scripts contain sensitive data.

The company needs a solution that is integrated with CloudFormation to manage the sensitive data in the bootstrap scripts.

Which solution will meet these requirements in the MOST secure way?

**A:** Put the sensitive data into a CloudFormation parameter. Encrypt the CloudFormation templates by using an AWS Key Management Service (AWS KMS) key.

**B:** Put the sensitive data into an Amazon S3 bucket. Update the CloudFormation templates to download the object from Amazon S3 during bootstrap.

**C:** Put the sensitive data into AWS Systems Manager Parameter Store as a secure string parameter. Update the CloudFormation templates to use dynamic references to specify template values.

**D:** Put the sensitive data into Amazon Elastic File System (Amazon EFS). Enforce EFS encryption after file system creation. Update the CloudFormation templates to retrieve data from Amazon EFS.



**Answer: C**

**Timestamp: 2023-10-06 02:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122618-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 197 discussion

A company needs to set up secure database credentials for all its AWS Cloud resources. The company’s resources include Amazon RDS DB instances, Amazon DocumentDB clusters, and Amazon Aurora DB instances. The company’s security policy mandates that database credentials be encrypted at rest and rotated at a regular interval.

Which solution will meet these requirements MOST securely?

**A:** Set up IAM database authentication for token-based access. Generate user tokens to provide centralized access to RDS DB instances, Amazon DocumentDB clusters, and Aurora DB instances.

**B:** Create parameters for the database credentials in AWS Systems Manager Parameter Store. Set the Type parameter to SecureString. Set up automatic rotation on the parameters.

**C:** Store the database access credentials as an encrypted Amazon S3 object in an S3 bucket. Block all public access on the S3 bucket. Use S3 server-side encryption to set up automatic rotation on the encryption key.

**D:** Create an AWS Lambda function by using the SecretsManagerRotationTemplate template in the AWS Secrets Manager console. Create secrets for the database credentials in Secrets Manager. Set up secrets rotation on a schedule.



**Answer: D**

**Timestamp: 2023-10-06 02:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122619-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 198 discussion

A developer has created an AWS Lambda function that makes queries to an Amazon Aurora MySQL DB instance. When the developer performs a test, the DB instance shows an error for too many connections.

Which solution will meet these requirements with the LEAST operational effort?

**A:** Create a read replica for the DB instance. Query the replica DB instance instead of the primary DB instance.

**B:** Migrate the data to an Amazon DynamoDB database.

**C:** Configure the Amazon Aurora MySQL DB instance for Multi-AZ deployment.

**D:** Create a proxy in Amazon RDS Proxy. Query the proxy instead of the DB instance.



**Answer: D**

**Timestamp: 2023-10-06 02:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122620-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 428 discussion

A developer is deploying an application on Amazon EC2 instances that run in Account A. The application needs to read data from an existing Amazon Kinesis data stream in Account B.

Which actions should the developer take to provide the application with access to the stream? (Choose two.)

**A:** Update the instance profile role in Account A with stream read permissions.

**B:** Create an IAM role with stream read permissions in Account B.

**C:** Add a trust policy to the instance profile role and IAM role in Account B to allow the instance profile role to assume the IAM role.

**D:** Add a trust policy to the instance profile role and IAM role in Account B to allow reads from the stream.

**E:** Add a resource-based policy in Account B to allow read access from the instance profile role.



**Answer: BC**

**Timestamp: 2024-09-03 18:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146862-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 429 discussion

An ecommerce startup is preparing for an annual sales event. As the traffic to the company's application increases, the development team wants to be notified when the Amazon EC2 instance's CPU utilization exceeds 80%.

Which solution will meet this requirement?

**A:** Create a custom Amazon CloudWatch alarm that sends a notification to an Amazon SNS topic when the CPU utilization exceeds 80%.

**B:** Create a custom AWS CloudTrail alarm that sends a notification to an Amazon SNS topic when the CPU utilization exceeds 80%.

**C:** Create a cron job on the EC2 instance that invokes the --describe-instance-information command on the host instance every 15 minutes and sends the results to an Amazon SNS topic.

**D:** Create an AWS Lambda function that queries the AWS CloudTrail logs for the CPUUtilization metric every 15 minutes and sends a notification to an Amazon SNS topic when the CPU utilization exceeds 80%.



**Answer: A**

**Timestamp: 2024-11-04 01:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150695-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 43 discussion

A developer is designing an AWS Lambda function that creates temporary files that are less than 10 MB during invocation. The temporary files will be accessed and modified multiple times during invocation. The developer has no need to save or retrieve these files in the future.
Where should the temporary files be stored?

**A:** the /tmp directory

**B:** Amazon Elastic File System (Amazon EFS)

**C:** Amazon Elastic Block Store (Amazon EBS)

**D:** Amazon S3



**Answer: A**

**Timestamp: 2023-03-26 02:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103915-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 430 discussion

A company has an application that is deployed on AWS Elastic Beanstalk. The application generates user-specific PDFs and stores the PDFs in an Amazon S3 bucket. The application then uses Amazon Simple Email Service (Amazon SES) to send the PDFs by email to subscribers.

Users no longer access the PDFs 90 days after the PDFs are generated. The S3 bucket is not versioned and contains many obsolete PDFs.

A developer must reduce the number of files in the S3 bucket by removing PDFs that are older than 90 days.

Which solution will meet this requirement with the LEAST development effort?

**A:** Update the application code. In the code, add a rule to scan all the objects in the S3 bucket every day and to delete objects after 90 days.

**B:** Create an AWS Lambda function. Program the Lambda function to scan all the objects in the S3 bucket every day and to delete objects after 90 days.

**C:** Create an S3 Lifecycle rule for the S3 bucket to expire objects after 90 days.

**D:** Partition the S3 objects with a // key prefix. Create an AWS Lambda function to remove objects that have prefixes that have reached the expiration date.



**Answer: C**

**Timestamp: 2024-09-03 18:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146863-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 431 discussion

A developer is troubleshooting an application. The application includes several AWS Lambda functions that invoke an Amazon API Gateway API. The API Gateway's method request is set up to use an Amazon Cognito authorizer for authentication.

All the Lambda functions pass the user ID as part of the Authorization header to the API Gateway API. The API Gateway API returns a 403 status code for all GET requests.

How should the developer resolve this issue?

**A:** Modify the client GET request to include a valid API key in the Authorization header.

**B:** Modify the client GET request to include a valid token in the Authorization header.

**C:** Update the resource policy for the API Gateway API to allow the execute-api:Invoke action.

**D:** Modify the client to send an OPTIONS preflight request before the GET request.



**Answer: B**

**Timestamp: 2024-09-26 05:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148103-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 499 discussion

A company is developing a new application that uses Amazon EC2, Amazon S3, and AWS Lambda resources. The company wants to allow employees to access the AWS Management Console by using existing credentials that the company stores and manages in an on-premises Microsoft Active Directory. Each employee must have a specific level of access to the AWS resources that is based on the employee’s role.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Configure AWS Directory Service to create an Active Directory in AWS Directory Service for Microsoft Active Directory. Establish a trust relationship with the on-premises Active Directory. Configure IAM roles and trust policies to give the employees access to the AWS resources.

**B:** Use LDAP to directly integrate the on-premises Active Directory with AWS Identity and Access Management (IAM). Map Active Directory groups to IAM roles to control access to AWS resources.

**C:** Implement a custom identity broker to authenticate users into the on-premises Active Directory. Configure the identity broker to use AWS Security Token Service (AWS STS) to grant authorized users IAM role based access to the AWS resources.

**D:** Configure Amazon Cognito to federate users into the on-premises Active Directory. Use Cognito user pools to manage user identities and to manage user access to the AWS resources.



**Answer: A**

**Timestamp: 2025-02-17 10:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156667-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 5 discussion

A developer has created an AWS Lambda function that is written in Python. The Lambda function reads data from objects in Amazon S3 and writes data to an Amazon DynamoDB table. The function is successfully invoked from an S3 event notification when an object is created. However, the function fails when it attempts to write to the DynamoDB table.
What is the MOST likely cause of this issue?

**A:** The Lambda function's concurrency limit has been exceeded.

**B:** DynamoDB table requires a global secondary index (GSI) to support writes.

**C:** The Lambda function does not have IAM permissions to write to DynamoDB.

**D:** The DynamoDB table is not running in the same Availability Zone as the Lambda function.



**Answer: C**

**Timestamp: 2023-03-16 09:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102783-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 50 discussion

A developer is creating a mobile app that calls a backend service by using an Amazon API Gateway REST API. For integration testing during the development phase, the developer wants to simulate different backend responses without invoking the backend service.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create an AWS Lambda function. Use API Gateway proxy integration to return constant HTTP responses.

**B:** Create an Amazon EC2 instance that serves the backend REST API by using an AWS CloudFormation template.

**C:** Customize the API Gateway stage to select a response type based on the request.

**D:** Use a request mapping template to select the mock integration response.



**Answer: D**

**Timestamp: 2023-03-23 00:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103619-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 500 discussion

A company has an Amazon DynamoDB table that contains records of users that have signed up for a trial of the company’s product. The company is using a spreadsheet to track data about the product trial. The company needs to ensure the spreadsheet is automatically updated with the latest information when individual trials begin, are updated, or finish.

Which solution will meet these requirements?

**A:** Create a DynamoDB Accelerator (DAX) cluster from the table. Set the view type to old image. Create an AWS Lambda function that uses the cluster data to update the spreadsheet. Subscribe the Lambda function to the cluster.

**B:** Create a DynamoDB Accelerator (DAX) cluster from the table. Set the view type to new image. Create an AWS Lambda function that uses the cluster data to update the spreadsheet. Subscribe the Lambda function to the cluster.

**C:** Enable a DynamoDB stream for the table. Set the view type to new image. Create an AWS Lambda function that uses the stream data to update the spreadsheet. Subscribe the Lambda function to the stream.

**D:** Enable a DynamoDB stream for the table. Set the view type to old image. Create an AWS Lambda function that uses the stream data to update the spreadsheet. Subscribe the Lambda function to the stream.



**Answer: C**

**Timestamp: 2025-02-17 10:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156668-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 501 discussion

A developer is launching a global application that delivers content to multiple countries. The developer needs to serve specific content based on the country of each user and each user’s primary language. The developer must ensure that content is served reliably and with low latency.

Which solution will meet these requirements?

**A:** Create an Amazon API Gateway REST API. Create an AWS Global Accelerator standard accelerator to resolve requests to the API. Configure endpoint groups on the accelerator. Attach listeners for each country and language.

**B:** Store the content in a centralized Amazon S3 bucket. Enable S3 Transfer Acceleration on the bucket. Create an Amazon Route 53 hosted zone that includes the endpoint for the S3 bucket. Create records in Route 53 that use geoproximity and geolocation routing policies.

**C:** Create an Amazon API Gateway REST API. Connect the REST API to AWS WAF. Use geo match statements and regex match statements to allow or deny requests based on the labels returned from web request evaluations.

**D:** Configure an Amazon CloudFront distribution that uses the application as an origin. Configure the distribution to forward the Accept-Language header and the CloudFront-Viewer-Country header to the origin.



**Answer: D**

**Timestamp: 2024-12-10 04:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152773-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 41 discussion

A developer is building a web application that uses Amazon API Gateway to expose an AWS Lambda function to process requests from clients. During testing, the developer notices that the API Gateway times out even though the Lambda function finishes under the set time limit.
Which of the following API Gateway metrics in Amazon CloudWatch can help the developer troubleshoot the issue? (Choose two.)

**A:** CacheHitCount

**B:** IntegrationLatency

**C:** CacheMissCount

**D:** Latency

**E:** Count



**Answer: BD**

**Timestamp: 2023-03-25 14:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103858-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 410 discussion

A developer builds a serverless application on AWS by using Amazon API Gateway, AWS Lambda functions, and Amazon Route 53. During testing, the developer notices errors but cannot immediately locate the root cause.

To identify the errors, the developer needs to search all the application's logs.

What should the developer do to meet these requirements with the LEAST operational overhead?

**A:** Set up API Gateway health checks to monitor the application's availability. Use the Amazon CloudWatch PutMetricData API operation to publish the logs to CloudWatch. Search and query the logs by using Amazon Athena.

**B:** Set up Route 53 health checks to monitor the application's availability. Turn on AWS CloudTrail logs for all the AWS services that the application uses. Send the logs to a specified Amazon S3 bucket. Use Amazon Athena to query the log files directly from Amazon S3.

**C:** Configure all the application's AWS services to publish a real-time feed of log events to an Amazon Kinesis Data Firehose delivery stream. Configure the delivery stream to publish all the logs to an Amazon S3 bucket. Use Amazon OpenSearch Service to search and analyze the logs.

**D:** Set up Route 53 health checks to monitor the application's availability. Turn on Amazon CloudWatch Logs for the API Gateway stages to log API requests with a JSON log format. Use CloudWatch Logs Insights to search and analyze the logs from the AWS services that the application uses.



**Answer: D**

**Timestamp: 2024-07-16 03:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143937-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 411 discussion

A developer needs to freeze changes to an AWS CodeCommit repository before a production release. The developer will work on new features while a quality assurance (QA) team tests the release.

The QA testing and all bug fixes must take place in isolation from the main branch. After the release, the developer must integrate all bug fixes into the main branch.

Which solution will meet these requirements?

**A:** Create a release branch from the latest Git commit that will be in the release. Apply fixes to the release branch. Continue developing new features, and merge the features into the main branch. Merge the release branch into the main branch after the release.

**B:** Create a Git tag on the latest Git commit that will be in the release. Continue developing new features, and merge the features into the main branch. Apply fixes to the main branch. Update the Git tag for the release to be on the latest commit on the main branch.

**C:** Create a release branch from the latest Git commit that will be in the release. Apply fixes to the release branch. Continue developing new features, and merge the features into the main branch. Rebase the main branch onto the release branch after the release.

**D:** Create a Git tag on the latest Git commit that will be in the release. Continue developing new features, and merge the features into the main branch. Apply the Git commits for fixes to the Git tag for the release.



**Answer: A**

**Timestamp: 2024-07-24 01:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144464-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 412 discussion

A developer is setting up AWS CodePipeline for a new application. During each build, the developer must generate a test report.

Which solution will meet this requirement?

**A:** Create an AWS CodeBuild build project that runs tests. Configure the buildspec file with the test report information.

**B:** Create an AWS CodeDeploy deployment that runs tests. Configure the AppSpec file with the test report information.

**C:** Run the builds on an Amazon EC2 instance that has AWS Systems Manager Agent (SSM Agent) installed and activated.

**D:** Create a repository in AWS CodeArtifact. Select the test report template.



**Answer: A**

**Timestamp: 2024-07-28 08:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144608-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 413 discussion

A developer built an application by using multiple AWS Lambda functions. The Lambda functions must access dynamic configuration data at runtime. The data is maintained as a 6 KB JSON document in AWS AppConfig. The configuration data needs to be updated without requiring the redeployment of the application.

The developer needs a solution that will give the Lambda functions access to the dynamic configuration data.

What should the developer do to meet these requirements with the LEAST development effort?

**A:** Migrate the document from AWS AppConfig to a Lambda environment variable. Read the document at the runtime.

**B:** Configure the AWS AppConfig Agent Lambda extension. Access the dynamic configuration data by calling the extension on a local host.

**C:** Use the AWS X-Ray SDK to call the AWS AppConfig APIs. Retrieve the configuration file at runtime.

**D:** Migrate the configuration file to a Lambda deployment package. Read the file from the file system at runtime.



**Answer: B**

**Timestamp: 2024-07-28 08:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144609-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 243 discussion

A developer is building a serverless application by using AWS Serverless Application Model (AWS SAM) on multiple AWS Lambda functions. When the application is deployed, the developer wants to shift 10% of the traffic to the new deployment of the application for the first 10 minutes after deployment. If there are no issues, all traffic must switch over to the new version.

Which change to the AWS SAM template will meet these requirements?

**A:** Set the Deployment Preference Type to Canary10Percent10Minutes. Set the AutoPublishAlias property to the Lambda alias.

**B:** Set the Deployment Preference Type to Linear10PercentEvery10Minutes. Set AutoPublishAlias property to the Lambda alias.

**C:** Set the Deployment Preference Type to Canary10Percent10Minutes. Set the PreTraffic and PostTraffic properties to the Lambda alias.

**D:** Set the Deployment Preference Type to Linear10PercentEvery10Minutes. Set PreTraffic and PostTraffic properties to the Lambda alias.



**Answer: A**

**Timestamp: 2023-10-27 21:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124747-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 244 discussion

An AWS Lambda function is running in a company’s shared AWS account. The function needs to perform an additional ec2:DescribeInstances action that is directed at the company’s development accounts. A developer must configure the required permissions across the accounts.

How should the developer configure the permissions to adhere to the principle of least privilege?

**A:** Create an IAM role in the shared account. Add the ec2:DescribeInstances permission to the role. Establish a trust relationship between the development accounts for this role. Update the Lambda function IAM role in the shared account by adding the ec2:DescribeInstances permission to the role.

**B:** Create an IAM role in the development accounts. Add the ec2:DescribeInstances permission to the role. Establish a trust relationship with the shared account for this role. Update the Lambda function IAM role in the shared account by adding the iam:AssumeRole permissions.

**C:** Create an IAM role in the shared account. Add the ec2:DescribeInstances permission to the role. Establish a trust relationship between the development accounts for this role. Update the Lambda function IAM role in the shared account by adding the iam:AssumeRole permissions.

**D:** Create an IAM role in the development accounts. Add the ec2:DescribeInstances permission to the role. Establish a trust relationship with the shared account for this role. Update the Lambda function IAM role in the shared account by adding the ec2:DescribeInstances permission to the role.



**Answer: B**

**Timestamp: 2023-10-28 09:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124787-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 245 discussion

A developer is building a new application that will be deployed on AWS. The developer has created an AWS CodeCommit repository for the application. The developer has initialized a new project for the application by invoking the AWS Cloud Development Kit (AWS CDK) cdk init command.

The developer must write unit tests for the infrastructure as code (IaC) templates that the AWS CDK generates. The developer also must run a validation tool across all constructs in the CDK application to ensure that critical security configurations are activated.

Which combination of actions will meet these requirements with the LEAST development overhead? (Choose two.)

**A:** Use a unit testing framework to write custom unit tests against the cdk.out file that the AWS CDK generates. Run the unit tests in a continuous integration and continuous delivery (CI/CD) pipeline that is invoked after any commit to the repository.

**B:** Use the CDK assertions module to integrate unit tests with the application. Run the unit tests in a continuous integration and continuous delivery (CI/CD) pipeline that is invoked after any commit to the repository.

**C:** Use the CDK runtime context to set key-value pairs that must be present in the cdk.out file that the AWS CDK generates. Fail the stack synthesis if any violations are present.

**D:** Write a script that searches the application for specific key configuration strings. Configure the script to produce a report of any security violations.

**E:** Use the CDK Aspects class to create custom rules to apply to the CDK application. Fall the stack synthesis if any violations are present.



**Answer: BE**

**Timestamp: 2023-10-28 14:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124831-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 246 discussion

An online sales company is developing a serverless application that runs on AWS. The application uses an AWS Lambda function that calculates order success rates and stores the data in an Amazon DynamoDB table. A developer wants an efficient way to invoke the Lambda function every 15 minutes.

Which solution will meet this requirement with the LEAST development effort?

**A:** Create an Amazon EventBridge rule that has a rate expression that will run the rule every 15 minutes. Add the Lambda function as the target of the EventBridge rule.

**B:** Create an AWS Systems Manager document that has a script that will invoke the Lambda function on Amazon EC2. Use a Systems Manager Run Command task to run the shell script every 15 minutes.

**C:** Create an AWS Step Functions state machine. Configure the state machine to invoke the Lambda function execution role at a specified interval by using a Wait state. Set the interval to 15 minutes.

**D:** Provision a small Amazon EC2 instance. Set up a cron job that invokes the Lambda function every 15 minutes.



**Answer: A**

**Timestamp: 2023-10-27 21:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124748-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 247 discussion

A company deploys a photo-processing application to an Amazon EC2 instance. The application needs to process each photo in less than 5 seconds. If processing takes longer than 5 seconds, the company’s development team must receive a notification.

How can a developer implement the required time measurement and notification with the LEAST operational overhead?

**A:** Create an Amazon CloudWatch custom metric. Each time a photo is processed, publish the processing time as a metric value. Create a CloudWatch alarm that is based on a static threshold of 5 seconds. Notify the development team by using an Amazon Simple Notification Service (Amazon SNS) topic.

**B:** Create an Amazon Simple Queue Service (Amazon SQS) queue. Each time a photo is processed, publish the processing time to the queue. Create an application to consume from the queue and to determine whether any values are more than 5 seconds. Notify the development team by using an Amazon Simple Notification Service (Amazon SNS) topic.

**C:** Create an Amazon CloudWatch custom metric. Each time a photo is processed, publish the processing time as a metric value. Create a CloudWatch alarm that enters ALARM state if the average of values is greater than 5 seconds. Notify the development team by sending an Amazon Simple Email Service (Amazon SES) message.

**D:** Create an Amazon Kinesis data stream. Each time a photo is processed, publish the processing time to the data stream. Create an Amazon CloudWatch alarm that enters ALARM state if any values are more than 5 seconds. Notify the development team by using an Amazon Simple Notification Service (Amazon SNS) topic.



**Answer: A**

**Timestamp: 2023-10-29 01:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124858-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 202 discussion

A developer must provide an API key to an AWS Lambda function to authenticate with a third-party system. The Lambda function will run on a schedule. The developer needs to ensure that the API key remains encrypted at rest.

Which solution will meet these requirements?

**A:** Store the API key as a Lambda environment variable by using an AWS Key Management Service (AWS KMS) customer managed key.

**B:** Configure the application to prompt the user to provide the password to the Lambda function on the first run.

**C:** Store the API key as a value in the application code.

**D:** Use Lambda@Edge and only communicate over the HTTPS protocol.



**Answer: A**

**Timestamp: 2023-10-06 03:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122624-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 203 discussion

An IT department uses Amazon S3 to store sensitive images. After more than 1 year, the company moves the images into archival storage. The company rarely accesses the images, but the company wants a storage solution that maximizes resiliency. The IT department needs access to the images that have been moved to archival storage within 24 hours.

Which solution will meet these requirements MOST cost-effectively?

**A:** Use S3 Standard-Infrequent Access (S3 Standard-IA) to store the images. Use S3 Glacier Deep Archive with standard retrieval to store and retrieve archived images.

**B:** Use S3 Standard-Infrequent Access (S3 Standard-IA) to store the images. Use S3 Glacier Deep Archive with bulk retrieval to store and retrieve archived images.

**C:** Use S3 Intelligent-Tiering to store the images. Use S3 Glacier Deep Archive with standard retrieval to store and retrieve archived images.

**D:** Use S3 One Zone-Infrequent Access (S3 One Zone-IA) to store the images. Use S3 Glacier Deep Archive with bulk retrieval to store and retrieve archived images.



**Answer: A**

**Timestamp: 2023-10-06 03:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122625-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 204 discussion

A developer is building a serverless application by using the AWS Serverless Application Model (AWS SAM). The developer is currently testing the application in a development environment. When the application is nearly finished, the developer will need to set up additional testing and staging environments for a quality assurance team.

The developer wants to use a feature of the AWS SAM to set up deployments to multiple environments.

Which solution will meet these requirements with the LEAST development effort?

**A:** Add a configuration file in TOML format to group configuration entries to every environment. Add a table for each testing and staging environment. Deploy updates to the environments by using the sam deploy command and the --config-env flag that corresponds to each environment.

**B:** Create additional AWS SAM templates for each testing and staging environment. Write a custom shell script that uses the sam deploy command and the --template-file flag to deploy updates to the environments.

**C:** Create one AWS SAM configuration file that has default parameters. Perform updates to the testing and staging environments by using the --parameter-overrides flag in the AWS SAM CLI and the parameters that the updates will override.

**D:** Use the existing AWS SAM template. Add additional parameters to configure specific attributes for the serverless function and database table resources that are in each environment. Deploy updates to the testing and staging environments by using the sam deploy command.



**Answer: A**

**Timestamp: 2023-10-06 03:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122626-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 205 discussion

A developer is working on an application that processes operating data from IoT devices. Each IoT device uploads a data file once every hour to an Amazon S3 bucket. The developer wants to immediately process each data file when the data file is uploaded to Amazon S3.

The developer will use an AWS Lambda function to process the data files from Amazon S3. The Lambda function is configured with the S3 bucket information where the files are uploaded. The developer wants to configure the Lambda function to immediately invoke after each data file is uploaded.

Which solution will meet these requirements?

**A:** Add an asynchronous invocation to the Lambda function. Select the S3 bucket as the source.

**B:** Add an Amazon EventBridge event to the Lambda function. Select the S3 bucket as the source.

**C:** Add a trigger to the Lambda function. Select the S3 bucket as the source.

**D:** Add a layer to the Lambda function. Select the S3 bucket as the source.



**Answer: C**

**Timestamp: 2023-10-06 03:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122627-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 206 discussion

A developer is setting up infrastructure by using AWS CloudFormation. If an error occurs when the resources described in the Cloud Formation template are provisioned, successfully provisioned resources must be preserved. The developer must provision and update the CloudFormation stack by using the AWS CLI.

Which solution will meet these requirements?

**A:** Add an --enable-termination-protection command line option to the create-stack command and the update-stack command.

**B:** Add a --disable-rollback command line option to the create-stack command and the update-stack command.

**C:** Add a --parameters ParameterKey=PreserveResources,ParameterValue=True command line option to the create-stack command and the update-stack command.

**D:** Add a --tags Key=PreserveResources,Value=True command line option to the create-stack command and the update-stack command.



**Answer: B**

**Timestamp: 2023-10-06 03:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122628-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 199 discussion

A developer is creating a new REST API by using Amazon API Gateway and AWS Lambda. The development team tests the API and validates responses for the known use cases before deploying the API to the production environment.

The developer wants to make the REST API available for testing by using API Gateway locally.

Which AWS Serverless Application Model Command Line Interface (AWS SAM CLI) subcommand will meet these requirements?

**A:** Sam local invoke

**B:** Sam local generate-event

**C:** Sam local start-lambda

**D:** Sam local start-api



**Answer: D**

**Timestamp: 2023-10-06 03:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122621-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 2 discussion

A company is running Amazon EC2 instances in multiple AWS accounts. A developer needs to implement an application that collects all the lifecycle events of the EC2 instances. The application needs to store the lifecycle events in a single Amazon Simple Queue Service (Amazon SQS) queue in the company's main AWS account for further processing.
Which solution will meet these requirements?

**A:** Configure Amazon EC2 to deliver the EC2 instance lifecycle events from all accounts to the Amazon EventBridge event bus of the main account. Add an EventBridge rule to the event bus of the main account that matches all EC2 instance lifecycle events. Add the SQS queue as a target of the rule.

**B:** Use the resource policies of the SQS queue in the main account to give each account permissions to write to that SQS queue. Add to the Amazon EventBridge event bus of each account an EventBridge rule that matches all EC2 instance lifecycle events. Add the SQS queue in the main account as a target of the rule.

**C:** Write an AWS Lambda function that scans through all EC2 instances in the company accounts to detect EC2 instance lifecycle changes. Configure the Lambda function to write a notification message to the SQS queue in the main account if the function detects an EC2 instance lifecycle change. Add an Amazon EventBridge scheduled rule that invokes the Lambda function every minute.

**D:** Configure the permissions on the main account event bus to receive events from all accounts. Create an Amazon EventBridge rule in each account to send all the EC2 instance lifecycle events to the main account event bus. Add an EventBridge rule to the main account event bus that matches all EC2 instance lifecycle events. Set the SQS queue as a target for the rule.



**Answer: D**

**Timestamp: 2023-03-16 09:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102782-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 20 discussion

A developer wants to store information about movies. Each movie has a title, release year, and genre. The movie information also can include additional properties about the cast and production crew. This additional information is inconsistent across movies. For example, one movie might have an assistant director, and another movie might have an animal trainer.
The developer needs to implement a solution to support the following use cases:
For a given title and release year, get all details about the movie that has that title and release year.
For a given title, get all details about all movies that have that title.
For a given genre, get all details about all movies in that genre.
Which data store configuration will meet these requirements?

**A:** Create an Amazon DynamoDB table. Configure the table with a primary key that consists of the title as the partition key and the release year as the sort key. Create a global secondary index that uses the genre as the partition key and the title as the sort key.

**B:** Create an Amazon DynamoDB table. Configure the table with a primary key that consists of the genre as the partition key and the release year as the sort key. Create a global secondary index that uses the title as the partition key.

**C:** On an Amazon RDS DB instance, create a table that contains columns for title, release year, and genre. Configure the title as the primary key.

**D:** On an Amazon RDS DB instance, create a table where the primary key is the title and all other data is encoded into JSON format as one additional column.



**Answer: A**

**Timestamp: 2023-03-21 13:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103468-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 200 discussion

A company has a serverless application on AWS that uses a fleet of AWS Lambda functions that have aliases. The company regularly publishes new Lambda function by using an in-house deployment solution. The company wants to improve the release process and to use traffic shifting. A newly published function version should initially make available only to a fixed percentage of production users.

Which solution will meet these requirements?

**A:** Configure routing on the alias of the new function by using a weighted alias.

**B:** Configure a canary deployment type for Lambda.

**C:** Configure routing on the new versions by using environment variables.

**D:** Configure a linear deployment type for Lambda.



**Answer: A**

**Timestamp: 2023-10-06 03:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122622-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 201 discussion

A company has an application that stores data in Amazon RDS instances. The application periodically experiences surges of high traffic that cause performance problems. During periods of peak traffic, a developer notices a reduction in query speed in all database queries.

The team’s technical lead determines that a multi-threaded and scalable caching solution should be used to offload the heavy read traffic. The solution needs to improve performance.

Which solution will meet these requirements with the LEAST complexity?

**A:** Use Amazon ElastiCache for Memcached to offload read requests from the main database.

**B:** Replicate the data to Amazon DynamoDSet up a DynamoDB Accelerator (DAX) cluster.

**C:** Configure the Amazon RDS instances to use Multi-AZ deployment with one standby instance. Offload read requests from the main database to the standby instance.

**D:** Use Amazon ElastiCache for Redis to offload read requests from the main database.



**Answer: A**

**Timestamp: 2023-10-06 03:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122623-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 62 discussion

A company has deployed an application on AWS Elastic Beanstalk. The company has configured the Auto Scaling group that is associated with the Elastic Beanstalk environment to have five Amazon EC2 instances. If the capacity is fewer than four EC2 instances during the deployment, application performance degrades. The company is using the all-at-once deployment policy.
What is the MOST cost-effective way to solve the deployment issue?

**A:** Change the Auto Scaling group to six desired instances.

**B:** Change the deployment policy to traffic splitting. Specify an evaluation time of 1 hour.

**C:** Change the deployment policy to rolling with additional batch. Specify a batch size of 1.

**D:** Change the deployment policy to rolling. Specify a batch size of 2.



**Answer: C**

**Timestamp: 2023-03-27 02:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/104016-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 63 discussion

A developer is incorporating AWS X-Ray into an application that handles personal identifiable information (PII). The application is hosted on Amazon EC2 instances. The application trace messages include encrypted PII and go to Amazon CloudWatch. The developer needs to ensure that no PII goes outside of the EC2 instances.
Which solution will meet these requirements?

**A:** Manually instrument the X-Ray SDK in the application code.

**B:** Use the X-Ray auto-instrumentation agent.

**C:** Use Amazon Macie to detect and hide PII. Call the X-Ray API from AWS Lambda.

**D:** Use AWS Distro for Open Telemetry.



**Answer: A**

**Timestamp: 2023-03-26 14:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103955-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 64 discussion

A developer is migrating some features from a legacy monolithic application to use AWS Lambda functions instead. The application currently stores data in an Amazon Aurora DB cluster that runs in private subnets in a VPC. The AWS account has one VPC deployed. The Lambda functions and the DB cluster are deployed in the same AWS Region in the same AWS account.
The developer needs to ensure that the Lambda functions can securely access the DB cluster without crossing the public internet.
Which solution will meet these requirements?

**A:** Configure the DB cluster's public access setting to Yes.

**B:** Configure an Amazon RDS database proxy for he Lambda functions.

**C:** Configure a NAT gateway and a security group for the Lambda functions.

**D:** Configure the VPC, subnets, and a security group for the Lambda functions.



**Answer: D**

**Timestamp: 2023-03-23 18:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103687-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 65 discussion

A developer is building a new application on AWS. The application uses an AWS Lambda function that retrieves information from an Amazon DynamoDB table. The developer hard coded the DynamoDB table name into the Lambda function code. The table name might change over time. The developer does not want to modify the Lambda code if the table name changes.
Which solution will meet these requirements MOST efficiently?

**A:** Create a Lambda environment variable to store the table name. Use the standard method for the programming language to retrieve the variable.

**B:** Store the table name in a file. Store the file in the /tmp folder. Use the SDK for the programming language to retrieve the table name.

**C:** Create a file to store the table name. Zip the file and upload the file to the Lambda layer. Use the SDK for the programming language to retrieve the table name.

**D:** Create a global variable that is outside the handler in the Lambda function to store the table name.



**Answer: A**

**Timestamp: 2023-03-23 18:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103686-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 66 discussion

A company has a critical application on AWS. The application exposes an HTTP API by using Amazon API Gateway. The API is integrated with an AWS Lambda function. The application stores data in an Amazon RDS for MySQL DB instance with 2 virtual CPUs (vCPUs) and 64 GB of RAM.

Customers have reported that some of the API calls return HTTP 500 Internal Server Error responses. Amazon CloudWatch Logs shows errors for “too many connections.” The errors occur during peak usage times that are unpredictable.

The company needs to make the application resilient. The database cannot be down outside of scheduled maintenance hours.

Which solution will meet these requirements?

**A:** Decrease the number of vCPUs for the DB instance. Increase the max_connections setting.

**B:** Use Amazon RDS Proxy to create a proxy that connects to the DB instance. Update the Lambda function to connect to the proxy.

**C:** Add a CloudWatch alarm that changes the DB instance class when the number of connections increases to more than 1,000.

**D:** Add an Amazon EventBridge rule that increases the max_connections setting of the DB instance when CPU utilization is above 75%.



**Answer: B**

**Timestamp: 2023-04-25 14:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107437-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 257 discussion

A developer is building an application that will use an Amazon API Gateway API with an AWS Lambda backend. The team that will develop the frontend requires immediate access to the API endpoints to build the UI. To prepare the backend application for integration, the developer needs to set up endpoints. The endpoints need to return predefined HTTP status codes and JSON responses for the frontend team. The developer creates a method for an API resource.

Which solution will meet these requirements?

**A:** Set the integration type to AWS_PROXY. Provision Lambda functions to return hardcoded JSON data.

**B:** Set the integration type to MOCK. Configure the method's integration request and integration response to associate a JSON responses with specific HTTP status codes.

**C:** Set the integration type to HTTP_PROXY. Configure API Gateway to pass all requests to an external placeholder API. which the team will build.

**D:** Set the integration type to MOCK. Use a method request to define HTTP status codes. Use an integration request to define JSON responses.



**Answer: B**

**Timestamp: 2024-02-17 17:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134068-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 258 discussion

A developer is migrating an application to Amazon Elastic Kubernetes Service (Amazon EKS). The developer migrates the application to Amazon Elastic Container Registry (Amazon ECR) with an EKS cluster. As part of the application migration to a new backend, the developer creates a new AWS account. The developer makes configuration changes to the application to point the application to the new AWS account and to use new backend resources. The developer successfully tests the changes within the application by deploying the pipeline.

The Docker image build and the pipeline deployment are successful, but the application is still connecting to the old backend. The developer finds that the application's configuration is still referencing the original EKS cluster and not referencing the new backend resources.

Which reason can explain why the application is not connecting to the new resources?

**A:** The developer did not successfully create the new AWS account.

**B:** The developer added a new tag to the Docker image.

**C:** The developer did not update the Docker image tag to a new version.

**D:** The developer pushed the changes to a new Docker image tag.



**Answer: C**

**Timestamp: 2024-02-21 03:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134259-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 259 discussion

A developer is creating an application that reads and writes to multiple Amazon S3 buckets. The application will be deployed to an Amazon EC2 instance. The developer wants to make secure API requests from the EC2 instances without the need to manage the security credentials for the application. The developer needs to apply the principle of least privilege.

Which solution will meet these requirements?

**A:** Create an IAM user. Create access keys and secret keys for the user. Associate the user with an IAM policy that allows s3:* permissions.

**B:** Associate the EC2 instance with an IAM role that has an IAM policy that allows s3:ListBucket and s3:*Object permissions for specific S3 buckets.

**C:** Associate the EC2 instance with an IAM role that has an AmazonS3FullAccess AWS managed policy.

**D:** Create a bucket policy on the S3 bucket that allows s3:ListBucket and s3:*Object permissions to the EC2 instance.



**Answer: B**

**Timestamp: 2024-02-21 03:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134260-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 26 discussion

A developer is creating an application that will be deployed on IoT devices. The application will send data to a RESTful API that is deployed as an AWS Lambda function. The application will assign each API request a unique identifier. The volume of API requests from the application can randomly increase at any given time of day.
During periods of request throttling, the application might need to retry requests. The API must be able to handle duplicate requests without inconsistencies or data loss.
Which solution will meet these requirements?

**A:** Create an Amazon RDS for MySQL DB instance. Store the unique identifier for each request in a database table. Modify the Lambda function to check the table for the identifier before processing the request.

**B:** Create an Amazon DynamoDB table. Store the unique identifier for each request in the table. Modify the Lambda function to check the table for the identifier before processing the request.

**C:** Create an Amazon DynamoDB table. Store the unique identifier for each request in the table. Modify the Lambda function to return a client error response when the function receives a duplicate request.

**D:** Create an Amazon ElastiCache for Memcached instance. Store the unique identifier for each request in the cache. Modify the Lambda function to check the cache for the identifier before processing the request.



**Answer: B**

**Timestamp: 2023-03-23 11:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103656-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 260 discussion

A developer is writing an application that will retrieve sensitive data from a third-party system. The application will format the data into a PDF file. The PDF file could be more than 1 MB. The application will encrypt the data to disk by using AWS Key Management Service (AWS KMS). The application will decrypt the file when a user requests to download it. The retrieval and formatting portions of the application are complete.

The developer needs to use the GenerateDataKey API to encrypt the PDF file so that the PDF file can be decrypted later. The developer needs to use an AWS KMS symmetric customer managed key for encryption.

Which solutions will meet these requirements?

**A:** Write the encrypted key from the GenerateDataKey API to disk for later use. Use the plaintext key from the GenerateDataKey API and a symmetric encryption algorithm to encrypt the file.

**B:** Write the plain text key from the GenerateDataKey API to disk for later use. Use the encrypted key from the GenerateDataKey API and a symmetric encryption algorithm to encrypt the file.

**C:** Write the encrypted key from the GenerateDataKey API to disk for later use. Use the plaintext key from the GenerateDataKey API to encrypt the file by using the KMS Encrypt API.

**D:** Write the plain text key from the GenerateDataKey API to disk for later use. Use the encrypted key from the GenerateDataKey API to encrypt the file by using the KMS Encrypt API.



**Answer: A**

**Timestamp: 2024-02-21 03:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134261-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 126 discussion

A developer is integrating Amazon ElastiCache in an application. The cache will store data from a database. The cached data must populate real-time dashboards.

Which caching strategy will meet these requirements?

**A:** A read-through cache

**B:** A write-behind cache

**C:** A lazy-loading cache

**D:** A write-through cache



**Answer: D**

**Timestamp: 2023-04-23 00:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107063-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 127 discussion

A developer is creating an AWS Lambda function. The Lambda function needs an external library to connect to a third-party solution. The external library is a collection of files with a total size of 100 MB. The developer needs to make the external library available to the Lambda execution environment and reduce the Lambda package space.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create a Lambda layer to store the external library. Configure the Lambda function to use the layer.

**B:** Create an Amazon S3 bucket. Upload the external library into the S3 bucket. Mount the S3 bucket folder in the Lambda function. Import the library by using the proper folder in the mount point.

**C:** Load the external library to the Lambda function's /tmp directory during deployment of the Lambda package. Import the library from the /tmp directory.

**D:** Create an Amazon Elastic File System (Amazon EFS) volume. Upload the external library to the EFS volume. Mount the EFS volume in the Lambda function. Import the library by using the proper folder in the mount point.



**Answer: A**

**Timestamp: 2023-04-23 00:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107064-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 128 discussion

A company has a front-end application that runs on four Amazon EC2 instances behind an Elastic Load Balancer (ELB) in a production environment that is provisioned by AWS Elastic Beanstalk. A developer needs to deploy and test new application code while updating the Elastic Beanstalk platform from the current version to a newer version of Node.js. The solution must result in zero downtime for the application.

Which solution meets these requirements?

**A:** Clone the production environment to a different platform version. Deploy the new application code, and test it. Swap the environment URLs upon verification.

**B:** Deploy the new application code in an all-at-once deployment to the existing EC2 instances. Test the code. Redeploy the previous code if verification fails.

**C:** Perform an immutable update to deploy the new application code to new EC2 instances. Serve traffic to the new instances after they pass health checks.

**D:** Use a rolling deployment for the new application code. Apply the code to a subset of EC2 instances until the tests pass. Redeploy the previous code if the tests fail.



**Answer: C**

**Timestamp: 2023-04-23 00:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107066-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 129 discussion

A developer is creating an AWS Lambda function. The Lambda function will consume messages from an Amazon Simple Queue Service (Amazon SQS) queue. The developer wants to integrate unit testing as part of the function's continuous integration and continuous delivery (CI/CD) process.

How can the developer unit test the function?

**A:** Create an AWS CloudFormation template that creates an SQS queue and deploys the Lambda function. Create a stack from the template during the CI/CD process. Invoke the deployed function. Verify the output.

**B:** Create an SQS event for tests. Use a test that consumes messages from the SQS queue during the function's Cl/CD process.

**C:** Create an SQS queue for tests. Use this SQS queue in the application's unit test. Run the unit tests during the CI/CD process.

**D:** Use the aws lambda invoke command with a test event during the CIICD process.



**Answer: D**

**Timestamp: 2023-06-17 06:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/112424-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 13 discussion

A company receives food orders from multiple partners. The company has a microservices application that uses Amazon API Gateway APIs with AWS Lambda integration. Each partner sends orders by calling a customized API that is exposed through API Gateway. The API call invokes a shared Lambda function to process the orders.
Partners need to be notified after the Lambda function processes the orders. Each partner must receive updates for only the partner's own orders. The company wants to add new partners in the future with the fewest code changes possible.
Which solution will meet these requirements in the MOST scalable way?

**A:** Create a different Amazon Simple Notification Service (Amazon SNS) topic for each partner. Configure the Lambda function to publish messages for each partner to the partner's SNS topic.

**B:** Create a different Lambda function for each partner. Configure the Lambda function to notify each partner's service endpoint directly.

**C:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Configure the Lambda function to publish messages with specific attributes to the SNS topic. Subscribe each partner to the SNS topic. Apply the appropriate filter policy to the topic subscriptions.

**D:** Create one Amazon Simple Notification Service (Amazon SNS) topic. Subscribe all partners to the SNS topic.



**Answer: C**

**Timestamp: 2023-03-21 06:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103442-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 32 discussion

A developer needs to perform geographic load testing of an API. The developer must deploy resources to multiple AWS Regions to support the load testing of the API.
How can the developer meet these requirements without additional application code?

**A:** Create and deploy an AWS Lambda function in each desired Region. Configure the Lambda function to create a stack from an AWS CloudFormation template in that Region when the function is invoked.

**B:** Create an AWS CloudFormation template that defines the load test resources. Use the AWS CLI create-stack-set command to create a stack set in the desired Regions.

**C:** Create an AWS Systems Manager document that defines the resources. Use the document to create the resources in the desired Regions.

**D:** Create an AWS CloudFormation template that defines the load test resources. Use the AWS CLI deploy command to create a stack from the template in each Region.



**Answer: B**

**Timestamp: 2023-03-21 22:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103515-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 320 discussion

A developer built an application that calls an external API to obtain data, processes the data, and saves the result to Amazon S3. The developer built a container image with all of the necessary dependencies to run the application as a container.

The application runs locally and requires minimal CPU and RAM resources. The developer has created an Amazon ECS cluster. The developer needs to run the application hourly in Amazon Elastic Container Service (Amazon ECS).

Which solution will meet these requirements with the LEAST amount of infrastructure management overhead?

**A:** Add a capacity provider to manage instances.

**B:** Add an Amazon EC2 instance that runs the application.

**C:** Define a task definition with an AWS Fargate launch type.

**D:** Create an Amazon ECS cluster and add the managed node groups feature to run the application.



**Answer: C**

**Timestamp: 2024-02-18 12:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134139-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 321 discussion

A company runs its website on AWS. The company posts daily polls on its website and publishes the poll results next day. The website stores user responses in an Amazon DynamoDB table. After the poll results are published, the company does not need to keep the user responses.

A developer needs to implement a solution that will automatically remove old user responses from the DynamoDB table. The developer adds a new expiration_date attribute to the DynamoDB table. The developer plans to use the expiration_date attribute for the automation.

Which solution will meet these requirements with the LEAST development effort?

**A:** Create an AWS Lambda function to delete old user responses based on the expiration_date attribute. Create an Amazon EventBridge schedule to run the Lambda function daily.

**B:** Create an AWS Fargate task in Amazon Elastic Container Service (Amazon ECS) to delete old user responses based on the expiration_date attribute. Create an Amazon EventBridge schedule to run the Fargate task daily.

**C:** Create an AWS Glue job to delete old user responses based on the expiration_date attribute. Create an AWS Glue trigger schedule to run the job daily.

**D:** Enable TTL on the DynamoDB table and specify the expiration_date attribute. Expire old user responses by using DynamoDB TTL.



**Answer: D**

**Timestamp: 2024-02-12 18:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133631-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 322 discussion

A developer is creating a simple proof-of-concept demo by using AWS CloudFormation and AWS Lambda functions. The demo will use a CloudFormation template to deploy an existing Lambda function. The Lambda function uses deployment packages and dependencies stored in Amazon S3. The developer defined an AWS::Lambda::Function resource in a CloudFormation template. The developer needs to add the S3 bucket to the CloudFormation template.

What should the developer do to meet these requirements with the LEAST development effort?

**A:** Add the function code in the CloudFormation template inline as the code property.

**B:** Add the function code in the CloudFormation template as the ZipFile property.

**C:** Find the S3 key for the Lambda function. Add the S3 key as the ZipFile property in the CloudFormation template.

**D:** Add the relevant key and bucket to the S3Bucket and S3Key properties in the CloudFormation template.



**Answer: D**

**Timestamp: 2024-02-12 18:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133632-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 323 discussion

A developer is building a microservices-based application by using Python on AWS and several AWS services. The developer must use AWS X-Ray. The developer views the service map by using the console to view the service dependencies. During testing, the developer notices that some services are missing from the service map.

What can the developer do to ensure that all services appear in the X-Ray service map?

**A:** Modify the X-Ray Python agent configuration in each service to increase the sampling rate.

**B:** Instrument the application by using the X-Ray SDK for Python. Install the X-Ray SDK for all the services that the application uses.

**C:** Enable X-Ray data aggregation in Amazon CloudWatch Logs for all the services that the application uses.

**D:** Increase the X-Ray service map timeout value in the X-Ray console.



**Answer: B**

**Timestamp: 2024-02-12 18:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133633-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 333 discussion

A developer is building an event-driven application by using AWS Lambda and Amazon EventBridge. The Lambda function needs to push events to an EventBridge event bus. The developer uses an SDK to run the PutEvents EventBridge action and specifies no credentials in the code. After deploying the Lambda function, the developer notices that the function is failing and there are AccessDeniedException errors in the logs.

How should the developer resolve this issue?

**A:** Configure a VPC peering connection between the Lambda function and EventBridge.

**B:** Modify their AWS credentials to include permissions for the PutEvents EventBridge action.

**C:** Modify the Lambda function execution role to include permissions for the PutEvents EventBridge action.

**D:** Add a resource-based policy to the Lambda function to include permissions for the PutEvents EventBridge action.



**Answer: C**

**Timestamp: 2024-03-23 03:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136958-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 334 discussion

A company's application has an AWS Lambda function that processes messages from IoT devices. The company wants to monitor the Lambda function to ensure that the Lambda function is meeting its required service level agreement (SLA).

A developer must implement a solution to determine the application's throughput in near real time. The throughput must be based on the number of messages that the Lambda function receives and processes in a given time period. The Lambda function performs initialization and post-processing steps that must not factor into the throughput measurement.

What should the developer do to meet these requirements?

**A:** Use the Lambda function's ConcurrentExecutions metric in Amazon CloudWatch to measure the throughput.

**B:** Modify the application to log the calculated throughput to Amazon CloudWatch Logs. Use Amazon EventBridge to invoke a separate Lambda function to process the logs on a schedule.

**C:** Modify the application to publish custom Amazon CloudWatch metrics when the Lambda function receives and processes each message. Use the metrics to calculate the throughput.

**D:** Use the Lambda function's Invocations metric and Duration metric to calculate the throughput in Amazon CloudWatch.



**Answer: C**

**Timestamp: 2024-03-19 15:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136640-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 335 discussion

A developer is using an AWS CodePipeline pipeline to provide continuous integration and continuous delivery (CI/CD) support for a Java application. The developer needs to update the pipeline to support the introduction of a new application dependency .jar file. The pipeline must start a build when a new version of the .jar file becomes available.

Which solution will meet these requirements?

**A:** Create an Amazon S3 bucket to store the dependency .jar file. Publish the dependency .jar file to the S3 bucket. Use an Amazon Simple Notification Service (Amazon SNS) notification to start a CodePipeline pipeline build.

**B:** Create an Amazon Elastic Container Registry (Amazon ECR) private repository. Publish the dependency .jar file to the repository. Use an ECR source action to start a CodePipeline pipeline build.

**C:** Create an Amazon Elastic Container Registry (Amazon ECR) private repository. Publish the dependency .jar file to the repository. Use an Amazon Simple Notification Service (Amazon SNS) notification to start a CodePipeline pipeline build.

**D:** Create an AWS CodeArtifact repository. Publish the dependency .jar file to the repository. Use an Amazon EventBridge rule to start a CodePipeline pipeline build.



**Answer: D**

**Timestamp: 2024-03-19 15:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136644-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 336 discussion

A company with multiple branch locations has an analytics and reporting application. Each branch office pushes a sales report to a shared Amazon S3 bucket at a predefined time each day. The company has developed an AWS Lambda function that analyzes the reports from all branch offices in a single pass. The Lambda function stores the results in a database.

The company needs to start the analysis once each day at a specific time.

Which solution will meet these requirements MOST cost-effectively?

**A:** Configure an S3 event notification to invoke the Lambda function when a branch office uploads a sales report.

**B:** Create an AWS Step Functions state machine that invokes the Lambda function once each day at the predefined time.

**C:** Configure the Lambda function to run continuously and to begin analysis only at the predefined time each day.

**D:** Create an Amazon EventBridge scheduled rule that invokes the Lambda function once each day at the predefined time.



**Answer: D**

**Timestamp: 2024-03-23 03:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136959-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 337 discussion

A developer has an application that asynchronously invokes an AWS Lambda function. The developer wants to store messages that resulted in failed invocations of the Lambda function so that the application can retry the call later.

What should the developer do to accomplish this goal with the LEAST operational overhead?

**A:** Set up Amazon CloudWatch Logs log groups to filter and store the messages in an Amazon S3 bucket. Import the messages in Lambda. Run the Lambda function again.

**B:** Configure Amazon EventBridge to send the messages to Amazon Simple Notification Service (Amazon SNS) to initiate the Lambda function again.

**C:** Implement a dead-letter queue for discarded messages. Set the dead-letter queue as an event source for the Lambda function.

**D:** Send Amazon EventBridge events to an Amazon Simple Queue Service (Amazon SQS) queue. Configure the Lambda function to pull messages from the SQS queue. Run the Lambda function again.



**Answer: C**

**Timestamp: 2024-03-23 03:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136961-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 225 discussion

An application is real-time processing millions of events that are received through an API.

What service could be used to allow multiple consumers to process the data concurrently and MOST cost-effectively?

**A:** Amazon SNS with fanout to an SQS queue for each application

**B:** Amazon SNS with fanout to an SQS FIFO (first-in, first-out) queue for each application

**C:** Amazon Kinesis Firehose

**D:** Amazon Kinesis Data Streams



**Answer: D**

**Timestamp: 2023-10-28 08:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124775-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 226 discussion

Given the following AWS CloudFormation template:

//IMG//


What is the MOST efficient way to reference the new Amazon S3 bucket from another AWS CloudFormation template?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image14.png

**A:** Add an Export declaration to the Outputs section of the original template and use ImportValue in other templates.

**B:** Add Exported: true to the Content.Bucket in the original template and use ImportResource in other templates.

**C:** Create a custom AWS CloudFormation resource that gets the bucket name from the ContentBucket resource of the first stack.

**D:** Use Fn::Include to include the existing template in other templates and use the ContentBucket resource directly.



**Answer: A**

**Timestamp: 2023-10-28 14:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124817-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 227 discussion

A developer has built an application that inserts data into an Amazon DynamoDB table. The table is configured to use provisioned capacity. The application is deployed on a burstable nano Amazon EC2 instance. The application logs show that the application has been failing because of a ProvisionedThroughputExceededException error.

Which actions should the developer take to resolve this issue? (Choose two.)

**A:** Move the application to a larger EC2 instance.

**B:** Increase the number of read capacity units (RCUs) that are provisioned for the DynamoDB table.

**C:** Reduce the frequency of requests to DynamoDB by implementing exponential backoff.

**D:** Increase the frequency of requests to DynamoDB by decreasing the retry delay.

**E:** Change the capacity mode of the DynamoDB table from provisioned to on-demand.



**Answer: CE**

**Timestamp: 2023-10-28 14:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124816-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 228 discussion

A company is hosting a workshop for external users and wants to share the reference documents with the external users for 7 days. The company stores the reference documents in an Amazon S3 bucket that the company owns.

What is the MOST secure way to share the documents with the external users?

**A:** Use S3 presigned URLs to share the documents with the external users. Set an expiration time of 7 days.

**B:** Move the documents to an Amazon WorkDocs folder. Share the links of the WorkDocs folder with the external users.

**C:** Create temporary IAM users that have read-only access to the S3 bucket. Share the access keys with the external users. Expire the credentials after 7 days.

**D:** Create a role that has read-only access to the S3 bucket. Share the Amazon Resource Name (ARN) of this role with the external users.



**Answer: A**

**Timestamp: 2023-10-28 08:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124778-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 229 discussion

A developer is planning to use an Amazon API Gateway and AWS Lambda to provide a REST API. The developer will have three distinct environments to manage: development, test, and production.

How should the application be deployed while minimizing the number of resources to manage?

**A:** Create a separate API Gateway and separate Lambda function for each environment in the same Region.

**B:** Assign a Region for each environment and deploy API Gateway and Lambda to each Region.

**C:** Create one API Gateway with multiple stages with one Lambda function with multiple aliases.

**D:** Create one API Gateway and one Lambda function, and use a REST parameter to identify the environment.



**Answer: C**

**Timestamp: 2023-10-28 14:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124815-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 554 discussion

A developer has an application that runs in AWS Account A. The application must retrieve an AWS Secrets Manager secret that is encrypted by an AWS Key Management Service (AWS KMS) key from AWS Account B. The application’s role has permissions to access the secret in Account B.

The developer must add a statement to the KMS key’s key policy to allow the role in Account A to use the KMS key in Account B. The permissions must grant least privilege access to the role.

Which permissions will meet these requirements?

**A:** kms:Decrypt and kms:DescribeKey

**B:** secretsmanager:DescribeSecret and secretsmanager:GetSecretValue

**C:** kms:*

**D:** secretsmanager:*



**Answer: A**

**Timestamp: 2025-03-03 08:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157446-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 555 discussion

A developer created several AWS Lambda functions that write data to a single Amazon S3 bucket. The developer configured all the Lambda functions to send logs and metrics to Amazon CloudWatch.

The developer receives reports that one of the Lambda functions writes data to the bucket very slowly. The developer needs to measure the latency between the problematic Lambda function and the S3 bucket.

Which solution will meet this requirement?

**A:** Enable AWS X-Ray on the Lambda function. In the generated trace map, select the line between Lambda and Amazon S3.

**B:** Query the Lambda function’s log file in Amazon CloudWatch Logs Insights. Return the average of the auto-discovered @duration field.

**C:** Enable CloudWatch Lambda Insights on the function. View the latency graph that CloudWatch Lambda Insights provides.

**D:** Enable AWS X-Ray on the Lambda function. Select Amazon S3 in the latency graph to view the latency histogram.



**Answer: A**

**Timestamp: 2025-01-15 08:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/154534-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 557 discussion

A developer is designing a game that stores data in an Amazon DynamoDB table. The partition key of the table is the country of the player. After a sudden increase in the number of players in a specific country, the developer notices ProvisionedThroughputExceededException errors.

What should the developer do to resolve these errors?

**A:** Use strongly consistent table reads.

**B:** Revise the primary key to use more unique identifiers.

**C:** Use pagination to reduce the size of the items that the queries return.

**D:** Use the Scan operation to retrieve the data.



**Answer: B**

**Timestamp: 2025-02-06 08:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156016-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 56 discussion

A company is using an AWS Lambda function to process records from an Amazon Kinesis data stream. The company recently observed slow processing of the records. A developer notices that the iterator age metric for the function is increasing and that the Lambda run duration is constantly above normal.
Which actions should the developer take to increase the processing speed? (Choose two.)

**A:** Increase the number of shards of the Kinesis data stream.

**B:** Decrease the timeout of the Lambda function.

**C:** Increase the memory that is allocated to the Lambda function.

**D:** Decrease the number of shards of the Kinesis data stream.

**E:** Increase the timeout of the Lambda function.



**Answer: AC**

**Timestamp: 2023-03-26 07:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103932-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 57 discussion

A company needs to harden its container images before the images are in a running state. The company's application uses Amazon Elastic Container Registry (Amazon ECR) as an image registry. Amazon Elastic Kubernetes Service (Amazon EKS) for compute, and an AWS CodePipeline pipeline that orchestrates a continuous integration and continuous delivery (CI/CD) workflow.
Dynamic application security testing occurs in the final stage of the pipeline after a new image is deployed to a development namespace in the EKS cluster. A developer needs to place an analysis stage before this deployment to analyze the container image earlier in the CI/CD pipeline.
Which solution will meet these requirements with the MOST operational efficiency?

**A:** Build the container image and run the docker scan command locally. Mitigate any findings before pushing changes to the source code repository. Write a pre-commit hook that enforces the use of this workflow before commit.

**B:** Create a new CodePipeline stage that occurs after the container image is built. Configure ECR basic image scanning to scan on image push. Use an AWS Lambda function as the action provider. Configure the Lambda function to check the scan results and to fail the pipeline if there are findings.

**C:** Create a new CodePipeline stage that occurs after source code has been retrieved from its repository. Run a security scanner on the latest revision of the source code. Fail the pipeline if there are findings.

**D:** Add an action to the deployment stage of the pipeline so that the action occurs before the deployment to the EKS cluster. Configure ECR basic image scanning to scan on image push. Use an AWS Lambda function as the action provider. Configure the Lambda function to check the scan results and to fail the pipeline if there are findings.



**Answer: B**

**Timestamp: 2023-03-27 00:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/104013-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 400 discussion

A company has an application that uses an Amazon S3 bucket for object storage. A developer needs to configure in-transit encryption for the S3 bucket. All the S3 objects containing personal data needs to be encrypted at rest with AWS Key Management Service (AWS KMS) keys, which can be rotated on demand.

Which combination of steps will meet these requirements? (Choose two.)

**A:** Write an S3 bucket policy to allow only encrypted connections over HTTPS by using permissions boundary.

**B:** Configure an S3 bucket policy to enable client-side encryption for the objects containing personal data by using an AWS KMS customer managed key.

**C:** Configure the application to encrypt the objects by using an AWS KMS customer managed key before uploading the objects containing personal data to Amazon S3.

**D:** Write an S3 bucket policy to allow only encrypted connections over HTTPS by using the aws:SecureTransport condition.

**E:** Configure S3 Block Public Access settings for the S3 bucket to allow only encrypted connections over HTTPS.



**Answer: CD**

**Timestamp: 2024-07-12 15:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143803-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 401 discussion

A company has a monolithic desktop-based application that processes images. A developer is converting the application into an AWS Lambda function by using Python. Currently, the desktop application runs every 5 minutes to process the latest image from an Amazon S3 bucket. The desktop application completes the image processing task within 1 minute.

During testing on AWS, the developer notices that the Lambda function runs at the specified 5-minute interval. However, the Lambda function takes more than 2 minutes to complete the image processing task. The developer needs a solution that will improve the Lambda function's performance.

Which solution will meet this requirement?

**A:** Update the instance type of the Lambda function to a compute optimized instance with at least eight virtual CPU (vCPU).

**B:** Update the configuration of the Lambda function to use the latest Python runtime.

**C:** Increase the memory that is allocated to the Lambda function.

**D:** Configure a reserved concurrency on the Lambda function.



**Answer: C**

**Timestamp: 2024-06-28 21:19:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143029-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 402 discussion

A company uses AWS CloudFormation templates to manage infrastructure for a public-facing application in its development, pre-production, and production environments. The company needs to scale for increasing customer demand. A developer must upgrade the Amazon RDS DB instance type to a larger instance.

The developer deploys an update to the CloudFormation stack with the instance size change in the pre-production environment. The developer notices that the stack is in an UPDATE_ROLLBACK_FAILED slate in CloudFormation.

Which option is the cause of this issue?

**A:** The new instance type specified in the CloudFormation template is invalid

**B:** The database was deleted or modified manually outside of the CloudFormation stack

**C:** There is a syntax error in the CloudFormation template

**D:** The developer has insufficient IAM permissions to provision an instance of the specified type



**Answer: B**

**Timestamp: 2024-06-28 21:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143030-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 403 discussion

A developer needs to store files in an Amazon S3 bucket for a company's application. Each S3 object can have multiple versions. The objects must be permanently removed 1 year after object creation.

The developer creates an S3 bucket that has versioning enabled.

What should the developer do next to meet the data retention requirements?

**A:** Create an S3 Lifecycle rule on the S3 bucket. Configure the rule to expire current versions of objects and permanently delete noncurrent versions 1 year after object creation.

**B:** Create an event notification for all object creation events in the S3 bucket. Configure the event notification to invoke an AWS Lambda function. Program the Lambda function to check the object creation date and to delete the object if the object is older than 1 year.

**C:** Create an event notification for all object removal events in the S3 bucket. Configure the event notification to invoke an AWS Lambda function. Program the Lambda function to check the object creation date and to delete the object if the object is older than 1 year.

**D:** Create an S3 Lifecycle rule on the S3 bucket. Configure the rule to delete expired object delete markers and permanently delete noncurrent versions 1 year after object creation.



**Answer: A**

**Timestamp: 2024-07-23 20:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144455-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 404 discussion

A company uses AWS X-Ray to monitor a serverless application. The components of the application have different request rates. The user interactions and transactions are important to trace, but they are low in volume. The background processes such as application health checks, polling, and connection maintenance generate high volumes of read-only requests.

Currently, the default X-Ray sampling rules are universal for all requests. Only the first request per second and some additional requests are recorded. This setup is not helping the company review the requests based on service or request type.

A developer must configure rules to trace requests based on service or request properties. The developer must trace the user interactions and transactions without wasting effort recording minor background tasks.

Which solution will meet these requirements?

**A:** Disable sampling for high-volume read-only requests. Sample at a lower rate for all requests that handle user interactions or transactions.

**B:** Disable sampling and trace all requests for requests that handle user interactions or transactions. Sample high-volume read-only requests at a higher rate.

**C:** Disable sampling and trace all requests for requests that handle user interactions or transactions. Sample high-volume read-only requests at a lower rate.

**D:** Disable sampling for high-volume read-only requests. Sample at a higher rate for all requests that handle user interactions or transactions.



**Answer: C**

**Timestamp: 2024-07-20 18:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144274-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 85 discussion

A company has a web application that is deployed on AWS. The application uses an Amazon API Gateway API and an AWS Lambda function as its backend.

The application recently demonstrated unexpected behavior. A developer examines the Lambda function code, finds an error, and modifies the code to resolve the problem. Before deploying the change to production, the developer needs to run tests to validate that the application operates properly.

The application has only a production environment available. The developer must create a new development environment to test the code changes. The developer must also prevent other developers from overwriting these changes during the test cycle.

Which combination of steps will meet these requirements with the LEAST development effort? (Choose two.)

**A:** Create a new resource in the current stage. Create a new method with Lambda proxy integration. Select the Lambda function. Add the hotfix alias. Redeploy the current stage. Test the backend.

**B:** Update the Lambda function in the API Gateway API integration request to use the hotfix alias. Deploy the API Gateway API to a new stage named hotfix. Test the backend.

**C:** Modify the Lambda function by fixing the code. Test the Lambda function. Create the alias hotfix. Point the alias to the $LATEST version.

**D:** Modify the Lambda function by fixing the code. Test the Lambda function. When the Lambda function is working as expected, publish the Lambda function as a new version. Create the alias hotfix. Point the alias to the new version.

**E:** Create a new API Gateway API for the development environment. Add a resource and method with Lambda integration. Choose the Lambda function and the hotfix alias. Deploy to a new stage. Test the backend.



**Answer: BD**

**Timestamp: 2023-05-08 13:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108738-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 86 discussion

A developer is implementing an AWS Cloud Development Kit (AWS CDK) serverless application. The developer will provision several AWS Lambda functions and Amazon API Gateway APIs during AWS CloudFormation stack creation. The developer's workstation has the AWS Serverless Application Model (AWS SAM) and the AWS CDK installed locally.

How can the developer test a specific Lambda function locally?

**A:** Run the sam package and sam deploy commands. Create a Lambda test event from the AWS Management Console. Test the Lambda function.

**B:** Run the cdk synth and cdk deploy commands. Create a Lambda test event from the AWS Management Console. Test the Lambda function.

**C:** Run the cdk synth and sam local invoke commands with the function construct identifier and the path to the synthesized CloudFormation template.

**D:** Run the cdk synth and sam local start-lambda commands with the function construct identifier and the path to the synthesized CloudFormation template.



**Answer: C**

**Timestamp: 2023-04-21 17:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106939-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 87 discussion

A company's new mobile app uses Amazon API Gateway. As the development team completes a new release of its APIs, a developer must safely and transparently roll out the API change.

What is the SIMPLEST solution for the developer to use for rolling out the new API version to a limited number of users through API Gateway?

**A:** Create a new API in API Gateway. Direct a portion of the traffic to the new API using an Amazon Route 53 weighted routing policy.

**B:** Validate the new API version and promote it to production during the window of lowest expected utilization.

**C:** Implement an Amazon CloudWatch alarm to trigger a rollback if the observed HTTP 500 status code rate exceeds a predetermined threshold.

**D:** Use the canary release deployment option in API Gateway. Direct a percentage of the API traffic using the canarySettings setting.



**Answer: D**

**Timestamp: 2023-05-08 13:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108739-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 88 discussion

A company caches session information for a web application in an Amazon DynamoDB table. The company wants an automated way to delete old items from the table.

What is the simplest way to do this?

**A:** Write a script that deletes old records; schedule the script as a cron job on an Amazon EC2 instance.

**B:** Add an attribute with the expiration time; enable the Time To Live feature based on that attribute.

**C:** Each day, create a new table to hold session data; delete the previous day's table.

**D:** Add an attribute with the expiration time; name the attribute ItemExpiration.



**Answer: B**

**Timestamp: 2023-05-08 13:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108740-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 89 discussion

A company is using an Amazon API Gateway REST API endpoint as a webhook to publish events from an on-premises source control management (SCM) system to Amazon EventBridge. The company has configured an EventBridge rule to listen for the events and to control application deployment in a central AWS account. The company needs to receive the same events across multiple receiver AWS accounts.

How can a developer meet these requirements without changing the configuration of the SCM system?

**A:** Deploy the API Gateway REST API to all the required AWS accounts. Use the same custom domain name for all the gateway endpoints so that a single SCM webhook can be used for all events from all accounts.

**B:** Deploy the API Gateway REST API to all the receiver AWS accounts. Create as many SCM webhooks as the number of AWS accounts.

**C:** Grant permission to the central AWS account for EventBridge to access the receiver AWS accounts. Add an EventBridge event bus on the receiver AWS accounts as the targets to the existing EventBridge rule.

**D:** Convert the API Gateway type from REST API to HTTP API.



**Answer: C**

**Timestamp: 2023-06-06 16:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/111295-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 80 discussion

A company is planning to use AWS CodeDeploy to deploy an application to Amazon Elastic Container Service (Amazon ECS). During the deployment of a new version of the application, the company initially must expose only 10% of live traffic to the new version of the deployed application. Then, after 15 minutes elapse, the company must route all the remaining live traffic to the new version of the deployed application.

Which CodeDeploy predefined configuration will meet these requirements?

**A:** CodeDeployDefault.ECSCanary10Percent15Minutes

**B:** CodeDeployDefault.LambdaCanary10Percent5Minutes

**C:** CodeDeployDefault.LambdaCanary10Percentl15Minutes

**D:** CodeDeployDefault.ECSLinear10PercentEvery1Minutes



**Answer: A**

**Timestamp: 2023-05-08 12:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108735-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 81 discussion

A company hosts a batch processing application on AWS Elastic Beanstalk with instances that run the most recent version of Amazon Linux. The application sorts and processes large datasets.

In recent weeks, the application's performance has decreased significantly during a peak period for traffic. A developer suspects that the application issues are related to the memory usage. The developer checks the Elastic Beanstalk console and notices that memory usage is not being tracked.

How should the developer gather more information about the application performance issues?

**A:** Configure the Amazon CloudWatch agent to push logs to Amazon CloudWatch Logs by using port 443.

**B:** Configure the Elastic Beanstalk .ebextensions directory to track the memory usage of the instances.

**C:** Configure the Amazon CloudWatch agent to track the memory usage of the instances.

**D:** Configure an Amazon CloudWatch dashboard to track the memory usage of the instances.



**Answer: C**

**Timestamp: 2023-04-21 14:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106899-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 82 discussion

A developer is building a highly secure healthcare application using serverless components. This application requires writing temporary data to /tmp storage on an AWS Lambda function.

How should the developer encrypt this data?

**A:** Enable Amazon EBS volume encryption with an AWS KMS key in the Lambda function configuration so that all storage attached to the Lambda function is encrypted.

**B:** Set up the Lambda function with a role and key policy to access an AWS KMS key. Use the key to generate a data key used to encrypt all data prior to writing to /tmp storage.

**C:** Use OpenSSL to generate a symmetric encryption key on Lambda startup. Use this key to encrypt the data prior to writing to /tmp.

**D:** Use an on-premises hardware security module (HSM) to generate keys, where the Lambda function requests a data key from the HSM and uses that to encrypt data on all requests to the function.



**Answer: B**

**Timestamp: 2023-04-25 16:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107445-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 83 discussion

A developer has created an AWS Lambda function to provide notification through Amazon Simple Notification Service (Amazon SNS) whenever a file is uploaded to Amazon S3 that is larger than 50 MB. The developer has deployed and tested the Lambda function by using the CLI. However, when the event notification is added to the S3 bucket and a 3,000 MB file is uploaded, the Lambda function does not launch.

Which of the following is a possible reason for the Lambda function's inability to launch?

**A:** The S3 event notification does not activate for files that are larger than 1,000 MB.

**B:** The resource-based policy for the Lambda function does not have the required permissions to be invoked by Amazon S3.

**C:** Lambda functions cannot be invoked directly from an S3 event.

**D:** The S3 bucket needs to be made public.



**Answer: B**

**Timestamp: 2023-05-11 23:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109005-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 84 discussion

A developer is creating a Ruby application and needs to automate the deployment, scaling, and management of an environment without requiring knowledge of the underlying infrastructure.

Which service would best accomplish this task?

**A:** AWS CodeDeploy

**B:** AWS CloudFormation

**C:** AWS OpsWorks

**D:** AWS Elastic Beanstalk



**Answer: D**

**Timestamp: 2023-05-08 13:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108737-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 414 discussion

A developer has AWS Lambda functions that need to access a company's internal data science libraries and reference data. Separate teams manage the libraries and the data. The teams must be able to update and upload new data independently. The Lambda functions are connected to the company's central VPC.

Which solution will provide the Lambda functions with access to the libraries and data?

**A:** Attach an Amazon Elastic Block Store (Amazon EBS) volume to the Lambda functions by using EBS Multi-Attach in the central VPC. Update the Lambda function execution roles to give the functions to access the EBS volume. Update the Lambda function code to reference the files in the EBS volume.

**B:** Compress the libraries and reference data in a Lambda /tmp folder. Update the Lambda function code to reference the files in the /tmp folder.

**C:** Set up an Amazon Elastic File System (Amazon EFS) file system with mount targets in the central VPConfigure the Lambda functions to mount the EFS file system. Update the Lambda function execution roles to give the functions to access the EFS file system.

**D:** Set up an Amazon FSx for Windows File Server file system with mount targets in the central VPC. Configure the Lambda functions to mount the Amazon FSx file system. Update the Lambda function execution roles to give the functions to access the Amazon FSx file system.



**Answer: C**

**Timestamp: 2024-07-28 08:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144610-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 415 discussion

A company has an application that uses an AWS Lambda function to consume messages from an Amazon Simple Queue Service (Amazon SQS) queue. The SQS queue is configured with a dead-letter queue. Due to a defect in the application, AWS Lambda failed to process some messages. A developer fixed the bug and wants to process the failed messages again.

How should the developer resolve this issue?

**A:** Use the SendMessageBatch API to send messages from the dead-letter queue to the original SQS queue.

**B:** Use the ChangeMessageVisibility API to configure messages in the dead-letter queue to be visible in the original SQS queue.

**C:** Use the StartMessageMoveTask API to move messages from the dead-letter queue to the original SQS queue.

**D:** Use the PurgeQueue API to remove messages from the dead-letter queue and return the messages to the original SQS queue.



**Answer: C**

**Timestamp: 2024-10-03 10:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148595-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 416 discussion

A developer is working on an application that will be deployed on AWS. The developer needs to test and debug the code locally. The code is packaged and stored in an Amazon S3 bucket.

How can the developer test and debug the code locally with the LEAST amount of configuration?

**A:** Create an application and a deployment group in AWS CodeDeploy. For the compute platform, specify the local machine as the individual instance for the deployment. For the repository type, specify that the application is stored in Amazon S3. Start the deployment to test on the local machine.

**B:** Create a repository in AWS CodeArtifact. Publish the application code package to the repository. Before deployment, create an upstream repository to test and validate the code.

**C:** Create a build project in AWS CodeBuild. In AWS CodePipeline, add a CodeBuild test action by adding a stage and an action. For the action provider, specify a CodeBuild test and the build project. View the build log to see the test results.

**D:** Install the AWS CodeDeploy agent locally to validate the deployment package. Run the codedeploy-local command. Specify the S3 bucket where the code package is located by using the --bundle-location option.



**Answer: D**

**Timestamp: 2024-10-24 20:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150175-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 417 discussion

A developer is creating an application on Amazon Elastic Container Service (Amazon ECS). The developer needs to configure the application parameters. The developer must configure limits for the application's maximum number of simultaneous connections and maximum number of transactions per second.

The maximum number of connections and transactions can change in the future. The developer needs a solution that can automatically deploy these changes to the application, as needed, without causing downtime.

Which solution will meet these requirements?

**A:** Make the configuration changes for the application. Use AWS CodeDeploy to create a deployment configuration. Specify an in-place deployment to deploy the changes.

**B:** Bootstrap the application to use the AWS Cloud Development Kit (AWS CDK) and make the configuration changes. Specify the ECSCanary10Percent15Minutes launch type in the properties section of the ECS resource. Deploy the application by using the AWS CDK to implement the changes.

**C:** Install the AWS AppConfig agent on Amazon ECS. Configure an IAM role with access to AWS AppConfig. Make the deployment changes by using AWS AppConfig. Specify Canary10Percent20Minutes as the deployment strategy.

**D:** Create an AWS Lambda function to make the configuration changes. Create an Amazon CloudWatch alarm that monitors the Lambda function every 5 minutes to check if the Lambda function has been updated. When the Lambda function is updated, deploy the changes by using AWS CodeDeploy.



**Answer: C**

**Timestamp: 2024-09-01 09:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146743-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 418 discussion

A developer has built an application running on AWS Lambda using AWS Serverless Application Model (AWS SAM).

What is the correct sequence of steps to successfully deploy the application?

**A:** 1. Build the SAM template in Amazon EC2.
2. Package the SAM template to Amazon EBS storage.
3. Deploy the SAM template from Amazon EBS.

**B:** 1. Build the SAM template locally.
2. Package the SAM template onto Amazon S3.
3. Deploy the SAM template from Amazon S3.

**C:** 1. Build the SAM template locally.
2. Deploy the SAM template from Amazon S3.
3. Package the SAM template for use.

**D:** 1. Build the SAM template locally.
2. Package the SAM template from AWS CodeCommit.
3. Deploy the SAM template to CodeCommit.



**Answer: B**

**Timestamp: 2024-10-09 15:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148935-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 392 discussion

A developer received the following error message during an AWS CloudFormation deployment:

DELETE_FAILED (The following resource(s) failed to delete: [ASGInstanceRole12345678].)

Which action should the developer take to resolve this error?

**A:** Contact AWS Support to report an issue with the Auto Scaling Groups (ASG) service.

**B:** Add a DependsOn attribute to the ASGInstanceRole12345678 resource in the CloudFormation template. Then delete the stack.

**C:** Modify the CloudFormation template to retain the ASGInstanceRole12345678 resource. Then manually delete the resource after deployment.

**D:** Add a force parameter when calling CloudFormation with the role-arn of ASGInstanceRole12345678.



**Answer: C**

**Timestamp: 2024-06-29 22:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143082-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 393 discussion

A company runs a critical application on Amazon Elastic Container Service (Amazon ECS) by using Amazon EC2 instances. The company needs to migrate the application to Amazon ECS on AWS Fargate. A developer is configuring Fargate and the ECS capacity providers to make the change.

Which solution will meet these requirements with the LEAST downtime during migration?

**A:** Use the PutClusterCapacityProviders API operation to associate the ECS cluster with the FARGATE and FARGATE_SPOT capacity provider strategies. Use FARGATE as Provider 1 with a base value. Use FARGATE_SPOT as Provider 2 for failover.

**B:** Use the CreateCapacityProvider API operation to associate the ECS cluster with the FARGATE and FARGATE_SPOT capacity provider strategies. Use FARGATE as Provider 1 with a base value. Use FARGATE_SPOT as Provider 2 for failover.

**C:** Use the PutClusterCapacityProviders API operation to associate the ECS cluster with the FARGATE and FARGATE_SPOT capacity provider strategies. Use FARGATE_SPOT as Provider 1 with a base value. Use FARGATE as Provider 2 for failover.

**D:** Use the CreateCapacityProvider API operation to associate the ECS cluster with the FARGATE and FARGATE_SPOT capacity provider strategies. Use FARGATE_SPOT as Provider 1 with a base value. Use FARGATE as Provider 2 for failover.



**Answer: A**

**Timestamp: 2024-06-29 19:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143072-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 394 discussion

A company has a web application that is hosted on AWS. The application is behind an Amazon CloudFront distribution. A developer needs a dashboard to monitor error rates and anomalies of the CloudFront distribution as frequently as possible.

Which combination of steps should the developer take to meet these requirements? (Choose two.)

**A:** Stream the CloudFront distribution logs to an Amazon S3 bucket. Detect anomalies and error rates by using Amazon Athena.

**B:** Enable real-time logs on the CloudFront distribution. Create a data stream in Amazon Kinesis Data Streams.

**C:** Set up Amazon Kinesis Data Streams to send the logs to Amazon OpenSearch Service by using an AWS Lambda function. Make a dashboard in OpenSearch Dashboards.

**D:** Stream the CloudFront distribution logs to Amazon Kinesis Data Firehose.

**E:** Set up Amazon Kinesis Data Firehose to send the logs to AWS CloudTrail. Create CloudTrail metrics, alarms, and dashboards.



**Answer: BC**

**Timestamp: 2024-06-29 22:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143083-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 395 discussion

A developer creates an Amazon DynamoDB table. The table has OrderID as the partition key and NumberOfItemsPurchased as the sort key. The data type of the partition key and the sort key is Number.

When the developer queries the table, the results are sorted by NumberOfItemsPurchased in ascending order. The developer needs the query results to be sorted by NumberOfItemsPurchased in descending order.

Which solution will meet this requirement?

**A:** Create a local secondary index (LSI) on the NumberOfItemsPurchased sort key.

**B:** Change the sort key from NumberOfItemsPurchased to NumberOfItemsPurchasedDescending.

**C:** In the Query operation, set the ScanIndexForward parameter to false.

**D:** In the Query operation, set the KeyConditionExpression parameter to false.



**Answer: C**

**Timestamp: 2024-07-12 15:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143801-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 396 discussion

A developer needs to use a code template to create an automated deployment of an application onto Amazon EC2 instances. The template must be configured to repeat deployment, installation, and updates of resources for the application. The template must be able to create identical environments and roll back to previous versions.

Which solution will meet these requirements?

**A:** Use AWS Amplify for automatic deployment templates. Use a traffic-splitting deployment to copy any deployments. Modify any resources created by Amplify, if necessary.

**B:** Use AWS CodeBuild for automatic deployment. Upload the required AppSpec file template. Save the appspec.yml file in the root directory folder of the revision. Specify the deployment group that includes the EC2 instances for the deployment.

**C:** Use AWS CloudFormation to create an infrastructure template in JSON format to deploy the EC2 instances. Use CloudFormation helper scripts to install the necessary software and to start the application. Call the scripts directly from the template.

**D:** Use AWS AppSync to deploy the application. Upload the template as a GraphQL schema. Specify the EC2 instances for deployment of the application. Use resolvers as a version control mechanism and to make any updates to the deployments.



**Answer: C**

**Timestamp: 2024-07-28 07:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144607-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 536 discussion

A developer is creating a stock trading application. The developer needs a solution to send text messages to application users to confirmation when a trade has been completed.

The solution must deliver messages in the order a user makes stock trades. The solution must not send duplicate messages.

Which solution will meet these requirements?

**A:** Configure the application to publish messages to an Amazon Data Firehose delivery stream. Configure the delivery stream to have a destination of each user’s mobile phone number that is passed in the trade confirmation message.

**B:** Create an Amazon Simple Queue Service (Amazon SQS) FIFO queue. Use the SendMessageIn API call to send the trade confirmation messages to the queue. Use the SendMessageOut API to send the messages to users by using the information provided in the trade confirmation message.

**C:** Configure a pipe in Amazon EventBridge Pipes. Connect the application to the pipe as a source. Configure the pipe to use each user’s mobile phone number as a target. Configure the pipe to send incoming events to the users.

**D:** Create an Amazon Simple Notification Service (SNS) FIFO topic. Configure the application to use the AWS SDK to publish notifications to the SNS topic to send SMS messages to the users.



**Answer: D**

**Timestamp: 2025-02-17 11:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156696-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 537 discussion

A developer is deploying a new Node.js AWS Lambda function that is not connected to a VPC. The Lambda function needs to connect to and query an Amazon Aurora database that is not publicly accessible. The developer is expecting unpredictable surges in database traffic.

What should the developer do to give the Lambda function access to the database?

**A:** Configure the Lambda function to use an Amazon RDS proxy.

**B:** Configure a NAT gateway. Attach the NAT gateway to the Lambda function.

**C:** Enable public access on the Aurora database. Configure a security group on the database to allow outbound access for the database engine’s port.

**D:** Enable VPC access for the Lambda function. Attach the Lambda function to a new security group that does not have rules.



**Answer: A**

**Timestamp: 2025-02-17 11:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156697-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 538 discussion

A company generates SSL certificates from a third-party provider. The company imports the certificates into AWS Certificate Manager (ACM) to use with public web applications.

A developer must implement a solution to notify the company’s security team 90 days before an imported certificate expires. The company already has configured an Amazon Simple Queue Service (Amazon SQS) queue. The company also has configured an Amazon Simple Notification Service (Amazon SNS) topic that has the security team’s email address as a subscriber.

Which solution will provide the security team with the required notification about certificates?

**A:** Create an Amazon EventBridge rule that specifies the ACM Certificate Approaching Expiration event type. Set the SNS topic as the EventBridge rule’s target.

**B:** Create an AWS Lambda function to search for all certificates that are expiring within 90 days. Program the Lambda function to send each identified certificate’s Amazon Resource Name (ARN) in a message to the SQS queue.

**C:** Create an AWS Step Functions workflow that is invoked by each certificate’s expiration notification from AWS CloudTrail. Create an AWS Lambda function to send each certificate's Amazon Resource Name (ARN) in a message to the SQS queue.

**D:** Configure AWS Config with the acm-certificate-expiration-check managed rule to run every 24 hours. Create an Amazon EventBridge rule that includes an event pattern that specifies the Config Rules Compliance Change detail type and the configured rule. Set the SNS topic as the EventBridge rule’s target.



**Answer: D**

**Timestamp: 2025-02-06 13:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156029-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 539 discussion

A company uses two AWS accounts: production and development. The company stores data in an Amazon S3 bucket that is in the production account. The data is encrypted with an AWS Key Management Service (AWS KMS) customer managed key. The company plans to copy the data to another S3 bucket that is in the development account.

A developer needs to use a KMS key to encrypt the data in the S3 bucket that is in the development account. The KMS key in the development account must be accessible from the production account,

Which solution will meet these requirements?

**A:** Replicate the customer managed KMS key from the production account to the development account. Specify the production account in the key policy.

**B:** Create a new customer managed KMS key in the development account. Specify the production account in the key policy.

**C:** Create a new AWS managed KMS key for Amazon S3 in the development account. Specify the production account in the key policy.

**D:** Replicate the default AWS managed KMS key for Amazon S3 from the production account to the development account. Specify the production account in the key policy.



**Answer: C**

**Timestamp: 2025-03-04 09:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157497-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 54 discussion

A developer needs to migrate an online retail application to AWS to handle an anticipated increase in traffic. The application currently runs on two servers: one server for the web application and another server for the database. The web server renders webpages and manages session state in memory. The database server hosts a MySQL database that contains order details. When traffic to the application is heavy, the memory usage for the web server approaches 100% and the application slows down considerably.
The developer has found that most of the memory increase and performance decrease is related to the load of managing additional user sessions. For the web server migration, the developer will use Amazon EC2 instances with an Auto Scaling group behind an Application Load Balancer.
Which additional set of changes should the developer make to the application to improve the application's performance?

**A:** Use an EC2 instance to host the MySQL database. Store the session data and the application data in the MySQL database.

**B:** Use Amazon ElastiCache for Memcached to store and manage the session data. Use an Amazon RDS for MySQL DB instance to store the application data.

**C:** Use Amazon ElastiCache for Memcached to store and manage the session data and the application data.

**D:** Use the EC2 instance store to manage the session data. Use an Amazon RDS for MySQL DB instance to store the application data.



**Answer: B**

**Timestamp: 2023-03-24 09:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103757-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 19 discussion

A company is offering APIs as a service over the internet to provide unauthenticated read access to statistical information that is updated daily. The company uses Amazon API Gateway and AWS Lambda to develop the APIs. The service has become popular, and the company wants to enhance the responsiveness of the APIs.
Which action can help the company achieve this goal?

**A:** Enable API caching in API Gateway.

**B:** Configure API Gateway to use an interface VPC endpoint.

**C:** Enable cross-origin resource sharing (CORS) for the APIs.

**D:** Configure usage plans and API keys in API Gateway.



**Answer: A**

**Timestamp: 2023-03-21 12:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103467-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 190 discussion

A company needs to distribute firmware updates to its customers around the world.

Which service will allow easy and secure control of the access to the downloads at the lowest cost?

**A:** Use Amazon CloudFront with signed URLs for Amazon S3.

**B:** Create a dedicated Amazon CloudFront Distribution for each customer.

**C:** Use Amazon CloudFront with AWS Lambda@Edge.

**D:** Use Amazon API Gateway and AWS Lambda to control access to an S3 bucket.



**Answer: A**

**Timestamp: 2023-10-06 02:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122612-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 191 discussion

A developer is testing an application that invokes an AWS Lambda function asynchronously. During the testing phase, the Lambda function fails to process after two retries.

How can the developer troubleshoot the failure?

**A:** Configure AWS CloudTrail logging to investigate the invocation failures.

**B:** Configure Dead Letter Queues by sending events to Amazon SQS for investigation.

**C:** Configure Amazon Simple Workflow Service to process any direct unprocessed events.

**D:** Configure AWS Config to process any direct unprocessed events.



**Answer: B**

**Timestamp: 2023-10-06 02:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122613-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 192 discussion

A company is migrating its PostgreSQL database into the AWS Cloud. The company wants to use a database that will secure and regularly rotate database credentials. The company wants a solution that does not require additional programming overhead.

Which solution will meet these requirements?

**A:** Use Amazon Aurora PostgreSQL for the database. Store the database credentials in AWS Systems Manager Parameter Store. Turn on rotation.

**B:** Use Amazon Aurora PostgreSQL for the database. Store the database credentials in AWS Secrets Manager. Turn on rotation.

**C:** Use Amazon DynamoDB for the database. Store the database credentials in AWS Systems Manager Parameter Store. Turn on rotation.

**D:** Use Amazon DynamoDB for the database. Store the database credentials in AWS Secrets Manager. Turn on rotation.



**Answer: B**

**Timestamp: 2023-10-06 02:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122615-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 193 discussion

A developer is creating a mobile application that will not require users to log in.

What is the MOST efficient method to grant users access to AWS resources?

**A:** Use an identity provider to securely authenticate with the application.

**B:** Create an AWS Lambda function to create an IAM user when a user accesses the application.

**C:** Create credentials using AWS KMS and apply these credentials to users when using the application.

**D:** Use Amazon Cognito to associate unauthenticated users with an IAM role that has limited access to resources.



**Answer: D**

**Timestamp: 2023-10-06 02:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122614-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 284 discussion

A developer designed an application on an Amazon EC2 instance. The application makes API requests to objects in an Amazon S3 bucket.

Which combination of steps will ensure that the application makes the API requests in the MOST secure manner? (Choose two.)

**A:** Create an IAM user that has permissions to the S3 bucket. Add the user to an IAM group.

**B:** Create an IAM role that has permissions to the S3 bucket.

**C:** Add the IAM role to an instance profile. Attach the instance profile to the EC2 instance.

**D:** Create an IAM role that has permissions to the S3 bucket. Assign the role to an IAM group.

**E:** Store the credentials of the IAM user in the environment variables on the EC2 instance.



**Answer: BC**

**Timestamp: 2024-02-21 05:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134283-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 285 discussion

An AWS Lambda function requires read access to an Amazon S3 bucket and requires read/write access to an Amazon DynamoDB table. The correct IAM policy already exists.

What is the MOST secure way to grant the Lambda function access to the S3 bucket and the DynamoDB table?

**A:** Attach the existing IAM policy to the Lambda function.

**B:** Create an IAM role for the Lambda function. Attach the existing IAM policy to the role. Attach the role to the Lambda function.

**C:** Create an IAM user with programmatic access. Attach the existing IAM policy to the user. Add the user access key ID and secret access key as environment variables in the Lambda function.

**D:** Add the AWS account root user access key ID and secret access key as encrypted environment variables in the Lambda function.



**Answer: B**

**Timestamp: 2024-02-21 06:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134284-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 286 discussion

A developer is using AWS Step Functions to automate a workflow. The workflow defines each step as an AWS Lambda function task. The developer notices that runs of the Step Functions state machine fail in the GetResource task with either an IllegalArgumentException error or a TooManyRequestsException error.

The developer wants the state machine to stop running when the state machine encounters an IllegalArgumentException error. The state machine needs to retry the GetResource task one additional time after 10 seconds if the state machine encounters a TooManyRequestsException error. If the second attempt fails, the developer wants the state machine to stop running.

How can the developer implement the Lambda retry functionality without adding unnecessary complexity to the state machine?

**A:** Add a Delay task after the GetResource task. Add a catcher to the GetResource task. Configure the catcher with an error type of TooManyRequestsException. Configure the next step to be the Delay task. Configure the Delay task to wait for an interval of 10 seconds. Configure the next step to be the GetResource task.

**B:** Add a catcher to the GetResource task. Configure the catcher with an error type of TooManyRequestsException, an interval of 10 seconds, and a maximum attempts value of 1. Configure the next step to be the GetResource task.

**C:** Add a retrier to the GetResource task. Configure the retrier with an error type of TooManyRequestsException, an interval of 10 seconds, and a maximum attempts value of 1.

**D:** Duplicate the GetResource task. Rename the new GetResource task to TryAgain. Add a catcher to the original GetResource task. Configure the catcher with an error type of TooManyRequestsException. Configure the next step to be TryAgain.



**Answer: C**

**Timestamp: 2024-02-21 06:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134285-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 287 discussion

A developer is creating a serverless application that uses an AWS Lambda function. The developer will use AWS CloudFormation to deploy the application. The application will write logs to Amazon CloudWatch Logs. The developer has created a log group in a CloudFormation template for the application to use. The developer needs to modify the CloudFormation template to make the name of the log group available to the application at runtime.

Which solution will meet this requirement?

**A:** Use the AWS::Include transform in CloudFormation to provide the log group's name to the application.

**B:** Pass the log group's name to the application in the user data section of the CloudFormation template.

**C:** Use the CloudFormation template's Mappings section to specify the log group's name for the application.

**D:** Pass the log group's Amazon Resource Name (ARN) as an environment variable to the Lambda function.



**Answer: D**

**Timestamp: 2024-02-21 06:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134286-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 288 discussion

A developer is creating an Amazon DynamoDB table by using the AWS CLI. The DynamoDB table must use server-side encryption with an AWS owned encryption key.

How should the developer create the DynamoDB table to meet these requirements?

**A:** Create an AWS Key Management Service (AWS KMS) customer managed key. Provide the key's Amazon Resource Name (ARN) in the KMSMasterKeyId parameter during creation of the DynamoDB table.

**B:** Create an AWS Key Management Service (AWS KMS) AWS managed key. Provide the key's Amazon Resource Name (ARN) in the KMSMasterKeyId parameter during creation of the DynamoDB table.

**C:** Create an AWS owned key. Provide the key's Amazon Resource Name (ARN) in the KMSMasterKeyId parameter during creation of the DynamoDB table.

**D:** Create the DynamoDB table with the default encryption options.



**Answer: D**

**Timestamp: 2024-02-21 07:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134287-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 383 discussion

A company maintains a REST service using Amazon API Gateway and the API Gateway native API key validation. The company recently launched a new registration page, which allows users to sign up for the service. The registration page creates a new API key using CreateApiKey and sends the new key to the user. When the user attempts to call the API using this key, the user receives a 403 Forbidden error. Existing users are unaffected and can still call the API.

What code updates will grant these new users access to the API?

**A:** The createDeployment method must be called so the API can be redeployed to include the newly created API key.

**B:** The updateAuthorizer method must be called to update the API's authorizer to include the newly created API key.

**C:** The importApiKeys method must be called to import all newly created API keys into the current stage of the API.

**D:** The createUsagePlanKey method must be called to associate the newly created API key with the correct usage plan.



**Answer: D**

**Timestamp: 2024-07-12 06:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143762-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 384 discussion

A company uses an AWS CloudFormation template to deploy and manage its AWS infrastructure. The CloudFormation template creates Amazon VPC security groups and Amazon EC2 security groups.

A manager finds out that some engineers modified the security groups of a few EC2 instances for testing purposes. A developer needs to determine what modifications occurred.

Which solution will meet this requirement?

**A:** Add a Conditions section statement in the source YAML file of the template. Run the CloudFormation stack.

**B:** Perform a drift detection operation on the CloudFormation stack.

**C:** Execute a change set for the CloudFormation stack.

**D:** Use Amazon Detective to detect the modifications.



**Answer: B**

**Timestamp: 2024-07-28 03:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/144606-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 385 discussion

An IAM role is attached to an Amazon EC2 instance that explicitly denies access to all Amazon S3 API actions. The EC2 instance credentials file specifies the IAM access key and secret access key, which allow full administrative access.

Given that multiple modes of IAM access are present for this EC2 instance, which of the following is correct?

**A:** The EC2 instance will only be able to list the S3 buckets.

**B:** The EC2 instance will only be able to list the contents of one S3 bucket at a time.

**C:** The EC2 instance will be able to perform all actions on any S3 bucket.

**D:** The EC2 instance will not be able to perform any S3 action on any S3 bucket.



**Answer: D**

**Timestamp: 2024-07-05 13:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143353-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 386 discussion

A company uses an AWS Lambda function to transfer files from an Amazon S3 bucket to the company's SFTP server. The Lambda function connects to the SFTP server by using credentials such as username and password. The company uses Lambda environment variables to store these credentials.

A developer needs to implement encrypted username and password credentials.

Which solution will meet these requirements?

**A:** Remove the user credentials from the Lambda environment. Implement IAM database authentication.

**B:** Move the user credentials from Lambda environment variables to AWS Systems Manager Parameter Store.

**C:** Move the user credentials from Lambda environment variables to AWS Key Management Service (AWS KMS).

**D:** Move the user credentials from the Lambda environment to an encrypted .txt file. Store the file in an S3 bucket.



**Answer: B**

**Timestamp: 2024-07-12 06:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143763-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 387 discussion

A developer is creating a new batch application that will run on an Amazon EC2 instance. The application requires read access to an Amazon S3 bucket. The developer needs to follow security best practices to grant S3 read access to the application.

Which solution meets these requirements?

**A:** Add the permissions to an IAM policy. Attach the policy to a role. Attach the role to the EC2 instance profile.

**B:** Add the permissions inline to an IAM group. Attach the group to the EC2 instance profile.

**C:** Add the permissions to an IAM policy. Attach the policy to a user. Attach the user to the EC2 instance profile.

**D:** Add the permissions to an IAM policy. Use IAM web identity federation to access the S3 bucket with the policy.



**Answer: A**

**Timestamp: 2024-07-12 06:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143764-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 162 discussion

A developer has observed an increase in bugs in the AWS Lambda functions that a development team has deployed in its Node.js application. To minimize these bugs, the developer wants to implement automated testing of Lambda functions in an environment that closely simulates the Lambda environment.

The developer needs to give other developers the ability to run the tests locally. The developer also needs to integrate the tests into the team’s continuous integration and continuous delivery (CI/CD) pipeline before the AWS Cloud Development Kit (AWS CDK) deployment.

Which solution will meet these requirements?

**A:** Create sample events based on the Lambda documentation. Create automated test scripts that use the cdk local invoke command to invoke the Lambda functions. Check the response. Document the test scripts for the other developers on the team. Update the CI/CD pipeline to run the test scripts.

**B:** Install a unit testing framework that reproduces the Lambda execution environment. Create sample events based on the Lambda documentation. Invoke the handler function by using a unit testing framework. Check the response. Document how to run the unit testing framework for the other developers on the team. Update the CI/CD pipeline to run the unit testing framework.

**C:** Install the AWS Serverless Application Model (AWS SAM) CLI tool. Use the sam local generate-event command to generate sample events for the automated tests. Create automated test scripts that use the sam local invoke command to invoke the Lambda functions. Check the response. Document the test scripts for the other developers on the team. Update the CI/CD pipeline to run the test scripts.

**D:** Create sample events based on the Lambda documentation. Create a Docker container from the Node.js base image to invoke the Lambda functions. Check the response. Document how to run the Docker container for the other developers on the team. Update the CI/CD pipeline to run the Docker container.



**Answer: C**

**Timestamp: 2023-10-06 02:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122582-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 163 discussion

A developer is troubleshooting an application that uses Amazon DynamoDB in the us-west-2 Region. The application is deployed to an Amazon EC2 instance. The application requires read-only permissions to a table that is named Cars. The EC2 instance has an attached IAM role that contains the following IAM policy:

//IMG//


When the application tries to read from the Cars table, an Access Denied error occurs.

How can the developer resolve this error?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image12.png

**A:** Modify the IAM policy resource to be “arn:aws:dynamodb:us-west-2:account-id:table/*”.

**B:** Modify the IAM policy to include the dynamodb:* action.

**C:** Create a trust policy that specifies the EC2 service principal. Associate the role with the policy.

**D:** Create a trust relationship between the role and dynamodb.amazonaws.com.



**Answer: C**

**Timestamp: 2023-10-06 02:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122581-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 164 discussion

When using the AWS Encryption SDK, how does the developer keep track of the data encryption keys used to encrypt data?

**A:** The developer must manually keep track of the data encryption keys used for each data object.

**B:** The SDK encrypts the data encryption key and stores it (encrypted) as part of the returned ciphertext.

**C:** The SDK stores the data encryption keys automatically in Amazon S3.

**D:** The data encryption key is stored in the Userdata for the EC2 instance.



**Answer: B**

**Timestamp: 2023-10-06 02:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122586-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 165 discussion

An application that runs on AWS Lambda requires access to specific highly confidential objects in an Amazon S3 bucket. In accordance with the principle of least privilege, a company grants access to the S3 bucket by using only temporary credentials.

How can a developer configure access to the S3 bucket in the MOST secure way?

**A:** Hardcode the credentials that are required to access the S3 objects in the application code. Use the credentials to access the required S3 objects.

**B:** Create a secret access key and access key ID with permission to access the S3 bucket. Store the key and key ID in AWS Secrets Manager. Configure the application to retrieve the Secrets Manager secret and use the credentials to access the S3 objects.

**C:** Create a Lambda function execution role. Attach a policy to the role that grants access to specific objects in the S3 bucket.

**D:** Create a secret access key and access key ID with permission to access the S3 bucket. Store the key and key ID as environment variables in Lambda. Use the environment variables to access the required S3 objects.



**Answer: C**

**Timestamp: 2023-10-06 02:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122585-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 166 discussion

A developer has code that is stored in an Amazon S3 bucket. The code must be deployed as an AWS Lambda function across multiple accounts in the same AWS Region as the S3 bucket. An AWS CloudFormation template that runs for each account will deploy the Lambda function.

What is the MOST secure way to allow CloudFormation to access the Lambda code in the S3 bucket?

**A:** Grant the CloudFormation service role the S3 ListBucket and GetObject permissions. Add a bucket policy to Amazon S3 with the principal of “AWS”: [account numbers].

**B:** Grant the CloudFormation service role the S3 GetObject permission. Add a bucket policy to Amazon S3 with the principal of “*”.

**C:** Use a service-based link to grant the Lambda function the S3 ListBucket and GetObject permissions by explicitly adding the S3 bucket’s account number in the resource.

**D:** Use a service-based link to grant the Lambda function the S3 GetObject permission. Add a resource of “*” to allow access to the S3 bucket.



**Answer: A**

**Timestamp: 2023-10-06 02:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122584-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 442 discussion

A developer is working on an ecommerce application that stores data in an Amazon RDS for MySQL cluster. The developer needs to implement a caching layer for the application to retrieve information about the most viewed products.

Which solution will meet these requirements?

**A:** Edit the RDS for MySQL cluster by adding a cache node. Configure the cache endpoint instead of the cluster endpoint in the application.

**B:** Create an Amazon ElastiCache for Redis cluster. Update the application code to use the ElastiCache for Redis cluster endpoint.

**C:** Create an Amazon DynamoDB Accelerator (DAX) cluster in front of the RDS for MySQL cluster. Configure the application to connect to the DAX endpoint instead of the RDS endpoint.

**D:** Configure the RDS for MySQL cluster to add a standby instance in a different Availability Zone. Configure the application to read the data from the standby instance.



**Answer: B**

**Timestamp: 2025-01-02 17:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153821-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 443 discussion

A gaming application stores scores for players in an Amazon DynamoDB table that has four attributes: user_id, user_name, user_score, and user_rank. The users are allowed to update their names only. A user is authenticated by web identity federation.

Which set of conditions should be added in the policy attached to the role for the dynamodb:PutItem API call?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: A**

**Timestamp: 2024-10-10 08:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148960-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 444 discussion

A developer is creating a database of products. Queries for frequently accessed products must have retrieval times of microseconds. To ensure data consistency, the application cache must be updated whenever products are added, changed, or deleted.

Which solution will meet these requirements?

**A:** Set up an Amazon DynamoDB database and a DynamoDB Accelerator (DAX) cluster.

**B:** Set up an Amazon RDS database and an Amazon ElastiCache for Redis cluster. Implement a lazy loading caching strategy with ElastiCache.

**C:** Setup an Amazon DynamoDB database that has an in-memory cache. Implement a lazy loading caching strategy in the application.

**D:** Set up an Amazon RDS database and an Amazon DynamoDB Accelerator (DAX) cluster. Specify a TTL setting for the DAX cluster.



**Answer: A**

**Timestamp: 2024-10-20 07:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/149825-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 445 discussion

A developer is creating a script to automate the deployment process for a serverless application. The developer wants to use an existing AWS Serverless Application Model (AWS SAM) template for the application.

What should the developer use for the project? (Choose two.)

**A:** Call aws cloudformation package to create the deployment package. Call aws cloudformation deploy to deploy the package afterward.

**B:** Call sam package to create the deployment package. Call sam deploy to deploy the package afterward.

**C:** Call aws s3 cp to upload the AWS SAM template to Amazon S3. Call aws lambda update-function-code to create the application.

**D:** Create a ZIP package locally and call aws serverlessrepo create-applicatiion to create the application.

**E:** Create a ZIP package and upload it to Amazon S3. Call aws cloudformation create-stack to create the application.



**Answer: AB**

**Timestamp: 2024-10-02 05:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/148536-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 447 discussion

A developer is working on a project that requires regular updates to a web application’s backend code. The code is stored in AWS CodeCommit. Company policy states that all code must have complete unit testing and that the test results must be available for access.

The developer needs to implement a solution that will take each change to the code repository, build the code, and run unit tests. The solution also must provide a detailed report of the test results.

Which solution will meet these requirements?

**A:** Configure AWS CodeDeploy to deploy code from CodeCommit and to run unit tests. Send the test results to Amazon CloudWatch metrics to view reports.

**B:** Configure Amazon CodeWhisperer to create the code and to run unit tests. Save the test results in an Amazon S3 bucket to generate reports.

**C:** Configure AWS CodeBuild to build the code and to run unit tests. Use test reporting in CodeBuild to generate and view reports.

**D:** Create AWS Lambda functions that run when changes are made in CodeCommit. Program the Lambda functions to build the code, run unit tests, and save the test results to a Lambda layer.



**Answer: C**

**Timestamp: 2025-02-20 06:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156844-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 521 discussion

A company is hosting an Amazon AP! Gateway REST API that calls a single AWS Lambda function. The function is infrequently invoked by multiple clients at the same time.

The code performance is optimal, but the company wants to optimize the startup time of the function

What can a developer do to optimize the initialization of the function?

**A:** Enable API Gateway caching for the REST API.

**B:** Configure provisioned concurrency for the Lambda function.

**C:** Use Lambda proxy integration for the REST API.

**D:** Configure AWS Global Accelerator for the Lambda function.



**Answer: B**

**Timestamp: 2024-12-27 16:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153503-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 522 discussion

A developer is building a three-tier application with an Application Load Balancer (ALB), Amazon EC2 instances, and Amazon RDS. There is an alias record in Amazon Route 53 that points to the ALB. When the developer tries to access the ALB from a laptop, the request times out.

Which logs should the developer investigate to verify that the request is reaching the AWS network?

**A:** VPC Flow Logs

**B:** Amazon Route 53 logs

**C:** AWS Systems Manager Agent logs

**D:** Amazon CloudWatch agent logs



**Answer: A**

**Timestamp: 2025-02-06 09:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156020-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 523 discussion

A developer has an application that uses AWS Security Token Service (AWS STS). The application calls the STS AssumeRole API operation to provide trusted users with temporary security credentials. The application calls AWS STS at the service's default endpoint: https://sts.amazonaws.com.

The application is deployed in an Asia Pacific AWS Region. The application is experiencing errors that are related to intermittent latency when the application calls AWS STS.

What should the developer do to resolve this issue?

**A:** Update the application to use the GetSessionToken API operation.

**B:** Update the application to use the AssumeRoleWithSAML API operation.

**C:** Update the application to use a Regional STS endpoint that is closer to the application deployment.

**D:** Update the application to use the AssumeRoleWithWebldentity API operation. Move the STS endpoint to a global endpoint.



**Answer: C**

**Timestamp: 2025-02-06 09:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156021-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 524 discussion

A company is launching a photo sharing application on AWS. Users use the application to upload images to an Amazon S3 bucket. When users upload images, an AWS Lambda function creates thumbnail versions of the images and stores the thumbnail versions in another S3 bucket.

During development, a developer notices that the Lambda function takes more than 2 minutes to complete the thumbnail process. The company needs alll images to be processed in less than 30 seconds.

What should the developer do to meet these requirements?

**A:** Increase the virtual CPUs (vCPUs) for the Lambda function to use 10 vCPUs.

**B:** Change Lambda function instance type to use m6a.4xlarge.

**C:** Configure the Lambda function to increase the amount of memory.

**D:** Configure burstable performance for the Lambda function.



**Answer: C**

**Timestamp: 2025-02-17 10:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156677-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 525 discussion

A development team is designing a mobile app that requires multi-factor authentication.

Which steps should be taken to achieve this? (Choose two.)

**A:** Use Amazon Cognito to create a user pool and create users in the user pool.

**B:** Send multi-factor authentication text codes to users with the Amazon SNS Publish API call in the app code.

**C:** Enable multi-factor authentication for the Amazon Cognito user pool.

**D:** Use AWS IAM to create IAM users.

**E:** Enable multifactor authentication for the users created in AWS IAM.



**Answer: AC**

**Timestamp: 2025-03-03 11:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157451-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 324 discussion

A developer is building a containerized application on AWS. The application communicates with a third-party service by using API keys. The developer needs a secure way to store the API keys and pass the API keys to the containerized application.

Which solutions will meet these requirements? (Choose two.)

**A:** Store the API keys as a SecureString parameter in AWS Systems Manager Parameter Store. Grant the application access to retrieve the value from Parameter Store.

**B:** Store the API keys in AWS CloudFormation templates by using base64 encoding. Pass the API keys to the application through container definition environment variables.

**C:** Add a new AWS CloudFormation parameter to the CloudFormation template. Pass the API keys to the application by using the container definition environment variables.

**D:** Embed the API keys in the application. Build the container image on-premises. Upload the container image to Amazon Elastic Container Registry (Amazon ECR).

**E:** Store the API keys as a SecretString parameter in AWS Secrets Manager. Grant the application access to retrieve the value from Secrets Manager.



**Answer: AE**

**Timestamp: 2024-02-12 18:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133634-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 325 discussion

A company runs an application on AWS. The application stores data in an Amazon DynamoDB table. Some queries are taking a long time to run. These slow queries involve an attribute that is not the table's partition key or sort key.

The amount of data that the application stores in the DynamoDB table is expected to increase significantly. A developer must increase the performance of the queries.

Which solution will meet these requirements?

**A:** Increase the page size for each request by setting the Limit parameter to be higher than the default value. Configure the application to retry any request that exceeds the provisioned throughput.

**B:** Create a global secondary index (GSI). Set query attribute to be the partition key of the index.

**C:** Perform a parallel scan operation by issuing individual scan requests. In the parameters, specify the segment for the scan requests and the total number of segments for the parallel scan.

**D:** Turn on read capacity auto scaling for the DynamoDB table. Increase the maximum read capacity units (RCUs).



**Answer: B**

**Timestamp: 2024-02-18 12:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134141-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 326 discussion

A company runs a payment application on Amazon EC2 instances behind an Application Load Balance. The EC2 instances run in an Auto Scaling group across multiple Availability Zones. The application needs to retrieve application secrets during the application startup and export the secrets as environment variables. These secrets must be encrypted at rest and need to be rotated every month.

Which solution will meet these requirements with the LEAST development effort?

**A:** Save the secrets in a text file and store the text file in Amazon S3. Provision a customer managed key. Use the key for secret encryption in Amazon S3. Read the contents of the text file and read the export as environment variables. Configure S3 Object Lambda to rotate the text file every month.

**B:** Save the secrets as strings in AWS Systems Manager Parameter Store and use the default AWS Key Management Service (AWS KMS) key. Configure an Amazon EC2 user data script to retrieve the secrets during the startup and export as environment variables. Configure an AWS Lambda function to rotate the secrets in Parameter Store every month.

**C:** Save the secrets as base64 encoded environment variables in the application properties. Retrieve the secrets during the application startup. Reference the secrets in the application code. Write a script to rotate the secrets saved as environment variables.

**D:** Store the secrets in AWS Secrets Manager. Provision a new customer master key. Use the key to encrypt the secrets. Enable automatic rotation. Configure an Amazon EC2 user data script to programmatically retrieve the secrets during the startup and export as environment variables.



**Answer: D**

**Timestamp: 2024-02-12 18:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133636-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 327 discussion

A company is using Amazon API Gateway to invoke a new AWS Lambda function. The company has Lambda function versions in its PROD and DEV environments. In each environment, there is a Lambda function alias pointing to the corresponding Lambda function version. API Gateway has one stage that is configured to point at the PROD alias.

The company wants to configure API Gateway to enable the PROD and DEV Lambda function versions to be simultaneously and distinctly available.

Which solution will meet these requirements?

**A:** Enable a Lambda authorizer for the Lambda function alias in API Gateway. Republish PROD and create a new stage for DEV. Create API Gateway stage variables for the PROD and DEV stages. Point each stage variable to the PROD Lambda authorizer to the DEV Lambda authorizer.

**B:** Set up a gateway response in API Gateway for the Lambda function alias. Republish PROD and create a new stage for DEV. Create gateway responses in API Gateway for PROD and DEV Lambda aliases.

**C:** Use an environment variable for the Lambda function alias in API Gateway. Republish PROD and create a new stage for development. Create API gateway environment variables for PROD and DEV stages. Point each stage variable to the PROD Lambda function alias to the DEV Lambda function alias.

**D:** Use an API Gateway stage variable to configure the Lambda function alias. Republish PROD and create a new stage for development. Create API Gateway stage variables for PROD and DEV stages. Point each stage variable to the PROD Lambda function alias and to the DEV Lambda function alias.



**Answer: D**

**Timestamp: 2024-02-18 12:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134142-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 328 discussion

A developer is working on an ecommerce platform that communicates with several third-party payment processing APIs. The third-party payment services do not provide a test environment.

The developer needs to validate the ecommerce platform's integration with the third-party payment processing APIs. The developer must test the API integration code without invoking the third-party payment processing APIs.

Which solution will meet these requirements?

**A:** Set up an Amazon API Gateway REST API with a gateway response configured for status code 200. Add response templates that contain sample responses captured from the real third-party API.

**B:** Set up an AWS AppSync GraphQL API with a data source configured for each third-party API. Specify an integration type of Mock. Configure integration responses by using sample responses captured from the real third-party API.

**C:** Create an AWS Lambda function for each third-party API. Embed responses captured from the real third-party API. Configure Amazon Route 53 Resolver with an inbound endpoint for each Lambda function's Amazon Resource Name (ARN).

**D:** Set up an Amazon API Gateway REST API for each third-party API. Specify an integration request type of Mock. Configure integration responses by using sample responses captured from the real third-party API.



**Answer: D**

**Timestamp: 2024-02-22 08:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134345-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 171 discussion

A developer has an application that is composed of many different AWS Lambda functions. The Lambda functions all use some of the same dependencies. To avoid security issues, the developer is constantly updating the dependencies of all of the Lambda functions. The result is duplicated effort for each function.

How can the developer keep the dependencies of the Lambda functions up to date with the LEAST additional complexity?

**A:** Define a maintenance window for the Lambda functions to ensure that the functions get updated copies of the dependencies.

**B:** Upgrade the Lambda functions to the most recent runtime version.

**C:** Define a Lambda layer that contains all of the shared dependencies.

**D:** Use an AWS CodeCommit repository to host the dependencies in a centralized location.



**Answer: C**

**Timestamp: 2023-10-06 02:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122591-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 172 discussion

A mobile app stores blog posts in an Amazon DynamoDB table. Millions of posts are added every day, and each post represents a single item in the table. The mobile app requires only recent posts. Any post that is older than 48 hours can be removed.

What is the MOST cost-effective way to delete posts that are older than 48 hours?

**A:** For each item, add a new attribute of type String that has a timestamp that is set to the blog post creation time. Create a script to find old posts with a table scan and remove posts that are older than 48 hours by using the BatchWriteItem API operation. Schedule a cron job on an Amazon EC2 instance once an hour to start the script.

**B:** For each item, add a new attribute of type String that has a timestamp that is set to the blog post creation time. Create a script to find old posts with a table scan and remove posts that are older than 48 hours by using the BatchWriteItem API operation. Place the script in a container image. Schedule an Amazon Elastic Container Service (Amazon ECS) task on AWS Fargate that invokes the container every 5 minutes.

**C:** For each item, add a new attribute of type Date that has a timestamp that is set to 48 hours after the blog post creation time. Create a global secondary index (GSI) that uses the new attribute as a sort key. Create an AWS Lambda function that references the GSI and removes expired items by using the BatchWriteItem API operation. Schedule the function with an Amazon CloudWatch event every minute.

**D:** For each item, add a new attribute of type Number that has a timestamp that is set to 48 hours after the blog post creation time. Configure the DynamoDB table with a TTL that references the new attribute.



**Answer: D**

**Timestamp: 2023-10-06 02:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122593-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 173 discussion

A developer is modifying an existing AWS Lambda function. While checking the code, the developer notices hardcoded parameter values for an Amazon RDS for SQL Server user name, password, database, host, and port. There are also hardcoded parameter values for an Amazon DynamoDB table, an Amazon S3 bucket, and an Amazon Simple Notification Service (Amazon SNS) topic.

The developer wants to securely store the parameter values outside the code in an encrypted format and wants to turn on rotation for the credentials. The developer also wants to be able to reuse the parameter values from other applications and to update the parameter values without modifying code.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create an RDS database secret in AWS Secrets Manager. Set the user name, password, database, host, and port. Turn on secret rotation. Create encrypted Lambda environment variables for the DynamoDB table, S3 bucket, and SNS topic.

**B:** Create an RDS database secret in AWS Secrets Manager. Set the user name, password, database, host, and port. Turn on secret rotation. Create SecureString parameters in AWS Systems Manager Parameter Store for the DynamoDB table, S3 bucket, and SNS topic.

**C:** Create RDS database parameters in AWS Systems Manager Parameter Store for the user name, password, database, host, and port. Create encrypted Lambda environment variables for the DynamoDB table, S3 bucket, and SNS topic. Create a Lambda function and set the logic for the credentials rotation task. Schedule the credentials rotation task in Amazon EventBridge.

**D:** Create RDS database parameters in AWS Systems Manager Parameter Store for the user name, password, database, host, and port. Store the DynamoDB table, S3 bucket, and SNS topic in Amazon S3. Create a Lambda function and set the logic for the credentials rotation. Invoke the Lambda function on a schedule.



**Answer: B**

**Timestamp: 2023-10-06 02:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122592-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 174 discussion

A developer accesses AWS CodeCommit over SSH. The SSH keys configured to access AWS CodeCommit are tied to a user with the following permissions:

//IMG//


The developer needs to create/delete branches.

Which specific IAM permissions need to be added, based on the principle of least privilege?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image13.png

**A:** "codecommit:CreateBranch"
"codecommit:DeleteBranch"

**B:** "codecommit:Put*"

**C:** "codecommit:Update*"

**D:** "codecommit:*"



**Answer: A**

**Timestamp: 2023-10-06 02:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122594-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 175 discussion

An application that is deployed to Amazon EC2 is using Amazon DynamoDB. The application calls the DynamoDB REST API. Periodically, the application receives a ProvisionedThroughputExceededException error when the application writes to a DynamoDB table.

Which solutions will mitigate this error MOST cost-effectively? (Choose two.)

**A:** Modify the application code to perform exponential backoff when the error is received.

**B:** Modify the application to use the AWS SDKs for DynamoDB.

**C:** Increase the read and write throughput of the DynamoDB table.

**D:** Create a DynamoDB Accelerator (DAX) cluster for the DynamoDB table.

**E:** Create a second DynamoDB table. Distribute the reads and writes between the two tables.



**Answer: AB**

**Timestamp: 2023-10-06 02:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122595-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 453 discussion

A company is developing a serverless application that requires storage of sensitive API keys as environment variables for various services. The application requires the automatic rotation of the encryption keys every year.

Which solution will meet these requirements with no development effort?

**A:** Encrypt the environment variables by using AWS Secrets Manager. Set up automatic rotation in Secrets Manager.

**B:** Encrypt the environment variables by using AWS Key Management Service (AWS KMS) customer managed keys. Enable automatic key rotation.

**C:** Encrypt the environment variables by using AWS Key Management Service (AWS KMS) AWS managed keys. Configure a custom AWS Lambda function to automate key rotation.

**D:** Encrypt the environment variables by using AWS Systems Manager Parameter Store. Set up automatic rotation in Parameter Store.



**Answer: B**

**Timestamp: 2024-11-14 21:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/151333-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 454 discussion

A developer built an application that uses AWS Lambda functions to process images. The developer wants to improve image processing times throughout the day.

The developer needs to create an Amazon CloudWatch Logs Insights query that shows the average, slowest, and fastest processing time in 1-minute intervals.

Which query will meet these requirements?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: A**

**Timestamp: 2025-03-04 14:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157514-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 455 discussion

An application stores user data in Amazon S3 buckets in multiple AWS Regions. A developer needs to implement a solution that analyzes the user data in the S3 buckets to find sensitive information. The analysis findings from all the S3 buckets must be available in the eu-west-2 Region.

Which solution will meet these requirements with the LEAST development effort?

**A:** Create an AWS Lambda function to generate findings. Program the Lambda function to send the findings to another S3 bucket in eu-west-2.

**B:** Configure Amazon Macie to generate findings. Use Amazon EventBridge to create rules that copy the findings to eu-west-2.

**C:** Configure Amazon Inspector to generate findings. Use Amazon EventBridge to create rules that copy the findings to eu-west-2.

**D:** Configure Amazon Macie to generate findings and to publish the findings to AWS CloudTrail. Use a CloudTrail trail to copy the results to eu-west-2.



**Answer: B**

**Timestamp: 2024-11-19 11:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/151627-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 456 discussion

An application ingests data from an Amazon Kinesis data stream. The shards in the data stream are set for normal traffic.

During tests for peak traffic, the application ingests data slowly. A developer needs to adjust the data stream to handle the peak traffic.

What should the developer do to meet this requirement MOST cost-effectively?

**A:** Install the Kinesis Producer Library (KPL) to ingest data into the data stream.

**B:** Switch to on-demand capacity mode for the data stream. Specify a partition key when writing data to the data stream.

**C:** Decrease the amount of time that data is kept in the data stream by using the DecreaseStreamRetentionPeriod API operation.

**D:** Increase the shard count in the data stream by using the UpdateShardCount API operation.



**Answer: D**

**Timestamp: 2024-11-18 13:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/151547-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 457 discussion

A developer is building an application that uses an AWS Lambda function to process data. The application requires minimum latency. The Lambda function must have predictable function start times. All setup activities for the execution environment must happen before invocation of the Lambda function.

Which solution will meet these requirements?

**A:** Increase the memory of the Lambda function to the maximum amount. Configure an Amazon EventBridge rule to schedule invocations of the Lambda function every minute to keep the execution environment active.

**B:** Optimize the static initialization code that runs when a new execution environment is prepared for the first time. Decrease and compress the size of the Lambda function package and the imported libraries and dependencies.

**C:** Increase the reserved concurrency of the Lambda function to the maximum value for unreserved account concurrency. Run any setup activities manually before the initial invocation of the Lambda function.

**D:** Publish a new version of the Lambda function. Configure provisioned concurrency for the Lambda function with the required minimum number of execution environments.



**Answer: D**

**Timestamp: 2024-12-12 12:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152886-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 365 discussion

A developer is creating an AWS Lambda function that is invoked by messages to an Amazon Simple Notification Service (Amazon SNS) topic. The messages represent customer data updates from a customer relationship management (CRM) system

The developer wants the Lambda function to process only the messages that pertain to email address changes. Additional subscribers to the SNS topic will process any other messages.

Which solution will meet these requirements in the LEAST development effort?

**A:** Use Lambda event filtering to allow only messages that are related to email address changes to invoke the Lambda function.

**B:** Use an SNS filter policy on the Lambda function subscription to allow only messages that are related to email address changes to invoke the Lambda function.

**C:** Subscribe an Amazon Simple Queue Service (Amazon SQS) queue to the SNS topic. Configure the SQS queue with a filter policy to allow only messages that are related to email address changes.
Connect the SQS queue to the Lambda function.

**D:** Configure the Lambda code to check the received message. If the message is not related to an email address change, configure the Lambda function to publish the message back to the SNS topic for the other subscribers to process.



**Answer: B**

**Timestamp: 2024-07-12 05:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143748-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 366 discussion

A developer is designing a fault-tolerant environment where client sessions will be saved.

How can the developer ensure that no sessions are lost if an Amazon EC2 instance fails?

**A:** Use sticky sessions with an Elastic Load Balancer target group.

**B:** Use Amazon SQS to save session data.

**C:** Use Amazon DynamoDB to perform scalable session handling.

**D:** Use Elastic Load Balancer connection draining to stop sending requests to failing instances.



**Answer: C**

**Timestamp: 2024-07-12 05:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143749-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 367 discussion

A developer is creating AWS CloudFormation templates to manage an application's deployment in Amazon Elastic Container Service (Amazon ECS) through AWS CodeDeploy. The developer wants to automatically deploy new versions of the application to a percentage of users before the new version becomes available for all users.

How should the developer manage the deployment of the new version?

**A:** Modify the CloudFormation template to include a Transform section and the AWS::CodeDeploy::BlueGreen hook.

**B:** Deploy the new version in a new CloudFormation stack. After testing is complete, update the application's DNS records for the new stack.

**C:** Run CloudFormation stack updates on the application stack to deploy new application versions when they are available.

**D:** Create a nested stack for the new version. Include a Transform section and the AWS::CodeDeploy::BlueGreen hook.



**Answer: A**

**Timestamp: 2024-07-12 05:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143750-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 368 discussion

A developer has written a distributed application that uses microservices. The microservices are running on Amazon EC2 instances. Because of message volume, the developer is unable to match log output from each microservice to a specific transaction. The developer needs to analyze the message flow to debug the application.

Which combination of steps should the developer take to meet this requirement? (Choose two.)

**A:** Download the AWS X-Ray daemon. Install the daemon on an EC2 instance. Ensure that the EC2 instance allows UDP traffic on port 2000.

**B:** Configure an interface VPC endpoint to allow traffic to reach the global AWS X-Ray daemon on TCP port 2000.

**C:** Enable AWS X-Ray. Configure Amazon CloudWatch to push logs to X-Ray.

**D:** Add the AWS X-Ray software development kit (SDK) to the microservices. Use X-Ray to trace requests that each microservice makes.

**E:** Set up Amazon CloudWatch metric streams to collect streaming data from the microservices.



**Answer: AD**

**Timestamp: 2024-07-12 05:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143751-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 369 discussion

A company is working on a new serverless application. A developer needs to find an automated way to deploy AWS Lambda functions and the dependent infrastructure with minimum coding effort. The application also needs to be reliable.

Which method will meet these requirements with the LEAST operational overhead?

**A:** Build the application by using shell scripts to create .zip files for each Lambda function. Manually upload the .zip files to the AWS Management Console.

**B:** Build the application by using the AWS Serverless Application Model (AWS SAM). Use a continuous integration and continuous delivery (CI/CD) pipeline and the SAM CLI to deploy the Lambda functions.

**C:** Build the application by using shell scripts to create .zip files for each Lambda function. Upload the .zip files. Deploy the .zip files as Lambda functions by using the AWS CLI in a continuous integration and continuous delivery (CI/CD) pipeline.

**D:** Build a container for each Lambda function. Store the container images in AWS CodeArtifact. Deploy the containers as Lambda functions by using the AWS CLI in a continuous integration and continuous delivery (CI/CD) pipeline.



**Answer: B**

**Timestamp: 2024-07-12 05:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143752-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 37 discussion

A company has an Amazon S3 bucket that contains sensitive data. The data must be encrypted in transit and at rest. The company encrypts the data in the S3 bucket by using an AWS Key Management Service (AWS KMS) key. A developer needs to grant several other AWS accounts the permission to use the S3 GetObject operation to retrieve the data from the S3 bucket.
How can the developer enforce that all requests to retrieve the data provide encryption in transit?

**A:** Define a resource-based policy on the S3 bucket to deny access when a request meets the condition “aws:SecureTransport”: “false”.

**B:** Define a resource-based policy on the S3 bucket to allow access when a request meets the condition “aws:SecureTransport”: “false”.

**C:** Define a role-based policy on the other accounts' roles to deny access when a request meets the condition of “aws:SecureTransport”: “false”.

**D:** Define a resource-based policy on the KMS key to deny access when a request meets the condition of “aws:SecureTransport”: “false”.



**Answer: A**

**Timestamp: 2023-03-25 13:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103850-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 370 discussion

A developer needs to modify an application architecture to meet new functional requirements. Application data is stored in Amazon DynamoDB and processed for analysis in a nightly batch. The system analysts do not want to wait until the next day to view the processed data and have asked to have it available in near-real time.

Which application architecture pattern would enable the data to be processed as it is received?

**A:** Event driven

**B:** Client-server driven

**C:** Fan-out driven

**D:** Schedule driven



**Answer: A**

**Timestamp: 2024-07-12 05:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143753-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 371 discussion

A company hosts its application in the us-west-1 Region. The company wants to add redundancy in the us-east-1 Region.

The application secrets are stored in AWS Secrets Manager in us-west-1. A developer needs to replicate the secrets to us-east-1.

Which solution will meet this requirement?

**A:** Configure secret replication for each secret. Add us-east-1 as a replication Region. Choose an AWS Key Management Service (AWS KMS) key in us-east-1 to encrypt the replicated secrets.

**B:** Create a new secret in us-east-1 for each secret. Configure secret replication in us-east-1. Set the source to be the corresponding secret in us-west-1. Choose an AWS Key Management Service (AWS KMS) key in us-west-1 to encrypt the replicated secrets.

**C:** Create a replication rule for each secret. Set us-east-1 as the destination Region. Configure the rule to run during secret rotation. Choose an AWS Key Management Service (AWS KMS) key in us-east-1 to encrypt the replicated secrets.

**D:** Create a Secrets Manager lifecycle rule to replicate each secret to a new Amazon S3 bucket in us-west-1. Configure an S3 replication rule to replicate the secrets to us-east-1.



**Answer: A**

**Timestamp: 2024-07-12 05:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143754-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 372 discussion

A company runs an ecommerce application on AWS. The application stores data in an Amazon Aurora database.

A developer is adding a caching layer to the application. The caching strategy must ensure that the application always uses the most recent value for each data item.

Which caching strategy will meet these requirements?

**A:** Implement a TTL strategy for every item that is saved in the cache.

**B:** Implement a write-through strategy for every item that is created and updated.

**C:** Implement a lazy loading strategy for every item that is loaded.

**D:** Implement a read-through strategy for every item that is loaded.



**Answer: B**

**Timestamp: 2024-07-12 05:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143755-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 373 discussion

A company has a serverless application that uses Amazon API Gateway backed by AWS Lambda proxy integration. The company is developing several backend APIs. The company needs a landing page to provide an overview of navigation to the APIs.

A developer creates a new/LandingPage resource and a new GET method that uses mock integration.

What should the developer do next to meet these requirements?

**A:** Configure the integration request mapping template with Content-Type of text/html and statusCode of 200. Configure the integration response mapping template with Content-Type of application/json. In the integration response mapping template, include the LandingPage HTML code that references the APIs.

**B:** Configure the integration request mapping template with Content-Type of application/json. In the integration request mapping template, include the LandingPage HMTL code that references the APIs. Configure the integration response mapping template with Content-Type of text/html and statusCode of 200.

**C:** Configure the integration request mapping template with Content-Type of application/json and statusCode of 200. Configure the integration response mapping template with Content-Type of text/html. In the integration response mapping template, include the LandingPage HTML code that references the APIs.

**D:** Configure the integration request mapping template with Content-Type of text/html. In the integration request mapping template, include the LandingPage HTML code that references the APIs. Configure the integration response mapping template with Content-Type of application/json and statusCode of 200.



**Answer: C**

**Timestamp: 2024-06-29 14:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143069-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 9 discussion

A company wants to share information with a third party. The third party has an HTTP API endpoint that the company can use to share the information. The company has the required API key to access the HTTP API.
The company needs a way to manage the API key by using code. The integration of the API key with the application code cannot affect application performance.
Which solution will meet these requirements MOST securely?

**A:** Store the API credentials in AWS Secrets Manager. Retrieve the API credentials at runtime by using the AWS SDK. Use the credentials to make the API call.

**B:** Store the API credentials in a local code variable. Push the code to a secure Git repository. Use the local code variable at runtime to make the API call.

**C:** Store the API credentials as an object in a private Amazon S3 bucket. Restrict access to the S3 object by using IAM policies. Retrieve the API credentials at runtime by using the AWS SDK. Use the credentials to make the API call.

**D:** Store the API credentials in an Amazon DynamoDB table. Restrict access to the table by using resource-based policies. Retrieve the API credentials at runtime by using the AWS SDK. Use the credentials to make the API call.



**Answer: A**

**Timestamp: 2023-03-20 07:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103334-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 90 discussion

A company moved some of its secure files to a private Amazon S3 bucket that has no public access. The company wants to develop a serverless application that gives its employees the ability to log in and securely share the files with other users.

Which AWS feature should the company use to share and access the files securely?

**A:** Amazon Cognito user pool

**B:** S3 presigned URLs

**C:** S3 bucket policy

**D:** Amazon Cognito identity pool



**Answer: B**

**Timestamp: 2023-05-14 07:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109208-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 91 discussion

A company needs to develop a proof of concept for a web service application. The application will show the weather forecast for one of the company's office locations. The application will provide a REST endpoint that clients can call. Where possible, the application should use caching features provided by AWS to limit the number of requests to the backend service. The application backend will receive a small amount of traffic only during testing.

Which approach should the developer take to provide the REST endpoint MOST cost-effectively?

**A:** Create a container image. Deploy the container image by using Amazon Elastic Kubernetes Service (Amazon EKS). Expose the functionality by using Amazon API Gateway.

**B:** Create an AWS Lambda function by using the AWS Serverless Application Model (AWS SAM). Expose the Lambda functionality by using Amazon API Gateway.

**C:** Create a container image. Deploy the container image by using Amazon Elastic Container Service (Amazon ECS). Expose the functionality by using Amazon API Gateway.

**D:** Create a microservices application. Deploy the application to AWS Elastic Beanstalk. Expose the AWS Lambda functionality by using an Application Load Balancer.



**Answer: B**

**Timestamp: 2023-05-14 07:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109210-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 92 discussion

An e-commerce web application that shares session state on-premises is being migrated to AWS. The application must be fault tolerant, natively highly scalable, and any service interruption should not affect the user experience.

What is the best option to store the session state?

**A:** Store the session state in Amazon ElastiCache.

**B:** Store the session state in Amazon CloudFront.

**C:** Store the session state in Amazon S3.

**D:** Enable session stickiness using elastic load balancers.



**Answer: A**

**Timestamp: 2023-05-08 14:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108741-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 93 discussion

A developer is building an application that uses Amazon DynamoDB. The developer wants to retrieve multiple specific items from the database with a single API call.

Which DynamoDB API call will meet these requirements with the MINIMUM impact on the database?

**A:** BatchGetItem

**B:** GetItem

**C:** Scan

**D:** Query



**Answer: A**

**Timestamp: 2023-04-21 18:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106941-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 176 discussion

When a developer tries to run an AWS CodeBuild project, it raises an error because the length of all environment variables exceeds the limit for the combined maximum of characters.

What is the recommended solution?

**A:** Add the export LC_ALL="en_US.utf8" command to the pre_build section to ensure POSIX localization.

**B:** Use Amazon Cognito to store key-value pairs for large numbers of environment variables.

**C:** Update the settings for the build project to use an Amazon S3 bucket for large numbers of environment variables.

**D:** Use AWS Systems Manager Parameter Store to store large numbers of environment variables.



**Answer: D**

**Timestamp: 2023-10-06 02:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122596-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 177 discussion

A company is expanding the compatibility of its photo-sharing mobile app to hundreds of additional devices with unique screen dimensions and resolutions. Photos are stored in Amazon S3 in their original format and resolution. The company uses an Amazon CloudFront distribution to serve the photos. The app includes the dimension and resolution of the display as GET parameters with every request.

A developer needs to implement a solution that optimizes the photos that are served to each device to reduce load time and increase photo quality.

Which solution will meet these requirements MOST cost-effectively?

**A:** Use S3 Batch Operations to invoke an AWS Lambda function to create new variants of the photos with the required dimensions and resolutions. Create a dynamic CloudFront origin that automatically maps the request of each device to the corresponding photo variant.

**B:** Use S3 Batch Operations to invoke an AWS Lambda function to create new variants of the photos with the required dimensions and resolutions. Create a Lambda@Edge function to route requests to the corresponding photo variant by using request headers.

**C:** Create a Lambda@Edge function that optimizes the photos upon request and returns the photos as a response. Change the CloudFront TTL cache policy to the maximum value possible.

**D:** Create a Lambda@Edge function that optimizes the photos upon request and returns the photos as a response. In the same function, store a copy of the processed photos on Amazon S3 for subsequent requests.



**Answer: D**

**Timestamp: 2023-10-06 02:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122597-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 178 discussion

A company is building an application for stock trading. The application needs sub-millisecond latency for processing trade requests. The company uses Amazon DynamoDB to store all the trading data that is used to process each trading request.

A development team performs load testing on the application and finds that the data retrieval time is higher than expected. The development team needs a solution that reduces the data retrieval time with the least possible effort.

Which solution meets these requirements?

**A:** Add local secondary indexes (LSIs) for the trading data.

**B:** Store the trading data in Amazon S3, and use S3 Transfer Acceleration.

**C:** Add retries with exponential backoff for DynamoDB queries.

**D:** Use DynamoDB Accelerator (DAX) to cache the trading data.



**Answer: D**

**Timestamp: 2023-10-06 02:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122598-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 179 discussion

A developer is working on a Python application that runs on Amazon EC2 instances. The developer wants to enable tracing of application requests to debug performance issues in the code.

Which combination of actions should the developer take to achieve this goal? (Choose two.)

**A:** Install the Amazon CloudWatch agent on the EC2 instances.

**B:** Install the AWS X-Ray daemon on the EC2 instances.

**C:** Configure the application to write JSON-formatted logs to /var/log/cloudwatch.

**D:** Configure the application to write trace data to /var/log/xray.

**E:** Install and configure the AWS X-Ray SDK for Python in the application.



**Answer: BE**

**Timestamp: 2023-10-06 02:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122600-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 18 discussion

A company is building a serverless application on AWS. The application uses an AWS Lambda function to process customer orders 24 hours a day, 7 days a week. The Lambda function calls an external vendor's HTTP API to process payments.
During load tests, a developer discovers that the external vendor payment processing API occasionally times out and returns errors. The company expects that some payment processing API calls will return errors.
The company wants the support team to receive notifications in near real time only when the payment processing external API error rate exceed 5% of the total number of transactions in an hour. Developers need to use an existing Amazon Simple Notification Service (Amazon SNS) topic that is configured to notify the support team.
Which solution will meet these requirements?

**A:** Write the results of payment processing API calls to Amazon CloudWatch. Use Amazon CloudWatch Logs Insights to query the CloudWatch logs. Schedule the Lambda function to check the CloudWatch logs and notify the existing SNS topic.

**B:** Publish custom metrics to CloudWatch that record the failures of the external payment processing API calls. Configure a CloudWatch alarm to notify the existing SNS topic when error rate exceeds the specified rate.

**C:** Publish the results of the external payment processing API calls to a new Amazon SNS topic. Subscribe the support team members to the new SNS topic.

**D:** Write the results of the external payment processing API calls to Amazon S3. Schedule an Amazon Athena query to run at regular intervals. Configure Athena to send notifications to the existing SNS topic when the error rate exceeds the specified rate.



**Answer: B**

**Timestamp: 2023-03-21 12:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103466-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 293 discussion

A developer is deploying a company's application to Amazon EC2 instances. The application generates gigabytes of data files each day. The files are rarely accessed, but the files must be available to the application's users within minutes of a request during the first year of storage. The company must retain the files for 7 years.

How can the developer implement the application to meet these requirements MOST cost-effectively?

**A:** Store the files in an Amazon S3 bucket. Use the S3 Glacier Instant Retrieval storage class. Create an S3 Lifecycle policy to transition the files to the S3 Glacier Deep Archive storage class after 1 year.

**B:** Store the files in an Amazon S3 bucket. Use the S3 Standard storage class. Create an S3 Lifecycle policy to transition the files to the S3 Glacier Flexible Retrieval storage class after 1 year.

**C:** Store the files on an Amazon Elastic Block Store (Amazon EBS) volume. Use Amazon Data Lifecycle Manager (Amazon DLM) to create snapshots of the EBS volumes and to store those snapshots in Amazon S3.

**D:** Store the files on an Amazon Elastic File System (Amazon EFS) mount. Configure EFS lifecycle management to transition the files to the EFS Standard- Infrequent Access (Standard-IA) storage class after 1 year.



**Answer: A**

**Timestamp: 2024-02-21 07:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134292-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 294 discussion

A company's developer has deployed an application in AWS by using AWS CloudFormation. The CloudFormation stack includes parameters in AWS Systems Manager Parameter Store that the application uses as configuration settings. The application can modify the parameter values.

When the developer updated the stack to create additional resources with tags, the developer noted that the parameter values were reset and that the values ignored the latest changes made by the application. The developer needs to change the way the company deploys the CloudFormation stack. The developer also needs to avoid resetting the parameter values outside the stack.

Which solution will meet these requirements with the LEAST development effort?

**A:** Modify the CloudFormation stack to set the deletion policy to Retain for the Parameter Store parameters.

**B:** Create an Amazon DynamoDB table as a resource in the CloudFormation stack to hold configuration data for the application. Migrate the parameters that the application is modifying from Parameter Store to the DynamoDB table.

**C:** Create an Amazon RDS DB instance as a resource in the CloudFormation stack. Create a table in the database for parameter configuration. Migrate the parameters that the application is modifying from Parameter Store to the configuration table.

**D:** Modify the CloudFormation stack policy to deny updates on Parameter Store parameters.



**Answer: A**

**Timestamp: 2024-02-21 07:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134293-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 295 discussion

A company has a social media application that receives large amounts of traffic. User posts and interactions are continuously updated in an Amazon RDS database. The data changes frequently, and the data types can be complex. The application must serve read requests with minimal latency.

The application's current architecture struggles to deliver these rapid data updates efficiently. The company needs a solution to improve the application's performance.

Which solution will meet these requirements?

**A:** Use Amazon DynamoDB Accelerator (DAX) in front of the RDS database to provide a caching layer for the high volume of rapidly changing data.

**B:** Set up Amazon S3 Transfer Acceleration on the RDS database to enhance the speed of data transfer from the databases to the application.

**C:** Add an Amazon CloudFront distribution in front of the RDS database to provide a caching layer for the high volume of rapidly changing data.

**D:** Create an Amazon ElastiCache for Redis cluster. Update the application code to use a write-through caching strategy and read the data from Redis.



**Answer: D**

**Timestamp: 2024-02-21 07:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134294-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 296 discussion

A developer created an AWS Lambda function that performs a series of operations that involve multiple AWS services. The function's duration time is higher than normal. To determine the cause of the issue, the developer must investigate traffic between the services without changing the function code.

Which solution will meet these requirements?

**A:** Enable AWS X-Ray active tracing in the Lambda function. Review the logs in X-Ray.

**B:** Configure AWS CloudTrail. View the trail logs that are associated with the Lambda function.

**C:** Review the AWS Config logs in Amazon CloudWatch.

**D:** Review the Amazon CloudWatch logs that are associated with the Lambda function.



**Answer: A**

**Timestamp: 2024-02-21 07:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134295-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 297 discussion

A company has on-premises data centers that run an image processing service. The service consists of containerized applications that run on Kubernetes clusters. All the applications have access to the same NFS share for files and data storage.

The company is running out of NFS capacity in the data centers and needs to migrate to AWS as soon as possible. The Kubernetes clusters must be highly available on AWS.

Which combination of actions will meet these requirements? (Choose two.)

**A:** Transfer the information that is in the NFS share to an Amazon Elastic Block Store (Amazon EBS) volume. Upload the container images to Amazon Elastic Container Registry (Amazon ECR).

**B:** Transfer the information that is in the NFS share to an Amazon Elastic File System (Amazon EFS) volume. Upload the container images to Amazon Elastic Container Registry (Amazon ECR).

**C:** Create an Amazon Elastic Container Service (Amazon ECS) cluster to run the applications. Configure each node of the cluster to mount the Amazon Elastic Block Store (Amazon EBS) volume at the required path for the container images.

**D:** Create an Amazon Elastic Kubernetes Service (Amazon EKS) cluster to run the applications. Configure each node of the cluster to mount the Amazon Elastic Block Store (Amazon EBS) volume at the required path for the container images.

**E:** Create an Amazon Elastic Kubernetes Service (Amazon EKS) cluster to run the applications. Configure each node of the cluster to mount the Amazon Elastic File System (Amazon EFS) volume at the required path for the container images.



**Answer: BE**

**Timestamp: 2024-02-21 07:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134296-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 117 discussion

A developer maintains a critical business application that uses Amazon DynamoDB as the primary data store. The DynamoDB table contains millions of documents and receives 30-60 requests each minute. The developer needs to perform processing in near-real time on the documents when they are added or updated in the DynamoDB table.

How can the developer implement this feature with the LEAST amount of change to the existing application code?

**A:** Set up a cron job on an Amazon EC2 instance. Run a script every hour to query the table for changes and process the documents.

**B:** Enable a DynamoDB stream on the table. Invoke an AWS Lambda function to process the documents.

**C:** Update the application to send a PutEvents request to Amazon EventBridge. Create an EventBridge rule to invoke an AWS Lambda function to process the documents.

**D:** Update the application to synchronously process the documents directly after the DynamoDB write.



**Answer: B**

**Timestamp: 2023-04-22 23:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107051-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 118 discussion

A developer is writing an application for a company. The application will be deployed on Amazon EC2 and will use an Amazon RDS for Microsoft SQL Server database. The company's security team requires that database credentials are rotated at least weekly.

How should the developer configure the database credentials for this application?

**A:** Create a database user. Store the user name and password in an AWS Systems Manager Parameter Store secure string parameter. Enable rotation of the AWS Key Management Service (AWS KMS) key that is used to encrypt the parameter.

**B:** Enable IAM authentication for the database. Create a database user for use with IAM authentication. Enable password rotation.

**C:** Create a database user. Store the user name and password in an AWS Secrets Manager secret that has daily rotation enabled.

**D:** Use the EC2 user data to create a database user. Provide the user name and password in environment variables to the application.



**Answer: C**

**Timestamp: 2023-04-22 23:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107052-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 119 discussion

A real-time messaging application uses Amazon API Gateway WebSocket APIs with backend HTTP service. A developer needs to build a feature in the application to identify a client that keeps connecting to and disconnecting from the WebSocket connection. The developer also needs the ability to remove the client.

Which combination of changes should the developer make to the application to meet these requirements? (Choose two.)

**A:** Switch to HTTP APIs in the backend service.

**B:** Switch to REST APIs in the backend service.

**C:** Use the callback URL to disconnect the client from the backend service.

**D:** Add code to track the client status in Amazon ElastiCache in the backend service.

**E:** Implement $connect and $disconnect routes in the backend service.



**Answer: DE**

**Timestamp: 2023-04-22 23:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107053-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 12 discussion

A developer is creating an application that will give users the ability to store photos from their cellphones in the cloud. The application needs to support tens of thousands of users. The application uses an Amazon API Gateway REST API that is integrated with AWS Lambda functions to process the photos. The application stores details about the photos in Amazon DynamoDB.
Users need to create an account to access the application. In the application, users must be able to upload photos and retrieve previously uploaded photos. The photos will range in size from 300 KB to 5 MB.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Use Amazon Cognito user pools to manage user accounts. Create an Amazon Cognito user pool authorizer in API Gateway to control access to the API. Use the Lambda function to store the photos and details in the DynamoDB table. Retrieve previously uploaded photos directly from the DynamoDB table.

**B:** Use Amazon Cognito user pools to manage user accounts. Create an Amazon Cognito user pool authorizer in API Gateway to control access to the API. Use the Lambda function to store the photos in Amazon S3. Store the object's S3 key as part of the photo details in the DynamoDB table. Retrieve previously uploaded photos by querying DynamoDB for the S3 key.

**C:** Create an IAM user for each user of the application during the sign-up process. Use IAM authentication to access the API Gateway API. Use the Lambda function to store the photos in Amazon S3. Store the object's S3 key as part of the photo details in the DynamoDB table. Retrieve previously uploaded photos by querying DynamoDB for the S3 key.

**D:** Create a users table in DynamoDB. Use the table to manage user accounts. Create a Lambda authorizer that validates user credentials against the users table. Integrate the Lambda authorizer with API Gateway to control access to the API. Use the Lambda function to store the photos in Amazon S3. Store the object's S3 key as par of the photo details in the DynamoDB table. Retrieve previously uploaded photos by querying DynamoDB for the S3 key.



**Answer: B**

**Timestamp: 2023-03-21 06:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103439-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 120 discussion

A developer has written code for an application and wants to share it with other developers on the team to receive feedback. The shared application code needs to be stored long-term with multiple versions and batch change tracking.

Which AWS service should the developer use?

**A:** AWS CodeBuild

**B:** Amazon S3

**C:** AWS CodeCommit

**D:** AWS Cloud9



**Answer: C**

**Timestamp: 2023-04-22 23:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107054-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 108 discussion

A developer is updating several AWS Lambda functions and notices that all the Lambda functions share the same custom libraries. The developer wants to centralize all the libraries, update the libraries in a convenient way, and keep the libraries versioned.

Which solution will meet these requirements with the LEAST development effort?

**A:** Create an AWS CodeArtifact repository that contains all the custom libraries.

**B:** Create a custom container image for the Lambda functions to save all the custom libraries.

**C:** Create a Lambda layer that contains all the custom libraries.

**D:** Create an Amazon Elastic File System (Amazon EFS) file system to store all the custom libraries.



**Answer: C**

**Timestamp: 2023-04-22 18:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107010-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 109 discussion

A developer wants to use AWS Elastic Beanstalk to test a new version of an application in a test environment.

Which deployment method offers the FASTEST deployment?

**A:** Immutable

**B:** Rolling

**C:** Rolling with additional batch

**D:** All at once



**Answer: D**

**Timestamp: 2023-05-16 13:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109399-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 11 discussion

A company is migrating legacy internal applications to AWS. Leadership wants to rewrite the internal employee directory to use native AWS services. A developer needs to create a solution for storing employee contact details and high-resolution photos for use with the new application.
Which solution will enable the search and retrieval of each employee's individual details and high-resolution photos using AWS APIs?

**A:** Encode each employee's contact information and photos using Base64. Store the information in an Amazon DynamoDB table using a sort key.

**B:** Store each employee's contact information in an Amazon DynamoDB table along with the object keys for the photos stored in Amazon S3.

**C:** Use Amazon Cognito user pools to implement the employee directory in a fully managed software-as-a-service (SaaS) method.

**D:** Store employee contact information in an Amazon RDS DB instance with the photos stored in Amazon Elastic File System (Amazon EFS).



**Answer: B**

**Timestamp: 2023-03-16 10:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102787-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 110 discussion

A company is providing read access to objects in an Amazon S3 bucket for different customers. The company uses IAM permissions to restrict access to the S3 bucket. The customers can access only their own files.

Due to a regulation requirement, the company needs to enforce encryption in transit for interactions with Amazon S3.

Which solution will meet these requirements?

**A:** Add a bucket policy to the S3 bucket to deny S3 actions when the aws:SecureTransport condition is equal to false.

**B:** Add a bucket policy to the S3 bucket to deny S3 actions when the s3:x-amz-acl condition is equal to public-read.

**C:** Add an IAM policy to the IAM users to enforce the usage of the AWS SDK.

**D:** Add an IAM policy to the IAM users that allows S3 actions when the s3:x-amz-acl condition is equal to bucket-owner-read.



**Answer: A**

**Timestamp: 2023-04-22 18:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107013-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 111 discussion

A company has an image storage web application that runs on AWS. The company hosts the application on Amazon EC2 instances in an Auto Scaling group. The Auto Scaling group acts as the target group for an Application Load Balancer (ALB) and uses an Amazon S3 bucket to store the images for sale.

The company wants to develop a feature to test system requests. The feature will direct requests to a separate target group that hosts a new beta version of the application.

Which solution will meet this requirement with the LEAST effort?

**A:** Create a new Auto Scaling group and target group for the beta version of the application. Update the ALB routing rule with a condition that looks for a cookie named version that has a value of beta. Update the test system code to use this cookie to test the beta version of the application.

**B:** Create a new ALB, Auto Scaling group, and target group for the beta version of the application. Configure an alternate Amazon Route 53 record for the new ALB endpoint. Use the alternate Route 53 endpoint in the test system requests to test the beta version of the application.

**C:** Create a new ALB, Auto Scaling group, and target group for the beta version of the application. Use Amazon CloudFront with Lambda@Edge to determine which specific request will go to the new ALB. Use the CloudFront endpoint to send the test system requests to test the beta version of the application.

**D:** Create a new Auto Scaling group and target group for the beta version of the application. Update the ALB routing rule with a condition that looks for a cookie named version that has a value of beta. Use Amazon CloudFront with Lambda@Edge to update the test system requests to add the required cookie when the requests go to the ALB.



**Answer: A**

**Timestamp: 2023-04-22 20:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107028-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 58 discussion

A developer is testing a new file storage application that uses an Amazon CloudFront distribution to serve content from an Amazon S3 bucket. The distribution accesses the S3 bucket by using an origin access identity (OAI). The S3 bucket's permissions explicitly deny access to all other users.
The application prompts users to authenticate on a login page and then uses signed cookies to allow users to access their personal storage directories. The developer has configured the distribution to use its default cache behavior with restricted viewer access and has set the origin to point to the S3 bucket. However, when the developer tries to navigate to the login page, the developer receives a 403 Forbidden error.
The developer needs to implement a solution to allow unauthenticated access to the login page. The solution also must keep all private content secure.
Which solution will meet these requirements?

**A:** Add a second cache behavior to the distribution with the same origin as the default cache behavior. Set the path pattern for the second cache behavior to the path of the login page, and make viewer access unrestricted. Keep the default cache behavior's settings unchanged.

**B:** Add a second cache behavior to the distribution with the same origin as the default cache behavior. Set the path pattern for the second cache behavior to *, and make viewer access restricted. Change the default cache behavior's path pattern to the path of the login page, and make viewer access unrestricted.

**C:** Add a second origin as a failover origin to the default cache behavior. Point the failover origin to the S3 bucket. Set the path pattern for the primary origin to *, and make viewer access restricted. Set the path pattern for the failover origin to the path of the login page, and make viewer access unrestricted.

**D:** Add a bucket policy to the S3 bucket to allow read access. Set the resource on the policy to the Amazon Resource Name (ARN) of the login page object in the S3 bucket. Add a CloudFront function to the default cache behavior to redirect unauthorized requests to the login page's S3 URL.



**Answer: A**

**Timestamp: 2023-03-27 01:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/104014-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 59 discussion

A developer is using AWS Amplify Hosting to build and deploy an application. The developer is receiving an increased number of bug reports from users. The developer wants to add end-to-end testing to the application to eliminate as many bugs as possible before the bugs reach production.
Which solution should the developer implement to meet these requirements?

**A:** Run the amplify add test command in the Amplify CLI.

**B:** Create unit tests in the application. Deploy the unit tests by using the amplify push command in the Amplify CLI.

**C:** Add a test phase to the amplify.yml build settings for the application.

**D:** Add a test phase to the aws-exports.js file for the application.



**Answer: C**

**Timestamp: 2023-03-27 01:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/104015-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 6 discussion

A developer is creating an AWS CloudFormation template to deploy Amazon EC2 instances across multiple AWS accounts. The developer must choose the EC2 instances from a list of approved instance types.
How can the developer incorporate the list of approved instance types in the CloudFormation template?

**A:** Create a separate CloudFormation template for each EC2 instance type in the list.

**B:** In the Resources section of the CloudFormation template, create resources for each EC2 instance type in the list.

**C:** In the CloudFormation template, create a separate parameter for each EC2 instance type in the list.

**D:** In the CloudFormation template, create a parameter with the list of EC2 instance types as AllowedValues.



**Answer: D**

**Timestamp: 2023-03-16 09:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102784-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 60 discussion

An ecommerce company is using an AWS Lambda function behind Amazon API Gateway as its application tier. To process orders during checkout, the application calls a POST API from the frontend. The POST API invokes the Lambda function asynchronously. In rare situations, the application has not processed orders. The Lambda application logs show no errors or failures.
What should a developer do to solve this problem?

**A:** Inspect the frontend logs for API failures. Call the POST API manually by using the requests from the log file.

**B:** Create and inspect the Lambda dead-letter queue. Troubleshoot the failed functions. Reprocess the events.

**C:** Inspect the Lambda logs in Amazon CloudWatch for possible errors. Fix the errors.

**D:** Make sure that caching is disabled for the POST API in API Gateway.



**Answer: B**

**Timestamp: 2023-03-24 23:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103807-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 61 discussion

A company is building a web application on AWS. When a customer sends a request, the application will generate reports and then make the reports available to the customer within one hour. Reports should be accessible to the customer for 8 hours. Some reports are larger than 1 MB. Each report is unique to the customer. The application should delete all reports that are older than 2 days.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Generate the reports and then store the reports as Amazon DynamoDB items that have a specified TTL. Generate a URL that retrieves the reports from DynamoDB. Provide the URL to customers through the web application.

**B:** Generate the reports and then store the reports in an Amazon S3 bucket that uses server-side encryption. Attach the reports to an Amazon Simple Notification Service (Amazon SNS) message. Subscribe the customer to email notifications from Amazon SNS.

**C:** Generate the reports and then store the reports in an Amazon S3 bucket that uses server-side encryption. Generate a presigned URL that contains an expiration date Provide the URL to customers through the web application. Add S3 Lifecycle configuration rules to the S3 bucket to delete old reports.

**D:** Generate the reports and then store the reports in an Amazon RDS database with a date stamp. Generate an URL that retrieves the reports from the RDS database. Provide the URL to customers through the web application. Schedule an hourly AWS Lambda function to delete database records that have expired date stamps.



**Answer: C**

**Timestamp: 2023-03-25 23:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103904-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 338 discussion

A company is using AWS CloudFormation templates to deploy AWS resources. The company needs to update one of its AWS CloudFormation stacks.

What can the company do to find out how the changes will impact the resources that are running?

**A:** Investigate the change sets.

**B:** Investigate the stack policies.

**C:** Investigate the Metadata section.

**D:** Investigate the Resources section.



**Answer: A**

**Timestamp: 2024-03-19 15:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136645-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 339 discussion

A company stores all personally identifiable information (PII) in an Amazon DynamoDB table named PII in Account A. Developers are working on an application that is running on Amazon EC2 instances in Account B. The application in Account B requires access to the PII table.

An administrator in Account A creates an IAM role named AccessPII that has permission to access the PII table. The administrator also creates a trust policy that specifies Account B as a principal that can assume the role.

Which combination of steps should the developers take in Account B to allow their application to access the PII table? (Choose two.)

**A:** Allow the EC2 IAM role the permission to assume the AccessPII role.

**B:** Allow the EC2 IAM role the permission to access the PII table.

**C:** Include the AWS API in the application code logic to obtain temporary credentials from the EC2 IAM role to access the PII table.

**D:** Include the AssumeRole API operation in the application code logic to obtain temporary credentials to access the PII table.

**E:** Include the GetSessionToken API operation in the application code logic to obtain temporary credentials to access the PII table.



**Answer: AD**

**Timestamp: 2024-03-23 03:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136962-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 34 discussion

A developer is creating a template that uses AWS CloudFormation to deploy an application. The application is serverless and uses Amazon API Gateway, Amazon DynamoDB, and AWS Lambda.
Which AWS service or tool should the developer use to define serverless resources in YAML?

**A:** CloudFormation serverless intrinsic functions

**B:** AWS Elastic Beanstalk

**C:** AWS Serverless Application Model (AWS SAM)

**D:** AWS Cloud Development Kit (AWS CDK)



**Answer: C**

**Timestamp: 2023-03-21 22:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103517-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 340 discussion

A gaming website gives users the ability to trade game items with each other on the platform. The platform requires both users' records to be updated and persisted in one transaction. If any update fails, the transaction must roll back.

Which AWS solutions can provide the transactional capability that is required for this feature? (Choose two.)

**A:** Amazon DynamoDB with operations made with the ConsistentRead parameter set to true

**B:** Amazon ElastiCache for Memcached with operations made within a transaction block

**C:** Amazon DynamoDB with reads and writes made by using Transact* operations

**D:** Amazon Aurora MySQL with operations made within a transaction block

**E:** Amazon Athena with operations made within a transaction block



**Answer: CD**

**Timestamp: 2024-03-23 04:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136964-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 341 discussion

A developer is deploying an application in the AWS Cloud by using AWS CloudFormation. The application will connect to an existing Amazon RDS database. The hostname of the RDS database is stored in AWS Systems Manager Parameter Store as a plaintext value. The developer needs to incorporate the database hostname into the CloudFormation template to initialize the application when the stack is created.

How should the developer reference the parameter that contains the database hostname?

**A:** Use the ssm dynamic reference.

**B:** Use the Ref intrinsic function.

**C:** Use the Fn::ImportValue intrinsic function.

**D:** Use the ssm-secure dynamic reference.



**Answer: A**

**Timestamp: 2024-03-23 04:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136965-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 130 discussion

A developer is working on a web application that uses Amazon DynamoDB as its data store. The application has two DynamoDB tables: one table that is named artists and one table that is named songs. The artists table has artistName as the partition key. The songs table has songName as the partition key and artistName as the sort key.

The table usage patterns include the retrieval of multiple songs and artists in a single database operation from the webpage. The developer needs a way to retrieve this information with minimal network traffic and optimal application performance.

Which solution will meet these requirements?

**A:** Perform a BatchGetltem operation that returns items from the two tables. Use the list of songName/artistName keys for the songs table and the list of artistName key for the artists table.

**B:** Create a local secondary index (LSI) on the songs table that uses artistName as the partition key. Perform a query operation for each artistName on the songs table that filters by the list of songName. Perform a query operation for each artistName on the artists table.

**C:** Perform a BatchGetitem operation on the songs table that uses the songName/artistName keys. Perform a BatchGetltem operation on the artists table that uses artistName as the key.

**D:** Perform a Scan operation on each table that filters by the list of songName/artistName for the songs table and the list of artistName in the artists table.



**Answer: A**

**Timestamp: 2023-06-10 14:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/111831-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 131 discussion

A company is developing an ecommerce application that uses Amazon API Gateway APIs. The application uses AWS Lambda as a backend. The company needs to test the code in a dedicated, monitored test environment before the company releases the code to the production environment.

Which solution will meet these requirements?

**A:** Use a single stage in API Gateway. Create a Lambda function for each environment. Configure API clients to send a query parameter that indicates the environment and the specific Lambda function.

**B:** Use multiple stages in API Gateway. Create a single Lambda function for all environments. Add different code blocks for different environments in the Lambda function based on Lambda environment variables.

**C:** Use multiple stages in API Gateway. Create a Lambda function for each environment. Configure API Gateway stage variables to route traffic to the Lambda function in different environments.

**D:** Use a single stage in API Gateway. Configure API clients to send a query parameter that indicates the environment. Add different code blocks for different environments in the Lambda function to match the value of the query parameter.



**Answer: C**

**Timestamp: 2023-06-10 14:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/111832-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 132 discussion

A developer creates an AWS Lambda function that retrieves and groups data from several public API endpoints. The Lambda function has been updated and configured to connect to the private subnet of a VPC. An internet gateway is attached to the VPC. The VPC uses the default network ACL and security group configurations.

The developer finds that the Lambda function can no longer access the public API. The developer has ensured that the public API is accessible, but the Lambda function cannot connect to the API

How should the developer fix the connection issue?

**A:** Ensure that the network ACL allows outbound traffic to the public internet.

**B:** Ensure that the security group allows outbound traffic to the public internet.

**C:** Ensure that outbound traffic from the private subnet is routed to a public NAT gateway.

**D:** Ensure that outbound traffic from the private subnet is routed to a new internet gateway.



**Answer: C**

**Timestamp: 2023-08-04 13:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117336-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 133 discussion

A developer needs to store configuration variables for an application. The developer needs to set an expiration date and time for the configuration. The developer wants to receive notifications before the configuration expires.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create a standard parameter in AWS Systems Manager Parameter Store. Set Expiration and ExpirationNotification policy types.

**B:** Create a standard parameter in AWS Systems Manager Parameter Store. Create an AWS Lambda function to expire the configuration and to send Amazon Simple Notification Service (Amazon SNS) notifications.

**C:** Create an advanced parameter in AWS Systems Manager Parameter Store. Set Expiration and ExpirationNotification policy types.

**D:** Create an advanced parameter in AWS Systems Manager Parameter Store. Create an Amazon EC2 instance with a cron job to expire the configuration and to send notifications.



**Answer: C**

**Timestamp: 2023-08-04 13:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117335-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 134 discussion

A company is developing a serverless application that consists of various AWS Lambda functions behind Amazon API Gateway APIs. A developer needs to automate the deployment of Lambda function code. The developer will deploy updated Lambda functions with AWS CodeDeploy. The deployment must minimize the exposure of potential errors to end users. When the application is in production, the application cannot experience downtime outside the specified maintenance window.

Which deployment configuration will meet these requirements with the LEAST deployment time?

**A:** Use the AWS CodeDeploy in-place deployment configuration for the Lambda functions. Shift all traffic immediately after deployment.

**B:** Use the AWS CodeDeploy linear deployment configuration to shift 10% of the traffic every minute.

**C:** Use the AWS CodeDeploy all-at-once deployment configuration to shift all traffic to the updated versions immediately.

**D:** Use the AWS CodeDeploy predefined canary deployment configuration to shift 10% of the traffic immediately and shift the remaining traffic after 5 minutes.



**Answer: D**

**Timestamp: 2023-08-04 13:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117334-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 494 discussion

A developer needs to build a workflow to handle messages that are sent to an Amazon Simple Queue Service (Amazon SQS) queue. When a message reaches the queue, the workflow must implement a delay before invoking an AWS Lambda function to process the message.

Which solution will meet this requirement in the MOST operationally efficient way?

**A:** Create an AWS Step Functions state machine to process the SQS queue. Use a Wait state to delay the Lambda function’s processing for the required number of seconds after message delivery to the SQS queue. Use Amazon EventBridge to invoke the state machine every 5 minutes.

**B:** Configure the Lambda function to poll the SQS queue. Update the Lambda code to republish each message with a custom attribute that contains a future time when the message should be fully processed. Update the Lambda code to fully process messages when the custom attribute’s future time has passed.

**C:** Set the DelaySeconds value of the SQS queue to be the number of seconds required to delay delivery of the messages. Add an event source mapping for the Lambda function. Specify the SQS queue as a source.

**D:** Set the Visibility Timeout value of the SQS queue to be the number of seconds required to delay delivery of the messages. Add an event source mapping for the Lambda function. Specify the SQS queue as a source.



**Answer: C**

**Timestamp: 2025-02-17 10:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156663-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 495 discussion

A company is building an application to accept data from customers. The data must be encrypted at rest and in transit.

The application uses an Amazon API Gateway API that resolves to AWS Lambda functions. The Lambda functions store the data in an Amazon Aurora MySQL DB cluster. The application worked properly during testing.

A developer configured an Amazon CloudFront distribution with field-level encryption that uses an AWS Key Management Service (AWS KMS) key. After the configuration of the distribution, the application behaved unexpectedly. All the data in the database changed from plaintext to ciphertext.

The developer must ensure that the data is not stored in the database as the ciphertext from the CloudFront field-level encryption.

Which solution will meet this requirement?

**A:** Change the CloudFront Viewer protocol policy from “HTTP and HTTPS” to “HTTPS only.”

**B:** Add a Lambda function that uses the KMS key to decrypt the data fields before saving the data to the database.

**C:** Enable encryption on the DB cluster by using the same KMS key that is used in CloudFront.

**D:** Request and deploy a new SSL certificate to use with the CloudFront distribution.



**Answer: B**

**Timestamp: 2025-02-17 10:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156664-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 496 discussion

A company offers a business-to-business software service that runs on dedicated infrastructure deployed in each customer’s AWS account. Before a feature release, the company needs to run integration tests on real AWS test infrastructure. The test infrastructure consists of Amazon EC2 instances and an Amazon RDS database.

A developer must set up a continuous delivery process that will provision the test infrastructure across the different AWS accounts. The developer then must run the integration tests.

Which solution will meet these requirements with the LEAST administrative effort?

**A:** Use AWS CodeDeploy with AWS CloudFormation StackSets to deploy the infrastructure. Use Amazon CodeGuru to run the tests.

**B:** Use AWS CodePipeline with AWS CloudFormation StackSets to deploy the infrastructure. Use AWS CodeBuild to run the tests.

**C:** Use AWS CodePipeline with AWS CloudFormation change sets to deploy the infrastructure. Use a CloudFormation custom resource to run the tests.

**D:** Use AWS Serverless Application Model (AWS SAM) templates with AWS CloudFormation change sets to deploy the infrastructure. Use AWS CodeDeploy to run the tests.



**Answer: B**

**Timestamp: 2024-12-27 22:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153523-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 497 discussion

A developer is creating an application that uses an AWS Lambda function to transform and load data from an Amazon S3 bucket. When the developer tests the application, the developer finds that some invocations of the Lambda function are slower than others.

The developer needs to update the Lambda function to have predictable invocation durations that run with low latency. Any initialization activities, such as loading libraries and instantiating clients, must run during allocation time rather than during actual function invocations.

Which combination of steps will meet these requirements? (Choose two.)

**A:** Create a schedule group in Amazon EventBridge Scheduler to invoke the Lambda function.

**B:** Configure provisioned concurrency for the Lambda function to have the necessary number of execution environments.

**C:** Use the $LATEST version of the Lambda function.

**D:** Configure reserved concurrency for the Lambda function to have the necessary number of execution environments.

**E:** Deploy changes, and publish a new version of the Lambda function.



**Answer: BE**

**Timestamp: 2025-02-17 10:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156665-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 498 discussion

A developer created an AWS Lambda function named ProcessMessages. The Lambda function is invoked asynchronously when a message is published to an Amazon Simple Notification Service (Amazon SNS) topic named InputTopic. The developer uses a second SNS topic named ErrorTopic to handle alerts of failures for other services.

The developer wants to receive notifications from the ErrorTopic SNS topic when the ProcessMessages Lambda function fails to process a message.

Which solution will meet this requirement?

**A:** Configure a subscription for the ErrorTopic SNS topic. Configure a filter policy for failures. Specify the ProcessMessages Lambda function as the endpoint.

**B:** Configure a failure destination for the ProcessMessages Lambda function. Specify the Amazon Resource Name (ARN) of the ErrorTopic SNS topic as the destination ARN.

**C:** Configure a trigger for the ProcessMessages Lambda function. Specify the ErrorTopic SNS topic as the trigger topic. Configure a filter policy on the topic for failures

**D:** Configure a delivery policy on the ErrorTopic SNS topic. Configure a filter policy for failures. Specify the Lambda function as the input endpoint.



**Answer: B**

**Timestamp: 2025-02-17 10:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156666-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 531 discussion

A company has an application that runs on Amazon EC2 instances. The application needs to use dynamic feature flags that will be shared with other applications. The application must poll on an interval for new feature flag values. The values must be cached when they are retrieved.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Store the feature flag values in AWS Secrets Manager. Configure an Amazon ElastiCache node to cache the values by using a lazy loading strategy in the application. Update the application to poll for the values on an interval from ElastiCache.

**B:** Store the feature flag values in an Amazon DynamoDB table. Configure DynamoDB Accelerator (DAX) to cache the values by using a lazy loading strategy in the application. Update the application to poll for the values on an interval from DynamoDB.

**C:** Store the feature flag values in AWS AppConfig. Configure AWS AppConfig Agent on the EC2 instances to poll for the values on an interval. Update the application to retrieve the values from the AppConfig Agent localhost endpoint.

**D:** Store the feature flag values in AWS Systems Manager Parameter Store. Configure the application to poll on an interval. Configure the application to use the AWS SDK to retrieve the values from Parameter Store and to store the values in memory.



**Answer: B**

**Timestamp: 2025-03-04 09:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157496-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 532 discussion

A team deploys an AWS CloudFormation template to update a stack that already included an Amazon DynamoDB table. However, before the deployment of the update, the team changed the name of the DynamoDB table on the template by mistake. The DeletionPolicy attribute for all resources has the default value.

What will be the result of this mistake?

**A:** CloudFormation will create a new table and will delete the existing table.

**B:** CloudFormation will create a new table and will keep the existing table.

**C:** CloudFormation will overwrite the existing table and will rename the existing table.

**D:** CloudFormation will keep the existing table and will not create a new table.



**Answer: A**

**Timestamp: 2025-02-17 10:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156682-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 533 discussion

A developer is deploying an application on an Amazon Elastic Container Service (Amazon ECS) cluster that uses AWS Fargate. The developer is using a Docker container with an Ubuntu image.

The developer needs to implement a solution to store application data that is available from multiple ECS tasks. The application data must remain accessible after the container is terminated.

Which solution will meet these requirements?

**A:** Attach an Amazon FSx for Windows File Server volume to the container definition.

**B:** Specify the DockerVolumeConfiguration parameter in the ECS task definition to attach a Docker volume.

**C:** Create an Amazon Elastic File System (Amazon EFS) file system. Specify the mountPoints attribute and the efsVolumeConfiguration attribute in the ECS task definition.

**D:** Create an Amazon Elastic Block Store (Amazon EBS) volume. Specify the mount point configuration in the ECS task definition.



**Answer: C**

**Timestamp: 2025-02-17 10:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156683-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 534 discussion

A developer is creating an AWS Lambda function that needs network access to private resources in a VPC.

Which solution will provide this access with the LEAST operational overhead?

**A:** Attach the Lambda function to the VPC through private subnets. Create a security group that allows network access to the private resources. Associate the security group with the Lambda function.

**B:** Configure the Lambda function to route traffic through a VPN connection. Create a security group that allows network access to the private resources. Associate the security group with the Lambda function.

**C:** Configure a VPC endpoint connection for the Lambda function. Set up the VPC endpoint to route traffic through a NAT gateway.

**D:** Configure an AWS PrivateLink endpoint for the private resources. Configure the Lambda function to reference the PrivateLink endpoint.



**Answer: A**

**Timestamp: 2025-02-17 10:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156684-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 535 discussion

A developer needs to automate deployments for a serverless, event-based workload. The developer needs to create standardized templates to define the infrastructure and to test the functionality of the workload locally before deployment

The developer already uses a pipeline in AWS CodePipeline. The developer needs to incorporate any other infrastructure changes into the existing pipeline.

Which solution will meet these requirements?

**A:** Create an AWS Serverless Application Model (AWS SAM) template. Configure the pipeline stages in CodePipeline to run the necessary AWS SAM CLI commands to deploy the serverless workload.

**B:** Create an AWS Step Functions workflow template based on the infrastructure by using the Amazon States Language. Start the Step Functions state machine from the existing pipeline.

**C:** Create an AWS CloudFormation template. Use the existing pipeline workflow to build a pipeline for AWS CloudFormation stacks.

**D:** Create an AWS Serverless Application Model (AWS SAM) template. Use an automated script to deploy the serverless workload by using the AWS SAM CLI deploy command.



**Answer: A**

**Timestamp: 2025-02-17 11:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156695-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 458 discussion

A company has implemented a pipeline in AWS CodePipeline. The company is using a single AWS account and does not use AWS Organizations. The company needs to test its AWS CloudFormation templates in its primary AWS Region and a disaster recovery Region.

Which solution will meet these requirements with the MOST operational efficiency?

**A:** In the CodePipeline pipeline, implement an AWS CodeDeploy action for each Region to deploy and test the CloudFormation templates. Update CodePipeline and AWS CodeBuild with appropriate permissions.

**B:** Configure CodePipeline to deploy and test the CloudFormation templates. Use CloudFormation StackSets to start deployment across both Regions.

**C:** Configure CodePipeline to invoke AWS CodeBuild to deploy and test the CloudFormation templates in each Region. Update CodeBuild and CloudFormation with appropriate permissions.

**D:** Use the Snyk action in CodePipeline to deploy and test the CloudFormation templates in each Region.



**Answer: B**

**Timestamp: 2024-11-05 13:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150781-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 459 discussion

A company has an Amazon API Gateway REST API that integrates with an AWS Lambda function. The API’s development stage references a development alias of the Lambda function named dev.

A developer needs make a production alias of the Lambda function named prod available through the API.

Which solution meets these requirements?

**A:** Create a new method on the API. Name the method production. Configure the method to include a stage variable that points to the prod Lambda function alias.

**B:** Create a new method on the API. Name the method production. Configure an integration request on the API’s development stage that points to the prod Lambda function alias.

**C:** Deploy the API to a new stage named production. Configure the stage to include a stage variable that points to the prod Lambda function alias.

**D:** Deploy the API to a new stage named production. Configure an integration request on the API’s production stage that points to the prod Lambda function alias.



**Answer: C**

**Timestamp: 2024-12-27 17:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/153505-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 46 discussion

A developer is working on a serverless application that needs to process any changes to an Amazon DynamoDB table with an AWS Lambda function.
How should the developer configure the Lambda function to detect changes to the DynamoDB table?

**A:** Create an Amazon Kinesis data stream, and attach it to the DynamoDB table. Create a trigger to connect the data stream to the Lambda function.

**B:** Create an Amazon EventBridge rule to invoke the Lambda function on a regular schedule. Conned to the DynamoDB table from the Lambda function to detect changes.

**C:** Enable DynamoDB Streams on the table. Create a trigger to connect the DynamoDB stream to the Lambda function.

**D:** Create an Amazon Kinesis Data Firehose delivery stream, and attach it to the DynamoDB table. Configure the delivery stream destination as the Lambda function.



**Answer: C**

**Timestamp: 2023-03-26 02:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103917-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 460 discussion

A developer is implementing a serverless application by using AWS CloudFormation to provision Amazon S3 web hosting. Amazon API Gateway, and AWS Lambda functions. The Lambda function source code is zipped and uploaded to an S3 bucket. The S3 object key of the zipped source code is specified in the Lambda resource in the CloudFormation template.

The developer notices that there are no changes in the Lambda function every time the CloudFormation stack is updated.

How can the developer resolve this issue?

**A:** Create a new Lambda function alias before updating the CloudFormation stack.

**B:** Change the S3 object key or the S3 version in the CloudFormation template before updating the CloudFormation stack.

**C:** Upload the zipped source code to another S3 bucket before updating the CioudFormation stack.

**D:** Associate a cade signing configuration with the Lambda function before updating the CloudFormation stack.



**Answer: B**

**Timestamp: 2024-12-12 18:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/152916-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 461 discussion

A developer published a change to a new version of an AWS Lambda function. To test the change, the developer must route 50% of the traffic to the new version and 60% of the traffic to the current version.

What is the MOST operationally efficient way to meet this requirement?

**A:** Create two Amazon Route 53 records that use a simple routing policy to route traffic to the different versions of the Lambda function. Create another Route 53 record that uses a weighted routing policy to route 50% of the traffic to each simple routing record. Test the Lambda function by using the weighted routing record.

**B:** Create an Amazon API Gateway API with a POST method that is integrated with the Lambda function. Add a stage variable that includes the version of the Lambda function. Add a canary release that will override the version variable 50% of the time. Deploy and test the Lambda function through the API Gateway stage.

**C:** Create a Lambda function alias. Set the weight to 50% for the current version and 50% for the new version. Set the event source mappings for the Lambda function to point to the alias.

**D:** Update the event source mappings for the Lambda function. In the mappings, set the weight to 50% for the current version and 50% for the new version.



**Answer: C**

**Timestamp: 2025-02-17 10:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156669-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 55 discussion

An application uses Lambda functions to extract metadata from files uploaded to an S3 bucket; the metadata is stored in Amazon DynamoDB. The application starts behaving unexpectedly, and the developer wants to examine the logs of the Lambda function code for errors.
Based on this system configuration, where would the developer find the logs?

**A:** Amazon S3

**B:** AWS CloudTrail

**C:** Amazon CloudWatch

**D:** Amazon DynamoDB



**Answer: C**

**Timestamp: 2023-03-26 06:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103931-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 550 discussion

A developer is building an application that stores sensitive user data. The application includes an Amazon CloudFront distribution and multiple AWS Lambda functions that handle user requests.

The user requests contain over 20 data fields. Each application transaction contains sensitive data that must be encrypted. Only specific parts of the application need to have the ability to decrypt the data.

Which solution will meet these requirements?

**A:** Associate the CloudFront distribution with a Lambda@Edge function. Configure the function to perform field-level asymmetric encryption by using a user-defined RSA public key that is stored in AWS Key Management Service (AWS KMS).

**B:** Integrate AWS WAF with CloudFront to protect the sensitive data. Use a Lambda function and self-managed keys to perform the encryption and decryption processes.

**C:** Configure the CloudFront distribution to use WebSockets by forwarding all viewer request headers to the origin. Create an asymmetric AWS KMS key. Configure the CloudFront distribution to use field-level encryption. Use the AWS KMS key.

**D:** Configure the cache behavior in the CloudFront distribution to require HTTPS for communication between viewers and CloudFront. Configure GoudFront to require users to access the files by using either signed URLs or signed cookies.



**Answer: D**

**Timestamp: 2025-03-04 14:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157510-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 551 discussion

An application includes an Amazon DynamoDB table that is named orders. The table has a primary partition key of id and a global secondary index (GSI) that is named an accountIndex. The GSI has a partition key of accountId and a sort key of orderDateTime.

A developer needs to create an AWS Lambda function to retrieve the orders that have an accountId of 100.

Which solution will meet this requirement by using the LEAST read capacity?

**A:** Define a DynamoDB API request for the GetItem action with the following parameters:

**B:** Define a DynamoDB API request for the BatchGetItem action with the following parameters:

**C:** Define a DynamoDB API request for the Scan action with the following parameters:

**D:** Define a DynamoDB API request for the Query action with the following parameters:



**Answer: D**

**Timestamp: 2025-02-06 08:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156015-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 552 discussion

A company stores data in an Amazon S3 bucket. The data is updated multiple times every day from an application that runs on a server in the company’s on-premises data center.

The company enables S3 Versioning on the S3 bucket. After some time, the company observes multiple versions of the same objects in the S3 bucket.

The company needs the S3 bucket to keep the current version of each object and the version immediately previous to the current version.

Which solution will meet these requirements?

**A:** Configure an S3 bucket policy to retain one newer noncurrent version of the objects.

**B:** Configure an S3 Lifecycle rule to retain one newer noncurrent version of the objects.

**C:** Enable S3 Object Lock. Configure an S3 Object Lock policy to retain one newer noncurrent version of the objects.

**D:** Suspend S3 Versioning. Modify the application code to check the number of object versions before updating the objects.



**Answer: B**

**Timestamp: 2025-03-03 08:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157448-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 553 discussion

A company is creating a new feature for existing software. Before the company fully releases a new version of the software, the company wants to test the feature.

The company needs to gather feedback about the feature from a small group of users while the current software version remains deployed. If the testing validates the feature, the company needs to deploy the new software version to all other users at the same time.

Which deployment strategy will meet these requirements?

**A:** All-at-once deployment

**B:** Canary deployment

**C:** In-place deployment

**D:** Linear deployment



**Answer: B**

**Timestamp: 2025-03-03 08:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157447-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 545 discussion

A company is using the AWS Serverless Application Model (AWS SAM) to develop a social media application. A developer needs a quick way to test AWS Lambda functions locally by using test event payloads. The developer needs the structure of these test event payloads to match the actual events that AWS services create.

Which solution will meet these requirements with the LEAST development effort?

**A:** Create shareable test Lambda events. Use these test Lambda events for local testing.

**B:** Store manually created test event payloads locally. Use the sam local invoke command with the file path to the payloads.

**C:** Store manually created test event payloads in an Amazon S3 bucket. Use the sam local invoke command with the S3 path to the payloads.

**D:** Use the sam local generate-event command to create test payloads for local testing.



**Answer: D**

**Timestamp: 2025-02-17 11:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156701-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 546 discussion

A developer is building the authentication mechanism for a new mobile app. Users need to be able to sign up, sign in, and access secured backend AWS resources.

Which solution will meet these requirements?

**A:** Use AWS Identity and Access Management Access Analyzer to generate IAM policies. Create an IAM role. Attach the policies to the role. Integrate the IAM role with an identity provider that the mobile app uses.

**B:** Create an IAM policy that grants access to the backend resources. Create an IAM role. Attach the policy to the role. Create an Amazon API Gateway endpoint. Attach the role to the endpoint. Integrate the endpoint with the mobile app.

**C:** Create an Amazon Cognito identity pool. Configure permissions by choosing a default IAM role for authenticated users or guest users in the identity pool. Associate the identity pool with an identity provider. Integrate the identity pool with the mobile app.

**D:** Create an Amazon Cognito user pool. Configure the security requirements by choosing a password policy, multi-factor authentication (MFA) requirements, and user account recovery options. Create an app client. Integrate the app client with the mobile app.



**Answer: D**

**Timestamp: 2025-01-14 18:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/154507-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 547 discussion

A developer is designing an event-driven architecture. An AWS Lambda function that processes data needs to push processed data to a subset of four consumer Lambda functions. The data must be routed based on the value of one field in the data.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create an Amazon Simple Queue Service (Amazon SQS) queue and event source mapping for each consumer Lambda function. Add message routing logic to the data-processing Lambda function.

**B:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the four consumer Lambda functions to the topic. Add message filtering logic to each consumer Lambda function. Subscribe the data-processing Lambda function to the SNS topic.

**C:** Create a separate Amazon Simple Notification Service (Amazon SNS) topic and subscription for each consumer Lambda function. Add message routing logic to the data-processing Lambda function to publish to the appropriate topic.

**D:** Create a single Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the four consumer Lambda functions to the topic. Add SNS subscription filter policies to each subscription. Configure the data-processing Lambda function to publish to the topic.



**Answer: D**

**Timestamp: 2025-03-04 10:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157499-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 548 discussion

A developer is creating a new application that will give users the ability to upload documents to Amazon S3. The contents of the documents must not be accessible to any third party.

Which type of encryption will meet this requirement?

**A:** Client-side encryption by using the S3 Encryption Client with a Raw RSA wrapping key that is stored on the user’s device

**B:** Server-side encryption with S3 managed keys (SSE-S3)

**C:** Server-side encryption with AWS KMS keys (SSE-KMS)

**D:** Dual-layer server-side encryption with AWS KMS keys (DSSE-KMS)



**Answer: C**

**Timestamp: 2025-01-13 18:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/154460-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 549 discussion

A developer is building an application that consists of many AWS Lambda functions. The Lambda functions connect to a single Amazon RDS database.

The developer needs to implement a solution to store the database credentials securely. When the credentials are updated, the Lambda functions must be able to use the new credentials without requiring a code update or a configuration update.

Which solution will meet these requirements?

**A:** Store the credentials as a secret in AWS Secrets Manager. Access the secret at runtime from within the Lambda functions.

**B:** Store the credentials as a secret in AWS Secrets Manager. Access the credentials in environment variables by using the containerDefinitions and valueFrom elements in reference to the secret value.

**C:** Store the credentials as a SecureString parameter in AWS Systems Manager Parameter Store. Add a trigger to pass the credentials to the Lambda functions when the Lambda functions run.

**D:** Store the credentials as a SecureString parameter in AWS Systems Manager Parameter Store. Add a reference to the parameter in an environment variable in the Lambda functions.



**Answer: D**

**Timestamp: 2025-03-04 02:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/157490-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 216 discussion

A developer is working on an AWS Lambda function that accesses Amazon DynamoDB. The Lambda function must retrieve an item and update some of its attributes, or create the item if it does not exist. The Lambda function has access to the primary key.

Which IAM permissions should the developer request for the Lambda function to achieve this functionality?

**A:** dynamodb:DeleleItem
dynamodb:GetItem
dynamodb:PutItem

**B:** dynamodb:UpdateItem
dynamodb:GetItem
dynamodb:DescribeTable

**C:** dynamodb:GetRecords
dynamodb:PutItem
dynamodb:UpdateTable

**D:** dynamodb:UpdateItem
dynamodb:GetItem
dynamodb:PutItem



**Answer: D**

**Timestamp: 2023-10-28 08:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124769-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 217 discussion

A developer has built a market application that stores pricing data in Amazon DynamoDB with Amazon ElastiCache in front. The prices of items in the market change frequently. Sellers have begun complaining that, after they update the price of an item, the price does not actually change in the product listing.

What could be causing this issue?

**A:** The cache is not being invalidated when the price of the item is changed.

**B:** The price of the item is being retrieved using a write-through ElastiCache cluster.

**C:** The DynamoDB table was provisioned with insufficient read capacity.

**D:** The DynamoDB table was provisioned with insufficient write capacity.



**Answer: A**

**Timestamp: 2023-10-28 08:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124781-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 218 discussion

A company requires that all applications running on Amazon EC2 use IAM roles to gain access to AWS services. A developer is modifying an application that currently relies on IAM user access keys stored in environment variables to access Amazon DynamoDB tables using boto, the AWS SDK for Python.

The developer associated a role with the same permissions as the IAM user to the EC2 instance, then deleted the IAM user. When the application was restarted, the AWS AccessDeniedException messages started appearing in the application logs. The developer was able to use their personal account on the server to run DynamoDB API commands using the AWS CLI.

What is the MOST likely cause of the exception?

**A:** IAM policies might take a few minutes to propagate to resources.

**B:** Disabled environment variable credentials are still being used by the application.

**C:** The AWS SDK does not support credentials obtained using an instance role.

**D:** The instance’s security group does not allow access to http://169.254.169.254.



**Answer: B**

**Timestamp: 2023-10-28 08:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124770-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 219 discussion

A company has an existing application that has hardcoded database credentials. A developer needs to modify the existing application. The application is deployed in two AWS Regions with an active-passive failover configuration to meet company’s disaster recovery strategy.

The developer needs a solution to store the credentials outside the code. The solution must comply with the company’s disaster recovery strategy.

Which solution will meet these requirements in the MOST secure way?

**A:** Store the credentials in AWS Secrets Manager in the primary Region. Enable secret replication to the secondary Region. Update the application to use the Amazon Resource Name (ARN) based on the Region.

**B:** Store credentials in AWS Systems Manager Parameter Store in the primary Region. Enable parameter replication to the secondary Region. Update the application to use the Amazon Resource Name (ARN) based on the Region.

**C:** Store credentials in a config file. Upload the config file to an S3 bucket in the primary Region. Enable Cross-Region Replication (CRR) to an S3 bucket in the secondary region. Update the application to access the config file from the S3 bucket, based on the Region.

**D:** Store credentials in a config file. Upload the config file to an Amazon Elastic File System (Amazon EFS) file system. Update the application to use the Amazon EFS file system Regional endpoints to access the config file in the primary and secondary Regions.



**Answer: A**

**Timestamp: 2023-10-28 08:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124771-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 22 discussion

A developer is creating an application that will store personal health information (PHI). The PHI needs to be encrypted at all times. An encrypted Amazon RDS for MySQL DB instance is storing the data. The developer wants to increase the performance of the application by caching frequently accessed data while adding the ability to sort or rank the cached datasets.
Which solution will meet these requirements?

**A:** Create an Amazon ElastiCache for Redis instance. Enable encryption of data in transit and at rest. Store frequently accessed data in the cache.

**B:** Create an Amazon ElastiCache for Memcached instance. Enable encryption of data in transit and at rest. Store frequently accessed data in the cache.

**C:** Create an Amazon RDS for MySQL read replica. Connect to the read replica by using SSL. Configure the read replica to store frequently accessed data.

**D:** Create an Amazon DynamoDB table and a DynamoDB Accelerator (DAX) cluster for the table. Store frequently accessed data in the DynamoDB table.



**Answer: A**

**Timestamp: 2023-03-23 07:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103644-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 356 discussion

A developer is implementing an AWS Lambda function that will be invoked when an object is uploaded to Amazon S3. The developer wants to test the Lambda function in a local development machine before publishing the function to a production AWS account.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Upload an object to Amazon S3 by using the aws s3api put-object CLI command. Wait for the local Lambda invocation from the S3 event.

**B:** Create a sample JSON text file for a put object S3 event. Invoke the Lambda function locally. Use the aws lambda invoke CLI command with the JSON file and Lambda function name as arguments.

**C:** Use the sam local start-lambda CLI command to start Lambda. Use the sam local generate-event s3 put CLI command to create the Lambda test JSON file. Use the sam local invoke CLI command with the JSON file as the argument to invoke the Lambda function.

**D:** Create a JSON string for the put object S3 event. In the AWS Management Console, use the JSON string to create a test event for the local Lambda function. Perform the test.



**Answer: C**

**Timestamp: 2024-04-26 22:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/139677-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 357 discussion

A developer is publishing critical log data to a log group in Amazon CloudWatch Logs. The log group was created 2 months ago. The developer must encrypt the log data by using an AWS Key Management Service (AWS KMS) key so that future data can be encrypted to comply with the company's security policy.

Which solution will meet this requirement with the LEAST effort?

**A:** Use the AWS Encryption SDK for encryption and decryption of the data before writing to the log group.

**B:** Use the AWS KMS console to associate the KMS key with the log group.

**C:** Use the AWS CLI aws logs create-log-group command, and specify the key Amazon Resource Name (ARN).

**D:** Use the AWS CLI aws logs associate-kms-key command, and specify the key Amazon Resource Name (ARN).



**Answer: D**

**Timestamp: 2024-03-23 05:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/136975-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 358 discussion

A developer is working on an app for a company that uses an Amazon DynamoDB table named Orders to store customer orders. The table uses OrderID as the partition key and there is no sort key. The table contains more than 100,000 records. The developer needs to add a functionality that will retrieve all Orders records that contain an OrderSource attribute with the MobileApp value.

Which solution will improve the user experience in the MOST efficient way?

**A:** Perform a Scan operation on the Orders table. Provide a QueryFilter condition to filter to only the items where the OrderSource attribute is equal to the MobileApp value.

**B:** Create a local secondary index (LSI) with OrderSource as the partition key. Perform a Query operation by using MobileApp as the key.

**C:** Create a global secondary index (GSI) with OrderSource as the sort key. Perform a Query operation by using MobileApp as the key.

**D:** Create a global secondary index (GSI) with OrderSource as the partition key. Perform a Query operation by using MobileApp as the key.



**Answer: D**

**Timestamp: 2024-07-01 13:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143129-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 359 discussion

A company has an application that uses an AWS Lambda function to process data. A developer must implement encryption in transit for all sensitive configuration data, such as API keys, that is stored in the application. The developer creates an AWS Key Management Service (AWS KMS) customer managed key.

What should the developer do next to meet the encryption requirement?

**A:** Create parameters of the String type in AWS Systems Manager Parameter Store. For each parameter, specify the KMS key ID to encrypt the parameter in transit. Reference the GetParameter API call in the Lambda environment variables.

**B:** Create secrets in AWS Secrets Manager by using the customer managed KMS key. Create a new Lambda function and set up a Lambda layer. Configure the Lambda layer to retrieve the values from Secrets Manager.

**C:** Create objects in Amazon S3 for each sensitive data field. Specify the customer managed KMS key to encrypt the object. Configure the Lambda function to retrieve the objects from Amazon S3 during data processing.

**D:** Create encrypted Lambda environment variables. Specify the customer managed KMS key to encrypt the variables. Enable encryption helpers for encryption in transit. Grant permission to the Lambda function's execution role to access the KMS key.



**Answer: D**

**Timestamp: 2024-06-30 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143121-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 36 discussion

A development team maintains a web application by using a single AWS CloudFormation template. The template defines web servers and an Amazon RDS database. The team uses the Cloud Formation template to deploy the Cloud Formation stack to different environments.
During a recent application deployment, a developer caused the primary development database to be dropped and recreated. The result of this incident was a loss of data. The team needs to avoid accidental database deletion in the future.
Which solutions will meet these requirements? (Choose two.)

**A:** Add a CloudFormation Deletion Policy attribute with the Retain value to the database resource.

**B:** Update the CloudFormation stack policy to prevent updates to the database.

**C:** Modify the database to use a Multi-AZ deployment.

**D:** Create a CloudFormation stack set for the web application and database deployments.

**E:** Add a Cloud Formation DeletionPolicy attribute with the Retain value to the stack.



**Answer: AB**

**Timestamp: 2023-03-21 22:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103521-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 76 discussion

A developer deployed an application to an Amazon EC2 instance. The application needs to know the public IPv4 address of the instance.

How can the application find this information?

**A:** Query the instance metadata from http://169.254.169.254/latest/meta-data/.

**B:** Query the instance user data from http://169.254.169.254/latest/user-data/.

**C:** Query the Amazon Machine Image (AMI) information from http://169.254.169.254/latest/meta-data/ami/.

**D:** Check the hosts file of the operating system.



**Answer: A**

**Timestamp: 2023-05-08 10:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108728-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 77 discussion

An application under development is required to store hundreds of video files. The data must be encrypted within the application prior to storage, with a unique key for each video file.

How should the developer code the application?

**A:** Use the KMS Encrypt API to encrypt the data. Store the encrypted data key and data.

**B:** Use a cryptography library to generate an encryption key for the application. Use the encryption key to encrypt the data. Store the encrypted data.

**C:** Use the KMS GenerateDataKey API to get a data key. Encrypt the data with the data key. Store the encrypted data key and data.

**D:** Upload the data to an S3 bucket using server side-encryption with an AWS KMS key.



**Answer: C**

**Timestamp: 2023-04-25 16:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107443-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 78 discussion

A company is planning to deploy an application on AWS behind an Elastic Load Balancer. The application uses an HTTP/HTTPS listener and must access the client IP addresses.

Which load-balancing solution meets these requirements?

**A:** Use an Application Load Balancer and the X-Forwarded-For headers.

**B:** Use a Network Load Balancer (NLB). Enable proxy protocol support on the NLB and the target application.

**C:** Use an Application Load Balancer. Register the targets by the instance ID.

**D:** Use a Network Load Balancer and the X-Forwarded-For headers.



**Answer: A**

**Timestamp: 2023-04-25 16:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107444-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 79 discussion

A developer wants to debug an application by searching and filtering log data. The application logs are stored in Amazon CloudWatch Logs. The developer creates a new metric filter to count exceptions in the application logs. However, no results are returned from the logs.

What is the reason that no filtered results are being returned?

**A:** A setup of the Amazon CloudWatch interface VPC endpoint is required for filtering the CloudWatch Logs in the VPC.

**B:** CloudWatch Logs only publishes metric data for events that happen after the filter is created.

**C:** The log group for CloudWatch Logs should be first streamed to Amazon OpenSearch Service before metric filtering returns the results.

**D:** Metric data points for logs groups can be filtered only after they are exported to an Amazon S3 bucket.



**Answer: B**

**Timestamp: 2023-05-08 12:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/108734-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 8 discussion

A company is running a custom application on a set of on-premises Linux servers that are accessed using Amazon API Gateway. AWS X-Ray tracing has been enabled on the API test stage.
How can a developer enable X-Ray tracing on the on-premises servers with the LEAST amount of configuration?

**A:** Install and run the X-Ray SDK on the on-premises servers to capture and relay the data to the X-Ray service.

**B:** Install and run the X-Ray daemon on the on-premises servers to capture and relay the data to the X-Ray service.

**C:** Capture incoming requests on-premises and configure an AWS Lambda function to pull, process, and relay relevant data to X-Ray using the PutTraceSegments API call.

**D:** Capture incoming requests on-premises and configure an AWS Lambda function to pull, process, and relay relevant data to X-Ray using the PutTelemetryRecords API call.



**Answer: B**

**Timestamp: 2023-03-16 10:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102786-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 266 discussion

A company is building a compute-intensive application that will run on a fleet of Amazon EC2 instances. The application uses attached Amazon Elastic Block Store (Amazon EBS) volumes for storing data. The Amazon EBS volumes will be created at time of initial deployment. The application will process sensitive information. All of the data must be encrypted. The solution should not impact the application's performance.

Which solution will meet these requirements?

**A:** Configure the fleet of EC2 instances to use encrypted EBS volumes to store data.

**B:** Configure the application to write all data to an encrypted Amazon S3 bucket.

**C:** Configure a custom encryption algorithm for the application that will encrypt and decrypt all data.

**D:** Configure an Amazon Machine Image (AMI) that has an encrypted root volume and store the data to ephemeral disks.



**Answer: A**

**Timestamp: 2024-02-21 04:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134266-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 267 discussion

A developer is updating the production version of an AWS Lambda function to fix a defect. The developer has tested the updated code in a test environment. The developer wants to slowly roll out the updates to a small subset of production users before rolling out the changes to all users. Only 10% of the users should be initially exposed to the new code in production.

Which solution will meet these requirements?

**A:** Update the Lambda code and create a new version of the Lambda function. Create a Lambda function trigger. Configure the traffic weights in the trigger between the two Lambda function versions. Send 90% of the traffic to the production version, and send 10% of the traffic to the new version.

**B:** Create a new Lambda function that uses the updated code. Create a Lambda alias for the production Lambda function. Configure the Lambda alias to send 90% of the traffic to the production Lambda function, and send 10% of the traffic to the test Lambda function.

**C:** Update the Lambda code and create a new version of the Lambda function. Create a Lambda proxy integration. Configure the Lambda proxy to split traffic between the two Lambda function versions. Send 90% of the traffic to the production version, and send 10% of the traffic to the new version.

**D:** Update the Lambda code and create a new version of the Lambda function. Create a Lambda function alias. Configure the traffic weights in the Lambda alias between the two Lambda function versions. Send 90% of the traffic to the production version, and send 10% of the traffic to the new version.



**Answer: D**

**Timestamp: 2024-02-21 04:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134267-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 268 discussion

A developer is creating an AWS Lambda function that consumes messages from an Amazon Simple Queue Service (Amazon SQS) standard queue. The developer notices that the Lambda function processes some messages multiple times.

How should developer resolve this issue MOST cost-effectively?

**A:** Change the Amazon SQS standard queue to an Amazon SQS FIFO queue by using the Amazon SQS message deduplication ID.

**B:** Set up a dead-letter queue.

**C:** Set the maximum concurrency limit of the AWS Lambda function to 1.

**D:** Change the message processing to use Amazon Kinesis Data Streams instead of Amazon SQS.



**Answer: A**

**Timestamp: 2024-02-21 04:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134268-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 269 discussion

A developer is optimizing an AWS Lambda function and wants to test the changes in production on a small percentage of all traffic. The Lambda function serves requests to a RE ST API in Amazon API Gateway. The developer needs to deploy their changes and perform a test in production without changing the API Gateway URL.

Which solution will meet these requirements?

**A:** Define a function version for the currently deployed production Lambda function. Update the API Gateway endpoint to reference the new Lambda function version. Upload and publish the optimized Lambda function code. On the production API Gateway stage, define a canary release and set the percentage of traffic to direct to the canary release. Update the API Gateway endpoint to use the $LATEST version of the Lambda function. Publish the API to the canary stage.

**B:** Define a function version for the currently deployed production Lambda function. Update the API Gateway endpoint to reference the new Lambda function version. Upload and publish the optimized Lambda function code. Update the API Gateway endpoint to use the $LATEST version of the Lambda function. Deploy a new API Gateway stage.

**C:** Define an alias on the $LATEST version of the Lambda function. Update the API Gateway endpoint to reference the new Lambda function alias. Upload and publish the optimized Lambda function code. On the production API Gateway stage, define a canary release and set the percentage of traffic to direct to the canary release. Update the API Gateway endpoint to use the $LATEST version of the Lambda function. Publish to the canary stage.

**D:** Define a function version for the currently deployed production Lambda function. Update the API Gateway endpoint to reference the new Lambda function version. Upload and publish the optimized Lambda function code. Update the API Gateway endpoint to use the $LATEST version of the Lambda function. Deploy the API to the production API Gateway stage.



**Answer: C**

**Timestamp: 2024-02-21 04:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134269-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 27 discussion

A developer wants to expand an application to run in multiple AWS Regions. The developer wants to copy Amazon Machine Images (AMIs) with the latest changes and create a new application stack in the destination Region. According to company requirements, all AMIs must be encrypted in all Regions. However, not all the AMIs that the company uses are encrypted.
How can the developer expand the application to run in the destination Region while meeting the encryption requirement?

**A:** Create new AMIs, and specify encryption parameters. Copy the encrypted AMIs to the destination Region. Delete the unencrypted AMIs.

**B:** Use AWS Key Management Service (AWS KMS) to enable encryption on the unencrypted AMIs. Copy the encrypted AMIs to the destination Region.

**C:** Use AWS Certificate Manager (ACM) to enable encryption on the unencrypted AMIs. Copy the encrypted AMIs to the destination Region.

**D:** Copy the unencrypted AMIs to the destination Region. Enable encryption by default in the destination Region.



**Answer: A**

**Timestamp: 2023-03-17 09:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102901-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 144 discussion

A company has an Amazon S3 bucket containing premier content that it intends to make available to only paid subscribers of its website. The S3 bucket currently has default permissions of all objects being private to prevent inadvertent exposure of the premier content to non-paying website visitors.

How can the company limit the ability to download a premier content file in the S3 bucket to paid subscribers only?

**A:** Apply a bucket policy that allows anonymous users to download the content from the S3 bucket.

**B:** Generate a pre-signed object URL for the premier content file when a paid subscriber requests a download.

**C:** Add a bucket policy that requires multi-factor authentication for requests to access the S3 bucket objects.

**D:** Enable server-side encryption on the S3 bucket for data protection against the non-paying website visitors.



**Answer: B**

**Timestamp: 2023-10-06 01:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122562-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 145 discussion

A developer is creating an AWS Lambda function that searches for items from an Amazon DynamoDB table that contains customer contact information. The DynamoDB table items have the customer’s email_address as the partition key and additional properties such as customer_type, name and job_title.

The Lambda function runs whenever a user types a new character into the customer_type text input. The developer wants the search to return partial matches of all the email_address property of a particular customer_type. The developer does not want to recreate the DynamoDB table.

What should the developer do to meet these requirements?

**A:** Add a global secondary index (GSI) to the DynamoDB table with customer_type as the partition key and email_address as the sort key. Perform a query operation on the GSI by using the begins_with key condition expression with the email_address property.

**B:** Add a global secondary index (GSI) to the DynamoDB table with email_address as the partition key and customer_type as the sort key. Perform a query operation on the GSI by using the begins_with key condition expression with the email_address property.

**C:** Add a local secondary index (LSI) to the DynamoDB table with customer_type as the partition key and email_address as the sort key. Perform a query operation on the LSI by using the begins_with key condition expression with the email_address property.

**D:** Add a local secondary index (LSI) to the DynamoDB table with job_title as the partition key and email_address as the sort key. Perform a query operation on the LSI by using the begins_with key condition expression with the email_address property.



**Answer: A**

**Timestamp: 2023-10-06 01:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122563-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 146 discussion

A developer is building an application that uses AWS API Gateway APIs, AWS Lambda functions, and AWS DynamoDB tables. The developer uses the AWS Serverless Application Model (AWS SAM) to build and run serverless applications on AWS. Each time the developer pushes changes for only to the Lambda functions, all the artifacts in the application are rebuilt.

The developer wants to implement AWS SAM Accelerate by running a command to only redeploy the Lambda functions that have changed.

Which command will meet these requirements?

**A:** sam deploy --force-upload

**B:** sam deploy --no-execute-changeset

**C:** sam package

**D:** sam sync --watch



**Answer: D**

**Timestamp: 2023-10-06 01:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122564-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 147 discussion

A developer is building an application that gives users the ability to view bank accounts from multiple sources in a single dashboard. The developer has automated the process to retrieve API credentials for these sources. The process invokes an AWS Lambda function that is associated with an AWS CloudFormation custom resource.

The developer wants a solution that will store the API credentials with minimal operational overhead.

Which solution will meet these requirements in the MOST secure way?

**A:** Add an AWS Secrets Manager GenerateSecretString resource to the CloudFormation template. Set the value to reference new credentials for the CloudFormation resource.

**B:** Use the AWS SDK ssm:PutParameter operation in the Lambda function from the existing custom resource to store the credentials as a parameter. Set the parameter value to reference the new credentials. Set the parameter type to SecureString.

**C:** Add an AWS Systems Manager Parameter Store resource to the CloudFormation template. Set the CloudFormation resource value to reference the new credentials. Set the resource NoEcho attribute to true.

**D:** Use the AWS SDK ssm:PutParameter operation in the Lambda function from the existing custom resource to store the credentials as a parameter. Set the parameter value to reference the new credentials. Set the parameter NoEcho attribute to true.



**Answer: B**

**Timestamp: 2023-10-06 01:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122565-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 148 discussion

A developer is trying to get data from an Amazon DynamoDB table called demoman-table. The developer configured the AWS CLI to use a specific IAM user’s credentials and ran the following command:

aws dynamodb get-item --table-name demoman-table --key '{"id": {"N":"1993"}}'

The command returned errors and no rows were returned.

What is the MOST likely cause of these issues?

**A:** The command is incorrect; it should be rewritten to use put-item with a string argument.

**B:** The developer needs to log a ticket with AWS Support to enable access to the demoman-table.

**C:** Amazon DynamoDB cannot be accessed from the AWS CLI and needs to be called via the REST API.

**D:** The IAM user needs an associated policy with read access to demoman-table.



**Answer: D**

**Timestamp: 2023-10-06 01:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/122566-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 71 discussion

A developer is working on an existing application that uses Amazon DynamoDB as its data store. The DynamoDB table has the following attributes: partNumber (partition key), vendor (sort key), description, productFamily, and productType. When the developer analyzes the usage patterns, the developer notices that there are application modules that frequently look for a list of products based on the productFamily and productType attributes.

The developer wants to make changes to the application to improve performance of the query operations.

Which solution will meet these requirements?

**A:** Create a global secondary index (GSI) with productFamily as the partition key and productType as the sort key.

**B:** Create a local secondary index (LSI) with productFamily as the partition key and productType as the sort key.

**C:** Recreate the table. Add partNumber as the partition key and vendor as the sort key. During table creation, add a local secondary index (LSI) with productFamily as the partition key and productType as the sort key.

**D:** Update the queries to use Scan operations with productFamily as the partition key and productType as the sort key.



**Answer: A**

**Timestamp: 2023-04-17 16:19:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106490-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 72 discussion

A developer creates a VPC named VPC-A that has public and private subnets. The developer also creates an Amazon RDS database inside the private subnet of VPC-A. To perform some queries, the developer creates an AWS Lambda function in the default VPC. The Lambda function has code to access the RDS database. When the Lambda function runs, an error message indicates that the function cannot connect to the RDS database.

How can the developer solve this problem?

**A:** Modify the RDS security group. Add a rule to allow traffic from all the ports from the VPC CIDR block.

**B:** Redeploy the Lambda function in the same subnet as the RDS instance. Ensure that the RDS security group allows traffic from the Lambda function.

**C:** Create a security group for the Lambda function. Add a new rule in the RDS security group to allow traffic from the new Lambda security group.

**D:** Create an IAM role. Attach a policy that allows access to the RDS database. Attach the role to the Lambda function.



**Answer: B**

**Timestamp: 2023-04-17 16:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106491-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 73 discussion

A company runs an application on AWS. The company deployed the application on Amazon EC2 instances. The application stores data on Amazon Aurora.

The application recently logged multiple application-specific custom DECRYP_ERROR errors to Amazon CloudWatch logs. The company did not detect the issue until the automated tests that run every 30 minutes failed. A developer must implement a solution that will monitor for the custom errors and alert a development team in real time when these errors occur in the production environment.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Configure the application to create a custom metric and to push the metric to CloudWatch. Create an AWS CloudTrail alarm. Configure the CloudTrail alarm to use an Amazon Simple Notification Service (Amazon SNS) topic to send notifications.

**B:** Create an AWS Lambda function to run every 5 minutes to scan the CloudWatch logs for the keyword DECRYP_ERROR. Configure the Lambda function to use Amazon Simple Notification Service (Amazon SNS) to send a notification.

**C:** Use Amazon CloudWatch Logs to create a metric filter that has a filter pattern for DECRYP_ERROR. Create a CloudWatch alarm on this metric for a threshold >=1. Configure the alarm to send Amazon Simple Notification Service (Amazon SNS) notifications.

**D:** Install the CloudWatch unified agent on the EC2 instance. Configure the application to generate a metric for the keyword DECRYP_ERROR errors. Configure the agent to send Amazon Simple Notification Service (Amazon SNS) notifications.



**Answer: C**

**Timestamp: 2023-04-19 13:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106708-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 74 discussion

A developer created an AWS Lambda function that accesses resources in a VPC. The Lambda function polls an Amazon Simple Queue Service (Amazon SQS) queue for new messages through a VPC endpoint. Then the function calculates a rolling average of the numeric values that are contained in the messages. After initial tests of the Lambda function, the developer found that the value of the rolling average that the function returned was not accurate.

How can the developer ensure that the function calculates an accurate rolling average?

**A:** Set the function's reserved concurrency to 1. Calculate the rolling average in the function. Store the calculated rolling average in Amazon ElastiCache.

**B:** Modify the function to store the values in Amazon ElastiCache. When the function initializes, use the previous values from the cache to calculate the rolling average.

**C:** Set the function's provisioned concurrency to 1. Calculate the rolling average in the function. Store the calculated rolling average in Amazon ElastiCache.

**D:** Modify the function to store the values in the function's layers. When the function initializes, use the previously stored values to calculate the rolling average.



**Answer: A**

**Timestamp: 2023-04-19 13:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106711-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 75 discussion

A developer is writing unit tests for a new application that will be deployed on AWS. The developer wants to validate all pull requests with unit tests and merge the code with the main branch only when all tests pass.

The developer stores the code in AWS CodeCommit and sets up AWS CodeBuild to run the unit tests. The developer creates an AWS Lambda function to start the CodeBuild task. The developer needs to identify the CodeCommit events in an Amazon EventBridge event that can invoke the Lambda function when a pull request is created or updated.

Which CodeCommit event will meet these requirements?

**A:** 

**B:** 

**C:** 

**D:** 



**Answer: C**

**Timestamp: 2023-04-19 13:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106717-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 23 discussion

A company has a multi-node Windows legacy application that runs on premises. The application uses a network shared folder as a centralized configuration repository to store configuration files in .xml format. The company is migrating the application to Amazon EC2 instances. As part of the migration to AWS, a developer must identify a solution that provides high availability for the repository.
Which solution will meet this requirement MOST cost-effectively?

**A:** Mount an Amazon Elastic Block Store (Amazon EBS) volume onto one of the EC2 instances. Deploy a file system on the EBS volume. Use the host operating system to share a folder. Update the application code to read and write configuration files from the shared folder.

**B:** Deploy a micro EC2 instance with an instance store volume. Use the host operating system to share a folder. Update the application code to read and write configuration files from the shared folder.

**C:** Create an Amazon S3 bucket to host the repository. Migrate the existing .xml files to the S3 bucket. Update the application code to use the AWS SDK to read and write configuration files from Amazon S3.

**D:** Create an Amazon S3 bucket to host the repository. Migrate the existing .xml files to the S3 bucket. Mount the S3 bucket to the EC2 instances as a local volume. Update the application code to read and write configuration files from the disk.



**Answer: C**

**Timestamp: 2023-03-17 09:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102900-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 230 discussion

A developer registered an AWS Lambda function as a target for an Application Load Balancer (ALB) using a CLI command. However, the Lambda function is not being invoked when the client sends requests through the ALB.

Why is the Lambda function not being invoked?

**A:** A Lambda function cannot be registered as a target for an ALB.

**B:** A Lambda function can be registered with an ALB using AWS Management Console only.

**C:** The permissions to invoke the Lambda function are missing.

**D:** Cross-zone is not enabled on the ALB.



**Answer: C**

**Timestamp: 2023-10-28 14:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124818-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 231 discussion

A developer is creating an AWS Lambda function that will connect to an Amazon RDS for MySQL instance. The developer wants to store the database credentials. The database credentials need to be encrypted and the database password needs to be automatically rotated.

Which solution will meet these requirements?

**A:** Store the database credentials as environment variables for the Lambda function. Set the environment variables to rotate automatically.

**B:** Store the database credentials in AWS Secrets Manager. Set up managed rotation on the database credentials.

**C:** Store the database credentials in AWS Systems Manager Parameter Store as secure string parameters. Set up managed rotation on the parameters.

**D:** Store the database credentials in the X-Amz-Security-Token parameter. Set up managed rotation on the parameter.



**Answer: B**

**Timestamp: 2023-10-28 14:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124819-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 232 discussion

A developer wants to reduce risk when deploying a new version of an existing AWS Lambda function. To test the Lambda function, the developer needs to split the traffic between the existing version and the new version of the Lambda function.

Which solution will meet these requirements?

**A:** Configure a weighted routing policy in Amazon Route 53. Associate the versions of the Lambda function with the weighted routing policy.

**B:** Create a function alias. Configure the alias to split the traffic between the two versions of the Lambda function.

**C:** Create an Application Load Balancer (ALB) that uses the Lambda function as a target. Configure the ALB to split the traffic between the two versions of the Lambda function.

**D:** Create the new version of the Lambda function as a Lambda layer on the existing version. Configure the function to split the traffic between the two layers.



**Answer: B**

**Timestamp: 2023-10-28 14:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/124820-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 233 discussion

A developer has created a large AWS Lambda function. Deployment of the function is failing because of an InvalidParameterValueException error. The error message indicates that the unzipped size of the function exceeds the maximum supported value.

Which actions can the developer take to resolve this error? (Choose two.)

**A:** Submit a quota increase request to AWS Support to increase the function to the required size.

**B:** Use a compression algorithm that is more efficient than ZIP.

**C:** Break up the function into multiple smaller functions.

**D:** Zip the .zip file twice to compress the file more.

**E:** Move common libraries, function dependencies, and custom runtimes into Lambda layers.



**Answer: CE**

**Timestamp: 2023-11-15 04:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/126181-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 112 discussion

A team is developing an application that is deployed on Amazon EC2 instances. During testing, the team receives an error. The EC2 instances are unable to access an Amazon S3 bucket.

Which steps should the team take to troubleshoot this issue? (Choose two.)

**A:** Check whether the policy that is assigned to the IAM role that is attached to the EC2 instances grants access to Amazon S3.

**B:** Check the S3 bucket policy to validate the access permissions for the S3 bucket.

**C:** Check whether the policy that is assigned to the IAM user that is attached to the EC2 instances grants access to Amazon S3.

**D:** Check the S3 Lifecycle policy to validate the permissions that are assigned to the S3 bucket.

**E:** Check the security groups that are assigned to the EC2 instances. Make sure that a rule is not blocking the access to Amazon S3.



**Answer: AB**

**Timestamp: 2023-04-22 21:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107037-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 113 discussion

A developer is working on an ecommerce website. The developer wants to review server logs without logging in to each of the application servers individually. The website runs on multiple Amazon EC2 instances, is written in Python, and needs to be highly available.

How can the developer update the application to meet these requirements with MINIMUM changes?

**A:** Rewrite the application to be cloud native and to run on AWS Lambda, where the logs can be reviewed in Amazon CloudWatch.

**B:** Set up centralized logging by using Amazon OpenSearch Service, Logstash, and OpenSearch Dashboards.

**C:** Scale down the application to one larger EC2 instance where only one instance is recording logs.

**D:** Install the unified Amazon CloudWatch agent on the EC2 instances. Configure the agent to push the application logs to CloudWatch.



**Answer: D**

**Timestamp: 2023-04-22 21:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107038-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 114 discussion

A company is creating an application that processes .csv files from Amazon S3. A developer has created an S3 bucket. The developer has also created an AWS Lambda function to process the .csv files from the S3 bucket.

Which combination of steps will invoke the Lambda function when a .csv file is uploaded to Amazon S3? (Choose two.)

**A:** Create an Amazon EventBridge rule. Configure the rule with a pattern to match the S3 object created event.

**B:** Schedule an Amazon EventBridge rule to run a new Lambda function to scan the S3 bucket.

**C:** Add a trigger to the existing Lambda function. Set the trigger type to EventBridge. Select the Amazon EventBridge rule.

**D:** Create a new Lambda function to scan the S3 bucket for recently added S3 objects.

**E:** Add S3 Lifecycle rules to invoke the existing Lambda function.



**Answer: AC**

**Timestamp: 2023-04-22 21:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107039-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 115 discussion

A developer needs to build an AWS CloudFormation template that self-populates the AWS Region variable that deploys the CloudFormation template.

What is the MOST operationally efficient way to determine the Region in which the template is being deployed?

**A:** Use the AWS::Region pseudo parameter.

**B:** Require the Region as a CloudFormation parameter.

**C:** Find the Region from the AWS::StackId pseudo parameter by using the Fn::Split intrinsic function.

**D:** Dynamically import the Region by referencing the relevant parameter in AWS Systems Manager Parameter Store.



**Answer: A**

**Timestamp: 2023-04-22 21:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107041-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 116 discussion

A company has hundreds of AWS Lambda functions that the company's QA team needs to test by using the Lambda function URLs. A developer needs to configure the authentication of the Lambda functions to allow access so that the QA IAM group can invoke the Lambda functions by using the public URLs.

Which solution will meet these requirements?

**A:** Create a CLI script that loops on the Lambda functions to add a Lambda function URL with the AWS_IAM auth type. Run another script to create an IAM identity-based policy that allows the lambda:InvokeFunctionUrl action to all the Lambda function Amazon Resource Names (ARNs). Attach the policy to the QA IAM group.

**B:** Create a CLI script that loops on the Lambda functions to add a Lambda function URL with the NONE auth type. Run another script to create an IAM resource-based policy that allows the lambda:InvokeFunctionUrl action to all the Lambda function Amazon Resource Names (ARNs). Attach the policy to the QA IAM group.

**C:** Create a CLI script that loops on the Lambda functions to add a Lambda function URL with the AWS_IAM auth type. Run another script to loop on the Lambda functions to create an IAM identity-based policy that allows the lambda:InvokeFunctionUrl action from the QA IAM group's Amazon Resource Name (ARN).

**D:** Create a CLI script that loops on the Lambda functions to add a Lambda function URL with the NONE auth type. Run another script to loop on the Lambda functions to create an IAM resource-based policy that allows the lambda:InvokeFunctionUrl action from the QA IAM group's Amazon Resource Name (ARN).



**Answer: A**

**Timestamp: 2023-04-22 23:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107050-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 67 discussion

A company has installed smart meters in all its customer locations. The smart meters measure power usage at 1-minute intervals and send the usage readings to a remote endpoint for collection. The company needs to create an endpoint that will receive the smart meter readings and store the readings in a database. The company wants to store the location ID and timestamp information.

The company wants to give its customers low-latency access to their current usage and historical usage on demand. The company expects demand to increase significantly. The solution must not impact performance or include downtime while scaling.

Which solution will meet these requirements MOST cost-effectively?

**A:** Store the smart meter readings in an Amazon RDS database. Create an index on the location ID and timestamp columns. Use the columns to filter on the customers' data.

**B:** Store the smart meter readings in an Amazon DynamoDB table. Create a composite key by using the location ID and timestamp columns. Use the columns to filter on the customers' data.

**C:** Store the smart meter readings in Amazon ElastiCache for Redis. Create a SortedSet key by using the location ID and timestamp columns. Use the columns to filter on the customers' data.

**D:** Store the smart meter readings in Amazon S3. Partition the data by using the location ID and timestamp columns. Use Amazon Athena to filter on the customers' data.



**Answer: B**

**Timestamp: 2023-04-25 14:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107439-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 68 discussion

A company is building a serverless application that uses AWS Lambda functions. The company needs to create a set of test events to test Lambda functions in a development environment. The test events will be created once and then will be used by all the developers in an IAM developer group. The test events must be editable by any of the IAM users in the IAM developer group.

Which solution will meet these requirements?

**A:** Create and store the test events in Amazon S3 as JSON objects. Allow S3 bucket access to all IAM users.

**B:** Create the test events. Configure the event sharing settings to make the test events shareable.

**C:** Create and store the test events in Amazon DynamoDB. Allow access to DynamoDB by using IAM roles.

**D:** Create the test events. Configure the event sharing settings to make the test events private.



**Answer: B**

**Timestamp: 2023-04-17 15:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106484-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 69 discussion

A developer is configuring an application's deployment environment in AWS CodePipeline. The application code is stored in a GitHub repository. The developer wants to ensure that the repository package's unit tests run in the new deployment environment. The developer has already set the pipeline's source provider to GitHub and has specified the repository and branch to use in the deployment.

Which combination of steps should the developer take next to meet these requirements with the LEAST overhead? (Choose two.)

**A:** Create an AWS CodeCommit project. Add the repository package's build and test commands to the project's buildspec.

**B:** Create an AWS CodeBuild project. Add the repository package's build and test commands to the project's buildspec.

**C:** Create an AWS CodeDeploy project. Add the repository package's build and test commands to the project's buildspec.

**D:** Add an action to the source stage. Specify the newly created project as the action provider. Specify the build artifact as the action's input artifact.

**E:** Add a new stage to the pipeline after the source stage. Add an action to the new stage. Specify the newly created project as the action provider. Specify the source artifact as the action's input artifact.



**Answer: BE**

**Timestamp: 2023-04-25 14:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107440-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 7 discussion

A developer has an application that makes batch requests directly to Amazon DynamoDB by using the BatchGetItem low-level API operation. The responses frequently return values in the UnprocessedKeys element.
Which actions should the developer take to increase the resiliency of the application when the batch response includes values in UnprocessedKeys? (Choose two.)

**A:** Retry the batch operation immediately.

**B:** Retry the batch operation with exponential backoff and randomized delay.

**C:** Update the application to use an AWS software development kit (AWS SDK) to make the requests.

**D:** Increase the provisioned read capacity of the DynamoDB tables that the operation accesses.

**E:** Increase the provisioned write capacity of the DynamoDB tables that the operation accesses.



**Answer: BD**

**Timestamp: 2023-03-16 10:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102785-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 70 discussion

An engineer created an A/B test of a new feature on an Amazon CloudWatch Evidently project. The engineer configured two variations of the feature (Variation A and Variation B) for the test. The engineer wants to work exclusively with Variation A. The engineer needs to make updates so that Variation A is the only variation that appears when the engineer hits the application's endpoint.

Which solution will meet this requirement?

**A:** Add an override to the feature. Set the identifier of the override to the engineer's user ID. Set the variation to Variation A.

**B:** Add an override to the feature. Set the identifier of the override to Variation A. Set the variation to 100%.

**C:** Add an experiment to the project. Set the identifier of the experiment to Variation B. Set the variation to 0%.

**D:** Add an experiment to the project. Set the identifier of the experiment to the AWS account's account ISet the variation to Variation A.



**Answer: A**

**Timestamp: 2023-04-17 16:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106488-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 1 discussion

A company is implementing an application on Amazon EC2 instances. The application needs to process incoming transactions. When the application detects a transaction that is not valid, the application must send a chat message to the company's support team. To send the message, the application needs to retrieve the access token to authenticate by using the chat API.
A developer needs to implement a solution to store the access token. The access token must be encrypted at rest and in transit. The access token must also be accessible from other AWS accounts.
Which solution will meet these requirements with the LEAST management overhead?

**A:** Use an AWS Systems Manager Parameter Store SecureString parameter that uses an AWS Key Management Service (AWS KMS) AWS managed key to store the access token. Add a resource-based policy to the parameter to allow access from other accounts. Update the IAM role of the EC2 instances with permissions to access Parameter Store. Retrieve the token from Parameter Store with the decrypt flag enabled. Use the decrypted access token to send the message to the chat.

**B:** Encrypt the access token by using an AWS Key Management Service (AWS KMS) customer managed key. Store the access token in an Amazon DynamoDB table. Update the IAM role of the EC2 instances with permissions to access DynamoDB and AWS KMS. Retrieve the token from DynamoDDecrypt the token by using AWS KMS on the EC2 instances. Use the decrypted access token to send the message to the chat.

**C:** Use AWS Secrets Manager with an AWS Key Management Service (AWS KMS) customer managed key to store the access token. Add a resource-based policy to the secret to allow access from other accounts. Update the IAM role of the EC2 instances with permissions to access Secrets Manager. Retrieve the token from Secrets Manager. Use the decrypted access token to send the message to the chat.

**D:** Encrypt the access token by using an AWS Key Management Service (AWS KMS) AWS managed key. Store the access token in an Amazon S3 bucket. Add a bucket policy to the S3 bucket to allow access from other accounts. Update the IAM role of the EC2 instances with permissions to access Amazon S3 and AWS KMS. Retrieve the token from the S3 bucket. Decrypt the token by using AWS KMS on the EC2 instances. Use the decrypted access token to send the massage to the chat.



**Answer: C**

**Timestamp: 2023-03-16 09:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102778-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 10 discussion

A developer is deploying a new application to Amazon Elastic Container Service (Amazon ECS). The developer needs to securely store and retrieve different types of variables. These variables include authentication information for a remote API, the URL for the API, and credentials. The authentication information and API URL must be available to all current and future deployed versions of the application across development, testing, and production environments.
How should the developer retrieve the variables with the FEWEST application changes?

**A:** Update the application to retrieve the variables from AWS Systems Manager Parameter Store. Use unique paths in Parameter Store for each variable in each environment. Store the credentials in AWS Secrets Manager in each environment.

**B:** Update the application to retrieve the variables from AWS Key Management Service (AWS KMS). Store the API URL and credentials as unique keys for each environment.

**C:** Update the application to retrieve the variables from an encrypted file that is stored with the application. Store the API URL and credentials in unique files for each environment.

**D:** Update the application to retrieve the variables from each of the deployed environments. Define the authentication information and API URL in the ECS task definition as unique names during the deployment process.



**Answer: A**

**Timestamp: 2023-03-20 07:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103335-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 100 discussion

A company uses AWS Lambda functions and an Amazon S3 trigger to process images into an S3 bucket. A development team set up multiple environments in a single AWS account.

After a recent production deployment, the development team observed that the development S3 buckets invoked the production environment Lambda functions. These invocations caused unwanted execution of development S3 files by using production Lambda functions. The development team must prevent these invocations. The team must follow security best practices.

Which solution will meet these requirements?

**A:** Update the Lambda execution role for the production Lambda function to add a policy that allows the execution role to read from only the production environment S3 bucket.

**B:** Move the development and production environments into separate AWS accounts. Add a resource policy to each Lambda function to allow only S3 buckets that are within the same account to invoke the function.

**C:** Add a resource policy to the production Lambda function to allow only the production environment S3 bucket to invoke the function.

**D:** Move the development and production environments into separate AWS accounts. Update the Lambda execution role for each function to add a policy that allows the execution role to read from the S3 bucket that is within the same account.



**Answer: B**

**Timestamp: 2023-05-15 01:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/109246-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 101 discussion

A developer is creating an application. New users of the application must be able to create an account and register by using their own social media accounts.

Which AWS service or resource should the developer use to meet these requirements?

**A:** IAM role

**B:** Amazon Cognito identity pools

**C:** Amazon Cognito user pools

**D:** AWS Directory Service



**Answer: C**

**Timestamp: 2023-04-22 15:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106980-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 102 discussion

A social media application uses the AWS SDK for JavaScript on the frontend to get user credentials from AWS Security Token Service (AWS STS). The application stores its assets in an Amazon S3 bucket. The application serves its content by using an Amazon CloudFront distribution with the origin set to the S3 bucket.

The credentials for the role that the application assumes to make the SDK calls are stored in plaintext in a JSON file within the application code. The developer needs to implement a solution that will allow the application to get user credentials without having any credentials hardcoded in the application code.

Which solution will meet these requirements?

**A:** Add a Lambda@Edge function to the distribution. Invoke the function on viewer request. Add permissions to the function's execution role to allow the function to access AWS STS. Move all SDK calls from the frontend into the function.

**B:** Add a CloudFront function to the distribution. Invoke the function on viewer request. Add permissions to the function's execution role to allow the function to access AWS STS. Move all SDK calls from the frontend into the function.

**C:** Add a Lambda@Edge function to the distribution. Invoke the function on viewer request. Move the credentials from the JSON file into the function. Move all SDK calls from the frontend into the function.

**D:** Add a CloudFront function to the distribution. Invoke the function on viewer request. Move the credentials from the JSON file into the function. Move all SDK calls from the frontend into the function.



**Answer: A**

**Timestamp: 2023-04-22 15:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106981-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 485 discussion

A developer must cache dependent artifacts from Maven Central, a public package repository, as part of an application’s build pipeline. The build pipeline has an AWS CodeArtifact repository where artifacts of the build are published. The developer needs a solution that requires minimum changes to the build pipeline.

Which solution meets these requirements?

**A:** Modify the existing CodeAriifact repository to associate an upstream repository with the public package repository.

**B:** Create a new CodeAtfact repository that has an external connection to the public package repository.

**C:** Create a new CodeAifact domain that contains a new repository that has an external connection to the public package repository.

**D:** Modify the CodeAnifact repository resource policy to allow artifacts to be fetched from the public package repository.



**Answer: A**

**Timestamp: 2025-02-17 09:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156655-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 486 discussion

A developer is creating an AWS Step Functions state machine to handle an order processing workflow. When the state machine receives an order, the state machine pauses until the order has been confirmed. A record that is added to an Amazon DynamoDB table by another service confirms each order.

The developer must complete the order processing workflow.

Which solution will meet this requirement?

**A:** Update the state machine to query the DynamoDB table by using the DynamoDB GetItem state to determine whether a record exists. If the record does exist, continue to the next state. If the record does not exist, wait 5 minutes and check again.

**B:** Subscribe an AWS Lambda function to a DynamoDB table stream. Configure the Lambda function to run when a new record is added to the table. When the Lambda function receives the appropriate record, run the redrive execution command on the running state machine.

**C:** Subscribe an AWS Lambda function to the DynamoDB table stream. Configure the Lambda function to run when a new record is added to the table. When the Lambda function receives the appropriate record, stop the current state machine invocation and start a new invocation.

**D:** Invoke an AWS Lambda function from the state machine. Configure the Lambda function to continuously poll the DynamoDB table for the appropriate record and to return when a record exists. Continue the state machine invocation when the Lambda function returns. If the Lambda function times out, then fail the state machine.



**Answer: A**

**Timestamp: 2025-01-10 21:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/154337-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 487 discussion

A developer is writing a web application that must share secure documents with end users. The documents are stored in a private Amazon S3 bucket. The application must allow only authenticated users to download specific documents when requested, and only for a duration of 15 minutes.

How can the developer meet these requirements?

**A:** Copy the documents to a separate S3 bucket that has a lifecycle policy for deletion after 15 minutes.

**B:** Create a presigned S3 URL using the AWS SDK with an expiration time of 15 minutes.

**C:** Use server-side encryption with AWS KMS managed keys (SSE-KMS) and download the documents using HTTPS.

**D:** Modify the S3 bucket policy to only allow specific users to download the documents. Revert the change after 15 minutes.



**Answer: B**

**Timestamp: 2025-02-17 10:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156657-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 488 discussion

A company is developing a set of AWS Lambda functions to process data. The Lambda functions need to use a common third-party library as a dependency. The library is frequently updated with new features and bug fixes. The company wants to ensure that the Lambda functions always use the latest version of the library.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Store the dependency and the function code in an Amazon S3 bucket.

**B:** Create a Lambda layer that includes the library. Attach the layer to each Lambda function.

**C:** Install the dependency in an Amazon Elastic File System (Amazon EFS) file system. Attach the file system to each Lambda function.

**D:** Create a new Lambda function to load the library. Configure the existing Lambda functions to invoke the new Lambda function when the existing functions need to use the library.



**Answer: B**

**Timestamp: 2025-02-17 10:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156658-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 489 discussion

A company’s application includes an Amazon DynamoDB table for product orders. The table has a primary partition key of orderId and has no sort key. The company is adding a new feature that requires the application to query the table by using the customerId attribute.

Which solution will provide this query functionality?

**A:** Change the existing primary key by setting customerId as the sort key.

**B:** Create a new global secondary index (GSI) on the table with a partition key of customerId.

**C:** Create a new local secondary index (LSI) on the table with a partition key of customerId.

**D:** Create a new local secondary index (LSI) on the table with a partition key of orderId and a sort key of customerId.



**Answer: B**

**Timestamp: 2025-02-17 10:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/156659-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 103 discussion

An ecommerce website uses an AWS Lambda function and an Amazon RDS for MySQL database for an order fulfillment service. The service needs to return order confirmation immediately.

During a marketing campaign that caused an increase in the number of orders, the website's operations team noticed errors for “too many connections” from Amazon RDS. However, the RDS DB cluster metrics are healthy. CPU and memory capacity are still available.

What should a developer do to resolve the errors?

**A:** Initialize the database connection outside the handler function. Increase the max_user_connections value on the parameter group of the DB cluster. Restart the DB cluster.

**B:** Initialize the database connection outside the handler function. Use RDS Proxy instead of connecting directly to the DB cluster.

**C:** Use Amazon Simple Queue Service (Amazon SQS) FIFO queues to queue the orders. Ingest the orders into the database. Set the Lambda function's concurrency to a value that equals the number of available database connections.

**D:** Use Amazon Simple Queue Service (Amazon SQS) FIFO queues to queue the orders. Ingest the orders into the database. Set the Lambda function's concurrency to a value that is less than the number of available database connections.



**Answer: B**

**Timestamp: 2023-04-22 15:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106984-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 104 discussion

A company stores its data in data tables in a series of Amazon S3 buckets. The company received an alert that customer credit card information might have been exposed in a data table on one of the company's public applications. A developer needs to identify all potential exposures within the application environment.

Which solution will meet these requirements?

**A:** Use Amazon Athena to run a job on the S3 buckets that contain the affected data. Filter the findings by using the SensitiveData:S3Object/Personal finding type.

**B:** Use Amazon Macie to run a job on the S3 buckets that contain the affected data. Filter the findings by using the SensitiveData:S3Object/Financial finding type.

**C:** Use Amazon Macie to run a job on the S3 buckets that contain the affected data. Filter the findings by using the SensitiveData:S3Object/Personal finding type.

**D:** Use Amazon Athena to run a job on the S3 buckets that contain the affected data. Filter the findings by using the SensitiveData:S3Object/Financial finding type.



**Answer: B**

**Timestamp: 2023-04-22 16:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106987-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 105 discussion

A software company is launching a multimedia application. The application will allow guest users to access sample content before the users decide if they want to create an account to gain full access. The company wants to implement an authentication process that can identify users who have already created an account. The company also needs to keep track of the number of guest users who eventually create an account.

Which combination of steps will meet these requirements? (Choose two.)

**A:** Create an Amazon Cognito user pool. Configure the user pool to allow unauthenticated users. Exchange user tokens for temporary credentials that allow authenticated users to assume a role.

**B:** Create an Amazon Cognito identity pool. Configure the identity pool to allow unauthenticated users. Exchange unique identity for temporary credentials that allow all users to assume a role.

**C:** Create an Amazon CloudFront distribution. Configure the distribution to allow unauthenticated users. Exchange user tokens for temporary credentials that allow all users to assume a role.

**D:** Create a role for authenticated users that allows access to all content. Create a role for unauthenticated users that allows access to only the sample content.

**E:** Allow all users to access the sample content by default. Create a role for authenticated users that allows access to the other content.



**Answer: BD**

**Timestamp: 2023-04-22 16:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106989-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 106 discussion

A company is updating an application to move the backend of the application from Amazon EC2 instances to a serverless model. The application uses an Amazon RDS for MySQL DB instance and runs in a single VPC on AWS. The application and the DB instance are deployed in a private subnet in the VPC.

The company needs to connect AWS Lambda functions to the DB instance.

Which solution will meet these requirements?

**A:** Create Lambda functions inside the VPC with the AWSLambdaBasicExecutionRole policy attached to the Lambda execution role. Modify the RDS security group to allow inbound access from the Lambda security group.

**B:** Create Lambda functions inside the VPC with the AWSLambdaVPCAccessExecutionRole policy attached to the Lambda execution role. Modify the RDS security group to allow inbound access from the Lambda security group.

**C:** Create Lambda functions with the AWSLambdaBasicExecutionRole policy attached to the Lambda execution role. Create an interface VPC endpoint for the Lambda functions. Configure the interface endpoint policy to allow the lambda:InvokeFunclion action for each Lambda function's Amazon Resource Name (ARN).

**D:** Create Lambda functions with the AWSLambdaVPCAccessExecutionRole policy attached to the Lambda execution role. Create an interface VPC endpoint for the Lambda functions. Configure the interface endpoint policy to allow the lambda:InvokeFunction action for each Lambda function's Amazon Resource Name (ARN).



**Answer: B**

**Timestamp: 2023-04-22 16:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/106992-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 107 discussion

A company has a web application that runs on Amazon EC2 instances with a custom Amazon Machine Image (AMI). The company uses AWS CloudFormation to provision the application. The application runs in the us-east-1 Region, and the company needs to deploy the application to the us-west-1 Region.

An attempt to create the AWS CloudFormation stack in us-west-1 fails. An error message states that the AMI ID does not exist. A developer must resolve this error with a solution that uses the least amount of operational overhead.

Which solution meets these requirements?

**A:** Change the AWS CloudFormation templates for us-east-1 and us-west-1 to use an AWS AMI. Relaunch the stack for both Regions.

**B:** Copy the custom AMI from us-east-1 to us-west-1. Update the AWS CloudFormation template for us-west-1 to refer to AMI ID for the copied AMI. Relaunch the stack.

**C:** Build the custom AMI in us-west-1. Create a new AWS CloudFormation template to launch the stack in us-west-1 with the new AMI ID.

**D:** Manually deploy the application outside AWS CloudFormation in us-west-1.



**Answer: B**

**Timestamp: 2023-04-22 18:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/107007-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 275 discussion

A developer supports an application that accesses data in an Amazon DynamoDB table. One of the item attributes is expirationDate in the timestamp format. The application uses this attribute to find items, archive them, and remove them from the table based on the timestamp value.

The application will be decommissioned soon, and the developer must find another way to implement this functionality. The developer needs a solution that will require the least amount of code to write.

Which solution will meet these requirements?

**A:** Enable TTL on the expirationDate attribute in the table. Create a DynamoDB stream. Create an AWS Lambda function to process the deleted items. Create a DynamoDB trigger for the Lambda function.

**B:** Create two AWS Lambda functions: one to delete the items and one to process the items. Create a DynamoDB stream. Use the DeleteItem API operation to delete the items based on the expirationDate attribute. Use the GetRecords API operation to get the items from the DynamoDB stream and process them.

**C:** Create two AWS Lambda functions: one to delete the items and one to process the items. Create an Amazon EventBridge scheduled rule to invoke the Lambda functions. Use the DeleteItem API operation to delete the items based on the expirationDate attribute. Use the GetRecords API operation to get the items from the DynamoDB table and process them.

**D:** Enable TTL on the expirationDate attribute in the table. Specify an Amazon Simple Queue Service (Amazon SQS) dead-letter queue as the target to delete the items. Create an AWS Lambda function to process the items.



**Answer: A**

**Timestamp: 2024-02-21 05:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134275-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 276 discussion

A developer needs to implement a custom machine learning (ML) library in an application. The size of the library is 15 GB. The size of the library is increasing. The application uses AWS Lambda functions. All the Lambda functions must have access to the library.

Which solution will meet these requirements?

**A:** Save the library in Lambda layers. Attach the layers to all Lambda functions.

**B:** Save the library in Amazon S3. Download the library from Amazon S3 inside the Lambda function.

**C:** Save the library as a Lambda container image. Redeploy the Lambda functions with the new image.

**D:** Save the library in an Amazon Elastic File System (Amazon EFS) file system. Mount the EFS file system in all the Lambda functions.



**Answer: D**

**Timestamp: 2024-02-21 05:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134276-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 277 discussion

A developer is designing a serverless application for a game in which users register and log in through a web browser. The application makes requests on behalf of users to a set of AWS Lambda functions that run behind an Amazon API Gateway HTTP API.

The developer needs to implement a solution to register and log in users on the application's sign-in page. The solution must minimize operational overhead and must minimize ongoing management of user identities.

Which solution will meet these requirements?

**A:** Create Amazon Cognito user pools for external social identity providers. Configure IAM roles for the identity pools.

**B:** Program the sign-in page to create users' IAM groups with the IAM roles attached to the groups.

**C:** Create an Amazon RDS for SQL Server DB instance to store the users and manage the permissions to the backend resources in AWS.

**D:** Configure the sign-in page to register and store the users and their passwords in an Amazon DynamoDB table with an attached IAM policy.



**Answer: A**

**Timestamp: 2024-02-21 05:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134277-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 278 discussion

A company has a web application that is hosted on Amazon EC2 instances. The EC2 instances are configured to stream logs to Amazon CloudWatch Logs. The company needs to receive an Amazon Simple Notification Service (Amazon SNS) notification when the number of application error messages exceeds a defined threshold within a 5-minute period.

Which solution will meet these requirements?

**A:** Rewrite the application code to stream application logs to Amazon SNS. Configure an SNS topic to send a notification when the number of errors exceeds the defined threshold within a 5-minute period.

**B:** Configure a subscription filter on the CloudWatch Logs log group. Configure the filter to send an SNS notification when the number of errors exceeds the defined threshold within a 5-minute period.

**C:** Install and configure the Amazon Inspector agent on the EC2 instances to monitor for errors. Configure Amazon Inspector to send an SNS notification when the number of errors exceeds the defined threshold within a 5-minute period.

**D:** Create a CloudWatch metric filter to match the application error pattern in the log data. Set up a CloudWatch alarm based on the new custom metric. Configure the alarm to send an SNS notification when the number of errors exceeds the defined threshold within a 5-minute period.



**Answer: D**

**Timestamp: 2024-02-09 01:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133406-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 279 discussion

A photo sharing application uses Amazon S3 to store image files. All user images are manually audited for inappropriate content by a third-party company. The audits are completed 1-24 hours after user upload and the results are written to an Amazon DynamoDB table, which uses the S3 object key as a primary key. The database items can be queried by using a REST API created by the third-party company.

An application developer needs to implement an automated process to tag all S3 objects with the results of the content audit.

What should the developer do to meet these requirements in the MOST operationally efficient way?

**A:** Create an AWS Lambda function to run in response to the s3:ObjectCreated event type. Write the S3 key to an Amazon Simple Queue Service (Amazon SQS) queue with a visibility timeout of 24 hours. Create and configure a second Lambda function to read items from the queue. Retrieve the results for each item from the DynamoDB table. Tag each S3 object accordingly.

**B:** Create an AWS Lambda function to run in response to the s3:ObjectCreated event type. Integrate the function into an AWS Step Functions standard workflow. Define an AWS Step Functions Wait state and set the value to 24 hours. Create and configure a second Lambda function to retrieve the audit results and tag the S3 objects accordingly after the Wait state is over.

**C:** Create an AWS Lambda function to load all untagged S3 objects. Retrieve the results for each item from the REST API and tag each S3 object accordingly. Create and configure an Amazon EventBridge rule to run at regular intervals. Set the Lambda function as a target for the EventBridge rule.

**D:** Launch an Amazon EC2 instance. Deploy a script to the EC2 instance to use the external database results to tag the S3 objects accordingly. Configure a crontab file to run the script at regular intervals.



**Answer: B**

**Timestamp: 2024-02-21 05:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134278-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 261 discussion

A company runs an application on Amazon EC2 instances. The EC2 instances open connections to an Amazon RDS for SQL Server database. A developer needs to store and access the credentials and wants to automatically rotate the credentials. The developer does not want to store the credentials for the database in the code.

Which solution will meet these requirements in the MOST secure way?

**A:** Create an IAM role that has permissions to access the database. Attach the IAM role to the EC2 instances.

**B:** Store the credentials as secrets in AWS Secrets Manager. Create an AWS Lambda function to update the secrets and the database. Retrieve the credentials from Secrets Manager as needed.

**C:** Store the credentials in an encrypted text file in an Amazon S3 bucket. Configure the EC2 instance launch template to download the credentials from Amazon S3 as the instance launches. Create an AWS Lambda function to update the secrets and the database.

**D:** Store the credentials in an Amazon DynamoDB table. Configure an Amazon CloudWatch Events rule to invoke an AWS Lambda function to periodically update the secrets and database.



**Answer: B**

**Timestamp: 2024-02-06 17:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133069-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 262 discussion

A company wants to test its web application more frequently. The company deploys the application by using a separate AWS CloudFormation stack for each environment. The company deploys the same CloudFormation template to each stack as the application progresses through the development lifecycle.

A developer needs to build in notifications for the quality assurance (QA) team. The developer wants the notifications to occur for new deployments in the final preproduction environment.

Which solution will meet these requirements?

**A:** Create an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe the QA team to the Amazon SNS topic. Update the CloudFormation stack options to point to the SNS topic in the pre-production environment.

**B:** Create an AWS Lambda function that notifies the QA team. Create an Amazon EventBridge rule to invoke the Lambda function on the default event bus. Filter the events on the CloudFormation service and on the CloudFormation stack Amazon Resource Name (ARN).

**C:** Create an Amazon CloudWatch alarm that monitors the metrics from CloudFormation. Filter the metrics on the stack name and the stack status. Configure the CloudWatch alarm to notify the QA team.

**D:** Create an AWS Lambda function that notifies the QA team. Configure the event source mapping to receive events from CloudFormation. Specify the filtering values to limit invocations to the desired CloudFormation stack.



**Answer: A**

**Timestamp: 2024-02-21 03:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134262-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 263 discussion

A developer manages three AWS accounts. Each account contains an Amazon RDS DB instance in a private subnet. The developer needs to define users in each database in a consistent way. The developer must ensure that the same users are created and updated later in all three accounts.

Which solution will meet these requirements with the MOST operational efficiency?

**A:** Create an AWS CloudFormation template. Declare the users in the template. Attach the users to the database. Deploy the template in each account.

**B:** Create an AWS CloudFormation template that contains a custom resource to create the users in the database. Deploy the template in each account.

**C:** Write a script that creates the users. Deploy an Amazon EC2 instance in each account to run the script on the databases. Run the script in each account.

**D:** Implement an AWS Lambda function that creates the users in the database. Provide the function with the details of all three accounts.



**Answer: B**

**Timestamp: 2024-02-21 03:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134263-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 264 discussion

A company is building a new application that runs on AWS and uses Amazon API Gateway to expose APIs. Teams of developers are working on separate components of the application in parallel. The company wants to publish an API without an integrated backend so that teams that depend on the application backend can continue the development work before the API backend development is complete.

Which solution will meet these requirements?

**A:** Create API Gateway resources and set the integration type value to MOCK. Configure the method integration request and integration response to associate a response with an HTTP status code. Create an API Gateway stage and deploy the API.

**B:** Create an AWS Lambda function that returns mocked responses and various HTTP status codes. Create API Gateway resources and set the integration type value to AWS_PROXY. Deploy the API.

**C:** Create an EC2 application that returns mocked HTTP responses. Create API Gateway resources and set the integration type value to AWS. Create an API Gateway stage and deploy the API.

**D:** Create API Gateway resources and set the integration type value set to HTTP_PROXY. Add mapping templates and deploy the API. Create an AWS Lambda layer that returns various HTTP status codes. Associate the Lambda layer with the API deployment.



**Answer: A**

**Timestamp: 2024-02-21 03:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134264-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 265 discussion

An application that runs on AWS receives messages from an Amazon Simple Queue Service (Amazon SQS) queue and processes the messages in batches. The application sends the data to another SQS queue to be consumed by another legacy application. The legacy system can take up to 5 minutes to process some transaction data.

A developer wants to ensure that there are no out-of-order updates in the legacy system. The developer cannot alter the behavior of the legacy system.

Which solution will meet these requirements?

**A:** Use an SQS FIFO queue. Configure the visibility timeout value.

**B:** Use an SQS standard queue with a SendMessageBatchRequestEntry data type. Configure the DelaySeconds values.

**C:** Use an SQS standard queue with a SendMessageBatchRequestEntry data type. Configure the visibility timeout value.

**D:** Use an SQS FIFO queue. Configure the DelaySeconds value.



**Answer: A**

**Timestamp: 2024-02-21 03:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134265-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 310 discussion

A developer is building an application that invokes AWS Lambda functions asynchronously to process events. The developer notices that a Lambda function fails to process some events at random times. The developer needs to investigate the failed events and capture the events that the Lambda function fails to process.

Which solution will meet these requirements?

**A:** Add an Amazon EventBridge rule for the Lambda function. Configure the EventBridge rule to react to failed events and to store the events in an Amazon DynamoDB table.

**B:** Configure the Lambda function with a dead-letter queue based in Amazon Kinesis. Update the Lambda function's execution role with the required permissions.

**C:** Configure the Lambda function with an Amazon Simple Queue Service (Amazon SQS) dead-letter queue. Update the Lambda function's execution role with the required permissions.

**D:** Configure the Lambda function with an Amazon Simple Queue Service (Amazon SQS) FIFO dead-letter queue. Update the Lambda function's execution role with the required permissions.



**Answer: C**

**Timestamp: 2024-02-12 13:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133608-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 311 discussion

A company has built a serverless application for its ecommerce website. The application includes a REST API in Amazon API Gateway that invokes an AWS Lambda function. The Lambda function processes data and stores the data in Amazon DynamoDB table. The Lambda function calls a third-party stock application API to process the order. After the ordered is processed, the Lambda function returns an HTTP 200 status code with no body to the client.

During peak usage when the API calls exceeds a certain threshold, the third-party stock application sometimes fails to process the data and responds with error messages. The company needs a solution that will not overwhelm the third-party stock application.

Which solution will meet these requirements?

**A:** Configure the REST API in API Gateway to write the requests directly into DynamoDB. Configure a DynamoDB intrinsic function to perform the transformation. Set up a DynamoDB stream to call the third-party stock application API with each new row. Delete the Lambda function.

**B:** Configure the REST API in API Gateway to write the requests directly into an Amazon Simple Queue Service (Amazon SQS) queue. Configure the Lambda function with a reserved concurrency equal to the third-party stock application's threshold. Set Lambda function to process the messages from the SQS queue.

**C:** Configure the REST API in API Gateway to write the requests directly into an Amazon Simple Notification Service (Amazon SNS) topic. Configure the Lambda function with a provisioned concurrency equal to the third-party stock application's threshold. Set the Lambda function to process the messages from the SNS topic.

**D:** Configure the REST API in API Gateway to write the requests directly into Amazon Athena. Configure the transformation of the data by using SQL with multiple query result locations set up to point to the DynamoDB table and the third-party stock fulfilment application API. Delete the Lambda function.



**Answer: B**

**Timestamp: 2024-02-12 14:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133609-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 312 discussion

A company hosts its application on AWS. The application runs on an Amazon Elastic Container Service (Amazon ECS) cluster that uses AWS Fargate. The cluster runs behind an Application Load Balancer. The application stores data in an Amazon Aurora database. A developer encrypts and manages database credentials inside the application.

The company wants to use a more secure credential storage method and implement periodic credential rotation.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Migrate the secret credentials to Amazon RDS parameter groups. Encrypt the parameter by using an AWS Key Management Service (AWS KMS) key. Turn on secret rotation. Use IAM policies and roles to grant AWS KMS permissions to access Amazon RDS.

**B:** Migrate the credentials to AWS Systems Manager Parameter Store. Encrypt the parameter by using an AWS Key Management Service (AWS KMS) key. Turn on secret rotation. Use IAM policies and roles to grant Amazon ECS Fargate permissions to access to AWS Secrets Manager.

**C:** Migrate the credentials to ECS Fargate environment variables. Encrypt the credentials by using an AWS Key Management Service (AWS KMS) key. Turn on secret rotation. Use IAM policies and roles to grant Amazon ECS Fargate permissions to access to AWS Secrets Manager.

**D:** Migrate the credentials to AWS Secrets Manager. Encrypt the credentials by using an AWS Key Management Service (AWS KMS) key. Turn on secret rotation. Use IAM policies and roles to grant Amazon ECS Fargate permissions to access to AWS Secrets Manager by using keys.



**Answer: D**

**Timestamp: 2024-02-12 14:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133610-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 313 discussion

A company has a mobile app. The app includes an Amazon API Gateway REST API that invokes AWS Lambda functions. The Lambda functions process data from the app.

The company needs to test updated Lambda functions that have new features. The company must conduct these tests with a subset of users before deployment. The tests must not affect other users of the app.

Which solution will meet these requirements with the LEAST amount of operational effort?

**A:** Create a new version of each Lambda function with a weighted alias. Configure a weight value for each version of the Lambda function. Update the new weighted alias Amazon Resource Name (ARN) in the REST API.

**B:** Create a new REST API in API Gateway. Set up a Lambda proxy integration to connect to multiple Lambda functions. Enable canary settings on the deployment stage. Specify a smaller percentage of API traffic to go to the new version of the Lambda function.

**C:** Create a new version of each Lambda function. Integrate a predefined canary deployment in AWS CodeDeploy to slowly shift the traffic to the new versions automatically.

**D:** Create a new REST API in API Gateway. Set up a Lambda non-proxy integration to connect to multiple Lambda functions. Specify the necessary parameters and properties in API Gateway. Enable canary settings on the deployment stage. Specify a smaller percentage of API traffic to go to the new version of the Lambda function.



**Answer: A**

**Timestamp: 2024-02-12 14:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133611-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 314 discussion

A developer works for a company that only has a single pre-production AWS account with an AWS CloudFormation AWS Serverless Application Model (AWS SAM) stack. The developer made changes to an existing AWS Lambda function specified in the AWS SAM template and additional Amazon Simple Notification service (Amazon SNS) topics.

The developer wants to do a one-time deploy of the changes to test if the changes are working. The developer does not want to impact the existing pre-production application that is currently being used by other team members as part of the release pipeline.

Which solution will meet these requirements?

**A:** Use the AWS SAM CLI to package and deploy the SAM application to the pre-production AWS account. Specify the debug parameter.

**B:** Use the AWS SAM CLI to package and create a change set against the pre-production AWS account. Execute the change set in a new AWS account designated for a development environment.

**C:** Use the AWS SAM CLI to package and deploy the SAM application to a new AWS account designated for a development environment.

**D:** Update the CloudFormation stack in the pre-production account. Add a separate stage that points to a new AWS account designated for a development environment.



**Answer: C**

**Timestamp: 2024-02-12 14:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133612-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 397 discussion

A developer has a continuous integration and continuous delivery (CI/CD) pipeline that uses AWS CodeArtifact and AWS CodeBuild. The build artifacts are between 0.5 GB and 1.5 GB in size. The builds happen frequently and retrieve many dependencies from CodeArtifact each time.

The builds have been slow because of the time it takes to transfer dependencies. The developer needs to improve build performance by reducing the number of dependencies that are retrieved for each build.

Which solution will meet this requirement?

**A:** Specify an Amazon S3 cache in CodeBuild. Add the S3 cache folder path to the buildspec.yaml file for the build project.

**B:** Specify a local cache in CodeBuild. Add the CodeArtifact repository name to the buildspec.yaml file for the build project.

**C:** Specify a local cache in CodeBuild. Add the cache folder path to the buildspec.yaml file for the build project.

**D:** Retrieve the buildspec.yaml file directly from CodeArtifact. Add the CodeArtifact repository name to the buildspec.yaml file for the build project.



**Answer: C**

**Timestamp: 2024-06-29 19:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143073-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 398 discussion

A company that has large online business uses an Amazon DynamoDB table to store sales data. The company enabled Amazon DynamoDB Streams on the table. The transaction status of each sale is stored in a TransactionStatus attribute in the table. The value of the TransactionStatus attribute must be either failed, pending, or completed.

The company wants to be notified of failed sales where the Price attribute is above a specific threshold. A developer needs to set up notification for the failed sales.

Which solution will meet these requirements with the LEAST development effort?

**A:** Create an event source mapping between DynamoDB Streams and an AWS Lambda function. Use Lambda event filtering to trigger the Lambda function only if sales fail when the price is above the specified threshold. Configure the Lambda function to publish the data to an Amazon Simple Notification Service (Amazon SNS) topic.

**B:** Create an event source mapping between DynamoDB Streams and an AWS Lambda function. Configure the Lambda function handler code to publish to an Amazon Simple Notification Service (Amazon SNS) topic if sales fail when price is above the specified threshold.

**C:** Create an event source mapping between DynamoDB Streams and an Amazon Simple Notification Service (Amazon SNS) topic. Use event filtering to publish to the SNS topic if sales fail when the price is above the specified threshold.

**D:** Create an Amazon CloudWatch alarm to monitor the DynamoDB Streams sales data. Configure the alarm to publish to an Amazon Simple Notification Service (Amazon SNS) topic if sales fail due when price is above the specified threshold.



**Answer: A**

**Timestamp: 2024-07-05 14:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143357-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 399 discussion

An AWS Lambda function is invoked asynchronously to process events. Occasionally, the Lambda function falls to process events. A developer needs to collect and analyze these failed events to fix the issue.

What should the developer do to meet these requirements with the LEAST development effort?

**A:** Add logging statements for all events in the Lambda function. Filter AWS CloudTrail logs for errors.

**B:** Configure the Lambda function to start an AWS Step Functions workflow with retries for failed events.

**C:** Add a dead-letter queue to send messages to an Amazon Simple Queue Service (Amazon SQS) standard queue.

**D:** Add a dead-letter queue to send messages to an Amazon Simple Notification Service (Amazon SNS) FIFO topic.



**Answer: C**

**Timestamp: 2024-07-12 15:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143802-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 4 discussion

A company is building a scalable data management solution by using AWS services to improve the speed and agility of development. The solution will ingest large volumes of data from various sources and will process this data through multiple business rules and transformations.
The solution requires business rules to run in sequence and to handle reprocessing of data if errors occur when the business rules run. The company needs the solution to be scalable and to require the least possible maintenance.
Which AWS service should the company use to manage and automate the orchestration of the data flows to meet these requirements?

**A:** AWS Batch

**B:** AWS Step Functions

**C:** AWS Glue

**D:** AWS Lambda



**Answer: B**

**Timestamp: 2023-03-16 10:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102789-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 40 discussion

A company has deployed infrastructure on AWS. A development team wants to create an AWS Lambda function that will retrieve data from an Amazon Aurora database. The Amazon Aurora database is in a private subnet in company's VPC. The VPC is named VPC1. The data is relational in nature. The Lambda function needs to access the data securely.
Which solution will meet these requirements?

**A:** Create the Lambda function. Configure VPC1 access for the function. Attach a security group named SG1 to both the Lambda function and the database. Configure the security group inbound and outbound rules to allow TCP traffic on Port 3306.

**B:** Create and launch a Lambda function in a new public subnet that is in a new VPC named VPC2. Create a peering connection between VPC1 and VPC2.

**C:** Create the Lambda function. Configure VPC1 access for the function. Assign a security group named SG1 to the Lambda function. Assign a second security group named SG2 to the database. Add an inbound rule to SG1 to allow TCP traffic from Port 3306.

**D:** Export the data from the Aurora database to Amazon S3. Create and launch a Lambda function in VPC1. Configure the Lambda function query the data from Amazon S3.



**Answer: A**

**Timestamp: 2023-03-21 22:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103523-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 289 discussion

A company has an application that runs across multiple AWS Regions. The application is experiencing performance issues at irregular intervals. A developer must use AWS X-Ray to implement distributed tracing for the application to troubleshoot the root cause of the performance issues.

What should the developer do to meet this requirement?

**A:** Use the X-Ray console to add annotations for AWS services and user-defined services.

**B:** Use Region annotation that X-Ray adds automatically for AWS services. Add Region annotation for user-defined services.

**C:** Use the X-Ray daemon to add annotations for AWS services and user-defined services.

**D:** Use Region annotation that X-Ray adds automatically for user-defined services. Configure X-Ray to add Region annotation for AWS services.



**Answer: B**

**Timestamp: 2024-02-21 07:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134288-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 29 discussion

An application is processing clickstream data using Amazon Kinesis. The clickstream data feed into Kinesis experiences periodic spikes. The PutRecords API call occasionally fails and the logs show that the failed call returns the response shown below:
//IMG//

Which techniques will help mitigate this exception? (Choose two.)

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image1.png

**A:** Implement retries with exponential backoff.

**B:** Use a PutRecord API instead of PutRecords.

**C:** Reduce the frequency and/or size of the requests.

**D:** Use Amazon SNS instead of Kinesis.

**E:** Reduce the number of KCL consumers.



**Answer: AC**

**Timestamp: 2023-03-17 09:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/102903-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 290 discussion

A company runs an application on AWS. The application uses an AWS Lambda function that is configured with an Amazon Simple Queue Service (Amazon SQS) queue called high priority queue as the event source. A developer is updating the Lambda function with another SQS queue called low priority queue as the event source. The Lambda function must always read up to 10 simultaneous messages from the high priority queue before processing messages from low priority queue. The Lambda function must be limited to 100 simultaneous invocations.

Which solution will meet these requirements?

**A:** Set the event source mapping batch size to 10 for the high priority queue and to 90 for the low priority queue.

**B:** Set the delivery delay to 0 seconds for the high priority queue and to 10 seconds for the low priority queue.

**C:** Set the event source mapping maximum concurrency to 10 for the high priority queue and to 90 for the low priority queue.

**D:** Set the event source mapping batch window to 10 for the high priority queue and to 90 for the low priority queue.



**Answer: C**

**Timestamp: 2024-02-21 07:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134289-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 291 discussion

A data visualization company wants to strengthen the security of its core applications. The applications are deployed on AWS across its development, staging, pre-production, and production environments. The company needs to encrypt all of its stored sensitive credentials. The sensitive credentials need to be automatically rotated. A version of the sensitive credentials need to be stored for each environment.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Configure AWS Secrets Manager versions to store different copies of the same credentials across multiple environments.

**B:** Create a new parameter version in AWS Systems Manager Parameter Store for each environment. Store the environment-specific credentials in the parameter version.

**C:** Configure the environment variables in the application code. Use different names for each environment type.

**D:** Configure AWS Secrets Manager to create a new secret for each environment type. Store the environment-specific credentials in the secret.



**Answer: D**

**Timestamp: 2024-02-21 07:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134290-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 292 discussion

A developer is investigating an issue in part of a company's application. In the application, messages are sent to an Amazon Simple Queue Service (Amazon SQS) queue. The AWS Lambda function polls messages from the SQS queue and sends email messages by using Amazon Simple Email Service (Amazon SES). Users have been receiving duplicate email messages during periods of high traffic.

Which reasons could explain the duplicate email messages? (Choose two.)

**A:** Standard SQS queues support at-least-once message delivery.

**B:** Standard SQS queues support exactly-once processing, so the duplicate email messages are because of user error.

**C:** Amazon SES has the DomainKeys Identified Mail (DKIM) authentication incorrectly configured.

**D:** The SQS queue's visibility timeout is lower than or the same as the Lambda function's timeout.

**E:** The Amazon SES bounce rate metric is too high.



**Answer: AD**

**Timestamp: 2024-02-21 07:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134291-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 448 discussion

A developer is building an application on AWS. The application has an Amazon API Gateway API that sends requests to an AWS Lambda function. The API is experiencing increased latency because the Lambda function has limited available CPU to fulfill the requests.

Before the developer deploys the API into production, the developer must configure the Lambda function to have more CPU.

Which solution will meet this requirement?

**A:** Increase the virtual CPU (vCPU) cores quota of the Lambda function.

**B:** Increase the amount of memory that is allocated to the Lambda function.

**C:** Increase the ephemeral storage size of the Lambda function.

**D:** Increase the timeout value of the Lambda function.



**Answer: B**

**Timestamp: 2024-11-07 13:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150940-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 45 discussion

A developer is writing an AWS Lambda function. The developer wants to log key events that occur while the Lambda function runs. The developer wants to include a unique identifier to associate the events with a specific function invocation. The developer adds the following code to the Lambda function:
//IMG//

Which solution will meet this requirement?

https://img.examtopics.com/aws-certified-developer-associate-dva-c02/image2.png

**A:** Obtain the request identifier from the AWS request ID field in the context object. Configure the application to write logs to standard output.

**B:** Obtain the request identifier from the AWS request ID field in the event object. Configure the application to write logs to a file.

**C:** Obtain the request identifier from the AWS request ID field in the event object. Configure the application to write logs to standard output.

**D:** Obtain the request identifier from the AWS request ID field in the context object. Configure the application to write logs to a file.



**Answer: A**

**Timestamp: 2023-03-23 23:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/103708-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 450 discussion

A developer has an application that uses AWS Lambda functions and AWS CloudFormation templates. Usage of the application has increased. As a result, the Lambda functions are encountering rate limit errors when they retrieve data.

The Lambda functions retrieve an advanced parameter from AWS Systems Manager Parameter Store on every call. The parameter changes only during new deployments. Because the application’s usage is unpredictable, the developer needs a way to avoid the rate limiting.

Which solution will meet these requirements MOST cost-effectively?

**A:** Configure the Lambda functions to use reserved concurrency that is equal to the last month’s average number of concurrent invocations.

**B:** Add a retry mechanism with exponential backoff to the call to Parameter Store.

**C:** Request a service quota increase for Parameter Store GetParameter API operations to match the expected usage of the Lambda functions.

**D:** Add an SSM dynamic reference as an environment variable to the Lambda functions resource in the CloudFormation templates.



**Answer: D**

**Timestamp: 2024-11-05 12:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150773-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 451 discussion

A developer is using an AWS Lambda function to process data. The developer needs to extract custom metrics about processing times from the Lambda logs. The developer needs to analyze the metrics, set alarms, and detect issues in real time.

Which solution will meet these requirements?

**A:** Publish custom metric data to AWS CloudTrail by using the PutMetricData API operation. Classify and collect the metrics. Create graphs and alarms in CloudTrail for the custom metrics.

**B:** Use the open source client libraries provided by Amazon to generate the logs in the Amazon CloudWatch embedded metric format. Use CloudWatch to create the required graphs and alarms for the custom metrics.

**C:** Use Amazon CloudWatch Logs Insights to create custom metrics by querying the logs that come from the Lambda function. Use CloudWatch to create the required graphs and alarms for the custom metrics.

**D:** Create an Amazon Kinesis data stream to stream log events in real time from Lambda. Specify an Amazon S3 bucket as the destination for the Kinesis data stream. Use Amazon CloudWatch to visualize the log data and to set alarms.



**Answer: B**

**Timestamp: 2024-11-05 12:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150775-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 452 discussion

A developer needs to fix an AWS CodeDeploy deployment that failed. During the failed deployment, the developer received the following error message:

“The overall deployment failed because too many individual instances failed deployment, too few healthy instances are available for deployment, or some instances in your deployment group are experiencing problems. (Error code: HEALTH-CONSTRAINTS)”

What are the possible causes of the failed deployment? (Choose two.)

**A:** The CodeDeploy agent was not running on the instances that CodeDeploy was trying to deploy to.

**B:** The unified Amazon CloudWatch agent was not running on the instances that CodeDeploy was trying to deploy to.

**C:** The developer’s IAM role did not have the necessary permissions to perform code deployment to the instances.

**D:** CodeDeploy was trying to deploy to instances that were attached to an IAM instance profile that did not have the required permissions.

**E:** CodeDeploy was trying to deploy to instances that were not set up with correct CodeDeploy health checks.



**Answer: AE**

**Timestamp: 2024-11-07 16:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150946-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 301 discussion

A developer is building a serverless application on AWS for a workflow that processes high volumes of data. In the workflow, an AWS Step Functions state machine invokes several AWS Lambda functions.

One of the Lambda functions occasionally fails because of timeout errors during periods of high demand. The developer must ensure that the workflow automatically retries the failed function invocation if a timeout error occurs.

Which solution will meet this requirement?

**A:** Add a Retry field in the Step Functions state machine definition. Configure the state machine with the maximum number of retry attempts and the timeout error type to retry on.

**B:** Add a Timeout field in the Step Functions state machine definition. Configure the state machine with the maximum number of retry attempts.

**C:** Add a Fail state to the Step Functions state machine definition. Configure the state machine with the maximum number of retry attempts.

**D:** Update the Step Functions state machine to pass the invocation request to an Amazon Simple Notification Service (Amazon SNS) topic. Subscribe a Lambda function to the SNS topic. Configure the Lambda function with the maximum number of retry attempts for a timeout error type.



**Answer: A**

**Timestamp: 2024-02-22 06:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134337-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 302 discussion

A company runs a serverless application on AWS. The application includes an AWS Lambda function. The Lambda function processes data and stores the data in an Amazon RDS for PostgreSQL database. A developer created a user credentials in the database for the application.

The developer needs to use AWS Secrets Manager to manage the user credentials. The password must to be rotated on a regular basis. The solution needs to ensure that there is high availability and no downtime for the application during secret rotation.

What should the developer do to meet these requirements?

**A:** Configure managed rotation with the single user rotation strategy.

**B:** Configure managed rotation with the alternating users rotation strategy.

**C:** Configure automatic rotation with the single user rotation strategy.

**D:** Configure automatic rotation with the alternating users rotation strategy.



**Answer: D**

**Timestamp: 2024-02-18 10:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134124-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 303 discussion

A company runs an application on AWS. The application consists of a static website that is hosted on Amazon S3. The application includes Amazon API Gateway APIs that invoke AWS Lambda functions. During a period of high traffic on the application, application users reported that the application was slow at irregular intervals. There were no failed requests.

A developer needs to find the slow executions across all the Lambda functions.

Which solution will meet these requirements?

**A:** Perform a query across all the Lambda function log groups by using Amazon CloudWatch Logs Insights. Filter on type of report and sort descending by Lambda function execution duration.

**B:** Enable AWS CloudTrail Insights on the account where the Lambda functions are running. After CloudTrail Insights has finished processing, review CloudTrail Insights to find the anomalous functions.

**C:** Enable AWS X-Ray for all the Lambda functions. Configure an X-Ray insight on a new group that includes all the Lambda functions. After the X-Ray insight has finished processing, review the X-Ray logs.

**D:** Set up AWS Glue to crawl through the logs in Amazon CloudWatch Logs for the Lambda functions. Configure an AWS Glue job to transform the logs into a structured format and to output the logs into Amazon S3. Use the Amazon CloudWatch dashboard to visualize the slowest functions based on the duration.



**Answer: C**

**Timestamp: 2024-02-22 06:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134339-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 304 discussion

A company is building a serverless application on AWS. The application uses Amazon API Gateway and AWS Lambda. The company wants to deploy the application to its development, test, and production environments.

Which solution will meet these requirements with the LEAST development effort?

**A:** Use API Gateway stage variables and create Lambda aliases to reference environment-specific resources.

**B:** Use Amazon Elastic Container Service (Amazon ECS) to deploy the application to the environments.

**C:** Duplicate the code for each environment. Deploy the code to a separate API Gateway stage.

**D:** Use AWS Elastic Beanstalk to deploy the application to the environments.



**Answer: A**

**Timestamp: 2024-02-22 07:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134340-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

## Exam AWS Certified Developer - Associate DVA-C02 topic 1 question 305 discussion

A developer uses AWS CloudFormation to deploy an Amazon API Gateway API and an AWS Step Functions state machine. The state machine must reference the API Gateway API after the CloudFormation template is deployed. The developer needs a solution that uses the state machine to reference the API Gateway endpoint.

Which solution will meet these requirements MOST cost-effectively?

**A:** Configure the CloudFormation template to reference the API endpoint in the DefinitionSubstitutions property for the AWS::StepFunctions::StateMachine resource.

**B:** Configure the CloudFormation template to store the API endpoint in an environment variable for the AWS::StepFunctions::StateMachine resource. Configure the state machine to reference the environment variable.

**C:** Configure the CloudFormation template to store the API endpoint in a standard AWS::SecretsManager::Secret resource. Configure the state machine to reference the resource.

**D:** Configure the CloudFormation template to store the API endpoint in a standard AWS::AppConfig::ConfigurationProfile resource. Configure the state machine to reference the resource.



**Answer: A**

**Timestamp: 2024-02-22 07:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/134341-exam-aws-certified-developer-associate-dva-c02-topic-1/)

----------------------------------------

