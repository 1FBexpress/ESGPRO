#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script helps verify which version of the ESG Pro application is deployed
 * to a given URL. Use this to confirm that the correct pricing (£2,400) is live.
 * 
 * Usage:
 *   node verify-deployment.js <url>
 *   
 * Examples:
 *   node verify-deployment.js https://esgpro-pricing.abacusai.app
 *   node verify-deployment.js https://your-project.vercel.app
 */

const https = require('https');

const url = process.argv[2];

if (!url) {
  console.log('\n❌ Error: Please provide a URL to check\n');
  console.log('Usage: node verify-deployment.js <url>\n');
  console.log('Examples:');
  console.log('  node verify-deployment.js https://esgpro-pricing.abacusai.app');
  console.log('  node verify-deployment.js https://your-project.vercel.app\n');
  process.exit(1);
}

console.log('\n🔍 Checking deployment at:', url, '\n');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📊 Analysis Results:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Check for version indicator
    const versionMatch = data.match(/data-version="([^"]+)"/);
    const timestampMatch = data.match(/data-deploy-timestamp="([^"]+)"/);
    const deploymentIdMatch = data.match(/data-deployment-id="([^"]+)"/);
    
    // Check for pricing
    const pricing2400 = data.includes('2,400') || data.includes('2400');
    const pricing6210 = data.includes('6,210') || data.includes('6210');
    
    // Check for architecture
    const hasNextData = data.includes('__NEXT_DATA__');
    const hasAppRouter = data.includes('/_next/static/chunks/app/');
    const hasPagesRouter = data.includes('pages/');
    
    // Check for intro bundle
    const hasIntroBundle = data.includes('Introductory Bundle') || data.includes('introductory bundle');
    const hasFullCert = data.includes('Full Certification') || data.includes('full certification');

    // Version Information
    if (versionMatch) {
      console.log('✅ Version Found:', versionMatch[1]);
      if (versionMatch[1].includes('1.1.0-definitive-fix')) {
        console.log('   → This is the CORRECT version with the fix!\n');
      } else if (versionMatch[1].includes('1.0.0')) {
        console.log('   → This is an older version\n');
      }
    } else {
      console.log('⚠️  No version attribute found\n');
    }

    if (timestampMatch) {
      console.log('📅 Deploy Timestamp:', timestampMatch[1]);
    }

    if (deploymentIdMatch) {
      console.log('🆔 Deployment ID:', deploymentIdMatch[1], '\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Pricing Check
    console.log('💰 Pricing Check:\n');
    
    if (pricing2400 && hasIntroBundle) {
      console.log('   ✅ Shows £2,400 pricing (CORRECT)');
      console.log('   ✅ Shows "Introductory Bundle" (CORRECT)\n');
    } else if (pricing6210) {
      console.log('   ❌ Shows £6,210 pricing (WRONG)');
      console.log('   ❌ This is the OLD full certification pricing\n');
    } else {
      console.log('   ⚠️  Could not detect pricing information\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Architecture Check
    console.log('🏗️  Architecture:\n');
    
    if (hasAppRouter && !hasPagesRouter) {
      console.log('   ❌ Next.js App Router detected');
      console.log('   → This is NOT the ESGPRO repository (uses Pages Router)');
      console.log('   → Domain is pointing to a DIFFERENT project!\n');
    } else if (hasPagesRouter || !hasAppRouter) {
      console.log('   ✅ Next.js Pages Router detected (or static export)');
      console.log('   → This matches the ESGPRO repository architecture\n');
    } else {
      console.log('   ⚠️  Could not determine architecture\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Final Verdict
    console.log('🎯 VERDICT:\n');
    
    const isCorrectVersion = versionMatch && versionMatch[1].includes('1.1.0-definitive-fix');
    const hasCorrectPricing = pricing2400 && hasIntroBundle;
    const isAppRouter = hasAppRouter && !hasPagesRouter;

    if (isCorrectVersion && hasCorrectPricing) {
      console.log('   ✅ ✅ ✅ PERFECT! This deployment is CORRECT!\n');
      console.log('   The domain is showing:');
      console.log('   • Correct version (1.1.0-definitive-fix)');
      console.log('   • Correct pricing (£2,400)');
      console.log('   • Correct bundle (Introductory)\n');
    } else if (isAppRouter || pricing6210) {
      console.log('   ❌ ❌ ❌ WRONG DEPLOYMENT!\n');
      console.log('   This domain is pointing to the WRONG project.');
      console.log('   It shows:');
      if (pricing6210) console.log('   • Old pricing (£6,210) ❌');
      if (isAppRouter) console.log('   • Wrong architecture (App Router) ❌');
      console.log('\n   📖 See DEPLOYMENT_ISSUE_RESOLUTION.md for the fix\n');
    } else {
      console.log('   ⚠️  Unable to fully verify deployment\n');
      console.log('   Please check manually:\n');
      console.log('   1. Visit', url);
      console.log('   2. Look for "B Corp & EcoVadis Certification" section');
      console.log('   3. Verify pricing shows £2,400');
      console.log('   4. Verify label shows "Introductory Bundle"\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  });
}).on('error', (err) => {
  console.error('\n❌ Error fetching URL:', err.message, '\n');
  process.exit(1);
});
