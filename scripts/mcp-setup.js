#!/usr/bin/env node

/**
 * MCP Server Setup Script for Tokyo Weekender
 * This script helps configure and test the MCP server connection
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MCP_CONFIG_PATH = path.join(__dirname, '..', '.mcp-config.json');
const ENV_EXAMPLE_PATH = path.join(__dirname, '..', 'env.example');

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = ['RENDER_API_TOKEN'];
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n📝 Please set these variables in your .env file or environment');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

function validateMCPConfig() {
  console.log('🔍 Validating MCP configuration...');
  
  if (!fs.existsSync(MCP_CONFIG_PATH)) {
    console.log('❌ MCP configuration file not found');
    return false;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(MCP_CONFIG_PATH, 'utf8'));
    
    if (!config.mcpServers || !config.mcpServers.render) {
      console.log('❌ Invalid MCP configuration structure');
      return false;
    }
    
    console.log('✅ MCP configuration is valid');
    return true;
  } catch (error) {
    console.log('❌ Error parsing MCP configuration:', error.message);
    return false;
  }
}

function testMCPConnection() {
  console.log('🔍 Testing MCP server connection...');
  
  // This is a placeholder for actual MCP connection testing
  // In a real implementation, you would use the MCP client library
  console.log('⚠️  MCP connection testing requires MCP client library');
  console.log('   Please install and configure the MCP client for your environment');
  
  return true;
}

function displayNextSteps() {
  console.log('\n📋 Next Steps:');
  console.log('1. Set your RENDER_API_TOKEN in your environment or .env file');
  console.log('2. Install MCP client library for your development environment');
  console.log('3. Test the connection using the MCP client');
  console.log('4. Configure your IDE/editor to use the MCP server');
  console.log('\n📚 Documentation:');
  console.log('   - Render MCP: https://render.com/docs/mcp');
  console.log('   - MCP Protocol: https://modelcontextprotocol.io/');
}

function main() {
  console.log('🚀 Tokyo Weekender MCP Setup\n');
  
  const envCheck = checkEnvironmentVariables();
  const configCheck = validateMCPConfig();
  const connectionTest = testMCPConnection();
  
  if (envCheck && configCheck && connectionTest) {
    console.log('\n✅ MCP setup completed successfully!');
  } else {
    console.log('\n❌ MCP setup has issues that need to be resolved');
  }
  
  displayNextSteps();
}

// Run the setup
main();
