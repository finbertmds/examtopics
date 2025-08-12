# Exam Topics Questions

@thatonecodes

## Exam AWS Certified Big Data - Specialty topic 1 question 32 discussion

A travel website needs to present a graphical quantitative summary of its daily bookings to website visitors for marketing purposes. The website has millions of visitors per day, but wants to control costs by implementing the least-expensive solution for this visualization.
What is the most cost-effective solution?

**A:** Generate a static graph with a transient EMR cluster daily, and store it an Amazon S3.

**B:** Generate a graph using MicroStrategy backed by a transient EMR cluster.

**C:** Implement a Jupyter front-end provided by a continuously running EMR cluster leveraging spot instances for task nodes.

**D:** Implement a Zeppelin application that runs on a long-running EMR cluster.



**Answer: A**

**Timestamp: 2019-09-18 06:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5348-exam-aws-certified-big-data-specialty-topic-1-question-32/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 33 discussion

A system engineer for a company proposes digitalization and backup of large archives for customers. The systems engineer needs to provide users with a secure storage that makes sure that data will never be tampered with once it has been uploaded.
How should this be accomplished?

**A:** Create an Amazon Glacier Vault. Specify a "Deny" Vault Lock policy on this Vault to block "glacier:DeleteArchive".

**B:** Create an Amazon S3 bucket. Specify a "Deny" bucket policy on this bucket to block "s3:DeleteObject".

**C:** Create an Amazon Glacier Vault. Specify a "Deny" vault access policy on this Vault to block "glacier:DeleteArchive".

**D:** Create secondary AWS Account containing an Amazon S3 bucket. Grant "s3:PutObject" to the primary account.



**Answer: C**

**Timestamp: 2019-08-10 03:35:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3413-exam-aws-certified-big-data-specialty-topic-1-question-33/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 34 discussion

An organization needs to design and deploy a large-scale data storage solution that will be highly durable and highly flexible with respect to the type and structure of data being stored. The data to be stored will be sent or generated from a variety of sources and must be persistently available for access and processing by multiple applications.
What is the most cost-effective technique to meet these requirements?

**A:** Use Amazon Simple Storage Service (S3) as the actual data storage system, coupled with appropriate tools for ingestion/acquisition of data and for subsequent processing and querying.

**B:** Deploy a long-running Amazon Elastic MapReduce (EMR) cluster with Amazon Elastic Block Store (EBS) volumes for persistent HDFS storage and appropriate Hadoop ecosystem tools for processing and querying.

**C:** Use Amazon Redshift with data replication to Amazon Simple Storage Service (S3) for comprehensive durable data storage, processing, and querying.

**D:** Launch an Amazon Relational Database Service (RDS), and use the enterprise grade and capacity of the Amazon Aurora engine for storage, processing, and querying.



**Answer: C**

**Timestamp: 2019-08-14 23:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3598-exam-aws-certified-big-data-specialty-topic-1-question-34/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 35 discussion

A customer has a machine learning workflow that consists of multiple quick cycles of reads-writes-reads on
Amazon S3. The customer needs to run the workflow on EMR but is concerned that the reads in subsequent cycles will miss new data critical to the machine learning from the prior cycles.
How should the customer accomplish this?

**A:** Turn on EMRFS consistent view when configuring the EMR cluster.

**B:** Use AWS Data Pipeline to orchestrate the data processing cycles.

**C:** Set hadoop.data.consistency = true in the core-site.xml file.

**D:** Set hadoop.s3.consistency = true in the core-site.xml file.



**Answer: A**

**Timestamp: 2019-09-18 06:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5349-exam-aws-certified-big-data-specialty-topic-1-question-35/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 36 discussion

An Amazon Redshift Database is encrypted using KMS. A data engineer needs to use the AWS CLI to create a KMS encrypted snapshot of the database in another AWS region.
Which three steps should the data engineer take to accomplish this task? (Choose three.)

**A:** Create a new KMS key in the destination region.

**B:** Copy the existing KMS key to the destination region.

**C:** Use CreateSnapshotCopyGrant to allow Amazon Redshift to use the KMS key from the source region.

**D:** In the source region, enable cross-region replication and specify the name of the copy grant created.

**E:** In the destination region, enable cross-region replication and specify the name of the copy grant created.



**Answer: ABD**

**Timestamp: 2019-08-08 13:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3362-exam-aws-certified-big-data-specialty-topic-1-question-36/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 55 discussion

An organization is designing an application architecture. The application will have over 100 TB of data and will support transactions that arrive at rates from hundreds per second to tens of thousands per second, depending on the day of the week and time of the day. All transaction data, must be durably and reliably stored. Certain read operations must be performed with strong consistency.
Which solution meets these requirements?

**A:** Use Amazon DynamoDB as the data store and use strongly consistent reads when necessary.

**B:** Use an Amazon Relational Database Service (RDS) instance sized to meet the maximum anticipated transaction rate and with the High Availability option enabled.

**C:** Deploy a NoSQL data store on top of an Amazon Elastic MapReduce (EMR) cluster, and select the HDFS High Durability option.

**D:** Use Amazon Redshift with synchronous replication to Amazon Simple Storage Service (S3) and row-level locking for strong consistency.



**Answer: A**

**Timestamp: 2019-09-18 07:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5355-exam-aws-certified-big-data-specialty-topic-1-question-55/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 56 discussion

A company generates a large number of files each month and needs to use AWS import/export to move these files into Amazon S3 storage. To satisfy the auditors, the company needs to keep a record of which files were imported into Amazon S3.
What is a low-cost way to create a unique log for each import job?

**A:** Use the same log file prefix in the import/export manifest files to create a versioned log file in Amazon S3 for all imports.

**B:** Use the log file prefix in the import/export manifest files to create a unique log file in Amazon S3 for each import.

**C:** Use the log file checksum in the import/export manifest files to create a unique log file in Amazon S3 for each import.

**D:** Use a script to iterate over files in Amazon S3 to generate a log after each import/export job.



**Answer: B**

**Timestamp: 2019-09-10 23:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5023-exam-aws-certified-big-data-specialty-topic-1-question-56/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 57 discussion

A company needs a churn prevention model to predict which customers will NOT renew their yearly subscription to the companys service. The company plans to provide these customers with a promotional offer. A binary classification model that uses Amazon Machine Learning is required.
On which basis should this binary classification model be built?

**A:** User profiles (age, gender, income, occupation)

**B:** Last user session

**C:** Each user time series events in the past 3 months

**D:** Quarterly results



**Answer: C**

**Timestamp: 2019-08-19 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3834-exam-aws-certified-big-data-specialty-topic-1-question-57/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 58 discussion

A company with a support organization needs support engineers to be able to search historic cases to provide fast responses on new issues raised. The company has forwarded all support messages into an Amazon
Kinesis Stream. This meets a company objective of using only managed services to reduce operational overhead.
The company needs an appropriate architecture that allows support engineers to search on historic cases and find similar issues and their associated responses.
Which AWS Lambda action is most appropriate?

**A:** Ingest and index the content into an Amazon Elasticsearch domain.

**B:** Stem and tokenize the input and store the results into Amazon ElastiCache.

**C:** Write data as JSON into Amazon DynamoDB with primary and secondary indexes.

**D:** Aggregate feedback in Amazon S3 using a columnar format with partitioning.



**Answer: A**

**Timestamp: 2019-09-18 08:22:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5359-exam-aws-certified-big-data-specialty-topic-1-question-58/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 59 discussion

A solutions architect works for a company that has a data lake based on a central Amazon S3 bucket. The data contains sensitive information. The architect must be able to specify exactly which files each user can access. Users access the platform through a SAML federation Single Sign On platform.
The architect needs to build a solution that allows fine grained access control, traceability of access to the objects, and usage of the standard tools (AWS Console, AWS CLI) to access the data.
Which solution should the architect build?

**A:** Use Amazon S3 Server-Side Encryption with AWS KMS-Managed Keys for storing data. Use AWS KMS Grants to allow access to specific elements of the platform. Use AWS CloudTrail for auditing.

**B:** Use Amazon S3 Server-Side Encryption with Amazon S3-Managed Keys. Set Amazon S3 ACLs to allow access to specific elements of the platform. Use Amazon S3 to access logs for auditing.

**C:** Use Amazon S3 Client-Side Encryption with Client-Side Master Key. Set Amazon S3 ACLs to allow access to specific elements of the platform. Use Amazon S3 to access logs for auditing.

**D:** Use Amazon S3 Client-Side Encryption with AWS KMS-Managed Keys for storing data. Use AWS KMS Grants to allow access to specific elements of the platform. Use AWS CloudTrail for auditing.



**Answer: D**

**Timestamp: 2019-08-14 01:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3563-exam-aws-certified-big-data-specialty-topic-1-question-59/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 23 discussion

A company is using Amazon Machine Learning as part of a medical software application. The application will predict the most likely blood type for a patient based on a variety of other clinical tests that are available when blood type knowledge is unavailable.
What is the appropriate model choice and target attribute combination for this problem?

**A:** Multi-class classification model with a categorical target attribute.

**B:** Regression model with a numeric target attribute.

**C:** Binary Classification with a categorical target attribute.

**D:** K-Nearest Neighbors model with a multi-class target attribute.



**Answer: A**

**Timestamp: 2019-09-18 06:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5345-exam-aws-certified-big-data-specialty-topic-1-question-23/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 24 discussion

A data engineer is running a DWH on a 25-node Redshift cluster of a SaaS service. The data engineer needs to build a dashboard that will be used by customers. Five big customers represent 80% of usage, and there is a long tail of dozens of smaller customers. The data engineer has selected the dashboarding tool.
How should the data engineer make sure that the larger customer workloads do NOT interfere with the smaller customer workloads?

**A:** Apply query filters based on customer-id that can NOT be changed by the user and apply distribution keys on customer-id.

**B:** Place the largest customers into a single user group with a dedicated query queue and place the rest of the customers into a different query queue.

**C:** Push aggregations into an RDS for Aurora instance. Connect the dashboard application to Aurora rather than Redshift for faster queries.

**D:** Route the largest customers to a dedicated Redshift cluster. Raise the concurrency of the multi-tenant Redshift cluster to accommodate the remaining customers.



**Answer: D**

