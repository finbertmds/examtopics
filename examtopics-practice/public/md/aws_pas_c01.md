# Exam Topics Questions

@thatonecodes

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 86 discussion

An SAP engineer is designing an SAP S/4HANA high availability architecture on Linux Amazon EC2 instances in two Availability Zones. The SAP engineer needs to create a solution to achieve high availability and consistency for /usr/sap/trans end /usr/sap/ file systems.

Which solution will meet these requirements with the MOST reliability?

**A:** Set up an NFS server on one of the EC2 instances.

**B:** Use Amazon Elastic File System (Amazon EFS).

**C:** Use the EC2 local instance store.

**D:** Use Amazon Elastic Block Store (Amazon EBS) Multi-Attach.



**Answer: B**

**Timestamp: 2023-07-27 21:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116624-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 87 discussion

A company migrated its SAP environment to AWS 6 months ago. The landscape consists of a few thousand Amazon EC2 instances for production, development, quality, and sandbox environments. The company wants to minimize the operational cost of the landscape without affecting system performance and availability.

Which solutions will meet these requirements? (Choose two.)

**A:** Scale down the EC2 instance size for non-production environments.

**B:** Create an AWS Systems Manager document to automatically stop and start the SAP systems. Use Amazon CloudWatch to automate the scheduling of this task.

**C:** Review the billing data for the EC2 instances. Analyze the workload, and choose an EC2 Instance Savings Plan.

**D:** Create an AWS Systems Manager document to automatically stop and start the SAP systems and EC2 instances for non-production environments outside business hours. Use Amazon EventBridge to automate the scheduling of this task.

**E:** Create an AWS Systems Manager document to automatically stop and start the SAP systems and EC2 instances. Maintain the schedule in the Systems Manager document to automate this task.



**Answer: CD**

**Timestamp: 2023-08-01 14:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116985-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 88 discussion

An SAP solutions architect needs to design a highly available solution to support a 12 TB SAP HANA system on AWS. The solution will be deployed in a single AWS Region.

Which solution will meet these requirements MOST cost-effectively?

**A:** Use an SAP certified high availability cluster solution and SAP HANA backup and restore.

**B:** Use an SAP certified high availability cluster solution and SAP HANA system replication with data preload.

**C:** Use an SAP certified high availability cluster solution and multi-tiered SAP HANA system replication.

**D:** Use an SAP certified high availability cluster solution and storage replication with AWS Elastic Disaster Recovery.



**Answer: B**

**Timestamp: 2023-07-28 20:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116694-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 89 discussion

A company's SAP solutions architect is configuring a network architecture for an SAP HANA multi-node environment. The company requires isolation of the logical network zones: client, internal, and storage. The database runs on X1 (memory optimized) Amazon EC2 instances and uses Amazon Elastic Block Store (Amazon EBS) volumes for persistent storage.

Which combination of actions will provide the required isolation? (Choose three.)

**A:** Attach an AWS Network Firewall policy for each zone to the subnet for the node cluster.

**B:** Attach a secondary elastic network interface to each instance for the internal communications between nodes.

**C:** Attach a secondary elastic network interface to each instance for the storage communications.

**D:** Configure a security group with rules that allow only TCP connections within the security group on the ports that are assigned for the internal network connections. Associate the security group with the appropriate elastic network interface on each instance.

**E:** Configure a security group with rules that allow only TCP connections with the external customer network on the ports that are assigned for the client connections. Associate the security group with the appropriate elastic network interface.

**F:** Configure a security group with rules that allow Non-Volatile Memory Express (NVMe) connections within the subnet range. Associate the security group with the appropriate elastic network interface on each instance.



**Answer: BCD**

**Timestamp: 2023-08-02 05:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117045-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 9 discussion

A company wants to migrate its SAP workloads to AWS from another cloud provider. The company’s landscape consists of SAP S/4HANA, SAP BW/4HANA, SAP Solution Manager, and SAP Web Dispatcher. SAP Solution Manager is running on SAP HANA.
The company wants to change the operating system from SUSE Linux Enterprise Server to Red Hat Enterprise Linux as a part of this migration. The company needs a solution that results in the least possible downtime for the SAP S/4HANA and SAP BW/4HANA systems.
Which migration solution will meet these requirements?

**A:** Use SAP Software Provisioning Manager to perform a system export/import for SAP S/4HANA, SAP BW/4HANA, SAP Solution Manager, and SAP Web Dispatcher.

**B:** Use backup and restore for SAP S/4HANA, SAP BW/4HANA, and SAP Solution Manager. Reinstall SAP Web Dispatcher on AWS with the necessary configuration.

**C:** Use backup and restore for SAP S/4HANA and SAP BW/4HANA. Use SAP Software Provisioning Manager to perform a system export/import for SAP Solution Manager. Reinstall SAP Web Dispatcher on AWS with the necessary configuration.

**D:** Use SAP HANA system replication to replicate the data between the source system and the target AWS system for SAP S/4HANA and SAP BW/4HANA. Use SAP Software Provisioning Manager to perform a system export/import for SAP Solution Manager. Reinstall SAP Web Dispatcher on AWS with the necessary configuration.



**Answer: D**

**Timestamp: 2023-01-29 15:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97140-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 117 discussion

A company is running its on-premises SAP ERP Central Component (SAP ECC) production workload on SUSE Linux Enterprise Server. The SAP ECC workload uses an Oracle database that has 20 TB of data.

The company needs to migrate the SAP ECC workload to AWS with no change in database technology. The company must minimize production system downtime.

Which solution will meet these requirements?

**A:** Migrate the SAP ECC workload to AWS by using AWS Application Migration Service.

**B:** Install SAP ECC application instances on SUSE Linux Enterprise Server. Use AWS Database Migration Service (AWS DMS) to migrate the Oracle database to Amazon RDS for Oracle.

**C:** Migrate the SAP ECC workload to AWS by using SAP Software Provisioning Manager on Oracle Enterprise Linux.

**D:** Install SAP ECC with an Oracle database on Oracle Enterprise Linux. Perform the migration by using Oracle Cross-Platform Transportable Tablespace (XTTS).



**Answer: D**

**Timestamp: 2024-01-18 18:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131546-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 118 discussion

A company is running an SAP Commerce application in a development environment. The company is ready to deploy the application to a production environment on AWS.

The company expects the production application to receive a large increase in transactions during sales and promotions. The application's database must automatically scale the storage, CPU, and memory to minimize costs during periods of low demand and maintain high availability and performance during periods of high demand.

Which solution will meet these requirements?

**A:** Use an SAP HANA single-node deployment that runs on burstable performance Amazon EC2 instances.

**B:** Use an Amazon Aurora MySQL database that runs on serverless DB instance types.

**C:** Use a HyperSQL database that runs on Amazon Elastic Container Service (Amazon ECS) containers with ECS Service Auto Scaling.

**D:** Use an Amazon RDS for MySQL DB cluster that consists of high memory DB instance types.



**Answer: B**

**Timestamp: 2024-01-18 11:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131500-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 119 discussion

A company is planning to implement a new SAP workload on SUSE Linux Enterprise Server on AWS. The company needs to use AWS Key Management Service (AWS KMS) to encrypt every file at rest. The company also requires that its production SAP workloads and non-production SAP workloads are separated into different AWS accounts.

The production account and the non-production account share a common SAP transport directory, /usr/sap/trans. The two accounts are connected by VPC peering.

What should the company do to achieve the data encryption at rest for the new SAP workload?

**A:** Create an asymmetric KMS customer managed key in the production account. Create Amazon Elastic Block Store (Amazon EBS) and Amazon Elastic File System (Amazon EFS) storage for all root and SAP data. Implement encryption that uses the KMS key. Share the EFS file system from the production account with the non-production account. Import the KMS key into the non-production account to allow the production systems to access the SAP transport directory.

**B:** Create a symmetric KMS customer managed key in the production account. Create Amazon Elastic Block Store (Amazon EBS) and Amazon Elastic File System (Amazon EFS) storage for all root and SAP data. Implement encryption that uses the KMS key. Share the EFS file system from the production account with the non-production account. Create an IAM role in the non-production account and a key policy for the KMS key in the production account to allow the non-production systems to access the SAP transport directory.

**C:** Create a symmetric KMS customer managed key in the production account. Create Amazon Elastic Block Store (Amazon EBS) and Amazon Elastic File System (Amazon EFS) storage for all root and SAP data. Implement encryption that uses the KMS key. Share the EFS file system from the production account with the non-production account. Create an IAM role in the production account and a key policy for the KMS key in the production account to allow the non-production systems to access the SAP transport directory.

**D:** Create an asymmetric KMS customer managed key in the production account. Create Amazon Elastic Block Store (Amazon EBS) and Amazon Elastic File System (Amazon EFS) storage for all root and SAP data. Implement encryption that uses the KMS key. Share the EFS file system from the production account with the non-production account. Create an IAM role in the non-production account and a key policy for the KMS key in the production account to allow the non-production systems to access the SAP transport directory.



**Answer: B**

**Timestamp: 2024-01-18 19:09:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131547-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 12 discussion

A company needs to migrate its critical SAP workloads from an on-premises data center to AWS. The company has a few source production databases that are 10 TB or more in size. The company wants to minimize the downtime for this migration.
As part of the proof of concept, the company used a low-speed, high-latency connection between its data center and AWS. During the actual migration, the company wants to maintain a consistent connection that delivers high bandwidth and low latency. The company also wants to add a layer of connectivity resiliency. The backup connectivity does not need to be as fast as the primary connectivity.
An SAP solutions architect needs to determine the optimal network configuration for data transfer. The solution must transfer the data with minimum latency.
Which configuration will meet these requirements?

**A:** Set up one AWS Direct Connect connection for connectivity between the on-premises data center and AWS. Add an AWS Site-to-Site VPN connection as a backup to the Direct Connect connection.

**B:** Set up an AWS Direct Connect gateway with multiple Direct Connect connections that use a link aggregation group (LAG) between the on-premises data center and AWS.

**C:** Set up Amazon Elastic File System (Amazon EFS) file system storage between the on-premises data center and AWS. Configure a cron job to copy the data into this EFS mount. Access the data in the EFS file system from the target environment.

**D:** Set up two redundant AWS Site-to-Site VPN connections for connectivity between the on-premises data center and AWS.



**Answer: A**

**Timestamp: 2023-01-25 05:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96802-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 120 discussion

A company wants to migrate its SAP S/4HANA infrastructure to AWS. The infrastructure includes production, pre-production, test, and development environments. The pre-production environment is an identical copy of the production environment.

The production system must comply with a new policy that requires the landscape to be able to fail over to a secondary AWS Region. The required RPO is 5 minutes. The required RTO is 4 hours. The estimated SAP HANA database size is 6 TB.

Which solution will meet these requirements MOST cost-effectively?

**A:** Deploy the pre-production environment in a primary Region. Deploy the other environments in a secondary Region. Configure the disaster recovery SAP HANA system on the pre-production hardware. Implement replication by setting the preload_column_tables parameter to false. Before failover, stop the pre-production environment, set the preload_column_tables parameter to true, and allocate the memory for production takeover.

**B:** Deploy all environments in a primary Region. Configure a 500 GB disaster recovery (DR) site in a secondary Region. Configure DR SAP HANA system replication on the pre-production hardware by setting the preload_column_tables parameter to false. In the event of a disaster, resize the DR environment to 6 TB, set the preload_column_tables parameter to true, and perform a takeover.

**C:** Deploy all environments in a primary Region. Configure a 6 TB disaster recovery (DR) site in a secondary Region. In the event of a disaster, perform a takeover on the DR site.

**D:** Deploy all environments in a primary Region. Configure a 6 TB disaster recovery (DR) site in the same Region. In the event of a disaster, perform a takeover on the DR site.



**Answer: A**

**Timestamp: 2023-12-30 09:14:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/129852-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 95 discussion

A company plans to migrate a critical SAP S/4HANA workload from on-premises hardware to AWS. An SAP solutions architect needs to develop a solution to effectively monitor the SAP landscape on AWS for this workload. The solution must capture resource utilization and must follow a serverless approach to monitor the SAP environment. The solution also must track all the API calls that are made within the company's AWS account.

Which combination of steps should the SAP solutions architect take to meet these requirements? (Choose two.)

**A:** Configure Amazon CloudWatch detailed monitoring for the AWS resources in the SAP landscape. Use AWS Lambda, and create the Lambda layer "sapjco" for the SAP Java Connector. Deploy the solution with AWS Serverless Application Repository for sap-monitor.

**B:** Set up a Multi-AZ deployment of SAP on AWS. Use Amazon EC2 Auto Scaling to add or remove EC2 instances automatically based on the CPU utilization of the SAP instance.

**C:** Use AWS CloudTrail to log and retain account activity related to actions across the SAP on AWS infrastructure.

**D:** Use the AWS Personal Health Dashboard to get a personalized view of performance and availability of the underlying AWS resources.

**E:** Use AWS Trusted Advisor to optimize the AWS infrastructure and to improve security and performance.



**Answer: AC**

**Timestamp: 2023-07-27 21:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116626-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 96 discussion

A company is planning to deploy SAP HANA on AWS. The block storage that hosts the SAP HANA data volume must have at least 64,000 IOPS per volume and must have a maximum throughput of at least 500 MiB/s per volume.

Which Amazon Elastic Block Store (Amazon EBS) volume meets these requirements?

**A:** General Purpose SSD (gp2) EBS volume

**B:** General Purpose SSD (gp3) EBS volume

**C:** Provisioned IOPS SSD (io2) EBS volume

**D:** Throughput Optimized HDD (st1) EBS volume



**Answer: C**

**Timestamp: 2023-07-27 21:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116627-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 97 discussion

An SAP engineer is configuring AWS Backint Agent for SAP HANA (AWS Backint agent) for an SAP HANA database that is running on an Amazon EC2 instance. After the configuration, the backups fail. During investigation, the SAP engineer notices that the AWS Backint agent logs contain numerous AccessDenied messages.

Which actions should the SAP engineer take to resolve this issue? (Choose two.)

**A:** Update the EC2 role permissions to allow S3 bucket access.

**B:** Verify that the configuration file has the correct formatting of the S3BucketOwnerAccountID.

**C:** Install AWS Systems Manager Agent (SSM Agent) correctly by using the sudo command.

**D:** Install the correct version of Python for AWS Backint agent.

**E:** Add the execute permission to the AWS Backint agent binary.



**Answer: AB**

**Timestamp: 2023-07-27 21:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116628-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 98 discussion

A company is running its production SAP HANA system on AWS. The SAP HANA system is hosted on an Amazon EC2 instance that runs SUSE Linux Enterprise Server 12. The operating system patch version is out of date, and SAP has identified some critical security vulnerabilities.

SUSE publishes a critical patch update that requires a system restart to fix the issue. The company must apply this patch along with many prerequisite patches.

Which solution will meet these requirements with the LEAST system downtime?

**A:** Use the SUSE Linux Enterprise Server patching update process and SUSE tools to apply the required patches to the existing instance.

**B:** Use AWS Systems Manager Patch Manager to automatically apply the patches to the existing instance.

**C:** Use AWS Launch Wizard for SAP to provision a second SAP HANA instance with an AMI that contains the required patches. Use SAP HANA system replication to copy the data from the original SAP HANA instance to the newly launched SAP HANA instance. Perform SAP HANA system replication takeover.

**D:** Use AWS Launch Wizard for SAP to provision a second SAP HANA instance with an AMI that contains the required patches. Use SAP HANA native backup and restore to copy the data from the original SAP HANA instance to the newly launched SAP HANA instance.



**Answer: C**

**Timestamp: 2023-07-27 23:03:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116629-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 99 discussion

A company recently implemented an architecture in which all the systems and components of the company's SAP environment are hosted on AWS. Front-end users connect from the corporate data center. SAP application servers and database servers are hosted in a private subnet.

The company has the following requirements:

• Ensure that the instances in the private subnet can connect to the internet and other AWS services.
• Prevent instances from receiving inbound traffic that is initiated by someone on the inter-net.
• For SAP support, allow a remote connection between the company's network and SAP. Ensure that access is available to the production environment as needed.

Which solution will meet these requirements?

**A:** Use a NAT gateway to ensure connectivity between the instances in the private subnet and other AWS services. Deploy SAProuter in a public subnet. Assign a public IP address that is reachable from the internet.

**B:** Use NAT instances to ensure connectivity between the instances in the private subnet and other AWS services. Deploy SAProuter in the private subnet with an Elastic IP address that is reachable from the internet.

**C:** Use a bastion host to ensure connectivity between the instances in the private subnet and other AWS services. Set up an AWS Direct Connect connection between the SAP support network and the AWS Region where the architecture is implemented.

**D:** Use an internet gateway to ensure connectivity between the instances in the private subnet and other AWS services. Deploy SAProuter in a public subnet. Assign a public IP address that is reachable from the internet.



**Answer: A**

**Timestamp: 2023-07-27 23:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116631-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 103 discussion

A company wants to migrate a native SAP HANA database to AWS. The database ingests large amounts of data every month, and the size of the database is growing rapidly.

The company needs to store data for 10 years to meet a regulatory requirement. The company uses data from the last 2 years frequently in several reports. This recent data is critical and must be accessed quickly. The data that is 3-6 years old is used a few times a year and can be accessed in a longer time frame. The data that is more than 6 years old is rarely used and also can be accessed in a longer time frame.

Which combination of steps will meet these requirements? (Choose three.)

**A:** Keep the frequently accessed data from the last 2 years in a hot tier on an SAP HANA certified Amazon EC2 instance.

**B:** Move the frequently accessed data from the last 2 years to SAP Information Life Cycle Management (ILM) with SAP IQ.

**C:** Move the less frequently accessed data that is 3-6 years old to a warm tier on Amazon Elastic File System (Amazon EFS) by using SAP HANA dynamic tiering.

**D:** Move the less frequently accessed data that is 3-6 years old to a warm tier on Amazon Elastic File System (Amazon EFS) by using data aging.

**E:** Move the rarely accessed data that is more than 6 years old to a cold tier on Amazon S3 by using SAP Data Hub.

**F:** Move the rarely accessed data that is more than 6 years old to a cold tier on SAP BW Near Line Storage (NLS) with Apache Hadoop.



**Answer: A**

**Timestamp: 2023-07-27 23:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116637-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 104 discussion

An SAP engineer is designing a storage configuration for an SAP S/4HANA production system on AWS. The system will run on an Amazon EC2 instance with a memory size of 2 TB. The SAP HANA sizing report recommends storage of 2,400 GB for data and 512 GB for logs. The system requires 9,000 IOPS for data storage and throughput of 300 MBps for log storage.

