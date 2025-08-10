# Exam Topics Questions

@thatonecodes

## Examtopics AWS Certified Data Engineer Associate DEA C01_6 question #1

A data engineer is processing and analyzing multiple terabytes of raw data that is in Amazon S3. The data engineer needs to clean and prepare the data. Then the data engineer needs to load the data into Amazon Redshift for analytics.

The data engineer needs a solution that will give data analysts the ability to perform complex queries. The solution must eliminate the need to perform complex extract, transform, and load (ETL) processes or to manage infrastructure.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Use Amazon EMR to prepare the data. Use AWS Step Functions to load the data into Amazon Redshift. Use Amazon QuickSight to run queries.

**B:** Use AWS Glue DataBrew to prepare the data. Use AWS Glue to load the data into Amazon Redshift. Use Amazon Redshift to run queries.

**C:** Use AWS Lambda to prepare the data. Use Amazon Kinesis Data Firehose to load the data into Amazon Redshift. Use Amazon Athena to run queries.

**D:** Use AWS Glue to prepare the data. Use AWS Database Migration Service (AVVS DMS) to load the data into Amazon Redshift. Use Amazon Redshift Spectrum to run queries.



**Answer: B**

**Timestamp: 2024-08-07 01:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145188-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_6 question #3

A company uses an AWS Lambda function to transfer files from a legacy SFTP environment to Amazon S3 buckets. The Lambda function is VPC enabled to ensure that all communications between the Lambda function and other AVS services that are in the same VPC environment will occur over a secure network.

The Lambda function is able to connect to the SFTP environment successfully. However, when the Lambda function attempts to upload files to the S3 buckets, the Lambda function returns timeout errors. A data engineer must resolve the timeout issues in a secure way.

Which solution will meet these requirements in the MOST cost-effective way?

**A:** Create a NAT gateway in the public subnet of the VPC. Route network traffic to the NAT gateway.

**B:** Create a VPC gateway endpoint for Amazon S3. Route network traffic to the VPC gateway endpoint.

**C:** Create a VPC interface endpoint for Amazon S3. Route network traffic to the VPC interface endpoint.

**D:** Use a VPC internet gateway to connect to the internet. Route network traffic to the VPC internet gateway.



**Answer: B**

**Timestamp: 2024-08-07 01:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145187-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_33 question #12

A company stores details about transactions in an Amazon S3 bucket. The company wants to log all writes to the S3 bucket into another S3 bucket that is in the same AWS Region.
Which solution will meet this requirement with the LEAST operational effort?

**A:** Configure an S3 Event Notifications rule for all activities on the transactions S3 bucket to invoke an AWS Lambda function. Program the Lambda function to write the event to Amazon Kinesis Data Firehose. Configure Kinesis Data Firehose to write the event to the logs S3 bucket.

**B:** Create a trail of management events in AWS CloudTraiL. Configure the trail to receive data from the transactions S3 bucket. Specify an empty prefix and write-only events. Specify the logs S3 bucket as the destination bucket.

**C:** Configure an S3 Event Notifications rule for all activities on the transactions S3 bucket to invoke an AWS Lambda function. Program the Lambda function to write the events to the logs S3 bucket.

**D:** Create a trail of data events in AWS CloudTraiL. Configure the trail to receive data from the transactions S3 bucket. Specify an empty prefix and write-only events. Specify the logs S3 bucket as the destination bucket.



**Answer: D**

**Timestamp: 2024-02-02 11:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132684-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_12 question #2

A company is building an inventory management system and an inventory reordering system to automatically reorder products. Both systems use Amazon Kinesis Data Streams. The inventory management system uses the Amazon Kinesis Producer Library (KPL) to publish data to a stream. The inventory reordering system uses the Amazon Kinesis Client Library (KCL) to consume data from the stream. The company configures the stream to scale up and down as needed.

Before the company deploys the systems to production, the company discovers that the inventory reordering system received duplicated data.

Which factors could have caused the reordering system to receive duplicated data? (Choose two.)

**A:** The producer experienced network-related timeouts.

**B:** The stream’s value for the IteratorAgeMilliseconds metric was too high.

**C:** There was a change in the number of shards, record processors, or both.

**D:** The AggregationEnabled configuration property was set to true.

**E:** The max_records configuration property was set to a number that was too high.



**Answer: AC**

**Timestamp: 2024-10-27 13:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/150357-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_12 question #4

A data engineer needs to securely transfer 5 TB of data from an on-premises data center to an Amazon S3 bucket. Approximately 5% of the data changes every day. Updates to the data need to be regularly proliferated to the S3 bucket. The data includes files that are in multiple formats. The data engineer needs to automate the transfer process and must schedule the process to run periodically.
Which AWS service should the data engineer use to transfer the data in the MOST operationally efficient way?

**A:** AWS DataSync

**B:** AWS Glue

**C:** AWS Direct Connect

**D:** Amazon S3 Transfer Acceleration



**Answer: A**

**Timestamp: 2024-01-20 11:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131676-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_12 question #8

An ecommerce company operates a complex order fulfilment process that spans several operational systems hosted in AWS. Each of the operational systems has a Java Database
Connectivity (JDBC)-compliant relational database where the latest processing state is captured.

The company needs to give an operations team the ability to track orders on an hourly basis across the entire fulfillment process.

Which solution will meet these requirements with the LEAST development overhead?

**A:** Use AWS Glue to build ingestion pipelines from the operational systems into Amazon Redshift Build dashboards in Amazon QuickSight that track the orders.

**B:** Use AWS Glue to build ingestion pipelines from the operational systems into Amazon DynamoDBuild dashboards in Amazon QuickSight that track the orders.

**C:** Use AWS Database Migration Service (AWS DMS) to capture changed records in the operational systems. Publish the changes to an Amazon DynamoDB table in a different AWS region from the source database. Build Grafana dashboards that track the orders.

**D:** Use AWS Database Migration Service (AWS DMS) to capture changed records in the operational systems. Publish the changes to an Amazon DynamoDB table in a different AWS region from the source database. Build Amazon QuickSight dashboards that track the orders.



**Answer: A**

**Timestamp: 2024-11-25 02:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/151928-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_12 question #9

A data engineer needs to use Amazon Neptune to develop graph applications.

Which programming languages should the engineer use to develop the graph applications? (Choose two.)

**A:** Gremlin

**B:** SQL

**C:** ANSI SQL

**D:** SPARQL

**E:** Spark SQL



**Answer: AD**