**Timestamp: 2019-08-13 04:46:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3519-exam-aws-certified-big-data-specialty-topic-1-question-24/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 25 discussion

An Amazon Kinesis stream needs to be encrypted.
Which approach should be used to accomplish this task?

**A:** Perform a client-side encryption of the data before it enters the Amazon Kinesis stream on the producer.

**B:** Use a partition key to segment the data by MD5 hash function, which makes it undecipherable while in transit.

**C:** Perform a client-side encryption of the data before it enters the Amazon Kinesis stream on the consumer.

**D:** Use a shard to segment the data, which has built-in functionality to make it indecipherable while in transit.



**Answer: A**

**Timestamp: 2019-08-13 04:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3520-exam-aws-certified-big-data-specialty-topic-1-question-25/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 26 discussion

An online photo album app has a key design feature to support multiple screens (e.g, desktop, mobile phone, and tablet) with high-quality displays. Multiple versions of the image must be saved in different resolutions and layouts.
The image-processing Java program takes an average of five seconds per upload, depending on the image size and format. Each image upload captures the following image metadata: user, album, photo label, upload timestamp.
The app should support the following requirements:
✑ Hundreds of user image uploads per second
✑ Maximum image upload size of 10 MB
✑ Maximum image metadata size of 1 KB
✑ Image displayed in optimized resolution in all supported screens no later than one minute after image upload
Which strategy should be used to meet these requirements?

**A:** Write images and metadata to Amazon Kinesis. Use a Kinesis Client Library (KCL) application to run the image processing and save the image output to Amazon S3 and metadata to the app repository DB.

**B:** Write image and metadata RDS with BLOB data type. Use AWS Data Pipeline to run the image processing and save the image output to Amazon S3 and metadata to the app repository DB.

**C:** Upload image with metadata to Amazon S3, use Lambda function to run the image processing and save the images output to Amazon S3 and metadata to the app repository DB.

**D:** Write image and metadata to Amazon Kinesis. Use Amazon Elastic MapReduce (EMR) with Spark Streaming to run image processing and save the images output to Amazon S3 and metadata to app repository DB.



**Answer: C**

**Timestamp: 2019-09-08 16:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4906-exam-aws-certified-big-data-specialty-topic-1-question-26/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 27 discussion

A customer needs to determine the optimal distribution strategy for the ORDERS fact table in its Redshift schema. The ORDERS table has foreign key relationships with multiple dimension tables in this schema.
How should the company determine the most appropriate distribution key for the ORDERS table?

**A:** Identify the largest and most frequently joined dimension table and ensure that it and the ORDERS table both have EVEN distribution.

**B:** Identify the largest dimension table and designate the key of this dimension table as the distribution key of the ORDERS table.

**C:** Identify the smallest dimension table and designate the key of this dimension table as the distribution key of the ORDERS table.

**D:** Identify the largest and the most frequently joined dimension table and designate the key of this dimension table as the distribution key of the ORDERS table.



**Answer: D**

**Timestamp: 2019-09-08 17:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4907-exam-aws-certified-big-data-specialty-topic-1-question-27/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 1 discussion

A data engineer in a manufacturing company is designing a data processing platform that receives a large volume of unstructured data. The data engineer must populate a well-structured star schema in Amazon
Redshift.
What is the most efficient architecture strategy for this purpose?

**A:** Transform the unstructured data using Amazon EMR and generate CSV data. COPY the CSV data into the analysis schema within Redshift.

**B:** Load the unstructured data into Redshift, and use string parsing functions to extract structured data for inserting into the analysis schema.

**C:** When the data is saved to Amazon S3, use S3 Event Notifications and AWS Lambda to transform the file contents. Insert the data into the analysis schema on Redshift.

**D:** Normalize the data using an AWS Marketplace ETL tool, persist the results to Amazon S3, and use AWS Lambda to INSERT the data into Redshift.



**Answer: A**

**Timestamp: 2019-09-17 10:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5297-exam-aws-certified-big-data-specialty-topic-1-question-1/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 10 discussion

A company has several teams of analysts. Each team of analysts has their own cluster. The teams need to run
SQL queries using Hive, Spark-SQL, and Presto with Amazon EMR. The company needs to enable a centralized metadata layer to expose the Amazon S3 objects as tables to the analysts.
Which approach meets the requirement for a centralized metadata layer?

**A:** EMRFS consistent view with a common Amazon DynamoDB table

**B:** Bootstrap action to change the Hive Metastore to an Amazon RDS database

**C:** s3distcp with the outputManifest option to generate RDS DDL

**D:** Naming scheme support with automatic partition discovery from Amazon S3



**Answer: A**

**Timestamp: 2019-08-13 03:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3514-exam-aws-certified-big-data-specialty-topic-1-question-10/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 11 discussion

An administrator needs to manage a large catalog of items from various external sellers. The administrator needs to determine if the items should be identified as minimally dangerous, dangerous, or highly dangerous based on their textual descriptions. The administrator already has some items with the danger attribute, but receives hundreds of new item descriptions every day without such classification.
The administrator has a system that captures dangerous goods reports from customer support team of from user feedback.
What is a cost-effective architecture to solve this issue?

**A:** Build a set of regular expression rules that are based on the existing examples, and run them on the DynamoDB Streams as every new item description is added to the system.

**B:** Build a Kinesis Streams process that captures and marks the relevant items in the dangerous goods reports using a Lambda function once more than two reports have been filed.

**C:** Build a machine learning model to properly classify dangerous goods and run it on the DynamoDB Streams as every new item description is added to the system.

**D:** Build a machine learning model with binary classification for dangerous goods and run it on the DynamoDB Streams as every new item description is added to the system.



**Answer: C**

**Timestamp: 2019-08-29 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4340-exam-aws-certified-big-data-specialty-topic-1-question-11/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 12 discussion

A company receives data sets coming from external providers on Amazon S3. Data sets from different providers are dependent on one another. Data sets will arrive at different times and in no particular order.
A data architect needs to design a solution that enables the company to do the following:
✑ Rapidly perform cross data set analysis as soon as the data becomes available
✑ Manage dependencies between data sets that arrive at different times
Which architecture strategy offers a scalable and cost-effective solution that meets these requirements?

**A:** Maintain data dependency information in Amazon RDS for MySQL. Use an AWS Data Pipeline job to load an Amazon EMR Hive table based on task dependencies and event notification triggers in Amazon S3.

**B:** Maintain data dependency information in an Amazon DynamoDB table. Use Amazon SNS and event notifications to publish data to fleet of Amazon EC2 workers. Once the task dependencies have been resolved, process the data with Amazon EMR.

**C:** Maintain data dependency information in an Amazon ElastiCache Redis cluster. Use Amazon S3 event notifications to trigger an AWS Lambda function that maps the S3 object to Redis. Once the task dependencies have been resolved, process the data with Amazon EMR.

**D:** Maintain data dependency information in an Amazon DynamoDB table. Use Amazon S3 event notifications to trigger an AWS Lambda function that maps the S3 object to the task associated with it in DynamoDB. Once all task dependencies have been resolved, process the data with Amazon EMR.



**Answer: C**

**Timestamp: 2019-08-10 14:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3423-exam-aws-certified-big-data-specialty-topic-1-question-12/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 13 discussion

A media advertising company handles a large number of real-time messages sourced from over 200 websites in real time. Processing latency must be kept low. Based on calculations, a 60-shard Amazon Kinesis stream is more than sufficient to handle the maximum data throughput, even with traffic spikes. The company also uses an Amazon Kinesis Client Library (KCL) application running on Amazon Elastic Compute Cloud (EC2) managed by an Auto Scaling group. Amazon CloudWatch indicates an average of 25% CPU and a modest level of network traffic across all running servers.
The company reports a 150% to 200% increase in latency of processing messages from Amazon Kinesis during peak times. There are NO reports of delay from the sites publishing to Amazon Kinesis.
What is the appropriate solution to address the latency?

**A:** Increase the number of shards in the Amazon Kinesis stream to 80 for greater concurrency.

**B:** Increase the size of the Amazon EC2 instances to increase network throughput.

**C:** Increase the minimum number of instances in the Auto Scaling group.

**D:** Increase Amazon DynamoDB throughput on the checkpoint table.



**Answer: D**

**Timestamp: 2019-09-08 02:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4879-exam-aws-certified-big-data-specialty-topic-1-question-13/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 5 discussion

An organization is currently using an Amazon EMR long-running cluster with the latest Amazon EMR release for analytic jobs and is storing data as external tables on Amazon S3.
The company needs to launch multiple transient EMR clusters to access the same tables concurrently, but the metadata about the Amazon S3 external tables are defined and stored on the long-running cluster.
Which solution will expose the Hive metastore with the LEAST operational effort?

**A:** Export Hive metastore information to Amazon DynamoDB hive-site classification to point to the Amazon DynamoDB table.

**B:** Export Hive metastore information to a MySQL table on Amazon RDS and configure the Amazon EMR hive-site classification to point to the Amazon RDS database.

**C:** Launch an Amazon EC2 instance, install and configure Apache Derby, and export the Hive metastore information to derby.

**D:** Create and configure an AWS Glue Data Catalog as a Hive metastore for Amazon EMR.



**Answer: B**

**Timestamp: 2019-08-26 05:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4074-exam-aws-certified-big-data-specialty-topic-2-question-5/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 6 discussion

An organization is using Amazon Kinesis Data Streams to collect data generated from thousands of temperature devices and is using AWS Lambda to process the data. Devices generate 10 to 12 million records every day, but Lambda is processing only around 450 thousand records. Amazon CloudWatch indicates that throttling on Lambda is not occurring.
What should be done to ensure that all data is processed? (Choose two.)

**A:** Increase the BatchSize value on the EventSource, and increase the memory allocated to the Lambda function.

**B:** Decrease the BatchSize value on the EventSource, and increase the memory allocated to the Lambda function.

**C:** Create multiple Lambda functions that will consume the same Amazon Kinesis stream.

**D:** Increase the number of vCores allocated for the Lambda function.

**E:** Increase the number of shards on the Amazon Kinesis stream.



**Answer: AE**

**Timestamp: 2019-08-29 03:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4281-exam-aws-certified-big-data-specialty-topic-2-question-6/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 7 discussion