Which Amazon Elastic Block Store (Amazon EBS) volume configuration will meet these requirements MOST cost-effectively?

**A:** For /hana/data, use two 900 GB Provisioned IOPS SSD (io1) EBS volumes that are configured with RAID 0 striping and the required IOPS. For /hana/log, use one 512 GB General Purpose SSD (gp3) EBS volume that is configured with the required throughput.

**B:** For /hana/data, use one 2,400 GB General Purpose SSD (gp3) EBS volume that is configured with the required IOPS. For /hana/log, use one 512 GB gp3 EBS volume that is configured with the required throughput.

**C:** For /hana/data use two 1,200 GB Provisioned IOPS SSD (io2) EBS volumes that are configured with RAID 0 striping and the required IOPS. For /hana/log, use one 525 GB io2 EBS volume that is configured with the required throughput.

**D:** For /hana/data, use two 1,200 GB General Purpose SSD (gp3) EBS volumes that are configured with RAID 0 striping and the required IOPS. For /hana/log, use one 512 GB gp3 EBS volume that is configured with the required throughput.



**Answer: B**

**Timestamp: 2023-07-27 23:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116638-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 105 discussion

A company is running SAP on premises and is using hard disk drive (HDD) cost-optimized storage to store SAP HANA archive files. The company directly mounts these disks as local file systems. The company also backs up the archives on a regular basis.

The company needs to migrate this setup to AWS.

Which solution will meet these requirements MOST cost-effectively?

**A:** Use General Purpose SSD (gp2) Amazon Elastic Block Store (Amazon EBS) volumes as the archive destination. Use Amazon S3 for backups. Use S3 Glacier for long-term retention of the archives.

**B:** Use Provisioned IOPS SSD (io1) Amazon Elastic Block Store (Amazon EBS) volumes as the archive destination. Back up the archives to Cold HDD (sc1) EBS volumes.

**C:** Use Provisioned IOPS SSD (io1) Amazon Elastic Block Store (Amazon EBS) volumes as the archive destination. Use Amazon S3 for backups. Use S3 Glacier for long-term retention of the archives.

**D:** Use Cold HDD (sc1) Amazon Elastic Block Store (Amazon EBS) volumes as the archive destination. Use Amazon S3 for backups. Use S3 Glacier for long-term retention or the archives.



**Answer: D**

**Timestamp: 2023-07-28 20:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116697-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 106 discussion

An SAP consultant is planning a migration of an on-premises SAP landscape to AWS. The landscape includes databases from Oracle, IBM Db2, and Microsoft SQL Server. The system copy procedure accesses the copied data on the destination system to complete the copy.

Which password must the SAP consultant obtain from the source system before the SAP consultant initiates the export or backup?

**A:** The password of the adm operating system user

**B:** The password of the SAP* user in client 000

**C:** The password of the administrator user of the database

**D:** The password of the DDIC user in client 000



**Answer: C**

**Timestamp: 2023-07-27 23:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116639-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 107 discussion

A company recently migrated its SAP workload to AWS. The company's SAP engineer implements SAProuter on an Amazon EC2 instance that runs SUSE Linux Enterprise Server. The EC2 instance is in a public subnet and is an On-Demand Instance. The SAP engineer performs all the necessary configurations for SAProuter, security groups, and route tables.

The SAProuter system needs to be online and available only when SAP Support is needed. The SAP engineer performs an initial test to validate SAP Support connectivity with SAProuter. The test is successful, and the SAP engineer stops the EC2 instance.

When an event occurs that causes the company to need SAP Support, the company starts the EC2 instance that hosts SAProuter. After the EC2 instance is running, the SAP Support team cannot establish connectivity with SAProuter.

What should the SAP engineer do to permanently resolve this issue?

**A:** Re-install SAProuter on an EC2 instance in a private subnet. Update the SAProuter configuration with the instance's private IP address. Deploy a managed NAT gateway for AWS. Route SAP connectivity through the NAT gateway.

**B:** Allocate an Elastic IP address to the EC2 instance that hosts SAProuter. Update the SAP router configuration with the Elastic IP address.

**C:** Modify the security group that is associated with the EC2 instance that hosts SAProuter to allow access to all ports from the 0.0.0.0/0 CIDR block.

**D:** Update the SAProuter configuration with the private IP address of the EC2 instance that hosts SAProuter.



**Answer: B**

**Timestamp: 2023-07-27 23:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116640-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 72 discussion

A company is running its SAP S/4HANA system on AWS. The company needs to retain database backups for the previous 30 days. The company is taking full online backups by using SAP HANA Studio and is storing the backup files on General Purpose SSD (gp3) Amazon Elastic Block Store (Amazon EBS) volumes. The company needs to reduce the cost of this storage.

What should the company do to achieve the LOWEST cost for the backup storage?

**A:** Continue to use SAP HANA Studio to back up the SAP HANA database to gp3 EBS volumes. After each backup is completed, use Linux shell scripts to move the backup to Amazon S3. Set up an S3 Lifecycle configuration to delete the backups that are older than 30 days.

**B:** Continue to use SAP HANA Studio to back up the SAP HANA database. Use Throughput Optimized HDD (st1) EBS volumes to store each backup. After each backup is completed, use Linux shell scripts to move the backup to Amazon S3. Set up an S3 Lifecycle configuration to delete the backups that are older than 30 days.

**C:** Use AWS Backup to take full online backups of the SAP HANA database.

**D:** Continue to use SAP HANA Studio to back up the SAP HANA database. Use AWS Backint Agent for SAP HANA to store each backup. Set up an Amazon S3 Lifecycle configuration to delete the backups that are older than 30 days.



**Answer: D**

**Timestamp: 2023-07-11 13:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/114861-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 73 discussion

A company is planning to migrate its SAP S/4HANAand SAP BW/4HANA workloads to AWS. The company is currently using a third-party solution to back up its SAP HANA database and application. The company wants to retire the third-party backup solution after the migration to AWS. The company needs a backup solution on AWS to manage its SAP HANA database and application backups. The solution must provide secure storage of backups and must optimize cost.

Which solution will meet these requirements?

**A:** Use SAP HANA Studio, SAP HANA HDBSQL, and SAP HANA Cockpit to perform backups to local Amazon Elastic Block Store (Amazon EBS) volumes. Enable EBS volume encryption. Use AWS Backup to perform application backups with AMIs or snapshots to Amazon S3. Enable S3 encryption.

**B:** Use SAP HANA Cockpit to implement a backup policy and perform SAP HANA database backups to Amazon S3 with AWS Backint Agent for SAP HANA. Enable S3 encryption. Use AWS Backup with backup plans to perform application backups with AMIs or snapshots. Enable S3 encryption.

**C:** Use AWS Backup with backup plans to perform SAP HANA database backups to Amazon S3 with AWS Backint Agent for SAP HANA. Enable S3 encryption. Use AWS Backup with backup plans to perform application backups with AMIs or snapshots. Enable S3 encryption.

**D:** Use SAP HANA Studio, SAP HANA HDBSQL, and SAP HANA Cockpit to perform backups to local Amazon Elastic Block Store (Amazon EBS) volumes. Copy the backups to Amazon S3. Use AWS Backup to schedule application backups with AMIs or snapshots to Amazon S3.



**Answer: B**

**Timestamp: 2023-07-14 18:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/115184-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 74 discussion

A company runs core business processes on SAP. The company plans to migrate its SAP workloads to AWS.

Which combination of prerequisite steps must the company take to receive integrated support for SAP on AWS? (Choose three.)

**A:** Purchase an AWS Developer Support plan or an AWS Enterprise Support plan.

**B:** Purchase an AWS Business Support plan or an AWS Enterprise Support plan.

**C:** Enable Amazon CloudWatch detailed monitoring.

**D:** Enable Amazon EC2 termination protection.

**E:** Configure and run the AWS Data Provider for SAP agent.

**F:** Use Reserved Instances for all Amazon EC2 instances that run SAP.



**Answer: BCE**

**Timestamp: 2023-06-29 01:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/113586-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 75 discussion

A company recently implemented its SAP S/4HANA system on AWS. An SAP engineer must set up a Pacemaker cluster on Amazon EC2 instances to provide high availability.

Which solution will meet this requirement?

**A:** Set up a fencing mechanism for the cluster by using a block device.

**B:** Set up an overlay IP address as a public IP address.

**C:** Create a route to the overlay IP address on the on-premises network.

**D:** Create an EC2 instance profile that has an IAM role that allows access modification of the route table.



**Answer: D**

**Timestamp: 2023-07-13 20:45:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/115076-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 76 discussion

A company wants to migrate its SAP environments to AWS. The SAP environments include SAP ERP Central Component (SAP ECC). SAP Business Warehouse (SAP BW), and SAP Process Integration (SAP PI) systems. As part of the migration, the company wants to do a system transformation to SAP S/4HANA. The company wants to implement SAP Fiori by using an SAP Gateway hub deployment and an internet-facing SAP Web Dispatcher for this SAP S/4HANA system only.

Employees around the world will access the SAP Fiori launchpad. The company needs to allow access to only the URLs that are required for running SAP Fiori.

How should an SAP security engineer design the security architecture to meet these requirements?

**A:** Deploy the SAP Web Dispatcher in a public subnet. Allow access to only the IP addresses that employees use to access the SAP Fiori server.

**B:** Deploy the SAP Web Dispatcher in a private subnet. Allow access to only the ports that are required for running SAP Fiori.

**C:** Deploy the SAP Web Dispatcher in a public subnet. Allow access to only the paths that are required for running SAP Fiori.

**D:** Deploy the SAP Web Dispatcher in a private subnet. Allow access to only the SAP S/4HANA system that serves as the SAP Fiori backend system for the SAP Gateway hub.



**Answer: C**

**Timestamp: 2023-07-14 19:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/115185-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 68 discussion

A company wants to deploy SAP BW/4HANA on AWS. An SAP technical architect selects a u-6tb1.56xlarge Amazon EC2 instance to host the SAP HANA database. The SAP technical architect must design a highly available architecture that achieves the lowest possible RTO and a near-zero RPO. The solution must not affect the performance of the primary database.

Which solution will meet these requirements?

**A:** Deploy two u-6tb1.56xlarge EC2 instances for SAP HANA in separate AWS Regions. Set up synchronous SAP HANA system replication between the instances.

**B:** Deploy two u-6tb1.56xlarge EC2 instances for SAP HANA in separate AWS Regions. Set up asynchronous SAP HANA system replication between the instances.

**C:** Deploy two u-6tb1.56xlarge EC2 instances for SAP HANA in separate Availability Zones in the same AWS Region. Set up synchronous SAP HANA system replication between the instances.

**D:** Deploy two u-6tb1.56xlarge EC2 instances for SAP HANA in separate Availability Zones in the same AWS Region. Set up asynchronous SAP HANA system replication between the instances.



**Answer: C**

**Timestamp: 2023-07-04 14:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/114080-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 69 discussion

A company has migrated its SAP workloads to AWS. A third-party team performs a technical evaluation and finds that the SAP workloads are not fully supported by SAP and AWS.

What should the company do to receive full support from SAP and AWS?

**A:** Purchase an AWS Developer Support plan.

**B:** Turn on Amazon CloudWatch basic monitoring.

**C:** Ensure that the /usr/sap file system is running on local instance storage.

**D:** Ensure that the AWS Data Provider for SAP agent is configured and running.



**Answer: D**

**Timestamp: 2023-07-04 14:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/114082-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 7 discussion

A company wants to run SAP HANA on AWS in the eu-central-1 Region. The company must make the SAP HANA system highly available by using SAP HANA system replication. In addition, the company must create a disaster recovery (DR) solution that uses SAP HANA system replication in the eu-west-1 Region. As prerequisites, the company has confirmed that Inter-AZ latency is less than 1 ms and that Inter-Region latency is greater than 1 ms.
Which solutions will meet these requirements? (Choose two.)

**A:** Install the tier 1 primary system and the tier 2 secondary system in eu-central-1. Configure the tier 1 system in Availability Zone 1. Configure the tier 2 system in Availability Zone 2. Configure SAP HANA system replication between tier 1 and tier 2 by using ASYNC replication mode. Install the DR tier 3 secondary system in eu-west-1 by using SYNC replication mode.

**B:** Install the tier 1 primary system and the tier 2 secondary system in eu-central-1. Configure the tier 1 system in Availability Zone 1. Configure the tier 2 system in Availability Zone 2. Configure SAP HANA system replication between tier 1 and tier 2 by using SYNC replication mode. Install the DR tier 3 secondary system in eu-west-1 by using ASYNC replication mode.

**C:** Install the tier 1 primary system and the tier 2 secondary system in eu-central-1. Configure the tier 1 system in Availability Zone 1. Configure the tier 2 system in Availability Zone 2. Configure SAP HANA system replication between tier 1 and tier 2 by using SYNC replication mode. Install the DR tier 3 secondary system in eu-west-1. Store daily backups from tier 1 in an Amazon S3 bucket in eu-central-1. Use S3 Cross-Region Replication to copy the daily backups to eu-west-1, where they can be restored if needed.

**D:** Install the tier 1 primary system in eu-central-1. Install the tier 2 secondary system and the DR tier 3 secondary system in eu-west-1. Configure the tier 2 system in Availability Zone 1. Configure the tier 3 system in Availability Zone 2. Configure SAP HANA system replication between all tiers by using ASYNC replication mode.

**E:** Install the tier 1 primary system and the tier 2 secondary system in eu-central-1. Configure the tier 1 system in Availability Zone 1. Configure the tier 2 system in Availability Zone 2. Configure SAP HANA system replication between tier 1 and tier 2 by using SYNCMEM replication mode. Install the DR tier 3 secondary system in eu-west-1 by using ASYNC replication mode.



**Answer: BE**

**Timestamp: 2023-01-27 14:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96971-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 70 discussion

A company has run SAP HANA on AWS for a few years on an Amazon EC2 X1 instance with dedicated tenancy. Because of business growth, the company plans to migrate to an EC2 High Memory instance by using a resize operation. The SAP HANA system is set up for high availability with SAP HANA system replication and clustering software.

Which combination of steps should the company take before the migration? (Choose three.)

**A:** Ensure that the source system is running on a supported operating system version.

**B:** Update all references to the IP address of the source system, including the /etc/hosts file for the operating system and DNS entries, to reflect the new IP address.

**C:** Adjust the storage size of SAP HANA data, log, shared, and backup volumes.

**D:** Resize the instance through the AWS Management Console or the AWS CLI.

**E:** Ensure that there is a backup of the source system.

**F:** Update the DNS records. Check the connectivity between the SAP application servers and the new SAP HANA instance.



**Answer: ADE**

**Timestamp: 2023-06-29 01:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/113584-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 71 discussion

A company is migrating a 20 TB SAP S/4HANA system to AWS. The company wants continuous monitoring of the SAP S/4HANA system and wants to receive notification when CPU utilization is greater than 90%. An SAP solutions architect must implement a solution that provides this notification with the least possible effort.

Which solution meets these requirements?

**A:** Create an AWS Lambda function that checks CPU utilization and sends the notification.

**B:** Use AWS CloudTrail to check the CPU utilization metric. Set up an Amazon Simple Notification Service (Amazon SNS) topic to send the notification.

**C:** Use Amazon CloudWatch to set a CPU utilization alarm. Set up an Amazon Simple Notification Service (Amazon SNS) topic to send the notification.

**D:** Use the Amazon CloudWatch dashboard to monitor CPU utilization. Set up an Amazon Simple Notification Service (Amazon SNS) topic to send the notification.



**Answer: C**

**Timestamp: 2023-06-29 01:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/113585-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 81 discussion

A company is migrating its SAP S/4HANA landscape from on premises to AWS. An SAP solutions architect is designing a backup solution for the SAP S/4HANA landscape on AWS. The backup solution will use AWS Backint Agent for SAP HANA (AWS Backint agent) to store backups in Amazon S3.

The company's backup policy for source systems requires a retention period of 150 days for weekly full online backups. The backup policy requires a retention period of 30 days for daily transaction log backups. The company must keep the same backup policy on AWS while maximizing data resiliency. The company needs the ability to retrieve the backup data one or two times each year within 10 hours of the retrieval request.

The SAP solutions architect must configure AWS Backint agent and S3 Lifecycle rules according to these parameters.

Which solution will meet these requirements MOST cost-effectively?

**A:** Configure the target S3 bucket to use S3 Glacier Deep Archive for the backup files. Create S3 Lifecycle rules on the S3 bucket to delete full online backup files that are older than 150 days and to delete log backup files that are older than 30 days.

**B:** Configure the target S3 bucket to use S3 Standard storage for the backup files. Create an S3 Lifecycle rule on the S3 bucket to move all the backup files to S3 Glacier Instant Retrieval. Create additional S3 Lifecycle rules to delete full online backup files that are older than 150 days and to delete log backup files that are older than 30 days.

**C:** Configure the target S3 bucket to use S3 One Zone-Infrequent Access (S3 One Zone-IA) for the backup files. Create S3 Lifecycle rules on the S3 bucket to move full online backup files that are older than 30 days to S3 Glacier Flexible Retrieval and to delete log backup files that are older than 30 days. Create an additional S3 Lifecycle rule to delete full online backup files that are older than 150 days.

**D:** Configure the target S3 bucket to use S3 Standard-Infrequent Access (S3 Standard-IA) for the backup files. Create S3 Lifecycle rules on the S3 bucket to move full online backup files that are older than 30 days to S3 Glacier Flexible Retrieval and to delete log backup files that are older than 30 days. Create an additional S3 Lifecycle rule to delete full online backup files that are older than 150 days.



**Answer: D**

**Timestamp: 2023-07-27 23:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116642-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 82 discussion

A global retail company is running its SAP S/4HANA workload on AWS. The company's business has grown in the past few years, and user activity has generated a significant amount or data in the SAP S/4HANA system.

The company wants to expand into new geographies. Before the company finalizes the expansion plan, the company wants to perform analytics on the historical data from the past few years. The company also wants to generate sales forecasts for potential expansion locations.

An SAP solutions architect must implement a solution to extract the data from SAP S/4HANA into Amazon S3. The solution also must perform the required analytics and forecasting tasks.

Which solution will meet these requirements with the LEAST custom development effort?

**A:** Use AWS AppSync to extract the data from SAP S/4HANA and to store the data in Amazon S3. Use AWS Glue to perform analytics. Use Amazon Forecast for sales forecasts.

