import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const setOTP = async (email: string, otp: string) => {
  const expirationTime = parseInt(process.env.OTP_EXPIRATION || '600')
  
  console.log('Setting OTP:', {
    email,
    otp,
    expirationTime
  });

  try {
    // Store OTP with metadata and expiration
    await redis.hset(`otp:${email}`, {
      otp: otp,  // Ensure it's a string
      createdAt: Date.now().toString()  // Explicitly convert to string
    })
    
    // Set expiration
    await redis.expire(`otp:${email}`, expirationTime)

    console.log('OTP Set Successfully for:', email);
  } catch (error) {
    console.error('OTP Setting Error:', error);
    throw error;
  }
}

export const verifyOTP = async (email: string, otp: string) => {
  console.log('Verification Attempt Details:', {
    email,
    otp,
    currentTime: Date.now()
  });

  try {
    // Retrieve OTP data
    const otpData = await redis.hgetall(`otp:${email}`)
    
    console.log('Retrieved OTP Data:', otpData);

    if (!otpData) {
      console.log('No OTP data found for email:', email);
      return false;
    }

    // Ensure OTP and createdAt are converted to strings/numbers
    const storedOTP = String(otpData.otp)
    const otpCreatedAt = Number(otpData.createdAt)
    
    // Get expiration time in milliseconds
    const expirationTime = parseInt(process.env.OTP_EXPIRATION || '600') * 1000

    console.log('Verification Comparison:', {
      storedOTP,
      inputOTP: otp,
      otpCreatedAt,
      currentTime: Date.now(),
      timeDifference: Date.now() - otpCreatedAt,
      expirationTime
    });

    // Strict comparison and expiration check
    if (
      storedOTP === otp && 
      (Date.now() - otpCreatedAt) < expirationTime
    ) {
      // Delete OTP after successful verification
      await redis.del(`otp:${email}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return false;
  }
}

export const testRedisConnection = async () => {
  try {
    await redis.ping()
    console.log('Redis connection successful')
    return true
  } catch (error) {
    console.error('Redis connection failed:', error)
    return false
  }
}

export default redis