An Operations team continuously monitors the number of visitors to a website to identify any potential system problems. The number of website visitors varies throughout the day. The site is more popular in the middle of the day and less popular at night.
Which type of dashboard display would be the MOST useful to allow staff to quickly and correctly identify system problems?

**A:** A vertical stacked bar chart showing today's website visitors and the historical average number of website visitors.

**B:** An overlay line chart showing today's website visitors at one-minute intervals and also the historical average number of website visitors.

**C:** A single KPI metric showing the statistical variance between the current number of website visitors and the historical number of website visitors for the current time of day.

**D:** A scatter plot showing today's website visitors on the X-axis and the historical average number of website visitors on the Y-axis.



**Answer: B**

**Timestamp: 2019-08-26 05:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4075-exam-aws-certified-big-data-specialty-topic-2-question-7/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 8 discussion

An organization would like to run analytics on their Elastic Load Balancing logs stored in Amazon S3 and join this data with other tables in Amazon S3. The users are currently using a BI tool connecting with JDBC and would like to keep using this BI tool.
Which solution would result in the LEAST operational overhead?

**A:** Trigger a Lambda function when a new log file is added to the bucket to transform and load it into Amazon Redshift. Run the VACUUM command on the Amazon Redshift cluster every night.

**B:** Launch a long-running Amazon EMR cluster that continuously downloads and transforms new files from Amazon S3 into its HDFS storage. Use Presto to expose the data through JDBC.

**C:** Trigger a Lambda function when a new log file is added to the bucket to transform and move it to another bucket with an optimized data structure. Use Amazon Athena to query the optimized bucket.

**D:** Launch a transient Amazon EMR cluster every night that transforms new log files and loads them into Amazon Redshift.



**Answer: C**

**Timestamp: 2019-09-22 05:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5556-exam-aws-certified-big-data-specialty-topic-2-question-8/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 9 discussion

An organization has added a clickstream to their website to analyze traffic. The website is sending each page request with the PutRecord API call to an Amazon
Kinesis stream by using the page name as the partition key. During peak spikes in website traffic, a support engineer notices many events in the application logs.
ProvisionedThroughputExcededException
What should be done to resolve the issue in the MOST cost-effective way?

**A:** Create multiple Amazon Kinesis streams for page requests to increase the concurrency of the clickstream.

**B:** Increase the number of shards on the Kinesis stream to allow for more throughput to meet the peak spikes in traffic.

**C:** Modify the application to use on the Kinesis Producer Library to aggregate requests before sending them to the Kinesis stream.

**D:** Attach more consumers to the Kinesis stream to process records in parallel, improving the performance on the stream. B



**Answer: Explanation**

**Timestamp: 2019-08-29 16:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4320-exam-aws-certified-big-data-specialty-topic-2-question-9/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 19 discussion

An Amazon EMR cluster using EMRFS has access to petabytes of data on Amazon S3, originating from multiple unique data sources. The customer needs to query common fields across some of the data sets to be able to perform interactive joins and then display results quickly.
Which technology is most appropriate to enable this capability?

**A:** Presto

**B:** MicroStrategy

**C:** Pig

**D:** R Studio



**Answer: C**

**Timestamp: 2019-08-09 23:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3407-exam-aws-certified-big-data-specialty-topic-1-question-19/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 2 discussion

A new algorithm has been written in Python to identify SPAM e-mails. The algorithm analyzes the free text contained within a sample set of 1 million e-mails stored on Amazon S3. The algorithm must be scaled across a production dataset of 5 PB, which also resides in Amazon S3 storage.
Which AWS service strategy is best for this use case?

**A:** Copy the data into Amazon ElastiCache to perform text analysis on the in-memory data and export the results of the model into Amazon Machine Learning.

**B:** Use Amazon EMR to parallelize the text analysis tasks across the cluster using a streaming program step.

**C:** Use Amazon Elasticsearch Service to store the text and then use the Python Elasticsearch Client to run analysis against the text index.

**D:** Initiate a Python job from AWS Data Pipeline to run directly against the Amazon S3 text files.



**Answer: C**

**Timestamp: 2019-08-12 05:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3484-exam-aws-certified-big-data-specialty-topic-1-question-2/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 20 discussion

A game company needs to properly scale its game application, which is backed by DynamoDB. Amazon
Redshift has the past two years of historical data. Game traffic varies throughout the year based on various factors such as season, movie release, and holiday season. An administrator needs to calculate how much read and write throughput should be provisioned for DynamoDB table for each week in advance.
How should the administrator accomplish this task?

**A:** Feed the data into Amazon Machine Learning and build a regression model.

**B:** Feed the data into Spark Mlib and build a random forest modest.

**C:** Feed the data into Apache Mahout and build a multi-classification model.

**D:** Feed the data into Amazon Machine Learning and build a binary classification model.



**Answer: B**

**Timestamp: 2019-08-10 14:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3424-exam-aws-certified-big-data-specialty-topic-1-question-20/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 21 discussion

A data engineer is about to perform a major upgrade to the DDL contained within an Amazon Redshift cluster to support a new data warehouse application. The upgrade scripts will include user permission updates, view and table structure changes as well as additional loading and data manipulation tasks.
The data engineer must be able to restore the database to its existing state in the event of issues.
Which action should be taken prior to performing this upgrade task?

**A:** Run an UNLOAD command for all data in the warehouse and save it to S3.

**B:** Create a manual snapshot of the Amazon Redshift cluster.

**C:** Make a copy of the automated snapshot on the Amazon Redshift cluster.

**D:** Call the waitForSnapshotAvailable command from either the AWS CLI or an AWS SDK.



**Answer: B**

**Timestamp: 2019-09-18 06:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5344-exam-aws-certified-big-data-specialty-topic-1-question-21/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 22 discussion

A large oil and gas company needs to provide near real-time alerts when peak thresholds are exceeded in its pipeline system. The company has developed a system to capture pipeline metrics such as flow rate, pressure, and temperature using millions of sensors. The sensors deliver to AWS IoT.
What is a cost-effective way to provide near real-time alerts on the pipeline metrics?

**A:** Create an AWS IoT rule to generate an Amazon SNS notification.

**B:** Store the data points in an Amazon DynamoDB table and poll if for peak metrics data from an Amazon EC2 application.

**C:** Create an Amazon Machine Learning model and invoke it with AWS Lambda.

**D:** Use Amazon Kinesis Streams and a KCL-based application deployed on AWS Elastic Beanstalk.



**Answer: C**

**Timestamp: 2019-08-10 00:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3408-exam-aws-certified-big-data-specialty-topic-1-question-22/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 19 discussion

An organization has 10,000 devices that generate 100 GB of telemetry data per day, with each record size around 10 KB. Each record has 100 fields, and one field consists of unstructured log data with a "String" data type in the English language. Some fields are required for the real-time dashboard, but all fields must be available for long-term generation.
The organization also has 10 PB of previously cleaned and structured data, partitioned by Date, in a SAN that must be migrated to AWS within one month.
Currently, the organization does not have any real-time capabilities in their solution. Because of storage limitations in the on-premises data warehouse, selective data is loaded while generating the long-term trend with ANSI SQL queries through JDBC for visualization. In addition to the one-time data loading, the organization needs a cost-effective and real-time solution.
How can these requirements be met? (Choose two.)

**A:** use AWS IoT to send data from devices to an Amazon SQS queue, create a set of workers in an Auto Scaling group and read records in batch from the queue to process and save the data. Fan out to an Amazon SNS queue attached with an AWS Lambda function to filter the request dataset and save it to Amazon Elasticsearch Service for real-time analytics.

**B:** Create a Direct Connect connection between AWS and the on-premises data center and copy the data to Amazon S3 using S3 Acceleration. Use Amazon Athena to query the data.

**C:** Use AWS IoT to send the data from devices to Amazon Kinesis Data Streams with the IoT rules engine. Use one Kinesis Data Firehose stream attached to a Kinesis stream to batch and stream the data partitioned by date. Use another Kinesis Firehose stream attached to the same Kinesis stream to filter out the required fields to ingest into Elasticsearch for real-time analytics.

**D:** Use AWS IoT to send the data from devices to Amazon Kinesis Data Streams with the IoT rules engine. Use one Kinesis Data Firehose stream attached to a Kinesis stream to stream the data into an Amazon S3 bucket partitioned by date. Attach an AWS Lambda function with the same Kinesis stream to filter out the required fields for ingestion into Amazon DynamoDB for real-time analytics.

**E:** use multiple AWS Snowball Edge devices to transfer data to Amazon S3, and use Amazon Athena to query the data.



**Answer: AD**

**Timestamp: 2019-08-26 06:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4084-exam-aws-certified-big-data-specialty-topic-2-question-19/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 2 discussion

How should an Administrator BEST architect a large multi-layer Long Short-Term Memory (LSTM) recurrent neural network (RNN) running with MXNET on
Amazon EC2? (Choose two.)

**A:** Use data parallelism to partition the workload over multiple devices and balance the workload within the GPUs.

**B:** Use compute-optimized EC2 instances with an attached elastic GPU.

**C:** Use general purpose GPU computing instances such as G3 and P3.

**D:** Use processing parallelism to partition the workload over multiple storage devices and balance the workload within the GPUs.



**Answer: AC**

**Timestamp: 2019-08-26 09:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4093-exam-aws-certified-big-data-specialty-topic-2-question-2/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 20 discussion

An organization is designing a public web application and has a requirement that states all application users must be centrally authenticated before any operations are permitted. The organization will need to create a user table with fast data lookup for the application in which a user can read only his or her own data. All users already have an account with amazon.com.
How can these requirements be met?

**A:** Create an Amazon RDS Aurora table, with Amazon_ID as the primary key. The application uses amazon.com web identity federation to get a token that is used to assume an IAM role from AWS STS. Use IAM database authentication by using the rds:db-tag IAM authentication policy and GRANT Amazon RDS row-level read permission per user.

**B:** Create an Amazon RDS Aurora table, with Amazon_ID as the primary key for each user. The application uses amazon.com web identity federation to get a token that is used to assume an IAM role. Use IAM database authentication by using rds:db-tag IAM authentication policy and GRANT Amazon RDS row- level read permission per user.