**B:** Use the SAP Landscape Transformation (LT) Replication Server SDK to extract the data, to integrate the data with SAP Data Services, and to store the data in Amazon S3. Use Amazon Athena to perform analytics. Use Amazon Forecast for sales forecasts.

**C:** Use Amazon AppFlow to extract the data from SAP S/4HANA and to store the data in Amazon S3. Use Amazon QuickSight to perform analytics. Use Amazon Forecast for sales forecasts.

**D:** Integrate AWS Glue and AWS Lambda with the SAP Operational Data Provisioning (ODP) Framework to extract the data from SAP S/4HANA and to store the data in Amazon S3. Use Amazon QuickSight to perform analytics. Use Amazon Forecast for sales forecasts.



**Answer: C**

**Timestamp: 2023-07-27 23:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116643-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 83 discussion

A company's SAP solutions architect needs to design an architecture to deploy a highly available SAP S/4HANA application on AWS. The company requires the SAP NetWeaver ASAP ASCS components and the SAP HANA database components or the application to be highly available. The company will operate the SAP NetWeaver ASCS, SAP NetWeaver PAS, and SAP HANA database components on separate Amazon EC2 instances. Each EC2 instance will run the Red Hat Enterprise Linux operating system.

The company's AWS account has a VPC with a CIDR block that uses the 10.0.0.0/24 address block. The VPC contains two subnets. Each subnet is assigned to a different Availability Zone. The company has no other VPCs in this account, and the company has no other AWS accounts.

Which set of overlay IP addresses can the SAP solutions architect use to provide the required highly available architecture?

**A:** Two overlay IP addresses: 10.0.0.50 for SAP ASCS and 10.0.0.54 for SAP HANA

**B:** Two overlay IP addresses: 192.168.0.50 for SAP ASCS and 192.168.0.54 for SAP HANA

**C:** Three overlay IP addresses: 10.0.0.50 for SAP ASCS, 10.0.0.52 for SAP ERS, and 10.0.0.54 for SAP HANA

**D:** Three overlay IP addresses: 192.168.0.50 for SAP ASCS, 192.168.0.52 for SAP ERS, and 192.168.0.54 for SAP HANA



**Answer: D**

**Timestamp: 2023-07-27 23:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116644-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 84 discussion

A company is running its on-premises SAP ERP Central Component (SAP ECC) system on an Oracle database on Oracle Enterprise Linux. The database is 1 TB in size and uses 27,000 IOPS for its peak performance Multiple SSD volumes are striped to store Oracle data files in separate sapdata directories to gain the required IOPS.

The company is planning to move this workload to AWS. The company chooses high I/O bandwidth instances with a Nitro hypervisor to host the target database instance. Downtime is not a constraint for the migration. The company needs an Amazon Elastic Block Store (Amazon EBS) storage layout that optimizes cost for the migration.

How should the company reorganize the Oracle data files to meet these requirements?

**A:** Reorganize the Oracle data files into one 9 TB General Purpose SSD (gp2) EBS volume.

**B:** Reorganize the Oracle data files into a striped volume of three 3 TB General Purpose SSD (gp2) EBS volumes.

**C:** Reorganize the Oracle data files into one 1 TB General Purpose SSD (gp3) EBS volume with 27,000 provisioned IOPS.

**D:** Reorganize the Oracle data files into ten 100 GB General Purpose SSD (gp3) EBS volumes.



**Answer: B**

**Timestamp: 2023-07-28 00:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116647-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 85 discussion

A company has grown rapidly in a short period of time. This growth has led to an increase in the volume of data, the performance requirements for storage, and the memory and vCPU requirements for the company's SAP HANA database that runs on AWS. The SAP HANA database is a scale-up installation. Because of the increased requirements, the company plans to change the Amazon EC2 instance type to a virtual EC2 High Memory instance and plans to change the Amazon Elastic Block Store (Amazon EBS) volume type to a higher performance volume type for the SAP HANA database.

The EC2 instance is a current-generation instance, both before and after the change. Additionally, the EC2 instance and the EBS volume meet all the prerequisites for instance type change and EBS volume type change. An SAP basis administrator must advise the company about whether these changes will require downtime for the SAP system.

Which guidance should the SAP basis administrator provide to the company?

**A:** The change in EC2 instance type does not require SAP system downtime, but the change in EBS volume type requires SAP system downtime.

**B:** The change in EC2 instance type requires SAP system downtime, but the change in EBS volume type does not require SAP system downtime.

**C:** Neither the change in EC2 instance type nor the change in EBS volume type requires SAP system downtime.

**D:** Both the change in EC2 instance type and the change in EBS volume type require SAP system downtime.



**Answer: B**

**Timestamp: 2023-07-28 00:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116648-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 36 discussion

A company hosts an SAP HANA database on an Amazon EC2 instance in the us-east-1 Region. The company needs to implement a disaster recovery (DR) site in the us-west-1 Region. The company needs a cost-optimized solution that offers a guaranteed capacity reservation, an RPO of less than 30 minutes, and an RTO of less than 30 minutes.
Which solution will meet these requirements?

**A:** Deploy a single EC2 instance to support the secondary database in us-west-1 with additional storage. Use this secondary database instance to support QA and production. Configure the primary SAP HANA database in us-east-1 to constantly replicate the data to the secondary SAP HANA database in us-west-1 by using SAP HANA system replication with preload off. During DR, shut down the QA SAP HANA instance and restart the production services at the secondary site.

**B:** Deploy a secondary staging server on an EC2 instance in us-west-1. Use CloudEndure Disaster Recovery to replicate changes at the database level from us-east-1 to the secondary staging server on an ongoing basis. During DR, initiate cutover, increase the size of the secondary EC2 instance to match the primary EC2 instance, and start the secondary EC2 instance.

**C:** Set up the primary SAP HANA database in us-east-1 to constantly replicate the data to a secondary SAP HANA database in us-west-1 by using SAP HANA system replication with preload on. Keep the secondary SAP HANA instance as a hot standby that is ready to take over in case of failure.

**D:** Create an SAP HANA database AMI by using Amazon Elastic Block Store (Amazon EBS) snapshots. Replicate the database and log backup files from a primary Amazon S3 bucket in us-east-1 to a secondary S3 bucket in us-west-1. During DR, launch the EC2 instance in us-west-1 based on AMIs that are replicated. Update host information. Download database and log backups from the secondary S3 bucket. Perform a point-in-time recovery.



**Answer: A**

**Timestamp: 2023-02-07 07:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98269-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 37 discussion

An SAP solutions architect is leading the SAP basis team for a company. The company’s SAP landscape includes SAP HANA database instances for the following systems: sandbox, development, quality assurance test (QAT), system performance test (SPT), and production. The sandbox, development, and QAT systems are running on Amazon EC2 On-Demand Instances. The SPT and production systems are running on EC2 Reserved instances. All the EC2 instances are using Provisioned IOPS SSO (io2) Amazon Elastic Block Store (Amazon EBS) volumes.
The entire development team is in the same time zone and works from 8 AM to 6 PM. The sandbox system is for research and testing that are not critical. The SPT and production systems are business critical. The company runs load-testing jobs and stress-testing jobs on the QAT systems overnight to reduce testing duration. The company wants to optimize infrastructure cost for the existing AWS resources.
How can the SAP solutions architect meet these requirements with the LEAST amount of administrative effort?

**A:** Use a Spot Fleet instead of the Reserved Instances and On-Demand Instances.

**B:** Use Amazon EventBridge (Amazon CloudWatch Events) and Amazon CloudWatch alarms to stop the development and sandbox EC2 instances from 7 PM every night to 7 AM the next day.

**C:** Make the SAP basis team available 24 hours a day, 7 days a week to use the AWS CLI to stop and start the development and sandbox EC2 instances manually.

**D:** Change the EBS volume type to Throughput Optimized HDD (st1) for the /hana/data and /hana/log file systems for the production and non-production SAP HANA databases.



**Answer: B**

**Timestamp: 2023-02-06 14:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98175-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 38 discussion

A company is hosting an SAP HANA database on AWS. The company is automating operational tasks, including backup and system refreshes. The company wants to use SAP HANA Studio to perform data backup of an SAP HANA tenant database to a backint interface. The SAP HANA database is running in multi-tenant database container (MDC) mode. The company receives the following error message during an attempt to perform the backup:
//IMG//

What should an SAP solutions architect do to resolve this issue?

https://img.examtopics.com/aws-certified-sap-on-aws-specialty-pas-c01/image3.png

**A:** Set the execute permission for AWS Backint agent binary aws-backint-agent and for the launcher script aws-backint-agent-launcher.sh in the installation directory.

**B:** Verify the installation steps. Create symbolic links (symlinks).

**C:** Ensure that the catalog_backup_using_backint SAP HANA parameter is set to true. Ensure that the data_backup_parameter_file and log_backup_parameter_file parameters have the correct path location in the global.ini file.

**D:** Add the SAP HANA system to SAP HANA Studio. Select multiple container mode, and then try to initiate the backup again.



**Answer: D**

**Timestamp: 2023-02-04 05:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97899-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 39 discussion

A company is planning to migrate its on-premises SAP ERP Central Component (SAP ECC) system on SAP HANA to AWS. Each month, the system experiences two peaks in usage. The first peak is on the 21st day of the month when the company runs payroll. The second peak is on the last day of the month when the company processes and exports credit data. Both peak workloads are of high importance and cannot be rescheduled.
The current SAP ECC system has six application servers, all of a similar size. During normal operation outside of peak usage, four application servers would suffice.
Which purchasing option will meet the company’s requirements MOST cost-effectively on AWS?

**A:** Four Reserved Instances and two Spot Instances

**B:** Six On-Demand Instances

**C:** Six Reserved Instances

**D:** Four Reserved Instances and two On-Demand Instances



**Answer: D**

**Timestamp: 2023-02-06 16:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98181-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 4 discussion

A company is implementing SAP HANA on AWS. According to the company’s security policy, SAP backups must be encrypted. Only authorized team members can have the ability to decrypt the SAP backups.
What is the MOST operationally efficient solution that meets these requirements?

**A:** Configure AWS Backint Agent for SAP HANA to create SAP backups in an Amazon S3 bucket. After a backup is created, encrypt the backup by using client-side encryption. Share the encryption key with authorized team members only.

**B:** Configure AWS Backint Agent for SAP HANA to use AWS Key Management Service (AWS KMS) for SAP backups. Create a key policy to grant decryption permission to authorized team members only.

**C:** Configure AWS Storage Gateway to transfer SAP backups from a file system to an Amazon S3 bucket. Use an S3 bucket policy to grant decryption permission to authorized team members only.

**D:** Configure AWS Backint Agent for SAP HANA to use AWS Key Management Service (AWS KMS) for SAP backups. Grant object ACL decryption permission to authorized team members only.



**Answer: B**

**Timestamp: 2023-01-25 05:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96798-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 63 discussion

A company runs its SAP ERP 6.0 EHP 8 system on SAP HANA on AWS. The system is deployed on an r4.16xlarge Amazon EC2 instance with default tenancy. The company needs to migrate the SAP HANA database to an x2gd.16xlarge High Memory instance. After an operations engineer changes the instance type and starts the instance, the AWS Management Console shows a failed instance status check.
What is the cause of this problem?

**A:** The operations engineer missed the network configuration step during the post-migration activities.

**B:** The operations engineer missed the Amazon CloudWatch configuration step during the post-migration activities.

**C:** The operations engineer did not install Elastic Network Adapter (ENA) drivers before changing the instance type.

**D:** The operations engineer did not create a new AMI from the original instance and did not launch a new instance with dedicated tenancy from the AMI.



**Answer: C**

**Timestamp: 2023-02-09 21:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98604-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 64 discussion

A company is running SAP on anyDB at a remote location that has slow and inconsistent internet connectivity. The company wants to migrate its system to AWS and wants to convert its database to SAP HANA during this process. Because of the inconsistent internet connection, the company has not established connectivity between the remote location and the company’s VPC in the AWS Cloud.
How should the company perform this migration?

**A:** Migrate by using SAP HANA system replication over the internet connection. Specify a public IP address on the target system.

**B:** Migrate by using SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move. Use an AWS Snowball Edge Storage Optimized device to transfer the SAP export files to AWS.

**C:** Migrate by using SAP HANA system replication with initialization through backup and restore. Use an AWS Snowball Edge Storage Optimized device to transfer the SAP export files to AWS.

**D:** Migrate by using SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move. Use Amazon Elastic File System (Amazon EFS) to transfer the SAP export files to AWS.



**Answer: B**

**Timestamp: 2023-02-08 18:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98453-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 65 discussion

A financial services company is implementing SAP core banking on AWS. The company must not allow any system information to traverse the public internet. The company needs to implement secure monitoring of its SAP ERP Central Component (SAP ECC) system to check for performance issues and faults in its application. The solution must maximize security and must be supported by SAP and AWS.
How should the company integrate AWS metrics with its SAP system to meet these requirements?

**A:** Set up SAP Solution Manager to call Amazon CloudWatch and Amazon EC2 endpoints with REST-based calls to populate SAPOSCOL details. Use SAP transaction ST06N to monitor CPU and memory utilization on each EC2 instance.

**B:** Install the AWS Data Provider for SAP on the Amazon EC2 instances that host SAP. Allow access to the Amazon CloudWatch and EC2 endpoints through a NAT gateway. Create an IAM policy that allows the ec2:DescribeInstances action, the cloudwatch:GetMetricStatistics action, and the ec2:DescribeVolumes action for all EC2 resources.

**C:** Install the AWS Data Provider for SAP on the Amazon EC2 instances that host SAP. Create VPC endpoints for Amazon CloudWatch and Amazon EC2. Allow access through these endpoints. Create an IAM policy that allows the ec2:DescribeInstances action, the cloudwatch:GetMetricStatistics action, and the ec2:DescribeVolumes action for all EC2 resources.

**D:** Install the AWS Data Provider for SAP on the Amazon EC2 instances that host SAP. Create VPC endpoints for Amazon CloudWatch and Amazon EC2. Allow access through these endpoints. Create an IAM policy that allows all actions for all EC2 resources.



**Answer: C**

**Timestamp: 2023-02-08 18:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98454-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 66 discussion

A company is running SAP S/4HANA on AWS. The company has deployed its current database infrastructure on a u-12tb1.112xlarge Amazon EC2 instance that uses default tenancy and SUSE Linux Enterprise Server for SAP 15 SP1. The company must scale its SAP HANA database to an instance with more RAM. An SAP solutions architect needs to migrate the database to a u-18tb1.metal High Memory instance.

How can the SAP solutions architect meet this requirement?

**A:** Use the AWS Management Console to stop the current instance. Change the instance type to u-18tb1.metal. Start the instance.

**B:** Use the AWS CLI to stop the current instance. Change the instance type to u-18tb1.metal. Start the instance.

**C:** Use the AWS CLI to stop the current instance. Create an AMI from the current instance. Use the new AMI to launch a new u-18tb1.metal instance with host tenancy.

**D:** Use the AWS Management Console to stop the current instance. Create an AMI from the current instance. Use the new AMI to launch a new u-18tb1.metal instance with dedicated tenancy.



**Answer: C**

**Timestamp: 2023-06-29 01:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/113582-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 67 discussion

A company has a 48 TB SAP application that runs on premises and uses an IBM Db2 database. The company needs to migrate the application to AWS. The company has strict uptime requirements for the application with maximum downtime of 24 hours each weekend. The company has established a 1 Gbps AWS Direct Connect connection but can spare bandwidth for migration only during non-business hours or weekends.

How can the company meet these requirements to migrate the application to AWS?

**A:** Use SAP Software Provisioning Manager to create an export of the data. Move this export to AWS during a weekend by using the Direct Connect connection. On AWS. import the data into the target SAP application. Perform the cutover.

**B:** Set up database replication from on premises to AWS. On the day of downtime, ensure that the replication finishes. Perform cutover to AWS.

**C:** Use an AWS Snowball Edge Storage Optimized device to send an initial backup to AWS. Capture incremental backups daily. When the initial backup is on AWS, perform database restore from the initial backup and keep applying incremental backups. On the day of cutover, perform the final incremental backup. Perform cutover to AWS.

**D:** Use AWS Application Migration Service (CloudEndure Migration) to migrate the database to AWS. On the day of cutover, switch the application to run on AWS servers.



**Answer: C**

**Timestamp: 2023-06-29 01:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/113583-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 126 discussion

A company wants to implement a highly available SAP S/4HANA workload on AWS with automatic failover. The company also needs a cross-Region disaster recovery (DR) solution for the SAP S/4HANA production system. The company has a required RPO of up to 15 minutes and a required RTO of up to 120 minutes for the DR solution.

Which solution will meet these requirements MOST cost-effectively?

**A:** Deploy two identically sized SAP S/4HANA systems, each in a different Availability Zone in the primary AWS Region. Set up synchronous SAP HANA system replication with preload between the systems. Set up a pilot light DR system with asynchronous SAP HANA system replication without preload to the secondary Region.

**B:** Deploy two identically sized SAP S/4HANA systems, each in a different Availability Zone in the primary AWS Region. Set up synchronous SAP HANA system replication with preload between the systems. Set up a full-size DR system with asynchronous SAP HANA system replication without preload to the secondary Region.

**C:** Deploy two SAP S/4HANA systems, each in a different Availability Zone in the primary AWS Region. Use a smaller size for the secondary system. Set up synchronous SAP HANA system replication without preload between the systems. Set up a pilot light DR system with asynchronous SAP HANA system replication to the secondary Region.

**D:** Deploy two identically sized SAP S/4HANA systems, each in a different Availability Zone in the primary AWS Region. Set up synchronous SAP HANA system replication with preload between the systems. For DR, set up S3 Cross-Region Replication (CRR) for SAP HANA backup files from the primary Region to the secondary Region.



**Answer: A**

**Timestamp: 2023-12-09 13:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128146-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 127 discussion

A company is planning to migrate its SAP Business Warehouse (SAP BW) 7.5 system on SAP HANA from on premises to AWS. The production database is 4 TB in size and has a scale-out architecture that consists of three nodes. Each node has 2 TB of memory. The company needs to keep the three SAP HANA nodes in the target architecture.

Which solution on AWS will provide the HIGHEST throughput for the SAP HANA database?

**A:** Implement SAP HANA scale-out Amazon EC2 instances with default tenancy.

**B:** Implement SAP HANA scale-out Amazon EC2 instances with Capacity Reservations in a cluster placement group.

**C:** Implement SAP HANA scale-out Amazon EC2 instances in a spread placement group.

**D:** Implement SAP HANA scale-out Amazon EC2 instances in a partition placement group.



