import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'

// Step 1: Extract the package name from package.json
const packageName = JSON.parse(fs.readFileSync('./package.json', 'utf8')).name

// Step 2: Replace invalid characters for S3 bucket name (e.g., `@` -> `-`)
const bucketName = packageName.replace('@', '').replace('/', '-')
let bucketRegion = 'eu-west-3'

// Step 3: Check if the bucket exists
try {
  console.log(`Checking if bucket ${bucketName} exists...`)
  execSync(`aws s3api head-bucket --bucket ${bucketName}`, { stdio: 'inherit' })
  console.log(`Bucket ${bucketName} already exists.`)
} catch (error) {
  console.log(`Bucket does not exist. Creating the bucket: ${bucketName}`)
  console.log(error)
  // Step 4: Create the bucket if it doesn't exist
  execSync(`aws s3 mb s3://${bucketName} --region ${bucketRegion} --acl public-read`, {
    stdio: 'inherit',
  })
}

// Step 5: Create the bucket policy
const bucketPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'PublicReadGetObject',
      Effect: 'Allow',
      Principal: '*',
      Action: 's3:GetObject',
      Resource: `arn:aws:s3:::${bucketName}/*`,
    },
  ],
}

// Step 6: Ensure the /tmp directory exists
const tmpDir = 'tmp'
if (!fs.existsSync(tmpDir)) {
  console.log(`Creating directory: ${tmpDir}`)
  fs.mkdirSync(tmpDir, { recursive: true }) // Create /tmp if it doesn't exist
}

// Save the bucket policy to a file
const policyFile = path.join(tmpDir, 'bucket-policy.json')
fs.writeFileSync(policyFile, JSON.stringify(bucketPolicy, null, 2))

// Step 6: Apply the bucket policy
console.log('Applying bucket policy...')
execSync(
  `aws s3api put-bucket-policy --bucket ${bucketName} --policy file://${policyFile} --region=${bucketRegion}`,
  {
    stdio: 'inherit',
  },
)

// Step 7: Sync the dist folder to the S3 bucket
console.log('Syncing dist/ folder to S3 bucket...')
execSync(`aws s3 sync ./dist/ s3://${bucketName} --delete`, { stdio: 'inherit' })

console.log(
  `Deployment complete! Your site is live at: http://${bucketName}.s3-website-${bucketRegion}.amazonaws.com`,
)