**C:** Create an Amazon DynamoDB table, with Amazon_ID as the partition key. The application uses amazon.com web identity federation to get a token that is used to assume an IAM role from AWS STS in the Role, use IAM condition context key dynamodb:LeadingKeys with IAM substitution variables $ and allow the required DynamoDB API operations in IAM JSON policy Action element for reading the records. {www.amazon.com:user_id}

**D:** Create an Amazon DynamoDB table, with Amazon_ID as the partition key. The application uses amazon.com web identity federation to assume an IAM role from AWS STS in the Role, use IAM condition context key dynamodb:LeadingKeys with IAM substitution variables $ {www.amazon.com:user_id} and allow the required DynamoDB API operations in IAM JSON policy Action element for reading the records.



**Answer: C**

**Timestamp: 2019-08-31 00:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4403-exam-aws-certified-big-data-specialty-topic-2-question-20/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 3 discussion

An organization is soliciting public feedback through a web portal that has been deployed to track the number of requests and other important data. As part of reporting and visualization, AmazonQuickSight connects to an Amazon RDS database to virtualize data. Management wants to understand some important metrics about feedback and how the feedback has changed over the last four weeks in a visual representation.
What would be the MOST effective way to represent multiple iterations of an analysis in Amazon QuickSight that would show how the data has changed over the last four weeks?

**A:** Use the analysis option for data captured in each week and view the data by a date range.

**B:** Use a pivot table as a visual option to display measured values and weekly aggregate data as a row dimension.

**C:** Use a dashboard option to create an analysis of the data for each week and apply filters to visualize the data change.

**D:** Use a story option to preserve multiple iterations of an analysis and play the iterations sequentially.



**Answer: D**

**Timestamp: 2019-09-06 15:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4807-exam-aws-certified-big-data-specialty-topic-2-question-3/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 4 discussion

An organization is setting up a data catalog and metadata management environment for their numerous data stores currently running on AWS. The data catalog will be used to determine the structure and other attributes of data in the data stores. The data stores are composed of Amazon RDS databases, Amazon
Redshift, and CSV files residing on Amazon S3. The catalog should be populated on a scheduled basis, and minimal administration is required to manage the catalog.
How can this be accomplished?

**A:** Set up Amazon DynamoDB as the data catalog and run a scheduled AWS Lambda function that connects to data sources to populate the DynamoDB table.

**B:** Use an Amazon database as the data catalog and run a scheduled AWS Lambda function that connects to data sources to populate the database.

**C:** Use AWS Glue Data Catalog as the data catalog and schedule crawlers that connect to data sources to populate the catalog.

**D:** Set up Apache Hive metastore on an Amazon EC2 instance and run a scheduled bash script that connects to data sources to populate the metastore.



**Answer: C**

**Timestamp: 2019-11-05 20:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/7724-exam-aws-certified-big-data-specialty-topic-2-question-4/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 14 discussion

Multiple rows in an Amazon Redshift table were accidentally deleted. A System Administrator is restoring the table from the most recent snapshot. The snapshot contains all rows that were in the table before the deletion.
What is the SIMPLEST solution to restore the table without impacting users?

**A:** Restore the snapshot to a new Amazon Redshift cluster, then UNLOAD the table to Amazon S3. In the original cluster, TRUNCATE the table, then load the data from Amazon S3 by using a COPY command.

**B:** Use the Restore Table from a Snapshot command and specify a new table name DROP the original table, then RENAME the new table to the original table name.

**C:** Restore the snapshot to a new Amazon Redshift cluster. Create a DBLINK between the two clusters in the original cluster, TRUNCATE the destination table, then use an INSERT command to copy the data from the new cluster.

**D:** Use the ALTER TABLE REVERT command and specify a time stamp of immediately before the data deletion. Specify the Amazon Resource Name of the snapshot as the SOURCE and use the OVERWRITE REPLACE option.



**Answer: B**

**Timestamp: 2019-09-06 03:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4775-exam-aws-certified-big-data-specialty-topic-2-question-14/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 15 discussion

An organization's data warehouse contains sales data for reporting purposes. data governance policies prohibit staff from accessing the customers' credit card numbers.
How can these policies be adhered to and still allow a Data Scientist to group transactions that use the same credit card number?

**A:** Store a cryptographic hash of the credit card number.

**B:** Encrypt the credit card number with a symmetric encryption key, and give the key only to the authorized Data Scientist.

**C:** Mask the credit card numbers to only show the last four digits of the credit card number.

**D:** Encrypt the credit card number with an asymmetric encryption key and give the decryption key only to the authorized Data Scientist.



**Answer: C**

**Timestamp: 2019-08-26 06:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4080-exam-aws-certified-big-data-specialty-topic-2-question-15/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 16 discussion

A real-time bidding company is rebuilding their monolithic application and is focusing on serving real-time data. A large number of reads and writes are generated from thousands of concurrent users who follow items and bid on the company's sale offers.
The company is experiencing high latency during special event spikes, with millions of concurrent users.
The company needs to analyze and aggregate a part of the data in near real time to feed an internal dashboard.
What is the BEST approach for serving and analyzing data, considering the constraint of the row latency on the highly demanded data?

**A:** Use Amazon Aurora with Multi Availability Zone and read replicas. Use Amazon ElastiCache in front of the read replicas to serve read-only content quickly. Use the same database as datasource for the dashboard.

**B:** Use Amazon DynamoDB to store real-time data with Amazon DynamoDB. Accelerator to serve content quickly. use Amazon DynamoDB Streams to replay all changes to the table, process and stream to Amazon Elasti search Service with AWS Lambda.

**C:** Use Amazon RDS with Multi Availability Zone. Provisioned IOPS EBS volume for storage. Enable up to five read replicas to serve read-only content quickly. Use Amazon EMR with Sqoop to import Amazon RDS data into HDFS for analysis.

**D:** Use Amazon Redshift with a DC2 node type and a multi-mode cluster. Create an Amazon EC2 instance with pgpoo1 installed. Create an Amazon ElastiCache cluster and route read requests through pgpoo1, and use Amazon Redshift for analysis. D



**Answer: Explanation**

**Timestamp: 2019-08-26 06:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4081-exam-aws-certified-big-data-specialty-topic-2-question-16/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 17 discussion

A gas company needs to monitor gas pressure in their pipelines. Pressure data is streamed from sensors placed throughout the pipelines to monitor the data in real time. When an anomaly is detected, the system must send a notification to open valve. An Amazon Kinesis stream collects the data from the sensors and an anomaly Kinesis stream triggers an AWS Lambda function to open the appropriate valve.
Which solution is the MOST cost-effective for responding to anomalies in real time?

**A:** Attach a Kinesis Firehose to the stream and persist the sensor data in an Amazon S3 bucket. Schedule an AWS Lambda function to run a query in Amazon Athena against the data in Amazon S3 to identify anomalies. When a change is detected, the Lambda function sends a message to the anomaly stream to open the valve.

**B:** Launch an Amazon EMR cluster that uses Spark Streaming to connect to the Kinesis stream and Spark machine learning to detect anomalies. When a change is detected, the Spark application sends a message to the anomaly stream to open the valve.

**C:** Launch a fleet of Amazon EC2 instances with a Kinesis Client Library application that consumes the stream and aggregates sensor data over time to identify anomalies. When an anomaly is detected, the application sends a message to the anomaly stream to open the valve.

**D:** Create a Kinesis Analytics application by using the RANDOM_CUT_FOREST function to detect an anomaly. When the anomaly score that is returned from the function is outside of an acceptable range, a message is sent to the anomaly stream to open the valve.



**Answer: A**

**Timestamp: 2019-08-26 06:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4082-exam-aws-certified-big-data-specialty-topic-2-question-17/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 18 discussion

A gaming organization is developing a new game and would like to offer real-time competition to their users. The data architecture has the following characteristics:
✑ The game application is writing events directly to Amazon DynamoDB from the user's mobile device.
✑ Users from the website can access their statistics directly from DynamoDB.
✑ The game servers are accessing DynamoDB to update the user's information.
✑ The data science team extracts data from DynamoDB for various applications.
The engineering team has already agreed to the IAM roles and policies to use for the data science team and the application.
Which actions will provide the MOST security, while maintaining the necessary access to the website and game application? (Choose two.)

**A:** Use Amazon Cognito user pool to authenticate to both the website and the game application.

**B:** Use IAM identity federation to authenticate to both the website and the game application.

**C:** Create an IAM policy with PUT permission for both the website and the game application.

**D:** Create an IAM policy with fine-grained permission for both the website and the game application.

**E:** Create an IAM policy with PUT permission for the game application and an IAM policy with GET permission for the website.



**Answer: BE**

**Timestamp: 2019-08-26 06:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4083-exam-aws-certified-big-data-specialty-topic-2-question-18/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 50 discussion

An administrator tries to use the Amazon Machine Learning service to classify social media posts that mention the administrators company into posts that require a response and posts that do not. The training dataset of
10,000 posts contains the details of each post including the timestamp, author, and full text of the post. The administrator is missing the target labels that are required for training.
Which Amazon Machine Learning model is the most appropriate for the task?

**A:** Binary classification model, where the target class is the require-response post

**B:** Binary classification model, where the two classes are the require-response post and does-not-require- response

**C:** Multi-class prediction model, with two classes: require-response post and does-not-require-response

**D:** Regression model where the predicted value is the probability that the post requires a response



**Answer: A**

**Timestamp: 2019-08-28 14:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4275-exam-aws-certified-big-data-specialty-topic-1-question-50/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 51 discussion

A medical record filing system for a government medical fund is using an Amazon S3 bucket to archive documents related to patients. Every patient visit to a physician creates a new file, which can add up millions of files each month. Collection of these files from each physician is handled via a batch process that runs ever night using AWS Data Pipeline. This is sensitive data, so the data and any associated metadata must be encrypted at rest.
Auditors review some files on a quarterly basis to see whether the records are maintained according to regulations. Auditors must be able to locate any physical file in the S3 bucket for a given date, patient, or physician. Auditors spend a significant amount of time location such files.
What is the most cost- and time-efficient collection methodology in this situation?

**A:** Use Amazon Kinesis to get the data feeds directly from physicians, batch them using a Spark application on Amazon Elastic MapReduce (EMR), and then store them in Amazon S3 with folders separated per physician.