**Answer: B**

**Timestamp: 2024-01-18 11:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131484-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 128 discussion

A company is running its on-premises SAP ERP Central Component (SAP ECC) workload on SAP HANA. The company wants to perform SAP S/4HANA conversion of the on-premises SAP ECC on SAP HANA landscape and migrate to AWS.

Which solutions can the company use to meet these requirements? (Choose two.)

**A:** Perform SAP S/4HANA conversion of the SAP ECC on SAP HANA system by using SAP Software Update Manager (SUM). Migrate to AWS by using SAP Software Provisioning Manager.

**B:** Perform SAP S/4HANA conversion and migration of the SAP ECC on SAP HANA system to AWS by using SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move.

**C:** Perform migration of the SAP ECC on SAP HANA system to AWS by using SAP HANA system replication for database migration and AWS Application Migration Service for migration of the SAP ECC application instances. Perform SAP S/4HANA conversion by using SAP Software Update Manager (SUM).

**D:** Perform SAP S/4HANA conversion of the SAP ECC on SAP HANA system by using SAP Software Provisioning Manager. Migrate to AWS by using AWS Application Migration Service.

**E:** Perform SAP S/4HANA conversion of the SAP ECC on SAP HANA system by using SAP Software Update Manager (SUM). Migrate the database to AWS by using AWS Database Migration Service (AWS DMS). Deploy SAP S/4HANA application instances.



**Answer: BC**

**Timestamp: 2024-02-05 16:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132864-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 129 discussion

A company is deploying SAP Business Suite on SAP HANA by using two Amazon EC2 bare metal instances. The company has set up a Pacemaker cluster for SAP HANA. The cluster is set up between the two instances, which are configured to use SAP HANA system replication.

An SAP engineer notices that the overlay IP address is not reachable from the application servers. The overlay IP address is only reachable locally on the database cluster. Which actions should the SAP engineer take to resolve this issue? (Choose three.)

**A:** Turn off the source/destination check on each bare metal instance.

**B:** Modify the security groups to ensure that the minimal ports for connectivity between the application server and the database are opened.

**C:** Add a route table entry to the route tables for the subnets of both bare metal instances for the overlay IP address.

**D:** Ensure that both bare metal instances are in the same subnet.

**E:** Perform a failover and tailback by using the Pacemaker cluster. Check whether the overlay IP address routing is functioning correctly.

**F:** Move the Pacemaker cluster to EC2 VM instances instead of bare metal instances.



**Answer: ABC**

**Timestamp: 2024-01-18 19:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131548-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 13 discussion

A company wants to migrate its SAP ERP landscape to AWS. The company will use a highly available distributed deployment for the new architecture. Clients will access SAP systems from a local data center through an AWS Site-to-Site VPN connection that is already in place. An SAP solutions architect needs to design the network access to the SAP production environment.
Which configuration approaches will meet these requirements? (Choose two.)

**A:** For the ASCS instance, configure an overlay IP address that is within the production VPC CIDR range. Create an AWS Transit Gateway. Attach the VPN to the transit gateway. Use the transit gateway to route the communications between the local data center and the production VPC. Create a static route on the production VPC to route traffic that is directed to the overlay IP address to the ASCS instance.

**B:** For the ASCS instance, configure an overlay IP address that is outside the production VPC CIDR range. Create an AWS Transit Gateway. Attach the VPN to the transit gateway. Use the transit gateway to route the communications between the local data center and the production VPC. Create a static route on the production VPC to route traffic that is directed to the overlay IP address to the ASCS instance.

**C:** For the ASCS instance, configure an overlay IP address that is within the production VPC CIDR range. Create a target group that points to the overlay IP address. Create a Network Load Balancer, and register the target group. Create a static route on the production VPC to route traffic that is directed to the overlay IP address to the ASCS instance.

**D:** For the ASCS instance, configure an overlay IP address that is outside the production VPC CIDR range. Create a target group that points to the overlay IP address. Create a Network Load Balancer, and register the target group. Create a static route on the production VPC to route traffic that is directed to the overlay IP address to the ASCS instance.

**E:** For the ASCS instance, configure an overlay IP address that is outside the production VPC CIDR range. Create a target group that points to the overlay IP address. Create an Application Load Balancer, and register the target group. Create a static route on the production VPC to route traffic that is directed to the overlay IP address to the ASCS instance.



**Answer: BD**

**Timestamp: 2023-01-26 10:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96901-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 54 discussion

A company has moved all of its SAP workloads to AWS. During peak business hours, end users are reporting performance issues because work processes are going into PRIV mode on an SAP S/4HANA system. An SAP support engineer indicates that SAP cannot provide support for this issue because some specific performance metrics are not available.
Which combination of actions must the company perform to comply with SAP support requirements? (Choose three.)

**A:** Buy an SAP license from AWS. Ensure that the SAP license is installed.

**B:** Select only an AWS Migration Acceleration Program (MAP) certified managed service provider (MSP).

**C:** Enable detailed monitoring for Amazon CloudWatch on each Amazon EC2 instance where SAP workloads are running.

**D:** Install, configure, and run the AWS Data Provider for SAP on each Amazon EC2 instance where SAP workloads are running.

**E:** Integrate AWS Systems Manager with SAP Solution Manager to provide alerts about SAP parameter configuration drift.

**F:** Enable SAP enhanced monitoring through a SAPOSCOL enhanced function.



**Answer: C**

**Timestamp: 2023-02-07 22:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98374-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 55 discussion

A company needs to implement high availability for its SAP S/4HANA system on AWS. The company will use a SUSE Linux Enterprise Server clustering solution in private subnets across two Availability Zones. An SAP solutions architect must ensure that the solution can route traffic to the active SAP instance in this clustered configuration.
What should the SAP solutions architect do to meet these requirements?

**A:** Implement the SAP cluster solution by using a secondary private IP address. Reassign the secondary private IP address from one network interface to another network interface in the event of any failure that affects the primary instance.

**B:** Implement the SAP cluster solution by using an Elastic IP address. Mask the failure of an instance or software by rapidly remapping the address to another instance in the account.

**C:** Implement the SAP cluster solution by using a public IP address. Use this public IP address for communication between the instances and the internet.

**D:** Implement the SAP cluster solution by using an overlay IP address that is outside the CIDR block of the VPC. Use overlay IP address routing to dynamically update the route table to point to the active node and provide external access by using a Network Load Balancer or AWS Transit Gateway.



**Answer: D**

**Timestamp: 2023-02-07 22:59:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98375-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 56 discussion

A company is migrating its SAP workloads to AWS. The company’s IT team installs a highly available SAP S/4HANA system that uses the SAP HANA system replication cluster package on SUSE Linux Enterprise Server. The IT team deploys the system by using cluster nodes in different Availability Zones within the same AWS Region.
After the initial launch of the SAP application, the application is accessible. However, after failover, the IT team cannot access the application even though the system is up and running on the secondary node. After investigation, an SAP solutions architect discovers that the virtual IP address has not been used correctly.
Which combination of steps should the SAP solutions architect take to resolve this problem? (Choose two.)

**A:** Use an overlay IP address as a secondary IP address with the primary node of the cluster.

**B:** Choose an overlay IP address within the VPC CIDR block that corresponds with the secondary node of the cluster.

**C:** Use an overlay IP address as a virtual IP address.

**D:** Choose an overlay IP address within the VPC CIDR block that corresponds with the primary node of the cluster.

**E:** Choose an overlay IP address outside the VPC CIDR block that hosts the application and the database.



**Answer: CE**

**Timestamp: 2023-02-09 21:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98603-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 57 discussion

A company wants to migrate its on-premises servers to AWS. These servers include SAP ERP Central Component (SAP ECC) on Oracle Database. The company is running SAP ECC application servers and Oracle Database servers on AIX. The company must migrate the SAP workloads to AWS with minimal changes.
Which solution will meet these requirements?

**A:** Perform a heterogeneous migration for SAP on AWS. Specify the SAP ECC application servers to run on SUSE Linux Enterprise Server. Specify Oracle Database to run on Oracle Enterprise Linux on a Dedicated Host.

**B:** Perform a homogeneous migration for SAP on AWS. Specify the SAP ECC application servers and Oracle Database to run on AIX.

**C:** Perform a heterogeneous migration for SAP on AWS. Specify the SAP ECC application servers and Oracle Database to run on Oracle Enterprise Linux.

**D:** Perform a heterogeneous migration for SAP on AWS. Specify the SAP ECC application servers and Oracle Database to run on Windows.



**Answer: C**

**Timestamp: 2023-02-08 18:29:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98449-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 58 discussion

A company has deployed its SAP applications into multiple Availability Zones in the same AWS Region. To accommodate storage of media files, database table export and import, and files dropped by third-party tools, the company has mounted Amazon Elastic File System (Amazon EFS) file systems between the SAP instances. The company needs to retrieve the files quickly for installations, updates, and system refreshes.
Over time, the EFS file systems have grown exponentially to multiple terabytes. An SAP solutions architect must optimize storage cost for the files that are stored in Amazon EFS.
Which solution will meet this requirement with the LEAST administrative overhead?

**A:** Scan the files manually to identify unnecessary files. Delete the unnecessary files.

**B:** Move the files to Amazon S3 Glacier Deep Archive.

**C:** Apply a lifecycle policy on the files in Amazon EFS to move the files to EFS Standard-Infrequent Access (Standard-IA).

**D:** Move the files to Amazon S3 Glacier. Apply an S3 Glacier vault lock policy to the files.



**Answer: C**

**Timestamp: 2023-02-08 18:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98450-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 40 discussion

A company has an SAP environment that runs on AWS. The company wants to enhance security by restricting Amazon EC2 Instance Metadata Service (IMDS) to IMDSv2 only. The company’s current configuration option supports both IMDSv1 and IMDSv2. The security enhancement must not create an SAP outage.
What should the company do before it applies the security enhancement on EC2 instances that are running the SAP environment?

**A:** Ensure that the SAP kernel versions are 7.45 or later.

**B:** Ensure that the EC2 instances are Nitro based.

**C:** Ensure that the AWS Data Provider for SAP is installed on each EC2 instance.

**D:** Stop the EC2 instances.



**Answer: B**

**Timestamp: 2023-01-31 14:21:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97446-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 41 discussion

A company is running an SAP HANA database on AWS. The company wants to manage historical, infrequently accessed warm data for a native SAP HANA use case. An SAP solutions architect needs to recommend a solution that can provide online data storage in extended store, available for queries and updates. The solution must be an integrated component of the SAP HANA database and must allow the storage of up to five times more data in the warm tier than in the hot tier.
Which solution will meet these requirements?

**A:** Use Amazon Data Lifecycle Manager (Amazon DLM) with SAP Data Hub to move data in and out of the SAP HANA database to Amazon S3.

**B:** Use an SAP HANA extension node.

**C:** Use SAP HANA dynamic tiering as an optional add-on to the SAP HANA database.

**D:** Use Amazon Data Lifecycle Manager (Amazon DLM) with SAP HANA spark controller so that SAP HANA can access the data through the Spark SQL SDA adapter.



**Answer: C**

**Timestamp: 2023-01-31 11:16:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97408-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 42 discussion

A company plans to migrate its SAP NetWeaver deployment to AWS. The deployment runs on a Microsoft SQL Server database. The company plans to change the source database from SQL Server to SAP HANA as part of this process.
Which migration tools or methods should an SAP solutions architect use to meet these requirements? (Choose two.)

**A:** SAP HANA classical migration

**B:** SAP HANA system replication

**C:** SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move

**D:** SAP HANA backup and restore

**E:** SAP homogeneous system copy



**Answer: AC**

**Timestamp: 2023-01-31 10:42:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97399-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 43 discussion

A company has an SAP Business One system that runs on SUSE Linux Enterprise Server 12 SP3. The company wants to migrate the system to AWS. An SAP solutions architect selects a homogeneous migration strategy that uses AWS Application Migration Service (CloudEndure Migration).
After the server migration process is finished, the SAP solutions architect launches an Amazon EC2 test instance from the R5 instance family. After a few minutes, the EC2 console reports that the test instance has failed an instance status check. Network connections to the instance are refused.
How can the SAP solutions architect solve this problem?

**A:** Reboot the instance to initiate instance migration to another host.

**B:** Request an instance limit increase for the AWS Region where the test instance is being launched.

**C:** Create a ticket for AWS Support that documents the test server instance ID. Wait for AWS to update the host of the R5 instance.

**D:** Install the missing drivers on the source system. Wait for the completion of migration synchronization. Launch the test instance again.



**Answer: D**

**Timestamp: 2023-01-31 10:38:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97397-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 44 discussion

An SAP basis architect is configuring high availability for a critical SAP system on AWS. The SAP basis architect is using an overlay IP address to route traffic to the subnets across multiple Availability Zones within an AWS Region for the system’s SAP HANA database.
What should the SAP basis architect do to route the traffic to the Amazon EC2 instance of the active SAP HANA database?

**A:** Edit the route in the route table of the VPC that includes the EC2 instance that runs SAP HANSpecify the overlay IP address as the destination. Specify the private IP address of the EC2 instance as the target.

**B:** Edit the inbound and outbound rules in the security group of the EC2 instance that runs SAP HANA. Allow traffic for SAP HANA specific ports from the overlay IP address.

**C:** Edit the network ACL of the subnet that includes the EC2 instance that runs SAP HANA. Allow traffic for SAP HANA specific ports from the overlay IP address.

**D:** Edit the route in the route table of the VPC that includes the EC2 instance that runs SAP HANA. Specify the overlay IP address as the destination. Specify the elastic network interface of the EC2 instance as the target.



**Answer: D**

**Timestamp: 2023-01-31 10:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97396-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 27 discussion

A company wants to deploy an SAP HANA database on AWS by using AWS Launch Wizard for SAP. An SAP solutions architect needs to run a custom post-deployment script on the Amazon EC2 instance that Launch Wizard provisions.
Which actions can the SAP solutions architect take to provide the post-deployment script in the Launch Wizard console? (Choose two.)

**A:** Provide the FTP URL of the script.

**B:** Provide the HTTPS URL of the script on a web server.

**C:** Provide the Amazon S3 URL of the script.

**D:** Write the script inline.

**E:** Upload the script.



**Answer: CE**

**Timestamp: 2023-01-30 08:08:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97208-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 28 discussion

A company is planning to move its on-premises SAP HANA database to AWS. The company needs to migrate this environment to AWS as quickly as possible. An SAP solutions architect will use AWS Launch Wizard for SAP to deploy this SAP HANA workload.
Which combination of steps should the SAP solutions architect follow to start the deployment of this workload on AWS? (Choose three.)

**A:** Download the SAP HANA software.

**B:** Download the AWS CloudFormation template for the SAP HANA deployment.

**C:** Download and extract the SAP HANA software. Upload the SAP HANA software to an FTP server that Launch Wizard can access.

**D:** Upload the unextracted SAP HANA software to an Amazon S3 destination bucket. Follow the S3 file path syntax for the software in accordance with Launch Wizard recommendations.

**E:** Bring the operating system AMI by using the Bring Your Own Image (BYOI) model, or purchase the subscription for the operating system AMI from AWS Marketplace.

**F:** Create the SAP file system by using Amazon Elastic Block Store (Amazon EBS) before the deployment.



**Answer: ADE**

**Timestamp: 2023-01-30 08:15:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97209-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 29 discussion

A company wants to implement SAP HANA on AWS with the Multi-AZ deployment option by using AWS Launch Wizard for SAP. The solution will use SUSE Linux Enterprise High Availability Extension for the high availability deployment. An SAP solutions architect must ensure that all the prerequisites are met. The SAP solutions architect also must ensure that the user inputs to start the guided deployment of Launch Wizard are valid.
Which combination of steps should the SAP solutions architect take to meet these requirements? (Choose two.)

**A:** Before starting the Launch Wizard deployment, create the underlying Amazon Elastic Block Store (Amazon EBS) volume types to use for SAP HANA data and log volumes based on the performance requirements.

**B:** Use a value for the PaceMakerTag parameter that is not used by any other Amazon EC2 instances in the AWS Region where the system is being deployed.

**C:** Ensure that the virtual hostname for the SAP HANA database that is used for the SUSE Linux Enterprise High Availability Extension configuration is not used in any other deployed accounts.

**D:** Ensure that the VirtuallPAddress parameter is outside the VPC CIDR and is not being used in the route table that is associated with the subnets where primary and secondary SAP HANA instances will be deployed.

**E:** Before starting the Launch Wizard deployment, set up the SUSE Linux Enterprise High Availability Extension network configuration and security group.



**Answer: BD**

**Timestamp: 2023-02-05 18:24:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98103-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 3 discussion

A company hosts its SAP NetWeaver workload on SAP HANA in the AWS Cloud. The SAP NetWeaver application is protected by a cluster solution that uses Red Hat Enterprise Linux. High Availability Add-On. The cluster solution uses an overlay IP address to ensure that the high availability cluster is still accessible during failover scenarios.
An SAP solutions architect needs to facilitate the network connection to this overlay IP address from multiple locations. These locations include more than 25 VPCs, other AWS Regions, and the on-premises environment. The company already has set up an AWS Direct Connect connection between the on-premises environment and AWS.
What should the SAP solutions architect do to meet these requirements in the MOST scalable manner?

**A:** Use VPC peering between the VPCs to route traffic between them.

**B:** Use AWS Transit Gateway to connect the VPCs and on-premises networks together.

**C:** Use a Network Load Balancer to route connections to various targets within VPCs.

**D:** Deploy a Direct Connect gateway to connect the Direct Connect connection over a private VIF to one or more VPCs in any accounts.



**Answer: B**

**Timestamp: 2023-01-21 11:11:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96280-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 30 discussion

A company that has SAP workloads on premises plans to migrate an SAP environment to AWS. The company is new to AWS and has no prior setup. The company has the following requirements:
The application server and database server must be placed in isolated network configurations.
SAP systems must be accessible to the on-premises end users over the internet.
The cost of communications between the application server and the database server must be minimized.
Which combination of steps should an SAP solutions architect take to meet these requirements? (Choose two.)

**A:** Configure a Network Load Balancer for incoming connections from end users.

**B:** Set up an AWS Site-to-Site VPN connection between the company’s on-premises network and AWS.

**C:** Separate the application server and the database server by using different VPCs.

**D:** Separate the application server and the database server by using different subnets and network security groups within the same VPC.

**E:** Set up an AWS Direct Connect connection with a private VIF between the company’s on-premises network and AWS.



**Answer: BD**

**Timestamp: 2023-01-31 03:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97348-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 31 discussion