**Timestamp: 2024-11-25 00:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/151917-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_12 question #20

A mobile gaming company wants to capture data from its gaming app. The company wants to make the data available to three internal consumers of the data. The data records are approximately 20 KB in size.

The company wants to achieve optimal throughput from each device that runs the gaming app. Additionally, the company wants to develop an application to process data streams. The stream-processing application must have dedicated throughput for each internal consumer.

Which solution will meet these requirements?

**A:** Configure the mobile app to call the PutRecords API operation to send data to Amazon Kinesis Data Streams. Use the enhanced fan-out feature with a stream for each internal consumer.

**B:** Configure the mobile app to call the PutRecordBatch API operation to send data to Amazon Kinesis Data Firehose. Submit an AWS Support case to turn on dedicated throughput for the company’s AWS account. Allow each internal consumer to access the stream.

**C:** Configure the mobile app to use the Amazon Kinesis Producer Library (KPL) to send data to Amazon Kinesis Data Firehose. Use the enhanced fan-out feature with a stream for each internal consumer.

**D:** Configure the mobile app to call the PutRecords API operation to send data to Amazon Kinesis Data Streams. Host the stream-processing application for each internal consumer on Amazon EC2 instances. Configure auto scaling for the EC2 instances.



**Answer: A**

**Timestamp: 2024-09-19 02:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/147824-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_30 question #10

A company uses AWS Step Functions to orchestrate a data pipeline. The pipeline consists of Amazon EMR jobs that ingest data from data sources and store the data in an Amazon S3 bucket. The pipeline also includes EMR jobs that load the data to Amazon Redshift.
The company's cloud infrastructure team manually built a Step Functions state machine. The cloud infrastructure team launched an EMR cluster into a VPC to support the EMR jobs. However, the deployed Step Functions state machine is not able to run the EMR jobs.
Which combination of steps should the company take to identify the reason the Step Functions state machine is not able to run the EMR jobs? (Choose two.)

**A:** Use AWS CloudFormation to automate the Step Functions state machine deployment. Create a step to pause the state machine during the EMR jobs that fail. Configure the step to wait for a human user to send approval through an email message. Include details of the EMR task in the email message for further analysis.

**B:** Verify that the Step Functions state machine code has all IAM permissions that are necessary to create and run the EMR jobs. Verify that the Step Functions state machine code also includes IAM permissions to access the Amazon S3 buckets that the EMR jobs use. Use Access Analyzer for S3 to check the S3 access properties.

**C:** Check for entries in Amazon CloudWatch for the newly created EMR cluster. Change the AWS Step Functions state machine code to use Amazon EMR on EKS. Change the IAM access policies and the security group configuration for the Step Functions state machine code to reflect inclusion of Amazon Elastic Kubernetes Service (Amazon EKS).

**D:** Query the flow logs for the VPC. Determine whether the traffic that originates from the EMR cluster can successfully reach the data providers. Determine whether any security group that might be attached to the Amazon EMR cluster allows connections to the data source servers on the informed ports.

**E:** Check the retry scenarios that the company configured for the EMR jobs. Increase the number of seconds in the interval between each EMR task. Validate that each fallback state has the appropriate catch for each decision state. Configure an Amazon Simple Notification Service (Amazon SNS) topic to store the error messages.



**Answer: BD**

**Timestamp: 2024-01-28 22:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132353-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_30 question #11

A company is developing an application that runs on Amazon EC2 instances. Currently, the data that the application generates is temporary. However, the company needs to persist the data, even if the EC2 instances are terminated.
A data engineer must launch new EC2 instances from an Amazon Machine Image (AMI) and configure the instances to preserve the data.
Which solution will meet this requirement?

**A:** Launch new EC2 instances by using an AMI that is backed by an EC2 instance store volume that contains the application data. Apply the default settings to the EC2 instances.

**B:** Launch new EC2 instances by using an AMI that is backed by a root Amazon Elastic Block Store (Amazon EBS) volume that contains the application data. Apply the default settings to the EC2 instances.

**C:** Launch new EC2 instances by using an AMI that is backed by an EC2 instance store volume. Attach an Amazon Elastic Block Store (Amazon EBS) volume to contain the application data. Apply the default settings to the EC2 instances.

**D:** Launch new EC2 instances by using an AMI that is backed by an Amazon Elastic Block Store (Amazon EBS) volume. Attach an additional EC2 instance store volume to contain the application data. Apply the default settings to the EC2 instances.



**Answer: C**

**Timestamp: 2024-01-28 22:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132354-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_30 question #19

A company uses Amazon Athena to run SQL queries for extract, transform, and load (ETL) tasks by using Create Table As Select (CTAS). The company must use Apache Spark instead of SQL to generate analytics.
Which solution will give the company the ability to use Spark to access Athena?

**A:** Athena query settings

**B:** Athena workgroup

**C:** Athena data source

**D:** Athena query editor



**Answer: B**

**Timestamp: 2024-02-02 09:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132667-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_30 question #21

A company needs to partition the Amazon S3 storage that the company uses for a data lake. The partitioning will use a path of the S3 object keys in the following format: s3://bucket/prefix/year=2023/month=01/day=01.
A data engineer must ensure that the AWS Glue Data Catalog synchronizes with the S3 storage when the company adds new partitions to the bucket.
Which solution will meet these requirements with the LEAST latency?

**A:** Schedule an AWS Glue crawler to run every morning.

**B:** Manually run the AWS Glue CreatePartition API twice each day.

**C:** Use code that writes data to Amazon S3 to invoke the Boto3 AWS Glue create_partition API call.

**D:** Run the MSCK REPAIR TABLE command from the AWS Glue console.



**Answer: C**

**Timestamp: 2024-01-29 00:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132364-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_30 question #22

A media company uses software as a service (SaaS) applications to gather data by using third-party tools. The company needs to store the data in an Amazon S3 bucket. The company will use Amazon Redshift to perform analytics based on the data.
Which AWS service or feature will meet these requirements with the LEAST operational overhead?

**A:** Amazon Managed Streaming for Apache Kafka (Amazon MSK)

**B:** Amazon AppFlow

**C:** AWS Glue Data Catalog

**D:** Amazon Kinesis



**Answer: B**

**Timestamp: 2024-02-02 09:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132669-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_6 question #5