**B:** Use Amazon API Gateway to get the data feeds directly from physicians, batch them using a Spark application on Amazon Elastic MapReduce (EMR), and then store them in Amazon S3 with folders separated per physician.

**C:** Use Amazon S3 event notification to populate an Amazon DynamoDB table with metadata about every file loaded to Amazon S3, and partition them based on the month and year of the file.

**D:** Use Amazon S3 event notification to populate an Amazon Redshift table with metadata about every file loaded to Amazon S3, and partition them based on the month and year of the file.



**Answer: A**

**Timestamp: 2019-08-14 23:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3597-exam-aws-certified-big-data-specialty-topic-1-question-51/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 52 discussion

A clinical trial will rely on medical sensors to remotely assess patient health. Each physician who participates in the trial requires visual reports each morning. The reports are built from aggregations of all the sensor data taken each minute.
What is the most cost-effective solution for creating this visualization each day?

**A:** Use Kinesis Aggregators Library to generate reports for reviewing the patient sensor data and generate a QuickSight visualization on the new data each morning for the physician to review.

**B:** Use a transient EMR cluster that shuts down after use to aggregate the patient sensor data each night and generate a QuickSight visualization on the new data each morning for the physician to review.

**C:** Use Spark streaming on EMR to aggregate the patient sensor data in every 15 minutes and generate a QuickSight visualization on the new data each morning for the physician to review.

**D:** Use an EMR cluster to aggregate the patient sensor data each night and provide Zeppelin notebooks that look at the new data residing on the cluster each morning for the physician to review.



**Answer: D**

**Timestamp: 2019-08-10 07:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3419-exam-aws-certified-big-data-specialty-topic-1-question-52/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 53 discussion

A company uses Amazon Redshift for its enterprise data warehouse. A new on-premises PostgreSQL OLTP
DB must be integrated into the data warehouse. Each table in the PostgreSQL DB has an indexed timestamp column. The data warehouse has a staging layer to load source data into the data warehouse environment for further processing.
The data lag between the source PostgreSQL DB and the Amazon Redshift staging layer should NOT exceed four hours.
What is the most efficient technique to meet these requirements?

**A:** Create a DBLINK on the source DB to connect to Amazon Redshift. Use a PostgreSQL trigger on the source table to capture the new insert/update/delete event and execute the event on the Amazon Redshift staging table.

**B:** Use a PostgreSQL trigger on the source table to capture the new insert/update/delete event and write it to Amazon Kinesis Streams. Use a KCL application to execute the event on the Amazon Redshift staging table.

**C:** Extract the incremental changes periodically using a SQL query. Upload the changes to multiple Amazon Simple Storage Service (S3) objects, and run the COPY command to load to the Amazon Redshift staging layer.

**D:** Extract the incremental changes periodically using a SQL query. Upload the changes to a single Amazon Simple Storage Service (S3) object, and run the COPY command to load to the Amazon Redshift staging layer.



**Answer: C**

**Timestamp: 2019-08-28 03:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4231-exam-aws-certified-big-data-specialty-topic-1-question-53/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 54 discussion

An administrator is deploying Spark on Amazon EMR for two distinct use cases: machine learning algorithms and ad-hoc querying. All data will be stored in Amazon S3. Two separate clusters for each use case will be deployed. The data volumes on Amazon S3 are less than 10 GB.
How should the administrator align instance types with the clusters purpose?

**A:** Machine Learning on C instance types and ad-hoc queries on R instance types

**B:** Machine Learning on R instance types and ad-hoc queries on G2 instance types

**C:** Machine Learning on T instance types and ad-hoc queries on M instance types

**D:** Machine Learning on D instance types and ad-hoc queries on I instance types



**Answer: A**

**Timestamp: 2019-09-18 07:28:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5354-exam-aws-certified-big-data-specialty-topic-1-question-54/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 14 discussion

A Redshift data warehouse has different user teams that need to query the same table with very different query types. These user teams are experiencing poor performance.
Which action improves performance for the user teams in this situation?

**A:** Create custom table views.

**B:** Add interleaved sort keys per team.

**C:** Maintain team-specific copies of the table.

**D:** Add support for workload management queue hopping.



**Answer: D**

**Timestamp: 2019-09-06 03:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4773-exam-aws-certified-big-data-specialty-topic-1-question-14/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 15 discussion

A company operates an international business served from a single AWS region. The company wants to expand into a new country. The regulator for that country requires the Data Architect to maintain a log of financial transactions in the country within 24 hours of the product transaction. The production application is latency insensitive. The new country contains another AWS region.
What is the most cost-effective way to meet this requirement?

**A:** Use CloudFormation to replicate the production application to the new region.

**B:** Use Amazon CloudFront to serve application content locally in the country; Amazon CloudFront logs will satisfy the requirement.

**C:** Continue to serve customers from the existing region while using Amazon Kinesis to stream transaction data to the regulator.

**D:** Use Amazon S3 cross-region replication to copy and persist production transaction logs to a bucket in the new countrys region.



**Answer: B**

**Timestamp: 2019-09-06 03:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4774-exam-aws-certified-big-data-specialty-topic-1-question-15/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 16 discussion

An administrator needs to design the event log storage architecture for events from mobile devices. The event data will be processed by an Amazon EMR cluster daily for aggregated reporting and analytics before being archived.
How should the administrator recommend storing the log data?

**A:** Create an Amazon S3 bucket and write log data into folders by device. Execute the EMR job on the device folders.

**B:** Create an Amazon DynamoDB table partitioned on the device and sorted on date, write log data to table. Execute the EMR job on the Amazon DynamoDB table.

**C:** Create an Amazon S3 bucket and write data into folders by day. Execute the EMR job on the daily folder.

**D:** Create an Amazon DynamoDB table partitioned on EventID, write log data to table. Execute the EMR job on the table.



**Answer: A**

**Timestamp: 2019-08-12 07:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3489-exam-aws-certified-big-data-specialty-topic-1-question-16/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 17 discussion

A data engineer wants to use an Amazon Elastic Map Reduce for an application. The data engineer needs to make sure it complies with regulatory requirements. The auditor must be able to confirm at any point which servers are running and which network access controls are deployed.
Which action should the data engineer take to meet this requirement?

**A:** Provide the auditor IAM accounts with the SecurityAudit policy attached to their group.

**B:** Provide the auditor with SSH keys for access to the Amazon EMR cluster.

**C:** Provide the auditor with CloudFormation templates.

**D:** Provide the auditor with access to AWS DirectConnect to use their existing tools.



**Answer: C**

**Timestamp: 2019-08-14 18:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3594-exam-aws-certified-big-data-specialty-topic-1-question-17/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 18 discussion

A social media customer has data from different data sources including RDS running MySQL, Redshift, and
Hive on EMR. To support better analysis, the customer needs to be able to analyze data from different data sources and to combine the results.
What is the most cost-effective solution to meet these requirements?

**A:** Load all data from a different database/warehouse to S3. Use Redshift COPY command to copy data to Redshift for analysis.

**B:** Install Presto on the EMR cluster where Hive sits. Configure MySQL and PostgreSQL connector to select from different data sources in a single query.

**C:** Spin up an Elasticsearch cluster. Load data from all three data sources and use Kibana to analyze.

**D:** Write a program running on a separate EC2 instance to run queries to three different systems. Aggregate the results after getting the responses from all three systems.



**Answer: B**

**Timestamp: 2019-09-18 06:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5343-exam-aws-certified-big-data-specialty-topic-1-question-18/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 46 discussion

An enterprise customer is migrating to Redshift and is considering using dense storage nodes in its Redshift cluster. The customer wants to migrate 50 TB of data. The customers query patterns involve performing many joins with thousands of rows.
The customer needs to know how many nodes are needed in its target Redshift cluster. The customer has a limited budget and needs to avoid performing tests unless absolutely needed.
Which approach should this customer use?

**A:** Start with many small nodes.

**B:** Start with fewer large nodes.

**C:** Have two separate clusters with a mix of a small and large nodes.

**D:** Insist on performing multiple tests to determine the optimal configuration.



**Answer: A**

**Timestamp: 2019-09-02 23:23:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4587-exam-aws-certified-big-data-specialty-topic-1-question-46/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 47 discussion

A company is centralizing a large number of unencrypted small files from multiple Amazon S3 buckets. The company needs to verify that the files contain the same data after centralization.
Which method meets the requirements?

**A:** Compare the S3 Etags from the source and destination objects.

**B:** Call the S3 CompareObjects API for the source and destination objects.

**C:** Place a HEAD request against the source and destination objects comparing SIG v4.

**D:** Compare the size of the source and destination objects.



**Answer: A**

**Timestamp: 2019-09-18 07:19:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5352-exam-aws-certified-big-data-specialty-topic-1-question-47/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 48 discussion

An online gaming company uses DynamoDB to store user activity logs and is experiencing throttled writes on the companys DynamoDB table. The company is NOT consuming close to the provisioned capacity. The table contains a large number of items and is partitioned on user and sorted by date. The table is 200GB and is currently provisioned at 10K WCU and 20K RCU.
Which two additional pieces of information are required to determine the cause of the throttling? (Choose two.)

**A:** The structure of any GSIs that have been defined on the table

**B:** CloudWatch data showing consumed and provisioned write capacity when writes are being throttled

**C:** Application-level metrics showing the average item size and peak update rates for each attribute

**D:** The structure of any LSIs that have been defined on the table

**E:** The maximum historical WCU and RCU for the table



**Answer: AD**

**Timestamp: 2019-09-16 02:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5216-exam-aws-certified-big-data-specialty-topic-1-question-48/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 49 discussion

A city has been collecting data on its public bicycle share program for the past three years. The 5PB dataset currently resides on Amazon S3. The data contains the following datapoints:
✑ Bicycle origination points
✑ Bicycle destination points
✑ Mileage between the points
✑ Number of bicycle slots available at the station (which is variable based on the station location)
✑ Number of slots available and taken at a given time
The program has received additional funds to increase the number of bicycle stations available. All data is regularly archived to Amazon Glacier.
The new bicycle stations must be located to provide the most riders access to bicycles.
How should this task be performed?

**A:** Move the data from Amazon S3 into Amazon EBS-backed volumes and use an EC-2 based Hadoop cluster with spot instances to run a Spark job that performs a stochastic gradient descent optimization.