A company is running its SAP workload on AWS. The company’s security team has implemented the following requirements:
All Amazon EC2 instances for SAP must be SAP certified instance types.
Encryption must be enabled for all Amazon S3 buckets and Amazon Elastic Block Store (Amazon EBS) volumes.
AWS CloudTrail must be activated.
SAP system parameters must be compliant with business rules.
Detailed monitoring must be enabled for all instances.
The company wants to develop an automated process to review the systems for compliance with the security team’s requirements. The process also must provide notification about any deviation from these standards.
Which solution will meet these requirements?

**A:** Use AWS AppConfig to model configuration data in an AWS Systems Manager Automation runbook. Schedule this Systems Manager Automation runbook to monitor for compliance with all the requirements. Integrate AWS AppConfig with Amazon CloudWatch for notification purposes.

**B:** Use AWS Config managed rules to monitor for compliance with all the requirements. Use Amazon EventBridge (Amazon CloudWatch Events) and Amazon Simple Notification Service (Amazon SNS) for email notification when a resource is flagged as noncompliant.

**C:** Use AWS Trusted Advisor to monitor for compliance with all the requirements. Use Trusted Advisor preferences for email notification when a resource is flagged as noncompliant.

**D:** Use AWS Config managed rules to monitor for compliance with the requirements, except for the SAP system parameters. Create AWS Config custom rules to validate the SAP system parameters. Use Amazon EventBridge (Amazon CloudWatch Events) and Amazon Simple Notification Service (Amazon SNS) for email notification when a resource is flagged as noncompliant.



**Answer: D**

**Timestamp: 2023-01-31 04:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97358-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 32 discussion

A company is hosting its SAP workloads on AWS. An SAP solutions architect is designing high availability architecture for the company’s production SAP S/4HANA and SAP BW/4HANA workloads. These workloads have the following requirements:
Redundant SAP application servers that consist of a primary application server (PAS) and an additional application server (AAS)
ASCS and ERS instances that use a failover cluster
Database high availability with a primary DB instance and a secondary DB instance
How should the SAP solutions architect design the architecture to meet these requirements?

**A:** Deploy ASCS and ERS cluster nodes in different subnets within the same Availability Zone. Deploy the PAS instance and AAS instance in different subnets within the same Availability Zone. Deploy the primary DB instance and secondary DB instance in different subnets within the same Availability Zone. Deploy all the components in the same VPC.

**B:** Deploy ASCS and ERS cluster nodes in different subnets within the same Availability Zone. Deploy the PAS instance and AAS instance in different subnets within the same Availability Zone. Deploy the primary DB instance and secondary DB instance in different subnets within the same Availability Zone. Deploy the ASCS instance, PAS instance, and primary DB instance in one VPC. Deploy the ERS instance, AAS instance, and secondary DB instance in a different VPC.

**C:** Deploy ASCS and ERS cluster nodes in different subnets across two Availability Zones. Deploy the PAS instance and AAS instance in different subnets across two Availability Zones. Deploy the primary DB instance and secondary DB instance in different subnets across two Availability Zones. Deploy all the components in the same VPC.

**D:** Deploy ASCS and ERS cluster nodes in different subnets across two Availability Zones. Deploy the PAS instance and AAS instance in different subnets across two Availability Zones. Deploy the primary DB instance and secondary DB instance in different subnets across two Availability Zones. Deploy the ASCS instance, PAS instance, and primary DB instance in one VPC. Deploy the ERS instance, AAS instance, and secondary DB instance in a different VPC.



**Answer: C**

**Timestamp: 2023-01-31 04:36:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97359-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 33 discussion

A company has deployed SAP HANA in the AWS Cloud. The company needs its SAP HANA database to be highly available. An SAP solutions architect has deployed the SAP HANA database in separate Availability Zones in a single AWS Region. SUSE Linux Enterprise High Availability Extension is configured with an overlay IP address. The overlay IP resource agent has the following IAM policy:
//IMG//

During a test of failover, the SAP solutions architect finds that the overlay IP address does not change to the secondary Availability Zone.
Which change should the SAP solutions architect make in the policy statement for Sid oip1 to fix this error?

https://img.examtopics.com/aws-certified-sap-on-aws-specialty-pas-c01/image2.png

**A:** Change the Action element to ec2:CreateRoute.

**B:** Change the Action element to ec2:ReplaceRoute.

**C:** Change the Action element to ec2:ReplaceRouteTableAssociation.

**D:** Change the Action element to ec2:ReplaceTransitGatewayRoute.



**Answer: B**

**Timestamp: 2023-01-31 04:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97361-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 34 discussion

A company wants to improve the RPO and RTO for its SAP disaster recovery (DR) solution by running the DR solution on AWS. The company is running SAP ERP Central Component (SAP ECC) on SAP HANA. The company has set an RPO of 15 minutes and an RTO of 4 hours.
The production SAP HANA database is running on a physical appliance that has x86 architecture. The appliance has 1 TB of memory, and the SAP HANA global allocation limit is set to 768 GB. The SAP application servers are running as VMs on VMware, and they store data on an NFS file system. The company does not want to change any existing SAP HANA parameters that are related to data and log backup for its on-premises systems.
What should an SAP solutions architect do to meet the DR objectives MOST cost-effectively?

**A:** For the SAP HANA database, change the log backup frequency to 5 minutes. Move the data and log backups to Amazon S3 by using the AWS CLI or AWS DataSync. Launch the SAP HANA database. For the SAP application servers, export the VMs as AMIs by using the VM Import/Export feature from AWS. For NFS file shares /sapmnt and /usr/sap/trans, establish real-time synchronization from DataSync to Amazon Elastic File System (Amazon EFS).

**B:** For the SAP HANA database, change the log backup frequency to 5 minutes. Move the data and log backups to Amazon S3 by using AWS Storage Gateway File Gateway. For the SAP application servers, export the VMs as AMIs by using the VM Import/Export feature from AWS. For NFS file shares /sapmnt and /usr/sap/trans, establish real-time synchronization from AWS DataSync to Amazon Elastic File System (Amazon EFS).

**C:** For the SAP HANA database, SAP application servers, and NFS file shares, use CloudEndure Disaster Recovery to replicate the data continuously from on premises to AWS. Use CloudEndure Disaster Recovery to launch target instances in the event of a disaster.

**D:** For the SAP HANA database, use a smaller SAP certified Amazon EC2 instance. Use SAP HANA system replication with ASYNC replication mode to replicate the data continuously from on premises to AWS. For the SAP application servers, use CloudEndure Disaster Recovery for continuous data replication. For NFS file shares /sapmnt and /usr/sap/trans, establish real-time synchronization from AWS DataSync to Amazon Elastic File System (Amazon EFS).



**Answer: D**

**Timestamp: 2023-02-08 15:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98434-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 35 discussion

A company is planning to migrate its on-premises SAP applications to AWS. The applications are based on Windows operating systems. A file share stores the transport directories and third-party application data on the network-attached storage of the company’s on-premises data center. The company’s plan is to lift and shift the SAP applications and the file share to AWS. The company must follow AWS best practices for the migration.
Which AWS service should the company use to host the transport directories and third-party application data on AWS?

**A:** Amazon Elastic Block Store (Amazon EBS)

**B:** AWS Storage Gateway

**C:** Amazon Elastic File System (Amazon EFS)

**D:** Amazon FSx for Windows File Server



**Answer: D**

**Timestamp: 2023-01-31 04:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97362-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 45 discussion

A company is running SAP ERP Central Component (SAP ECC) with a Microsoft SQL Server database on AWS. A solutions architect must attach an additional 1 TB Amazon Elastic Block Store (Amazon EBS) volume. The company needs to write the SQL Server database backups to this EBS volume before moving the database backups to Amazon S3 for long-term storage.
Which EBS volume type will meet these requirements MOST cost-effectively?

**A:** Throughput Optimized HDD (st1)

**B:** Provisioned IOPS SSD (io2)

**C:** General Purpose SSD (gp3)

**D:** Cold HDD (sc1)



**Answer: A**

**Timestamp: 2023-01-31 10:05:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97393-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 46 discussion

Business users are reporting timeouts during periods of peak query activity on an enterprise SAP HANA data mart. An SAP system administrator has discovered that at peak volume, the CPU utilization increases rapidly to 100% for extended periods on the x1.32xlarge Amazon EC2 instance where the database is installed. However, the SAP HANA database is occupying only 1,120 GiB of the available 1,952 GiB on the instance. I/O wait times are not increasing. Extensive query tuning and system tuning have not resolved this performance problem.
Which solutions should the SAP system administrator use to improve the performance? (Choose two.)

**A:** Reduce the global_allocation_limit parameter to 1,120 GiB.

**B:** Migrate the SAP HANA database to an EC2 High Memory instance with a larger number of available vCPUs.

**C:** Move to a scale-out architecture for SAP HANA with at least three x1. 16xlarge instances.

**D:** Modify the Amazon Elastic Block Store (Amazon EBS) volume type from General Purpose to Provisioned IOPS for all SAP HANA data volumes.

**E:** Change to a supported compute optimized instance type for SAP HANA.



**Answer: BE**

**Timestamp: 2023-01-31 15:02:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97448-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 47 discussion

A company is moving to the AWS Cloud gradually. The company has multiple SAP landscapes on VMware. The company already has sandbox, development, and QA systems on AWS. The company’s production system is still running on premises. The company has 2 months to cut over the entire landscape to the AWS Cloud.
The company has adopted a hybrid architecture for the next 2 months and needs to synchronize its shared file systems between the landscapes. These shared file systems include /trans directory mounts, /software directory mounts, and third-party integration mounts. In the on-premises landscape, the company has NFS mounts between the servers. On the AWS infrastructure side, the company is using Amazon Elastic File System (Amazon EFS) to share the common files.
An SAP solutions architect needs to design a solution to schedule transfer of these shared files bidirectionally four times each day. The data transfer must be encrypted.
Which solution will meet these requirements?

**A:** Write an rsync script. Schedule the script through cron for four times each day in the on-premises VMware servers to transfer the data from on premises to AWS.

**B:** Install an AWS DataSync agent on the on-premises VMware platform. Use the DataSync endpoint to synchronize between the on-premises NFS server and Amazon EFS on AWS.

**C:** Order an AWS Snowcone device. Use the Snowcone device to transfer data between the on-premises servers and AWS.

**D:** Set up a separate AWS Direct Connect connection for synchronization between the on-premises servers and AWS.



**Answer: B**

**Timestamp: 2023-02-08 18:06:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98445-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 48 discussion

A company is planning to move to AWS. The company wants to set up sandbox and test environments on AWS to perform proofs of concept (POCs). Development and production environments will remain on premises until the POCs are completed.
At the company’s on-premises location, SAProuter is installed on the same server as SAP Solution Manager. The company uses SAP Solution Manager to monitor the entire landscape. The company uses SAProuter to connect to SAP Support. The on-premises SAP Solution Manager instance must monitor the performance and server metrics of the newly created POC systems on AWS. The existing SAProuter must be able to report any issues to SAP.
What should an SAP solutions architect do to set up this hybrid infrastructure MOST cost-effectively?

**A:** Install a new SAP Solution Manager instance and a new SAProuter instance in the AWS environment. Connect the POC systems to these new instances. Use these new instances in parallel with the on-premises SAP Solution Manager instance and the on-premises SAProuter instance.

**B:** Install a new SAP Solution Manager instance and a new SAProuter instance in the AWS environment. Install the Amazon CloudWatch agent on all on-premises instances. Push the monitoring data to the new SAP Solution Manager instance. Connect all on-premises systems and POC systems on AWS to the new SAP Solution Manager instance and the new SAProuter instance. Remove the on-premises SAP Solution Manager instance and the on-premises SAProuter instance. Use the new instances on AWS.

**C:** Use AWS Site-to-Site VPN to connect the on-premises network to the AWS environment. Connect the POC systems on AWS to the on-premises SAP Solution Manager instance and the on-premises SAProuter instance.

**D:** Add the POC systems on AWS to the existing SAP Transport Management System that is configured in the on-premises SAP systems.



**Answer: C**

**Timestamp: 2023-02-07 22:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98373-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 49 discussion

An SAP solutions architect is using AWS Systems Manager Distributor to install the AWS Data Provider for SAP on production SAP application servers and SAP HANA database servers. The SAP application servers and the SAP HANA database servers are running on Red Hat Enterprise Linux.
The SAP solutions architect chooses instances manually in Systems Manager Distributor and schedules installation. The installation fails with an access and authorization error related to Amazon CloudWatch and Amazon EC2 instances. There is no error related to AWS connectivity.
What should the SAP solutions architect do to resolve the error?

**A:** Install the CloudWatch agent on the servers before installing the AWS Data Provider for SAP.

**B:** Download the AWS Data Provider for SAP installation package from AWS Marketplace. Use an operating system super user to install the agent manually or through a script.

**C:** Create an IAM role. Attach the appropriate policy to the role. Attach the role to the appropriate EC2 instances.

**D:** Wait until Systems Manager Agent is fully installed and ready to use on the EC2 instances. Use Systems Manager Patch Manager to perform the installation.



**Answer: C**

**Timestamp: 2023-02-07 22:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98371-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 5 discussion

A data analysis company has two SAP landscapes that consist of sandbox, development, QA, pre-production, and production servers. One landscape is on Windows, and the other landscape is on Red Hat Enterprise Linux. The servers reside in a room in a building that other tenants share.
An SAP solutions architect proposes to migrate the SAP applications to AWS. The SAP solutions architect wants to move the production backups to AWS and wants to make the backups highly available to restore in case of unavailability of an on-premises server.
Which solution will meet these requirements MOST cost-effectively?

**A:** Take a backup of the production servers. Implement an AWS Storage Gateway Volume Gateway. Create file shares by using the Storage Gateway Volume Gateway. Copy the backup files to the file shares through NFS and SMB.

**B:** Take a backup of the production servers. Send those backups to tape drives. Implement an AWS Storage Gateway Tape Gateway. Send the backups to Amazon S3 Standard-Infrequent Access (S3 Standard-IA) through the S3 console. Move the backups immediately to S3 Glacier Deep Archive.

**C:** Implement a third-party tool to take images of the SAP application servers and database server. Take regular snapshots at 1-hour intervals. Send the snapshots to Amazon S3 Glacier directly through the S3 Glacier console. Store the same images in different S3 buckets in different AWS Regions.

**D:** Take a backup of the production servers. Implement an Amazon S3 File Gateway. Create file shares by using the S3 File Gateway. Copy the backup files to the file shares through NFS and SMB. Map backup files directly to Amazon S3. Configure an S3 Lifecycle policy to send the backup files to S3 Glacier based on the company’s data retention policy.



**Answer: D**

**Timestamp: 2023-01-25 05:40:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96799-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 50 discussion

A company is running its SAP applications on Oracle Database. Oracle Database is hosted on physical servers that are running SUSE Linux Enterprise Server. Because of compliance requirements, the company cannot install any additional software on its on-premises database servers. The company needs to migrate the SAP landscape to AWS and must continue to use Oracle Database.
Which migration solution should the company use to meet these requirements?

**A:** AWS Server Migration Service (AWS SMS)

**B:** AWS Application Migration Service (CloudEndure Migration)

**C:** SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move

**D:** Oracle Database replication with Oracle Data Guard



**Answer: D**

**Timestamp: 2023-02-08 18:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98447-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 51 discussion

A company is planning to migrate its SAP workloads to AWS. The company will use two VPCs. One VPC will be for production systems, and one VPC will be for non-production systems. The company will host the non-production systems and the primary node of all the production systems in the same Availability Zone.
What is the MOST cost-effective way to establish a connection between the production systems and the non-production systems?

**A:** Create an AWS Transit Gateway. Attach the VPCs to the transit gateway. Add the appropriate routes in the subnet route tables.

**B:** Establish a VPC peering connection between the two VPCs. Add the appropriate routes in the subnet route tables.

**C:** Create an internet gateway in each VPUse an AWS Site-to-Site VPN connection between the two VPCs. Add the appropriate routes in the subnet route tables.

**D:** Set up an AWS Direct Connect connection between the two VPCs. Add the appropriate routes in the subnet route tables.



**Answer: B**

**Timestamp: 2023-01-31 15:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97452-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 52 discussion

An SAP engineer has deployed an SAP S/4HANA system on an Amazon EC2 instance that runs Linux. The SAP license key has been installed. After a while, the newly installed SAP instance presents an error that indicates that the SAP license key is not valid because the SAP system’s hardware key changed. There have been no changes to the EC2 instance or its configuration.
Which solution will permanently resolve this issue?

**A:** Perform SAP kernel patching.

**B:** Apply a new SAP license that uses a new hardware key. Install the new key.

**C:** Set the SLIC_HW_VERSION Linux environment variable.

**D:** Reboot the EC2 instance.



**Answer: C**

**Timestamp: 2023-01-31 16:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97454-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 53 discussion

An SAP technology consultant needs to scale up a primary application server (PAS) instance. The PAS currently runs on a c5a.xlarge Amazon EC2 instance. The SAP technology consultant needs to change the instance type to c5a.2xlarge.
How can the SAP technology consultant meet this requirement?

**A:** Stop the complete SAP system. Stop the EC2 instance. Use the AWS Management Console or the AWS CLI to change the instance type. Start the EC2 instance. Start the complete SAP system.

**B:** While SAP is running, use the AWS Management Console or the AWS CLI to change the instance type without stopping the EC2 instance.

**C:** Stop the complete SAP system. Terminate the EC2 instance. Use the AWS Management Console or the AWS CLI to change the instance type. Start the EC2 instance. Start the complete SAP system.

**D:** While SAP is running, log in to the EC2 instance. Run the following AWS CLI command: aws ec2 modify-instance-attribute --instance-id <INSTANCEID> --instance-type "{\"Value\": \"c5a.2xlargel\"}".



**Answer: A**

**Timestamp: 2023-02-07 11:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98283-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 22 discussion

A company has deployed a highly available SAP NetWeaver system on SAP HANA into a VPC. The system is distributed across multiple Availability Zones within a single AWS Region. SAP NetWeaver is running on SUSE Linux Enterprise Server for SAP. SUSE Linux Enterprise High Availability Extension is configured to protect SAP ASCS and ERS instances and uses the overlay IP address concept. The SAP shared files /sapmnt and /usr/sap/trans are hosted on an Amazon Elastic File System (Amazon EFS) file system.
The company needs a solution that uses already-existing private connectivity to the VPC. The SAP NetWeaver system must be accessible through the SAP GUI client tool.
Which solutions will meet these requirements? (Choose two.)