A company reads data from customer databases that run on Amazon RDS. The databases contain many inconsistent fields. For example, a customer record field that iPnamed place_id in one database is named location_id in another database. The company needs to link customer records across different databases, even when customer record fields do not match.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create a provisioned Amazon EMR cluster to process and analyze data in the databases. Connect to the Apache Zeppelin notebook. Use the FindMatches transform to find duplicate records in the data.

**B:** Create an AWS Glue crawler to craw the databases. Use the FindMatches transform to find duplicate records in the data. Evaluate and tune the transform by evaluating the performance and results.

**C:** Create an AWS Glue crawler to craw the databases. Use Amazon SageMaker to construct Apache Spark ML pipelines to find duplicate records in the data.

**D:** Create a provisioned Amazon EMR cluster to process and analyze data in the databases. Connect to the Apache Zeppelin notebook. Use an Apache Spark ML model to find duplicate records in the data. Evaluate and tune the model by evaluating the performance and results.



**Answer: B**

**Timestamp: 2024-08-09 08:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145289-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_6 question #6

A finance company receives data from third-party data providers and stores the data as objects in an Amazon S3 bucket.

The company ran an AWS Glue crawler on the objects to create a data catalog. The AWS Glue crawler created multiple tables. However, the company expected that the crawler would create only one table.

The company needs a solution that will ensure the AVS Glue crawler creates only one table.

Which combination of solutions will meet this requirement? (Choose two.)

**A:** Ensure that the object format, compression type, and schema are the same for each object.

**B:** Ensure that the object format and schema are the same for each object. Do not enforce consistency for the compression type of each object.

**C:** Ensure that the schema is the same for each object. Do not enforce consistency for the file format and compression type of each object.

**D:** Ensure that the structure of the prefix for each S3 object name is consistent.

**E:** Ensure that all S3 object names follow a similar pattern.



**Answer: AD**

**Timestamp: 2024-08-09 09:25:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145291-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_6 question #7

An application consumes messages from an Amazon Simple Queue Service (Amazon SQS) queue. The application experiences occasional downtime. As a result of the downtime, messages within the queue expire and are deleted after 1 day. The message deletions cause data loss for the application.

Which solutions will minimize data loss for the application? (Choose two.)

**A:** Increase the message retention period

**B:** Increase the visibility timeout.

**C:** Attach a dead-letter queue (DLQ) to the SQS queue.

**D:** Use a delay queue to delay message delivery

**E:** Reduce message processing time.



**Answer: AC**

**Timestamp: 2024-08-14 13:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145713-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_33 question #13

A data engineer needs to maintain a central metadata repository that users access through Amazon EMR and Amazon Athena queries. The repository needs to provide the schema and properties of many tables. Some of the metadata is stored in Apache Hive. The data engineer needs to import the metadata from Hive into the central metadata repository.
Which solution will meet these requirements with the LEAST development effort?

**A:** Use Amazon EMR and Apache Ranger.

**B:** Use a Hive metastore on an EMR cluster.

**C:** Use the AWS Glue Data Catalog.

**D:** Use a metastore on an Amazon RDS for MySQL DB instance.



**Answer: C**

**Timestamp: 2024-02-02 12:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132685-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_33 question #14

A company needs to build a data lake in AWS. The company must provide row-level data access and column-level data access to specific teams. The teams will access the data by using Amazon Athena, Amazon Redshift Spectrum, and Apache Hive from Amazon EMR.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Use Amazon S3 for data lake storage. Use S3 access policies to restrict data access by rows and columns. Provide data access through Amazon S3.

**B:** Use Amazon S3 for data lake storage. Use Apache Ranger through Amazon EMR to restrict data access by rows and columns. Provide data access by using Apache Pig.

**C:** Use Amazon Redshift for data lake storage. Use Redshift security policies to restrict data access by rows and columns. Provide data access by using Apache Spark and Amazon Athena federated queries.

**D:** Use Amazon S3 for data lake storage. Use AWS Lake Formation to restrict data access by rows and columns. Provide data access through AWS Lake Formation.



**Answer: D**

**Timestamp: 2024-02-02 12:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132686-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_33 question #15

A company created an extract, transform, and load (ETL) data pipeline in AWS Glue. A data engineer must crawl a table that is in Microsoft SQL Server. The data engineer needs to extract, transform, and load the output of the crawl to an Amazon S3 bucket. The data engineer also must orchestrate the data pipeline.
Which AWS service or feature will meet these requirements MOST cost-effectively?

**A:** AWS Step Functions

**B:** AWS Glue workflows

**C:** AWS Glue Studio

**D:** Amazon Managed Workflows for Apache Airflow (Amazon MWAA)



**Answer: B**

**Timestamp: 2024-01-18 09:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131469-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_33 question #17

An airline company is collecting metrics about flight activities for analytics. The company is conducting a proof of concept (POC) test to show how analytics can provide insights that the company can use to increase on-time departures.
The POC test uses objects in Amazon S3 that contain the metrics in .csv format. The POC test uses Amazon Athena to query the data. The data is partitioned in the S3 bucket by date.
As the amount of data increases, the company wants to optimize the storage solution to improve query performance.
Which combination of solutions will meet these requirements? (Choose two.)

**A:** Add a randomized string to the beginning of the keys in Amazon S3 to get more throughput across partitions.

**B:** Use an S3 bucket that is in the same account that uses Athena to query the data.

**C:** Use an S3 bucket that is in the same AWS Region where the company runs Athena queries.

**D:** Preprocess the .csv data to JSON format by fetching only the document keys that the query requires.

**E:** Preprocess the .csv data to Apache Parquet format by fetching only the data blocks that are needed for predicates.



**Answer: CE**

**Timestamp: 2024-02-02 12:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132687-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_4 question #16

A company wants to migrate data from an Amazon RDS for PostgreSQL DB instance in the eu-east-1 Region of an AWS account named Account_A. The company will migrate the data to an Amazon Redshift cluster in the eu-west-1 Region of an AWS account named Account_B.

Which solution will give AWS Database Migration Service (AWS DMS) the ability to replicate data between two data stores?

**A:** Set up an AWS DMS replication instance in Account_B in eu-west-1.

**B:** Set up an AWS DMS replication instance in Account_B in eu-east-1.

**C:** Set up an AWS DMS replication instance in a new AWS account in eu-west-1.

**D:** Set up an AWS DMS replication instance in Account_A in eu-east-1.



**Answer: A**

**Timestamp: 2024-06-29 09:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143054-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_4 question #18

A company uses Amazon S3 as a data lake. The company sets up a data warehouse by using a multi-node Amazon Redshift cluster. The company organizes the data files in the data lake based on the data source of each data file.

