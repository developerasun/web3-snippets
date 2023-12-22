import { EC2Client } from '@aws-sdk/client-ec2'
import {mockClient} from 'aws-sdk-client-mock'

const _instance = new EC2Client()
const instance = mockClient(_instance)