**A:** Deploy an Application Load Balancer. Configure the overlay IP address as a target.

**B:** Deploy a Network Load Balancer. Configure the overlay IP address as a target.

**C:** Use an Amazon Route 53 private zone. Create an A record that has the overlay IP address as a target.

**D:** Use AWS Transit Gateway. Configure the overlay IP address as a static route in the transit gateway route table. Specify the VPC as a target.

**E:** Use a NAT gateway. Configure the overlay IP address as a target.



**Answer: BD**

**Timestamp: 2023-01-28 06:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97026-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 23 discussion

A company is planning to move all its SAP applications to Amazon EC2 instances in a VPC. Recently, the company signed a multiyear contract with a payroll software-as-a-service (SaaS) provider. Integration with the payroll SaaS solution is available only through public web APIs.
Corporate security guidelines state that all outbound traffic must be validated against an allow list. The payroll SaaS provider provides only fully qualified domain name (FQDN) addresses and no IP addresses or IP address ranges. Currently, an on-premises firewall appliance filters FQDNs. The company needs to connect an SAP Process Orchestration (SAP PO) system to the payroll SaaS provider.
What must the company do on AWS to meet these requirements?

**A:** Add an outbound rule to the security group of the SAP PO system to allow the FQDN of the payroll SaaS provider and deny all other outbound traffic.

**B:** Add an outbound rule to the network ACL of the subnet that contains the SAP PO system to allow the FQDN of the payroll SaaS provider and deny all other outbound traffic.

**C:** Add an AWS WAF web ACL to the VPAdd an outbound rule to allow the SAP PO system to connect to the FQDN of the payroll SaaS provider.

**D:** Add an AWS Network Firewall firewall to the VPC. Add an outbound rule to allow the SAP PO system to connect to the FQDN of the payroll SaaS provider.



**Answer: D**

**Timestamp: 2023-02-03 02:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97714-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 24 discussion

A company is planning to migrate its on-premises SAP application to AWS. The application runs on VMware vSphere. The SAP ERP Central Component (SAP ECC) server runs on an IBM Db2 database that is 2 TB in size. The company wants to migrate the database to SAP HANA.
Which migration strategy will meet these requirements?

**A:** Use AWS Application Migration Service (CloudEndure Migration).

**B:** Use SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move.

**C:** Use AWS Server Migration Service (AWS SMS).

**D:** Use AWS Database Migration Service (AWS DMS).



**Answer: B**

**Timestamp: 2023-01-28 06:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97027-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 25 discussion

A company hosts multiple SAP applications on Amazon EC2 instances in a VPC. While monitoring the environment, the company notices that multiple port scans are attempting to connect to SAP portals inside the VPC. These port scans are originating from the same IP address block. The company must deny access to the VPC from all the offending IP addresses for the next 24 hours.
Which solution will meet this requirement?

**A:** Modify network ACLs that are associated with all public subnets in the VPC to deny access from the IP address block.

**B:** Add a rule in the security group of the EC2 instances to deny access from the IP address block.

**C:** Create a policy in AWS Identity and Access Management (IAM) to deny access from the IP address block.

**D:** Configure the firewall in the operating system of the EC2 instances to deny access from the IP address block.



**Answer: A**

**Timestamp: 2023-01-30 07:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97204-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 26 discussion

A company has deployed SAP workloads on AWS. The AWS Data Provider for SAP is installed on the Amazon EC2 instance where the SAP application is running. An SAP solutions architect has attached an IAM role to the EC2 instance with the following policy:
//IMG//

The AWS Data Provider for SAP is not returning any metrics to the SAP application.
Which change should the SAP solutions architect make to the IAM permissions to resolve this issue?

https://img.examtopics.com/aws-certified-sap-on-aws-specialty-pas-c01/image1.png

**A:** Add the cloudwatch:ListMetrics action to the policy statement with Sid AWSDataProvider1.

**B:** Add the cloudwatch:GetMetricStatistics action to the policy statement with Sid AWSDataProvider1.

**C:** Add the cloudwatch:GetMetricStream action to the policy statement with Sid AWSDataProvider1.

**D:** Add the cloudwatch:DescribeAlarmsForMetric action to the policy statement with Sid AWSDataProvider1.



**Answer: B**

**Timestamp: 2023-01-30 11:39:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97224-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 121 discussion

A company is running SAP ERP Central Component (SAP ECC) on SAP HANA on premises. The current landscape runs on four application servers that use an SAP HANA database. The company is migrating this environment to the AWS Cloud. The cloud environment must minimize downtime during business operations and must not allow inbound access from the internet.

Which solution will meet these requirements?

**A:** Design a Multi-AZ solution. In each Availability Zone, create a private subnet where Amazon EC2 instances that host the SAP HANA database and the application servers will reside. Use EC2 instances that are the same size to host the primary database and the secondary database. Use SAP HANA system replication in synchronous replication mode.

**B:** Design a Single-AZ solution. Create a private subnet where a single SAP HANA database and application servers will run on Amazon EC2 instances.

**C:** Design a Multi-AZ solution. In each Availability Zone, create a private subnet where Amazon EC2 instances that host the SAP HANA database and the application servers will reside. Shut down the EC2 instance that runs the secondary database node. Turn on this EC2 instance only when the primary database node or the primary database node's underlying EC2 instance is unavailable.

**D:** Design a Single-AZ solution. Create two public subnets where Amazon EC2 instances that host the SAP HANA database and the application servers will reside as two separate instances. Use EC2 instances that are the same size to host the primary database and the secondary database. Use SAP HANA system replication in synchronous replication mode.



**Answer: A**

**Timestamp: 2024-01-18 11:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131498-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 122 discussion

A company is planning to migrate its SAP Content Server from on premises to Amazon EC2 instances. The SAP Content Server stores data in a MaxDB database. The on-premises servers run the SUSE Linux Enterprise Server operating system.

The company wants to assess the benefits of cloud deployment by performing a proof of concept. An SAP solutions architect needs to perform a rehosting of the SAP Content Server on AWS to provide highly available and resilient storage.

Which solutions will meet these requirements? (Choose two.)

**A:** Configure Amazon Elastic File System (Amazon EFS) file systems for the MaxDB permanent storage. Install the nfs-utils package on the EC2 instances. Create the necessary mounts to attach the EFS file systems to the EC2 instances.

**B:** Configure Amazon FSx for Lustre file systems for the MaxDB permanent storage. Create the necessary mounts to attach the FSx for Lustre file systems to the EC2 instances. Update the /etc/fstab file with the directory name, DNS name, and mount name.

**C:** Configure General Purpose SSD (gp2 or gp3) or Provisioned IOPS SSD (io1 or io2) Amazon Elastic Block Store (Amazon EBS) volumes for the MaxDB permanent storage. Use the aws ec2 attach-volume AWS CLI command with device, volume ID, and instance ID to attach the mount to each EC2 instance.

**D:** Configure Amazon S3 buckets for the MaxDB permanent storage. Create an IAM instance profile that specifies a role to grant access to Amazon S3. Attach the instance profile to the EC2 instances.

**E:** Configure Amazon Elastic Container Service (Amazon ECS) volumes for the MaxDB permanent storage. Install the nfs-utils package on the EC2 instances. Create the necessary mounts to attach the ECS volumes to the EC2 instances.



**Answer: AC**

**Timestamp: 2024-01-18 11:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131493-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 123 discussion

A company is deploying SAP landscapes in a single AWS account. The company must use separate VPCs to host its production environment and non-production environment. The company is using an Amazon Elastic File System (Amazon EFS) file system to host the SAP transport file systems.

An SAP engineer attempts to use AWS Launch Wizard for SAP to perform an automated SAP deployment of the production environment. A deployment failure occurs when the SAP engineer attempts to reuse the SAP transport directory share from the non-production environment. This failure did not occur in previous non-production deployments.

The SAP engineer needs to complete the deployment and ensure that no additional costs are incurred for SAP transport directories.

What should the SAP engineer do to meet these requirements?

**A:** Perform a manual deployment.

**B:** Set up a new SAP transport directory for the production environment. Copy all files from the non-production transport host into the production transport directory by using rsync. Continue to use separate SAP transport directories for the systems.

**C:** Set up a transit gateway or direct VPC peering to make communication possible between the production VPC and the non-production VPC.

**D:** Skip the SAP transport directories step to complete the deployment.



**Answer: C**

**Timestamp: 2024-02-01 21:20:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/132650-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 124 discussion

A company runs a three-system SAP S/4HANA landscape on Amazon EC2 instances. The landscape includes a development system, a QA system, and a production system. Each system runs on its own EC2 instance. The production instance hosts a critical system that must run 24 hours a day, 7 days a week. The development instance and the QA instance need to run only during business hours and can be stopped for the rest of the day.

An SAP administrator plans to use AWS Systems Manager to implement an automated start-stop solution for the development instance and the QA instance. When the SAP administrator attempts to deploy the solution, the SAP administrator cannot find any SAP S/4HANA systems in Systems Manager.

Which options are possible causes of this problem? (Choose two.)

**A:** An appropriate instance profile that contains the AmazonSSMManagedInstanceCore policy is not assigned to the EC2 instances.

**B:** The EC2 instances are attached to a security group that has an outbound rule that does not explicitly allow port 443.

**C:** Systems Manager Agent (SSM Agent) is not installed on the EC2 instances.

**D:** The AWS Data Provider for SAP agent is not installed on the EC2 instances.

**E:** Amazon CloudWatch detailed monitoring is not turned on for the EC2 instances.



**Answer: AC**

**Timestamp: 2023-12-09 13:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128144-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 125 discussion

A company decides to deploy SAP non-production systems on AWS by using the standard installation model in a single Availability Zone. The company will use Amazon Elastic File System (Amazon EFS) to host SAP file systems such as /sapmnt and /usr/sap/trans.

The company launches the required Amazon EC2 instances to host these systems. However, the company cannot mount the EFS file systems to the respective EC2 instances. An SAP engineer needs to adjust the security groups that are assigned to the EC2 instances and EFS file systems to allow traffic between the EC2 instances and the EFS file systems.

Which combination of steps should the SAP engineer take to meet these requirements? (Choose two.)

**A:** Configure the security groups that are associated with the EFS file systems to allow inbound access for the TCP protocol on the NFS port (TCP 2049) from all EC2 instances where the file systems are mounted.

**B:** Configure the security groups that are associated with the EFS file systems to allow outbound access for the TCP protocol on the NFS port (TCP 2049) from all EC2 instances where the file systems are mounted.

**C:** Configure the security groups that are associated with the EFS file systems to allow outbound access from the security group of the corresponding EC2 instances on the NFS port (TCP 2049).

**D:** Configure the security groups that are associated with the EC2 instances to allow inbound access to the EFS file systems on the NFS port (TCP 2049).

**E:** Configure the security groups that are associated with the EC2 instances to allow outbound access to the EFS file systems on the NFS port (TCP 2049).



**Answer: AE**

**Timestamp: 2023-12-09 13:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128145-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 108 discussion

A company is evaluating options to migrate its on-premises SAP ERP Central Component (SAP ECC) EHP 8 system to AWS. The company does not want to make any changes to the SAP versions or database versions. The system runs on SUSE Linux Enterprise Server and SAP HANA 2.0 SPS 05. The existing on-premises system has a 1 TB database.

The company has 1 Gbps or internet bandwidth available for the migration. The company must complete the migration with the least possible downtime and disruption to business.

Which solution will meet these requirements?

**A:** Install SAP ECC EHP 8 on Amazon EC2 instances. Use the same SAP SID and kernel version that the source system uses. Install SAP HANA on EC2 instances. Use the same version of SAP HANA that the source system uses. Take a full backup of the source SAP HANA database to disk. Copy the backup by using an AWS Storage Gateway Tape Gateway. Restore the backup on the target SAP HANA instance that is running on Amazon EC2.

**B:** Install SAP ECC EHP 8 on Amazon EC2 instances. Use the same SAP SID and kernel version that the source system uses. Install SAP HANA on EC2 instances. Use the same version of SAP HANA that the source database uses. Establish replication at the source, and register the SAP HANA instance that is running on Amazon EC2 as secondary. After the systems are synchronized, initiate a takeover so that the SAP HANA instance that is running on Amazon EC2 becomes primary. Shut down the on-premises system. Start SAP on the EC2 instances.

**C:** Install SAP ECC EHP 8 on Amazon EC2 instances. Use the same SAP SID and kernel version that the source system uses. Install SAP HANA on EC2 instances. Use the same version that the source system uses. Take a full offline backup of the source SAP HANA database. Copy the backup to Amazon S3 by using the AWS CLI. Restore the backup on a target SAP HANA instance that runs on Amazon EC2. Start SAP on the EC2 instances.

**D:** Take an offline SAP Software Provisioning Manager export of the on-premises system. Use an AWS Storage Gateway File Gateway to transfer the export. Import the export on Amazon EC2 instances to create the target SAP system.



**Answer: B**

**Timestamp: 2023-07-27 23:52:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116641-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 109 discussion

A company is running its SAP system on AWS with a secondary SAP HANA database in a sidecar setup. The company requires high IOPS for write performance on its Amazon Elastic Block Store (Amazon EBS) volumes for the secondary SAP HANA database.

The EBS volume that the company uses for its SAP HANA data volume cannot provide the required IOPS. Instance bandwidth for the Amazon EC2 instance that is hosting the SAP HANA database is sufficient. An SAP solutions architect needs to propose a solution to resolve the IOPS performance issue.

Which solution will achieve the required IOPS?

**A:** Replace the EBS storage with EC2 instance store storage.

**B:** Create a RAID 0 configuration with several EBS volumes.

**C:** Use Amazon EC2 Auto Scaling to launch Spot Instances.

**D:** Create a placement group with several EBS volumes.



**Answer: B**

**Timestamp: 2024-01-17 15:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131393-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 11 discussion

An SAP solutions architect is designing an SAP HANA scale-out architecture for SAP Business Warehouse (SAP BW) on SAP HANA on AWS. The SAP solutions architect identifies the design as a three-node scale-out deployment of xte.32xiarge Amazon EC2 instances.
The SAP solutions architect must ensure that the SAP HANA scale-out nodes can achieve the low-latency and high-throughput network performance that are necessary for node-to-node communication.
Which combination of steps should the SAP solutions architect take to meet these requirements? (Choose two.)

**A:** Create a cluster placement group. Launch the instances into the cluster placement group.

**B:** Create a spread placement group. Launch the instances into the spread placement group.

**C:** Create a partition placement group. Launch the instances into the partition placement group.

**D:** Based on the operating system version, verify that enhanced networking is enabled on all the nodes.

**E:** Switch to a different instance family that provides network throughput that is greater than 25 Gbps.



**Answer: AD**

**Timestamp: 2023-01-25 05:54:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96801-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 110 discussion

A company is preparing a greenfield deployment of SAP S/4HANA on AWS. The company wants to ensure that this new SAP S/4HANA landscape is fully supported by SAP. The company's SAP solutions architect needs to set up a new SAProuter connection directly to SAP from the company's landscape within the VPC.

Which combination of steps must the SAP solutions architect take to accomplish this goal? (Choose three.)

**A:** Launch the instance that the SAProuter software will be installed on into a private subnet of the VPC. Assign the instance an Elastic IP address.

**B:** Launch the instance that the SAProuter software will be installed on into a public subnet of the VPC. Assign the VPC an Elastic IP address.

**C:** Launch the instance that the SAProuter software will be installed on into a public subnet of the VPAssign the instance an overlay IP address.

**D:** Create a specific security group for the SAProuter instance. Configure rules to allow the required inbound and outbound access to the SAP support network. Include a rule that allows inbound traffic to TCP port 3299.

**E:** Create a specific security group for the SAProuter instance. Configure rules to allow the required inbound and outbound access to the SAP support network. Include a rule that denies inbound traffic to TCP port 3299.

**F:** Use a Secure Network Communication (SNC) internet connection.



**Answer: BDF**

**Timestamp: 2023-12-08 19:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128095-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 111 discussion

A company is running its on-premises SAP ERP Central Component (SAP ECC) production system on an Oracle database. The company needs to migrate the system to AWS and change the database to SAP HANA on AWS.

The system must be highly available. The company also needs a failover system to be available in a different AWS Region to support disaster recovery (DR). The DR solution must meet an RTO of 4 hours and an RPO of 30 minutes. The sizing estimate for the SAP HANA database on AWS is 4 TB.

Which combination of steps should the company take to meet these requirements? (Choose two.)

**A:** Deploy the production system and the DR system in two Availability Zones in the same Region.

**B:** Deploy the production system across two Availability Zones in one Region. Deploy the DR system in a third Availability Zone in the same Region.

**C:** Deploy the production system across two Availability Zones in the primary Region. Deploy the DR system in a single Availability Zone in another Region.

**D:** Create an Amazon Elastic File System (Amazon EFS) file system in the primary Region for the SAP global file system. Deploy a second EFS file system in the DR Region. Configure EFS replication between the file systems.

**E:** Set up Amazon Elastic Block Store (Amazon EBS) to store the shared file system data. Configure AWS Backup for DR.



**Answer: CD**

**Timestamp: 2023-12-08 20:10:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128096-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 112 discussion

A company is running SAP HANA as the database for all its SAP systems on AWS. The company has a production SAP landscape and a non-production SAP landscape in the same VPC. The company has deployed AWS Backint Agent for SAP HANA (AWS Backint agent) to store backups in an S3 bucket. The S3 bucket is encrypted and is configured with an S3 Lifecycle management policy that moves backup data that is older than 3 days to the S3 Glacier Flexible Retrieval storage class.

An SAP engineer needs to perform a system copy by restoring the previous week's full backup of the production SAP HANA instance to the non-production SAP HANA instance.

Which combination of steps must the SAP engineer take before the SAP engineer initiates the restoration procedure? (Choose two.)

**A:** Update the AWS Backint agent configuration file of the non-production SAP HANA instance with the details of the AWS Backint agent configuration of the production instance.

**B:** Move the database backup files from the S3 Glacier Flexible Retrieval storage class to the S3 Standard storage class.

**C:** Reset the default encryption behavior of the S3 bucket to use S3 managed encryption keys.

**D:** Update the AWS Backint agent to the most recent version.

**E:** Update the SAP HANA database to the most recent supported version.



**Answer: AB**

**Timestamp: 2023-12-08 20:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128097-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 113 discussion

A company is planning to migrate its on-premises production SAP HANA system to AWS. The company uses a SUSE Linux Enterprise High Availability Extension two-node cluster to protect the system against failure. The company wants to use the same solution to provide high availability for the landscape on AWS.