The company loads all the data files into one table in the Redshift cluster by using a separate COPY command for each data file location. This approach takes a long time to load all the data files into the table. The company must increase the speed of the data ingestion. The company does not want to increase the cost of the process.

Which solution will meet these requirements?

**A:** Use a provisioned Amazon EMR cluster to copy all the data files into one folder. Use a COPY command to load the data into Amazon Redshift.

**B:** Load all the data files in parallel into Amazon Aurora. Run an AWS Glue job to load the data into Amazon Redshift.

**C:** Use an AWS Give job to copy all the data files into one folder. Use a COPY command to load the data into Amazon Redshift.

**D:** Create a manifest file that contains the data file locations. Use a COPY command to load the data into Amazon Redshift.



**Answer: D**

**Timestamp: 2024-06-29 09:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143056-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_4 question #23

A company plans to use Amazon Kinesis Data Firehose to store data in Amazon S3. The source data consists of 2 MB .csv files. The company must convert the .csv files to JSON format. The company must store the files in Apache Parquet format.

Which solution will meet these requirements with the LEAST development effort?

**A:** Use Kinesis Data Firehose to convert the .csv files to JSON. Use an AWS Lambda function to store the files in Parquet format.

**B:** Use Kinesis Data Firehose to convert the .csv files to JSON and to store the files in Parquet format.

**C:** Use Kinesis Data Firehose to invoke an AWS Lambda function that transforms the .csv files to JSON and stores the files in Parquet format.

**D:** Use Kinesis Data Firehose to invoke an AWS Lambda function that transforms the .csv files to JSON. Use Kinesis Data Firehose to store the files in Parquet format.



**Answer: D**

**Timestamp: 2024-06-29 09:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143057-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_4 question #24

A company is using an AWS Transfer Family server to migrate data from an on-premises environment to AWS. Company policy mandates the use of TLS 1.2 or above to encrypt the data in transit.

Which solution will meet these requirements?

**A:** Generate new SSH keys for the Transfer Family server. Make the old keys and the new keys available for use.

**B:** Update the security group rules for the on-premises network to allow only connections that use TLS 1.2 or above.

**C:** Update the security policy of the Transfer Family server to specify a minimum protocol version of TLS 1.2

**D:** Install an SSL certificate on the Transfer Family server to encrypt data transfers by using TLS 1.2.



**Answer: C**

**Timestamp: 2024-06-29 09:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143058-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_4 question #25

A company wants to migrate an application and an on-premises Apache Kafka server to AWS. The application processes incremental updates that an on-premises Oracle database sends to the Kafka server. The company wants to use the replatform migration strategy instead of the refactor strategy.

Which solution will meet these requirements with the LEAST management overhead?

**A:** Amazon Kinesis Data Streams

**B:** Amazon Managed Streaming for Apache Kafka (Amazon MSK) provisioned cluster

**C:** Amazon Kinesis Data Firehose

**D:** Amazon Managed Streaming for Apache Kafka (Amazon MSK) Serverless



**Answer: D**

**Timestamp: 2024-06-29 09:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143060-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_5 question #26

A data engineer is building an automated extract, transform, and load (ETL) ingestion pipeline by using AWS Glue. The pipeline ingests compressed files that are in an Amazon S3 bucket. The ingestion pipeline must support incremental data processing.

Which AWS Glue feature should the data engineer use to meet this requirement?

**A:** Workflows

**B:** Triggers

**C:** Job bookmarks

**D:** Classifiers



**Answer: C**

**Timestamp: 2024-06-29 09:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143061-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_5 question #27

A banking company uses an application to collect large volumes of transactional data. The company uses Amazon Kinesis Data Streams for real-time analytics. The company’s application uses the PutRecord action to send data to Kinesis Data Streams.

A data engineer has observed network outages during certain times of day. The data engineer wants to configure exactly-once delivery for the entire processing pipeline.

Which solution will meet this requirement?

**A:** Design the application so it can remove duplicates during processing by embedding a unique ID in each record at the source.

**B:** Update the checkpoint configuration of the Amazon Managed Service for Apache Flink (previously known as Amazon Kinesis Data Analytics) data collection application to avoid duplicate processing of events.

**C:** Design the data source so events are not ingested into Kinesis Data Streams multiple times.

**D:** Stop using Kinesis Data Streams. Use Amazon EMR instead. Use Apache Flink and Apache Spark Streaming in Amazon EMR.



**Answer: A**

**Timestamp: 2024-06-29 10:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143062-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_5 question #28

A company stores logs in an Amazon S3 bucket. When a data engineer attempts to access several log files, the data engineer discovers that some files have been unintentionally deleted.

The data engineer needs a solution that will prevent unintentional file deletion in the future.

Which solution will meet this requirement with the LEAST operational overhead?

**A:** Manually back up the S3 bucket on a regular basis.

**B:** Enable S3 Versioning for the S3 bucket.

**C:** Configure replication for the S3 bucket.

**D:** Use an Amazon S3 Glacier storage class to archive the data that is in the S3 bucket.



**Answer: B**

**Timestamp: 2024-06-30 23:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143120-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_5 question #29

A manufacturing company collects sensor data from its factory floor to monitor and enhance operational efficiency. The company uses Amazon Kinesis Data Streams to publish the data that the sensors collect to a data stream. Then Amazon Kinesis Data Firehose writes the data to an Amazon S3 bucket.
The company needs to display a real-time view of operational efficiency on a large screen in the manufacturing facility.
Which solution will meet these requirements with the LOWEST latency?

**A:** Use Amazon Managed Service for Apache Flink (previously known as Amazon Kinesis Data Analytics) to process the sensor data. Use a connector for Apache Flink to write data to an Amazon Timestream database. Use the Timestream database as a source to create a Grafana dashboard.

**B:** Configure the S3 bucket to send a notification to an AWS Lambda function when any new object is created. Use the Lambda function to publish the data to Amazon Aurora. Use Aurora as a source to create an Amazon QuickSight dashboard.

**C:** Use Amazon Managed Service for Apache Flink (previously known as Amazon Kinesis Data Analytics) to process the sensor data. Create a new Data Firehose delivery stream to publish data directly to an Amazon Timestream database. Use the Timestream database as a source to create an Amazon QuickSight dashboard.

**D:** Use AWS Glue bookmarks to read sensor data from the S3 bucket in real time. Publish the data to an Amazon Timestream database. Use the Timestream database as a source to create a Grafana dashboard.



