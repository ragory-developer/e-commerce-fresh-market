const { WalletService } = require('./src/modules/wallet/service');
const { config } = require('./src/config');

async function main() {
  console.log('Order Deduction Amount:', config.orderDeductionAmount);
  if (config.orderDeductionAmount > 0) {
    console.log('Triggering manual deduction...');
    const result = await WalletService.adjustGlobalBalance(
      -config.orderDeductionAmount,
      'DEDUCTION',
      'Manual Test Deduction'
    );
    console.log('Result:', result);
  } else {
    console.log('Deduction amount is 0 or NaN');
  }
}

main().catch(console.error);