Which combination of prerequisites must the company fulfill to meet this requirement? (Choose two.)

**A:** Use instance tags to identify the instances in the cluster.

**B:** On the cluster, configure an overlay IP address that is outside the VPC CIDR range to access the active instance.

**C:** On the cluster, configure an overlay IP address that is within the VPC CIDR range to access the active instance.

**D:** On the cluster, configure an Elastic IP address that is outside the VPC CIDR range to access the active instance.

**E:** On the cluster, configure an Elastic IP address that is within the VPC CIDR range to access the active instance.



**Answer: AB**

**Timestamp: 2023-12-08 20:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128098-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 114 discussion

A company wants to deploy its SAP S/4HANA workload on AWS. The company will need to deploy additional SAP S/4HANA systems during the next year to meet the demands of planned projects. The company wants to adopt a DevOps model for deployment of additional SAP S/4HANA systems. The company’s project team needs to be able to provision new SAP S/4HANA systems with minimum user inputs.

An SAP solutions architect must design a solution that can automate most of the implementation tasks. The solution must allow project team members to implement additional SAP S/4HANA systems with minimum required authorizations.

Which solution will meet these requirements with the LEAST operational overhead?

**A:** Deploy an SAP S/4HANA system by using AWS Launch Wizard for SAP. Create an AWS Service Catalog product. Authorize the project team to use the AWS Service Catalog product for future deployments of additional SAP S/4HANA systems.

**B:** Provision an Amazon EC2 instance by using an AWS CloudFormation template. Use SAP Software Provisioning Manager to install an SAP S/4HANA system on the EC2 instance to create a base image. Create an Amazon Elastic Block Store (Amazon EBS) snapshot of the SAP S/4HANA system. Create an AWS Service Catalog product for the EC2 instance launch and the EBS snapshot restore. Authorize the project team to use AWS Service Catalog to launch additional EC2 Instances and restore EBS snapshots to new SAP S/4HANA instances.

**C:** Create a base SAP S/4HANA system on an Amazon EC2 instance by using SAP Software Provisioning Manager. Create a custom AMI from the installed SAP S/4HANA base system. Use the custom AMI for future deployments of additional SAP S/4HANA systems.

**D:** Provision an Amazon EC2 instance by using an AWS CloudFormation template. Use SAP Software Provisioning Manager to install an SAP S/4HANA system on the EC2 instance to create a base image. Create a custom AMI from the SAP S/4HANA system. Create an AWS Service Catalog product for the C2 instance launch and the custom AMI restore. Authorize the project team to use AWS Service Catalog to launch additional SAP S/4HANA instances.



**Answer: A**

**Timestamp: 2023-12-08 20:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128099-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 115 discussion

A company migrated its SAP ERP Central Component (SAP ECC) environment to an m4.large Amazon EC2 instance (Xen based) in 2016. The company changed the instance type to m5.xlarge (KVM based). Since the change, users are receiving a pop-up box that indicates that the SAP license will expire soon.

What could be the cause of this issue?

**A:** The change from the Xen-based m4.large instance type to the KVM-based m5.xlarge instance type is not allowed.

**B:** The Xen-based m4.large instance was running with a lower kernel patch level (SAP Kernel 7.49 Patch Level 401). When the change to a KVM-based instance occurred, the hardware key changed. The instance requires a new license.

**C:** The Xen-based m4.large instance was running with a higher kernel patch level (SAP Kernel 7.49 Patch Level 500). When the change to a KVM-based instance occurred, the hardware key changed. The instance requires a new license.

**D:** Whenever an instance type changes, the change requires a new license.



**Answer: B**

**Timestamp: 2023-12-09 12:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/128136-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 116 discussion

A company plans to migrate its SAP NetWeaver environment from its on-premises data center to AWS. An SAP solutions architect needs to deploy the AWS resources for an SAP S/4HANA-based system in a Multi-AZ configuration without manually identifying and provisioning individual AWS resources. The SAP solutions architect's task includes the sizing, configuration, and deployment of the SAP S/4HANA system.

What is the QUICKEST way to provision the SAP S/4HANA landscape on AWS to meet these requirements?

**A:** Use the SAP HANA Quick Start reference deployment.

**B:** Use AWS Launch Wizard for SAP.

**C:** Create AWS CloudFormation templates to automate the deployment.

**D:** Manually deploy SAP HANA on AWS.



**Answer: B**

**Timestamp: 2024-01-18 18:55:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131545-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 90 discussion

An SAP database analyst installs AWS Backint Agent for SAP HANA (AWS Backint agent) by using AWS Systems Manager. The SAP database analyst runs an initial test to perform a database backup for a 512 GB SAP HANA database. The database runs on an SAP certified Amazon EC2 instance type with General Purpose SSD (gp2) Amazon Elastic Block Store (Amazon EBS) volumes for all disk storage. The backup is running too slowly.

Which actions should the SAP database analyst take to improve the performance of AWS Backint agent? (Choose two.)

**A:** Set the parallel_data_backup_backint_channels parameter to a number greater than 1.

**B:** Select a Provisioned IOPS SSD (io2) volume as the backup target for AWS Backint agent.

**C:** Delete unnecessary older backup files from backups that SAP Backint agent performed.

**D:** Change the existing gp2-based SAP HANA data volumes to the Provisioned IOPS SSD (io2) EBS volume type.

**E:** Reinstall AWS Backint agent by using the AWS Backint installer rather than the Systems Manager document.



**Answer: AD**

**Timestamp: 2023-07-28 20:32:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116695-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 91 discussion

A company is planning to retire a data center where a few legacy SAP applications run. The applications are SAP R/3 4.6C with a Microsoft SQL Server 2005 database end are running on Windows Server 2008. The applications are outside the extended maintenance period. There is no SAP support for the applications.

The company has no plans to upgrade the applications or move the applications to a different platform. The company does not have a policy to maintain installation media for any of the applications. The company wants to migrate the applications to AWS.

How can the company migrate the applications to AWS?

**A:** Use AWS Launch Wizard for SAP to launch the applications on AWS. Migrate the applications by using backup and restore.

**B:** Perform an SAP system copy from the source to the target by using SAP Software Provisioning Manager.

**C:** Use AWS Application Migration Service to migrate the applications.

**D:** Manually install the applications on AWS. Perform a database synchronization from the source to the target.



**Answer: C**

**Timestamp: 2023-07-28 20:37:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116696-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 92 discussion

A company is running its SAP S/4HANA production system on AWS. The system is 5 TB in size and has a high performance and IOPS demand for the SAP HANA data storage. The company is using Amazon Elastic Block Store (Amazon EBS) General Purpose SSD (gp2) storage with burstable IOPS to meet this demand.

An SAP solutions architect needs to review the current storage layout and recommend a more cost-effective solution without compromising storage performance.

What should the SAP solutions architect recommend to meet these requirements?

**A:** Switch from burstable IOPS to allocated IOPS for the gp2 storage.

**B:** Replace all the gp2 storage with Provisioned IOPS SSD (io2) storage.

**C:** Replace all the gp2 storage with gp3 storage. Configure the required IOPS.

**D:** Replace all the gp2 storage with gp3 storage at baseline IOPS.



**Answer: C**

**Timestamp: 2023-08-02 05:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/117044-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 93 discussion

A company uses SAP S/4HANA as its ERP solution. The company is using AWS Backint Agent for SAP HANA (AWS Backint agent) for backups. Although the configuration is correct for AWS Backint agent, the backups are falling with the following error.

NoCredentialProviders: no valid providers in chain.

What could be the reason for this error?

**A:** AWS Systems Manager Agent is not installed on the Amazon EC2 instance.

**B:** No IAM role is attached to the Amazon EC2 instance.

**C:** AWS Backint agent binaries are owned by a non-root user.

**D:** AWS Backint agent is connecting to Amazon S3 with VPC endpoints.



**Answer: B**

**Timestamp: 2023-07-27 21:44:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116623-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 94 discussion

A company needs to migrate its SAP HANA landscape from an on-premises data center to AWS. The company's existing SAP HANA database instance is oversized. The company must resize the database instance as part of the migration.

Which combination of steps should the company take to ensure that the target Amazon EC2 instance is sized optimally for the SAP HANA database instance? (Choose two.)

**A:** Determine the peak memory utilization of the existing on-premises SAP HANA system.

**B:** Determine the average memory utilization of the existing on-premises SAP HANA system.

**C:** For the target system, select any SAP certified EC2 instance that provides more memory than the current average memory utilization.

**D:** For the target system, select the smallest SAP certified EC2 instance that provides more memory than the current peak memory utilization.

**E:** For the target system, select any current-generation EC2 memory optimized instance.



**Answer: A**

**Timestamp: 2023-07-27 21:48:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116625-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 1 discussion

A global enterprise is running SAP ERP Central Component (SAP ECC) workloads on Oracle in an on-premises environment. The enterprise plans to migrate to SAP S/4HANA on AWS.
The enterprise recently acquired two other companies. One of the acquired companies is running SAP ECC on Oracle as its ERP system. The other acquired company is running an ERP system that is not from SAP. The enterprise wants to consolidate the three ERP systems into one ERP system on SAP S/4HANA on AWS. Not all the data from the acquired companies needs to be migrated to the final ERP system. The enterprise needs to complete this migration with a solution that minimizes cost and maximizes operational efficiency.
Which solution will meet these requirements?

**A:** Perform a lift-and-shift migration of all the systems to AWS. Migrate the ERP system that is not from SAP to SAP ECC. Convert all three systems to SAP S/4HANA by using SAP Software Update Manager (SUM) Database Migration Option (DMO). Consolidate all three SAP S/4HANA systems into a final SAP S/4HANA system. Decommission the other systems.

**B:** Perform a lift-and-shift migration of all the systems to AWS. Migrate the enterprise's initial system to SAP HANA, and then perform a conversion to SAP S/4HANA. Consolidate the two systems from the acquired companies with this SAP S/4HANA system by using the Selective Data Transition approach with SAP Data Management and Landscape Transformation (DMLT).

**C:** Use SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move to re-architect the enterprise’s initial system to SAP S/4HANA and to change the platform to AWS. Consolidate the two systems from the acquired companies with this SAP S/4HANA system by using the Selective Data Transition approach with SAP Data Management and Landscape Transformation (DMLT).

**D:** Use SAP Software Update Manager (SUM) Database Migration Option (DMO) with System Move to re-architect all the systems to SAP S/4HANA and to change the platform to AWS. Consolidate all three SAP S/4HANA systems into a final SAP S/4HANA system. Decommission the other systems.



**Answer: C**

**Timestamp: 2023-01-26 18:49:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96932-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 10 discussion

A company is running an SAP on Oracle system on IBM Power architecture in an on-premises data center. The company wants to migrate the SAP system to AWS. The Oracle database is 15 TB in size. The company has set up a 100 Gbps AWS Direct Connect connection to AWS from the on-premises data center.
Which solution should the company use to migrate the SAP system MOST quickly?

**A:** Before the migration window, build a new installation of the SAP system on AWS by using SAP Software Provisioning Manager. During the migration window, export a copy of the SAP system and database by using the heterogeneous system copy process and R3load. Copy the output of the SAP system files to AWS through the Direct Connect connection. Import the SAP system to the new SAP installation on AWS. Switch over to the SAP system on AWS.

**B:** Before the migration window, build a new installation of the SAP system on AWS by using SAP Software Provisioning Manager. Back up the Oracle database by using native Oracle tools. Copy the backup of the Oracle database to AWS through the Direct Connect connection. Import the Oracle database to the SAP system on AWS. Configure Oracle Data Guard to begin replicating on-premises database log changes from the SAP system to the new AWS system. During the migration window, use Oracle to replicate any remaining changes to the Oracle database hosted on AWS. Switch over to the SAP system on AWS.

**C:** Before the migration window, build a new installation of the SAP system on AWS by using SAP Software Provisioning Manager. Create a staging Oracle database on premises to perform Cross Platform Transportable Tablespace (XTTS) conversion on the Oracle database. Take a backup of the converted staging database. Copy the converted backup to AWS through the Direct Connect connection. Import the Oracle database backup to the SAP system on AWS. Take regularly scheduled incremental backups and XTTS conversions of the staging database. Transfer these backups and conversions to the AWS target database. During the migration window, perform a final incremental Oracle backup. Convert the final Oracle backup by using XTTS. Replay the logs in the target Oracle database hosted on AWS. Switch over to the SAP system on AWS.

**D:** Before the migration window, launch an appropriately sized Amazon EC2 instance on AWS to receive the migrated SAP database. Create an AWS Server Migration Service (AWS SMS) job to take regular snapshots of the on-premises Oracle hosts. Use AWS SMS to copy the snapshot as an AMI to AWS through the Direct Connect connection. Create a new SAP on Oracle system by using the migrated AMI. During the migration window, take a final incremental SMS snapshot and copy the snapshot to AWS. Restart the SAP system by using the new up-to-date AMI. Switch over to the SAP system on AWS.



**Answer: C**

**Timestamp: 2023-01-29 16:00:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97141-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 100 discussion

A company plans to move its SAP systems from on premises to AWS to reduce infrastructure costs. The company is willing to make a 3-year commitment. However, the company wants to have maximum flexibility for the selection of Amazon EC2 instances across AWS Regions, instance families, and instance sizes.

Which purchasing option will meet these requirements at the LOWEST cost?

**A:** Spot Instances

**B:** 3-year Compute Savings Plan

**C:** 3-year EC2 Instance Savings Plan

**D:** 3-year Reserved Instances



**Answer: B**

**Timestamp: 2023-07-27 23:17:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116633-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 101 discussion

A company runs its SAP Business Suite on SAP HANA systems on AWS. The company's production SAP ERP Central Component (SAP ECC) system uses an x1e.32xlarge (memory optimized) Amazon EC2 instance and is 3.5 TB in size.

Because of expected future growth, the company needs to resize the production system to use a u-* EC2 High Memory instance. The company must resize the system as quickly as possible and must minimize downtime during the resize activities.

Which solution will meet these requirements?

**A:** Resize the instance by using the AWS Management Console or the AWS CLI.

**B:** Create an AMI of the source system Launch a new EC2 High Memory instance that is based on that AMI.

**C:** Launch a new EC2 High Memory instance. Install and configure SAP HANA on the new instance by using AWS Launch Wizard for SAP. Use SAP HANA system replication to migrate the data to the new instance.

**D:** Launch a new EC2 High Memory instance. Install and configure SAP HANA on the new instance by using AWS Launch Wizard for SAP. Use SAP HANA backup and restore to back up the source system directly to Amazon S3 and to migrate the data to the new instance.



**Answer: C**

**Timestamp: 2023-07-27 23:26:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116635-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 102 discussion

A company deploys its SAP ERP system on AWS in a highly available configuration across two Availability Zones. The cluster is configured with an overlay IP address and a Network Load Balancer (NLB) to provide access to the SAP application layer to all users. The company's analytics team has created several Operational Data Provisioning (ODP) extractor services for the SAP ERP system.

A highly available ETL system will call the ODP extractor services. The ETL system is hosted on Amazon EC2 instances that are deployed in an analytics VPC in a different AWS account. An SAP solutions architect needs to prevent the ODP extractor services from being used as an attack vector to overload the SAP ERP system.

Which solution will provide the MOST protection for the ODP extractor services?

**A:** Configure VPC peering between the SAP VPC and the analytics VPC. Use network ACL rules in the SAP VPC to allow traffic to the NLB from only authorized sources: the analytics VPC CIDR block and the SAP end users' network CIDR block.

**B:** Create a transit gateway in the SAP account. Share the transit gateway with the analytics account. Attach the SAP VPC and the analytics VPC to the transit gateway. Use network ACL rules in the SAP VPC to allow traffic to the NLB from only authorized sources: the analytics VPC CIDR block and the SAP end users' network CIDR block.

**C:** Configure VPC peering between the SAP VPC and the analytics VPUpdate the NLB security group rules to accept traffic only from authorized sources: the ETL instances CIDR block and the SAP end users' network CIDR block.

**D:** Create a VPC endpoint service configuration on the SAP VPC. Specify the NLB in the endpoint configuration. In the analytics account, create an IAM role that has permission to create a connection to the endpoint service. Attach the role to the ETL instances. While logged in to the ETL instances, programmatically create an interface endpoint to the NLB. Accept the request to activate the interface connection.



**Answer: D**

**Timestamp: 2023-07-27 23:34:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/116636-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 77 discussion

A company is planning to implement its production SAP HANA database with an XS Advanced runtime environment on AWS. The company must provision the necessary AWS resources and install the SAP HANA database within 1 day to meet an urgent business request. The company must implement a solution that minimizes operational effort.

Which combination of steps should the company take to meet these requirements? (Choose two.)

**A:** Install XS Advanced runtime by using the SAP HANA database lifecycle manager (HDBLCM).

**B:** Provision AWS resources by using the AWS Management Console. Install SAP HANA by using the SAP HANA database lifecycle manager (HDBLCM).

**C:** Use AWS Launch Wizard for SAP.

**D:** Develop and use AWS CloudFormation templates to provision the AWS resources.

**E:** Evaluate and identify the certified Amazon EC2 instances and Amazon Elastic Block Store (Amazon EBS) volume types for SAP HANA.



**Answer: AC**

**Timestamp: 2023-07-12 02:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/114910-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 78 discussion

A global company is planning to migrate its SAP S/4HANA workloads and SAP BW/4HANA workloads to AWS. The company’s database will not grow more than 3 TB for the next 3 years. The company's production SAP HANA system has been designed for high availability (HA) and disaster recovery (DR) with the following configurations:

• HA: SAP HANA system replication configured with SYNC mode and LOGREPLAY operation mode across two Availability Zones with the same size SAP HANA node
• DR: SAP HANA system replication configured with ASYNC mode and LOGREPLAY operation mode across AWS Regions with the same size SAP HANA node

All the SAP HANA nodes in the current configuration are the same size. For HA, the company wants an RPO of 0 and an RTO of 5 minutes. For DR, the company wants an RPO of 0 and an RTO of 3 hours.

How should the company design this solution to meet the RPO and RTO requirements MOST cost-effectively?

**A:** Maintain HA with SAP HANA system replication configured with SYNC mode and table preload turned on across two Availability Zones. In each Availability Zone, use the same size SAP HANA node. Decrease the size of the DR node to at least 64 GiB of memory or the row store size plus 20 GiB, whichever is higher, with ASYNC mode and table preload turned on. Increase the size of the DR node during a DR event.