**Answer: A**

**Timestamp: 2024-01-18 09:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131474-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_5 question #30

A telecommunications company collects network usage data throughout each day at a rate of several thousand data points each second. The company runs an application to process the usage data in real time. The company aggregates and stores the data in an Amazon Aurora DB instance.

Sudden drops in network usage usually indicate a network outage. The company must be able to identify sudden drops in network usage so the company can take immediate remedial actions.

Which solution will meet this requirement with the LEAST latency?

**A:** Create an AWS Lambda function to query Aurora for drops in network usage. Use Amazon EventBridge to automatically invoke the Lambda function every minute.

**B:** Modify the processing application to publish the data to an Amazon Kinesis data stream. Create an Amazon Managed Service for Apache Flink (previously known as Amazon Kinesis Data Analytics) application to detect drops in network usage.

**C:** Replace the Aurora database with an Amazon DynamoDB table. Create an AWS Lambda function to query the DynamoDB table for drops in network usage every minute. Use DynamoDB Accelerator (DAX) between the processing application and DynamoDB table.

**D:** Create an AWS Lambda function within the Database Activity Streams feature of Aurora to detect drops in network usage.



**Answer: B**

**Timestamp: 2024-06-30 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/143122-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_11 question #31

A technology company currently uses Amazon Kinesis Data Streams to collect log data in real time. The company wants to use Amazon Redshift for downstream real-time queries and to enrich the log data.

Which solution will ingest data into Amazon Redshift with the LEAST operational overhead?

**A:** Set up an Amazon Kinesis Data Firehose delivery stream to send data to a Redshift provisioned cluster table.

**B:** Set up an Amazon Kinesis Data Firehose delivery stream to send data to Amazon S3. Configure a Redshift provisioned cluster to load data every minute.

**C:** Configure Amazon Managed Service for Apache Flink (previously known as Amazon Kinesis Data Analytics) to send data directly to a Redshift provisioned cluster table.

**D:** Use Amazon Redshift streaming ingestion from Kinesis Data Streams and to present data as a materialized view.



**Answer: D**

**Timestamp: 2024-09-05 03:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146967-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_11 question #32

A company maintains a data warehouse in an on-premises Oracle database. The company wants to build a data lake on AWS. The company wants to load data warehouse tables into Amazon S3 and synchronize the tables with incremental data that arrives from the data warehouse every day.

Each table has a column that contains monotonically increasing values. The size of each table is less than 50 GB. The data warehouse tables are refreshed every night between 1 AM and 2 AM. A business intelligence team queries the tables between 10 AM and 8 PM every day.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Use an AWS Database Migration Service (AWS DMS) full load plus CDC job to load tables that contain monotonically increasing data columns from the on-premises data warehouse to Amazon S3. Use custom logic in AWS Glue to append the daily incremental data to a full-load copy that is in Amazon S3.

**B:** Use an AWS Glue Java Database Connectivity (JDBC) connection. Configure a job bookmark for a column that contains monotonically increasing values. Write custom logic to append the daily incremental data to a full-load copy that is in Amazon S3.

**C:** Use an AWS Database Migration Service (AWS DMS) full load migration to load the data warehouse tables into Amazon S3 every day. Overwrite the previous day's full-load copy every day.

**D:** Use AWS Glue to load a full copy of the data warehouse tables into Amazon S3 every day. Overwrite the previous day's full-load copy every day.



**Answer: A**

**Timestamp: 2024-09-19 02:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/147821-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_11 question #33

A company is building a data lake for a new analytics team. The company is using Amazon S3 for storage and Amazon Athena for query analysis. All data that is in Amazon S3 is in Apache Parquet format.

The company is running a new Oracle database as a source system in the company’s data center. The company has 70 tables in the Oracle database. All the tables have primary keys. Data can occasionally change in the source system. The company wants to ingest the tables every day into the data lake.

Which solution will meet this requirement with the LEAST effort?

**A:** Create an Apache Sqoop job in Amazon EMR to read the data from the Oracle database. Configure the Sqoop job to write the data to Amazon S3 in Parquet format.

**B:** Create an AWS Glue connection to the Oracle database. Create an AWS Glue bookmark job to ingest the data incrementally and to write the data to Amazon S3 in Parquet format.

**C:** Create an AWS Database Migration Service (AWS DMS) task for ongoing replication. Set the Oracle database as the source. Set Amazon S3 as the target. Configure the task to write the data in Parquet format.

**D:** Create an Oracle database in Amazon RDS. Use AWS Database Migration Service (AWS DMS) to migrate the on-premises Oracle database to Amazon RDS. Configure triggers on the tables to invoke AWS Lambda functions to write changed records to Amazon S3 in Parquet format.



**Answer: C**

**Timestamp: 2024-09-05 08:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/146993-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_11 question #34

A transportation company wants to track vehicle movements by capturing geolocation records. The records are 10 bytes in size. The company receives up to 10.000 records every second. Data transmission delays of a few minutes are acceptable because of unreliable network conditions.

The transportation company wants to use Amazon Kinesis Data Streams to ingest the geolocation data. The company needs a reliable mechanism to send data to Kinesis Data Streams. The company needs to maximize the throughput efficiency of the Kinesis shards.

Which solution will meet these requirements in the MOST operationally efficient way?

**A:** Kinesis Agent

**B:** Kinesis Producer Library (KPL)

**C:** Amazon Kinesis Data Firehose

**D:** Kinesis SDK



**Answer: B**

**Timestamp: 2024-09-08 09:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/147168-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_11 question #35

An investment company needs to manage and extract insights from a volume of semi-structured data that grows continuously.

A data engineer needs to deduplicate the semi-structured data, remove records that are duplicates, and remove common misspellings of duplicates.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Use the FindMatches feature of AWS Glue to remove duplicate records.

**B:** Use non-Windows functions in Amazon Athena to remove duplicate records.

**C:** Use Amazon Neptune ML and an Apache Gremlin script to remove duplicate records.

**D:** Use the global tables feature of Amazon DynamoDB to prevent duplicate data.



**Answer: A**

**Timestamp: 2024-09-19 02:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/147823-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_8 question #36

A company has implemented a lake house architecture in Amazon Redshift. The company needs to give users the ability to authenticate into Redshift query editor by using a third-party identity provider (IdP).

A data engineer must set up the authentication mechanism.

What is the first step the data engineer should take to meet this requirement?

**A:** Register the third-party IdP as an identity provider in the configuration settings of the Redshift cluster.