**B:** Use the Amazon Redshift COPY command to move the data from Amazon S3 into Redshift and perform a SQL query that outputs the most popular bicycle stations.

**C:** Persist the data on Amazon S3 and use a transient EMR cluster with spot instances to run a Spark streaming job that will move the data into Amazon Kinesis.

**D:** Keep the data on Amazon S3 and use an Amazon EMR-based Hadoop cluster with spot instances to run a Spark job that performs a stochastic gradient descent optimization over EMRFS.



**Answer: B**

**Timestamp: 2019-08-14 01:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3564-exam-aws-certified-big-data-specialty-topic-1-question-49/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 5 discussion

Company A operates in Country X. Company A maintains a large dataset of historical purchase orders that contains personal data of their customers in the form of full names and telephone numbers. The dataset consists of 5 text files, 1TB each. Currently the dataset resides on-premises due to legal requirements of storing personal data in-country. The research and development department needs to run a clustering algorithm on the dataset and wants to use Elastic Map Reduce service in the closest AWS region. Due to geographic distance, the minimum latency between the on-premises system and the closet AWS region is 200 ms.
Which option allows Company A to do clustering in the AWS Cloud and meet the legal requirement of maintaining personal data in-country?

**A:** Anonymize the personal data portions of the dataset and transfer the data files into Amazon S3 in the AWS region. Have the EMR cluster read the dataset using EMRFS.

**B:** Establish a Direct Connect link between the on-premises system and the AWS region to reduce latency. Have the EMR cluster read the data directly from the on-premises storage system over Direct Connect.

**C:** Encrypt the data files according to encryption standards of Country X and store them on AWS region in Amazon S3. Have the EMR cluster read the dataset using EMRFS.

**D:** Use AWS Import/Export Snowball device to securely transfer the data to the AWS region and copy the files onto an EBS volume. Have the EMR cluster read the dataset using EMRFS.



**Answer: B**

**Timestamp: 2019-08-13 03:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3512-exam-aws-certified-big-data-specialty-topic-1-question-5/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 41 discussion

An organization uses Amazon Elastic MapReduce(EMR) to process a series of extract-transform-load (ETL) steps that run in sequence. The output of each step must be fully processed in subsequent steps but will not be retained.
Which of the following techniques will meet this requirement most efficiently?

**A:** Use the EMR File System (EMRFS) to store the outputs from each step as objects in Amazon Simple Storage Service (S3).

**B:** Use the s3n URI to store the data to be processed as objects in Amazon S3.

**C:** Define the ETL steps as separate AWS Data Pipeline activities.

**D:** Load the data to be processed into HDFS, and then write the final output to Amazon S3.



**Answer: B**

**Timestamp: 2019-08-13 07:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3524-exam-aws-certified-big-data-specialty-topic-1-question-41/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 42 discussion

The department of transportation for a major metropolitan area has placed sensors on roads at key locations around the city. The goal is to analyze the flow of traffic and notifications from emergency services to identify potential issues and to help planners correct trouble spots.
A data engineer needs a scalable and fault-tolerant solution that allows planners to respond to issues within
30 seconds of their occurrence.
Which solution should the data engineer choose?

**A:** Collect the sensor data with Amazon Kinesis Firehose and store it in Amazon Redshift for analysis. Collect emergency services events with Amazon SQS and store in Amazon DynampDB for analysis.

**B:** Collect the sensor data with Amazon SQS and store in Amazon DynamoDB for analysis. Collect emergency services events with Amazon Kinesis Firehose and store in Amazon Redshift for analysis.

**C:** Collect both sensor data and emergency services events with Amazon Kinesis Streams and use DynamoDB for analysis.

**D:** Collect both sensor data and emergency services events with Amazon Kinesis Firehose and use Amazon Redshift for analysis.



**Answer: A**

**Timestamp: 2019-08-10 08:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3420-exam-aws-certified-big-data-specialty-topic-1-question-42/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 43 discussion

A telecommunications company needs to predict customer churn (i.e., customers who decide to switch to a competitor). The company has historic records of each customer, including monthly consumption patterns, calls to customer service, and whether the customer ultimately quit the service. All of this data is stored in
Amazon S3. The company needs to know which customers are likely going to churn soon so that they can win back their loyalty.
What is the optimal approach to meet these requirements?

**A:** Use the Amazon Machine Learning service to build the binary classification model based on the dataset stored in Amazon S3. The model will be used regularly to predict churn attribute for existing customers.

**B:** Use AWS QuickSight to connect it to data stored in Amazon S3 to obtain the necessary business insight. Plot the churn trend graph to extrapolate churn likelihood for existing customers.

**C:** Use EMR to run the Hive queries to build a profile of a churning customer. Apply a profile to existing customers to determine the likelihood of churn.

**D:** Use a Redshift cluster to COPY the data from Amazon S3. Create a User Defined Function in Redshift that computes the likelihood of churn.



**Answer: B**

**Timestamp: 2019-08-13 08:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3525-exam-aws-certified-big-data-specialty-topic-1-question-43/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 44 discussion

A system needs to collect on-premises application spool files into a persistent storage layer in AWS. Each spool file is 2 KB. The application generates 1 M files per hour. Each source file is automatically deleted from the local server after an hour.
What is the most cost-efficient option to meet these requirements?

**A:** Write file contents to an Amazon DynamoDB table.

**B:** Copy files to Amazon S3 Standard Storage.

**C:** Write file contents to Amazon ElastiCache.

**D:** Copy files to Amazon S3 infrequent Access Storage.



**Answer: C**

**Timestamp: 2019-08-10 14:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3426-exam-aws-certified-big-data-specialty-topic-1-question-44/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 45 discussion

An administrator receives about 100 files per hour into Amazon S3 and will be loading the files into Amazon
Redshift. Customers who analyze the data within Redshift gain significant value when they receive data as quickly as possible. The customers have agreed to a maximum loading interval of 5 minutes.
Which loading approach should the administrator use to meet this objective?

**A:** Load each file as it arrives because getting data into the cluster as quickly as possibly is the priority.

**B:** Load the cluster as soon as the administrator has the same number of files as nodes in the cluster.

**C:** Load the cluster when the administrator has an event multiple of files relative to Cluster Slice Count, or 5 minutes, whichever comes first.

**D:** Load the cluster when the number of files is less than the Cluster Slice Count.



**Answer: C**

**Timestamp: 2019-09-18 07:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5350-exam-aws-certified-big-data-specialty-topic-1-question-45/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 37 discussion

Managers in a company need access to the human resources database that runs on Amazon Redshift, to run reports about their employees. Managers must only see information about their direct reports.
Which technique should be used to address this requirement with Amazon Redshift?

**A:** Define an IAM group for each manager with each employee as an IAM user in that group, and use that to limit the access.

**B:** Use Amazon Redshift snapshot to create one cluster per manager. Allow the manager to access only their designated clusters.

**C:** Define a key for each manager in AWS KMS and encrypt the data for their employees with their private keys.

**D:** Define a view that uses the employee’s manager name to filter the records based on current user names.



**Answer: A**

**Timestamp: 2019-08-13 06:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3522-exam-aws-certified-big-data-specialty-topic-1-question-37/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 38 discussion

A company is building a new application in AWS. The architect needs to design a system to collect application log events. The design should be a repeatable pattern that minimizes data loss if an application instance fails, and keeps a durable copy of a log data for at least 30 days.
What is the simplest architecture that will allow the architect to analyze the logs?

**A:** Write them directly to a Kinesis Firehose. Configure Kinesis Firehose to load the events into an Amazon Redshift cluster for analysis.

**B:** Write them to a file on Amazon Simple Storage Service (S3). Write an AWS Lambda function that runs in response to the S3 event to load the events into Amazon Elasticsearch Service for analysis.

**C:** Write them to the local disk and configure the Amazon CloudWatch Logs agent to load the data into CloudWatch Logs and subsequently into Amazon Elasticsearch Service.

**D:** Write them to CloudWatch Logs and use an AWS Lambda function to load them into HDFS on an Amazon Elastic MapReduce (EMR) cluster for analysis.



**Answer: B**

**Timestamp: 2019-09-05 06:27:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4724-exam-aws-certified-big-data-specialty-topic-1-question-38/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 39 discussion

An organization uses a custom map reduce application to build monthly reports based on many small data files in an Amazon S3 bucket. The data is submitted from various business units on a frequent but unpredictable schedule. As the dataset continues to grow, it becomes increasingly difficult to process all of the data in one day. The organization has scaled up its Amazon EMR cluster, but other optimizations could improve performance.
The organization needs to improve performance with minimal changes to existing processes and applications.
What action should the organization take?

**A:** Use Amazon S3 Event Notifications and AWS Lambda to create a quick search file index in DynamoDB.

**B:** Add Spark to the Amazon EMR cluster and utilize Resilient Distributed Datasets in-memory.

**C:** Use Amazon S3 Event Notifications and AWS Lambda to index each file into an Amazon Elasticsearch Service cluster.

**D:** Schedule a daily AWS Data Pipeline process that aggregates content into larger files using S3DistCp.

**E:** Have business units submit data via Amazon Kinesis Firehose to aggregate data hourly into Amazon S3.



**Answer: B**

**Timestamp: 2019-08-14 13:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3586-exam-aws-certified-big-data-specialty-topic-1-question-39/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 4 discussion

An administrator needs to design a distribution strategy for a star schema in a Redshift cluster. The administrator needs to determine the optimal distribution style for the tables in the Redshift schema.
In which three circumstances would choosing Key-based distribution be most appropriate? (Select three.)

**A:** When the administrator needs to optimize a large, slowly changing dimension table.

**B:** When the administrator needs to reduce cross-node traffic.

**C:** When the administrator needs to optimize the fact table for parity with the number of slices.

**D:** When the administrator needs to balance data distribution and collocation data.

**E:** When the administrator needs to take advantage of data locality on a local node for joins and aggregates.



**Answer: ACD**

**Timestamp: 2019-08-10 14:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3422-exam-aws-certified-big-data-specialty-topic-1-question-4/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 40 discussion

An administrator is processing events in near real-time using Kinesis streams and Lambda. Lambda intermittently fails to process batches from one of the shards due to a 5-munite time limit.
What is a possible solution for this problem?

**A:** Add more Lambda functions to improve concurrent batch processing.