**B:** Maintain HA with SAP HANA system replication configured with SYNC mode and table preload turned on across two Availability Zones. In each Availability Zone, use the same size SAP HANA node. Decrease the size of the DR node to at least 64 GiB of memory or the row store size plus 20 GiB, whichever is higher, with ASYNC mode and table preload turned off. Increase the size of the DR node during a DR event.

**C:** Maintain HA with SAP HANA system replication across two Availability Zones. Decrease the size of the HA secondary node to at least 64 GiB of memory or the row store size plus 20 GiB, whichever is higher, with SYNC mode and table preload turned on. Increase the size of the HA secondary node during an HA event. Decrease the size of the DR node to at least 64 GiB of memory or the row store size plus 20 GiB, whichever is higher, with table preload turned on. Increase the size of the DR node during a DR event.

**D:** Maintain HA with SAP HANA system replication across two Availability Zones. Decrease the size of the HA secondary node to at least 64 GiB of memory or the row store size plus 20 GiB, whichever is higher, with SYNC mode and table preload turned on. Increase the size of the HA secondary node during an HA event. Decrease the size of the DR node to at least 64 GiB of memory or the row store size plus 20 GiB, whichever is higher, with table preload turned off. Increase the size of the DR node during a DR event.



**Answer: B**

**Timestamp: 2023-07-14 19:41:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/115188-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 79 discussion

A company has implemented its ERP system on SAP S/4HANAon AWS. The system is based on Enqueue Standalone Architecture (ENSA2) and is highly available.

As part of an availability test, the company failed over its system to secondary nodes in the second Availability Zone. When the system failed over, the initial licenses were no longer valid.

What could be the reason for this behavior?

**A:** The company needs to apply SAP licenses after each failover.

**B:** The cluster configuration is not correct.

**C:** The company needs two separate sets of licenses for ASCS instances in each Availability Zone.

**D:** The company stopped and restarted the secondary node as part of the last maintenance.



**Answer: C**

**Timestamp: 2023-07-12 20:12:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/114996-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 8 discussion

A company is running an SAP ERP Central Component (SAP ECC) system on an SAP HANA database that is 10 TB in size. The company is receiving notifications about long-running database backups every day. The company uses AWS Backint Agent for SAP HANA (AWS Backint agent) on an Amazon EC2 instance to back up the database. An SAP NetWeaver administrator needs to troubleshoot the problem and propose a solution.
Which solution will help resolve this problem?

**A:** Ensure that AWS Backint agent is configured to send the backups to an Amazon S3 bucket over the internet. Ensure that the EC2 instance is configured to access the internet through a NAT gateway.

**B:** Check the UploadChannelSize parameter for AWS Backint agent. Increase this value in the aws-backint-agent-config.yaml configuration file based on the EC2 instance type and storage configurations.

**C:** Check the MaximumConcurrentFilesForRestore parameter for AWS Backint agent. Increase the parameter from 5 to 10 by using the aws-backint-agent-config.yaml configuration file.

**D:** Ensure that the backups are compressed. If necessary, configure AWS Backint agent to compress the backups and send them to an Amazon S3 bucket.



**Answer: B**

**Timestamp: 2023-01-25 05:43:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96800-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 80 discussion

A company has deployed SAP workloads on AWS. The company's SAP applications use an IBM Db2 database and an SAP HANA database. An SAP solutions architect needs to create a solution to back up the company's databases.

Which solution will meet these requirements MOST cost-effectively?

**A:** Use an Amazon Elastic Block Store (Amazon EBS) volume to store backups for the databases. Run a periodic script to move the backups to Amazon S3 and to delete the backups from the EBS volume.

**B:** Use AWS Backint Agent for SAP HANA to move the backups for the databases directly to Amazon S3.

**C:** Use an Amazon Elastic Block Store (Amazon EBS) volume to store backups for the Db2 database. Run periodic scripts to move the backups to Amazon S3 and to delete the backups from the EBS volume. For the SAP HANA database, use AWS Backint Agent for SAP HANA to move the backups directly to Amazon S3.

**D:** Use Amazon Elastic File System (Amazon EFS) to store backups for the databases.



**Answer: C**

**Timestamp: 2023-07-06 13:18:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/114247-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 59 discussion

An SAP specialist is building an SAP environment. The SAP environment contains Amazon EC2 instances that run in a private subnet in a VPC. The VPC includes a NAT gateway.
The SAP specialist is setting up IBM Db2 high availability disaster recovery for the SAP cluster. After configuration of overlay IP address routing, traffic is not routing to the database EC2 instances.
What should the SAP specialist do to resolve this issue?

**A:** Open a security group for SAP ports to allow traffic on port 443.

**B:** Create route table entries to allow traffic from the database EC2 instances to the NAT gateway.

**C:** Turn off the source/destination check for the database EC2 instances.

**D:** Create an IAM role that has permission to access network traffic. Associate the role with the database EC2 instances.



**Answer: C**

**Timestamp: 2023-02-07 23:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98380-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 6 discussion

A company’s SAP basis team is responsible for database backups in Amazon S3. The company frequently needs to restore the last 3 months of backups into the pre-production SAP system to perform tests and analyze performance. Previously, an employee accidentally deleted backup files from the S3 bucket. The SAP basis team wants to prevent accidental deletion of backup files in the future.
Which solution will meet these requirements?

**A:** Create a new resource-based policy that prevents deletion of the S3 bucket.

**B:** Enable versioning and multi-factor authentication (MFA) on the S3 bucket.

**C:** Create signed cookies for the backup files in the S3 bucket. Provide the signed cookies to authorized users only.

**D:** Apply an S3 Lifecycle policy to move the backup files immediately to S3 Glacier.



**Answer: B**

**Timestamp: 2023-01-27 13:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96970-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 60 discussion

A company uses an SAP application that runs batch jobs that are performance sensitive. The batch jobs can be restarted safely. The SAP application has six application servers. The SAP application functions reliably as long as the SAP application availability remains greater than 60%. The company wants to migrate the SAP application to AWS. The company is using a cluster with two Availability Zones.
How should the company distribute the SAP application servers to maintain system reliability?

**A:** Distribute the SAP application servers equally across three partition placement groups.

**B:** Distribute the SAP application servers equally across three Availability Zones.

**C:** Distribute the SAP application servers equally across two Availability Zones.

**D:** Create an Amazon EC2 Auto Scaling group across two Availability Zones. Set a minimum capacity value of 4.



**Answer: D**

**Timestamp: 2023-02-03 03:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97720-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 61 discussion

A company wants to migrate its SAP landscape from on premises to AWS.
What are the MINIMUM requirements that the company must meet to ensure full support of SAP on AWS? (Choose three.)

**A:** Enable detailed monitoring for Amazon CloudWatch on each instance in the landscape.

**B:** Deploy the infrastructure by using SAP Cloud Appliance Library.

**C:** Install, configure, and run the AWS Data Provider for SAP on each instance in the landscape.

**D:** Protect all production instances by using Amazon EC2 automatic recovery.

**E:** Deploy the infrastructure for the SAP landscape by using AWS Launch Wizard for SAP.

**F:** Deploy the SAP landscape on an AWS account that has either an AWS Business Support plan or an AWS Enterprise Support plan.



**Answer: ACF**

**Timestamp: 2023-02-07 23:58:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98381-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 62 discussion

A company wants to migrate its SAP S/4HANA software from on premises to AWS in a few weeks. An SAP solutions architect plans to use AWS Launch Wizard for SAP to automate the SAP deployment on AWS.
Which combination of steps must the SAP solutions architect take to use Launch Wizard to meet these requirements? (Choose two.)

**A:** Download the SAP software files from the SAP Support Portal. Upload the SAP software files to Amazon S3. Provide the S3 bucket path as an input to Launch Wizard.

**B:** Provide the SAP S-user ID and password as inputs to Launch Wizard to download the software automatically.

**C:** Format the S3 file path syntax according to the Launch Wizard deployment recommendation.

**D:** Use an AWS CloudFormation template for the automated deployment of the SAP landscape.

**E:** Provision Amazon EC2 instances. Tag the instances to install SAP S/4HANA on them.



**Answer: AC**

**Timestamp: 2023-02-08 18:50:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/98451-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 130 discussion

A company hosts its SAP applications and database applications on Amazon EC2 instances in private subnets. The EC2 instances are distributed across two Availability Zones. In each Availability Zone, the company has created a public subnet for public applications.

An SAP solutions architect needs to use AWS services to download software patches from the internet to the EC2 instances that host the SAP applications and databases. The SAP solutions architect must design a highly available solution that protects the AWS services from a single point of failure.

Which solution will meet these requirements with the LEAST maintenance effort?

**A:** Provision one NAT instance in the public subnet of each Availability Zone. In the route table for each private subnet, add an entry that points to the NAT instance.

**B:** Provision one NAT gateway in the public subnet of each Availability Zone. In the route table for each public subnet, add an entry that points to the NAT gateway.

**C:** Provision one NAT gateway in the public subnet of each Availability Zone. In the route table for each private subnet, add an entry that points to the NAT gateway.

**D:** Provision one NAT instance in the public subnet of a third Availability Zone. In the route table for each public subnet, add an entry that points to the NAT instance in the third Availability Zone.



**Answer: C**

**Timestamp: 2024-01-18 10:56:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/131478-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 14 discussion

A company is running an SAP HANA database on AWS. The company is running AWS Backint Agent for SAP HANA (AWS Backint agent) on an Amazon EC2 instance. AWS Backint agent is configured to back up to an Amazon S3 bucket. The backups are failing with an AccessDenied error in the AWS Backint agent log file.
What should an SAP basis administrator do to resolve this error?

**A:** Assign execute permissions at the operating system level for the AWS Backint agent binary and for AWS Backint agent.

**B:** Assign an IAM role to an EC2 instance. Attach a policy to the IAM role to grant access to the target S3 bucket.

**C:** Assign the correct Region ID for the S3BucketAwsRegion parameter in AWS Backint agent for the SAP HANA configuration file.

**D:** Assign the value for the EnableTagging parameter in AWS Backint agent for the SAP HANA configuration file.



**Answer: B**

**Timestamp: 2023-01-26 18:07:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96930-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 15 discussion

A company is starting a new project to implement an SAP landscape with multiple accounts that belong to multiple teams in the us-east-2 Region. These teams include procurement, finance, sales, and human resources. An SAP solutions architect has started designing this new landscape and the AWS account structures.
The company wants to use automation as much as possible. The company also wants to secure the environment, implement federated access to accounts, centralize logging, and establish cross-account security audits. In addition, the company’s management team needs to receive a top-level summary of policies that are applied to the AWS accounts.
What should the SAP solutions architect do to meet these requirements?

**A:** Use AWS CloudFormation StackSets to apply SCPs to multiple accounts in multiple Regions. Use an Amazon CloudWatch dashboard to check the applied policies in the accounts.

**B:** Use an AWS Elastic Beanstalk blue/green deployment to create IAM policies and apply them to multiple accounts together. Use an Amazon CloudWatch dashboard to check the applied policies in the accounts.

**C:** Implement guardrails by using AWS CodeDeploy and AWS CodePipeline to deploy SCPs into each account. Use the CodePipeline deployment dashboard to check the applied policies in the accounts.

**D:** Apply SCPs through AWS Control Tower. Use the AWS Control Tower integrated dashboard to check the applied policies in the accounts.



**Answer: D**

**Timestamp: 2023-02-03 22:51:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97840-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 16 discussion

A company is running its SAP workloads on premises and needs to migrate the workloads to AWS. All the workloads are running on SUSE Linux Enterprise Server and Oracle Database. The company’s landscape consists of SAP ERP Central Component (SAP ECC), SAP Business Warehouse (SAP BW), and SAP NetWeaver systems. The company has a dedicated AWS Direct Connect connection between its on-premises environment and AWS. The company needs to migrate the systems to AWS with the least possible downtime.
Which migration solution will meet these requirements?

**A:** Use SAP Software Provisioning Manager to perform an export of the systems. Copy the export to Amazon S3. Use SAP Software Provisioning Manager to perform an import of the systems to SUSE Linux Enterprise Server and Oracle Database on AWS.

**B:** Use SAP Software Provisioning Manager to perform parallel export/import of the systems to migrate the systems to SUSE Linux Enterprise Server and Oracle Database on AWS.

**C:** Use SAP Software Provisioning Manager to perform parallel export/import of the systems to migrate the systems to Oracle Enterprise Linux and Oracle Database on AWS.

**D:** Use SAP Software Provisioning Manager to perform an export of the systems. Copy the export to Amazon S3. Use SAP Software Provisioning Manager to perform an import of the systems to Oracle Enterprise Linux and Oracle Database on AWS.



**Answer: C**

**Timestamp: 2023-02-03 22:57:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97842-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 17 discussion

A company is designing a disaster recovery (DR) strategy for an SAP HANA database that runs on an Amazon EC2 instance in a single Availability Zone. The company can tolerate a long RTO and an RPO greater than zero if it means that the company can save money on its DR process.
The company has configured an Amazon CloudWatch alarm to automatically recover the EC2 instance if the instance experiences an unexpected issue. The company has set up AWS Backint Agent for SAP HANA to save the backups into Amazon S3.
What is the MOST cost-effective DR option for the company's SAP HANA database?

**A:** Set up AWS CloudFormation to automatically launch a new EC2 instance for the SAP HANA database in a second Availability Zone from backups that are stored in Amazon S3. When the SAP HANA database is operational, perform a database restore by using the standard SAP HANA restore process.

**B:** Launch a secondary EC2 instance for the SAP HANA database on a less powerful EC2 instance type in a second Availability Zone. Configure SAP HANA system replication with the preload option turned off.

**C:** Launch a secondary EC2 instance for the SAP HANA database on an equivalent EC2 instance type in a second Availability Zone. Configure SAP HANA system replication with the preload option turned on.

**D:** Set up AWS CloudFormation to automatically launch a new EC2 instance for the SAP HANA database in a second Availability Zone from backups that are stored in Amazon Elastic Block Store (Amazon EBS). When the SAP HANA database is operational, perform a database restore by using the standard SAP HANA restore process.



**Answer: A**

**Timestamp: 2023-02-03 23:01:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97844-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 18 discussion

A company is using a multi-account strategy for SAP HANA and SAP BW/4HANA instances across development, QA, and production systems in the same AWS Region. Each system is hosted in its own VPC. The company needs to establish cross-VPC communication between the SAP systems.
The company might add more SAP systems in the future. The company must create connectivity across the SAP systems and hundreds of AWS accounts. The solution must maximize scalability and reliability.
Which solution will meet these requirements?

**A:** Create an AWS Transit Gateway in a central networking account. Attach the transit gateway to the AWS accounts. Set up routing and a network ACL to establish communication.

**B:** Set up VPC peering between the accounts. Configure routing in each VPC to use the VPC peering links.

**C:** Create a transit VPC that uses the hub-and-spoke model. Set up routing to use the transit VPC for communication between the SAP systems.

**D:** Create a VPC link for each SAP system. Use the VPC links to connect the SAP systems.



**Answer: A**

**Timestamp: 2023-01-26 18:13:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96931-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 19 discussion

A company is planning to deploy a new SAP NetWeaver ABAP system on AWS with an Oracle database that runs on an Amazon EC2 instance. The EC2 instance uses a Linux-based operating system. The company needs a database storage solution that provides flexibility to adjust the IOPS regardless of the allocated storage size.
Which solution will meet these requirements MOST cost-effectively?

**A:** General Purpose SSD (gp3) Amazon Elastic Block Store (Amazon EBS) volumes

**B:** Amazon Elastic File System (Amazon EFS) Standard-Iinfrequent Access (Standard-IA) storage class

**C:** Amazon FSx for Windows File Server

**D:** Provisioned IOPS SSD (io2) Amazon Elastic Block Store (Amazon EBS) volumes



**Answer: A**

**Timestamp: 2023-01-30 06:53:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97198-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 2 discussion

A global retail company is running its SAP landscape on AWS. Recently, the company made changes to its SAP Web Dispatcher architecture. The company added an additional SAP Web Dispatcher for high availability with an Application Load Balancer (ALB) to balance the load between the two SAP Web Dispatchers.
When users try to access SAP through the ALB, the system is reachable. However, the SAP backend system is showing an error message. An investigation reveals that the issue is related to SAP session handling and distribution of requests. The company confirmed that the system was working as expected with one SAP Web Dispatcher. The company replicated the configuration of that SAP Web Dispatcher to the new SAP Web Dispatcher.
How can the company resolve the error?

**A:** Maintain persistence by using session cookies. Enable session stickiness (session affinity) on the SAP Web Dispatchers by setting the wdisp/HTTP/esid_support parameter to True.

**B:** Maintain persistence by using session cookies. Enable session stickiness (session affinity) on the ALB.

**C:** Turn on host-based routing on the ALB to route traffic between the SAP Web Dispatchers.

**D:** Turn on URL-based routing on the ALB to route traffic to the application based on URL.



**Answer: B**

**Timestamp: 2023-01-25 05:33:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/96797-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 20 discussion

A company is using SAP NetWeaver with Java on AWS. The company has updated its generation of Amazon EC2 instances to the most recent generation of EC2 instances. When the company tries to start SAP, the startup fails. The log indicates that the SAP license expired or is not valid.
What is the reason for this issue?

**A:** The instance ID changed as part of the EC2 generation change.

**B:** The instance’s hypervisor changed from Xen to Nitro.

**C:** The SAP Java Virtual Machine (SAP JVM) is not compatible with the new instance type.

**D:** An EC2 generation change is not supported for SAP Java-based systems.



**Answer: B**

**Timestamp: 2023-01-31 16:04:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97455-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

## Exam AWS Certified SAP on AWS - Specialty PAS-C01 topic 1 question 21 discussion

A company’s basis administrator is planning to deploy SAP on AWS in Linux. The basis administrator must set up the proper storage to store SAP HANA data and log volumes.
Which storage options should the basis administrator choose to meet these requirements? (Choose two.)

**A:** Amazon Elastic Block Store (Amazon EBS) Throughput Optimized HDD (st1)

**B:** Amazon Elastic Block Store (Amazon EBS) Provisioned OPS SSD (io1, io2)

**C:** Amazon S3

**D:** Amazon Elastic File System (Amazon EFS)

**E:** Amazon Elastic Block Store (Amazon EBS) General Purpose SSD (gp2, gp3)



**Answer: BE**

**Timestamp: 2023-01-28 06:30:00**

[View on ExamTopics](https://www.examtopics.com/discussions/amazon/view/97024-exam-aws-certified-sap-on-aws-specialty-pas-c01-topic-1/)

----------------------------------------