**B:** Register the third-party IdP as an identity provider from within Amazon Redshift.

**C:** Register the third-party IdP as an identity provider for AVS Secrets Manager. Configure Amazon Redshift to use Secrets Manager to manage user credentials.

**D:** Register the third-party IdP as an identity provider for AWS Certificate Manager (ACM). Configure Amazon Redshift to use ACM to manage user credentials.



**Answer: B**

**Timestamp: 2024-08-09 12:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145294-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_8 question #37

A company currently uses a provisioned Amazon EMR cluster that includes general purpose Amazon EC2 instances. The EMR cluster uses EMR managed scaling between one to five task nodes for the company’s long-running Apache Spark extract, transform, and load (ETL) job. The company runs the ETL job every day.

When the company runs the ETL job, the EMR cluster quickly scales up to five nodes. The EMR cluster often reaches maximum CPU usage, but the memory usage remains under 30%.

The company wants to modify the EMR cluster configuration to reduce the EMR costs to run the daily ETL job.

Which solution will meet these requirements MOST cost-effectively?

**A:** Increase the maximum number of task nodes for EMR managed scaling to 10.

**B:** Change the task node type from general purpose EC2 instances to memory optimized EC2 instances.

**C:** Switch the task node type from general purpose Re instances to compute optimized EC2 instances.

**D:** Reduce the scaling cooldown period for the provisioned EMR cluster.



**Answer: C**

**Timestamp: 2024-08-06 07:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145106-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_8 question #38

A company uploads .csv files to an Amazon S3 bucket. The company’s data platform team has set up an AWS Glue crawler to perform data discovery and to create the tables and schemas.

An AWS Glue job writes processed data from the tables to an Amazon Redshift database. The AWS Glue job handles column mapping and creates the Amazon Redshift tables in the Redshift database appropriately.

If the company reruns the AWS Glue job for any reason, duplicate records are introduced into the Amazon Redshift tables. The company needs a solution that will update the Redshift tables without duplicates.

Which solution will meet these requirements?

**A:** Modify the AWS Glue job to copy the rows into a staging Redshift table. Add SQL commands to update the existing rows with new values from the staging Redshift table.

**B:** Modify the AWS Glue job to load the previously inserted data into a MySQL database. Perform an upsert operation in the MySQL database. Copy the results to the Amazon Redshift tables.

**C:** Use Apache Spark’s DataFrame dropDuplicates() API to eliminate duplicates. Write the data to the Redshift tables.

**D:** Use the AWS Glue ResolveChoice built-in transform to select the value of the column from the most recent record.



**Answer: A**

**Timestamp: 2024-08-06 07:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145107-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_8 question #39

A company is using Amazon Redshift to build a data warehouse solution. The company is loading hundreds of files into a fact table that is in a Redshift cluster.

The company wants the data warehouse solution to achieve the greatest possible throughput. The solution must use cluster resources optimally when the company loads data into the fact table.

Which solution will meet these requirements?

**A:** Use multiple COPY commands to load the data into the Redshift cluster.

**B:** Use S3DistCp to load multiple files into Hadoop Distributed File System (HDFS). Use an HDFS connector to ingest the data into the Redshift cluster.

**C:** Use a number of INSERT statements equal to the number of Redshift cluster nodes. Load the data in parallel into each node.

**D:** Use a single COPY command to load the data into the Redshift cluster.



**Answer: D**

**Timestamp: 2024-08-04 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145007-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_8 question #40

A company ingests data from multiple data sources and stores the data in an Amazon S3 bucket. An AWS Glue extract, transform, and load (ETL) job transforms the data and writes the transformed data to an Amazon S3 based data lake. The company uses Amazon Athena to query the data that is in the data lake.

The company needs to identify matching records even when the records do not have a common unique identifier.

Which solution will meet this requirement?

**A:** Use Amazon Macie pattern matching as part of the ETL job.

**B:** Train and use the AWS Glue PySpark Filter class in the ETL job.

**C:** Partition tables and use the ETL job to partition the data on a unique identifier.

**D:** Train and use the AWS Lake Formation FindMatches transform in the ETL job.



**Answer: D**

**Timestamp: 2024-08-06 07:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145116-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_2 question #41

A data engineer is building a data orchestration workflow. The data engineer plans to use a hybrid model that includes some on-premises resources and some resources that are in the cloud. The data engineer wants to prioritize portability and open source resources.

Which service should the data engineer use in both the on-premises environment and the cloud-based environment?

**A:** AWS Data Exchange

**B:** Amazon Simple Workflow Service (Amazon SWF)

**C:** Amazon Managed Workflows for Apache Airflow (Amazon MWAA)

**D:** AWS Glue



**Answer: C**

**Timestamp: 2024-06-15 11:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142577-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_2 question #42

A gaming company uses a NoSQL database to store customer information. The company is planning to migrate to AWS.

The company needs a fully managed AWS solution that will handle high online transaction processing (OLTP) workload, provide single-digit millisecond performance, and provide high availability around the world.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Amazon Keyspaces (for Apache Cassandra)

**B:** Amazon DocumentDB (with MongoDB compatibility)

**C:** Amazon DynamoDB

**D:** Amazon Timestream



**Answer: C**

**Timestamp: 2024-06-14 21:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142542-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_2 question #43

A data engineer creates an AWS Lambda function that an Amazon EventBridge event will invoke. When the data engineer tries to invoke the Lambda function by using an EventBridge event, an AccessDeniedException message appears.

How should the data engineer resolve the exception?

**A:** Ensure that the trust policy of the Lambda function execution role allows EventBridge to assume the execution role.

**B:** Ensure that both the IAM role that EventBridge uses and the Lambda function's resource-based policy have the necessary permissions.

**C:** Ensure that the subnet where the Lambda function is deployed is configured to be a private subnet.

**D:** Ensure that EventBridge schemas are valid and that the event mapping configuration is correct.



**Answer: B**

**Timestamp: 2024-06-15 11:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142578-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_2 question #44

A company uses a data lake that is based on an Amazon S3 bucket. To comply with regulations, the company must apply two layers of server-side encryption to files that are uploaded to the S3 bucket. The company wants to use an AWS Lambda function to apply the necessary encryption.

Which solution will meet these requirements?

**A:** Use both server-side encryption with AWS KMS keys (SSE-KMS) and the Amazon S3 Encryption Client.

**B:** Use dual-layer server-side encryption with AWS KMS keys (DSSE-KMS).

