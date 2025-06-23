import { supabase } from './supabase';

/**
 * Test Supabase connection and basic functionality
 * This function will verify that our Supabase setup is working correctly
 */
export async function testSupabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .single();
    
    if (error) {
      // If table doesn't exist yet, that's expected
      if (error.code === 'PGRST116' || error.message.includes('relation "profiles" does not exist')) {
        console.log('✅ Supabase connection successful! (profiles table not created yet - this is normal)');
        return { success: true, message: 'Connection successful, ready to create tables' };
      }
      throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Profiles table exists and is accessible');
    return { success: true, message: 'Full connection and table access verified' };
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

/**
 * Test authentication setup
 */
export async function testSupabaseAuth() {
  try {
    console.log('🔄 Testing Supabase Auth...');
    
    // Get current session (should be null for unauthenticated user)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Supabase Auth is working!');
    console.log('Current session:', session ? 'User logged in' : 'No active session (expected for new setup)');
    
    return { success: true, session };
    
  } catch (error) {
    console.error('❌ Supabase Auth test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Run all Supabase tests
 */
export async function runAllSupabaseTests() {
  console.log('🚀 Running Supabase setup tests...\n');
  
  const connectionTest = await testSupabaseConnection();
  const authTest = await testSupabaseAuth();
  
  console.log('\n📊 Test Results:');
  console.log('Connection:', connectionTest.success ? '✅ PASS' : '❌ FAIL');
  console.log('Authentication:', authTest.success ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = connectionTest.success && authTest.success;
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  return {
    connection: connectionTest,
    auth: authTest,
    allPassed
  };
} 