**B:** Reduce the batch size that Lambda is reading from the stream.

**C:** Ignore and skip events that are older than 5 minutes and put them to Dead Letter Queue (DLQ).

**D:** Configure Lambda to read from fewer shards in parallel.



**Answer: D**

**Timestamp: 2019-08-14 15:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3592-exam-aws-certified-big-data-specialty-topic-1-question-40/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 28 discussion

A customer is collecting clickstream data using Amazon Kinesis and is grouping the events by IP address into
5-minute chunks stored in Amazon S3.
Many analysts in the company use Hive on Amazon EMR to analyze this data. Their queries always reference a single IP address. Data must be optimized for querying based on IP address using Hive running on Amazon
EMR.
What is the most efficient method to query the data with Hive?

**A:** Store an index of the files by IP address in the Amazon DynamoDB metadata store for EMRFS.

**B:** Store the Amazon S3 objects with the following naming scheme: bucket_name/source=ip_address/ year=yy/month=mm/day=dd/hour=hh/filename.

**C:** Store the data in an HBase table with the IP address as the row key.

**D:** Store the events for an IP address as a single file in Amazon S3 and add metadata with keys: Hive_Partitioned_IPAddress.



**Answer: A**

**Timestamp: 2019-08-10 14:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3425-exam-aws-certified-big-data-specialty-topic-1-question-28/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 29 discussion

An online retailer is using Amazon DynamoDB to store data related to customer transactions. The items in the table contains several string attributes describing the transaction as well as a JSON attribute containing the shopping cart and other details corresponding to the transaction. Average item size is 250KB, most of which is associated with the JSON attribute. The average customer generates 3GB of data per month.
Customers access the table to display their transaction history and review transaction details as needed.
Ninety percent of the queries against the table are executed when building the transaction history view, with the other 10% retrieving transaction details. The table is partitioned on CustomerID and sorted on transaction date.
The client has very high read capacity provisioned for the table and experiences very even utilization, but complains about the cost of Amazon DynamoDB compared to other NoSQL solutions.
Which strategy will reduce the cost associated with the clients read queries while not degrading quality?

**A:** Modify all database calls to use eventually consistent reads and advise customers that transaction history may be one second out-of-date.

**B:** Change the primary table to partition on TransactionID, create a GSI partitioned on customer and sorted on date, project small attributes into GSI, and then query GSI for summary data and the primary table for JSON details.

**C:** Vertically partition the table, store base attributes on the primary table, and create a foreign key reference to a secondary table containing the JSON data. Query the primary table for summary data and the secondary table for JSON details.

**D:** Create an LSI sorted on date, project the JSON attribute into the index, and then query the primary table for summary data and the LSI for JSON details.



**Answer: D**

**Timestamp: 2019-08-13 05:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3521-exam-aws-certified-big-data-specialty-topic-1-question-29/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 3 discussion

A data engineer chooses Amazon DynamoDB as a data store for a regulated application. This application must be submitted to regulators for review. The data engineer needs to provide a control framework that lists the security controls from the process to follow to add new users down to the physical controls of the data center, including items like security guards and cameras.
How should this control mapping be achieved using AWS?

**A:** Request AWS third-party audit reports and/or the AWS quality addendum and map the AWS responsibilities to the controls that must be provided.

**B:** Request data center Temporary Auditor access to an AWS data center to verify the control mapping.

**C:** Request relevant SLAs and security guidelines for Amazon DynamoDB and define these guidelines within the applications architecture to map to the control framework.

**D:** Request Amazon DynamoDB system architecture designs to determine how to map the AWS responsibilities to the control that must be provided.



**Answer: A**

**Timestamp: 2019-09-17 10:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5298-exam-aws-certified-big-data-specialty-topic-1-question-3/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 30 discussion

A company that manufactures and sells smart air conditioning units also offers add-on services so that customers can see real-time dashboards in a mobile application or a web browser. Each unit sends its sensor information in JSON format every two seconds for processing and analysis. The company also needs to consume this data to predict possible equipment problems before they occur. A few thousand pre-purchased units will be delivered in the next couple of months. The company expects high market growth in the next year and needs to handle a massive amount of data and scale without interruption.
Which ingestion solution should the company use?

**A:** Write sensor data records to Amazon Kinesis Streams. Process the data using KCL applications for the end-consumer dashboard and anomaly detection workflows.

**B:** Batch sensor data to Amazon Simple Storage Service (S3) every 15 minutes. Flow the data downstream to the end-consumer dashboard and to the anomaly detection application.

**C:** Write sensor data records to Amazon Kinesis Firehose with Amazon Simple Storage Service (S3) as the destination. Consume the data with a KCL application for the end-consumer dashboard and anomaly detection.

**D:** Write sensor data records to Amazon Relational Database Service (RDS). Build both the end-consumer dashboard and anomaly detection application on top of Amazon RDS.



**Answer: C**

**Timestamp: 2019-08-11 00:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3434-exam-aws-certified-big-data-specialty-topic-1-question-30/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 31 discussion

An organization needs a data store to handle the following data types and access patterns:
✑ Faceting
✑ Search
✑ Flexible schema (JSON) and fixed schema
✑ Noise word elimination
Which data store should the organization choose?

**A:** Amazon Relational Database Service (RDS)

**B:** Amazon Redshift

**C:** Amazon DynamoDB

**D:** Amazon Elasticsearch Service



**Answer: C**

**Timestamp: 2019-08-07 23:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3347-exam-aws-certified-big-data-specialty-topic-1-question-31/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 64 discussion

A solutions architect for a logistics organization ships packages from thousands of suppliers to end customers.
The architect is building a platform where suppliers can view the status of one or more of their shipments.
Each supplier can have multiple roles that will only allow access to specific fields in the resulting information.
Which strategy allows the appropriate level of access control and requires the LEAST amount of management work?

**A:** Send the tracking data to Amazon Kinesis Streams. Use AWS Lambda to store the data in an Amazon DynamoDB Table. Generate temporary AWS credentials for the suppliers users with AWS STS, specifying fine-grained security policies to limit access only to their applicable data.

**B:** Send the tracking data to Amazon Kinesis Firehose. Use Amazon S3 notifications and AWS Lambda to prepare files in Amazon S3 with appropriate data for each suppliers roles. Generate temporary AWS credentials for the suppliers users with AWS STS. Limit access to the appropriate files through security policies.

**C:** Send the tracking data to Amazon Kinesis Streams. Use Amazon EMR with Spark Streaming to store the data in HBase. Create one table per supplier. Use HBase Kerberos integration with the suppliers users. Use HBase ACL-based security to limit access for the roles to their specific table and columns.

**D:** Send the tracking data to Amazon Kinesis Firehose. Store the data in an Amazon Redshift cluster. Create views for the suppliers users and roles. Allow suppliers access to the Amazon Redshift cluster using a user limited to the applicable view. B



**Answer: Explanation**

**Timestamp: 2019-08-14 03:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3565-exam-aws-certified-big-data-specialty-topic-1-question-64/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 65 discussion

A companys social media manager requests more staff on the weekends to handle an increase in customer contacts from a particular region. The company needs a report to visualize the trends on weekends over the past 6 months using QuickSight.
How should the data be represented?

**A:** A line graph plotting customer contacts vs. time, with a line for each region

**B:** A pie chart per region plotting customer contacts per day of week

**C:** A map of regions with a heatmap overlay to show the volume of customer contacts

**D:** A bar graph plotting region vs. volume of social media contacts



**Answer: C**

**Timestamp: 2019-06-25 08:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/1995-exam-aws-certified-big-data-specialty-topic-1-question-65/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 7 discussion

A large grocery distributor receives daily depletion reports from the field in the form of gzip archives od CSV files uploaded to Amazon S3. The files range from 500MB to 5GB. These files are processed daily by an EMR job.
Recently it has been observed that the file sizes vary, and the EMR jobs take too long. The distributor needs to tune and optimize the data processing workflow with this limited information to improve the performance of the
EMR job.
Which recommendation should an administrator provide?

**A:** Reduce the HDFS block size to increase the number of task processors.

**B:** Use bzip2 or Snappy rather than gzip for the archives.

**C:** Decompress the gzip archives and store the data as CSV files.

**D:** Use Avro rather than gzip for the archives.



**Answer: B**

**Timestamp: 2019-09-17 10:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5299-exam-aws-certified-big-data-specialty-topic-1-question-7/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 8 discussion

A web-hosting company is building a web analytics tool to capture clickstream data from all of the websites hosted within its platform and to provide near-real-time business intelligence. This entire system is built on
AWS services. The web-hosting company is interested in using Amazon Kinesis to collect this data and perform sliding window analytics.
What is the most reliable and fault-tolerant technique to get each website to send data to Amazon Kinesis with every click?

**A:** After receiving a request, each web server sends it to Amazon Kinesis using the Amazon Kinesis PutRecord API. Use the sessionID as a partition key and set up a loop to retry until a success response is received.

**B:** After receiving a request, each web server sends it to Amazon Kinesis using the Amazon Kinesis Producer Library .addRecords method.

**C:** Each web server buffers the requests until the count reaches 500 and sends them to Amazon Kinesis using the Amazon Kinesis PutRecord API.

**D:** After receiving a request, each web server sends it to Amazon Kinesis using the Amazon Kinesis PutRecord API. Use the exponential back-off algorithm for retries until a successful response is received.



**Answer: A**

**Timestamp: 2019-07-14 04:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/2485-exam-aws-certified-big-data-specialty-topic-1-question-8/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 9 discussion

A customer has an Amazon S3 bucket. Objects are uploaded simultaneously by a cluster of servers from multiple streams of data. The customer maintains a catalog of objects uploaded in Amazon S3 using an
Amazon DynamoDB table. This catalog has the following fileds: StreamName, TimeStamp, and ServerName, from which ObjectName can be obtained.
The customer needs to define the catalog to support querying for a given stream or server within a defined time range.
Which DynamoDB table scheme is most efficient to support these queries?

**A:** Define a Primary Key with ServerName as Partition Key and TimeStamp as Sort Key. Do NOT define a Local Secondary Index or Global Secondary Index.

**B:** Define a Primary Key with StreamName as Partition Key and TimeStamp followed by ServerName as Sort Key. Define a Global Secondary Index with ServerName as partition key and TimeStamp followed by StreamName.