**C:** Use server-side encryption with customer-provided keys (SSE-C) before files are uploaded.

**D:** Use server-side encryption with AWS KMS keys (SSE-KMS).



**Answer: B**

**Timestamp: 2024-06-15 11:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142579-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_2 question #45

A data engineer notices that Amazon Athena queries are held in a queue before the queries run.

How can the data engineer prevent the queries from queueing?

**A:** Increase the query result limit.

**B:** Configure provisioned capacity for an existing workgroup.

**C:** Use federated queries.

**D:** Allow users who run the Athena queries to an existing workgroup.



**Answer: B**

**Timestamp: 2024-06-15 11:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142580-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_31 question #46

A data engineer is using Amazon Athena to analyze sales data that is in Amazon S3. The data engineer writes a query to retrieve sales amounts for 2023 for several products from a table named sales_data. However, the query does not return results for all of the products that are in the sales_data table. The data engineer needs to troubleshoot the query to resolve the issue.
The data engineer's original query is as follows:
SELECT product_name, sum(sales_amount)

FROM sales_data -

WHERE year = 2023 -

GROUP BY product_name -
How should the data engineer modify the Athena query to meet these requirements?

**A:** Replace sum(sales_amount) with count(*) for the aggregation.

**B:** Change WHERE year = 2023 to WHERE extract(year FROM sales_data) = 2023.

**C:** Add HAVING sum(sales_amount) > 0 after the GROUP BY clause.

**D:** Remove the GROUP BY clause.



**Answer: B**

**Timestamp: 2024-02-02 10:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132672-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_31 question #47

A data engineer has a one-time task to read data from objects that are in Apache Parquet format in an Amazon S3 bucket. The data engineer needs to query only one column of the data.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Configure an AWS Lambda function to load data from the S3 bucket into a pandas dataframe. Write a SQL SELECT statement on the dataframe to query the required column.

**B:** Use S3 Select to write a SQL SELECT statement to retrieve the required column from the S3 objects.

**C:** Prepare an AWS Glue DataBrew project to consume the S3 objects and to query the required column.

**D:** Run an AWS Glue crawler on the S3 objects. Use a SQL SELECT statement in Amazon Athena to query the required column.



**Answer: B**

**Timestamp: 2024-02-02 10:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132673-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_31 question #48

A data engineer maintains custom Python scripts that perform a data formatting process that many AWS Lambda functions use. When the data engineer needs to modify the Python scripts, the data engineer must manually update all the Lambda functions.
The data engineer requires a less manual way to update the Lambda functions.
Which solution will meet this requirement?

**A:** Store a pointer to the custom Python scripts in the execution context object in a shared Amazon S3 bucket.

**B:** Package the custom Python scripts into Lambda layers. Apply the Lambda layers to the Lambda functions.

**C:** Store a pointer to the custom Python scripts in environment variables in a shared Amazon S3 bucket.

**D:** Assign the same alias to each Lambda function. Call reach Lambda function by specifying the function's alias.



**Answer: B**

**Timestamp: 2024-01-21 02:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131707-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_31 question #49

A company uses Amazon Redshift for its data warehouse. The company must automate refresh schedules for Amazon Redshift materialized views.
Which solution will meet this requirement with the LEAST effort?

**A:** Use Apache Airflow to refresh the materialized views.

**B:** Use an AWS Lambda user-defined function (UDF) within Amazon Redshift to refresh the materialized views.

**C:** Use the query editor v2 in Amazon Redshift to refresh the materialized views.

**D:** Use an AWS Glue workflow to refresh the materialized views.



**Answer: C**

**Timestamp: 2024-02-02 10:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132674-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_31 question #50

A data engineer must orchestrate a data pipeline that consists of one AWS Lambda function and one AWS Glue job. The solution must integrate with AWS services.
Which solution will meet these requirements with the LEAST management overhead?

**A:** Use an AWS Step Functions workflow that includes a state machine. Configure the state machine to run the Lambda function and then the AWS Glue job.

**B:** Use an Apache Airflow workflow that is deployed on an Amazon EC2 instance. Define a directed acyclic graph (DAG) in which the first task is to call the Lambda function and the second task is to call the AWS Glue job.

**C:** Use an AWS Glue workflow to run the Lambda function and then the AWS Glue job.

**D:** Use an Apache Airflow workflow that is deployed on Amazon Elastic Kubernetes Service (Amazon EKS). Define a directed acyclic graph (DAG) in which the first task is to call the Lambda function and the second task is to call the AWS Glue job.



**Answer: A**

**Timestamp: 2024-02-02 10:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132676-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_1 question #51

A data engineer is configuring an AWS Glue job to read data from an Amazon S3 bucket. The data engineer has set up the necessary AWS Glue connection details and an associated IAM role. However, when the data engineer attempts to run the AWS Glue job, the data engineer receives an error message that indicates that there are problems with the Amazon S3 VPC gateway endpoint.
The data engineer must resolve the error and connect the AWS Glue job to the S3 bucket.
Which solution will meet this requirement?

**A:** Update the AWS Glue security group to allow inbound traffic from the Amazon S3 VPC gateway endpoint.

**B:** Configure an S3 bucket policy to explicitly grant the AWS Glue job permissions to access the S3 bucket.

**C:** Review the AWS Glue job code to ensure that the AWS Glue connection details include a fully qualified domain name.

**D:** Verify that the VPC's route table includes inbound and outbound routes for the Amazon S3 VPC gateway endpoint.



**Answer: D**

**Timestamp: 2024-02-06 12:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/133045-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_1 question #52

A data engineer needs to create an AWS Lambda function that converts the format of data from .csv to Apache Parquet. The Lambda function must run only if a user uploads a .csv file to an Amazon S3 bucket.
Which solution will meet these requirements with the LEAST operational overhead?

**A:** Create an S3 event notification that has an event type of s3:ObjectCreated:*. Use a filter rule to generate notifications only when the suffix includes .csv. Set the Amazon Resource Name (ARN) of the Lambda function as the destination for the event notification.

**B:** Create an S3 event notification that has an event type of s3:ObjectTagging:* for objects that have a tag set to .csv. Set the Amazon Resource Name (ARN) of the Lambda function as the destination for the event notification.

**C:** Create an S3 event notification that has an event type of s3:*. Use a filter rule to generate notifications only when the suffix includes .csv. Set the Amazon Resource Name (ARN) of the Lambda function as the destination for the event notification.

**D:** Create an S3 event notification that has an event type of s3:ObjectCreated:*. Use a filter rule to generate notifications only when the suffix includes .csv. Set an Amazon Simple Notification Service (Amazon SNS) topic as the destination for the event notification. Subscribe the Lambda function to the SNS topic.



**Answer: A**

**Timestamp: 2024-01-18 09:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131472-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_1 question #53

An insurance company stores transaction data that the company compressed with gzip.

The company needs to query the transaction data for occasional audits.

Which solution will meet this requirement in the MOST cost-effective way?

**A:** Store the data in Amazon Glacier Flexible Retrieval. Use Amazon S3 Glacier Select to query the data.

**B:** Store the data in Amazon S3. Use Amazon S3 Select to query the data.

**C:** Store the data in Amazon S3. Use Amazon Athena to query the data.

**D:** Store the data in Amazon Glacier Instant Retrieval. Use Amazon Athena to query the data.



**Answer: B**

**Timestamp: 2024-06-15 10:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142575-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_1 question #54

A data engineer finished testing an Amazon Redshift stored procedure that processes and inserts data into a table that is not mission critical. The engineer wants to automatically run the stored procedure on a daily basis.

Which solution will meet this requirement in the MOST cost-effective way?

**A:** Create an AWS Lambda function to schedule a cron job to run the stored procedure.

**B:** Schedule and run the stored procedure by using the Amazon Redshift Data API in an Amazon EC2 Spot Instance.

**C:** Use query editor v2 to run the stored procedure on a schedule.

**D:** Schedule an AWS Glue Python shell job to run the stored procedure.



**Answer: C**

**Timestamp: 2024-06-14 23:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142543-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_1 question #55

A marketing company collects clickstream data. The company sends the clickstream data to Amazon Kinesis Data Firehose and stores the clickstream data in Amazon S3. The company wants to build a series of dashboards that hundreds of users from multiple departments will use.

The company will use Amazon QuickSight to develop the dashboards. The company wants a solution that can scale and provide daily updates about clickstream activity.

Which combination of steps will meet these requirements MOST cost-effectively? (Choose two.)

**A:** Use Amazon Redshift to store and query the clickstream data.

**B:** Use Amazon Athena to query the clickstream data

**C:** Use Amazon S3 analytics to query the clickstream data.

**D:** Access the query data through a QuickSight direct SQL query.

**E:** Access the query data through QuickSight SPICE (Super-fast, Parallel, In-memory Calculation Engine). Configure a daily refresh for the dataset.



**Answer: BE**

**Timestamp: 2024-06-15 11:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/142576-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_9 question #56

A data engineer is using an AWS Glue crawler to catalog data that is in an Amazon S3 bucket. The S3 bucket contains both .csv and json files. The data engineer configured the crawler to exclude the .json files from the catalog.

When the data engineer runs queries in Amazon Athena, the queries also process the excluded .json files. The data engineer wants to resolve this issue. The data engineer needs a solution that will not affect access requirements for the .csv files in the source S3 bucket.

Which solution will meet this requirement with the SHORTEST query times?

**A:** Adjust the AWS Glue crawler settings to ensure that the AWS Glue crawler also excludes .json files.

**B:** Use the Athena console to ensure the Athena queries also exclude the .json files.

**C:** Relocate the .json files to a different path within the S3 bucket.

**D:** Use S3 bucket policies to block access to the .json files.



**Answer: C**

**Timestamp: 2024-08-12 12:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145607-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_9 question #57

A data engineer set up an AWS Lambda function to read an object that is stored in an Amazon S3 bucket. The object is encrypted by an AWS KMS key.

The data engineer configured the Lambda function’s execution role to access the S3 bucket. However, the Lambda function encountered an error and failed to retrieve the content of the object.

What is the likely cause of the error?

**A:** The data engineer misconfigured the permissions of the S3 bucket. The Lambda function could not access the object.

**B:** The Lambda function is using an outdated SDK version, which caused the read failure.

**C:** The S3 bucket is located in a different AWS Region than the Region where the data engineer works. Latency issues caused the Lambda function to encounter an error.

**D:** The Lambda function’s execution role does not have the necessary permissions to access the KMS key that can decrypt the S3 object.



**Answer: D**

**Timestamp: 2024-08-14 14:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145725-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_9 question #58

A data engineer has implemented data quality rules in 1,000 AWS Glue Data Catalog tables. Because of a recent change in business requirements, the data engineer must edit the data quality rules.

How should the data engineer meet this requirement with the LEAST operational overhead?

**A:** Create a pipeline in AWS Glue ETL to edit the rules for each of the 1,000 Data Catalog tables. Use an AWS Lambda function to call the corresponding AWS Glue job for each Data Catalog table.

**B:** Create an AWS Lambda function that makes an API call to AWS Glue Data Quality to make the edits.

**C:** Create an Amazon EMR cluster. Run a pipeline on Amazon EMR that edits the rules for each Data Catalog table. Use an AWS Lambda function to run the EMR pipeline.

**D:** Use the AWS Management Console to edit the rules within the Data Catalog.



**Answer: B**

**Timestamp: 2024-08-14 14:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145726-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_9 question #59

Two developers are working on separate application releases. The developers have created feature branches named Branch A and Branch B by using a GitHub repository’s master branch as the source.

The developer for Branch A deployed code to the production system. The code for Branch B will merge into a master branch in the following week’s scheduled application release.

Which command should the developer for Branch B run before the developer raises a pull request to the master branch?

**A:** git diff branchB master
git commit -m

**B:** git pull master

**C:** git rebase master

**D:** git fetch -b master



**Answer: C**

**Timestamp: 2024-08-14 14:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145728-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

## Examtopics AWS Certified Data Engineer Associate DEA C01_9 question #60

A company stores employee data in Amazon Resdshift. A table names Employee uses columns named Region ID, Department ID, and Role ID as a compound sort key.

Which queries will MOST increase the speed of query by using a compound sort key of the table? (Choose two.)

**A:** Select *from Employee where Region ID=’North America’;

**B:** Select *from Employee where Region ID=’North America’ and Department ID=20;

**C:** Select *from Employee where Department ID=20 and Region ID=’North America’;

**D:** Select *from Employee where Role ID=50;

**E:** Select *from Employee where Region ID=’North America’ and Role ID=50;



**Answer: BE**

**Timestamp: 2024-08-06 08:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/145119-exam-aws-certified-data-engineer-associate-dea-c01-topic-1/)

----------------------------------------