**C:** Define a Primary Key with ServerName as Partition Key. Define a Local Secondary Index with StreamName as Partition Key. Define a Global Secondary Index with TimeStamp as Partition Key.

**D:** Define a Primary Key with ServerName as Partition Key. Define a Local Secondary Index with TimeStamp as Partition Key. Define a Global Secondary Index with StreamName as Partition Key and TimeStamp as Sort Key.



**Answer: A**

**Timestamp: 2019-08-13 03:31:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3513-exam-aws-certified-big-data-specialty-topic-1-question-9/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 6 discussion

An administrator needs to design a strategy for the schema in a Redshift cluster. The administrator needs to determine the optimal distribution style for the tables in the Redshift schema.
In which two circumstances would choosing EVEN distribution be most appropriate? (Choose two.)

**A:** When the tables are highly denormalized and do NOT participate in frequent joins.

**B:** When data must be grouped based on a specific key on a defined slice.

**C:** When data transfer between nodes must be eliminated.

**D:** When a new table has been loaded and it is unclear how it will be joined to dimension.



**Answer: BD**

**Timestamp: 2019-08-06 09:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3261-exam-aws-certified-big-data-specialty-topic-1-question-6/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 60 discussion

A company that provides economics data dashboards needs to be able to develop software to display rich, interactive, data-driven graphics that run in web browsers and leverages the full stack of web standards
(HTML, SVG, and CSS).
Which technology provides the most appropriate support for this requirements?

**A:** D3.js

**B:** IPython/Jupyter

**C:** R Studio

**D:** Hue



**Answer: A**

**Timestamp: 2019-09-18 08:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/5360-exam-aws-certified-big-data-specialty-topic-1-question-60/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 61 discussion

A company hosts a portfolio of e-commerce websites across the Oregon, N. Virginia, Ireland, and Sydney
AWS regions. Each site keeps log files that capture user behavior. The company has built an application that generates batches of product recommendations with collaborative filtering in Oregon. Oregon was selected because the flagship site is hosted there and provides the largest collection of data to train machine learning models against. The other regions do NOT have enough historic data to train accurate machine learning models.
Which set of data processing steps improves recommendations for each region?

**A:** Use the e-commerce application in Oregon to write replica log files in each other region.

**B:** Use Amazon S3 bucket replication to consolidate log entries and build a single model in Oregon.

**C:** Use Kinesis as a buffer for web logs and replicate logs to the Kinesis stream of a neighboring region.

**D:** Use the CloudWatch Logs agent to consolidate logs into a single CloudWatch Logs group.



**Answer: D**

**Timestamp: 2019-07-15 10:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/2499-exam-aws-certified-big-data-specialty-topic-1-question-61/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 62 discussion

There are thousands of text files on Amazon S3. The total size of the files is 1 PB. The files contain retail order information for the past 2 years. A data engineer needs to run multiple interactive queries to manipulate the data. The Data Engineer has AWS access to spin up an Amazon EMR cluster. The data engineer needs to use an application on the cluster to process this data and return the results in interactive time frame.
Which application on the cluster should the data engineer use?

**A:** Oozie

**B:** Apache Pig with Tachyon

**C:** Apache Hive

**D:** Presto



**Answer: C**

**Timestamp: 2019-08-12 09:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3494-exam-aws-certified-big-data-specialty-topic-1-question-62/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 1 question 63 discussion

A media advertising company handles a large number of real-time messages sourced from over 200 websites.
The companys data engineer needs to collect and process records in real time for analysis using Spark
Streaming on Amazon Elastic MapReduce (EMR). The data engineer needs to fulfill a corporate mandate to keep ALL raw messages as they are received as a top priority.
Which Amazon Kinesis configuration meets these requirements?

**A:** Publish messages to Amazon Kinesis Firehose backed by Amazon Simple Storage Service (S3). Pull messages off Firehose with Spark Streaming in parallel to persistence to Amazon S3.

**B:** Publish messages to Amazon Kinesis Streams. Pull messages off Streams with Spark Streaming in parallel to AWS Lambda pushing messages from Streams to Firehose backed by Amazon Simple Storage Service (S3).

**C:** Publish messages to Amazon Kinesis Firehose backed by Amazon Simple Storage Service (S3). Use AWS Lambda to pull messages from Firehose to Streams for processing with Spark Streaming.

**D:** Publish messages to Amazon Kinesis Streams, pull messages off with Spark Streaming, and write row data to Amazon Simple Storage Service (S3) before and after processing.



**Answer: C**

**Timestamp: 2019-08-11 00:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/3435-exam-aws-certified-big-data-specialty-topic-1-question-63/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 1 discussion

An Amazon Redshift Database is encrypted using KMS. A data engineer needs to use the AWS CLI to create a KMS encrypted snapshot of the database in another AWS region.
Which three steps should the data engineer take to accomplish this task? (Choose three.)

**A:** Create a new KMS key in the destination region.

**B:** Copy the existing KMS key to the destination region.

**C:** Use CreateSnapshotCopyGrant to allow Amazon Redshift to use the KMS key from the source region.

**D:** In the source region, enable cross-region replication and specify the name of the copy grant created.

**E:** In the destination region, enable cross-region replication and specify the name of the copy grant created.

**F:** Use CreateSnapshotCopyGrant to allow Amazon Redshift to use the KMS key created in the destination region. ADF



**Answer: Explanation**

**Timestamp: 2019-08-26 08:47:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4092-exam-aws-certified-big-data-specialty-topic-2-question-1/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 10 discussion

An organization currently runs a large Hadoop environment in their data center and is in the process of creating an alternative Hadoop environment on AWS, using Amazon EMR.
They generate around 20 TB of data on a monthly basis. Also on a monthly basis, files need to be grouped and copied to Amazon S3 to be used for the Amazon
EMR environment. They have multiple S3 buckets across AWS accounts to which data needs to be copied. There is a 10G AWS Direct Connect setup between their data center and AWS, and the network team has agreed to allocate 50% of AWS Direct Connect bandwidth to data transfer. The data transfer cannot take more than two days.
What would be the MOST efficient approach to transfer data to AWS on a monthly basis?

**A:** Use an offline copy method, such as an AWS Snowball device, to copy and transfer data to Amazon S3.

**B:** Configure a multipart upload for Amazon S3 on AWS Java SDK to transfer data over AWS Direct Connect.

**C:** Use Amazon S3 transfer acceleration capability to transfer data to Amazon S3 over AWS Direct Connect.

**D:** Setup S3DistCop tool on the on-premises Hadoop environment to transfer data to Amazon S3 over AWS Direct Connect.



**Answer: B**

**Timestamp: 2019-08-26 05:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4076-exam-aws-certified-big-data-specialty-topic-2-question-10/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 11 discussion

An organization is developing a mobile social application and needs to collect logs from all devices on which it is installed. The organization is evaluating the
Amazon Kinesis Data Streams to push logs and Amazon EMR to process data. They want to store data on HDFS using the default replication factor to replicate data among the cluster, but they are concerned about the durability of the data. Currently, they are producing 300 GB of raw data daily, with additional spikes during special events. They will need to scale out the Amazon EMR cluster to match the increase in streamed data.
Which solution prevents data loss and matches compute demand?

**A:** Use multiple Amazon EBS volumes on Amazon EMR to store processed data and scale out the Amazon EMR cluster as needed.

**B:** Use the EMR File System and Amazon S3 to store processed data and scale out the Amazon EMR cluster as needed.

**C:** Use Amazon DynamoDB to store processed data and scale out the Amazon EMR cluster as needed.

**D:** use Amazon Kinesis Data Firehose and, instead of using Amazon EMR, stream logs directly into Amazon Elasticsearch Service.



**Answer: D**

**Timestamp: 2019-08-26 06:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4077-exam-aws-certified-big-data-specialty-topic-2-question-11/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 12 discussion

An advertising organization uses an application to process a stream of events that are received from clients in multiple unstructured formats.
The application does the following:
✑ Transforms the events into a single structured format and streams them to Amazon Kinesis for real-time analysis.
✑ Stores the unstructured raw events from the log files on local hard drivers that are rotated and uploaded to Amazon S3.
The organization wants to extract campaign performance reporting using an existing Amazon redshift cluster.
Which solution will provide the performance data with the LEAST number of operations?

**A:** Install the Amazon Kinesis Data Firehose agent on the application servers and use it to stream the log files directly to Amazon Redshift.

**B:** Create an external table in Amazon Redshift and point it to the S3 bucket where the unstructured raw events are stored.

**C:** Write an AWS Lambda function that triggers every hour to load the new log files already in S3 to Amazon redshift.

**D:** Connect Amazon Kinesis Data Firehose to the existing Amazon Kinesis stream and use it to stream the event directly to Amazon Redshift.



**Answer: B**

**Timestamp: 2019-08-26 06:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4078-exam-aws-certified-big-data-specialty-topic-2-question-12/)

----------------------------------------

## Exam AWS Certified Big Data - Specialty topic 2 question 13 discussion

An organization needs to store sensitive information on Amazon S3 and process it through Amazon EMR. Data must be encrypted on Amazon S3 and Amazon
EMR at rest and in transit. Using Thrift Server, the Data Analysis team users HIVE to interact with this data. The organization would like to grant access to only specific databases and tables, giving permission only to the SELECT statement.
Which solution will protect the data and limit user access to the SELECT statement on a specific portion of data?

**A:** Configure Transparent Data Encryption on Amazon EMR. Create an Amazon EC2 instance and install Apache Ranger. Configure the authorization on the cluster to use Apache Ranger.

**B:** Configure data encryption at rest for EMR File System (EMRFS) on Amazon S3. Configure data encryption in transit for traffic between Amazon S3 and EMRFS. Configure storage and SQL base authorization on HiveServer2.

**C:** Use AWS KMS for encryption of data. Configure and attach multiple roles with different permissions based on the different user needs.

**D:** Configure Security Group on Amazon EMR. Create an Amazon VPC endpoint for Amazon S3. Configure HiveServer2 to use Kerberos authentication on the cluster.



**Answer: C**

**Timestamp: 2019-08-26 06:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/4079-exam-aws-certified-big-data-specialty-topic-2-question-13/)

----------------------------------------

